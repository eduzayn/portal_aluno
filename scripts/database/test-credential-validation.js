/**
 * Test script for credential validation API
 */
const fetch = require('node-fetch');

async function testCredentialValidation() {
  console.log('Testing Credential Validation API...');
  
  // Test cases
  const testCases = [
    { code: 'abc123xyz', expected: 'valid' },
    { code: 'invalid', expected: 'invalid' },
    { code: 'expired', expected: 'expired' },
    { code: 'revoked', expected: 'revoked' },
    { code: '', expected: 'error' }
  ];
  
  for (const test of testCases) {
    try {
      const url = test.code 
        ? `http://localhost:3000/api/credentials/validate?code=${test.code}`
        : 'http://localhost:3000/api/credentials/validate';
      
      console.log(`Testing: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(`Status: ${response.status}, Result:`, data);
      console.log(`Test ${test.code || 'empty'}: ${data.valid === (test.expected === 'valid') ? 'PASSED' : 'FAILED'}`);
      console.log('---');
    } catch (error) {
      console.error(`Error testing ${test.code}:`, error);
    }
  }
}

// Add to package.json scripts: "test:credentials": "node test-credential-validation.js"
console.log('To run this test, start the development server with:');
console.log('NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev');
console.log('Then in another terminal run:');
console.log('node test-credential-validation.js');

// Automatically run if executed directly
if (require.main === module) {
  testCredentialValidation();
}
