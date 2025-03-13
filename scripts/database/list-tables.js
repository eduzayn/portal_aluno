const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    // Get list of tables using information_schema
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    });
    
    if (error) {
      console.error('Error listing tables:', error);
      return;
    }
    
    console.log('Successfully retrieved table list!');
    console.log('Result:', JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

listTables();
