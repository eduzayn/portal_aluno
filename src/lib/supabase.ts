import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables. Using mock data instead.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
