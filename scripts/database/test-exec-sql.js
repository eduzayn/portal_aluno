const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testExecSql() {
  try {
    // Test listing tables using exec_sql
    console.log('Testing exec_sql with a query to list tables...');
    const { data: tablesData, error: tablesError } = await supabase.rpc('exec_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    });
    
    if (tablesError) {
      console.error('Error executing SQL via RPC:', tablesError);
    } else {
      console.log('SQL execution via RPC successful!');
      console.log('Available tables:', tablesData);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testExecSql();
