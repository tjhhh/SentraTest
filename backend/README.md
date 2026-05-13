# SentraTest Backend

Express.js + PostgreSQL backend for the SentraTest AI-powered test case generation platform.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Docker & Docker Compose | any recent |

---

## Quick Start

### 1. Start PostgreSQL (Docker)

```bash
# from the repo root
docker-compose up -d
```

This starts a PostgreSQL 15 container on **localhost:5432** with:
- Database: `sentra`
- User / Password: `postgres` / `postgres`

Data is persisted in the `postgres-data` Docker volume.

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env if your PostgreSQL credentials differ
```

| Variable | Default |
|----------|---------|
| `PGHOST` | `localhost` |
| `PGPORT` | `5432` |
| `PGUSER` | `postgres` |
| `PGPASSWORD` | `postgres` |
| `PGDATABASE` | `sentra` |
| `PORT` | `4000` |

### 3. Install dependencies

```bash
npm install
```

### 4. Apply database migrations

```bash
npm run db:migrate
```

This runs all SQL files under `migrations/` in version order. Migrations are **idempotent** (`CREATE TABLE IF NOT EXISTS`).

### 5. Start the dev server

```bash
npm run dev
```

Server starts at **http://localhost:4000**.

Health check:

```
GET /health  →  { "status": "ok" }
```

---

## API Endpoints

Full spec available at `docs/openapi.yaml`. Summary:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/users` | Create user |
| `GET` | `/api/users/:id` | Get user by ID |
| `PATCH` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |
| `POST` | `/api/chats` | Create chat (optionally with first message) |
| `GET` | `/api/chats` | List chats for user |
| `DELETE` | `/api/chats/:id` | Delete chat + messages |
| `POST` | `/api/chats/:chatId/messages` | Add message |
| `GET` | `/api/chats/:chatId/messages` | List messages (paginated) |
| `POST` | `/api/test-cases` | Store generated test case |
| `GET` | `/api/test-cases` | List test cases (paginated) |
| `GET` | `/api/test-cases/search` | Full-text search test cases |
| `POST` | `/api/files` | Record uploaded file metadata |
| `GET` | `/api/files` | List uploaded files |
| `DELETE` | `/api/files/:id` | Delete file record |
| `POST` | `/api/exports` | Log export event |
| `GET` | `/api/exports` | List export history |

---

## Database Schema

```
users
  id (UUID PK), email (UNIQUE), username, password_hash, created_at, updated_at

chats
  id (UUID PK), user_id (FK→users), title, created_at, updated_at

messages
  id (UUID PK), chat_id (FK→chats), user_id (FK→users), role, content, created_at

generated_test_cases
  id (UUID PK), user_id (FK→users), input (TEXT), output (JSONB),
  method, type, created_at

uploaded_files
  id (UUID PK), user_id (FK→users), filename, path, type, size, uploaded_at

export_history
  id (UUID PK), user_id (FK→users), format, test_case_count, file_path, created_at
```

Key indexes: `users(email)`, `chats(user_id)`, `messages(chat_id, created_at)`, `generated_test_cases(user_id, created_at)`.

---

## Running Tests

Tests require a running PostgreSQL instance with migrations applied.

```bash
docker-compose up -d
npm run db:migrate
npm test
```

| Test file | Type | Coverage |
|-----------|------|----------|
| `tests/db.test.js` | Unit | All `src/data/db.js` helpers |
| `tests/api.test.js` | Integration | All REST endpoints via supertest |

---

## Project Structure

```
backend/
├── docs/
│   └── openapi.yaml         # OpenAPI 3.0 spec
├── migrations/
│   └── 001_create_schema.sql
├── scripts/
│   └── db-migrate.js        # Migration CLI
├── src/
│   ├── data/
│   │   └── db.js            # pg.Pool + repository helpers
│   ├── middleware/
│   │   └── errorHandler.js  # DatabaseError + Express handlers
│   ├── routes/
│   │   ├── users.js
│   │   ├── chats.js
│   │   ├── testCases.js
│   │   ├── files.js
│   │   └── exports.js
│   └── index.js             # Express app entry
├── tests/
│   ├── db.test.js
│   └── api.test.js
├── .env.example
└── package.json
```
