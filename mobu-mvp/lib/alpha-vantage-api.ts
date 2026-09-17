/**
 * Alpha Vantage API Integration
 * Coverage: Global markets (NYSE, NASDAQ, LSE, etc.) + Forex + Crypto
 * Free tier: 25 requests/day | Premium: 75+ requests/day
 * Documentation: https://www.alphavantage.co/documentation/
 */

import axios, { AxiosError } from 'axios';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Global exchanges supported (non-African)
export const GLOBAL_EXCHANGES = ['NYSE', 'NASDAQ', 'LSE', 'TSX', 'ASX', 'HKEX'];

interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

interface AlphaVantageTimeSeriesResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

/**
 * Get current price for a global symbol (NYSE, NASDAQ, etc.)
 */
export async function getAlphaVantagePrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get<AlphaVantageQuoteResponse>(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 10000,
    });
    
    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response from Alpha Vantage');
    }
    
    return parseFloat(quote['05. price']);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Alpha Vantage API error for ${symbol}:`, axiosError.message);
    throw new Error(`Alpha Vantage API failed: ${axiosError.message}`);
  }
}

/**
 * Get detailed quote for a symbol
 */
export async function getAlphaVantageQuote(symbol: string) {
  try {
    const response = await axios.get<AlphaVantageQuoteResponse>(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 10000,
    });
    
    const quote = response.data['Global Quote'];
    if (!quote) return null;
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      latestTradingDay: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error(`Failed to fetch Alpha Vantage quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get historical daily data (last 100 days)
 */
export async function getAlphaVantageHistoricalData(symbol: string, compact: boolean = true) {
  try {
    const response = await axios.get<AlphaVantageTimeSeriesResponse>(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: compact ? 'compact' : 'full', // compact = 100 days, full = 20 years
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 15000,
    });
    
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) return [];
    
    return Object.entries(timeSeries).map(([date, data]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    }));
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Get intraday data (for live charts during market hours)
 */
export async function getAlphaVantageIntradayData(symbol: string, interval: '1min' | '5min' | '15min' | '60min' = '5min') {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: interval,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 15000,
    });
    
    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = response.data[timeSeriesKey];
    if (!timeSeries) return [];
    
    return Object.entries(timeSeries).map(([timestamp, data]: [string, any]) => ({
      timestamp,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    }));
  } catch (error) {
    console.error(`Failed to fetch intraday data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Get forex exchange rate (for currency conversion)
 */
export async function getAlphaVantageForexRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 5000,
    });
    
    const exchangeRate = response.data['Realtime Currency Exchange Rate'];
    if (!exchangeRate) throw new Error('Invalid forex response');
    
    return parseFloat(exchangeRate['5. Exchange Rate']);
  } catch (error) {
    console.error(`Failed to fetch forex rate ${fromCurrency}/${toCurrency}:`, error);
    throw error;
  }
}

/**
 * Search for symbols (autocomplete)
 */
export async function searchAlphaVantageSymbols(keywords: string) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: keywords,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
      timeout: 5000,
    });
    
    return response.data.bestMatches || [];
  } catch (error) {
    console.error(`Failed to search symbols for "${keywords}":`, error);
    return [];
  }
}

/**
 * Check if Alpha Vantage should handle this exchange
 */
export function isAlphaVantageExchange(exchange: string): boolean {
  return GLOBAL_EXCHANGES.includes(exchange.toUpperCase());
}

export default {
  getPrice: getAlphaVantagePrice,
  getQuote: getAlphaVantageQuote,
  getHistoricalData: getAlphaVantageHistoricalData,
  getIntradayData: getAlphaVantageIntradayData,
  getForexRate: getAlphaVantageForexRate,
  searchSymbols: searchAlphaVantageSymbols,
  isAlphaVantageExchange,
};
