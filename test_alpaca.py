#!/usr/bin/env python3
"""
Quick test script to verify Alpaca Paper Trading API credentials
Run: python3 test_alpaca.py
"""

import os
import sys

# Install alpaca-trade-api if not already installed
try:
    import alpaca_trade_api as tradeapi
except ImportError:
    print("Installing alpaca-trade-api...")
    os.system(f"{sys.executable} -m pip install alpaca-trade-api")
    import alpaca_trade_api as tradeapi

# Your Alpaca credentials
API_KEY = "PK3U2KSUCEPM66M3WYNQZHGAIM"
SECRET_KEY = input("Enter your Alpaca Secret Key: ").strip()
BASE_URL = "https://paper-api.alpaca.markets"

print("\n" + "=" * 70)
print("🚀 Testing MOBU x Alpaca Paper Trading Integration")
print("=" * 70)

try:
    # Initialize API
    print("\n[1/5] Connecting to Alpaca Paper Trading API...")
    api = tradeapi.REST(
        key_id=API_KEY,
        secret_key=SECRET_KEY,
        base_url=BASE_URL,
        api_version='v2'
    )
    print("✅ Connected successfully!")
    
    # Get account info
    print("\n[2/5] Fetching account information...")
    account = api.get_account()
    print(f"✅ Account Status: {account.status}")
    print(f"   📊 Portfolio Value: ${float(account.portfolio_value):,.2f}")
    print(f"   💵 Cash: ${float(account.cash):,.2f}")
    print(f"   💰 Buying Power: ${float(account.buying_power):,.2f}")
    print(f"   📈 Equity: ${float(account.equity):,.2f}")
    
    # Check if market is open
    print("\n[3/5] Checking market status...")
    clock = api.get_clock()
    print(f"✅ Market is {'OPEN' if clock.is_open else 'CLOSED'}")
    print(f"   🕐 Next open: {clock.next_open}")
    print(f"   🕐 Next close: {clock.next_close}")
    
    # Get current positions
    print("\n[4/5] Fetching current positions...")
    positions = api.list_positions()
    if len(positions) == 0:
        print("✅ No positions yet (paper account is empty)")
    else:
        print(f"✅ Found {len(positions)} position(s):")
        for pos in positions[:5]:
            pnl = float(pos.unrealized_pl)
            pnl_pct = float(pos.unrealized_plpc) * 100
            print(f"   • {pos.symbol}: {pos.qty} shares @ ${float(pos.current_price):.2f} | P&L: ${pnl:.2f} ({pnl_pct:.2f}%)")
    
    # Get recent orders
    print("\n[5/5] Fetching order history...")
    orders = api.list_orders(status='all', limit=10)
    if len(orders) == 0:
        print("✅ No orders yet")
    else:
        print(f"✅ Found {len(orders)} recent order(s):")
        for order in orders[:3]:
            print(f"   • {order.symbol}: {order.side.upper()} {order.qty} @ {order.order_type} | Status: {order.status}")
    
    print("\n" + "=" * 70)
    print("✅ ALL TESTS PASSED! Alpaca integration is working correctly.")
    print("=" * 70)
    print("\n📝 Next Steps:")
    print("   1. Add SECRET_KEY to .env file")
    print("   2. Run: cd mobu-backend && python services/alpaca_paper_trading.py")
    print("   3. Start building the paper trading dashboard!")
    print("\n💡 Want to test a trade? Run this in Python:")
    print("""
    from services.alpaca_paper_trading import AlpacaPaperTradingClient
    alpaca = AlpacaPaperTradingClient()
    alpaca.execute_mobu_recommendation(
        symbol='AAPL',
        action='buy',
        notional=100.00,  # Buy $100 worth
        recommendation_id='test-001'
    )
    """)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n🔍 Troubleshooting:")
    print("   1. Verify SECRET_KEY is correct (get from https://app.alpaca.markets/paper/dashboard/overview)")
    print("   2. Check API_KEY: PK3U2KSUCEPM66M3WYNQZHGAIM")
    print("   3. Ensure you're using PAPER trading credentials (not live)")
    sys.exit(1)
