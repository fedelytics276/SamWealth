/**
 * Quiver Quantitative API Test Script
 * Tests alternative data API integration
 * 
 * Usage: node test-quiver-api.js
 * 
 * API Docs: https://api.quiverquant.com/docs
 * Pricing: $30/month
 */

const axios = require('axios');

// Quiver API Configuration
const QUIVER_API_KEY = process.env.QUIVER_API_KEY || 'YOUR_API_KEY_HERE';
const QUIVER_BASE_URL = 'https://api.quiverquant.com/beta';

// Test symbols
const TEST_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'NVDA'];

console.log('🧪 Testing Quiver Quantitative API Integration\n');
console.log('=' .repeat(60));

/**
 * Test 1: Congressional Trading Data
 */
async function testCongressionalTrading() {
  console.log('\n🏛️  Test 1: Congressional Trading Data');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching congressional trades for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/congresstrading/${symbol}`,
      {
        headers: {
          'Authorization': `Token ${QUIVER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} congressional trades`);
    
    if (response.data.length > 0) {
      console.log('\nSample trades (most recent 3):');
      const recentTrades = response.data.slice(0, 3);
      recentTrades.forEach(trade => {
        console.log(`  - ${trade.Date}: ${trade.Representative} - ${trade.Transaction} (${trade.Range})`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error:', error.response.data);
    } else if (error.code === 'ENOTFOUND') {
      console.log('Error: Could not reach Quiver API (DNS resolution failed)');
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Test 2: Insider Trading Data
 */
async function testInsiderTrading() {
  console.log('\n👔 Test 2: Insider Trading Data');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching insider trades for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/insider/${symbol}`,
      {
        headers: { 'Authorization': `Token ${QUIVER_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} insider trades`);
    
    if (response.data.length > 0) {
      console.log('\nSample trades (most recent 3):');
      const recentTrades = response.data.slice(0, 3);
      recentTrades.forEach(trade => {
        console.log(`  - ${trade.Date}: ${trade.Insider} - ${trade.Transaction} (${trade.Shares} shares)`);
      });
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
 * Test 3: 13F Hedge Fund Holdings
 */
async function test13FFilings() {
  console.log('\n📊 Test 3: 13F Hedge Fund Holdings');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching 13F filings for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/13f/${symbol}`,
      {
        headers: { 'Authorization': `Token ${QUIVER_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} 13F filings`);
    
    if (response.data.length > 0) {
      console.log('\nSample filings (most recent 3):');
      const recentFilings = response.data.slice(0, 3);
      recentFilings.forEach(filing => {
        console.log(`  - ${filing.Date}: ${filing.Fund} - ${filing.Shares.toLocaleString()} shares ($${(filing.Value / 1000000).toFixed(1)}M)`);
      });
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
 * Test 4: Corporate Lobbying Data
 */
async function testLobbying() {
  console.log('\n🏢 Test 4: Corporate Lobbying Data');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching lobbying data for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/lobbying/${symbol}`,
      {
        headers: { 'Authorization': `Token ${QUIVER_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} lobbying records`);
    
    if (response.data.length > 0) {
      console.log('\nSample records (most recent 3):');
      const recentRecords = response.data.slice(0, 3);
      recentRecords.forEach(record => {
        console.log(`  - ${record.Date}: $${record.Amount.toLocaleString()} - ${record.Issue}`);
      });
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
 * Test 5: Government Contracts
 */
async function testGovernmentContracts() {
  console.log('\n💼 Test 5: Government Contracts');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching government contracts for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/govcontracts/${symbol}`,
      {
        headers: { 'Authorization': `Token ${QUIVER_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} government contracts`);
    
    if (response.data.length > 0) {
      console.log('\nSample contracts (most recent 3):');
      const recentContracts = response.data.slice(0, 3);
      recentContracts.forEach(contract => {
        console.log(`  - ${contract.Date}: $${(contract.Amount / 1000000).toFixed(1)}M - ${contract.Agency}`);
      });
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
 * Test 6: Twitter Sentiment
 */
async function testTwitterSentiment() {
  console.log('\n🐦 Test 6: Twitter Sentiment Data');
  console.log('-'.repeat(60));
  
  try {
    const symbol = TEST_SYMBOLS[0];
    console.log(`Fetching Twitter sentiment for: ${symbol}`);
    
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/twitter/${symbol}`,
      {
        headers: { 'Authorization': `Token ${QUIVER_API_KEY}` },
        timeout: 10000,
      }
    );
    
    console.log('✅ Success!');
    console.log(`Found ${response.data.length} sentiment records`);
    
    if (response.data.length > 0) {
      console.log('\nSample sentiment (most recent 3):');
      const recentSentiment = response.data.slice(0, 3);
      recentSentiment.forEach(record => {
        console.log(`  - ${record.Date}: Sentiment ${record.Sentiment.toFixed(2)} (${record.Tweets} tweets)`);
      });
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
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting Quiver Quantitative API Tests...\n');
  
  if (!QUIVER_API_KEY || QUIVER_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  Warning: QUIVER_API_KEY not set!');
    console.log('Set it with: export QUIVER_API_KEY="your_key_here"');
    console.log('\nNote: All tests will fail without a valid API key.');
    console.log('Sign up at: https://www.quiverquant.com/api');
    console.log('Pricing: $30/month for API access\n');
  }
  
  const results = {
    congressionalTrading: await testCongressionalTrading(),
    insiderTrading: await testInsiderTrading(),
    filings13F: await test13FFilings(),
    lobbying: await testLobbying(),
    governmentContracts: await testGovernmentContracts(),
    twitterSentiment: await testTwitterSentiment(),
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
    console.log('\n🎉 All tests passed! Quiver API integration is ready.');
    console.log('\n💡 Next steps:');
    console.log('  1. Store alternative data in raw_data.alternative_data table');
    console.log('  2. Create dbt model: stg_alternative_data.sql');
    console.log('  3. Build evidence trail UI showing congressional/insider trades');
  } else if (passed === 0) {
    console.log('\n⚠️  All tests failed. Check your API key and endpoint configuration.');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);
