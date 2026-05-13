## 1. Setup

- [x] 1.1 Create repository module directory `src/data/` and file `repository.js`.
- [x] 1.2 Add `pg` (and its built‑in pool) as a dependency in `package.json`.
- [x] 1.3 Extend `.env.example` with PostgreSQL connection variables: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
- [x] 1.4 Load environment variables early in the app (e.g., `require('dotenv').config();`).

## 2. Connection Pool

- [x] 2.1 Initialise a `pg.Pool` using the env vars, set `max: 20` connections, and export the pool instance.
- [x] 2.2 Ensure the pool is gracefully shut down on process exit.

## 3. Repository Functions – Users

- [x] 3.1 Implement `createUser({email, username, passwordHash})` with a parameterised `INSERT` returning the new `id`.
- [x] 3.2 Implement `getUserById(userId)` returning user fields (excluding `password_hash`).
- [x] 3.3 Implement `updateUser(userId, {email?, username?, passwordHash?})` using `UPDATE` with only provided columns.
- [x] 3.4 Implement `deleteUser(userId)` with a cascading delete if required.

## 4. Repository Functions – Chats & Messages

- [x] 4.1 Implement `createChat(userId, title)` inserting into `chats` and returning `chatId`.
- [x] 4.2 Implement `createChatWithMessage(userId, title, messageContent)` that wraps chat creation and initial message insertion inside a transaction.
- [x] 4.3 Implement `addMessage(chatId, userId, role, content)` inserting into `messages`.
- [x] 4.4 Implement `listMessages(chatId, limit = 20, offset = 0)` with pagination, ordered by `created_at`.

## 5. Repository Functions – Test Cases

- [x] 5.1 Implement `createTestCase({userId, input, output, method, type})` inserting into `generated_test_cases` (JSONB `output`).
- [x] 5.2 Implement `listTestCases(userId, limit = 20, offset = 0)` with pagination.
- [x] 5.3 Implement `searchTestCases(userId, keyword, limit = 20, offset = 0)` using PostgreSQL full‑text search (`to_tsvector` + `plainto_tsquery`).

## 6. Repository Functions – Uploaded Files

- [x] 6.1 Implement `saveFileMetadata({userId, filename, path, type, size})` inserting into `uploaded_files`.
- [x] 6.2 Implement `listUploadedFiles(userId, limit = 20, offset = 0)` with pagination.
- [x] 6.3 Implement `deleteUploadedFile(fileId)` that removes the record and optionally triggers storage cleanup.

## 7. Repository Functions – Export History

- [x] 7.1 Implement `logExport({userId, format, testCaseCount, filePath})` inserting into `export_history`.
- [x] 7.2 Implement `listExportHistory(userId, limit = 20, offset = 0)` with pagination.

## 8. Centralised Error Handling

- [x] 8.1 Create a `DatabaseError` class that captures PostgreSQL error `code`, `detail`, and `constraint`.
- [x] 8.2 Wrap all repository calls to throw `DatabaseError` on failure.
- [x] 8.3 Add Express middleware that maps known error codes (e.g., `23505` → 409 Conflict) to HTTP responses and logs the error stack.

## 9. Migration & CLI

- [x] 9.1 Write migration script `migrations/001_create_schema.sql` (already defined in the schema change) if not present.
- [x] 9.2 Add a CLI script `scripts/db-migrate.js` that runs the migration SQL against the pool.
- [x] 9.3 Add npm script `db:migrate` to invoke the CLI.

## 10. Testing

- [x] 10.1 Set up `testcontainers` PostgreSQL container for integration tests.
- [x] 10.2 Write unit tests for each repository function covering success, validation, and error scenarios.
- [x] 10.3 Ensure tests run in CI pipeline.
