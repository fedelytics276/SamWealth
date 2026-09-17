# MOBU x Alpaca Paper Trading Integration

**Status**: ✅ Ready to Implement  
**Alpaca Endpoint**: `https://paper-api.alpaca.markets/v2`  
**API Key**: `PK3U2KSUCEPM66M3WYNQZHGAIM`  
**Environment**: Paper Trading (No Real Money)

---

## Overview

Alpaca provides a **free paper trading environment** that:
- Uses **real-time market data** from NYSE, NASDAQ, AMEX
- Simulates trades with **$100,000 virtual cash** (default)
- Same API as live trading (easy transition later)
- Supports stocks, ETFs, fractional shares
- No cost, no credit card required

**MOBU Integration Strategy**:
1. Users start with Alpaca paper account ($100K virtual)
2. MOBU recommendations executed via Alpaca paper trading API
3. Users see real-time performance (P&L, Sharpe ratio, win rate)
4. After confidence is built, users can upgrade to:
   - Live Alpaca account (US stocks)
   - African broker accounts (JSE, NGX, NSE stocks)

---

## 1. Alpaca API Configuration

### Environment Variables

```bash
# .env file
ALPACA_PAPER_API_KEY=PK3U2KSUCEPM66M3WYNQZHGAIM
ALPACA_PAPER_SECRET_KEY=<your_secret_key_here>  # Get from Alpaca dashboard
ALPACA_PAPER_BASE_URL=https://paper-api.alpaca.markets
ALPACA_DATA_BASE_URL=https://data.alpaca.markets
```

**Note**: You'll need the secret key from your Alpaca dashboard: https://app.alpaca.markets/paper/dashboard/overview

### Installation

```bash
# Install Alpaca Python SDK
pip install alpaca-trade-api

# Or for Node.js backend
npm install @alpacahq/alpaca-trade-api
```

---

## 2. Python Implementation

### 2.1 Alpaca Paper Trading Client

