import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, Loader2, ExternalLink, ShoppingCart, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface StockLookupProps {
  onStockSelected?: (ticker: string, evidence: any) => void
}

export default function StockLookup({ onStockSelected }: StockLookupProps) {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evidence, setEvidence] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const supportedTickers = [
    'AAPL', 'NVDA', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META',
    'DANGCEM', 'EQTY', 'AGL', 'SHP', 'MTN'
  ]

  const searchStock = async (tickerSymbol: string) => {
    if (!tickerSymbol.trim()) {
      setError('Please enter a ticker symbol')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/evidence/generate?ticker=${tickerSymbol.toUpperCase()}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch stock data')
      }

      setEvidence(data.data)
      if (onStockSelected) {
        onStockSelected(tickerSymbol.toUpperCase(), data.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setEvidence(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchStock(ticker)
  }

  const handleQuickSelect = (tickerSymbol: string) => {
    setTicker(tickerSymbol)
    searchStock(tickerSymbol)
  }

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      // Stop auto-refresh
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
      setAutoRefresh(false)
    } else {
      // Start auto-refresh (every 30 seconds)
      setAutoRefresh(true)
      const interval = setInterval(() => {
        if (ticker) {
          searchStock(ticker)
        }
      }, 30000) // 30 seconds
      setRefreshInterval(interval)
    }
  }

  const handlePurchase = () => {
    if (!evidence) return
    
    // In production: integrate with broker API (EasyEquities, Bamboo, etc.)
    alert(`🛒 Purchase flow initiated for ${evidence.ticker}\n\nIn production, this would:\n1. Connect to your broker (EasyEquities, Bamboo, Chaka)\n2. Pre-fill order: ${evidence.action} ${evidence.ticker} at market price\n3. Confirm and execute trade\n\nFor now, this is a demo.`)
  }

  const isBuy = evidence?.action === 'BUY'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stock Intelligence Search</h2>
        <p className="text-sm text-gray-600">
          Enter any stock ticker to view AI-powered evidence trail and recommendation
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g., AAPL, NVDA, DANGCEM)"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-lg font-semibold"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !ticker.trim()}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Select Tickers */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {supportedTickers.map((t) => (
            <button
              key={t}
              onClick={() => handleQuickSelect(t)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Evidence Result */}
      {evidence && (
        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-white to-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{evidence.ticker}</h3>
                <span className={`flex items-center space-x-1 px-3 py-1 rounded-full font-semibold text-sm ${
                  isBuy 
                    ? 'bg-green-100 text-green-800' 
                    : evidence.action === 'SELL'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isBuy ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{evidence.action}</span>
                </span>
              </div>
              <p className="text-gray-600 font-medium">{evidence.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Generated {new Date(evidence.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
              <p className="text-3xl font-bold text-primary-600">
                {(evidence.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-xl font-bold text-gray-900">
                ${evidence.currentPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Target Price</p>
              <p className="text-xl font-bold text-gray-900">
                ${evidence.priceTarget.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Expected Upside</p>
              <p className={`text-xl font-bold ${
                evidence.upside >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {evidence.upside >= 0 ? '+' : ''}{evidence.upside.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link
              href={`/evidence/${evidence.recommendationId}`}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              <ExternalLink className="h-5 w-5" />
              <span>View Full Evidence Trail</span>
            </Link>
            
            <button
              onClick={handlePurchase}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-semibold rounded-lg transition ${
                isBuy
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!isBuy}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{isBuy ? 'Purchase Stock' : 'Not Recommended'}</span>
            </button>

            <button
              onClick={toggleAutoRefresh}
              className={`px-4 py-3 rounded-lg font-semibold transition flex items-center space-x-2 ${
                autoRefresh
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{autoRefresh ? 'Auto' : 'Manual'}</span>
            </button>
          </div>

          {autoRefresh && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Auto-refreshing every 30 seconds
            </p>
          )}

          {/* Summary Preview */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {evidence.summary.substring(0, 200)}...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
