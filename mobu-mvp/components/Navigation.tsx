import Link from 'next/link'
import { Home, TrendingUp, BarChart3 } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Fede Analytics + MOBU Logo */}
          <div className="flex items-center space-x-4">
            {/* Fede Analytics Logo - Primary Branding */}
            <Link href="https://fedeanalytics.com" target="_blank" className="flex items-center space-x-3 hover:opacity-90 transition group">
              <div className="relative">
                {/* Fede Analytics Icon */}
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                  <BarChart3 className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                {/* Active indicator dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 leading-tight tracking-tight">Fede Analytics</span>
                <span className="text-xs text-gray-600 leading-tight font-medium">AI Investment Intelligence</span>
              </div>
            </Link>

            {/* Separator */}
            <div className="h-10 w-px bg-gray-300"></div>

            {/* MOBU Product Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <TrendingUp className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">MOBU</span>
                <span className="text-xs text-gray-500 leading-tight">Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/paper-trading"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Paper Trading</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                TM
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">Demo User</span>
                <span className="text-sm font-semibold text-gray-900 leading-tight">Thabo M.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
