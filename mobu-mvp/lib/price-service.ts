/**
 * Unified Price Service
 * Intelligently routes between Mansa API (African) and Alpha Vantage (Global)
 * Includes caching, fallback logic, and database persistence
 */

import MansaAPI, { isMansaExchange } from './mansa-api';
import AlphaVantageAPI, { isAlphaVantageExchange } from './alpha-vantage-api';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mobu_dev',
  user: process.env.DB_USER || 'mobu_user',
  password: process.env.DB_PASSWORD || process.env.MOBU_DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

interface PriceResult {
  symbol: string;
  exchange: string;
  price: number;
  source: 'mansa' | 'alpha_vantage' | 'cache' | 'database';
  timestamp: string;
  marketStatus?: 'open' | 'closed';
}

/**
 * Get current price for any symbol across all exchanges
 * Automatically routes to correct API based on exchange
 */
export async function getPrice(symbol: string, exchange: string): Promise<PriceResult> {
  // 1. Check cache first (avoid unnecessary API calls)
  const cachedPrice = await getCachedPrice(symbol, exchange);
  if (cachedPrice) {
    return {
      symbol,
      exchange,
      price: cachedPrice.price,
      source: 'cache',
      timestamp: cachedPrice.timestamp,
      marketStatus: cachedPrice.market_status as 'open' | 'closed',
    };
  }
  
  try {
    // 2. Route to appropriate API
    let price: number;
    let source: 'mansa' | 'alpha_vantage';
    
    if (isMansaExchange(exchange)) {
      // African exchanges → Mansa API
      price = await MansaAPI.getPrice(symbol, exchange);
      source = 'mansa';
    } else {
      // Global exchanges → Alpha Vantage
      price = await AlphaVantageAPI.getPrice(symbol);
      source = 'alpha_vantage';
    }
    
    // 3. Cache the result
    await cachePrice(symbol, exchange, price, source);
    
    // 4. Store in database for historical tracking
    await storePriceInDatabase(symbol, exchange, price, source);
    
    return {
      symbol,
      exchange,
      price,
      source,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error(`Price fetch failed for ${symbol} (${exchange}):`, error);
    
    // 5. Fallback: Get last known price from database
    const lastKnownPrice = await getLastKnownPriceFromDatabase(symbol, exchange);
    if (lastKnownPrice) {
      return {
        symbol,
        exchange,
        price: lastKnownPrice.price,
        source: 'database',
        timestamp: lastKnownPrice.timestamp,
      };
    }
    
    throw new Error(`Unable to fetch price for ${symbol} on ${exchange}`);
  }
}

/**
 * Batch fetch prices (optimized for portfolio updates)
 */
export async function getBatchPrices(
  requests: Array<{ symbol: string; exchange: string }>
): Promise<PriceResult[]> {
  // Separate requests by API
  const mansaRequests = requests.filter(r => isMansaExchange(r.exchange));
  const alphaVantageRequests = requests.filter(r => isAlphaVantageExchange(r.exchange));
  
  // Fetch in parallel
  const [mansaResults, alphaVantageResults] = await Promise.all([
    // Mansa supports batch API
    mansaRequests.length > 0
      ? MansaAPI.getBatchPrices(mansaRequests).then(results =>
          results.map(r => ({
            symbol: r.symbol,
            exchange: r.exchange,
            price: r.price!,
            source: 'mansa' as const,
            timestamp: new Date().toISOString(),
          }))
        )
      : [],
    
    // Alpha Vantage doesn't support batch, fetch individually (respect rate limits)
    alphaVantageRequests.length > 0
      ? Promise.all(
          alphaVantageRequests.map(async (req, index) => {
            // Rate limit: 5 requests per minute for free tier
            if (index > 0) await sleep(12000); // 12 seconds between requests
            
            try {
              const price = await AlphaVantageAPI.getPrice(req.symbol);
              return {
                symbol: req.symbol,
                exchange: req.exchange,
                price,
                source: 'alpha_vantage' as const,
                timestamp: new Date().toISOString(),
              };
            } catch (error) {
              // Fallback to cached or DB price
              const fallback = await getPrice(req.symbol, req.exchange);
              return fallback;
            }
          })
        )
      : [],
  ]);
  
  const allResults = [...mansaResults, ...alphaVantageResults];
  
  // Cache all results
  await Promise.all(
    allResults.map(result =>
      cachePrice(result.symbol, result.exchange, result.price, result.source)
    )
  );
  
  return allResults;
}

/**
 * Get cached price (Redis or PostgreSQL cache table)
 */
async function getCachedPrice(symbol: string, exchange: string) {
  try {
    const result = await pool.query(
      `SELECT price, market_status, cached_at as timestamp
       FROM raw_data.mansa_price_cache
       WHERE symbol = $1 AND exchange = $2 AND expires_at > NOW()`,
      [symbol, exchange]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Cache price with TTL (15 seconds if market open, 1 hour if closed)
 */
async function cachePrice(symbol: string, exchange: string, price: number, source: string) {
  try {
    const ttlSeconds = 15; // 15 seconds for real-time prices
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    
    await pool.query(
      `INSERT INTO raw_data.mansa_price_cache (symbol, exchange, price, cached_at, expires_at)
       VALUES ($1, $2, $3, NOW(), $4)
       ON CONFLICT (symbol, exchange) 
       DO UPDATE SET price = $3, cached_at = NOW(), expires_at = $4`,
      [symbol, exchange, price, expiresAt]
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Store price in database for historical tracking
 */
async function storePriceInDatabase(symbol: string, exchange: string, price: number, source: string) {
  try {
    if (isMansaExchange(exchange)) {
      await pool.query(
        `INSERT INTO raw_data.african_price_feeds 
         (source_name, exchange, asset_symbol, price_timestamp, close_price, currency)
         VALUES ($1, $2, $3, NOW(), $4, 'USD')`,
        [source, exchange, symbol, price]
      );
    } else {
      await pool.query(
        `INSERT INTO raw_data.price_data_raw 
         (source_name, asset_id, asset_symbol, price_timestamp, close_price, exchange, currency)
         VALUES ($1, $2, $3, NOW(), $4, $5, 'USD')`,
        [source, symbol, symbol, price, exchange]
      );
    }
  } catch (error) {
    console.error('Database storage error:', error);
  }
}

/**
 * Get last known price from database (fallback when APIs fail)
 */
async function getLastKnownPriceFromDatabase(symbol: string, exchange: string) {
  try {
    let result;
    
    if (isMansaExchange(exchange)) {
      result = await pool.query(
        `SELECT close_price as price, price_timestamp as timestamp
         FROM raw_data.african_price_feeds
         WHERE asset_symbol = $1 AND exchange = $2
         ORDER BY price_timestamp DESC
         LIMIT 1`,
        [symbol, exchange]
      );
    } else {
      result = await pool.query(
        `SELECT close_price as price, price_timestamp as timestamp
         FROM raw_data.price_data_raw
         WHERE asset_symbol = $1 AND exchange = $2
         ORDER BY price_timestamp DESC
         LIMIT 1`,
        [symbol, exchange]
      );
    }
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database fallback error:', error);
    return null;
  }
}

/**
 * Utility: Sleep for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Health check: Verify API keys are configured
 */
export async function checkAPIHealth() {
  const mansaKey = process.env.MANSA_API_KEY || process.env.NEXT_PUBLIC_MANSA_API_KEY;
  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  
  return {
    mansa: {
      configured: !!mansaKey,
      keyPreview: mansaKey ? `${mansaKey.substring(0, 8)}...` : 'NOT SET',
    },
    alphaVantage: {
      configured: !!alphaVantageKey,
      keyPreview: alphaVantageKey ? `${alphaVantageKey.substring(0, 8)}...` : 'NOT SET',
    },
  };
}

export default {
  getPrice,
  getBatchPrices,
  checkAPIHealth,
};
