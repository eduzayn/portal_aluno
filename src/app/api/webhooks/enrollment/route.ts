import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { paymentAccessService } from '../../../../services/payment-access-service';

export async function POST(request: Request) {
  // Check for webhook secret in headers for security
  const webhookSecret = request.headers.get('x-webhook-secret');
  
  if (!webhookSecret || webhookSecret !== process.env.ENROLLMENT_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const payload = await request.json();
    
    // Validate payload
    if (!payload || !payload.event || !payload.data) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }
    
    const { event, data } = payload;
    
    // Handle different event types
    switch (event) {
      case 'payment.created':
        await handlePaymentCreated(data);
        break;
      case 'payment.approved':
        await handlePaymentApproved(data);
        break;
      case 'payment.overdue':
        await handlePaymentOverdue(data);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handlePaymentCreated(data: any) {
  // Insert new payment status record
  await supabase
    .from('payment_status')
    .insert({
      student_id: data.student_id,
      payment_id: data.payment_id,
      due_date: data.due_date,
      status: 'pendente',
      days_overdue: 0,
    });
}

async function handlePaymentApproved(data: any) {
  // Update payment status to 'pago'
  await supabase
    .from('payment_status')
    .update({
      status: 'pago',
      days_overdue: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('payment_id', data.payment_id);
  
  // Update student access status
  await paymentAccessService.updateAccessStatus(data.student_id);
}

async function handlePaymentOverdue(data: any) {
  // Update payment status to 'atrasado'
  await supabase
    .from('payment_status')
    .update({
      status: 'atrasado',
      updated_at: new Date().toISOString(),
    })
    .eq('payment_id', data.payment_id);
  
  // Calculate days overdue
  const dueDate = new Date(data.due_date);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Update days_overdue
  await supabase
    .from('payment_status')
    .update({
      days_overdue: daysDiff,
    })
    .eq('payment_id', data.payment_id);
  
  // Update student access status if necessary
  if (daysDiff > 30) {
    await paymentAccessService.updateAccessStatus(data.student_id);
  }
}
