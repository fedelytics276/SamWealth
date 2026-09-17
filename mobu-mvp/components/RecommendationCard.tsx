import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface RecommendationCardProps {
  id: string
  ticker: string
  name: string
  action: 'BUY' | 'SELL'
  confidence: number
  priceTarget: number
  currentPrice: number
  upside: number
  reasoning: string
  sector: string
  exchange: string
}

export default function RecommendationCard({
  id,
  ticker,
  name,
  action,
  confidence,
  priceTarget,
  currentPrice,
  upside,
  reasoning,
  sector,
  exchange,
}: RecommendationCardProps) {
  const isBuy = action === 'BUY'
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-2xl font-bold text-gray-900">{ticker}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {exchange}
            </span>
          </div>
          <p className="text-sm text-gray-600">{name}</p>
          <p className="text-xs text-gray-500 mt-1">{sector}</p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-semibold text-sm ${
          isBuy 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isBuy ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{action}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-gray-900">
              {(confidence * 100).toFixed(0)}
            </p>
            <p className="text-sm text-gray-500">%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Current Price</p>
          <p className="text-lg font-bold text-gray-900">
            R {currentPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Target Price</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-lg font-bold text-gray-900">
              R {priceTarget.toFixed(2)}
            </p>
            <p className={`text-sm font-semibold ${
              upside >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {reasoning}
      </p>

      {/* CTA */}
      <Link
        href={`/evidence/${id}`}
        className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
      >
        <span>View Evidence Trail</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
