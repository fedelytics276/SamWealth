/**
 * API Test Endpoint
 * GET /api/test-apis
 * 
 * Tests Mansa API and Quiver API connections
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getMansaPrice, getMansaQuote, getMansaMarketStatus } from '../../lib/mansa-api';
import { getQuiverCongressTrades, getQuiverInsiderTrades } from '../../lib/quiver-api';

interface TestResult {
  service: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results: TestResult[] = [];

  // ===================================================================
  // TEST 1: Mansa API - Get NGX stock price (Dangote Cement)
  // ===================================================================
  
  try {
    console.log('Testing Mansa API: DANGCEM (NGX)...');
    const price = await getMansaPrice('DANGCEM', 'NGX');
    results.push({
      service: 'Mansa API - Price (DANGCEM/NGX)',
      status: 'success',
      data: { price, currency: 'NGN' },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      service: 'Mansa API - Price (DANGCEM/NGX)',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }

  // ===================================================================
  // TEST 2: Mansa API - Get JSE stock quote (Anglo American)
  // ===================================================================
  
  try {
    console.log('Testing Mansa API: AGL (JSE)...');
    const quote = await getMansaQuote('AGL', 'JSE');
    results.push({
      service: 'Mansa API - Quote (AGL/JSE)',
      status: 'success',
      data: quote,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      service: 'Mansa API - Quote (AGL/JSE)',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }

  // ===================================================================
  // TEST 3: Mansa API - Check market status
  // ===================================================================
  
  try {
    console.log('Testing Mansa API: NGX market status...');
    const status = await getMansaMarketStatus('NGX');
    results.push({
      service: 'Mansa API - Market Status (NGX)',
      status: 'success',
      data: { marketStatus: status },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      service: 'Mansa API - Market Status (NGX)',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }

  // ===================================================================
  // TEST 4: Quiver API - Congressional trades for AAPL
  // ===================================================================
  
  try {
    console.log('Testing Quiver API: Congressional trades (AAPL)...');
    const congressTrades = await getQuiverCongressTrades('AAPL', 5);
    results.push({
      service: 'Quiver API - Congressional Trades (AAPL)',
      status: 'success',
      data: {
        count: congressTrades.length,
        sample: congressTrades.slice(0, 2),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      service: 'Quiver API - Congressional Trades (AAPL)',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }

  // ===================================================================
  // TEST 5: Quiver API - Insider trades for TSLA
  // ===================================================================
  
  try {
    console.log('Testing Quiver API: Insider trades (TSLA)...');
    const insiderTrades = await getQuiverInsiderTrades('TSLA', 5);
    results.push({
      service: 'Quiver API - Insider Trades (TSLA)',
      status: 'success',
      data: {
        count: insiderTrades.length,
        sample: insiderTrades.slice(0, 2),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      service: 'Quiver API - Insider Trades (TSLA)',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }

  // ===================================================================
  // SUMMARY
  // ===================================================================
  
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  const summary = {
    totalTests: results.length,
    successful: successCount,
    failed: errorCount,
    allPassed: errorCount === 0,
  };

  return res.status(200).json({
    summary,
    results,
    timestamp: new Date().toISOString(),
  });
}
