# MOBU MVP - Alpaca Integration Setup Guide

## Overview
MOBU MVP now integrates with **Alpaca Markets** for both **paper trading** (practice) and **live trading** (real money). This guide shows you how to set everything up.

---

## Features Implemented

✅ **Paper Trading** (Free, risk-free practice)
- $100,000 virtual cash
- Real market prices
- Same interface as live trading
- Leaderboard competition

✅ **Live Trading** (Real money via Alpaca)
- Commission-free trades
- Fractional shares from $1
- NYSE & NASDAQ access
- Instant execution

✅ **Interactive Dashboard**
- Real-time portfolio value
- Live positions
- Order history
- Performance metrics

✅ **Leaderboard**
- Compete with other paper traders
- Rankings by % return
- Win rate & Sharpe ratio tracking

✅ **Seamless Upgrade Path**
- Start with paper trading
- When ready, upgrade to live with one click

---

## Setup Instructions

### Step 1: Sign Up for Alpaca (Free)

1. Go to https://app.alpaca.markets/signup
2. Create a free account
3. Verify your email
4. Complete the account setup

**Note**: You can trade with paper money immediately (no ID verification needed). For live trading, you'll need to complete KYC.

### Step 2: Generate API Keys

1. Log in to Alpaca dashboard
2. Go to **"Your API Keys"** section (left sidebar)
3. Click **"Generate New Key"** under **"Paper Trading"**
4. Copy both:
   - **API Key ID** (starts with `PK...`)
   - **Secret Key** (long alphanumeric string)
5. **IMPORTANT**: Save the Secret Key now! You can't view it again later.

### Step 3: Configure MOBU MVP

1. Navigate to the MVP directory:
   ```bash
   cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
   ```

2. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and add your Alpaca keys:
   ```bash
   ALPACA_API_KEY=PKxxxxxxxxxxxxxxxxxx
   ALPACA_SECRET_KEY=your_secret_key_here
   ALPACA_BASE_URL=https://paper-api.alpaca.markets
   ```

4. **Security**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Step 4: Install Dependencies

```bash
npm install
```

This installs the Alpaca SDK:
- `@alpacahq/alpaca-trade-api@^3.0.0`

### Step 5: Run the MVP

```bash
npm run dev
```

Open http://localhost:3000

---

## Testing the Integration

### Test 1: View Paper Trading Account

1. Go to Dashboard
2. Should see your Alpaca paper account:
   - Cash balance: $100,000
   - Portfolio value: $100,000
   - Buying power: $100,000

### Test 2: Place a Paper Trade

1. Go to Dashboard
2. Find a recommendation (e.g., "Buy AAPL")
3. Click **"Execute Trade (Paper)"**
4. Enter quantity or dollar amount
5. Click **"Buy"**
6. Trade should execute instantly
7. Check **Positions** tab to see your new holding

### Test 3: View Leaderboard

1. Go to http://localhost:3000/leaderboard
2. Should see your rank among paper traders
3. Your entry should show:
   - Current portfolio value
   - % return
   - Number of trades
   - Win rate

### Test 4: Upgrade Flow

1. Click **"Upgrade to Live Trading"**
2. Should see comparison: Paper vs. Live
3. Click **"Connect Alpaca Account"**
4. Should redirect to Alpaca OAuth (in production)

---

## API Endpoints Created

### Account Management
- `GET /api/alpaca/account?mode=paper` - Get account info
- `GET /api/alpaca/account?mode=live` - Get live account (when ready)

### Positions
- `GET /api/alpaca/positions?mode=paper` - Get all holdings
- `GET /api/alpaca/positions?mode=live` - Get live holdings

### Orders
- `GET /api/alpaca/orders?mode=paper&status=all` - Get order history
- `POST /api/alpaca/orders` - Place new order
  ```json
  {
    "symbol": "AAPL",
    "quantity": 10,
    "side": "buy",
    "orderType": "market"
  }
  ```
- `DELETE /api/alpaca/orders?orderId=xxx` - Cancel order

### Leaderboard
- `GET /api/leaderboard?period=monthly` - Get rankings

---

## Currency Handling

All stocks traded via Alpaca are in **USD**:
- NYSE stocks: USD
- NASDAQ stocks: USD
- AMEX stocks: USD

For African exchanges (future):
- JSE: ZAR (South African Rand)
- NGX: NGN (Nigerian Naira)
- NSE: KES (Kenyan Shilling)

The `getCurrencyForSymbol()` function handles this automatically.

---

## Paper Trading vs. Live Trading

### Paper Trading (Default)
- **Endpoint**: `https://paper-api.alpaca.markets`
- **Cash**: $100,000 virtual (resets on request)
- **Execution**: Real market prices, simulated fills
- **Perfect for**: Learning, testing strategies, competing on leaderboard

### Live Trading (Opt-in)
- **Endpoint**: `https://api.alpaca.markets`
- **Cash**: Real money (deposit from bank account)
- **Execution**: Real trades on NYSE/NASDAQ
- **Requirements**: KYC verification (ID, SSN, address)
- **Minimum**: Start with as little as $1

**To switch to live**:
1. Complete KYC in Alpaca dashboard
2. Generate **Live Trading API keys** (separate from paper keys)
3. Update `.env.local` with live keys
4. Change `ALPACA_BASE_URL` to `https://api.alpaca.markets`
5. Restart app

