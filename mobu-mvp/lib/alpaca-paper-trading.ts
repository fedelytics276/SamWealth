/**
 * Alpaca Paper Trading Integration for MOBU
 * 
 * This module connects MOBU to Alpaca's paper trading API,
 * allowing users to practice trading with $100,000 virtual cash
 * using real market prices.
 * 
 * API Documentation: https://docs.alpaca.markets/docs/paper-trading
 */

const ALPACA_API_BASE = 'https://paper-api.alpaca.markets/v2';
const ALPACA_API_KEY = process.env.ALPACA_API_KEY || 'PKNSMRMXNMBMFHK57E25IX766P';
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET || 'DEAqtr53xJwoQVJJ8YHbuf6HcXyW74NEuSEzc8xkWKod';

/**
 * Base Alpaca API request function
 */
async function alpacaRequest(endpoint: string, method: string = 'GET', body?: any) {
  const headers: HeadersInit = {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${ALPACA_API_BASE}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Alpaca API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get paper trading account details
 */
export async function getPaperAccount() {
  try {
    const account = await alpacaRequest('/account');
    
    return {
      id: account.id,
      status: account.status,
      currency: account.currency,
      buying_power: parseFloat(account.buying_power),
      cash: parseFloat(account.cash),
      portfolio_value: parseFloat(account.portfolio_value),
      equity: parseFloat(account.equity),
      last_equity: parseFloat(account.last_equity),
      daytrading_buying_power: parseFloat(account.daytrading_buying_power),
      pattern_day_trader: account.pattern_day_trader,
      trading_blocked: account.trading_blocked,
      transfers_blocked: account.transfers_blocked,
      account_blocked: account.account_blocked,
      created_at: account.created_at,
      
      // Calculate P&L
      total_pnl: parseFloat(account.equity) - 100000.00, // Assuming $100k start
      total_pnl_pct: ((parseFloat(account.equity) - 100000.00) / 100000.00) * 100,
    };
  } catch (error) {
    console.error('Error fetching Alpaca paper account:', error);
    throw error;
  }
}

/**
 * Get current positions (holdings)
 */
export async function getPaperPositions() {
  try {
    const positions = await alpacaRequest('/positions');
    
    return positions.map((pos: any) => ({
      symbol: pos.symbol,
      qty: parseFloat(pos.qty),
      side: pos.side, // 'long' or 'short'
      avg_entry_price: parseFloat(pos.avg_entry_price),
      current_price: parseFloat(pos.current_price),
      market_value: parseFloat(pos.market_value),
      cost_basis: parseFloat(pos.cost_basis),
      unrealized_pl: parseFloat(pos.unrealized_pl),
      unrealized_plpc: parseFloat(pos.unrealized_plpc) * 100, // Convert to %
      unrealized_intraday_pl: parseFloat(pos.unrealized_intraday_pl),
      unrealized_intraday_plpc: parseFloat(pos.unrealized_intraday_plpc) * 100,
      change_today: parseFloat(pos.change_today) * 100,
      asset_class: pos.asset_class,
      exchange: pos.exchange,
    }));
  } catch (error) {
    console.error('Error fetching Alpaca positions:', error);
    throw error;
  }
}

/**
 * Place a paper trade order
 * @param symbol - Stock ticker (e.g., 'AAPL')
 * @param side - 'buy' or 'sell'
 * @param qty - Number of shares (or notional amount if time_in_force is 'gtc')
 * @param type - 'market', 'limit', 'stop', 'stop_limit'
 * @param limit_price - Required for limit orders
 * @param stop_price - Required for stop orders
 */
export async function placePaperOrder(params: {
  symbol: string;
  side: 'buy' | 'sell';
  qty?: number;
  notional?: number;
  type?: 'market' | 'limit' | 'stop' | 'stop_limit';
  time_in_force?: 'day' | 'gtc' | 'ioc' | 'fok';
  limit_price?: number;
  stop_price?: number;
  client_order_id?: string;
}) {
  try {
    const orderData: any = {
      symbol: params.symbol,
      side: params.side,
      type: params.type || 'market',
      time_in_force: params.time_in_force || 'gtc',
    };

    // Either qty (shares) or notional (dollar amount) must be specified
    if (params.qty) {
      orderData.qty = params.qty;
    } else if (params.notional) {
      orderData.notional = params.notional;
    } else {
      throw new Error('Either qty or notional must be specified');
    }

    if (params.limit_price) {
      orderData.limit_price = params.limit_price;
    }

    if (params.stop_price) {
      orderData.stop_price = params.stop_price;
    }

    if (params.client_order_id) {
      orderData.client_order_id = params.client_order_id;
    }

    const order = await alpacaRequest('/orders', 'POST', orderData);

    return {
      order_id: order.id,
      client_order_id: order.client_order_id,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      qty: order.qty ? parseFloat(order.qty) : null,
      notional: order.notional ? parseFloat(order.notional) : null,
      filled_qty: parseFloat(order.filled_qty),
      filled_avg_price: order.filled_avg_price ? parseFloat(order.filled_avg_price) : null,
      status: order.status, // 'new', 'partially_filled', 'filled', 'canceled', 'rejected'
      submitted_at: order.submitted_at,
      filled_at: order.filled_at,
      limit_price: order.limit_price ? parseFloat(order.limit_price) : null,
      stop_price: order.stop_price ? parseFloat(order.stop_price) : null,
      time_in_force: order.time_in_force,
    };
  } catch (error) {
    console.error('Error placing Alpaca paper order:', error);
    throw error;
  }
}

/**
 * Get order history
 * @param status - 'all', 'open', 'closed'
 * @param limit - Max number of orders to return
 */
export async function getPaperOrders(status: 'all' | 'open' | 'closed' = 'all', limit: number = 50) {
  try {
    const orders = await alpacaRequest(`/orders?status=${status}&limit=${limit}&direction=desc`);
    
    return orders.map((order: any) => ({
      order_id: order.id,
      client_order_id: order.client_order_id,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      qty: order.qty ? parseFloat(order.qty) : null,
      notional: order.notional ? parseFloat(order.notional) : null,
      filled_qty: parseFloat(order.filled_qty),
      filled_avg_price: order.filled_avg_price ? parseFloat(order.filled_avg_price) : null,
      status: order.status,
      submitted_at: order.submitted_at,
      filled_at: order.filled_at,
      canceled_at: order.canceled_at,
      limit_price: order.limit_price ? parseFloat(order.limit_price) : null,
      stop_price: order.stop_price ? parseFloat(order.stop_price) : null,
      time_in_force: order.time_in_force,
    }));
  } catch (error) {
    console.error('Error fetching Alpaca orders:', error);
    throw error;
  }
}

/**
 * Cancel a paper order
 */
export async function cancelPaperOrder(orderId: string) {
  try {
    await alpacaRequest(`/orders/${orderId}`, 'DELETE');
    return { success: true, order_id: orderId };
  } catch (error) {
    console.error('Error canceling Alpaca order:', error);
    throw error;
  }
}

/**
 * Cancel all open orders
 */
export async function cancelAllPaperOrders() {
  try {
    await alpacaRequest('/orders', 'DELETE');
    return { success: true };
  } catch (error) {
    console.error('Error canceling all Alpaca orders:', error);
    throw error;
  }
}

/**
 * Get portfolio history (for charts)
 * @param period - '1D', '1W', '1M', '3M', '1Y', 'all'
 * @param timeframe - '1Min', '5Min', '15Min', '1H', '1D'
 */
export async function getPaperPortfolioHistory(
  period: string = '1M',
  timeframe: string = '1D'
) {
  try {
    const history = await alpacaRequest(
      `/account/portfolio/history?period=${period}&timeframe=${timeframe}`
    );

    return {
      timestamps: history.timestamp,
      equity: history.equity.map((e: string) => parseFloat(e)),
      profit_loss: history.profit_loss.map((pl: string) => parseFloat(pl)),
      profit_loss_pct: history.profit_loss_pct.map((plpc: string) => parseFloat(plpc) * 100),
      base_value: parseFloat(history.base_value),
      timeframe: history.timeframe,
    };
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    throw error;
  }
}

/**
 * Get real-time quote for a symbol
 */
export async function getLatestQuote(symbol: string) {
  try {
    const quote = await alpacaRequest(`/stocks/${symbol}/quotes/latest`);
    
    return {
      symbol: quote.symbol,
      ask_price: parseFloat(quote.quote.ap),
      ask_size: quote.quote.as,
      bid_price: parseFloat(quote.quote.bp),
      bid_size: quote.quote.bs,
      timestamp: quote.quote.t,
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
}

/**
 * Get latest trade for a symbol
 */
export async function getLatestTrade(symbol: string) {
  try {
    const trade = await alpacaRequest(`/stocks/${symbol}/trades/latest`);
    
    return {
      symbol: trade.symbol,
      price: parseFloat(trade.trade.p),
      size: trade.trade.s,
      timestamp: trade.trade.t,
      exchange: trade.trade.x,
    };
  } catch (error) {
    console.error('Error fetching trade:', error);
    throw error;
  }
}

/**
 * Execute a MOBU recommendation in paper account
 * Maps MOBU recommendation format to Alpaca order
 */
export async function executeMobuRecommendation(recommendation: {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  confidence: number;
  target_allocation?: number; // % of portfolio
  quantity?: number;
}) {
  try {
    const account = await getPaperAccount();
    
    // Calculate quantity if target_allocation is provided
    let qty = recommendation.quantity;
    
    if (!qty && recommendation.target_allocation) {
      const latestTrade = await getLatestTrade(recommendation.symbol);
      const targetValue = account.equity * (recommendation.target_allocation / 100);
      qty = Math.floor(targetValue / latestTrade.price);
    }

    if (!qty || qty <= 0) {
      throw new Error('Invalid quantity calculated');
    }

    // Place the order
    const order = await placePaperOrder({
      symbol: recommendation.symbol,
      side: recommendation.action,
      qty: qty,
      type: 'market',
      time_in_force: 'gtc',
      client_order_id: `mobu_rec_${recommendation.id}`,
    });

    return {
      success: true,
      recommendation_id: recommendation.id,
      order,
      message: `Paper trade executed: ${recommendation.action.toUpperCase()} ${qty} shares of ${recommendation.symbol}`,
    };
  } catch (error) {
    console.error('Error executing MOBU recommendation:', error);
    throw error;
  }
}

/**
 * Calculate paper trading performance metrics
 */
export async function getPaperPerformanceMetrics() {
  try {
    const account = await getPaperAccount();
    const positions = await getPaperPositions();
    const orders = await getPaperOrders('closed', 100);
    const history = await getPaperPortfolioHistory('1M', '1D');

    // Calculate metrics
    const totalTrades = orders.filter((o: any) => o.status === 'filled').length;
    const winningTrades = orders.filter((o: any) => {
      if (o.status !== 'filled' || !o.filled_avg_price) return false;
      // Simplified win calculation (would need position tracking for accurate P&L)
      return o.side === 'buy'; // Placeholder logic
    }).length;

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Calculate Sharpe ratio (simplified)
    const returns = history.profit_loss_pct;
    const avgReturn = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum: number, r: number) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized

    // Max drawdown
    let maxDrawdown = 0;
    let peak = history.equity[0];
    for (const value of history.equity) {
      if (value > peak) peak = value;
      const drawdown = ((peak - value) / peak) * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    return {
      account: {
        equity: account.equity,
        cash: account.cash,
        buying_power: account.buying_power,
        total_pnl: account.total_pnl,
        total_pnl_pct: account.total_pnl_pct,
      },
      positions: {
        count: positions.length,
        total_value: positions.reduce((sum: number, p: any) => sum + p.market_value, 0),
        unrealized_pl: positions.reduce((sum: number, p: any) => sum + p.unrealized_pl, 0),
      },
      trading: {
        total_trades: totalTrades,
        winning_trades: winningTrades,
        losing_trades: totalTrades - winningTrades,
        win_rate: winRate,
        avg_return: avgReturn,
        sharpe_ratio: sharpeRatio,
        max_drawdown: maxDrawdown,
      },
      history: {
        period: '1M',
        equity: history.equity,
        timestamps: history.timestamps,
        profit_loss: history.profit_loss,
        profit_loss_pct: history.profit_loss_pct,
      },
    };
  } catch (error) {
    console.error('Error calculating performance metrics:', error);
    throw error;
  }
}

/**
 * Health check - verify Alpaca API credentials
 */
export async function testAlpacaConnection() {
  try {
    const account = await getPaperAccount();
    return {
      success: true,
      message: 'Alpaca paper trading API connected successfully',
      account_id: account.id,
      equity: account.equity,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to Alpaca API',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
