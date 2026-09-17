# MOBU Paper Trading with Alpaca - Complete Setup Guide

## ✅ Status: READY TO USE

**Alpaca Paper Trading API is now integrated into MOBU!**

Users can practice trading with **$100,000 virtual cash** using **real market prices** from NYSE and NASDAQ.

---

## Quick Start (2 minutes)

### 1. Environment Variables
Your Alpaca paper trading credentials are already configured:

```bash
# Add to mobu-mvp/.env.local
ALPACA_API_KEY=PKNSMRMXNMBMFHK57E25IX766P
ALPACA_API_SECRET=DEAqtr53xJwoQVJJ8YHbuf6HcXyW74NEuSEzc8xkWKod
```

### 2. Start the MVP
```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev
```

### 3. Access Paper Trading
Navigate to: **http://localhost:3000/paper-trading**

---

## What Was Built

### 1. **Alpaca Integration Library**
`/lib/alpaca-paper-trading.ts`

**Functions Available**:
- ✅ `getPaperAccount()` - Get account balance, equity, P&L
- ✅ `getPaperPositions()` - Get current holdings
- ✅ `placePaperOrder()` - Execute trades (buy/sell)
- ✅ `getPaperOrders()` - Get order history
- ✅ `cancelPaperOrder()` - Cancel pending orders
- ✅ `getPaperPortfolioHistory()` - Get historical performance data
- ✅ `getLatestQuote()` - Get real-time stock quotes
- ✅ `executeMobuRecommendation()` - Execute MOBU AI recommendations
- ✅ `getPaperPerformanceMetrics()` - Calculate win rate, Sharpe ratio, max drawdown

### 2. **API Routes**
All accessible from the MVP:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/paper-trading/account` | GET | Get account details (cash, equity, P&L) |
| `/api/paper-trading/positions` | GET | Get current holdings |
| `/api/paper-trading/orders` | GET | Get order history |
| `/api/paper-trading/orders` | POST | Place a new order |
| `/api/paper-trading/orders?order_id=xxx` | DELETE | Cancel an order |
| `/api/paper-trading/performance` | GET | Get performance metrics |
| `/api/paper-trading/execute-recommendation` | POST | Execute MOBU recommendation |

### 3. **Paper Trading Dashboard**
`/pages/paper-trading.tsx`

**Features**:
- **Account Overview**: Portfolio value, cash, P&L, positions count
- **Quick Trade Form**: Buy/sell stocks instantly
- **Positions Table**: View all current holdings with unrealized P&L
- **Orders History**: All executed, pending, and canceled orders
- **Performance Metrics**: Win rate, Sharpe ratio, max drawdown, trade stats
- **Tabbed Interface**: Switch between overview, positions, orders, performance

---

## How to Use (User Flow)

### Step 1: View Account
```bash
curl http://localhost:3000/api/paper-trading/account
```

**Response**:
```json
{
  "id": "abc123",
  "status": "ACTIVE",
  "currency": "USD",
  "buying_power": 100000.00,
  "cash": 100000.00,
  "portfolio_value": 100000.00,
  "equity": 100000.00,
  "total_pnl": 0.00,
  "total_pnl_pct": 0.00
}
```

### Step 2: Place a Trade
```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "buy",
    "qty": 10,
    "type": "market"
  }'
