import type { NextApiRequest, NextApiResponse } from 'next';
import { getPaperOrders, placePaperOrder, cancelPaperOrder } from '../../../lib/alpaca-paper-trading';

/**
 * Paper Trading Orders API
 * 
 * GET /api/paper-trading/orders - Get order history
 * POST /api/paper-trading/orders - Place a new order
 * DELETE /api/paper-trading/orders?order_id=xxx - Cancel an order
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - Fetch orders
    if (req.method === 'GET') {
      const status = (req.query.status as 'all' | 'open' | 'closed') || 'all';
      const limit = parseInt(req.query.limit as string) || 50;
      
      const orders = await getPaperOrders(status, limit);
      return res.status(200).json(orders);
    }

    // POST - Place a new order
    if (req.method === 'POST') {
      const { symbol, side, qty, notional, type, limit_price, stop_price, time_in_force } = req.body;

      if (!symbol || !side) {
        return res.status(400).json({ error: 'Missing required fields: symbol, side' });
      }

      if (!qty && !notional) {
        return res.status(400).json({ error: 'Either qty or notional must be specified' });
      }

      const order = await placePaperOrder({
        symbol,
        side,
        qty,
        notional,
        type: type || 'market',
        time_in_force: time_in_force || 'gtc',
        limit_price,
        stop_price,
      });

      return res.status(201).json(order);
    }

    // DELETE - Cancel an order
    if (req.method === 'DELETE') {
      const orderId = req.query.order_id as string;
      
      if (!orderId) {
        return res.status(400).json({ error: 'Missing order_id parameter' });
      }

      const result = await cancelPaperOrder(orderId);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in orders API:', error);
    res.status(500).json({ 
      error: 'Failed to process order request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
