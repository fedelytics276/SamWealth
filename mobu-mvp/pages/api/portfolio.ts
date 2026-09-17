import type { NextApiRequest, NextApiResponse } from 'next'
import portfolio from '@/data/portfolio.json'

// Optional: Import database connection (will use JSON if DB not configured)
let query: any = null;
try {
  const db = require('@/lib/db');
  query = db.query;
} catch (e) {
  console.log('Database not configured, using JSON data');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if database is available and configured
    const useMockData = !query || process.env.USE_MOCK_DATA === 'true' || !process.env.DB_PASSWORD;
    
    if (useMockData) {
      // Fallback to JSON data
      await new Promise(resolve => setTimeout(resolve, 300));
      return res.status(200).json({
        success: true,
        data: portfolio,
        timestamp: new Date().toISOString(),
        source: 'json'
      });
    }

    // Query from database (dbt marts or raw data)
    const portfolios = await query(`
      SELECT 
        portfolio_id,
        user_id,
        portfolio_value,
        cash_balance,
        invested_amount,
        unrealized_pnl,
        realized_pnl,
        ROUND((portfolio_value - invested_amount) / NULLIF(invested_amount, 0) * 100, 2) as total_return_pct,
        valuation_timestamp::text as last_updated
      FROM raw_data.portfolio_valuations
      WHERE portfolio_id = $1
      ORDER BY valuation_timestamp DESC
      LIMIT 1
    `, ['portfolio_001']);

    if (portfolios.length === 0) {
      // No data in database, use JSON
      return res.status(200).json({
        success: true,
        data: portfolio,
        timestamp: new Date().toISOString(),
        source: 'json-fallback'
      });
    }

    const dbPortfolio = portfolios[0];
    
    // Transform to match existing JSON structure
    const responseData = {
      summary: {
        totalValue: dbPortfolio.portfolio_value,
        cashBalance: dbPortfolio.cash_balance,
        investedAmount: dbPortfolio.invested_amount,
        totalReturn: dbPortfolio.unrealized_pnl + dbPortfolio.realized_pnl,
        totalReturnPct: dbPortfolio.total_return_pct,
        unrealizedGain: dbPortfolio.unrealized_pnl,
        realizedGain: dbPortfolio.realized_pnl
      },
      holdings: portfolio.holdings, // TODO: Add holdings table
      lastUpdated: dbPortfolio.last_updated
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
      source: 'database'
    });
    
  } catch (error) {
    console.error('Portfolio API error:', error);
    
    // Fallback to JSON on error
    return res.status(200).json({
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString(),
      source: 'json-error-fallback'
    });
  }
}