```

**Response**:
```json
{
  "order_id": "order_123",
  "symbol": "AAPL",
  "side": "buy",
  "qty": 10,
  "filled_qty": 10,
  "filled_avg_price": 175.50,
  "status": "filled",
  "submitted_at": "2026-09-12T19:30:00Z"
}
```

### Step 3: View Positions
```bash
curl http://localhost:3000/api/paper-trading/positions
```

**Response**:
```json
[
  {
    "symbol": "AAPL",
    "qty": 10,
    "side": "long",
    "avg_entry_price": 175.50,
    "current_price": 176.20,
    "market_value": 1762.00,
    "cost_basis": 1755.00,
    "unrealized_pl": 7.00,
    "unrealized_plpc": 0.40,
    "change_today": 0.80
  }
]
```

### Step 4: Check Performance
```bash
curl http://localhost:3000/api/paper-trading/performance
```

**Response**:
```json
{
  "account": {
    "equity": 100007.00,
    "cash": 98245.00,
    "total_pnl": 7.00,
    "total_pnl_pct": 0.007
  },
  "positions": {
    "count": 1,
    "total_value": 1762.00,
    "unrealized_pl": 7.00
  },
  "trading": {
    "total_trades": 1,
    "winning_trades": 1,
    "losing_trades": 0,
    "win_rate": 100.0,
    "sharpe_ratio": 1.85,
    "max_drawdown": 0.0
  }
}
```

---

## Integrating with MOBU Recommendations

### Scenario: User Follows MOBU Recommendation

**MOBU Recommendation**:
```json
{
  "id": "rec_456",
  "symbol": "MSFT",
  "action": "buy",
  "confidence": 0.88,
  "reasoning": "Strong Q3 earnings + AI cloud growth",
  "target_allocation": 10
}
```

**Execute via API**:
```bash
curl -X POST http://localhost:3000/api/paper-trading/execute-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "id": "rec_456",
    "symbol": "MSFT",
    "action": "buy",
    "confidence": 0.88,
    "target_allocation": 10
  }'
```

**What Happens**:
1. System fetches current account equity ($100,000)
2. Calculates target value: 10% = $10,000
3. Fetches MSFT current price: $415.50
4. Calculates shares: $10,000 / $415.50 = 24 shares
5. Places market order: BUY 24 MSFT
6. Returns order confirmation

**Response**:
```json
{
  "success": true,
  "recommendation_id": "rec_456",
  "order": {
    "order_id": "order_789",
    "symbol": "MSFT",
    "side": "buy",
    "qty": 24,
    "filled_avg_price": 415.50,
    "status": "filled"
  },
  "message": "Paper trade executed: BUY 24 shares of MSFT"
}
```

---

## Dashboard Features

### 1. **Overview Tab**
- **4 Metric Cards**: Portfolio value, cash, positions count, total trades
- **Quick Trade Form**: Enter symbol, select buy/sell, enter quantity, submit
- **Recent Orders**: Last 5 orders with status badges

### 2. **Positions Tab**
- **Holdings Table**: Symbol, qty, avg cost, current price, market value, P&L, P&L%
- **Real-time Updates**: Prices update when page refreshes
- **Empty State**: Friendly message if no positions

### 3. **Orders Tab**
- **Order History**: All orders (filled, pending, canceled)
- **Status Badges**: Color-coded (green=filled, yellow=pending, gray=canceled)
- **Timestamps**: When each order was submitted/filled

### 4. **Performance Tab**
- **4 Metric Cards**:
  - Total trades
  - Win rate (% of profitable trades)
  - Sharpe ratio (risk-adjusted returns)
  - Max drawdown (worst peak-to-trough decline)

---

## Adding Paper Trading Link to Navigation

Update `/components/Navigation.tsx`:

```tsx
<Link href="/paper-trading" className="text-gray-600 hover:text-gray-900">
  Paper Trading
</Link>
```

---

## Testing the Integration

### Test 1: Health Check
```bash
# In browser console or Node.js
const { testAlpacaConnection } = require('./lib/alpaca-paper-trading');
const result = await testAlpacaConnection();
console.log(result);
// Expected: { success: true, message: "Alpaca paper trading API connected successfully" }
```

### Test 2: Place Test Trade
```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "buy",
    "qty": 1,
    "type": "market"
  }'
```

### Test 3: View on Alpaca Dashboard
1. Go to: https://app.alpaca.markets/paper/dashboard/overview
2. Login with your Alpaca account
3. View your paper trades in the dashboard

---

## Advanced Features

### 1. **Fractional Shares**
Instead of `qty`, use `notional` (dollar amount):

```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "buy",
    "notional": 500,
    "type": "market"
  }'
```

This buys **$500 worth** of AAPL (fractional shares if needed).

### 2. **Limit Orders**
Buy at a specific price:

```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "buy",
    "qty": 10,
    "type": "limit",
    "limit_price": 170.00
  }'
