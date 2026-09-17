/**
 * HoldingsTable Component
 * 
 * Displays portfolio holdings with:
 * - Symbol, Exchange, Quantity, Prices, P&L
 * - Live price indicator
 * - Market status badges
 * - Allocation percentages
 * - Color-coded P&L
 * - Fetches data from Portfolio API
 */

import React, { useState, useEffect } from 'react';

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

interface HoldingsTableProps {
  userId: string;
  accountType: 'real' | 'paper';
  autoRefresh?: boolean;
}

interface PortfolioData {
  holdings: Holding[];
  marketStatus: {
    anyOpen: boolean;
  };
}

export default function HoldingsTable({ userId, accountType, autoRefresh = true }: HoldingsTableProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = async () => {
    try {
      const res = await fetch(`/api/portfolio/${userId}?type=${accountType}`);
      if (!res.ok) throw new Error('Failed to fetch holdings');
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
    fetchHoldings();
  }, [userId, accountType]);

  useEffect(() => {
    if (!autoRefresh || !data) return;

    const isMarketOpen = data.marketStatus.anyOpen;
    const refreshInterval = isMarketOpen ? 15000 : 300000; // 15s or 5min

    const timer = setInterval(fetchHoldings, refreshInterval);
    return () => clearInterval(timer);
  }, [autoRefresh, data]);

  const holdings = data?.holdings || [];
  const isLoading = loading;
  
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

  const getMarketStatusBadge = (status: string): JSX.Element => {
    const isOpen = status.includes('OPEN') || status.includes('🟢');
    
    if (isOpen) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          OPEN
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        CLOSED
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Holdings</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No holdings yet</p>
          <p className="text-sm text-gray-400 mt-2">Start investing to see your portfolio here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">
          Holdings ({holdings.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exchange
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding, index) => (
              <tr key={`${holding.symbol}-${holding.exchange}-${index}`} className="hover:bg-gray-50">
                {/* Symbol & Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {holding.symbol}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {holding.asset_name}
                    </div>
                  </div>
                </td>

                {/* Exchange with Market Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      {holding.exchange}
                    </span>
                    {getMarketStatusBadge(holding.market_status)}
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm text-gray-900">
                    {holding.quantity.toLocaleString()}
                  </span>
                </td>

                {/* Average Cost Basis */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm text-gray-600">
                    {formatCurrency(holding.avg_cost_basis)}
                  </span>
                </td>

                {/* Current Price */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(holding.current_price)}
                  </span>
                </td>

                {/* Market Value */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(holding.market_value)}
                  </span>
                </td>

                {/* P&L */}
                <td className={`px-6 py-4 whitespace-nowrap text-right ${getPnLBgColor(holding.unrealized_pnl)}`}>
                  <div>
                    <div className={`text-sm font-semibold ${getPnLColor(holding.unrealized_pnl)}`}>
                      {formatCurrency(holding.unrealized_pnl)}
                    </div>
                    <div className={`text-xs font-medium ${getPnLColor(holding.unrealized_pnl)}`}>
                      {formatPercent(holding.unrealized_pnl_pct)}
                    </div>
                  </div>
                </td>

                {/* Allocation */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(holding.allocation_pct, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {holding.allocation_pct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
