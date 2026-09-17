// Alpaca API Integration for MOBU
// Paper Trading (free) + Live Trading support

import Alpaca from '@alpacahq/alpaca-trade-api';

// Environment variables (set in .env.local)
const ALPACA_API_KEY = process.env.ALPACA_API_KEY || '';
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY || '';
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets'; // Paper trading by default

export interface AlpacaAccount {
  account_number: string;
  status: string;
  currency: string;
  cash: string;
  portfolio_value: string;
  buying_power: string;
  equity: string;
  last_equity: string;
  multiplier: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  long_market_value: string;
  short_market_value: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
}

export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  avg_entry_price: string;
  qty: string;
  side: 'long' | 'short';
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string | null;
  expired_at: string | null;
  canceled_at: string | null;
  failed_at: string | null;
  replaced_at: string | null;
  replaced_by: string | null;
  replaces: string | null;
  asset_id: string;
  symbol: string;
  asset_class: string;
  notional: string | null;
  qty: string;
  filled_qty: string;
  filled_avg_price: string | null;
  order_class: string;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok';
  limit_price: string | null;
  stop_price: string | null;
  status: 'new' | 'partially_filled' | 'filled' | 'done_for_day' | 'canceled' | 'expired' | 'replaced' | 'pending_cancel' | 'pending_replace' | 'accepted' | 'pending_new' | 'accepted_for_bidding' | 'stopped' | 'rejected' | 'suspended' | 'calculated';
  extended_hours: boolean;
  legs: any[] | null;
  trail_percent: string | null;
  trail_price: string | null;
  hwm: string | null;
}

export interface AlpacaBar {
  t: string; // Timestamp
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
  vw: number; // Volume weighted average price
}

export class AlpacaClient {
  private client: any;
  private isPaper: boolean;

  constructor(isPaper: boolean = true) {
    this.isPaper = isPaper;
    this.client = new Alpaca({
      keyId: ALPACA_API_KEY,
      secretKey: ALPACA_SECRET_KEY,
      paper: isPaper,
      baseUrl: isPaper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets'
    });
  }

  /**
   * Get account information
   */
  async getAccount(): Promise<AlpacaAccount> {
    try {
      const account = await this.client.getAccount();
      return account;
    } catch (error: any) {
      throw new Error(`Failed to get account: ${error.message}`);
    }
  }

  /**
   * Get all positions
   */
  async getPositions(): Promise<AlpacaPosition[]> {
    try {
      const positions = await this.client.getPositions();
      return positions;
    } catch (error: any) {
      throw new Error(`Failed to get positions: ${error.message}`);
    }
  }

  /**
   * Get position for specific symbol
   */
  async getPosition(symbol: string): Promise<AlpacaPosition | null> {
    try {
      const position = await this.client.getPosition(symbol);
      return position;
    } catch (error: any) {
      if (error.message.includes('position does not exist')) {
        return null;
      }
      throw new Error(`Failed to get position for ${symbol}: ${error.message}`);
    }
  }

  /**
   * Place a market order
   */
  async placeMarketOrder(
    symbol: string,
    qty: number,
    side: 'buy' | 'sell',
    timeInForce: 'day' | 'gtc' = 'day'
  ): Promise<AlpacaOrder> {
    try {
      const order = await this.client.createOrder({
        symbol,
        qty,
        side,
        type: 'market',
        time_in_force: timeInForce
      });
      return order;
    } catch (error: any) {
      throw new Error(`Failed to place market order: ${error.message}`);
    }
  }

  /**
   * Place a limit order
   */
  async placeLimitOrder(
    symbol: string,
    qty: number,
    side: 'buy' | 'sell',
    limitPrice: number,
    timeInForce: 'day' | 'gtc' = 'day'
  ): Promise<AlpacaOrder> {
    try {
      const order = await this.client.createOrder({
        symbol,
        qty,
        side,
        type: 'limit',
        time_in_force: timeInForce,
        limit_price: limitPrice
      });
      return order;
    } catch (error: any) {
      throw new Error(`Failed to place limit order: ${error.message}`);
    }
  }

