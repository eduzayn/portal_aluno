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

-- Create students table for student-specific data
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    enrollment_number TEXT UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy for students to view their own data
CREATE POLICY "Students can view their own data" 
ON students FOR SELECT 
USING (user_id = auth.uid());

-- Policy for students to update their own data
CREATE POLICY "Students can update their own data" 
ON students FOR UPDATE
USING (user_id = auth.uid());

-- Policy for admins to manage all student data
CREATE POLICY "Admins can manage all student data" 
ON students FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles for authentication and user management';
COMMENT ON TABLE students IS 'Student-specific data for the Portal do Aluno';
