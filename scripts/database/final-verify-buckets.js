const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Expected storage buckets from documentation
const expectedBuckets = [
  'avatars', 
  'course-thumbnails', 
  'certificates', 
  'receipts',
  'profile-images', 
  'lesson-content', 
  'supplementary-materials'
];

async function verifyAllBuckets() {
  try {
    console.log('Verifying all storage buckets...');
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return;
    }
    
    console.log('All existing buckets:', buckets.map(b => b.name));
    
    // Check which expected buckets exist
    const existingBucketNames = buckets.map(b => b.name);
    
    console.log('\nVerification of expected buckets:');
    for (const bucketName of expectedBuckets) {
      if (existingBucketNames.includes(bucketName)) {
        console.log(`✓ Bucket ${bucketName} exists`);
      } else {
        console.log(`✗ Bucket ${bucketName} does not exist`);
      }
    }
    
    return {
      allBuckets: existingBucketNames,
      expectedBuckets,
      missingExpectedBuckets: expectedBuckets.filter(b => !existingBucketNames.includes(b))
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

verifyAllBuckets();
