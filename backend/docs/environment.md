# Environment Stages

## Development
- Use `.env` from `.env.example`
- Usually points to local Postgres and optional Gemini key
- For Docker Compose, use service hostname `postgres` inside `DATABASE_URL`

## Test
- Use `.env.test` and isolated test database
- Disable external AI call by keeping `GEMINI_API_KEY` empty

## Production
- Inject env vars via secret manager/Kubernetes Secret
- Enforce strong JWT secrets and strict CORS origins

## Required Variables
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## Optional Variables
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

## Docker Compose Example
- Backend host machine access: `http://localhost:4000`
- Database host machine access: `postgresql://postgres:postgres@localhost:5432/sentra_test?schema=public`
- Backend container database access: `postgresql://postgres:postgres@postgres:5432/sentra_test?schema=public`
