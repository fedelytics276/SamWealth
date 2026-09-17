/**
 * Quiver Quantitative API Integration
 * Alternative data for investment intelligence
 * https://www.quiverquant.com/
 * 
 * Data: Congressional trades, insider transactions, 13F filings, lobbying
 */

import axios, { AxiosError } from 'axios';
import { Pool } from 'pg';

const QUIVER_API_KEY = process.env.QUIVER_API_KEY || '';
const QUIVER_BASE_URL = process.env.QUIVER_BASE_URL || 'https://api.quiverquant.com/beta';
const CACHE_TTL_HOURS = 1; // Cache for 1 hour

// Database connection for caching
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mobu_dev',
  user: process.env.DB_USER || 'fedeanalytics',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export interface QuiverCongressTrade {
  Date: string;
  Representative: string;
  Transaction: 'Purchase' | 'Sale' | 'Exchange';
  Range: string;
  ticker: string;
  House?: string; // 'House' or 'Senate'
  Party?: string; // 'Democrat', 'Republican', 'Independent'
}

export interface QuiverInsiderTrade {
  Date: string;
  Insider: string;
  Title: string;
  Transaction: 'Purchase' | 'Sale';
  Shares: number;
  Price: number;
  Value: number;
  ticker: string;
}

export interface Quiver13FFiling {
  Date: string;
  Filer: string;
  Shares: number;
  Value: number;
  Change_Pct: number;
  ticker: string;
}

export interface QuiverLobbyingData {
  Date: string;
  Client: string;
  Amount: number;
  Issue: string;
  ticker: string;
}

/**
 * Get congressional stock trades for a symbol
 */
