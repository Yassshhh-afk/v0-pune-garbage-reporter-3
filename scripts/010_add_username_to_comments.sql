-- Add username column to comments table for display purposes
ALTER TABLE comments ADD COLUMN IF NOT EXISTS username VARCHAR(50);

-- Add a function to automatically fetch username when fetching comments
-- This will help display usernames without needing joins
