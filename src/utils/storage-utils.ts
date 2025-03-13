import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS } from '../config/storage-buckets';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get a reference to a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @returns Supabase storage bucket reference
 */
export const getStorageBucket = (bucketName: string) => {
  return supabase.storage.from(bucketName);
};

/**
 * Upload a file to a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @param path Path within the bucket
 * @param file File to upload
 * @returns Upload result
 */
export const uploadFile = async (bucketName: string, path: string, file: File) => {
  const bucket = getStorageBucket(bucketName);
  return await bucket.upload(path, file);
};

/**
 * Get a public URL for a file in a storage bucket
 * @param bucketName Name of the bucket from STORAGE_BUCKETS
 * @param path Path within the bucket
 * @returns Public URL for the file
 */
export const getPublicUrl = (bucketName: string, path: string) => {
  const bucket = getStorageBucket(bucketName);
  return bucket.getPublicUrl(path).data.publicUrl;
};