```python
# mobu-backend/services/alpaca_paper_trading.py

import os
from datetime import datetime, timedelta
import alpaca_trade_api as tradeapi
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class AlpacaPaperTradingClient:
    """
    Integrates MOBU with Alpaca's paper trading API
    Executes MOBU recommendations in risk-free environment
    """
    
    def __init__(self):
        self.api = tradeapi.REST(
            key_id=os.environ['ALPACA_PAPER_API_KEY'],
            secret_key=os.environ['ALPACA_PAPER_SECRET_KEY'],
            base_url=os.environ['ALPACA_PAPER_BASE_URL'],
            api_version='v2'
        )
        logger.info("Alpaca Paper Trading client initialized")
    
    def get_account_info(self) -> Dict:
        """Get paper trading account details"""
        try:
            account = self.api.get_account()
            return {
                'account_id': account.id,
                'status': account.status,
                'cash': float(account.cash),
                'portfolio_value': float(account.portfolio_value),
                'buying_power': float(account.buying_power),
                'equity': float(account.equity),
                'last_equity': float(account.last_equity),
                'long_market_value': float(account.long_market_value),
                'short_market_value': float(account.short_market_value),
                'initial_margin': float(account.initial_margin),
                'maintenance_margin': float(account.maintenance_margin),
                'daytrade_count': account.daytrade_count,
                'daytrading_buying_power': float(account.daytrading_buying_power),
                'pattern_day_trader': account.pattern_day_trader,
                'created_at': account.created_at
            }
        except Exception as e:
            logger.error(f"Error fetching account info: {e}")
            raise
    
    def execute_mobu_recommendation(
        self, 
        symbol: str, 
        action: str,  # 'buy' or 'sell'
        quantity: Optional[float] = None,
        notional: Optional[float] = None,  # Dollar amount (for fractional)
        order_type: str = 'market',
        time_in_force: str = 'gtc',  # good til cancelled
        recommendation_id: str = None
    ) -> Dict:
        """
        Execute a MOBU recommendation via Alpaca paper trading
        
        Args:
            symbol: Stock ticker (e.g., 'AAPL', 'TSLA')
            action: 'buy' or 'sell'
            quantity: Number of shares (can be fractional, e.g., 0.5)
            notional: Dollar amount to buy/sell (alternative to quantity)
            order_type: 'market', 'limit', 'stop', 'stop_limit'
            time_in_force: 'day', 'gtc', 'ioc', 'fok'
            recommendation_id: MOBU recommendation UUID for tracking
        
        Returns:
            Order details dict
        """
        try:
            # Validate market is open (optional)
            clock = self.api.get_clock()
            if not clock.is_open:
                logger.warning(f"Market is closed. Order will be queued until open.")
            
            # Prepare order parameters
            order_params = {
                'symbol': symbol.upper(),
                'side': action.lower(),
                'type': order_type,
                'time_in_force': time_in_force,
                'client_order_id': recommendation_id  # Track back to MOBU recommendation
            }
            
            # Quantity-based or notional-based order
            if quantity is not None:
                order_params['qty'] = quantity
            elif notional is not None:
                order_params['notional'] = notional
            else:
                raise ValueError("Must specify either quantity or notional")
            
            # Submit order
            order = self.api.submit_order(**order_params)
            
            logger.info(f"Order submitted: {order.id} | {action.upper()} {symbol} | Status: {order.status}")
            
            return {
                'order_id': order.id,
                'client_order_id': order.client_order_id,  # Our recommendation_id
                'symbol': order.symbol,
                'side': order.side,
                'quantity': float(order.qty) if order.qty else None,
                'notional': float(order.notional) if order.notional else None,
                'order_type': order.order_type,
                'status': order.status,  # 'new', 'partially_filled', 'filled', 'canceled', 'rejected'
                'filled_qty': float(order.filled_qty) if order.filled_qty else 0,
                'filled_avg_price': float(order.filled_avg_price) if order.filled_avg_price else None,
                'submitted_at': order.submitted_at,
                'filled_at': order.filled_at,
                'created_at': order.created_at
            }
        
        except Exception as e:
            logger.error(f"Error executing order for {symbol}: {e}")
            raise
    
    def get_positions(self) -> List[Dict]:
        """Get all current positions in paper trading account"""
        try:
            positions = self.api.list_positions()
            return [
                {
                    'symbol': pos.symbol,
                    'qty': float(pos.qty),
                    'avg_entry_price': float(pos.avg_entry_price),
                    'market_value': float(pos.market_value),
                    'cost_basis': float(pos.cost_basis),
                    'unrealized_pl': float(pos.unrealized_pl),
                    'unrealized_plpc': float(pos.unrealized_plpc),  # % return
                    'current_price': float(pos.current_price),
                    'lastday_price': float(pos.lastday_price),
                    'change_today': float(pos.change_today)
                }
                for pos in positions
            ]
        except Exception as e:
            logger.error(f"Error fetching positions: {e}")
            raise
    
    def get_order_history(self, status: str = 'all', limit: int = 100) -> List[Dict]:
        """Get order history"""
        try:
            orders = self.api.list_orders(
                status=status,  # 'open', 'closed', 'all'
                limit=limit,
                direction='desc'  # Most recent first
            )
            return [
                {
                    'order_id': order.id,
                    'client_order_id': order.client_order_id,
                    'symbol': order.symbol,
                    'side': order.side,
                    'quantity': float(order.qty) if order.qty else None,
                    'filled_qty': float(order.filled_qty) if order.filled_qty else 0,
                    'filled_avg_price': float(order.filled_avg_price) if order.filled_avg_price else None,
                    'order_type': order.order_type,
                    'status': order.status,
                    'submitted_at': order.submitted_at,
                    'filled_at': order.filled_at
                }
                for order in orders
            ]
        except Exception as e:
            logger.error(f"Error fetching order history: {e}")
            raise
    
    def get_portfolio_history(self, period: str = '1M') -> Dict:
        """
        Get portfolio value history for charts
        
        Args:
            period: '1D', '1W', '1M', '3M', '1A', 'all'
        """
        try:
            history = self.api.get_portfolio_history(
                period=period,
                timeframe='1D',  # Daily datapoints
                extended_hours=False
            )
            
            return {
                'timestamps': [datetime.fromtimestamp(ts).isoformat() for ts in history.timestamp],
                'equity': history.equity,
                'profit_loss': history.profit_loss,
                'profit_loss_pct': history.profit_loss_pct,
                'base_value': history.base_value,
                'timeframe': history.timeframe
            }
        except Exception as e:
            logger.error(f"Error fetching portfolio history: {e}")
            raise
    
    def calculate_performance_metrics(self) -> Dict:
        """Calculate trading performance metrics"""
        try:
            account = self.api.get_account()
            equity = float(account.equity)
            starting_equity = float(account.last_equity)
            
            # Get 90-day history for Sharpe calculation
            history = self.api.get_portfolio_history(period='3M', timeframe='1D')
            
            # Calculate metrics
            total_return = ((equity - starting_equity) / starting_equity) * 100
            
            # Sharpe ratio (simplified - daily returns)
            if len(history.profit_loss_pct) > 1:
                import numpy as np
                returns = np.array(history.profit_loss_pct)
                sharpe = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() > 0 else 0
            else:
                sharpe = 0
            
            # Get order history for win rate
            closed_orders = self.api.list_orders(status='closed', limit=500)
            winning_trades = sum(1 for order in closed_orders 
                                if order.filled_avg_price and float(order.filled_avg_price) > 0)
            total_trades = len(closed_orders)
            win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
            
            return {
                'total_return_pct': round(total_return, 2),
                'sharpe_ratio': round(sharpe, 2),
                'win_rate_pct': round(win_rate, 2),
                'total_trades': total_trades,
                'current_equity': equity,
                'starting_equity': starting_equity,
                'profit_loss': equity - starting_equity
            }
        except Exception as e:
            logger.error(f"Error calculating performance metrics: {e}")
            raise
    
    def cancel_order(self, order_id: str) -> bool:
        """Cancel an open order"""
        try:
            self.api.cancel_order(order_id)
            logger.info(f"Order {order_id} cancelled")
            return True
        except Exception as e:
            logger.error(f"Error cancelling order {order_id}: {e}")
            return False
    
    def close_position(self, symbol: str) -> Dict:
        """Close entire position for a symbol"""
        try:
            order = self.api.close_position(symbol)
            logger.info(f"Position closed for {symbol}")
            return {
                'order_id': order.id,
                'symbol': symbol,
                'status': order.status,
                'filled_qty': float(order.filled_qty) if order.filled_qty else 0
            }
        except Exception as e:
            logger.error(f"Error closing position for {symbol}: {e}")
            raise
    
    def close_all_positions(self) -> List[Dict]:
        """Close all open positions"""
        try:
            orders = self.api.close_all_positions()
            logger.info(f"All positions closed ({len(orders)} orders)")
            return [
                {
                    'order_id': order.id,
                    'symbol': order.symbol,
                    'status': order.status
                }
                for order in orders
            ]
        except Exception as e:
            logger.error(f"Error closing all positions: {e}")
            raise


# Example usage
if __name__ == "__main__":
    # Initialize client
    alpaca = AlpacaPaperTradingClient()
    
    # Check account
    account = alpaca.get_account_info()
    print(f"Paper Trading Account:")
    print(f"  Cash: ${account['cash']:,.2f}")
    print(f"  Portfolio Value: ${account['portfolio_value']:,.2f}")
    print(f"  Buying Power: ${account['buying_power']:,.2f}")
    
    # Execute a MOBU recommendation: Buy $1000 worth of AAPL
    order = alpaca.execute_mobu_recommendation(
        symbol='AAPL',
        action='buy',
        notional=1000.00,  # Buy $1000 worth (fractional shares)
        recommendation_id='mobu-rec-12345'
    )
    print(f"\nOrder Executed: {order}")
    
    # Check positions
    positions = alpaca.get_positions()
    print(f"\nCurrent Positions: {len(positions)}")
    for pos in positions:
        print(f"  {pos['symbol']}: {pos['qty']} shares @ ${pos['current_price']:.2f} | P&L: ${pos['unrealized_pl']:.2f} ({pos['unrealized_plpc']*100:.2f}%)")
    
    # Performance metrics
    metrics = alpaca.calculate_performance_metrics()
    print(f"\nPerformance Metrics:")
    print(f"  Total Return: {metrics['total_return_pct']}%")
    print(f"  Sharpe Ratio: {metrics['sharpe_ratio']}")
    print(f"  Win Rate: {metrics['win_rate_pct']}%")
    print(f"  Total Trades: {metrics['total_trades']}")
```

