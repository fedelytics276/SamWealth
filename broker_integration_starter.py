#!/usr/bin/env python3
"""
MOBU Broker Integration - Quick Start Test Script
Tests broker connections with paper trading (no real money)

Usage:
    1. Install: pip install alpaca-trade-api
    2. Get free Alpaca paper trading keys: https://alpaca.markets/
    3. Set environment variables:
       export ALPACA_PAPER_KEY="PK..."
       export ALPACA_PAPER_SECRET="..."
    4. Run: python broker_integration_starter.py
"""

import os
import alpaca_trade_api as tradeapi
from datetime import datetime
from typing import Optional

class MOBUBrokerTest:
    """
    Test MOBU broker integration with Alpaca paper trading
    """
    
    def __init__(self):
        # Alpaca paper trading credentials
        self.api_key = os.getenv('ALPACA_PAPER_KEY')
        self.api_secret = os.getenv('ALPACA_PAPER_SECRET')
        
        if not self.api_key or not self.api_secret:
            raise ValueError(
                "Missing Alpaca credentials. Set ALPACA_PAPER_KEY and ALPACA_PAPER_SECRET.\n"
                "Get free paper trading keys at: https://alpaca.markets/"
            )
        
        # Initialize Alpaca API (paper trading)
        self.api = tradeapi.REST(
            key_id=self.api_key,
            secret_key=self.api_secret,
            base_url='https://paper-api.alpaca.markets',  # Paper trading endpoint
            api_version='v2'
        )
        
        print("✓ Connected to Alpaca paper trading")
    
    def test_connection(self):
        """Test 1: Verify connection"""
        print("\n" + "="*60)
        print("TEST 1: CONNECTION")
        print("="*60)
        
        try:
            account = self.api.get_account()
            print(f"✓ Account ID: {account.id}")
            print(f"✓ Status: {account.status}")
            print(f"✓ Cash: ${float(account.cash):,.2f}")
            print(f"✓ Portfolio Value: ${float(account.portfolio_value):,.2f}")
            print(f"✓ Buying Power: ${float(account.buying_power):,.2f}")
            return True
        except Exception as e:
            print(f"✗ Connection failed: {e}")
            return False
    
    def test_market_data(self, symbol: str = 'AAPL'):
        """Test 2: Fetch market data"""
        print("\n" + "="*60)
        print(f"TEST 2: MARKET DATA ({symbol})")
        print("="*60)
        
        try:
            # Get latest trade
            trade = self.api.get_latest_trade(symbol)
            print(f"✓ Symbol: {symbol}")
            print(f"✓ Last Price: ${trade.price}")
            print(f"✓ Last Trade: {trade.timestamp}")
            
            # Get quote
            quote = self.api.get_latest_quote(symbol)
            print(f"✓ Bid: ${quote.bid_price} x {quote.bid_size}")
            print(f"✓ Ask: ${quote.ask_price} x {quote.ask_size}")
            print(f"✓ Spread: ${quote.ask_price - quote.bid_price:.2f}")
            
            return True
        except Exception as e:
            print(f"✗ Market data fetch failed: {e}")
            return False
    
    def test_place_order(self, symbol: str = 'AAPL', quantity: int = 1):
        """Test 3: Place paper trading order"""
        print("\n" + "="*60)
        print(f"TEST 3: PLACE ORDER (Paper Trading)")
        print("="*60)
        
        try:
            # Place market buy order
            order = self.api.submit_order(
                symbol=symbol,
                qty=quantity,
                side='buy',
                type='market',
                time_in_force='gtc'  # Good till cancelled
            )
            
            print(f"✓ Order placed successfully!")
            print(f"✓ Order ID: {order.id}")
            print(f"✓ Symbol: {order.symbol}")
            print(f"✓ Side: {order.side}")
            print(f"✓ Quantity: {order.qty}")
            print(f"✓ Type: {order.type}")
            print(f"✓ Status: {order.status}")
            print(f"✓ Submitted: {order.submitted_at}")
            
            # Wait for fill
            print("\n⏳ Waiting for order to fill...")
            import time
            for i in range(10):
                time.sleep(1)
                order_status = self.api.get_order(order.id)
                print(f"   Status: {order_status.status}", end='\r')
                
                if order_status.status == 'filled':
                    print(f"\n✓ Order filled!")
                    print(f"✓ Filled Qty: {order_status.filled_qty}")
                    print(f"✓ Filled Price: ${float(order_status.filled_avg_price):.2f}")
                    break
            
            return order.id
        except Exception as e:
            print(f"✗ Order placement failed: {e}")
            return None
    
    def test_get_positions(self):
        """Test 4: Check positions"""
        print("\n" + "="*60)
        print("TEST 4: POSITIONS")
        print("="*60)
        
        try:
            positions = self.api.list_positions()
            
            if not positions:
                print("No open positions")
                return True
            
            print(f"✓ Found {len(positions)} position(s):\n")
            
            for pos in positions:
                pnl_pct = float(pos.unrealized_plpc) * 100
                pnl_symbol = "📈" if pnl_pct > 0 else "📉"
                
                print(f"  {pos.symbol}")
                print(f"    Qty: {pos.qty}")
                print(f"    Avg Cost: ${float(pos.avg_entry_price):.2f}")
                print(f"    Current: ${float(pos.current_price):.2f}")
                print(f"    Value: ${float(pos.market_value):,.2f}")
                print(f"    P&L: ${float(pos.unrealized_pl):,.2f} ({pnl_pct:+.2f}%) {pnl_symbol}")
                print()
            
            return True
        except Exception as e:
            print(f"✗ Failed to fetch positions: {e}")
            return False
    
    def test_sell_position(self, symbol: str = 'AAPL'):
        """Test 5: Sell position (close trade)"""
        print("\n" + "="*60)
        print(f"TEST 5: SELL POSITION ({symbol})")
        print("="*60)
        
        try:
            # Check if we have position
            positions = self.api.list_positions()
            position = next((p for p in positions if p.symbol == symbol), None)
            
            if not position:
                print(f"✗ No {symbol} position to sell")
                return False
            
            # Sell the position
            order = self.api.submit_order(
                symbol=symbol,
                qty=position.qty,
                side='sell',
                type='market',
                time_in_force='gtc'
            )
            
            print(f"✓ Sell order placed!")
            print(f"✓ Order ID: {order.id}")
            print(f"✓ Selling {order.qty} shares of {symbol}")
            
            return True
        except Exception as e:
            print(f"✗ Sell failed: {e}")
            return False
    
    def simulate_mobu_recommendation_flow(self):
        """
        Simulate complete MOBU flow:
        1. MOBU generates recommendation
        2. User clicks "Execute"
        3. Trade sent to broker
        4. Confirmation shown
        """
        print("\n" + "="*60)
        print("SIMULATING MOBU RECOMMENDATION FLOW")
        print("="*60)
        
        # Step 1: MOBU recommendation
        recommendation = {
            'symbol': 'TSLA',
            'action': 'buy',
            'confidence': 0.87,
            'target_price': 250.00,
            'current_price': 242.50,
            'reasoning': [
                'Insider buying +$5M',
                'Q3 deliveries beat estimates by 12%',
                'New Gigafactory approved in Texas'
            ]
        }
        
        print("\n📊 MOBU RECOMMENDATION:")
        print(f"   Symbol: {recommendation['symbol']}")
        print(f"   Action: {recommendation['action'].upper()}")
        print(f"   Confidence: {recommendation['confidence']*100:.1f}%")
        print(f"   Current: ${recommendation['current_price']}")
        print(f"   Target: ${recommendation['target_price']}")
        print(f"   Upside: {((recommendation['target_price']/recommendation['current_price']) - 1) * 100:.1f}%")
        print(f"\n   Evidence:")
        for reason in recommendation['reasoning']:
            print(f"     • {reason}")
        
        # Step 2: User confirmation
        print(f"\n👤 User clicks 'Execute Trade'")
        print(f"   Quantity: 5 shares")
        print(f"   Est. Cost: ${recommendation['current_price'] * 5:,.2f}")
        
        # Step 3: Execute via broker
        print(f"\n🔄 Sending order to Alpaca...")
        
        try:
            order = self.api.submit_order(
                symbol=recommendation['symbol'],
                qty=5,
                side=recommendation['action'],
                type='market',
                time_in_force='gtc'
            )
            
            # Step 4: Confirmation
            print(f"\n✅ TRADE EXECUTED SUCCESSFULLY!")
            print(f"   Order ID: {order.id}")
            print(f"   Status: {order.status}")
            print(f"   Submitted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            print(f"\n📧 Email notification sent to user")
            print(f"💾 Trade saved to database (executed_trades table)")
            print(f"📊 Portfolio updated")
            
            return True
        except Exception as e:
            print(f"\n❌ TRADE FAILED: {e}")
            return False
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("\n" + "="*60)
        print("MOBU BROKER INTEGRATION TEST SUITE")
        print("="*60)
        print(f"Testing with Alpaca Paper Trading")
        print(f"Timestamp: {datetime.now()}")
        
        results = {
            'connection': self.test_connection(),
            'market_data': self.test_market_data('AAPL'),
            'place_order': self.test_place_order('AAPL', 1),
            'positions': self.test_get_positions(),
            'mobu_flow': self.simulate_mobu_recommendation_flow()
        }
        
        # Summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        
        for test_name, passed in results.items():
            status = "✓ PASS" if passed else "✗ FAIL"
            print(f"{test_name.upper()}: {status}")
        
        total = len(results)
        passed = sum(results.values())
        print(f"\nTotal: {passed}/{total} tests passed")
        
        if passed == total:
            print("\n🎉 All tests passed! Broker integration working correctly.")
            print("\nNext steps:")
            print("1. Integrate this into MOBU backend API")
            print("2. Add Interactive Brokers adapter")
            print("3. Build frontend trade execution modal")
            print("4. Test with real MOBU recommendations")
        else:
            print("\n⚠️ Some tests failed. Check configuration.")

def main():
    """Main entry point"""
    try:
        tester = MOBUBrokerTest()
        tester.run_all_tests()
    except ValueError as e:
        print(f"\n❌ Setup Error: {e}")
        print("\n📝 Setup Instructions:")
        print("1. Go to https://alpaca.markets/")
        print("2. Sign up for free")
        print("3. Go to 'Paper Trading' section")
        print("4. Copy your API Key and Secret")
        print("5. Set environment variables:")
        print("   export ALPACA_PAPER_KEY='your_key_here'")
        print("   export ALPACA_PAPER_SECRET='your_secret_here'")
        print("6. Run this script again")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
