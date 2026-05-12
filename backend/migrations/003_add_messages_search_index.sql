-- GIN full-text search index on messages content for chat history search
CREATE INDEX IF NOT EXISTS idx_messages_content_fts
  ON messages
  USING GIN (to_tsvector('english', content));