export async function getQuiverCongressTrades(
  symbol: string
): Promise<QuiverCongressTrade[]> {
  try {
    // Check cache first
    const cached = await getCachedQuiverData(symbol, 'congress');
    if (cached) {
      console.log(`[Quiver] Cache hit: Congress trades for ${symbol}`);
      return cached as QuiverCongressTrade[];
    }

    console.log(`[Quiver] Fetching congress trades for ${symbol}`);
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/congresstrading/${symbol}`,
      {
        headers: {
          'Authorization': `Token ${QUIVER_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    const trades: QuiverCongressTrade[] = response.data;
    
    // Cache the result
    await cacheQuiverData(symbol, 'congress', trades);
    
    // Also store in alternative_data table
    await storeAlternativeData(symbol, 'congress', trades);

    return trades;
  } catch (error) {
    console.error(`[Quiver] Failed to fetch congress trades for ${symbol}:`, getErrorMessage(error));
    return [];
  }
}

/**
 * Get insider transactions for a symbol
 */
export async function getQuiverInsiderTrades(
  symbol: string
): Promise<QuiverInsiderTrade[]> {
  try {
    const cached = await getCachedQuiverData(symbol, 'insider');
    if (cached) {
      console.log(`[Quiver] Cache hit: Insider trades for ${symbol}`);
      return cached as QuiverInsiderTrade[];
    }

    console.log(`[Quiver] Fetching insider trades for ${symbol}`);
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/insider/${symbol}`,
      {
        headers: {
          'Authorization': `Token ${QUIVER_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    const trades: QuiverInsiderTrade[] = response.data;
    
    await cacheQuiverData(symbol, 'insider', trades);
    await storeAlternativeData(symbol, 'insider', trades);

    return trades;
  } catch (error) {
    console.error(`[Quiver] Failed to fetch insider trades for ${symbol}:`, getErrorMessage(error));
    return [];
  }
}

/**
 * Get 13F hedge fund filings for a symbol
 */
export async function getQuiver13FFilings(
  symbol: string
): Promise<Quiver13FFiling[]> {
  try {
    const cached = await getCachedQuiverData(symbol, '13f');
    if (cached) {
      console.log(`[Quiver] Cache hit: 13F filings for ${symbol}`);
      return cached as Quiver13FFiling[];
    }

    console.log(`[Quiver] Fetching 13F filings for ${symbol}`);
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/13f/${symbol}`,
      {
        headers: {
          'Authorization': `Token ${QUIVER_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    const filings: Quiver13FFiling[] = response.data;
    
    await cacheQuiverData(symbol, '13f', filings);
    await storeAlternativeData(symbol, '13f', filings);

    return filings;
  } catch (error) {
    console.error(`[Quiver] Failed to fetch 13F filings for ${symbol}:`, getErrorMessage(error));
    return [];
  }
}

/**
 * Get lobbying data for a symbol
 */
export async function getQuiverLobbying(
  symbol: string
): Promise<QuiverLobbyingData[]> {
  try {
    const cached = await getCachedQuiverData(symbol, 'lobbying');
    if (cached) {
      console.log(`[Quiver] Cache hit: Lobbying data for ${symbol}`);
      return cached as QuiverLobbyingData[];
    }

    console.log(`[Quiver] Fetching lobbying data for ${symbol}`);
    const response = await axios.get(
      `${QUIVER_BASE_URL}/historical/lobbying/${symbol}`,
      {
        headers: {
          'Authorization': `Token ${QUIVER_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    const lobbying: QuiverLobbyingData[] = response.data;
    
    await cacheQuiverData(symbol, 'lobbying', lobbying);
    await storeAlternativeData(symbol, 'lobbying', lobbying);

    return lobbying;
  } catch (error) {
    console.error(`[Quiver] Failed to fetch lobbying data for ${symbol}:`, getErrorMessage(error));
    return [];
  }
}

/**
 * Get all alternative data for a symbol (congress + insider + 13F)
 */
export async function getQuiverAllData(symbol: string) {
  const [congress, insider, filings13f, lobbying] = await Promise.all([
    getQuiverCongressTrades(symbol),
    getQuiverInsiderTrades(symbol),
    getQuiver13FFilings(symbol),
    getQuiverLobbying(symbol),
  ]);

  return {
    congress,
    insider,
    filings13f,
    lobbying,
    summary: {
      recentCongressBuys: congress.filter(t => t.Transaction === 'Purchase' && isRecent(t.Date)).length,
      recentInsiderBuys: insider.filter(t => t.Transaction === 'Purchase' && isRecent(t.Date)).length,
      hedgeFundInterest: filings13f.length,
      lobbyingActivity: lobbying.length,
    },
  };
}

/**
 * Calculate sentiment signal from alternative data
 */
export function calculateAlternativeDataSignal(data: {
  congress: QuiverCongressTrade[];
  insider: QuiverInsiderTrade[];
  filings13f: Quiver13FFiling[];
}): 'bullish' | 'bearish' | 'neutral' {
  let score = 0;

  // Recent congressional purchases = bullish
  const recentCongressBuys = data.congress.filter(
    t => t.Transaction === 'Purchase' && isRecent(t.Date, 90)
  ).length;
  const recentCongressSells = data.congress.filter(
    t => t.Transaction === 'Sale' && isRecent(t.Date, 90)
  ).length;
  score += (recentCongressBuys - recentCongressSells) * 2;

  // Insider purchases = bullish
  const recentInsiderBuys = data.insider.filter(
    t => t.Transaction === 'Purchase' && isRecent(t.Date, 90)
  ).length;
  const recentInsiderSells = data.insider.filter(
    t => t.Transaction === 'Sale' && isRecent(t.Date, 90)
  ).length;
  score += (recentInsiderBuys - recentInsiderSells) * 1.5;

  // Hedge fund increases = bullish
  const increasingPositions = data.filings13f.filter(f => f.Change_Pct > 0).length;
  const decreasingPositions = data.filings13f.filter(f => f.Change_Pct < 0).length;
  score += (increasingPositions - decreasingPositions) * 1;

  if (score > 3) return 'bullish';
  if (score < -3) return 'bearish';
  return 'neutral';
}

/**
 * Cache Quiver data in database
 */
async function cacheQuiverData(
  symbol: string, 
  dataType: string, 
  data: any
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 3600 * 1000);

    await pool.query(
      `INSERT INTO raw_data.quiver_data_cache 
       (symbol, data_type, data, cached_at, expires_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
       ON CONFLICT (symbol, data_type) 
       DO UPDATE SET 
         data = $3, 
         cached_at = CURRENT_TIMESTAMP, 
         expires_at = $4`,
      [symbol, dataType, JSON.stringify(data), expiresAt]
    );
  } catch (error) {
    console.error('[Quiver] Failed to cache data:', getErrorMessage(error));
  }
}

/**
 * Get cached Quiver data
 */
async function getCachedQuiverData(
  symbol: string, 
  dataType: string
): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT data 
       FROM raw_data.quiver_data_cache 
       WHERE symbol = $1 AND data_type = $2 AND expires_at > CURRENT_TIMESTAMP`,
      [symbol, dataType]
    );

    if (result.rows.length > 0) {
      return JSON.parse(result.rows[0].data);
    }

    return null;
  } catch (error) {
    console.error('[Quiver] Failed to get cached data:', getErrorMessage(error));
    return null;
  }
}

/**
 * Store alternative data in main table for analysis
 */
async function storeAlternativeData(
  symbol: string, 
  dataType: string, 
  data: any[]
): Promise<void> {
  try {
    for (const item of data.slice(0, 10)) { // Store latest 10 items
      const eventDate = new Date(item.Date || item.date);
      const actorName = item.Representative || item.Insider || item.Filer || item.Client || '';
      const transactionType = item.Transaction?.toLowerCase() || 'hold';
      
      await pool.query(
        `INSERT INTO raw_data.alternative_data 
         (data_source, data_type, asset_symbol, event_date, actor_name, transaction_type, 
          sentiment_signal, raw_data, ingested_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
         ON CONFLICT DO NOTHING`,
        [
          'Quiver',
          dataType === 'congress' ? 'congress_trade' : 
          dataType === 'insider' ? 'insider' : 
          dataType === '13f' ? 'hedge_fund_13f' : 'lobbying',
          symbol,
          eventDate,
          actorName,
          transactionType,
          transactionType === 'purchase' || transactionType === 'buy' ? 'bullish' : 
          transactionType === 'sale' || transactionType === 'sell' ? 'bearish' : 'neutral',
          JSON.stringify(item),
        ]
      );
    }
  } catch (error) {
    console.error('[Quiver] Failed to store alternative data:', getErrorMessage(error));
  }
}

/**
 * Check if date is recent (within N days)
 */
function isRecent(dateString: string, days: number = 30): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  return diffDays <= days;
}

/**
 * Extract error message
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return `API error ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`;
    } else if (axiosError.request) {
      return 'No response from API';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
}

/**
 * Test Quiver API connection
 */
export async function testQuiverConnection(): Promise<boolean> {
  try {
    const trades = await getQuiverCongressTrades('AAPL');
    console.log(`[Quiver] Connection test successful! Found ${trades.length} congress trades for AAPL`);
    return true;
  } catch (error) {
    console.error('[Quiver] Connection test failed:', getErrorMessage(error));
    return false;
  }
}
