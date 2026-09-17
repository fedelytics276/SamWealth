/**
 * Paper Trading Dashboard Page
 * 
 * Full-featured paper trading experience powered by Alpaca
 * - Real-time portfolio updates
 * - Position tracking with P&L
 * - Trade history
 * - Evidence trails for each trade
 * - Performance metrics
 */

import { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import PaperTradingDashboard from '../components/PaperTradingDashboard';

export default function PaperTradingPage() {
  return (
    <>
      <Head>
        <title>Paper Trading | MOBU - AI Investment Intelligence</title>
        <meta name="description" content="Practice trading with $100,000 virtual cash using real market prices" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Paper Trading</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Practice MOBU recommendations risk-free with $100,000 virtual cash
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                  Live Market Data
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Powered by Alpaca
                </span>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong className="font-semibold">How it works:</strong> Your paper trading account uses real market prices from NASDAQ and NYSE. 
                  All trades execute instantly using Alpaca's paper trading API. No real money at risk. Perfect for testing MOBU's AI recommendations before going live.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Component */}
          <PaperTradingDashboard />

          {/* Educational Resources */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Evidence Trails</h3>
              <p className="text-sm text-gray-600 mb-4">
                Every trade shows complete data lineage - see exactly why MOBU recommended each stock.
              </p>
              <a href="/evidence/aapl-paper-trade" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View AAPL Evidence Trail →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Performance Tracking</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track your win rate, Sharpe ratio, and compare against other paper traders on the leaderboard.
              </p>
              <a href="/leaderboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Leaderboard →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Upgrade to Live Trading</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ready to invest with real money? Connect your broker and execute MOBU recommendations live.
              </p>
              <a href="/broker-connect" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Connect Broker →
              </a>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-2xl font-bold text-white mb-4">Why Use Paper Trading?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">Risk-Free Learning</h3>
                    <p className="mt-1 text-blue-100 text-sm">
                      Test strategies without risking real capital. Perfect for building confidence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">Real Market Prices</h3>
                    <p className="mt-1 text-blue-100 text-sm">
                      Trades execute at actual market prices via Alpaca, not simulated data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">Track Performance</h3>
                    <p className="mt-1 text-blue-100 text-sm">
                      Measure Sharpe ratio, win rate, drawdowns - see if you're ready for live trading.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">Same AI Recommendations</h3>
                    <p className="mt-1 text-blue-100 text-sm">
                      Practice with the same high-conviction signals live users receive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
