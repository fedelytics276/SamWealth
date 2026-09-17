/**
 * MarketStatus Component
 * 
 * Displays market status with:
 * - Open/Closed indicators
 * - Countdown to next event
 * - Support for multiple exchanges
 * - Color-coded status
 * - Fetches data from Portfolio API
 */

import React, { useState, useEffect } from 'react';

interface MarketStatusProps {
  exchanges: string[];
  showDetails?: boolean;
  autoRefresh?: boolean;
}

export default function MarketStatus({ exchanges, showDetails = true, autoRefresh = true }: MarketStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketData, setMarketData] = useState<{
    anyOpen: boolean;
    exchanges: Record<string, string>;
  } | null>(null);

  // Fetch market status from API
  const fetchMarketStatus = async () => {
    try {
      // Use user_001 as reference to get market status
      const res = await fetch('/api/portfolio/user_001?type=real');
      if (res.ok) {
        const data = await res.json();
        setMarketData(data.marketStatus);
      }
    } catch (err) {
      console.error('Failed to fetch market status:', err);
    }
  };

  useEffect(() => {
    fetchMarketStatus();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(fetchMarketStatus, 60000); // Refresh every minute
    return () => clearInterval(timer);
  }, [autoRefresh]);

  // Update time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const anyOpen = marketData?.anyOpen || false;
  const exchangeStatus = marketData?.exchanges || {};

  // Filter to requested exchanges only
  const filteredExchanges = Object.fromEntries(
    Object.entries(exchangeStatus).filter(([exchange]) => exchanges.includes(exchange))
  );

  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open')) return 'text-green-600';
    if (lowerStatus.includes('pre-market') || lowerStatus.includes('after-hours')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open')) return '🟢';
    if (lowerStatus.includes('pre-market') || lowerStatus.includes('after-hours')) return '🟡';
    return '🔴';
  };

  const getStatusBgColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open')) return 'bg-green-50 border-green-200';
    if (lowerStatus.includes('pre-market') || lowerStatus.includes('after-hours')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusText = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open')) return 'OPEN';
    if (lowerStatus.includes('pre-market')) return 'PRE-MARKET';
    if (lowerStatus.includes('after-hours')) return 'AFTER-HOURS';
    return 'CLOSED';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Market Status</h3>
        <div className="flex items-center gap-2">
          {anyOpen ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Markets Trading</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">All Markets Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Current Time */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500">Current Time</p>
        <p className="text-xl font-semibold text-gray-900">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </p>
        <p className="text-xs text-gray-400">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Exchange Status List */}
      <div className="space-y-2">
        {Object.entries(filteredExchanges).map(([exchange, status]) => (
          <div
            key={exchange}
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusBgColor(status)}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getStatusIcon(status)}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{exchange}</p>
                <p className={`text-xs font-medium ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🟢</span>
            <span className="text-gray-600">Trading</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟡</span>
            <span className="text-gray-600">Extended</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔴</span>
            <span className="text-gray-600">Closed</span>
          </div>
        </div>
      </div>

      {/* Refresh Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Auto-refresh: {anyOpen ? '15 seconds' : '5 minutes'}</span>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${anyOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
