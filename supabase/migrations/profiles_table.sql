-- Create profiles table for user authentication
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role VARCHAR(50) DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own profile
CREATE POLICY "Users can manage their own profile" 
ON profiles FOR ALL 
USING (auth.uid() = id);

-- Policy for admins to manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles for authentication and user management';
