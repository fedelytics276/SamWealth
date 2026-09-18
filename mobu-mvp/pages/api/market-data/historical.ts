/**
 * Historical Market Data API
 * Returns historical price data for charting
 * Supports multiple timeframes and frequencies
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAlphaVantageHistoricalData } from '@/lib/alpha-vantage-api';
import { getMansaHistoricalData } from '@/lib/mansa-api';
import { isMansaExchange } from '@/lib/mansa-api';

type TimeFrame = '1D' | '5D' | '1M' | '3M' | '1Y';
type Frequency = 'hourly' | 'daily' | 'weekly';

interface PriceData {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, timeframe = '3M', frequency = 'daily' } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // Determine exchange (could be passed as query param or inferred)
    const exchange = (req.query.exchange as string) || 'NASDAQ';
    
    let historicalData: PriceData[] = [];

    // Try to fetch from appropriate API
    if (isMansaExchange(exchange)) {
      // African stock - use Mansa API
      try {
        const mansaData = await getMansaHistoricalData(
          symbol,
          exchange,
          timeframe as '1D' | '1W' | '1M' | '3M' | '1Y'
        );
        
        historicalData = mansaData.map((item: any) => ({
          date: item.date,
          timestamp: new Date(item.date).getTime(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        }));
      } catch (error) {
        console.error('Mansa API error:', error);
        // Fallback to mock data
        historicalData = generateMockData(symbol, timeframe as TimeFrame, frequency as Frequency);
      }
    } else {
      // Global stock - use Alpha Vantage
      try {
        const alphaData = await getAlphaVantageHistoricalData(symbol, true);
        
        historicalData = alphaData.map((item: any) => ({
          date: item.date,
          timestamp: new Date(item.date).getTime(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        }));

        // Filter based on timeframe
        historicalData = filterByTimeframe(historicalData, timeframe as TimeFrame);
      } catch (error) {
        console.error('Alpha Vantage API error:', error);
        // Fallback to mock data
        historicalData = generateMockData(symbol, timeframe as TimeFrame, frequency as Frequency);
      }
    }

    // Calculate stats
    const stats = calculateStats(historicalData);

    return res.status(200).json({
      symbol,
      timeframe,
      frequency,
      prices: historicalData,
      stats,
    });

  } catch (error) {
    console.error('Historical data error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch historical data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Filter data by timeframe
 */
function filterByTimeframe(data: PriceData[], timeframe: TimeFrame): PriceData[] {
  const now = new Date();
  let cutoffDate: Date;

  switch (timeframe) {
    case '1D':
      cutoffDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case '5D':
      cutoffDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      break;
    case '1M':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3M':
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1Y':
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }

  return data.filter(item => new Date(item.date) >= cutoffDate);
}

/**
 * Calculate statistics from price data
 */
function calculateStats(data: PriceData[]) {
  if (data.length === 0) {
    return {
      currentPrice: 0,
      change: 0,
      changePct: 0,
      high: 0,
      low: 0,
      volume: 0,
    };
  }

  const current = data[data.length - 1].close;
  const previous = data[0].close;
  const change = current - previous;
  const changePct = (change / previous) * 100;

  const prices = data.map(d => d.close);
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const totalVolume = data.reduce((sum, d) => sum + d.volume, 0);
  const avgVolume = Math.floor(totalVolume / data.length);

  return {
    currentPrice: current,
    change,
    changePct,
    high,
    low,
    volume: avgVolume,
  };
}

/**
 * Generate mock data for demo/fallback
 */
function generateMockData(symbol: string, timeframe: TimeFrame, frequency: Frequency): PriceData[] {
  const data: PriceData[] = [];
  
  // Base price varies by symbol
  const basePrices: Record<string, number> = {
    'AAPL': 175,
    'MSFT': 415,
    'GOOGL': 140,
    'NVDA': 495,
    'TSLA': 240,
    'AMZN': 150,
    'META': 325,
    'DANGCEM': 285,
    'AGL': 425,
    'MTN': 95,
  };

  const basePrice = basePrices[symbol] || 150;
  let currentPrice = basePrice;

  // Determine number of data points
  const dataPoints = getDataPoints(timeframe, frequency);
  const startDate = getStartDate(timeframe);
  const interval = getInterval(timeframe, dataPoints);

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate.getTime() + i * interval);
    
    // Random walk with slight upward trend
    const change = (Math.random() - 0.48) * (basePrice * 0.02);
    currentPrice = Math.max(basePrice * 0.85, Math.min(basePrice * 1.2, currentPrice + change));
    
    const dailyVolatility = basePrice * 0.012;
    const open = currentPrice + (Math.random() - 0.5) * dailyVolatility;
    const close = currentPrice + (Math.random() - 0.5) * dailyVolatility;
    const high = Math.max(open, close) + Math.random() * dailyVolatility;
    const low = Math.min(open, close) - Math.random() * dailyVolatility;
    const volume = Math.floor(3000000 + Math.random() * 8000000);

    data.push({
      date: formatDate(date, frequency),
      timestamp: date.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
  }

  return data;
}

function getDataPoints(timeframe: TimeFrame, freq: Frequency): number {
  const points: Record<TimeFrame, Record<Frequency, number>> = {
    '1D': { hourly: 24, daily: 1, weekly: 1 },
    '5D': { hourly: 40, daily: 5, weekly: 1 },
    '1M': { hourly: 120, daily: 21, weekly: 4 },
    '3M': { hourly: 360, daily: 63, weekly: 12 },
    '1Y': { hourly: 1440, daily: 252, weekly: 52 },
  };
  return points[timeframe][freq];
}

function getStartDate(timeframe: TimeFrame): Date {
  const now = new Date();
  switch (timeframe) {
    case '1D': return new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    case '5D': return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    case '1M': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3M': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1Y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default: return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }
}

function getInterval(timeframe: TimeFrame, points: number): number {
  const durations: Record<TimeFrame, number> = {
    '1D': 24 * 60 * 60 * 1000,
    '5D': 5 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
    '3M': 90 * 24 * 60 * 60 * 1000,
    '1Y': 365 * 24 * 60 * 60 * 1000,
  };
  return durations[timeframe] / points;
}

function formatDate(date: Date, freq: Frequency): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  switch (freq) {
    case 'hourly':
      return `${month} ${day} ${hours}:${minutes}`;
    case 'daily':
    case 'weekly':
    default:
      return `${month} ${day}`;
  }
}
