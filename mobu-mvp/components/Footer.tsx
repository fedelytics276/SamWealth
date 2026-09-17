import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fede Analytics Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg tracking-tighter">FA</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-800 leading-tight">Fede Analytics</span>
                <span className="text-xs text-slate-500 leading-tight">Investment Intelligence</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              AI-powered investment platform delivering transparent, evidence-based recommendations with full data lineage.
            </p>
          </div>

          {/* MOBU Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              MOBU Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-600 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-600">Evidence Trails</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Portfolio Analytics</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Compliance Reports</span>
              </li>
            </ul>
          </div>

          {/* Quality & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Quality Assurance
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>99.95%+ Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sharpe Ratio &ge; 1.5</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Self-Improving AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-700">Fede Analytics</span>. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md font-medium">
                MOBU v1.0 MVP
              </span>
              <span className="text-gray-400">•</span>
              <span>A product of Fede Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