```

Order executes only if AAPL drops to $170 or below.

### 3. **Stop Loss Orders**
Automatically sell if price drops:

```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "sell",
    "qty": 10,
    "type": "stop",
    "stop_price": 165.00
  }'
```

Sells 10 AAPL if price falls to $165.

### 4. **Cancel All Orders**
```bash
curl -X DELETE http://localhost:3000/api/paper-trading/orders
```

---

## Alpaca API Limits

**Paper Trading Account**:
- ✅ **Free forever**
- ✅ **$100,000 starting capital** (virtual)
- ✅ **Real-time market data** (15-minute delay for free tier, real-time available)
- ✅ **Unlimited trades**
- ✅ **200 API calls per minute**
- ✅ **NYSE, NASDAQ, AMEX** stocks

**Rate Limits**:
- 200 requests/minute
- If exceeded, you get HTTP 429 (rate limit error)
- Solution: Cache data, batch requests

---

## Next Steps

### Phase 1: Current (Completed)
✅ Alpaca paper trading integrated  
✅ API routes created  
✅ Dashboard UI built  
✅ Order execution working  

### Phase 2: MOBU AI Integration (Next)
- [ ] Add "Execute (Paper)" button to recommendation cards
- [ ] Show paper trade history linked to recommendations
- [ ] Track recommendation accuracy (did it make money?)
- [ ] Leaderboard: Top paper traders using MOBU

### Phase 3: African Markets (Future)
- [ ] Build custom paper trading for JSE/NGX/NSE stocks
- [ ] Use Mansa API for real African market prices
- [ ] Combine US stocks (Alpaca) + African stocks (custom)

---

## Troubleshooting

### Issue: "Failed to connect to Alpaca API"
**Solution**: Check API keys in `.env.local`:
```bash
echo $ALPACA_API_KEY
# Should output: PKNSMRMXNMBMFHK57E25IX766P
```

### Issue: "Order rejected: insufficient buying power"
**Solution**: Check account cash balance:
```bash
curl http://localhost:3000/api/paper-trading/account | jq '.cash'
```

### Issue: "Symbol not found"
**Solution**: Ensure symbol is valid and trading on NYSE/NASDAQ/AMEX. Try "AAPL", "MSFT", "TSLA".

### Issue: "Rate limit exceeded (HTTP 429)"
**Solution**: Reduce API calls. Alpaca allows 200/minute. Add caching:
```typescript
// Cache account data for 30 seconds
const cache = new Map();
if (cache.has('account') && Date.now() - cache.get('account').timestamp < 30000) {
  return cache.get('account').data;
}
```

---

## Security Notes

**Your Alpaca Credentials**:
- ✅ Paper trading only (no real money at risk)
- ✅ Stored in `.env.local` (gitignored)
- ⚠️ **Never commit** API keys to GitHub
- ⚠️ For production, use **environment variables** in hosting platform (Vercel, Azure)

**Best Practices**:
1. **Rotate keys** periodically (generate new keys in Alpaca dashboard)
2. **Use separate keys** for dev/staging/prod
3. **Monitor API usage** in Alpaca dashboard
4. **Encrypt keys** in database if storing per-user

---

## Resources

- **Alpaca Paper Trading Dashboard**: https://app.alpaca.markets/paper/dashboard/overview
- **Alpaca API Docs**: https://docs.alpaca.markets/docs/trading-api
- **Alpaca API Reference**: https://docs.alpaca.markets/reference/
- **Alpaca Community**: https://forum.alpaca.markets/

---

## Summary

✅ **Paper Trading is LIVE** in MOBU MVP  
✅ **$100,000 virtual cash** to practice  
✅ **Real NYSE/NASDAQ prices** via Alpaca  
✅ **Full order execution** (buy, sell, limit, stop)  
✅ **Performance tracking** (win rate, Sharpe, drawdown)  
✅ **API + UI** ready to use  

**Next**: Integrate with MOBU recommendations so users can execute AI signals in paper account!

---

**Document Version**: 1.0  
**Created**: 2026-09-12  
**Status**: Production Ready  
**API Endpoint**: https://paper-api.alpaca.markets/v2
