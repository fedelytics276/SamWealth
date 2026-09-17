import type { NextApiRequest, NextApiResponse } from 'next';
import { getPaperPerformanceMetrics } from '../../../lib/alpaca-paper-trading';

/**
 * GET /api/paper-trading/performance
 * 
 * Returns comprehensive performance metrics:
 * - Account equity, cash, P&L
 * - Position count and value
 * - Trading stats (win rate, Sharpe ratio, max drawdown)
 * - Portfolio history chart data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metrics = await getPaperPerformanceMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch performance metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
