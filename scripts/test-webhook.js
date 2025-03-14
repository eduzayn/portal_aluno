const fetch = require('node-fetch');

async function testWebhook() {
  const webhookUrl = 'http://localhost:3000/api/webhooks/enrollment';
  const webhookSecret = process.env.ENROLLMENT_WEBHOOK_SECRET || 'test-webhook-secret';
  
  // Test payment.created event
  const paymentCreatedPayload = {
    event: 'payment.created',
    data: {
      student_id: 'test-student-id',
      payment_id: 'test-payment-id-1',
      due_date: new Date().toISOString()
    }
  };
  
  // Test payment.approved event
  const paymentApprovedPayload = {
    event: 'payment.approved',
    data: {
      student_id: 'test-student-id',
      payment_id: 'test-payment-id-1'
    }
  };
  
  // Test payment.overdue event with 15 days overdue (within grace period)
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  
  const paymentOverdueWithinGracePayload = {
    event: 'payment.overdue',
    data: {
      student_id: 'test-student-id',
      payment_id: 'test-payment-id-2',
      due_date: fifteenDaysAgo.toISOString()
    }
  };
  
  // Test payment.overdue event with 45 days overdue (beyond grace period)
  const fortyFiveDaysAgo = new Date();
  fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
  
  const paymentOverdueBeyondGracePayload = {
    event: 'payment.overdue',
    data: {
      student_id: 'test-student-id',
      payment_id: 'test-payment-id-3',
      due_date: fortyFiveDaysAgo.toISOString()
    }
  };
  
  console.log('Testing webhook endpoints...');
  
  try {
    // Test payment.created
    console.log('\nTesting payment.created event:');
    const createdResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret
      },
      body: JSON.stringify(paymentCreatedPayload)
    });
    
    console.log(`Status: ${createdResponse.status}`);
    console.log('Response:', await createdResponse.json());
    
    // Test payment.approved
    console.log('\nTesting payment.approved event:');
    const approvedResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret
      },
      body: JSON.stringify(paymentApprovedPayload)
    });
    
    console.log(`Status: ${approvedResponse.status}`);
    console.log('Response:', await approvedResponse.json());
    
    // Test payment.overdue within grace period
    console.log('\nTesting payment.overdue event (within 30-day grace period):');
    const overdueWithinGraceResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret
      },
      body: JSON.stringify(paymentOverdueWithinGracePayload)
    });
    
    console.log(`Status: ${overdueWithinGraceResponse.status}`);
    console.log('Response:', await overdueWithinGraceResponse.json());
    
    // Test payment.overdue beyond grace period
    console.log('\nTesting payment.overdue event (beyond 30-day grace period):');
    const overdueBeyondGraceResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret
      },
      body: JSON.stringify(paymentOverdueBeyondGracePayload)
    });
    
    console.log(`Status: ${overdueBeyondGraceResponse.status}`);
    console.log('Response:', await overdueBeyondGraceResponse.json());
    
    console.log('\nAll webhook tests completed!');
    console.log('\nVerify in the database that:');
    console.log('1. Payment records were created for all test events');
    console.log('2. Student access is full for payments within grace period');
    console.log('3. Student access is restricted for payments beyond grace period');
    
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

// Run the tests
testWebhook().catch(console.error);
