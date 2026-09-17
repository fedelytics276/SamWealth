/**
 * Portfolio API Endpoint
 * GET /api/portfolio/:userId?type=real|paper
 * 
 * Returns unified portfolio data with:
 * - Cash balance
 * - Holdings with current prices (from Mansa API)
 * - Total value, P&L, allocation percentages
 * - Market status for each exchange
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { getMansaBatchPrices } from '../../../lib/mansa-api';
import { getMarketStatus, formatMarketStatus, isAnyMarketOpen } from '../../../lib/market-hours';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mobu_dev',
  user: process.env.DB_USER || 'fedeanalytics',
  port: parseInt(process.env.DB_PORT || '5432'),
  password: process.env.MOBU_DB_PASSWORD || '',
});

interface Holding {
  symbol: string;
  asset_name: string;
  exchange: string;
  quantity: number;
  avg_cost_basis: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  allocation_pct: number;
  market_status: string;
}

interface PortfolioResponse {
  userId: string;
  accountType: 'real' | 'paper';
  cash: number;
  holdingsValue: number;
  totalValue: number;
  startingCapital: number;
  totalPnL: number;
  totalPnLPct: number;
  todayPnL: number;
  todayPnLPct: number;
  holdingsCount: number;
  holdings: Holding[];
  marketStatus: {
    anyOpen: boolean;
    exchanges: Record<string, string>;
  };
  lastUpdated: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;
  const accountType = (req.query.type as string) || 'real';

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (!['real', 'paper'].includes(accountType)) {
    return res.status(400).json({ error: 'type must be "real" or "paper"' });
  }

  try {
    // ===================================================================
    // STEP 1: Get portfolio data from materialized view
    // ===================================================================
    
    let query: string;
    let params: any[];

    if (accountType === 'real') {
      query = `
        SELECT 
          user_id,
          email,
          username,
          cash,
          holdings_value,
          total_value,
          initial_deposit as starting_capital,
          total_pnl,
          total_pnl_pct,
          holdings_count,
          holdings
        FROM analytics.user_portfolio_snapshot
        WHERE user_id = $1
      `;
      params = [userId];
    } else {
      query = `
        SELECT 
          user_id,
          current_cash as cash,
          holdings_value,
          total_value,
          starting_capital,
          total_pnl,
          total_pnl_pct,
          holdings_count,
          holdings
        FROM analytics.paper_portfolio_snapshot
        WHERE user_id = $1
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const portfolio = result.rows[0];

    // ===================================================================
    // STEP 2: Get live prices for all holdings (from Mansa API)
    // ===================================================================
    
    const holdings = portfolio.holdings || [];
    
    if (holdings.length > 0) {
      // Prepare batch price request
      const priceRequests = holdings.map((h: any) => ({
        symbol: h.symbol,
        exchange: h.exchange,
      }));

      // Fetch live prices
      const livePrices = await getMansaBatchPrices(priceRequests);

      // Update holdings with live prices and recalculate values
      holdings.forEach((holding: any) => {
        const priceKey = `${holding.exchange}:${holding.symbol}`;
        const livePrice = livePrices.get(priceKey);

        if (livePrice && livePrice > 0) {
          holding.current_price = livePrice;
        } else {
          // Keep the price from DB (likely from materialized view)
          holding.current_price = holding.current_price || holding.avg_cost_basis;
        }

        // Recalculate derived values
        holding.market_value = holding.quantity * holding.current_price;
        holding.unrealized_pnl = holding.market_value - (holding.quantity * holding.avg_cost_basis);
        holding.unrealized_pnl_pct = holding.avg_cost_basis > 0 
          ? (holding.unrealized_pnl / (holding.quantity * holding.avg_cost_basis)) * 100 
          : 0;

        // Add market status
        holding.market_status = formatMarketStatus(holding.exchange);
      });

      // Recalculate total holdings value with live prices
      const holdingsValue = holdings.reduce((sum: number, h: any) => sum + h.market_value, 0);
      const totalValue = portfolio.cash + holdingsValue;

      // Update portfolio totals
      portfolio.holdings_value = holdingsValue;
      portfolio.total_value = totalValue;
      portfolio.total_pnl = totalValue - portfolio.starting_capital;
      portfolio.total_pnl_pct = portfolio.starting_capital > 0
        ? (portfolio.total_pnl / portfolio.starting_capital) * 100
        : 0;

      // Calculate allocation percentages
      holdings.forEach((holding: any) => {
        holding.allocation_pct = totalValue > 0 
          ? (holding.market_value / totalValue) * 100 
          : 0;
      });

      // Sort holdings by market value (descending)
      holdings.sort((a: any, b: any) => b.market_value - a.market_value);
    }

    // ===================================================================
    // STEP 3: Calculate today's P&L (compare to yesterday's close)
    // ===================================================================
    
    // TODO: Implement today's P&L calculation
    // This requires storing daily snapshots or querying historical prices
    const todayPnL = 0;
    const todayPnLPct = 0;

    // ===================================================================
    // STEP 4: Get market status summary
    // ===================================================================
    
    const exchanges = [...new Set(holdings.map((h: any) => h.exchange))] as string[];
    const anyOpen = isAnyMarketOpen(exchanges);
    const exchangeStatus: Record<string, string> = {};
    
    exchanges.forEach(exchange => {
      exchangeStatus[exchange] = getMarketStatus(exchange);
    });

    // ===================================================================
    // STEP 5: Build response
    // ===================================================================
    
    const response: PortfolioResponse = {
      userId: userId,
      accountType: accountType as 'real' | 'paper',
      cash: parseFloat(portfolio.cash),
      holdingsValue: parseFloat(portfolio.holdings_value),
      totalValue: parseFloat(portfolio.total_value),
      startingCapital: parseFloat(portfolio.starting_capital),
      totalPnL: parseFloat(portfolio.total_pnl),
      totalPnLPct: parseFloat(portfolio.total_pnl_pct),
      todayPnL,
      todayPnLPct,
      holdingsCount: parseInt(portfolio.holdings_count),
      holdings: holdings.map((h: any) => ({
        symbol: h.symbol,
        asset_name: h.asset_name || h.symbol,
        exchange: h.exchange,
        quantity: parseFloat(h.quantity),
        avg_cost_basis: parseFloat(h.avg_cost_basis),
        current_price: parseFloat(h.current_price),
        market_value: parseFloat(h.market_value),
        unrealized_pnl: parseFloat(h.unrealized_pnl),
        unrealized_pnl_pct: parseFloat(h.unrealized_pnl_pct),
        allocation_pct: parseFloat(h.allocation_pct),
        market_status: h.market_status,
      })),
      marketStatus: {
        anyOpen,
        exchanges: exchangeStatus,
      },
      lastUpdated: new Date().toISOString(),
    };

    // Set cache headers based on market status
    if (anyOpen) {
      // Market open: cache for 15 seconds
      res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    } else {
      // Market closed: cache for 5 minutes
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Portfolio API error:', error);
    
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}
