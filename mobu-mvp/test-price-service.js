/**
 * Test Price Service Integration
 * Tests both Mansa API (African) and Alpha Vantage (Global)
 * 
 * Usage: node test-price-service.js
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// Configuration
const MANSA_API_KEY = process.env.MANSA_API_KEY || process.env.NEXT_PUBLIC_MANSA_API_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

console.log('🧪 Testing MOBU Price Service Integration\n');
console.log('=' .repeat(70));

// Check API keys
console.log('\n📋 Environment Check:');
console.log('-'.repeat(70));
console.log(`Mansa API Key: ${MANSA_API_KEY ? '✅ SET (' + MANSA_API_KEY.substring(0, 8) + '...)' : '❌ NOT SET'}`);
console.log(`Alpha Vantage API Key: ${ALPHA_VANTAGE_API_KEY ? '✅ SET (' + ALPHA_VANTAGE_API_KEY.substring(0, 8) + '...)' : '❌ NOT SET'}`);

// Test symbols
const TEST_CASES = [
  // African Stocks (Mansa API)
  { symbol: 'DANGCEM', exchange: 'NGX', name: 'Dangote Cement', api: 'Mansa' },
  { symbol: 'MTN', exchange: 'NGX', name: 'MTN Nigeria', api: 'Mansa' },
  { symbol: 'AGL', exchange: 'JSE', name: 'Anglo American', api: 'Mansa' },
  
  // Global Stocks (Alpha Vantage)
  { symbol: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.', api: 'Alpha Vantage' },
  { symbol: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft', api: 'Alpha Vantage' },
];

/**
 * Test Mansa API
 */
async function testMansaAPI(symbol, exchange) {
  if (!MANSA_API_KEY) {
    console.log(`⚠️  Skipping (no API key)`);
    return false;
  }

  try {
    const response = await axios.get(
      `https://api.mansaapi.com/v1/markets/${exchange.toLowerCase()}/quote/${symbol}`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log(`✅ Success! Price: $${response.data.price || 'N/A'}`);
    console.log(`   Response:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.response?.status || error.code}`);
    if (error.response?.data) {
      console.log(`   Error:`, JSON.stringify(error.response.data, null, 2).substring(0, 200));
    } else {
      console.log(`   Error:`, error.message);
    }
    return false;
  }
}

/**
 * Test Alpha Vantage API
 */
async function testAlphaVantageAPI(symbol) {
  if (!ALPHA_VANTAGE_API_KEY) {
    console.log(`⚠️  Skipping (no API key)`);
    return false;
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 10000,
    });
    
    const quote = response.data['Global Quote'];
    if (quote && quote['05. price']) {
      console.log(`✅ Success! Price: $${quote['05. price']}`);
      console.log(`   Change: ${quote['09. change']} (${quote['10. change percent']})`);
      return true;
    } else {
      console.log(`⚠️  No data returned (API limit reached or invalid symbol)`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2).substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.response?.status || error.code}`);
    console.log(`   Error:`, error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('\n🚀 Starting API Tests...\n');
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    console.log(`\n📊 Test: ${testCase.name}`);
    console.log('-'.repeat(70));
    console.log(`Symbol: ${testCase.symbol} | Exchange: ${testCase.exchange} | API: ${testCase.api}`);
    
    let success;
    if (testCase.api === 'Mansa') {
      success = await testMansaAPI(testCase.symbol, testCase.exchange);
    } else {
      success = await testAlphaVantageAPI(testCase.symbol);
    }
    
    results.push({ ...testCase, success });
    
    // Rate limiting: wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(70));
  
  const mansaTests = results.filter(r => r.api === 'Mansa');
  const alphaVantageTests = results.filter(r => r.api === 'Alpha Vantage');
  
  const mansaPassed = mansaTests.filter(r => r.success).length;
  const alphaPassed = alphaVantageTests.filter(r => r.success).length;
  
  console.log(`\nMansa API (African Markets):`);
  console.log(`  ✅ Passed: ${mansaPassed}/${mansaTests.length}`);
  console.log(`  ❌ Failed: ${mansaTests.length - mansaPassed}/${mansaTests.length}`);
  
  console.log(`\nAlpha Vantage API (Global Markets):`);
  console.log(`  ✅ Passed: ${alphaPassed}/${alphaVantageTests.length}`);
  console.log(`  ❌ Failed: ${alphaVantageTests.length - alphaPassed}/${alphaVantageTests.length}`);
  
  const totalPassed = mansaPassed + alphaPassed;
  const totalTests = results.length;
  
  console.log(`\nOverall:`);
  console.log(`  ✅ Passed: ${totalPassed}/${totalTests}`);
  console.log(`  ❌ Failed: ${totalTests - totalPassed}/${totalTests}`);
  
  if (totalPassed === totalTests) {
    console.log('\n🎉 All tests passed! Both APIs are working correctly.');
  } else if (totalPassed === 0) {
    console.log('\n⚠️  All tests failed. Please check:');
    console.log('   1. API keys are correctly set in .env.local');
    console.log('   2. API keys are valid (not expired)');
    console.log('   3. Internet connection is working');
    console.log('   4. API endpoints are accessible');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.');
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Setup instructions if keys missing
  if (!MANSA_API_KEY || !ALPHA_VANTAGE_API_KEY) {
    console.log('\n📝 Setup Instructions:');
    console.log('-'.repeat(70));
    
    if (!MANSA_API_KEY) {
      console.log('\n1. Get Mansa API Key:');
      console.log('   - Visit: https://mansaapi.com/');
      console.log('   - Sign up for account');
      console.log('   - Copy API key from dashboard');
      console.log('   - Add to .env.local: MANSA_API_KEY=your_key_here');
    }
    
    if (!ALPHA_VANTAGE_API_KEY) {
      console.log('\n2. Get Alpha Vantage API Key (FREE):');
      console.log('   - Visit: https://www.alphavantage.co/support/#api-key');
      console.log('   - Enter your email (no credit card required)');
      console.log('   - Instant API key delivery');
      console.log('   - Add to .env.local: ALPHA_VANTAGE_API_KEY=your_key_here');
      console.log('   - Free tier: 25 requests/day');
    }
    
    console.log('\n' + '='.repeat(70));
  }
}

// Run tests
runTests().catch(console.error);