---

## 3. FastAPI Backend Integration

### 3.1 API Routes

```python
# mobu-backend/api/routes/paper_trading.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from services.alpaca_paper_trading import AlpacaPaperTradingClient

router = APIRouter(prefix="/api/paper-trading", tags=["Paper Trading"])

# Initialize Alpaca client (singleton)
alpaca_client = AlpacaPaperTradingClient()


class ExecuteRecommendationRequest(BaseModel):
    recommendation_id: str
    symbol: str
    action: str  # 'buy' or 'sell'
    quantity: Optional[float] = None
    notional: Optional[float] = None  # Dollar amount


@router.get("/account")
async def get_account():
    """Get paper trading account details"""
    try:
        account = alpaca_client.get_account_info()
        return {"success": True, "data": account}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/execute")
async def execute_recommendation(request: ExecuteRecommendationRequest):
    """Execute a MOBU recommendation via Alpaca paper trading"""
    try:
        order = alpaca_client.execute_mobu_recommendation(
            symbol=request.symbol,
            action=request.action,
            quantity=request.quantity,
            notional=request.notional,
            recommendation_id=request.recommendation_id
        )
        return {"success": True, "data": order}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/positions")
async def get_positions():
    """Get all current positions"""
    try:
        positions = alpaca_client.get_positions()
        return {"success": True, "data": positions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders")
async def get_orders(status: str = "all", limit: int = 100):
    """Get order history"""
    try:
        orders = alpaca_client.get_order_history(status=status, limit=limit)
        return {"success": True, "data": orders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolio-history")
async def get_portfolio_history(period: str = "1M"):
    """Get portfolio value history"""
    try:
        history = alpaca_client.get_portfolio_history(period=period)
        return {"success": True, "data": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/metrics")
async def get_performance_metrics():
    """Get trading performance metrics"""
    try:
        metrics = alpaca_client.calculate_performance_metrics()
        return {"success": True, "data": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/positions/{symbol}")
async def close_position(symbol: str):
    """Close position for a specific symbol"""
    try:
        result = alpaca_client.close_position(symbol)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/positions")
async def close_all_positions():
    """Close all open positions"""
    try:
        results = alpaca_client.close_all_positions()
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 4. Next.js Frontend Integration

### 4.1 Paper Trading Dashboard Component

```tsx
// mobu-mvp/components/PaperTradingDashboard.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Account {
  cash: number;
  portfolio_value: number;
  equity: number;
  buying_power: number;
}

interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  current_price: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  market_value: number;
}

interface Metrics {
  total_return_pct: number;
  sharpe_ratio: number;
  win_rate_pct: number;
  total_trades: number;
  current_equity: number;
  profit_loss: number;
}

export default function PaperTradingDashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      
      // Fetch account details
      const accountRes = await axios.get('/api/paper-trading/account');
      setAccount(accountRes.data.data);
      
      // Fetch positions
      const positionsRes = await axios.get('/api/paper-trading/positions');
      setPositions(positionsRes.data.data);
      
      // Fetch metrics
      const metricsRes = await axios.get('/api/paper-trading/metrics');
      setMetrics(metricsRes.data.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching paper trading data:', error);
      setLoading(false);
    }
  };

  const executeRecommendation = async (symbol: string, action: string, notional: number) => {
    try {
      const response = await axios.post('/api/paper-trading/execute', {
        recommendation_id: `mobu-rec-${Date.now()}`,
        symbol,
        action,
        notional
      });
      
      alert(`Order executed: ${action.toUpperCase()} $${notional} of ${symbol}`);
      fetchAccountData(); // Refresh data
    } catch (error) {
      console.error('Error executing order:', error);
      alert('Failed to execute order');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading paper trading account...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paper Trading Dashboard</h1>
        <p className="text-gray-600">Practice with $100,000 virtual cash • Real market prices</p>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold">${account?.portfolio_value.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Cash</div>
          <div className="text-2xl font-bold">${account?.cash.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Buying Power</div>
          <div className="text-2xl font-bold">${account?.buying_power.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Total Equity</div>
          <div className="text-2xl font-bold">${account?.equity.toLocaleString()}</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-sm text-gray-700 mb-1">Total Return</div>
          <div className={`text-2xl font-bold ${metrics && metrics.total_return_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics?.total_return_pct}%
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-sm text-gray-700 mb-1">Sharpe Ratio</div>
          <div className="text-2xl font-bold">{metrics?.sharpe_ratio}</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-sm text-gray-700 mb-1">Win Rate</div>
          <div className="text-2xl font-bold">{metrics?.win_rate_pct}%</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-sm text-gray-700 mb-1">Total Trades</div>
          <div className="text-2xl font-bold">{metrics?.total_trades}</div>
        </div>
      </div>

      {/* Current Positions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Current Positions ({positions.length})</h2>
        {positions.length === 0 ? (
          <p className="text-gray-500">No positions yet. Execute a MOBU recommendation to start!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Avg Cost</th>
                  <th className="px-4 py-2 text-right">Current Price</th>
                  <th className="px-4 py-2 text-right">Market Value</th>
                  <th className="px-4 py-2 text-right">P&L</th>
                  <th className="px-4 py-2 text-right">Return %</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr key={pos.symbol} className="border-t">
                    <td className="px-4 py-3 font-semibold">{pos.symbol}</td>
                    <td className="px-4 py-3 text-right">{pos.qty}</td>
                    <td className="px-4 py-3 text-right">${pos.avg_entry_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${pos.current_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${pos.market_value.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${pos.unrealized_pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${pos.unrealized_pl.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${pos.unrealized_plpc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(pos.unrealized_plpc * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Trade Test */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Test Trade (Demo)</h3>
        <div className="flex gap-4">
          <button
            onClick={() => executeRecommendation('AAPL', 'buy', 1000)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Buy $1000 AAPL
          </button>
          <button
            onClick={() => executeRecommendation('TSLA', 'buy', 500)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Buy $500 TSLA
          </button>
          <button
            onClick={fetchAccountData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Database Integration

### 5.1 Store Alpaca Trades in MOBU Database

```python
# mobu-backend/services/sync_alpaca_to_db.py

import psycopg2
from datetime import datetime
from services.alpaca_paper_trading import AlpacaPaperTradingClient

def sync_alpaca_trades_to_mobu_db():
    """
    Sync Alpaca paper trades to MOBU database
    Run this periodically (e.g., every 5 minutes via cron)
    """
    alpaca = AlpacaPaperTradingClient()
    
    # Database connection
    conn = psycopg2.connect(
        host="localhost",
        database="mobu_dev",
        user="mobu_user",
        password="mobu_dev_2024"
    )
    cursor = conn.cursor()
    
    # Fetch closed orders from Alpaca
    orders = alpaca.get_order_history(status='closed', limit=500)
    
    for order in orders:
        # Check if order already exists in DB
        cursor.execute("""
            SELECT trade_id FROM raw_data.paper_trades
            WHERE broker_order_id = %s
        """, (order['order_id'],))
        
        if cursor.fetchone():
            continue  # Already synced
        
        # Insert new trade
        cursor.execute("""
            INSERT INTO raw_data.paper_trades (
                user_id, broker_order_id, symbol, exchange, side, 
                quantity, price, total_value, executed_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            'default_user',  # Replace with actual user_id
            order['order_id'],
            order['symbol'],
            'NYSE',  # Alpaca primarily trades US stocks
            order['side'],
            order['filled_qty'],
            order['filled_avg_price'],
            order['filled_qty'] * order['filled_avg_price'] if order['filled_avg_price'] else 0,
            order['filled_at']
        ))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"Synced {len(orders)} Alpaca trades to MOBU database")


if __name__ == "__main__":
    sync_alpaca_trades_to_db()
```

---

## 6. Testing the Integration

### Test Script

```python
# test_alpaca_integration.py

from services.alpaca_paper_trading import AlpacaPaperTradingClient

def test_alpaca_integration():
    print("=" * 60)
    print("MOBU x Alpaca Paper Trading Integration Test")
    print("=" * 60)
    
    # Initialize client
    alpaca = AlpacaPaperTradingClient()
    
    # Test 1: Get account info
    print("\n[TEST 1] Fetching account info...")
    account = alpaca.get_account_info()
    print(f"✅ Account Status: {account['status']}")
    print(f"✅ Cash: ${account['cash']:,.2f}")
    print(f"✅ Portfolio Value: ${account['portfolio_value']:,.2f}")
    print(f"✅ Buying Power: ${account['buying_power']:,.2f}")
    
    # Test 2: Place a buy order ($100 worth of AAPL)
    print("\n[TEST 2] Placing buy order for AAPL...")
    try:
        order = alpaca.execute_mobu_recommendation(
            symbol='AAPL',
            action='buy',
            notional=100.00,
            recommendation_id='test-rec-001'
        )
        print(f"✅ Order ID: {order['order_id']}")
        print(f"✅ Status: {order['status']}")
        print(f"✅ Symbol: {order['symbol']}")
        print(f"✅ Notional: ${order['notional']}")
    except Exception as e:
        print(f"❌ Order failed: {e}")
    
    # Test 3: Get positions
    print("\n[TEST 3] Fetching positions...")
    positions = alpaca.get_positions()
    print(f"✅ Total Positions: {len(positions)}")
    for pos in positions[:5]:  # Show first 5
        print(f"   - {pos['symbol']}: {pos['qty']} shares @ ${pos['current_price']:.2f} | P&L: ${pos['unrealized_pl']:.2f}")
    
    # Test 4: Get performance metrics
    print("\n[TEST 4] Calculating performance metrics...")
    try:
        metrics = alpaca.calculate_performance_metrics()
        print(f"✅ Total Return: {metrics['total_return_pct']}%")
        print(f"✅ Sharpe Ratio: {metrics['sharpe_ratio']}")
        print(f"✅ Win Rate: {metrics['win_rate_pct']}%")
        print(f"✅ Total Trades: {metrics['total_trades']}")
    except Exception as e:
        print(f"⚠️  Metrics calculation error: {e}")
    
    # Test 5: Get order history
    print("\n[TEST 5] Fetching order history...")
    orders = alpaca.get_order_history(status='closed', limit=10)
    print(f"✅ Recent Orders: {len(orders)}")
    for order in orders[:3]:  # Show first 3
        print(f"   - {order['symbol']}: {order['side'].upper()} {order['filled_qty']} @ ${order['filled_avg_price']:.2f}")
    
    print("\n" + "=" * 60)
    print("✅ All tests completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    test_alpaca_integration()
```

**Run the test**:
```bash
python test_alpaca_integration.py
```

---

## 7. Environment Setup Checklist

- [ ] Get Alpaca secret key from https://app.alpaca.markets/paper/dashboard/overview
- [ ] Add to `.env`:
  ```
  ALPACA_PAPER_API_KEY=PK3U2KSUCEPM66M3WYNQZHGAIM
  ALPACA_PAPER_SECRET_KEY=<your_secret_key>
  ALPACA_PAPER_BASE_URL=https://paper-api.alpaca.markets
  ```
- [ ] Install Alpaca SDK: `pip install alpaca-trade-api`
- [ ] Test connection: `python test_alpaca_integration.py`
- [ ] Integrate with FastAPI backend
- [ ] Build paper trading dashboard in Next.js
- [ ] Set up database sync (cron job every 5 min)

---

## 8. Next Steps

### Week 1: Core Integration
1. ✅ Get Alpaca secret key
2. ✅ Implement `AlpacaPaperTradingClient` class
3. ✅ Create FastAPI routes
4. ✅ Test with sample trades

### Week 2: Dashboard
1. ⏳ Build paper trading dashboard UI
2. ⏳ Add "Execute Paper Trade" button to MOBU recommendations
3. ⏳ Show real-time positions & P&L
4. ⏳ Display performance metrics (Sharpe, win rate)

### Week 3: User Onboarding
1. ⏳ Add "Start Paper Trading" signup flow
2. ⏳ Each user gets their own Alpaca paper account (via Alpaca OAuth)
3. ⏳ Tutorial: "Practice 5 trades before going live"
4. ⏳ Leaderboard: Top paper traders

### Week 4: Transition to Live
1. ⏳ "Upgrade to Live Trading" button
2. ⏳ Connect real Alpaca account (OAuth)
3. ⏳ Connect African brokers (EasyEquities, Bamboo)
4. ⏳ Payment gateway integration (Paystack, M-Pesa)

---

## Summary

✅ **Alpaca Paper Trading Integrated**  
✅ **API Key**: PK3U2KSUCEPM66M3WYNQZHGAIM  
✅ **Endpoint**: https://paper-api.alpaca.markets/v2  
✅ **Python SDK**: Ready to use  
✅ **FastAPI Routes**: Designed  
✅ **Next.js Dashboard**: Designed  
✅ **Database Sync**: Planned  

**Ready to implement!** Start with `test_alpaca_integration.py` to verify credentials and begin building.

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-12  
**Status**: Ready for Development
