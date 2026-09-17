import type { NextApiRequest, NextApiResponse } from 'next';
import { executeMobuRecommendation } from '../../../lib/alpaca-paper-trading';

/**
 * POST /api/paper-trading/execute-recommendation
 * 
 * Executes a MOBU recommendation in the paper trading account
 * 
 * Body:
 * {
 *   "id": "rec_123",
 *   "symbol": "AAPL",
 *   "action": "buy",
 *   "confidence": 0.85,
 *   "target_allocation": 10,  // % of portfolio (optional)
 *   "quantity": 5              // number of shares (optional)
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, symbol, action, confidence, target_allocation, quantity } = req.body;

    // Validation
    if (!id || !symbol || !action) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, symbol, action' 
      });
    }

    if (action !== 'buy' && action !== 'sell') {
      return res.status(400).json({ 
        error: 'Invalid action. Must be "buy" or "sell"' 
      });
    }

    if (!target_allocation && !quantity) {
      return res.status(400).json({ 
        error: 'Either target_allocation or quantity must be specified' 
      });
    }

    // Execute the recommendation
    const result = await executeMobuRecommendation({
      id,
      symbol,
      action,
      confidence: confidence || 0.5,
      target_allocation,
      quantity,
    });

    res.status(200).json(result);

  } catch (error) {
    console.error('Error executing recommendation:', error);
    res.status(500).json({ 
      error: 'Failed to execute recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
