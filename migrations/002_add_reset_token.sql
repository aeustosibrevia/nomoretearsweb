ALTER TABLE "user"
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expires BIGINT,
ADD COLUMN google_id VARCHAR(255) UNIQUE;