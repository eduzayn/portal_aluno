import { supabase } from './supabase'

/**
 * Verifies the Supabase connection by making a simple query
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export async function verifySupabaseConnection(): Promise<boolean> {
  try {
    // Try to fetch a single row from a public table
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}
