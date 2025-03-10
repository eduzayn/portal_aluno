import { supabase } from './supabase';

export interface EmailConfig {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  created_at: string;
  updated_at: string;
}

/**
 * Retrieves the email configuration from Supabase
 * @returns The email configuration or null if not found
 */
export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const { data, error } = await supabase
      .from('email_configurations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching email configuration:', error);
      return null;
    }
    
    return data as EmailConfig;
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    return null;
  }
}

/**
 * Updates the email configuration in Supabase
 * @param config The email configuration to update
 * @returns True if the update was successful, false otherwise
 */
export async function updateEmailConfig(config: Omit<EmailConfig, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    // First check if there's an existing configuration
    const existingConfig = await getEmailConfig();
    
    if (existingConfig) {
      // Update existing configuration
      const { error } = await supabase
        .from('email_configurations')
        .update({
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port,
          smtp_user: config.smtp_user,
          smtp_pass: config.smtp_pass,
        })
        .eq('id', existingConfig.id);
      
      if (error) {
        console.error('Error updating email configuration:', error);
        return false;
      }
      
      return true;
    } else {
      // Insert new configuration
      const { error } = await supabase
        .from('email_configurations')
        .insert([{
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port,
          smtp_user: config.smtp_user,
          smtp_pass: config.smtp_pass,
        }]);
      
      if (error) {
        console.error('Error inserting email configuration:', error);
        return false;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error updating email configuration:', error);
    return false;
  }
}

/**
 * Creates a nodemailer transport configuration from the email settings
 * @returns The nodemailer transport configuration or null if not found
 */
export async function getEmailTransportConfig(): Promise<{
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
} | null> {
  const config = await getEmailConfig();
  
  if (!config) {
    return null;
  }
  
  return {
    host: config.smtp_host,
    port: config.smtp_port,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  };
}
