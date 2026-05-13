ALTER TABLE chats
ADD COLUMN IF NOT EXISTS context JSONB;

-- Ensure chat title and stored context can be searched efficiently
CREATE INDEX IF NOT EXISTS idx_chats_title_context_fts
  ON chats USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(context::text, '')));
