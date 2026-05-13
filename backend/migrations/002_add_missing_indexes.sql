-- Add missing composite index on chats(user_id, updated_at)
-- Replaces the previous idx_chats_user which was only on user_id
DROP INDEX IF EXISTS idx_chats_user;
CREATE INDEX IF NOT EXISTS idx_chats_user_updated ON chats(user_id, updated_at);

-- Add GIN full-text search index on generated_test_cases
CREATE INDEX IF NOT EXISTS idx_generated_test_cases_fts
  ON generated_test_cases
  USING GIN (to_tsvector('english', input || ' ' || output::text));
