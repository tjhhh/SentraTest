## 1. Docker & PostgreSQL Setup

- [x] 1.1 Validate `docker-compose.yaml` — ensure PostgreSQL 15 on port 5435 with health check, named volume, and correct environment variables
- [x] 1.2 Verify `.env` and `.env.example` contain all required PG connection variables (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
- [x] 1.3 Test `docker compose up -d` starts PostgreSQL and health check passes

## 2. Migration System Enhancement

- [x] 2.1 Update `scripts/db-migrate.js` to create a `_migrations` tracking table on first run
- [x] 2.2 Modify migration runner to skip already-applied migrations by checking `_migrations` table
- [x] 2.3 Record each successfully applied migration in `_migrations` with filename and applied timestamp

## 3. Database Schema — Migration SQL

- [x] 3.1 Update `migrations/001_create_schema.sql` to add missing `chats(user_id, updated_at)` composite index
- [x] 3.2 Add GIN full-text search index on `generated_test_cases` for `to_tsvector('english', input || ' ' || output::text)`
- [x] 3.3 Verify all six tables have correct column types, constraints (UNIQUE, NOT NULL, FK CASCADE), and defaults

## 4. Connection Pooling & Retry Logic

- [x] 4.1 Add retry wrapper with exponential backoff (3 attempts, 1s/2s/4s) for pool connection acquisition in `repository.js`
- [x] 4.2 Verify pool configuration: max 20 connections, idleTimeoutMillis 30000, connectionTimeoutMillis 5000
- [x] 4.3 Ensure graceful shutdown drains pool on SIGINT/SIGTERM

## 5. Verification & Testing

- [x] 5.1 Run `docker compose up -d` and `npm run db:migrate` end-to-end to verify schema creation
- [x] 5.2 Verify all indexes exist by querying `pg_indexes` after migration
- [x] 5.3 Run existing integration tests (`npm test`) to confirm repository functions work against the updated schema
