const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// List of expected tables from supabase-structure-summary.md
const expectedTables = [
  'students', 'courses', 'modules', 'lessons', 'enrollments', 
  'lesson_progress', 'certificates', 'financial_records', 
  'notifications', 'email_configurations',
  // Missing tables mentioned in the document
  'learning_paths', 'learning_path_courses', 'learning_path_enrollments', 
  'supplementary_materials', 'course_ratings', 'portal_settings'
];

async function checkExistingTables() {
  try {
    // Get list of existing tables
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    });
    
    if (error) {
      console.error('Error listing tables:', error);
      return;
    }
    
    if (!data.success) {
      console.error('Failed to retrieve table list');
      return;
    }
    
    // Get actual table list using a direct query
    const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
      sql: "SELECT json_agg(table_name) as tables FROM information_schema.tables WHERE table_schema = 'public';"
    });
    
    if (tableError || !tableData.success) {
      console.error('Error getting table list:', tableError || 'Unknown error');
      return;
    }
    
    console.log('Raw table data:', tableData);
    
    // Try another approach to list tables
    const { data: tablesResult, error: tablesError } = await supabase
      .from('students')
      .select('*')
      .limit(1);
      
    if (tablesError) {
      console.error('Error querying students table:', tablesError);
    } else {
      console.log('Students table exists and contains data:', tablesResult);
    }
    
    // Try to query each expected table to check existence
    console.log('\nChecking each expected table:');
    for (const tableName of expectedTables) {
      const { data: tableExists, error: tableCheckError } = await supabase.rpc('exec_sql', {
        sql: `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}'
        ) as exists;`
      });
      
      if (tableCheckError) {
        console.error(`Error checking table ${tableName}:`, tableCheckError);
      } else {
        console.log(`Table ${tableName}: ${JSON.stringify(tableExists)}`);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkExistingTables();
