/**
 * Mansa API Integration
 * Coverage: African stock exchanges (NGX, JSE, NSE, EGX, GSE, BRVM, etc.)
 * Documentation: https://mansaapi.com/docs
 */

import axios, { AxiosError } from 'axios';

const MANSA_API_KEY = process.env.MANSA_API_KEY || process.env.NEXT_PUBLIC_MANSA_API_KEY;
const MANSA_BASE_URL = 'https://api.mansaapi.com/v1';

// African exchanges supported by Mansa
export const AFRICAN_EXCHANGES = ['NGX', 'JSE', 'NSE', 'EGX', 'GSE', 'BRVM', 'CSE', 'ZSE'];

interface MansaPriceResponse {
  ticker: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
  timestamp: string;
  market_status: 'open' | 'closed';
  currency: string;
}

interface MansaQuoteResponse {
  symbol: string;
  exchange: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previous_close: number;
  change: number;
  change_percent: number;
  timestamp: string;
}

/**
 * Get current price for a symbol on an African exchange
 */
export async function getMansaPrice(symbol: string, exchange: string): Promise<number> {
  try {
    const response = await axios.get<MansaPriceResponse>(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/quote/${symbol}`,
      {
        headers: {
          'Authorization': `Bearer ${MANSA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );
    
    return response.data.price;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Mansa API error for ${symbol} (${exchange}):`, axiosError.message);
    
    // Return null to trigger fallback
    throw new Error(`Mansa API failed: ${axiosError.message}`);
  }
}

/**
 * Get detailed quote for a symbol
 */
export async function getMansaQuote(symbol: string, exchange: string): Promise<MansaQuoteResponse | null> {
  try {
    const response = await axios.get<MansaQuoteResponse>(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/quote/${symbol}`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 5000,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Mansa quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get market status for an exchange
 */
export async function getMansaMarketStatus(exchange: string): Promise<'open' | 'closed'> {
  try {
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/status`,
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 3000,
      }
    );
    
    return response.data.status as 'open' | 'closed';
  } catch (error) {
    console.error(`Failed to fetch market status for ${exchange}:`, error);
    // Fallback to local calculation
    return 'closed';
  }
}

/**
 * Batch fetch prices for multiple symbols (reduces API calls)
 */
export async function getMansaBatchPrices(
  requests: Array<{ symbol: string; exchange: string }>
): Promise<Array<{ symbol: string; exchange: string; price: number | null }>> {
  try {
    const response = await axios.post(
      `${MANSA_BASE_URL}/markets/batch`,
      {
        quotes: requests.map(r => ({
          ticker: r.symbol,
          exchange: r.exchange.toLowerCase(),
        })),
      },
      {
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 10000,
      }
    );
    
    return response.data.results.map((result: any, index: number) => ({
      symbol: requests[index].symbol,
      exchange: requests[index].exchange,
      price: result.price || null,
    }));
  } catch (error) {
    console.error('Mansa batch fetch failed:', error);
    
    // Fallback: fetch individually
    return Promise.all(
      requests.map(async (req) => ({
        symbol: req.symbol,
        exchange: req.exchange,
        price: await getMansaPrice(req.symbol, req.exchange).catch(() => null),
      }))
    );
  }
}

/**
 * Check if Mansa API supports this exchange
 */
export function isMansaExchange(exchange: string): boolean {
  return AFRICAN_EXCHANGES.includes(exchange.toUpperCase());
}

/**
 * Get historical data for charting
 */
export async function getMansaHistoricalData(
  symbol: string,
  exchange: string,
  period: '1D' | '1W' | '1M' | '3M' | '1Y' = '1M'
): Promise<Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>> {
  try {
    const response = await axios.get(
      `${MANSA_BASE_URL}/markets/${exchange.toLowerCase()}/history/${symbol}`,
      {
        params: { period },
        headers: { 'Authorization': `Bearer ${MANSA_API_KEY}` },
        timeout: 10000,
      }
    );
    
    return response.data.history || [];
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
}

export default {
  getPrice: getMansaPrice,
  getQuote: getMansaQuote,
  getMarketStatus: getMansaMarketStatus,
  getBatchPrices: getMansaBatchPrices,
  getHistoricalData: getMansaHistoricalData,
  isMansaExchange,
};
