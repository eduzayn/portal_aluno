const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verifySupabaseProduction() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found in environment variables')
    return false
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('Testing Supabase connection...')
    
    // Try to fetch a single row from a public table
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connection successful!')
    console.log('Data:', data)
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

verifySupabaseProduction()
  .then(success => {
    if (!success) {
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('Verification script error:', error)
    process.exit(1)
  })
