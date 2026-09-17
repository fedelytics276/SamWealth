# 🚀 Paper Trading Quick Start (2 Minutes)

## Start Trading NOW with $100,000 Virtual Cash

### Step 1: Start the Server (30 seconds)
```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev
```

### Step 2: Open Paper Trading Dashboard
Navigate to: **http://localhost:3000/paper-trading**

### Step 3: Place Your First Trade (1 minute)
1. **Enter a stock symbol** (e.g., AAPL, MSFT, TSLA, GOOGL)
2. **Select BUY**
3. **Enter quantity** (e.g., 10 shares)
4. **Click "Place Order"**

✅ **Done!** Your order executes at real market prices.

---

## Example Trades to Try

### Tech Stocks
```
AAPL  - Apple (~$175)
MSFT  - Microsoft (~$415)
GOOGL - Google (~$145)
NVDA  - Nvidia (~$460)
TSLA  - Tesla (~$250)
```

### Index ETFs (Diversified)
```
SPY  - S&P 500 ETF (~$440)
QQQ  - Nasdaq 100 ETF (~$380)
VOO  - Vanguard S&P 500 (~$395)
```

### Small Positions (Practice)
```
Buy 1 AAPL    = ~$175  (small test)
Buy 5 MSFT    = ~$2,075 (medium)
Buy 10 SPY    = ~$4,400 (larger)
Buy 100 QQQ   = ~$38,000 (aggressive)
```

---

## API Testing (Optional)

### Check Your Account Balance
```bash
curl http://localhost:3000/api/paper-trading/account | json_pp
```

### Place a Trade via API
```bash
curl -X POST http://localhost:3000/api/paper-trading/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "buy",
    "qty": 5,
    "type": "market"
  }'
```

### View Your Positions
```bash
curl http://localhost:3000/api/paper-trading/positions | json_pp
```

---

## What You'll See

### Account Overview
- **Portfolio Value**: Starts at $100,000
- **Cash**: Decreases as you buy stocks
- **Total P&L**: Shows your profit/loss
- **Positions**: Number of stocks you own

### Performance Tracking
- **Win Rate**: % of profitable trades
- **Sharpe Ratio**: Risk-adjusted returns
- **Max Drawdown**: Worst decline
- **Total Trades**: Number of orders executed

---

## Practice Scenarios

### Scenario 1: Diversified Portfolio
```
Buy 5 AAPL   ($875)  - Tech
Buy 5 MSFT   ($2,075) - Tech
Buy 3 JPM    ($450)  - Banking
Buy 10 SPY   ($4,400) - S&P 500 Index
Total: $7,800 invested
```

### Scenario 2: Aggressive Tech
```
Buy 10 NVDA  ($4,600) - AI chips
Buy 10 GOOGL ($1,450) - Search
Buy 5 TSLA   ($1,250) - EVs
Total: $7,300 invested
```

### Scenario 3: Conservative ETFs
```
Buy 50 SPY   ($22,000) - S&P 500
Buy 50 QQQ   ($19,000) - Nasdaq
Total: $41,000 invested, $59,000 cash reserve
```

---

## Tips

### 1. Start Small
- Try 1-5 shares first
- Get comfortable with the interface
- Watch how prices move

### 2. Diversify
- Don't put all virtual cash in one stock
- Mix large-cap (AAPL, MSFT) with ETFs (SPY, QQQ)
- Spread across sectors (tech, finance, healthcare)

### 3. Track Performance
- Check your P&L daily
- Aim for win rate > 60%
- Target Sharpe ratio > 1.0

### 4. Learn from Mistakes
- Losses are OK (it's virtual money!)
- Analyze why a trade lost money
- Adjust strategy

---

## Common Questions

### Q: Is this real money?
**A: No!** It's 100% virtual. You start with $100,000 fake cash.

### Q: Are prices real?
**A: Yes!** Prices are real-time from NYSE/NASDAQ via Alpaca.

### Q: Can I lose more than $100k?
**A: No.** Worst case: Your portfolio goes to $0. Then restart.

### Q: How do I reset my account?
**A: Contact Alpaca** or create new credentials. Alpaca allows unlimited paper accounts.

### Q: Can I trade after hours?
**A: No.** Paper trading follows regular market hours (9:30 AM - 4:00 PM ET, Mon-Fri).

### Q: What stocks can I trade?
**A: All NYSE, NASDAQ, AMEX stocks.** 5,000+ symbols.

---

## Next Steps

### After 1 Week of Paper Trading
- [ ] Check your total P&L (profit/loss)
- [ ] Calculate your win rate
- [ ] Review losing trades (why did they lose?)
- [ ] Refine your strategy

### When Ready for Live Trading
- [ ] Connect a real broker (EasyEquities, Bamboo, etc.)
- [ ] Deposit real funds (M-Pesa, bank transfer)
- [ ] Start with small amounts ($100-$500)
- [ ] Apply lessons learned from paper trading

---

## Troubleshooting

### Issue: Page shows "Loading..."
**Solution**: Restart the dev server:
```bash
# Ctrl+C to stop
npm run dev
```

### Issue: "Order rejected"
**Solution**: Check you have enough cash:
```bash
curl http://localhost:3000/api/paper-trading/account | grep cash
```

### Issue: Stock symbol not found
**Solution**: Verify symbol is correct. Try "AAPL" (not "Apple").

---

## Resources

- **Paper Trading Dashboard**: http://localhost:3000/paper-trading
- **Alpaca Dashboard** (view trades): https://app.alpaca.markets/paper/dashboard
- **Full Documentation**: `/PAPER_TRADING_SETUP.md`

---

**Ready? Let's Trade! 🚀**

Navigate to http://localhost:3000/paper-trading and place your first order!
