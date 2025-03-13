import { supabase } from '../lib/supabase';
import { STORAGE_BUCKETS } from '../config/storage-buckets';
import { uploadFile, getPublicUrl } from './storage-utils';
import { UserProfile } from '../types/auth';

/**
 * Upload an avatar image and update the user's profile
 * @param userId User ID
 * @param file Image file to upload
 * @returns Object with success status and updated profile or error
 */
export const uploadUserAvatar = async (userId: string, file: File): Promise<{ success: boolean, profile?: UserProfile, error?: string }> => {
  try {
    // Define file path in the Avatars bucket
    const filePath = `user-${userId}/${Date.now()}-${file.name}`;
    
    // Upload file to Avatars bucket
    const { data, error } = await uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file);
    
    if (error) {
      throw error;
    }
    
    // Get public URL for the uploaded file
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
    
    // Update user profile with the new avatar URL
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select('*')
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true, profile };
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile by ID
 * @param userId User ID
 * @returns User profile or null
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
