const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
const STORAGE_BUCKETS = {
  AVATARS: 'Avatars', // Note: Created with capital 'A'
  COURSE_THUMBNAILS: 'course-thumbnails',
  CERTIFICATES: 'certificates',
  RECEIPTS: 'receipts',
  PROFILE_IMAGES: 'profile-images',
  LESSON_CONTENT: 'lesson-content',
  SUPPLEMENTARY_MATERIALS: 'supplementary-materials'
};

async function testStorageBuckets() {
  console.log('Testing access to all storage buckets...');
  
  for (const [key, bucketName] of Object.entries(STORAGE_BUCKETS)) {
    try {
      console.log(`Testing bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.from(bucketName).list();
      
      if (error) {
        console.error(`Error accessing bucket ${bucketName}:`, error);
      } else {
        console.log(`Successfully accessed bucket ${bucketName}`);
        console.log(`Files in bucket: ${data.length}`);
      }
    } catch (err) {
      console.error(`Unexpected error with bucket ${bucketName}:`, err);
    }
  }
}

testStorageBuckets();