---

## Refresh After Purchase

When a trade executes:
1. **Order confirmation** shows immediately
2. **Positions** auto-refresh every 30 seconds
3. **Portfolio value** updates in real-time
4. **Manual refresh**: Click the refresh icon in dashboard header

To force immediate refresh:
```javascript
// In dashboard component
const refreshPortfolio = async () => {
  await fetchAccount();
  await fetchPositions();
  await fetchOrders();
};
```

---

## Leaderboard Mechanics

### How Rankings Work
1. **% Return** = Primary sort metric
   - Formula: `(Current Equity - Starting Capital) / Starting Capital * 100`
   - Example: $110,000 / $100,000 = 10% return

2. **Win Rate** = Secondary metric
   - Formula: `Winning Trades / Total Trades * 100`
   - Example: 15 wins / 20 trades = 75% win rate

3. **Sharpe Ratio** = Risk-adjusted metric
   - Formula: `(Portfolio Return - Risk-Free Rate) / Portfolio Std Dev`
   - MOBU Target: ≥ 1.5 (one of 4 AI Quality Criteria)

### Leaderboard Updates
- **Real-time**: Fetches from Alpaca account every refresh
- **Frequency**: Every 5 minutes (production)
- **Persistence**: Stored in database for historical tracking

### Gamification Features
- 🏆 **Badges**: Top 3 get trophies
- 📊 **Stats**: Win rate, Sharpe ratio, total trades
- 🎯 **Challenges**: Weekly/monthly competitions
- 🔥 **Streaks**: Longest winning/losing streaks

---

## Troubleshooting

### Error: "Failed to fetch account data"
**Cause**: Invalid API keys or expired keys  
**Fix**:
1. Verify keys in `.env.local` match Alpaca dashboard
2. Regenerate keys if needed
3. Restart dev server: `npm run dev`

### Error: "Symbol AAPL is not tradable"
**Cause**: Market is closed or symbol doesn't exist  
**Fix**:
1. Check market hours: Mon-Fri 9:30 AM - 4:00 PM ET
2. Verify symbol exists: Try `AAPL`, `TSLA`, `MSFT`
3. Use `GET /api/alpaca/orders?status=open` to check pending orders

### Error: "Insufficient buying power"
**Cause**: Trying to buy more than available cash  
**Fix**:
1. Check account cash: `GET /api/alpaca/account`
2. Reduce quantity or use notional orders
3. Paper account resets to $100k (contact Alpaca support)

### Positions not updating
**Cause**: Caching or API rate limits  
**Fix**:
1. Wait 30 seconds for auto-refresh
2. Clear browser cache: Cmd+Shift+R
3. Check Alpaca API status: https://status.alpaca.markets

### Leaderboard shows stale data
**Cause**: Database not syncing with Alpaca  
**Fix**:
1. Manually refresh leaderboard API
2. Verify `/api/leaderboard` returns current account equity
3. Check database connection (future: PostgreSQL integration)

---

## Security Best Practices

### API Keys
- ✅ **DO**: Store in `.env.local` (gitignored)
- ✅ **DO**: Use paper keys for development
- ✅ **DO**: Rotate keys regularly (every 90 days)
- ❌ **DON'T**: Commit keys to GitHub
- ❌ **DON'T**: Share keys publicly
- ❌ **DON'T**: Use live keys in development

### Production Deployment
When deploying to production (Vercel, AWS, etc.):
1. Add environment variables in hosting platform UI
2. Use **secrets management** (e.g., AWS Secrets Manager)
3. Enable **API key rotation**
4. Set up **alerts** for suspicious trading activity

---

## Next Steps

### Phase 1: Enhanced Dashboard (Current)
- ✅ Alpaca account integration
- ✅ Real-time positions
- ✅ Order execution
- ✅ Leaderboard

### Phase 2: Advanced Features (Next 2 Weeks)
- [ ] Portfolio performance charts (Recharts integration)
- [ ] Order history with filters
- [ ] Price alerts & notifications
- [ ] Advanced order types (stop-loss, take-profit)

### Phase 3: AI Integration (Weeks 3-4)
- [ ] Display MOBU AI recommendations
- [ ] Evidence trail for each recommendation
- [ ] One-click execute from recommendation
- [ ] Track recommendation performance

### Phase 4: Live Trading (When Ready)
- [ ] KYC verification flow
- [ ] Bank account linking
- [ ] Risk warnings & disclosures
- [ ] Trade confirmation modals

---

## Resources

- **Alpaca Docs**: https://alpaca.markets/docs/
- **Alpaca API Reference**: https://alpaca.markets/docs/api-references/trading-api/
- **Alpaca Python SDK**: https://github.com/alpacahq/alpaca-trade-api-python
- **Alpaca Node SDK**: https://github.com/alpacahq/alpaca-trade-api-js
- **MOBU Design Docs**: See `/MOBU_Design/09_African_Market_Integration.md`

---

## Support

- **Alpaca Support**: support@alpaca.markets
- **Alpaca Community**: https://alpaca.markets/community
- **MOBU Team**: Internal Slack channel

---

**Version**: 1.0.0  
**Last Updated**: 2026-09-12  
**Status**: ✅ Ready for Testing
