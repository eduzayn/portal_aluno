/**
 * Configuration for Supabase storage bucket names
 * These constants should be used whenever referencing storage buckets
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'Avatars', // Note: Created with capital 'A'
  COURSE_THUMBNAILS: 'course-thumbnails',
  CERTIFICATES: 'certificates',
  RECEIPTS: 'receipts',
  PROFILE_IMAGES: 'profile-images',
  LESSON_CONTENT: 'lesson-content',
  SUPPLEMENTARY_MATERIALS: 'supplementary-materials'
} as const;

/**
 * Type for storage bucket names
 * This ensures type safety when referencing bucket names
 */
export type StorageBucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

/**
 * Validates if a string is a valid storage bucket name
 * @param bucketName The bucket name to validate
 * @returns True if the bucket name is valid, false otherwise
 */
export function isValidBucketName(bucketName: string): bucketName is StorageBucketName {
  return Object.values(STORAGE_BUCKETS).includes(bucketName as StorageBucketName);
}
