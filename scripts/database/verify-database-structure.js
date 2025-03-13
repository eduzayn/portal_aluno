const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Expected components from documentation
const expectedComponents = {
  tables: [
    'students', 'courses', 'modules', 'lessons', 'enrollments', 
    'lesson_progress', 'certificates', 'financial_records', 
    'notifications', 'email_configurations',
    'learning_paths', 'learning_path_courses', 'learning_path_enrollments', 
    'supplementary_materials', 'course_ratings', 'portal_settings'
  ],
  functions: [
    'calculate_course_progress', 'update_module_status', 
    'issue_certificate', 'update_updated_at_column',
    'calculate_learning_path_progress', 'update_learning_path_progress'
  ],
  triggers: [
    'after_lesson_progress_update', 'after_lesson_progress_update_for_certificate', 
    'update_email_configurations_updated_at', 'after_enrollment_update_for_learning_path'
  ],
  buckets: [
    'avatars', 'course-thumbnails', 'certificates', 'receipts',
    'profile-images', 'lesson-content', 'supplementary-materials'
  ]
};

// Verification results
const results = {
  tables: { verified: [], missing: [] },
  functions: { verified: [], missing: [] },
  triggers: { verified: [], missing: [] },
  buckets: { verified: [], missing: [] }
};

// Check tables
async function verifyTables() {
  console.log('Verifying tables...');
  
  for (const tableName of expectedComponents.tables) {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}'
        ) as exists;
      `
    });
    
    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      results.tables.missing.push(tableName);
    } else if (data.success) {
      results.tables.verified.push(tableName);
      console.log(`✓ Table ${tableName} verified`);
    } else {
      results.tables.missing.push(tableName);
      console.log(`✗ Table ${tableName} missing`);
    }
  }
}

// Check functions
async function verifyFunctions() {
  console.log('\nVerifying functions...');
  
  for (const funcName of expectedComponents.functions) {
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
      results.functions.missing.push(funcName);
    } else if (data.success) {
      results.functions.verified.push(funcName);
      console.log(`✓ Function ${funcName} verified`);
    } else {
      results.functions.missing.push(funcName);
      console.log(`✗ Function ${funcName} missing`);
    }
  }
}

// Check triggers
async function verifyTriggers() {
  console.log('\nVerifying triggers...');
  
  for (const triggerName of expectedComponents.triggers) {
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
      results.triggers.missing.push(triggerName);
    } else if (data.success) {
      results.triggers.verified.push(triggerName);
      console.log(`✓ Trigger ${triggerName} verified`);
    } else {
      results.triggers.missing.push(triggerName);
      console.log(`✗ Trigger ${triggerName} missing`);
    }
  }
}

// Check storage buckets
async function verifyBuckets() {
  console.log('\nVerifying storage buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return;
    }
    
    const existingBucketNames = buckets.map(b => b.name);
    
    for (const bucketName of expectedComponents.buckets) {
      if (existingBucketNames.includes(bucketName)) {
        results.buckets.verified.push(bucketName);
        console.log(`✓ Bucket ${bucketName} verified`);
      } else {
        results.buckets.missing.push(bucketName);
        console.log(`✗ Bucket ${bucketName} missing`);
      }
    }
  } catch (err) {
    console.error('Unexpected error verifying buckets:', err);
  }
}

// Generate summary report
function generateSummaryReport() {
  console.log('\n=== DATABASE STRUCTURE VERIFICATION SUMMARY ===');
  
  console.log('\nTABLES:');
  console.log(`✓ Verified: ${results.tables.verified.length}/${expectedComponents.tables.length}`);
  if (results.tables.missing.length > 0) {
    console.log(`✗ Missing: ${results.tables.missing.join(', ')}`);
  }
  
  console.log('\nFUNCTIONS:');
  console.log(`✓ Verified: ${results.functions.verified.length}/${expectedComponents.functions.length}`);
  if (results.functions.missing.length > 0) {
    console.log(`✗ Missing: ${results.functions.missing.join(', ')}`);
  }
  
  console.log('\nTRIGGERS:');
  console.log(`✓ Verified: ${results.triggers.verified.length}/${expectedComponents.triggers.length}`);
  if (results.triggers.missing.length > 0) {
    console.log(`✗ Missing: ${results.triggers.missing.join(', ')}`);
  }
  
  console.log('\nSTORAGE BUCKETS:');
  console.log(`✓ Verified: ${results.buckets.verified.length}/${expectedComponents.buckets.length}`);
  if (results.buckets.missing.length > 0) {
    console.log(`✗ Missing: ${results.buckets.missing.join(', ')}`);
  }
  
  console.log('\n=== END OF VERIFICATION SUMMARY ===');
  
  return results;
}

// Main function
async function main() {
  await verifyTables();
  await verifyFunctions();
  await verifyTriggers();
  await verifyBuckets();
  return generateSummaryReport();
}

main();
