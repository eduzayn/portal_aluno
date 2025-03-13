const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Missing buckets identified in the check
const missingBuckets = ['avatars', 'receipts'];

async function createMissingBuckets() {
  console.log('Creating missing storage buckets...');
  
  for (const bucketName of missingBuckets) {
    try {
      console.log(`Creating bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'application/pdf']
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
      } else {
        console.log(`Successfully created bucket: ${bucketName}`);
      }
    } catch (err) {
      console.error(`Unexpected error creating bucket ${bucketName}:`, err);
    }
  }
}

createMissingBuckets();
