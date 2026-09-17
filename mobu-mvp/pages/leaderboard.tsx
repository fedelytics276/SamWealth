import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/Navigation';

interface LeaderboardEntry {
  rank: number;
  username: string;
  equity: number;
  return: number;
  trades: number;
  winRate: number;
  sharpe: number;
  badge: string | null;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?period=${period}`);
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRowColor = (username: string, rank: number) => {
    if (username.includes('(You)')) {
      return 'bg-blue-50 border-l-4 border-blue-500';
    }
    if (rank === 1) return 'bg-yellow-50';
    if (rank === 2) return 'bg-gray-50';
    if (rank === 3) return 'bg-orange-50';
    return '';
  };

  return (
    <>
      <Head>
        <title>Leaderboard - MOBU Paper Trading</title>
      </Head>

      <Navigation />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🏆 Paper Trading Leaderboard
            </h1>
            <p className="text-lg text-gray-600">
              Compete with other traders. Practice makes perfect!
            </p>
          </div>

          {/* Period Selector */}
          <div className="mb-6 flex justify-center space-x-4">
            {['weekly', 'monthly', 'all_time'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {p === 'all_time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to Go Live?</h3>
                <p className="text-blue-100">
                  Connect your Alpaca account and start trading with real money.
                  Paper trading helps you practice risk-free!
                </p>
              </div>
              <Link href="/upgrade">
                <a className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Upgrade to Live Trading
                </a>
              </Link>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trader
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Portfolio Value
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Return
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trades
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sharpe Ratio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.rank}
                        className={`hover:bg-gray-50 transition-colors ${getRowColor(entry.username, entry.rank)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-700">
                              #{entry.rank}
                            </span>
                            {entry.badge && (
                              <span className="ml-2 text-3xl">{entry.badge}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {entry.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(entry.equity)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div
                            className={`text-sm font-bold ${
                              entry.return >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {entry.return >= 0 ? '+' : ''}
                            {entry.return.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{entry.trades}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            {entry.winRate.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div
                            className={`text-sm font-medium ${
                              entry.sharpe >= 1.5
                                ? 'text-green-600'
                                : entry.sharpe >= 1.0
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {entry.sharpe.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📊 How Rankings Work
              </h3>
              <p className="text-sm text-gray-600">
                Rankings are based on % return. Higher returns = higher rank. Paper
                trading is risk-free with $100,000 virtual cash.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🎯 Win Rate Formula
              </h3>
              <p className="text-sm text-gray-600">
                Win Rate = (Winning Trades / Total Trades) × 100%. A good win rate is
                above 60%.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📈 Sharpe Ratio
              </h3>
              <p className="text-sm text-gray-600">
                Measures risk-adjusted returns. Above 1.5 is excellent. Above 1.0 is
                good. It's one of MOBU's 4 quality criteria.
              </p>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link href="/dashboard">
              <a className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
