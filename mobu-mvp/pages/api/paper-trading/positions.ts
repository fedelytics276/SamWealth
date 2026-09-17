import type { NextApiRequest, NextApiResponse } from 'next';
import { getPaperPositions } from '../../../lib/alpaca-paper-trading';

/**
 * GET /api/paper-trading/positions
 * 
 * Returns current holdings in paper trading account
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const positions = await getPaperPositions();
    res.status(200).json(positions);
  } catch (error) {
    console.error('Error fetching paper positions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch positions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
