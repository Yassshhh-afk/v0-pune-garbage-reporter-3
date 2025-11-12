-- Create user_profiles table to store username and user metadata
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (for displaying usernames in comments)
CREATE POLICY "user_profiles_select_all" ON user_profiles FOR SELECT USING (true);

-- Allow users to create their own profile during signup
CREATE POLICY "user_profiles_insert_own" ON user_profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (id = auth.uid());
