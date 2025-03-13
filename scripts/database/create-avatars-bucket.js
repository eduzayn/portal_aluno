const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from .env.local
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAvatarsBucket() {
  try {
    console.log('Creating avatars bucket...');
    
    // Create the avatars bucket
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true, // Make it public since avatars are typically public
      fileSizeLimit: 5242880, // 5MB limit for avatar images
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log('The avatars bucket already exists but might not be visible in the list.');
        return { success: true, message: 'Bucket already exists' };
      }
      console.error('Error creating avatars bucket:', error);
      return { success: false, error };
    }
    
    console.log('Successfully created avatars bucket!');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}

createAvatarsBucket();
