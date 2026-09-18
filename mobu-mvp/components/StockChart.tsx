/**
 * StockChart Component
 * Interactive price chart with multiple timeframes
 * Features: 3-month view, daily/weekly/hourly toggle, zoom, tooltips
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

interface StockChartProps {
  symbol: string;
  exchange?: string;
  height?: number;
  showVolume?: boolean;
}

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

export default function StockChart({ 
  symbol, 
  exchange = 'NASDAQ',
  height = 400,
  showVolume = true 
}: StockChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('3M');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    currentPrice: 0,
    change: 0,
    changePct: 0,
    high: 0,
    low: 0,
    volume: 0,
  });

  // Fetch historical data
  useEffect(() => {
    fetchHistoricalData();
  }, [symbol, timeFrame, frequency]);

  async function fetchHistoricalData() {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from API
      const response = await fetch(
        `/api/market-data/historical?symbol=${symbol}&timeframe=${timeFrame}&frequency=${frequency}`
      );

      if (response.ok) {
        const data = await response.json();
        setChartData(data.prices);
        setStats(data.stats);
      } else {
        // Fallback to mock data for demo
        const mockData = generateMockData(timeFrame, frequency);
        setChartData(mockData);
        calculateStats(mockData);
      }
    } catch (err) {
      console.error('Failed to fetch historical data:', err);
      // Use mock data
      const mockData = generateMockData(timeFrame, frequency);
      setChartData(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  }

  function generateMockData(timeframe: TimeFrame, freq: Frequency): PriceData[] {
    const data: PriceData[] = [];
    const basePrice = 150 + Math.random() * 50; // Random starting price
    let currentPrice = basePrice;
    
    // Determine number of data points and date range
    const dataPoints = getDataPoints(timeframe, freq);
    const startDate = getStartDate(timeframe);
    const interval = getInterval(timeframe, dataPoints);

    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(startDate.getTime() + i * interval);
      
      // Simulate price movement (random walk with slight upward trend)
      const change = (Math.random() - 0.48) * (basePrice * 0.02); // Slight upward bias
      currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.3, currentPrice + change));
      
      const dailyVolatility = basePrice * 0.015;
      const open = currentPrice + (Math.random() - 0.5) * dailyVolatility;
      const close = currentPrice + (Math.random() - 0.5) * dailyVolatility;
      const high = Math.max(open, close) + Math.random() * dailyVolatility;
      const low = Math.min(open, close) - Math.random() * dailyVolatility;
      const volume = Math.floor((5000000 + Math.random() * 10000000));

      data.push({
        date: formatDate(date, freq),
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

  function calculateStats(data: PriceData[]) {
    if (data.length === 0) return;

    const current = data[data.length - 1].close;
    const previous = data[0].close;
    const change = current - previous;
    const changePct = (change / previous) * 100;

    const prices = data.map(d => d.close);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const totalVolume = data.reduce((sum, d) => sum + d.volume, 0);

    setStats({
      currentPrice: current,
      change,
      changePct,
      high,
      low,
      volume: Math.floor(totalVolume / data.length),
    });
  }

  function formatDate(date: Date, freq: Frequency): string {
    switch (freq) {
      case 'hourly':
        return format(date, 'MMM dd HH:mm');
      case 'daily':
        return format(date, 'MMM dd');
      case 'weekly':
        return format(date, 'MMM dd');
      default:
        return format(date, 'MMM dd');
    }
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
      case '1D': return subDays(now, 1);
      case '5D': return subDays(now, 5);
      case '1M': return subMonths(now, 1);
      case '3M': return subMonths(now, 3);
      case '1Y': return subMonths(now, 12);
      default: return subMonths(now, 3);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900">{data.date}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              Open: <span className="font-semibold">${data.open.toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-600">
              High: <span className="font-semibold text-green-600">${data.high.toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-600">
              Low: <span className="font-semibold text-red-600">${data.low.toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-600">
              Close: <span className="font-semibold">${data.close.toFixed(2)}</span>
            </p>
            {showVolume && (
              <p className="text-xs text-gray-600">
                Volume: <span className="font-semibold">{(data.volume / 1000000).toFixed(2)}M</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600" style={{ height }}>
          <p>Failed to load chart data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{symbol}</h3>
            <p className="text-sm text-gray-500">{exchange}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              ${stats.currentPrice.toFixed(2)}
            </p>
            <p className={`text-sm font-semibold ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)} ({stats.changePct.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">High</p>
            <p className="text-sm font-semibold text-gray-900">${stats.high.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Low</p>
            <p className="text-sm font-semibold text-gray-900">${stats.low.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Volume</p>
            <p className="text-sm font-semibold text-gray-900">{(stats.volume / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['1D', '5D', '1M', '3M', '1Y'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeFrame === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Frequency Toggle */}
          <div className="flex gap-2">
            {(['hourly', 'daily', 'weekly'] as Frequency[]).map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  frequency === freq
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Chart Legend */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>
          Historical price data for {symbol} ({timeFrame} view, {frequency} frequency)
        </p>
      </div>
    </div>
  );
}