  /**
   * Place a notional order (buy $X worth)
   */
  async placeNotionalOrder(
    symbol: string,
    notional: number,
    side: 'buy' | 'sell'
  ): Promise<AlpacaOrder> {
    try {
      const order = await this.client.createOrder({
        symbol,
        notional,
        side,
        type: 'market',
        time_in_force: 'day'
      });
      return order;
    } catch (error: any) {
      throw new Error(`Failed to place notional order: ${error.message}`);
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<AlpacaOrder> {
    try {
      const order = await this.client.getOrder(orderId);
      return order;
    } catch (error: any) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  /**
   * Get all orders (optional filters)
   */
  async getOrders(
    status?: 'open' | 'closed' | 'all',
    limit?: number
  ): Promise<AlpacaOrder[]> {
    try {
      const orders = await this.client.getOrders({
        status: status || 'all',
        limit: limit || 50,
        nested: true
      });
      return orders;
    } catch (error: any) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.client.cancelOrder(orderId);
    } catch (error: any) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  /**
   * Cancel all open orders
   */
  async cancelAllOrders(): Promise<void> {
    try {
      await this.client.cancelAllOrders();
    } catch (error: any) {
      throw new Error(`Failed to cancel all orders: ${error.message}`);
    }
  }

  /**
   * Get latest quote for symbol
   */
  async getLatestQuote(symbol: string): Promise<{ bid: number; ask: number; last: number }> {
    try {
      const quote = await this.client.getLatestTrade(symbol);
      return {
        bid: quote.p,
        ask: quote.p,
        last: quote.p
      };
    } catch (error: any) {
      throw new Error(`Failed to get quote for ${symbol}: ${error.message}`);
    }
  }

  /**
   * Get historical bars (OHLCV data)
   */
  async getBars(
    symbol: string,
    timeframe: '1Min' | '5Min' | '15Min' | '1Hour' | '1Day',
    start: Date,
    end: Date,
    limit?: number
  ): Promise<AlpacaBar[]> {
    try {
      const bars = await this.client.getBarsV2(symbol, {
        start: start.toISOString(),
        end: end.toISOString(),
        timeframe,
        limit: limit || 1000
      });

      const result: AlpacaBar[] = [];
      for await (const bar of bars) {
        result.push(bar);
      }
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get bars for ${symbol}: ${error.message}`);
    }
  }

  /**
   * Check if market is open
   */
  async isMarketOpen(): Promise<boolean> {
    try {
      const clock = await this.client.getClock();
      return clock.is_open;
    } catch (error: any) {
      throw new Error(`Failed to check market status: ${error.message}`);
    }
  }

  /**
   * Get market calendar
   */
  async getCalendar(start?: Date, end?: Date): Promise<any[]> {
    try {
      const calendar = await this.client.getCalendar({
        start: start?.toISOString(),
        end: end?.toISOString()
      });
      return calendar;
    } catch (error: any) {
      throw new Error(`Failed to get calendar: ${error.message}`);
    }
  }

  /**
   * Get asset information
   */
  async getAsset(symbol: string): Promise<any> {
    try {
      const asset = await this.client.getAsset(symbol);
      return asset;
    } catch (error: any) {
      throw new Error(`Failed to get asset ${symbol}: ${error.message}`);
    }
  }

  /**
   * Validate if symbol is tradable
   */
  async isSymbolTradable(symbol: string): Promise<boolean> {
    try {
      const asset = await this.getAsset(symbol);
      return asset.tradable && asset.status === 'active';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get portfolio history
   */
  async getPortfolioHistory(
    period: '1D' | '1W' | '1M' | '3M' | '1Y' | 'all' = '1M',
    timeframe: '1Min' | '5Min' | '15Min' | '1H' | '1D' = '1D'
  ): Promise<any> {
    try {
      const history = await this.client.getPortfolioHistory({
        period,
        timeframe
      });
      return history;
    } catch (error: any) {
      throw new Error(`Failed to get portfolio history: ${error.message}`);
    }
  }
}

/**
 * Currency mapping for stocks
 * All US stocks (NYSE, NASDAQ) trade in USD
 */
export const STOCK_CURRENCIES: Record<string, string> = {
  // US Exchanges (default to USD)
  'NYSE': 'USD',
  'NASDAQ': 'USD',
  'AMEX': 'USD',
  'ARCA': 'USD',
  'BATS': 'USD',
  
  // African Exchanges
  'JSE': 'ZAR',   // South African Rand
  'NGX': 'NGN',   // Nigerian Naira
  'NSE': 'KES',   // Kenyan Shilling
  'EGX': 'EGP',   // Egyptian Pound
  'GSE': 'GHS',   // Ghanaian Cedi
  'BRVM': 'XOF',  // West African CFA Franc
  'CSE': 'MAD',   // Moroccan Dirham
  'ZSE': 'ZWL',   // Zimbabwean Dollar
};

/**
 * Get currency for a symbol based on exchange
 */
export function getCurrencyForSymbol(symbol: string, exchange?: string): string {
  // If exchange is provided, use it
  if (exchange && STOCK_CURRENCIES[exchange]) {
    return STOCK_CURRENCIES[exchange];
  }

  // Default to USD for all Alpaca-traded stocks (US markets)
  return 'USD';
}

/**
 * Validate and format price display
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// Export singleton instances
export const paperTradingClient = new AlpacaClient(true);
export const liveTradingClient = new AlpacaClient(false);
