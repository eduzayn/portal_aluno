const fetch = require('node-fetch');

async function testCronJob() {
  const cronUrl = 'http://localhost:3000/api/cron/update-payment-status';
  const apiKey = process.env.CRON_API_KEY || 'test-cron-api-key';
  
  console.log('Testing cron job endpoint...');
  
  try {
    const response = await fetch(cronUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', await response.json());
    
    console.log('\nCron job test completed!');
    console.log('\nVerify in the database that:');
    console.log('1. Days overdue was updated for all overdue payments');
    console.log('2. Student access status was updated for payments crossing the 30-day threshold');
    
  } catch (error) {
    console.error('Error testing cron job:', error);
  }
}

// Run the test
testCronJob().catch(console.error);
