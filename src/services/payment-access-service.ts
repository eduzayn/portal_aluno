import { supabase } from '../lib/supabase';
import { PaymentStatus, StudentAccess, AccessRestrictionHistory, AccessLevel } from '../types/payment-access';

export const paymentAccessService = {
  /**
   * Check if a student has access to a specific content type
   */
  checkAccess: async (studentId: string, contentType: string): Promise<boolean> => {
    try {
      // Get student access status
      const { data: accessData, error: accessError } = await supabase
        .from('student_access')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (accessError) {
        console.error('Error checking student access:', accessError);
        // Default to full access if there's an error
        return true;
      }

      // If student has full access, return true
      if (accessData?.has_full_access) {
        return true;
      }

      // Financial and document areas are always accessible
      if (contentType === 'financial' || contentType === 'documents') {
        return true;
      }

      // Educational content is restricted if student doesn't have full access
      if (contentType === 'courses' || contentType === 'learning_path' || contentType === 'lessons') {
        return false;
      }

      // Default to allowing access
      return true;
    } catch (error) {
      console.error('Error in checkAccess:', error);
      // Default to full access if there's an error
      return true;
    }
  },

  /**
   * Get the current access level for a student
   */
  getAccessLevel: async (studentId: string): Promise<AccessLevel> => {
    try {
      // Get student access status
      const { data: accessData, error: accessError } = await supabase
        .from('student_access')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (accessError || !accessData) {
        console.error('Error getting student access level:', accessError);
        // Default to full access if there's an error
        return AccessLevel.FULL;
      }

      if (accessData.has_full_access) {
        return AccessLevel.FULL;
      }

      return AccessLevel.FINANCIAL_DOCUMENTS;
    } catch (error) {
      console.error('Error in getAccessLevel:', error);
      // Default to full access if there's an error
      return AccessLevel.FULL;
    }
  },

  /**
   * Update student access based on payment status
   */
  updateAccessStatus: async (studentId: string): Promise<void> => {
    try {
      // Get the latest payment status
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_status')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: false })
        .limit(1)
        .single();

      if (paymentError) {
        console.error('Error getting payment status:', paymentError);
        return;
      }

      // Check if payment is overdue by more than 30 days
      const hasFullAccess = !paymentData || 
                           paymentData.status === 'pago' || 
                           (paymentData.status === 'atrasado' && paymentData.days_overdue <= 30);

      // Get current access status
      const { data: currentAccess, error: accessError } = await supabase
        .from('student_access')
        .select('*')
        .eq('student_id', studentId)
        .single();

      // If access status doesn't exist, create it
      if (accessError) {
        await supabase
          .from('student_access')
          .insert({
            student_id: studentId,
            has_full_access: hasFullAccess,
            restricted_since: hasFullAccess ? null : new Date().toISOString(),
          });
        
        // Log restriction if access is restricted
        if (!hasFullAccess) {
          await supabase
            .from('access_restriction_history')
            .insert({
              student_id: studentId,
              restriction_type: 'partial',
              reason: 'Pagamento atrasado por mais de 30 dias',
            });
        }
        
        return;
      }

      // If access status has changed, update it
      if (currentAccess.has_full_access !== hasFullAccess) {
        await supabase
          .from('student_access')
          .update({
            has_full_access: hasFullAccess,
            restricted_since: hasFullAccess ? null : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('student_id', studentId);
        
        // Log restriction change
        await supabase
          .from('access_restriction_history')
          .insert({
            student_id: studentId,
            restriction_type: hasFullAccess ? 'none' : 'partial',
            reason: hasFullAccess 
              ? 'Acesso restaurado após regularização de pagamento' 
              : 'Pagamento atrasado por mais de 30 dias',
          });
      }
    } catch (error) {
      console.error('Error updating access status:', error);
    }
  },
};
