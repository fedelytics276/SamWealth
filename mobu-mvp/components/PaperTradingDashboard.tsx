/**
 * Paper Trading Dashboard Component
 * 
 * Real-time view of Alpaca paper trading account:
 * - Current portfolio value
 * - P&L (profit/loss)
 * - Active positions
 * - Recent trades
 * - Performance metrics
 * 
 * Auto-refreshes every 10 seconds to show latest data
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PaperAccount {
  equity: number;
  cash: number;
  buying_power: number;
  portfolio_value: number;
  total_pnl: number;
  total_pnl_pct: number;
}

interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  current_price: number;
  market_value: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  change_today: number;
}

interface Order {
  order_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  filled_avg_price: number;
  status: string;
  submitted_at: string;
  filled_at: string;
}

export default function PaperTradingDashboard() {
  const [account, setAccount] = useState<PaperAccount | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch account data
  const fetchAccountData = async () => {
    try {
      const accountRes = await fetch('/api/paper-trading/account');
      
      if (!accountRes.ok) {
        throw new Error(`API error: ${accountRes.status}`);
      }
      
      const accountData = await accountRes.json();
      
      // Check if response contains error
      if (accountData.error) {
        throw new Error(accountData.error);
      }
      
      setAccount(accountData);

      const positionsRes = await fetch('/api/paper-trading/positions');
      const positionsData = await positionsRes.json();
      setPositions(positionsData.error ? [] : positionsData);

      const ordersRes = await fetch('/api/paper-trading/orders?status=closed&limit=10');
      const ordersData = await ordersRes.json();
      setRecentOrders(ordersData.error ? [] : ordersData);

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching paper trading data:', error);
      setLoading(false);
      
      // Set a default empty account to prevent undefined errors
      setAccount({
        equity: 100000,
        cash: 100000,
        buying_power: 100000,
        portfolio_value: 100000,
        total_pnl: 0,
        total_pnl_pct: 0,
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchAccountData();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAccountData();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading paper trading account...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Failed to load paper trading account</p>
        <button 
          onClick={fetchAccountData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const isProfitable = (account?.total_pnl || 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paper Trading Account</h2>
          <p className="text-sm text-gray-600 mt-1">
            Practice with $100,000 virtual cash • Powered by Alpaca
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAccountData}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Portfolio Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${(account.equity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total equity</p>
        </div>

        {/* Cash */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Cash</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${(account.cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Available to invest</p>
        </div>

        {/* Total P&L */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total P&L</p>
          <p className={`text-2xl font-bold mt-2 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}${(account.total_pnl || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}{(account.total_pnl_pct || 0).toFixed(2)}% return
          </p>
        </div>

        {/* Buying Power */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Buying Power</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${(account.buying_power || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Available for trades</p>
        </div>
      </div>

      {/* Active Positions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Positions</h3>
          <p className="text-sm text-gray-600">{positions.length} holdings</p>
        </div>
        <div className="overflow-x-auto">
          {positions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No active positions. Start trading to see your holdings here.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Shares</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Market Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">P&L</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Change</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions.map((position) => {
                  const isProfit = position.unrealized_pl >= 0;
                  const changeTodayPositive = position.change_today >= 0;
                  
                  return (
                    <tr key={position.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{position.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {position.qty.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ${position.avg_entry_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ${position.current_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ${position.market_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}${Math.abs(position.unrealized_pl).toFixed(2)}
                        <div className="text-xs">
                          ({isProfit ? '+' : ''}{position.unrealized_plpc.toFixed(2)}%)
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${changeTodayPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {changeTodayPositive ? '+' : ''}{position.change_today.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link 
                          href={`/evidence/${position.symbol.toLowerCase()}-paper-trade`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Trail →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Trades</h3>
          <p className="text-sm text-gray-600">Last 10 executed orders</p>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No trades yet. Execute your first MOBU recommendation!
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => {
                  const total = order.filled_avg_price * order.qty;
                  
                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.filled_at || order.submitted_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          order.side === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {order.qty?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ${order.filled_avg_price?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Ready to invest with real money?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your paper trading performance: {isProfitable ? '+' : ''}{account.total_pnl_pct.toFixed(2)}% return
            </p>
          </div>
          <Link 
            href="/broker-connect"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Live Broker →
          </Link>
        </div>
      </div>
    </div>
  );
}
