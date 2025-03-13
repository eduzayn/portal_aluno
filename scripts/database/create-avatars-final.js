const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAvatarsBucket() {
  try {
    // Try with different casing or alternative name
    const bucketOptions = [
      { name: 'avatars', public: true },
      { name: 'Avatars', public: true },
      { name: 'user-avatars', public: true }
    ];
    
    for (const option of bucketOptions) {
      console.log(`Attempting to create bucket: ${option.name}`);
      
      try {
        const { data, error } = await supabase.storage.createBucket(option.name, {
          public: option.public,
          fileSizeLimit: 5242880,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
        
        if (error) {
          console.log(`Error creating ${option.name}: ${error.message}`);
        } else {
          console.log(`Successfully created bucket: ${option.name}`);
          return { success: true, bucketName: option.name };
        }
      } catch (err) {
        console.log(`Error with ${option.name}: ${err.message}`);
      }
    }
    
    // Check if 'User Avatars' already exists and can be used instead
    console.log("Checking if 'User Avatars' can be used as an alternative...");
    const { data: buckets } = await supabase.storage.listBuckets();
    const userAvatarsBucket = buckets.find(b => b.name === 'User Avatars');
    
    if (userAvatarsBucket) {
      console.log("'User Avatars' bucket exists and can be used as an alternative to 'avatars'");
      return { success: true, alternative: 'User Avatars' };
    }
    
    return { success: false, message: "Could not create avatars bucket with any approach" };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}

createAvatarsBucket();
