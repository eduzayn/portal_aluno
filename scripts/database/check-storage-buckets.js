const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Expected storage buckets from documentation
const expectedBuckets = [
  // Existing buckets
  'avatars', 
  'course-thumbnails', 
  'certificates', 
  'receipts',
  // Missing buckets
  'profile-images', 
  'lesson-content', 
  'supplementary-materials'
];

async function checkStorageBuckets() {
  try {
    console.log('Checking storage buckets...');
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return;
    }
    
    console.log('Existing buckets:', buckets.map(b => b.name));
    
    // Check which buckets are missing
    const existingBucketNames = buckets.map(b => b.name);
    const missingBuckets = expectedBuckets.filter(b => !existingBucketNames.includes(b));
    
    console.log('\nMissing buckets:', missingBuckets.length > 0 ? missingBuckets : 'None');
    
    return {
      existingBuckets: existingBucketNames,
      missingBuckets
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

checkStorageBuckets();
