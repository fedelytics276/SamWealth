/**
 * PortfolioSummary Component
 * 
 * Displays portfolio overview with:
 * - Total portfolio value (prominent)
 * - P&L with color coding
 * - Cash vs Holdings breakdown
 * - Today's change (if available)
 * - Auto-refresh indicator
 * - Fetches data from Portfolio API
 */

import React, { useState, useEffect } from 'react';

interface PortfolioSummaryProps {
  userId: string;
  accountType: 'real' | 'paper';
  autoRefresh?: boolean;
}

interface PortfolioData {
  totalValue: number;
  cash: number;
  holdingsValue: number;
  startingCapital: number;
  totalPnL: number;
  totalPnLPct: number;
  todayPnL: number;
  todayPnLPct: number;
  lastUpdated: string;
  marketStatus: {
    anyOpen: boolean;
  };
}

export default function PortfolioSummary({
  userId,
  accountType,
  autoRefresh = true,
}: PortfolioSummaryProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio/${userId}?type=${accountType}`);
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      const portfolio = await res.json();
      setData(portfolio);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [userId, accountType]);

  useEffect(() => {
    if (!autoRefresh || !data) return;

    const isMarketOpen = data.marketStatus.anyOpen;
    const refreshInterval = isMarketOpen ? 15000 : 300000; // 15s or 5min

    const timer = setInterval(fetchPortfolio, refreshInterval);
    return () => clearInterval(timer);
  }, [autoRefresh, data]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12 text-red-600">
          Error loading portfolio: {error}
        </div>
      </div>
    );
  }

  const {
    totalValue,
    cash,
    holdingsValue,
    startingCapital,
    totalPnL,
    totalPnLPct,
    todayPnL,
    todayPnLPct,
    lastUpdated,
  } = data;
  
  const isLive = data.marketStatus.anyOpen;
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getPnLColor = (value: number): string => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPnLBgColor = (value: number): string => {
    if (value > 0) return 'bg-green-50';
    if (value < 0) return 'bg-red-50';
    return 'bg-gray-50';
  };

  const allocationPct = totalValue > 0 ? (holdingsValue / totalValue) * 100 : 0;
  const cashPct = 100 - allocationPct;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Account Type and Live Indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-700">
            {accountType === 'real' ? '💰 Real Portfolio' : '📄 Paper Trading'}
          </h2>
          {isLive && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">LIVE</span>
            </div>
          )}
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Total Value - Large and Prominent */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
        <p className="text-4xl font-bold text-gray-900">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total P&L */}
        <div className={`p-4 rounded-lg ${getPnLBgColor(totalPnL)}`}>
          <p className="text-xs text-gray-600 mb-1">Total P&L</p>
          <p className={`text-2xl font-bold ${getPnLColor(totalPnL)}`}>
            {formatCurrency(totalPnL)}
          </p>
          <p className={`text-sm font-medium ${getPnLColor(totalPnL)}`}>
            {formatPercent(totalPnLPct)}
          </p>
        </div>

        {/* Today's P&L */}
        <div className={`p-4 rounded-lg ${getPnLBgColor(todayPnL)}`}>
          <p className="text-xs text-gray-600 mb-1">Today's Change</p>
          <p className={`text-2xl font-bold ${getPnLColor(todayPnL)}`}>
            {formatCurrency(todayPnL)}
          </p>
          <p className={`text-sm font-medium ${getPnLColor(todayPnL)}`}>
            {formatPercent(todayPnLPct)}
          </p>
        </div>
      </div>

      {/* Cash vs Holdings Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Starting Capital</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(startingCapital)}
          </span>
        </div>

        <div className="h-px bg-gray-200"></div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Cash</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(cash)}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({cashPct.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Holdings</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(holdingsValue)}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({allocationPct.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Visual allocation bar */}
        <div className="mt-4">
          <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
            <div
              className="bg-blue-500"
              style={{ width: `${cashPct}%` }}
              title={`Cash: ${cashPct.toFixed(1)}%`}
            ></div>
            <div
              className="bg-green-500"
              style={{ width: `${allocationPct}%` }}
              title={`Holdings: ${allocationPct.toFixed(1)}%`}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">💵 Cash</span>
            <span className="text-xs text-gray-500">📈 Holdings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
