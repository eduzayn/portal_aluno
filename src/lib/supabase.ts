import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODYzMjIsImV4cCI6MjA1NzE2MjMyMn0.WGkiWL6VEazfIBHHz8LguEr8pRVy5XlbZT0iQ2rdfHU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
