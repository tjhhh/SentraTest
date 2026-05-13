## Context

SentraTest is a test-case generation platform that uses AI to produce test cases from feature descriptions. The backend is a Node.js/Express application (CommonJS) using the `pg` driver for PostgreSQL. A Docker Compose setup (`docker-compose.yaml`) already provisions PostgreSQL 15 on port 5435. An initial migration (`001_create_schema.sql`) creates six tables, and `repository.js` provides CRUD functions wrapping parameterized queries.

The current implementation is functional but needs hardening:
- The migration runner doesn't track which migrations have been applied (re-runs all files every time).
- Connection pool retry logic for transient connection failures is missing.
- Full-text search indexes are not pre-built (search relies on runtime `to_tsvector` calls on every query).
- The `chats(user_id, updated_at)` composite index specified in the spec is missing.

## Goals / Non-Goals

**Goals:**
- Provide a reliable, Docker-based PostgreSQL 15 development environment that starts with `docker compose up` and self-initializes the database.
- Create and maintain all six domain schemas (`users`, `generated_test_cases`, `chats`, `messages`, `uploaded_files`, `export_history`) with correct types, constraints, and foreign keys.
- Configure connection pooling (max 20 connections, idle timeout 30s, connection timeout 5s) with automatic retry on transient failures.
- Add performance indexes including a GIN index for full-text search on `generated_test_cases`.
- Implement a migration tracker that records applied migrations to avoid re-execution.

**Non-Goals:**
- Production deployment configuration (load balancing, read replicas, SSL certificates).
- ORM adoption — we continue using raw SQL via `pg` for control and performance.
- Automated backup/recovery scheduling (documented but not implemented in this change).
- Application-level caching (Redis, in-memory).

## Decisions

### 1. Raw `pg` driver over ORM (Prisma/Knex/Drizzle)
**Decision**: Continue using `pg` with parameterized SQL queries.
**Rationale**: The project already uses `pg` consistently. Raw SQL gives full control over PostgreSQL-specific features (JSONB operators, `to_tsvector`, `gen_random_uuid()`). Adding an ORM would introduce migration complexity and a learning curve with minimal benefit for this project's scale.
**Alternatives considered**: Prisma (too heavy, schema duplication), Knex (query builder adds abstraction without enough value), Drizzle (TypeScript-first, project is CommonJS JS).

### 2. Plain SQL migrations with tracking table
**Decision**: Use ordered `.sql` files in `backend/migrations/` with a `_migrations` tracking table.
**Rationale**: Simple, transparent, and version-controllable. The migration runner reads files in alphabetical order, checks the `_migrations` table, and only applies new ones.
**Alternatives considered**: Prisma Migrate (requires Prisma adoption), `node-pg-migrate` (extra dependency for simple needs).

### 3. Connection pool with retry wrapper
**Decision**: Wrap `pool.connect()` with exponential backoff retry (3 attempts, 1s → 2s → 4s).
**Rationale**: Docker containers may start the app before PostgreSQL is fully ready. The health check in `docker-compose.yaml` helps, but retry logic provides defense-in-depth.

### 4. GIN index for full-text search
**Decision**: Create a GIN index on `to_tsvector('english', input || ' ' || output::text)` for the `generated_test_cases` table.
**Rationale**: Without a pre-built index, every search query computes `to_tsvector` at runtime on all rows. A GIN index makes `@@` operator lookups near-instant.

### 5. Docker Compose as the sole database provisioning method
**Decision**: PostgreSQL runs exclusively in Docker for development.
**Rationale**: Ensures consistent environment across developer machines. Port 5435 avoids conflicts with locally-installed PostgreSQL.

## Risks / Trade-offs

- **[Risk] Migration tracking table doesn't exist yet** → First migration run creates it; idempotent `CREATE TABLE IF NOT EXISTS`.
- **[Risk] GIN index adds write overhead** → Acceptable trade-off since test case generation is infrequent compared to reads.
- **[Risk] No rollback support in migration runner** → Mitigated by using `IF NOT EXISTS` / `IF EXISTS` in DDL; manual rollback possible via SQL scripts. Full rollback tooling is a future enhancement.
- **[Risk] Docker Desktop required for development** → Documented in README; all team members already use Docker.
- **[Trade-off] Raw SQL means no schema type safety** → Accepted; integration tests validate query correctness.
