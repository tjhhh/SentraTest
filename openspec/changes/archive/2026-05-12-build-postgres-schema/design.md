## Context

The current application stores data in memory or flat files, which limits persistence, query capabilities, and concurrent access. To support features such as chat history, generated test cases, file uploads, and export audit logs, a relational database is required. PostgreSQL is chosen for its robustness, advanced features (e.g., JSONB), and strong ecosystem.

## Goals / Non-Goals

**Goals:**
- Provide a reliable, Docker‑based PostgreSQL instance for local development and CI.
- Define a relational schema covering users, chats, messages, generated test cases, uploaded files, and export history.
- Ensure data integrity via primary keys, foreign keys, and appropriate indexes.
- Expose JSONB columns where flexible structures are needed (e.g., message metadata).
- Provide migration scripts to create and evolve the schema.

**Non-Goals:**
- Production‑grade HA PostgreSQL clustering (out of scope for this change).
- Migration of any existing legacy data (no prior DB).

## Decisions

- **Database Engine:** PostgreSQL 15 (latest stable) running in a Docker container. Chosen for its reliability, native JSONB support, and wide community.
- **ORM / Query Layer:** Direct `pg` driver instead of an ORM to keep the dependency surface minimal and give precise control over SQL migrations.
- **Migration Tool:** Simple SQL script files executed via a custom Node.js CLI (`npm run db:migrate`). This avoids adding a full‑featured migration framework for now.
- **Schema Design:** One table per domain entity with explicit foreign‑key relationships. Indexes on frequently queried columns (e.g., `user_id`, `chat_id`, `created_at`).
- **JSONB Usage:** `messages.metadata` for extensible message attributes; `generated_test_cases.payload` for arbitrary test case data.
- **Docker Setup:** Add a `docker-compose.yml` service named `postgres` exposing port `5432` and persisting data in a `postgres-data` volume.

## Risks / Trade-offs

- **Risk:** Direct `pg` queries can lead to SQL injection if not careful. *Mitigation:* Use parameterised queries exclusively.
- **Risk:** Migration scripts are manual; missing a step could leave the DB inconsistent. *Mitigation:* Keep migrations idempotent and version‑controlled; run them on startup in a safe mode.
- **Trade‑off:** Bypassing an ORM reduces abstraction overhead but increases boilerplate code for CRUD operations.
- **Risk:** Docker‑only PostgreSQL may differ from production environments. *Mitigation:* Mirror production configuration (same version, extensions) in Docker.
