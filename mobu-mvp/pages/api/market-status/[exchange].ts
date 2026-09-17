/**
 * Market Status API Endpoint
 * GET /api/market-status/[exchange]
 * 
 * Returns current market status for a specific exchange
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getMarketStatus } from '../../../lib/market-hours';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { exchange } = req.query;

  if (!exchange || typeof exchange !== 'string') {
    return res.status(400).json({ error: 'Invalid exchange code' });
  }

  try {
    const status = getMarketStatus(exchange.toUpperCase());
    return res.status(200).json(status);
  } catch (error) {
    console.error(`Market status error for ${exchange}:`, error);
    return res.status(404).json({
      error: error instanceof Error ? error.message : 'Exchange not found',
    });
  }
}
