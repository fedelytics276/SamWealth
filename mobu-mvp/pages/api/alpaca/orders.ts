import type { NextApiRequest, NextApiResponse } from 'next';
import { paperTradingClient, liveTradingClient, getCurrencyForSymbol } from '../../../lib/alpaca';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mode } = req.query;
  const client = mode === 'live' ? liveTradingClient : paperTradingClient;

  // GET - Fetch orders
  if (req.method === 'GET') {
    try {
      const { status, limit } = req.query;
      const orders = await client.getOrders(
        status as 'open' | 'closed' | 'all',
        limit ? parseInt(limit as string) : 50
      );

      const formattedOrders = orders.map((order) => ({
        id: order.id,
        clientOrderId: order.client_order_id,
        symbol: order.symbol,
        currency: getCurrencyForSymbol(order.symbol),
        side: order.side,
        quantity: parseFloat(order.qty),
        filledQuantity: parseFloat(order.filled_qty),
        orderType: order.order_type,
        status: order.status,
        limitPrice: order.limit_price ? parseFloat(order.limit_price) : null,
        stopPrice: order.stop_price ? parseFloat(order.stop_price) : null,
        filledAvgPrice: order.filled_avg_price ? parseFloat(order.filled_avg_price) : null,
        timeInForce: order.time_in_force,
        createdAt: order.created_at,
        submittedAt: order.submitted_at,
        filledAt: order.filled_at,
        canceledAt: order.canceled_at
      }));

      res.status(200).json({
        success: true,
        data: formattedOrders,
        count: formattedOrders.length,
        mode: mode === 'live' ? 'live' : 'paper'
      });
    } catch (error: any) {
      console.error('Alpaca get orders error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch orders'
      });
    }
  }

  // POST - Place new order
  else if (req.method === 'POST') {
    try {
      const { symbol, quantity, side, orderType, limitPrice, notional } = req.body;

      // Validation
      if (!symbol || !side) {
        return res.status(400).json({
          success: false,
          error: 'Symbol and side are required'
        });
      }

      if (!quantity && !notional) {
        return res.status(400).json({
          success: false,
          error: 'Either quantity or notional amount is required'
        });
      }

      // Validate symbol is tradable
      const isTradable = await client.isSymbolTradable(symbol);
      if (!isTradable) {
        return res.status(400).json({
          success: false,
          error: `Symbol ${symbol} is not tradable or does not exist`
        });
      }

      let order;

      // Place notional order (buy $X worth)
      if (notional) {
        order = await client.placeNotionalOrder(symbol, parseFloat(notional), side);
      }
      // Place market order
      else if (!orderType || orderType === 'market') {
        order = await client.placeMarketOrder(symbol, parseFloat(quantity), side);
      }
      // Place limit order
      else if (orderType === 'limit') {
        if (!limitPrice) {
          return res.status(400).json({
            success: false,
            error: 'Limit price is required for limit orders'
          });
        }
        order = await client.placeLimitOrder(symbol, parseFloat(quantity), side, parseFloat(limitPrice));
      }
      else {
        return res.status(400).json({
          success: false,
          error: `Order type ${orderType} not supported`
        });
      }

      res.status(201).json({
        success: true,
        data: {
          orderId: order.id,
          clientOrderId: order.client_order_id,
          symbol: order.symbol,
          currency: getCurrencyForSymbol(order.symbol),
          side: order.side,
          quantity: parseFloat(order.qty),
          orderType: order.order_type,
          status: order.status,
          submittedAt: order.submitted_at
        },
        message: `${side === 'buy' ? 'Buy' : 'Sell'} order for ${symbol} submitted successfully`,
        mode: mode === 'live' ? 'live' : 'paper'
      });
    } catch (error: any) {
      console.error('Alpaca place order error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to place order'
      });
    }
  }

  // DELETE - Cancel order
  else if (req.method === 'DELETE') {
    try {
      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'Order ID is required'
        });
      }

      await client.cancelOrder(orderId as string);

      res.status(200).json({
        success: true,
        message: `Order ${orderId} canceled successfully`,
        mode: mode === 'live' ? 'live' : 'paper'
      });
    } catch (error: any) {
      console.error('Alpaca cancel order error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to cancel order'
      });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
