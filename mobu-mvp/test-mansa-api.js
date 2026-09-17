/**
 * Mansa API Test Script
 * Tests African stock market data API integration
 * 
 * Usage: node test-mansa-api.js
 * 
 * API Docs: https://mansaapi.com/docs
 */

const axios = require('axios');

// Mansa API Configuration
const MANSA_API_KEY = process.env.MANSA_API_KEY || 'YOUR_API_KEY_HERE';
const MANSA_BASE_URL = 'https://api.mansaapi.com/v1';

// Test symbols across African exchanges
const TEST_SYMBOLS = [
  { symbol: 'DANGCEM', exchange: 'NGX', name: 'Dangote Cement - Nigeria' },
  { symbol: 'MTN', exchange: 'NGX', name: 'MTN Nigeria' },
  { symbol: 'AGL', exchange: 'JSE', name: 'Anglo American - South Africa' },
  { symbol: 'SAFARICOM', exchange: 'NSE', name: 'Safaricom - Kenya' },
  { symbol: 'EQUITY', exchange: 'NSE', name: 'Equity Bank - Kenya' },
];

console.log('🧪 Testing Mansa API Integration\n');
console.log('=' .repeat(60));

/**
 * Test 1: Get single ticker price
 */
async function testSingleTicker() {
  console.log('\n📊 Test 1: Fetch Single Ticker Price');
  console.log('-'.repeat(60));
  
  try {
    const { symbol, exchange, name } = TEST_SYMBOLS[0];
    console.log(`Fetching: ${symbol} (${exchange}) - ${name}`);
    
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/ticker/${symbol}`,
      {
        headers: {
          'Authorization': `Bearer ${MANSA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else if (error.code === 'ENOTFOUND') {
      console.log('Error: Could not reach Mansa API (DNS resolution failed)');
      console.log('This might indicate the API endpoint is incorrect or service is down');
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Test 2: Get market status
 */
async function testMarketStatus() {
  console.log('\n🕐 Test 2: Check Market Status');
  console.log('-'.repeat(60));
  
  try {
    const exchange = 'NGX';
    console.log(`Fetching market status for: ${exchange}`);
    
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/status`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log('Market Status:', response.data.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Test 3: Batch price fetching
 */
async function testBatchPrices() {
  console.log('\n📦 Test 3: Batch Price Fetching');
  console.log('-'.repeat(60));
  
  try {
    console.log('Fetching prices for multiple symbols...');
    
    const requests = TEST_SYMBOLS.map(s => ({
      ticker: s.symbol,
      exchange: s.exchange.toLowerCase(),
    }));
    
    const response = await axios.post(
      `${MANSA_BASE_URL}/markets/batch`,
      { requests },
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 15000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Fetched ${response.data.results?.length || 0} prices`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Test 4: Historical data
 */
async function testHistoricalData() {
  console.log('\n📈 Test 4: Historical Price Data');
  console.log('-'.repeat(60));
  
  try {
    const { symbol, exchange } = TEST_SYMBOLS[0];
    console.log(`Fetching historical data for: ${symbol} (${exchange})`);
    
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/ticker/${symbol}/history`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        params: {
          period: '1M', // Last 1 month
        },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Fetched ${response.data.length || 0} historical records`);
    if (response.data.length > 0) {
      console.log('Sample (first 3 records):');
      console.log(JSON.stringify(response.data.slice(0, 3), null, 2));
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Test 5: Available exchanges
 */
async function testAvailableExchanges() {
  console.log('\n🌍 Test 5: List Available Exchanges');
  console.log('-'.repeat(60));
  
  try {
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/exchanges`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log('Available Exchanges:', response.data);
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting Mansa API Tests...\n');
  
  if (!MANSA_API_KEY || MANSA_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  Warning: MANSA_API_KEY not set!');
    console.log('Set it with: export MANSA_API_KEY="your_key_here"');
    console.log('\nNote: Some tests may fail without a valid API key.');
    console.log('Sign up at: https://mansaapi.com/\n');
  }
  
  const results = {
    singleTicker: await testSingleTicker(),
    marketStatus: await testMarketStatus(),
    batchPrices: await testBatchPrices(),
    historicalData: await testHistoricalData(),
    availableExchanges: await testAvailableExchanges(),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${test}`);
  });
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Mansa API integration is ready.');
  } else if (passed === 0) {
    console.log('\n⚠️  All tests failed. Check your API key and endpoint configuration.');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);
