import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function Upgrade() {
  const [step, setStep] = useState<'intro' | 'connecting' | 'success'>('intro');

  const handleConnectAlpaca = () => {
    setStep('connecting');
    
    // In production, this would OAuth to Alpaca
    // For demo, simulate connection
    setTimeout(() => {
      // Redirect to Alpaca OAuth
      window.location.href = 'https://app.alpaca.markets/signup';
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Upgrade to Live Trading - MOBU</title>
      </Head>

      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'intro' && (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Ready to Trade for Real?
                </h1>
                <p className="text-xl text-gray-600">
                  Connect your Alpaca account and start executing MOB U's AI recommendations
                  with real money.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Paper Trading */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">📝</div>
                    <h2 className="text-2xl font-bold text-gray-900">Paper Trading</h2>
                    <p className="text-sm text-gray-600 mt-2">Current Mode</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">$100,000 virtual cash</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Zero risk practice</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Real market prices</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Leaderboard competition</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400">No real profits</span>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center font-bold text-gray-900 text-2xl">FREE</p>
                  </div>
                </div>

                {/* Live Trading */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-2xl p-8 text-white relative overflow-hidden border-4 border-blue-400">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-1 text-xs font-bold rounded-bl-lg">
                    RECOMMENDED
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🚀</div>
                    <h2 className="text-2xl font-bold">Live Trading</h2>
                    <p className="text-sm text-blue-100 mt-2">via Alpaca</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Real money trading</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Keep 100% of profits</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Commission-free trading</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Fractional shares (from $1)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Instant execution</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>NYSE & NASDAQ access</span>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-blue-400">
                    <p className="text-center text-sm text-blue-100 mb-2">Start with as little as</p>
                    <p className="text-center font-bold text-3xl">$1</p>
                  </div>
                </div>
              </div>

              {/* Why Alpaca */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Why Alpaca?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🛡️</div>
                    <h3 className="font-bold text-gray-900 mb-2">SEC Regulated</h3>
                    <p className="text-sm text-gray-600">
                      FINRA member, SIPC protected. Your funds are safe.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">💰</div>
                    <h3 className="font-bold text-gray-900 mb-2">Zero Commissions</h3>
                    <p className="text-sm text-gray-600">
                      No trading fees. No hidden costs. Keep more profits.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-bold text-gray-900 mb-2">API-First</h3>
                    <p className="text-sm text-gray-600">
                      Seamlessly integrates with MOBU's AI recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleConnectAlpaca}
                  className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect Alpaca Account
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  Don't have an Alpaca account?{' '}
                  <a
                    href="https://app.alpaca.markets/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up free
                  </a>
                </p>
                <p className="mt-6">
                  <Link href="/dashboard">
                    <a className="text-gray-600 hover:text-gray-900">
                      ← Continue with paper trading
                    </a>
                  </Link>
                </p>
              </div>
            </>
          )}

          {step === 'connecting' && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connecting to Alpaca...
              </h2>
              <p className="text-gray-600">You'll be redirected to authorize MOBU</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
