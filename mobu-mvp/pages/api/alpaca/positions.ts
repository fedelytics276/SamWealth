import type { NextApiRequest, NextApiResponse } from 'next';
import { paperTradingClient, liveTradingClient, getCurrencyForSymbol } from '../../../lib/alpaca';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode } = req.query;
    const client = mode === 'live' ? liveTradingClient : paperTradingClient;

    const positions = await client.getPositions();

    const formattedPositions = positions.map((position) => ({
      symbol: position.symbol,
      exchange: position.exchange,
      currency: getCurrencyForSymbol(position.symbol, position.exchange),
      quantity: parseFloat(position.qty),
      avgEntryPrice: parseFloat(position.avg_entry_price),
      currentPrice: parseFloat(position.current_price),
      marketValue: parseFloat(position.market_value),
      costBasis: parseFloat(position.cost_basis),
      unrealizedPL: parseFloat(position.unrealized_pl),
      unrealizedPLPercent: parseFloat(position.unrealized_plpc) * 100,
      unrealizedIntradayPL: parseFloat(position.unrealized_intraday_pl),
      unrealizedIntradayPLPercent: parseFloat(position.unrealized_intraday_plpc) * 100,
      side: position.side,
      assetClass: position.asset_class
    }));

    res.status(200).json({
      success: true,
      data: formattedPositions,
      count: formattedPositions.length,
      mode: mode === 'live' ? 'live' : 'paper'
    });
  } catch (error: any) {
    console.error('Alpaca positions error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch positions'
    });
  }
}
