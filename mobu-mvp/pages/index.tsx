import Link from 'next/link'
import { ArrowRight, Shield, TrendingUp, Globe } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Africa's First
            <span className="block text-primary-600">Transparent Investment Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Every recommendation comes with evidence. Every claim is traceable. 
            Finally, an investment platform that shows its work.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            View Live Demo
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>

        {/* Value Props */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <ValueProp
            icon={<Shield className="h-12 w-12 text-primary-600" />}
            title="Transparent"
            description="See the evidence behind every recommendation. No black boxes. No hidden algorithms."
          />
          <ValueProp
            icon={<TrendingUp className="h-12 w-12 text-primary-600" />}
            title="Evidence-Based"
            description="Every claim links to real data sources. Verify financial statements, market data, and analyst reports."
          />
          <ValueProp
            icon={<Globe className="h-12 w-12 text-primary-600" />}
            title="African-First"
            description="Built for JSE, NGX, and EGX from day one. Deep local market knowledge and data."
          />
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Get Personalized Recommendations"
              description="Based on your risk profile, time horizon, and investment goals."
            />
            <Step
              number="2"
              title="Explore Evidence Trails"
              description="Click any recommendation to see the graph of reasoning behind it."
            />
            <Step
              number="3"
              title="Verify Every Claim"
              description="Trace back to original data sources. See financial statements, market data, and more."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Experience the future of transparent investing
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition"
          >
            Launch Demo
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function ValueProp({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white text-xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}
