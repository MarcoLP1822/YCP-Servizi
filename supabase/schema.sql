-- supabase/schema.sql

-- Enable extension for generating UUIDs using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE IF NOT EXISTS Users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Files Table
-- ========================================

-- Create an ENUM type for processing status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'processing_status') THEN
        CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'complete', 'error');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS Files (
  file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  processing_status processing_status NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);

-- ========================================
-- AIOutputs Table
-- ========================================
CREATE TABLE IF NOT EXISTS AIOutputs (
  output_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL,
  blurb TEXT,
  description TEXT,
  keywords TEXT,
  categories JSONB,
  foreword TEXT,
  analysis TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_file
    FOREIGN KEY(file_id)
    REFERENCES Files(file_id)
    ON DELETE CASCADE
);

-- ========================================
-- SessionHistory Table
-- ========================================
CREATE TABLE IF NOT EXISTS SessionHistory (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_id UUID NOT NULL,
  actions JSONB,
  session_date TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_session_user
    FOREIGN KEY(user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_session_file
    FOREIGN KEY(file_id)
    REFERENCES Files(file_id)
    ON DELETE CASCADE
);

-- ========================================
-- Logs Table
-- ========================================
CREATE TABLE IF NOT EXISTS Logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_log_user
    FOREIGN KEY(user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);

-- ========================================
-- Catalog Table
-- ========================================
CREATE TABLE IF NOT EXISTS Catalog (
  catalog_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_data JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Indexes for Performance Optimization
-- ========================================

-- Index on Files.upload_date for faster queries by upload date
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON Files(upload_date);

-- Index on Files.user_id for queries filtering by user
CREATE INDEX IF NOT EXISTS idx_files_user_id ON Files(user_id);

-- Index on SessionHistory.user_id for faster session lookups
CREATE INDEX IF NOT EXISTS idx_session_user_id ON SessionHistory(user_id);

-- Index on SessionHistory.file_id
CREATE INDEX IF NOT EXISTS idx_session_file_id ON SessionHistory(file_id);

-- Index on Logs.user_id for faster log queries
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON Logs(user_id);
