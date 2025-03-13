const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Check for missing functions
async function checkFunctions() {
  try {
    console.log('Checking for required functions...');
    
    const expectedFunctions = [
      'calculate_course_progress',
      'update_module_status',
      'issue_certificate',
      'update_updated_at_column',
      'calculate_learning_path_progress',
      'update_learning_path_progress'
    ];
    
    for (const funcName of expectedFunctions) {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT EXISTS (
            SELECT FROM pg_proc
            JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
            WHERE proname = '${funcName}'
            AND pg_namespace.nspname = 'public'
          ) as exists;
        `
      });
      
      if (error) {
        console.error(`Error checking function ${funcName}:`, error);
      } else {
        console.log(`Function ${funcName}: ${JSON.stringify(data)}`);
      }
    }
  } catch (err) {
    console.error('Error checking functions:', err);
  }
}

// Check for missing triggers
async function checkTriggers() {
  try {
    console.log('\nChecking for required triggers...');
    
    const expectedTriggers = [
      'after_lesson_progress_update',
      'after_lesson_progress_update_for_certificate',
      'update_email_configurations_updated_at',
      'after_enrollment_update_for_learning_path'
    ];
    
    for (const triggerName of expectedTriggers) {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT EXISTS (
            SELECT FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
            WHERE pg_trigger.tgname = '${triggerName}'
            AND pg_namespace.nspname = 'public'
          ) as exists;
        `
      });
      
      if (error) {
        console.error(`Error checking trigger ${triggerName}:`, error);
      } else {
        console.log(`Trigger ${triggerName}: ${JSON.stringify(data)}`);
      }
    }
  } catch (err) {
    console.error('Error checking triggers:', err);
  }
}

// Main function
async function main() {
  await checkFunctions();
  await checkTriggers();
}

main();
