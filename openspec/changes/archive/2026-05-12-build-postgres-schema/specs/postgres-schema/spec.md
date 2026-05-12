## ADDED Requirements

### Requirement: PostgreSQL database schema
The system SHALL provide a PostgreSQL database with the following tables and columns:
- `users` (id PK, email UNIQUE, name, created_at, updated_at)
- `chats` (id PK, user_id FK→users.id, title, created_at)
- `messages` (id PK, chat_id FK→chats.id, user_id FK→users.id, content TEXT, metadata JSONB, created_at)
- `generated_test_cases` (id PK, chat_id FK→chats.id, payload JSONB, created_at)
- `uploaded_files` (id PK, user_id FK→users.id, filename TEXT, path TEXT, size BIGINT, uploaded_at)
- `export_history` (id PK, user_id FK→users.id, export_type TEXT, export_path TEXT, created_at)

All tables SHALL include appropriate primary keys, foreign keys, and indexes on foreign key columns and `created_at` for efficient queries. The `metadata` and `payload` columns SHALL be of type JSONB to allow flexible data structures.

#### Scenario: Schema creation on migration
- **WHEN** the migration script is executed
- **THEN** PostgreSQL contains all tables with the defined columns, constraints, and indexes.
