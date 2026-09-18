import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Navigation from '@/components/Navigation'
import EvidenceGraph from '@/components/EvidenceGraph'
import { ArrowLeft, Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface EvidenceNode {
  id: string
  type: string
  title: string
  summary: string
  confidence: number
  source?: string
  details?: string
}

interface EvidenceEdge {
  from: string
  to: string
  label?: string
}

interface EvidenceData {
  recommendationId: string
  ticker: string
  name: string
  action: 'BUY' | 'SELL'
  confidence: number
  priceTarget: number
  currentPrice: number
  upside: number
  nodes: EvidenceNode[]
  edges: EvidenceEdge[]
  summary: string
  keyFactors: string[]
}

export default function EvidenceTrail() {
  const router = useRouter()
  const { id } = router.query
  
  const [evidence, setEvidence] = useState<EvidenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchEvidence = async () => {
      try {
        setLoading(true)
        setError(null)

        // First try static evidence trail API
        let res = await fetch(`/api/evidence/${id}`)
        
        // If not found, try generating dynamically
        if (res.status === 404) {
          // Extract ticker from recommendation ID (e.g., "rec-aapl-123" -> "AAPL")
          const tickerMatch = id.toString().match(/rec-([a-z]+)-/i)
          if (tickerMatch) {
            const ticker = tickerMatch[1].toUpperCase()
            res = await fetch(`/api/evidence/generate?ticker=${ticker}`)
          }
        }
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Evidence trail not found')
          }
          throw new Error('Failed to fetch evidence')
        }

        const data = await res.json()
        setEvidence(data.data || data.evidence)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvidence()
  }, [id])

  const isBuy = evidence?.action === 'BUY'

  return (
    <>
      <Head>
        <title>
          {evidence ? `${evidence.ticker} Evidence Trail - MOBU` : 'Evidence Trail - MOBU'}
        </title>
        <meta name="description" content="View the complete AI reasoning behind this recommendation" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition mb-6 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading evidence trail...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-semibold">Error loading evidence trail</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && evidence && (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {evidence.ticker}
                      </h1>
                      <span className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-semibold text-sm ${
                        isBuy 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isBuy ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{evidence.action}</span>
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 mb-1">{evidence.name}</p>
                    <p className="text-sm text-gray-500">Evidence Trail Visualization</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">AI Confidence</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {(evidence.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      R {evidence.currentPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      R {evidence.priceTarget.toFixed(2)}
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
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{evidence.summary}</p>
                
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Factors:</h3>
                <ul className="space-y-2">
                  {evidence.keyFactors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-600 font-bold mt-1">•</span>
                      <span className="text-gray-700 text-sm">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Graph */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Evidence Graph
                  </h2>
                  <p className="text-sm text-gray-600">
                    Click on any node to view detailed information. Each node represents a piece of evidence 
                    that contributed to this recommendation.
                  </p>
                </div>
                
                <div className="h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden">
                  <EvidenceGraph 
                    nodes={evidence.nodes} 
                    edges={evidence.edges}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Legend</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                    <span className="text-sm text-gray-700">Recommendation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
                    <span className="text-sm text-gray-700">Financial Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
                    <span className="text-sm text-gray-700">Market Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                    <span className="text-sm text-gray-700">Technical Indicators</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
                    <span className="text-sm text-gray-700">Sentiment Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0891b2' }}></div>
                    <span className="text-sm text-gray-700">Regulatory Info</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

// Use server-side rendering instead of static generation
// This prevents the "getStaticPaths is not a function" error
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Simply return props - actual data fetching happens client-side
  return {
    props: {},
  }
}
