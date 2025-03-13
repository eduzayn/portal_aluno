const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test simple query to check connection
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('students').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Query result:', data);
    }
    
    // Test if we can execute SQL directly via RPC
    console.log('\nTesting exec_sql RPC function...');
    const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', {
      sql: 'SELECT current_database(), current_user'
    });
    
    if (sqlError) {
      console.error('Error executing SQL via RPC:', sqlError);
    } else {
      console.log('SQL execution via RPC successful!');
      console.log('Result:', sqlData);
    }
    
    // List available tables
    console.log('\nListing available tables...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Available tables:', tablesData);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
