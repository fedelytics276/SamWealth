import type { NextApiRequest, NextApiResponse } from 'next';
import { getPaperAccount } from '../../../lib/alpaca-paper-trading';

/**
 * GET /api/paper-trading/account
 * 
 * Returns paper trading account details including:
 * - Current cash balance
 * - Portfolio value
 * - Total P&L
 * - Buying power
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const account = await getPaperAccount();
    res.status(200).json(account);
  } catch (error) {
    console.error('Error fetching paper account:', error);
    res.status(500).json({ 
      error: 'Failed to fetch paper trading account',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
