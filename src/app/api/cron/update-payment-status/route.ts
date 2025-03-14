import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { paymentAccessService } from '../../../../services/payment-access-service';

export async function GET(request: Request) {
  // Check for API key in headers for security
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Get all payment records with status 'atrasado'
    const { data: overduePayments, error: paymentsError } = await supabase
      .from('payment_status')
      .select('*')
      .eq('status', 'atrasado');
    
    if (paymentsError) {
      console.error('Error fetching overdue payments:', paymentsError);
      return NextResponse.json(
        { error: 'Error fetching overdue payments' },
        { status: 500 }
      );
    }
    
    // Update days_overdue for each payment
    const now = new Date();
    let updatedCount = 0;
    
    for (const payment of overduePayments) {
      const dueDate = new Date(payment.due_date);
      const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff !== payment.days_overdue) {
        const { error: updateError } = await supabase
          .from('payment_status')
          .update({ days_overdue: daysDiff, updated_at: now.toISOString() })
          .eq('id', payment.id);
        
        if (!updateError) {
          updatedCount++;
        }
        
        // Update student access status if days_overdue crosses the 30-day threshold
        if ((payment.days_overdue <= 30 && daysDiff > 30) || 
            (payment.days_overdue > 30 && daysDiff <= 30)) {
          await paymentAccessService.updateAccessStatus(payment.student_id);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      updated: updatedCount,
      total: overduePayments.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error in update payment status cron:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
