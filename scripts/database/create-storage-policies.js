const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create storage policies for all buckets
 */
async function createStoragePolicies() {
  try {
    console.log('Creating storage policies for buckets...');
    
    // Create policies for each bucket
    await createAvatarBucketPolicies();
    await createCourseThumbnailsPolicies();
    await createCertificatesPolicies();
    await createReceiptsPolicies();
    await createProfileImagesPolicies();
    await createLessonContentPolicies();
    await createSupplementaryMaterialsPolicies();
    
    console.log('All storage policies created successfully');
  } catch (error) {
    console.error('Error creating storage policies:', error);
  }
}

/**
 * Create policies for the Avatars bucket
 */
async function createAvatarBucketPolicies() {
  console.log('Creating policies for Avatars bucket...');
  
  try {
    // Create policy for authenticated users to upload their own avatars
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Avatar Upload Policy',
          'Avatars',
          '(bucket_id = ''Avatars''::text AND auth.role() = ''authenticated''::text AND (storage.foldername(name))[1] = (''user-''::text || auth.uid()::text))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating avatar upload policy:', uploadError);
    } else {
      console.log('Avatar upload policy created successfully');
    }
    
    // Create policy for public read access to avatars
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Avatar Read Policy',
          'Avatars',
          '(bucket_id = ''Avatars''::text)'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating avatar read policy:', readError);
    } else {
      console.log('Avatar read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating Avatars bucket policies:', error);
  }
}

/**
 * Create policies for the course-thumbnails bucket
 */
async function createCourseThumbnailsPolicies() {
  console.log('Creating policies for course-thumbnails bucket...');
  
  try {
    // Create policy for admin users to upload course thumbnails
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Course Thumbnails Upload Policy',
          'course-thumbnails',
          '(bucket_id = ''course-thumbnails''::text AND auth.role() = ''authenticated''::text AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating course thumbnails upload policy:', uploadError);
    } else {
      console.log('Course thumbnails upload policy created successfully');
    }
    
    // Create policy for public read access to course thumbnails
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Course Thumbnails Read Policy',
          'course-thumbnails',
          '(bucket_id = ''course-thumbnails''::text)'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating course thumbnails read policy:', readError);
    } else {
      console.log('Course thumbnails read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating course-thumbnails bucket policies:', error);
  }
}

/**
 * Create policies for the certificates bucket
 */
async function createCertificatesPolicies() {
  console.log('Creating policies for certificates bucket...');
  
  try {
    // Create policy for admin users to upload certificates
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Certificates Upload Policy',
          'certificates',
          '(bucket_id = ''certificates''::text AND auth.role() = ''authenticated''::text AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating certificates upload policy:', uploadError);
    } else {
      console.log('Certificates upload policy created successfully');
    }
    
    // Create policy for authenticated users to read their own certificates
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Certificates Read Policy',
          'certificates',
          '(bucket_id = ''certificates''::text AND (auth.role() = ''authenticated''::text AND (storage.foldername(name))[1] = (''student-''::text || auth.uid()::text) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin'')))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating certificates read policy:', readError);
    } else {
      console.log('Certificates read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating certificates bucket policies:', error);
  }
}

/**
 * Create policies for the receipts bucket
 */
async function createReceiptsPolicies() {
  console.log('Creating policies for receipts bucket...');
  
  try {
    // Create policy for admin users to upload receipts
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Receipts Upload Policy',
          'receipts',
          '(bucket_id = ''receipts''::text AND auth.role() = ''authenticated''::text AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating receipts upload policy:', uploadError);
    } else {
      console.log('Receipts upload policy created successfully');
    }
    
    // Create policy for authenticated users to read their own receipts
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Receipts Read Policy',
          'receipts',
          '(bucket_id = ''receipts''::text AND (auth.role() = ''authenticated''::text AND (storage.foldername(name))[1] = (''student-''::text || auth.uid()::text) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin'')))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating receipts read policy:', readError);
    } else {
      console.log('Receipts read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating receipts bucket policies:', error);
  }
}

/**
 * Create policies for the profile-images bucket
 */
async function createProfileImagesPolicies() {
  console.log('Creating policies for profile-images bucket...');
  
  try {
    // Create policy for authenticated users to upload their own profile images
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Profile Images Upload Policy',
          'profile-images',
          '(bucket_id = ''profile-images''::text AND auth.role() = ''authenticated''::text AND (storage.foldername(name))[1] = (''user-''::text || auth.uid()::text))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating profile images upload policy:', uploadError);
    } else {
      console.log('Profile images upload policy created successfully');
    }
    
    // Create policy for public read access to profile images
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Profile Images Read Policy',
          'profile-images',
          '(bucket_id = ''profile-images''::text)'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating profile images read policy:', readError);
    } else {
      console.log('Profile images read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating profile-images bucket policies:', error);
  }
}

/**
 * Create policies for the lesson-content bucket
 */
async function createLessonContentPolicies() {
  console.log('Creating policies for lesson-content bucket...');
  
  try {
    // Create policy for admin users to upload lesson content
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Lesson Content Upload Policy',
          'lesson-content',
          '(bucket_id = ''lesson-content''::text AND auth.role() = ''authenticated''::text AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating lesson content upload policy:', uploadError);
    } else {
      console.log('Lesson content upload policy created successfully');
    }
    
    // Create policy for authenticated users to read lesson content
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Lesson Content Read Policy',
          'lesson-content',
          '(bucket_id = ''lesson-content''::text AND auth.role() = ''authenticated''::text)'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating lesson content read policy:', readError);
    } else {
      console.log('Lesson content read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating lesson-content bucket policies:', error);
  }
}

/**
 * Create policies for the supplementary-materials bucket
 */
async function createSupplementaryMaterialsPolicies() {
  console.log('Creating policies for supplementary-materials bucket...');
  
  try {
    // Create policy for admin users to upload supplementary materials
    const { data: uploadPolicy, error: uploadError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Supplementary Materials Upload Policy',
          'supplementary-materials',
          '(bucket_id = ''supplementary-materials''::text AND auth.role() = ''authenticated''::text AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (uploadError) {
      console.error('Error creating supplementary materials upload policy:', uploadError);
    } else {
      console.log('Supplementary materials upload policy created successfully');
    }
    
    // Create policy for authenticated users to read supplementary materials
    const { data: readPolicy, error: readError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO storage.policies (name, bucket_id, definition)
        VALUES (
          'Supplementary Materials Read Policy',
          'supplementary-materials',
          '(bucket_id = ''supplementary-materials''::text AND auth.role() = ''authenticated''::text)'
        )
        ON CONFLICT (name, bucket_id) DO UPDATE
        SET definition = EXCLUDED.definition
        RETURNING *;
      `
    });
    
    if (readError) {
      console.error('Error creating supplementary materials read policy:', readError);
    } else {
      console.log('Supplementary materials read policy created successfully');
    }
  } catch (error) {
    console.error('Error creating supplementary-materials bucket policies:', error);
  }
}

// Execute the script
createStoragePolicies();
