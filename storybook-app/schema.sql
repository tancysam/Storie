-- Storybook Generator Database Schema
-- Run this SQL in your InsForge dashboard or via the run-raw-sql MCP tool

-- Create storybooks table
CREATE TABLE IF NOT EXISTS storybooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  child_name TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  visual_style TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generating',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_storybooks_user_id ON storybooks(user_id);

-- Enable Row Level Security
ALTER TABLE storybooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for storybooks (auth removed — allow all access)
DROP POLICY IF EXISTS "Users can view own storybooks" ON storybooks;
DROP POLICY IF EXISTS "Users can create own storybooks" ON storybooks;
DROP POLICY IF EXISTS "Users can update own storybooks" ON storybooks;
DROP POLICY IF EXISTS "Users can delete own storybooks" ON storybooks;
DROP POLICY IF EXISTS "Anyone can view published storybooks" ON storybooks;
DROP POLICY IF EXISTS "Allow all select on storybooks" ON storybooks;
DROP POLICY IF EXISTS "Allow all insert on storybooks" ON storybooks;
DROP POLICY IF EXISTS "Allow all update on storybooks" ON storybooks;
DROP POLICY IF EXISTS "Allow all delete on storybooks" ON storybooks;

CREATE POLICY "Allow all select on storybooks" ON storybooks FOR SELECT USING (true);
CREATE POLICY "Allow all insert on storybooks" ON storybooks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on storybooks" ON storybooks FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on storybooks" ON storybooks FOR DELETE USING (true);

-- Create story_pages table
CREATE TABLE IF NOT EXISTS story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storybook_id UUID NOT NULL REFERENCES storybooks(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  act_title TEXT NOT NULL,
  text_content TEXT NOT NULL,
  image_url TEXT,
  image_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for story_pages
CREATE INDEX IF NOT EXISTS idx_story_pages_storybook_id ON story_pages(storybook_id);
CREATE INDEX IF NOT EXISTS idx_story_pages_composite ON story_pages(storybook_id, page_number);

-- Enable Row Level Security
ALTER TABLE story_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for story_pages (auth removed — allow all access)
DROP POLICY IF EXISTS "Users can view own story pages" ON story_pages;
DROP POLICY IF EXISTS "Users can insert own story pages" ON story_pages;
DROP POLICY IF EXISTS "Users can update own story pages" ON story_pages;
DROP POLICY IF EXISTS "Users can delete own story pages" ON story_pages;
DROP POLICY IF EXISTS "Anyone can view published story pages" ON story_pages;
DROP POLICY IF EXISTS "Allow all select on story_pages" ON story_pages;
DROP POLICY IF EXISTS "Allow all insert on story_pages" ON story_pages;
DROP POLICY IF EXISTS "Allow all update on story_pages" ON story_pages;
DROP POLICY IF EXISTS "Allow all delete on story_pages" ON story_pages;

CREATE POLICY "Allow all select on story_pages" ON story_pages FOR SELECT USING (true);
CREATE POLICY "Allow all insert on story_pages" ON story_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on story_pages" ON story_pages FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on story_pages" ON story_pages FOR DELETE USING (true);
