import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS, StorageBucketName, isValidBucketName } from '../config/storage-buckets';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get a reference to a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @returns Supabase storage bucket reference
 * @throws Error if bucket name is invalid
 */
export const getStorageBucket = (bucketName: StorageBucketName) => {
  if (!isValidBucketName(bucketName)) {
    throw new Error(`Invalid bucket name: ${bucketName}`);
  }
  return supabase.storage.from(bucketName);
};

/**
 * Validate file type and size
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeInBytes Maximum file size in bytes
 * @returns Object with validation result and error message
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 
  maxSizeInBytes: number = 5 * 1024 * 1024
): { valid: boolean, error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}` 
    };
  }
  
  // Check file size
  if (file.size > maxSizeInBytes) {
    return { 
      valid: false, 
      error: `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSizeInBytes / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Upload a file to a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @param path Path within the bucket
 * @param file File to upload
 * @param options Optional validation options
 * @returns Upload result
 */
export const uploadFile = async (
  bucketName: StorageBucketName, 
  path: string, 
  file: File, 
  options?: { 
    allowedTypes?: string[], 
    maxSizeInBytes?: number 
  }
) => {
  // Validate file
  const validation = validateFile(
    file, 
    options?.allowedTypes, 
    options?.maxSizeInBytes
  );
  
  if (!validation.valid) {
    return { data: null, error: new Error(validation.error) };
  }
  
  // Upload file
  const bucket = getStorageBucket(bucketName);
  return await bucket.upload(path, file);
};

/**
 * Get a public URL for a file in a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @param path Path within the bucket
 * @returns Public URL for the file
 */
export const getPublicUrl = (bucketName: StorageBucketName, path: string): string => {
  const bucket = getStorageBucket(bucketName);
  return bucket.getPublicUrl(path).data.publicUrl;
};

/**
 * Delete a file from a storage bucket
 * @param bucketName Name of the bucket
 * @param path Path to the file within the bucket
 * @returns Object with deletion result or error
 */
export const deleteFile = async (bucketName: StorageBucketName, path: string) => {
  const bucket = getStorageBucket(bucketName);
  return await bucket.remove([path]);
};

/**
 * List files in a storage bucket
 * @param bucketName Name of the bucket
 * @param path Optional path prefix to filter files
 * @returns Object with list of files or error
 */
export const listFiles = async (bucketName: StorageBucketName, path?: string) => {
  const bucket = getStorageBucket(bucketName);
  return await bucket.list(path);
};
