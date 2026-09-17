# MOBU MVP Refresh Plan
## Enhanced Demo with African Markets, Paper Trading & Alternative Data

**Date**: 2026-09-12  
**Version**: 2.0  
**Status**: Ready for Implementation

---

## 1. Executive Summary

### What's New in MVP 2.0
The refreshed MVP adds **6 major enhancements** to showcase MOBU's full African investment intelligence platform:

1. **African Market Data** - JSE, NGX, NSE stocks alongside US markets
2. **Paper Trading Mode** - Risk-free demo accounts with $100k virtual cash
3. **Alternative Data Signals** - Congressional trades, insider activity
4. **Broker Integration UI** - Mock broker connection flow (EasyEquities, Bamboo)
5. **Payment Gateway Mockup** - M-Pesa, Paystack deposit/withdrawal flows
6. **Enhanced Quality Dashboard** - 4 AI criteria badges + leaderboard

---

## 2. MVP 2.0 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (Enhanced)                       │
│  • African-First Messaging                                       │
│  • "Start Paper Trading" CTA                                     │
│  • JSE/NGX/NSE logos                                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD (Multi-Mode)                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Mode Toggle: [Paper Trading] [Live Account (Coming)]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── LEFT SIDEBAR ─────────────────────────────────────────┐  │
│  │ • Portfolio Summary ($105,234 | +5.2%)                    │  │
│  │ • Paper vs Live indicator                                 │  │
│  │ • Quick Actions: Deposit, Withdraw, Trade                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── MAIN CONTENT ──────────────────────────────────────────┐ │
│  │ [4 Quality Metric Badges]                                 │ │
│  │ • Accuracy: 99.96% ✓                                      │ │
│  │ • Reliability: 99.92% ✓                                   │ │
│  │ • Sharpe: 1.62 ✓                                          │ │
│  │ • Win Rate: 67.3% ✓                                       │ │
│  │                                                            │ │
│  │ [Recommendations Grid]                                     │ │
│  │ ┌──────────────┬──────────────┬──────────────┐           │ │
│  │ │ MTN (JSE)    │ DANGCEM (NGX)│ AAPL (NYSE)  │           │ │
│  │ │ BUY - 89%    │ BUY - 85%    │ HOLD - 72%   │           │ │
│  │ │ ZAR 85.50    │ NGN 285.50   │ USD 175.50   │           │ │
│  │ │ [Congress ↑] │ [Insider ↑]  │ [13F ↑]      │           │ │
│  │ └──────────────┴──────────────┴──────────────┘           │ │
│  │                                                            │ │
│  │ [Market Overview: African Markets]                         │ │
│  │ • JSE: +0.4% | NGX: +1.2% | NSE: -0.3%                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─── RIGHT SIDEBAR ─────────────────────────────────────────┐ │
│  │ [Alternative Data Feed]                                    │ │
│  │ • Pelosi bought AAPL (2 days ago)                         │ │
│  │ • AngloAmerican won mining contract                       │ │
│  │ • MTN Q3 subscriber growth +12%                           │ │
│  │                                                            │ │
│  │ [Leaderboard - Paper Trading]                             │ │
│  │ 1. Sarah K. +22.5% 🏆                                     │ │
│  │ 2. You +5.2% 📈                                           │ │
│  │ 3. John M. +3.8%                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         EVIDENCE TRAIL (Enhanced with Alt Data)                  │
│  • Price/Volume data (Bloomberg, Mansa API)                      │
│  • Sentiment analysis (News, social)                             │
│  • Alternative data (Congressional trades, insiders, 13F)        │
│  • African-specific data (gov contracts, mining licenses)        │
│  • Interactive graph with node types distinguished              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│            PAPER TRADING INTERFACE                               │
│  • Virtual cash: $97,450 (started $100k)                         │
│  • Holdings: 10x MTN, 5x DANGCEM, 100x AAPL                      │
│  • Unrealized P&L: +$5,234 (+5.2%)                              │
│  • Trade history timeline                                        │
│  • Performance chart (vs benchmark)                              │
│  • "Upgrade to Live Account" CTA                                 │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         BROKER CONNECTION FLOW (Mockup)                          │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ Connect Your Broker                                     │     │
│  │ ┌─────────┬─────────┬─────────┬─────────┐            │     │
│  │ │[EasyEq] │[Bamboo] │[Chaka]  │[Trove]  │            │     │
│  │ └─────────┴─────────┴─────────┴─────────┘            │     │
│  │                                                         │     │
│  │ Selected: EasyEquities (SA)                            │     │
│  │ • Supports: JSE, NYSE, NASDAQ                          │     │
│  │ • Commission: 0.25%                                     │     │
│  │                                                         │     │
│  │ [Connect via OAuth2] →                                 │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                  │
│  (In demo: Shows success message, doesn't actually connect)     │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         PAYMENT GATEWAY FLOW (Mockup)                            │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ Deposit Funds                                           │     │
│  │ ┌─────────┬─────────┬─────────┬─────────┐            │     │
│  │ │[M-Pesa] │[Airtel] │[Bank]   │[Card]   │            │     │
│  │ └─────────┴─────────┴─────────┴─────────┘            │     │
│  │                                                         │     │
│  │ Amount: KES 50,000 (≈ $385 USD)                       │     │
│  │ Fee: KES 50 (1%)                                       │     │
│  │                                                         │     │
│  │ Mobile Number: +254 7XX XXX XXX                        │     │
│  │                                                         │     │
│  │ [Send M-Pesa Prompt] →                                │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                  │
│  (In demo: Simulates M-Pesa STK push, shows success)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. New Components to Build

### 3.1 Market Selector Component
```typescript
// components/MarketSelector.tsx
// Toggle between US, African, Global markets
// Shows JSE, NGX, NSE, NYSE, NASDAQ logos
```

### 3.2 Paper Trading Banner
```typescript
// components/PaperTradingBanner.tsx
// Prominent banner: "You're in Paper Trading mode with $97,450 virtual cash"
// Shows P&L, win rate, ranking
// "Switch to Live Account" button
```

### 3.3 Alternative Data Feed
```typescript
// components/AlternativeDataFeed.tsx
// Live-updating feed of congressional trades, insider buys, gov contracts
// Each item clickable → shows evidence trail
```

### 3.4 African Stock Card
```typescript
// components/StockCard.tsx (enhanced)
// Now supports NGX, JSE, NSE stocks
// Shows exchange flag icon
// Currency auto-detected (NGN, ZAR, KES, USD)
// Alternative data badges ("Insider ↑", "Congress ↑")
```

### 3.5 Broker Connect Modal
```typescript
// components/BrokerConnectModal.tsx
// Shows 4-6 African brokers (EasyEquities, Bamboo, Chaka, Trove)
// OAuth2 flow simulation
// Success message: "Connected to EasyEquities"
```

### 3.6 Payment Gateway Modal
```typescript
// components/PaymentGatewayModal.tsx
// Deposit: M-Pesa, Airtel Money, Bank Transfer, Card
// Withdrawal: Same options
// Shows currency conversion (KES → USD → ZAR)
// Simulated STK push for M-Pesa
```

### 3.7 Leaderboard Component
```typescript
// components/Leaderboard.tsx
// Top 10 paper traders
// Shows username, % return, badges
// User's rank highlighted
// "Compete with 5,000+ traders"
```

### 3.8 Enhanced Evidence Graph
```typescript
// components/EvidenceGraph.tsx (enhanced)
// New node types:
//   - congressional_trade (purple)
//   - insider_transaction (orange)
//   - hedge_fund_13f (blue)
//   - government_contract (green)
// Hover shows details (actor name, amount, date)
```

---

## 4. New Data Files

### 4.1 African Stock Data
```json
// data/african-stocks.json
[
  {
    "symbol": "MTN",
    "name": "MTN Group",
    "exchange": "JSE",
    "country": "South Africa",
    "price": 85.50,
    "currency": "ZAR",
    "change": 0.4,
    "change_pct": 0.47,
    "recommendation": "buy",
    "confidence": 89,
    "alt_data_signals": ["insider_buy", "mobile_subscriber_growth"],
    "evidence_trail_id": "trail_mtn_001"
  },
  {
    "symbol": "DANGCEM",
    "name": "Dangote Cement",
    "exchange": "NGX",
    "country": "Nigeria",
    "price": 285.50,
    "currency": "NGN",
    "change": 2.3,
    "change_pct": 0.81,
    "recommendation": "buy",
    "confidence": 85,
    "alt_data_signals": ["government_contract"],
    "evidence_trail_id": "trail_dangcem_001"
  },
  {
    "symbol": "EQTY",
    "name": "Equity Group Holdings",
    "exchange": "NSE",
    "country": "Kenya",
    "price": 52.50,
    "currency": "KES",
    "change": -0.5,
    "change_pct": -0.94,
    "recommendation": "hold",
    "confidence": 68,
    "alt_data_signals": [],
    "evidence_trail_id": "trail_eqty_001"
  }
]
```

### 4.2 Alternative Data Events
```json
// data/alternative-data-events.json
[
  {
    "event_id": "alt_001",
    "data_type": "congressional_trade",
    "actor": "Nancy Pelosi",
    "action": "Purchase",
    "symbol": "AAPL",
    "amount_range": "$1M - $5M",
    "date": "2026-08-15",
    "sentiment": "bullish",
    "timestamp": "2 days ago"
  },
  {
    "event_id": "alt_002",
    "data_type": "insider_transaction",
    "actor": "CEO Nhleko (MTN)",
    "action": "Buy",
    "symbol": "MTN",
    "exchange": "JSE",
    "amount_range": "R500k - R2M",
    "date": "2026-09-10",
    "sentiment": "bullish",
    "timestamp": "2 days ago"
  },
  {
    "event_id": "alt_003",
    "data_type": "government_contract",
    "actor": "Dangote Cement",
    "action": "Awarded",
    "symbol": "DANGCEM",
    "exchange": "NGX",
    "amount_range": "₦15B contract",
    "date": "2026-09-08",
    "sentiment": "bullish",
    "description": "Federal road construction project",
    "timestamp": "4 days ago"
  },
  {
    "event_id": "alt_004",
    "data_type": "hedge_fund_13f",
    "actor": "Renaissance Technologies",
    "action": "Increased Position",
    "symbol": "MSFT",
    "amount_range": "+1.2M shares",
    "date": "2026-08-14",
    "sentiment": "bullish",
    "timestamp": "1 month ago"
  }
]
```

### 4.3 Paper Trading Data
```json
// data/paper-trading-state.json
{
  "user": {
    "account_id": "paper_demo_001",
    "username": "Demo User",
    "email": "demo@mobu.app"
  },
  "account": {
    "starting_capital": 100000.00,
    "current_cash": 97450.00,
    "total_portfolio_value": 105234.00,
    "total_pnl": 5234.00,
    "total_pnl_pct": 5.23,
    "trades_count": 12,
    "winning_trades": 8,
    "losing_trades": 4,
    "win_rate": 66.67,
    "sharpe_ratio": 1.42,
    "rank": 142,
    "total_traders": 5234
  },
  "holdings": [
    {
      "symbol": "MTN",
      "exchange": "JSE",
      "quantity": 10,
      "avg_cost": 82.00,
      "current_price": 85.50,
      "unrealized_pnl": 35.00,
      "unrealized_pnl_pct": 4.27
    },
    {
      "symbol": "DANGCEM",
      "exchange": "NGX",
      "quantity": 5,
      "avg_cost": 280.00,
      "current_price": 285.50,
      "unrealized_pnl": 27.50,
      "unrealized_pnl_pct": 1.96
    },
    {
      "symbol": "AAPL",
      "exchange": "NYSE",
      "quantity": 100,
      "avg_cost": 168.50,
      "current_price": 175.50,
      "unrealized_pnl": 700.00,
      "unrealized_pnl_pct": 4.15
    }
  ],
  "recent_trades": [
    {
      "trade_id": "pt_012",
      "symbol": "AAPL",
      "side": "buy",
      "quantity": 100,
      "price": 168.50,
      "total": 16850.00,
      "executed_at": "2026-09-10T10:30:00Z"
    }
  ]
}
```

### 4.4 Leaderboard Data
```json
// data/paper-trading-leaderboard.json
{
  "period": "monthly",
  "updated_at": "2026-09-12T08:00:00Z",
  "leaders": [
    {
      "rank": 1,
      "username": "Sarah K.",
      "country": "Kenya",
      "total_return": 22.5,
      "trades_count": 45,
      "win_rate": 73.3,
      "badges": ["top_10", "best_sharpe", "100_trades"]
    },
    {
      "rank": 2,
      "username": "You (Demo User)",
      "country": "South Africa",
      "total_return": 5.2,
      "trades_count": 12,
      "win_rate": 66.7,
      "badges": ["newcomer"]
    },
    {
      "rank": 3,
      "username": "John M.",
      "country": "Nigeria",
      "total_return": 3.8,
      "trades_count": 28,
      "win_rate": 60.7,
      "badges": []
    }
  ]
}
```

---

## 5. Page Updates

### 5.1 Landing Page (/)
**Updates**:
- Change tagline: "Africa's First AI-Powered Investment Intelligence Platform"
- Add badges: JSE, NGX, NSE logos
- Add "Start Paper Trading - Free $100k" CTA
- Update value props:
  - "African Markets First" → JSE, NGX, NSE, EGX
  - "Alternative Data Signals" → Congressional trades, insider activity
  - "Practice Risk-Free" → Paper trading with real market prices

### 5.2 Dashboard (/dashboard)
**Major Updates**:
- Add mode toggle: Paper Trading | Live Account (coming soon)
- Replace US-only stocks with African + US mix
- Add alternative data sidebar
- Add leaderboard widget
- Show 4 quality metric badges at top
- Add "Connect Broker" and "Deposit Funds" quick actions

### 5.3 Evidence Trail (/evidence/[id])
**Updates**:
- Add alternative data nodes (purple, orange, green, blue)
- Show congressional trades, insider buys, 13F filings
- Add African-specific data (gov contracts, mining licenses)
- Hover tooltips with actor names and amounts

### 5.4 NEW: Paper Trading Page (/paper-trading)
**Features**:
- Full trading interface
- Portfolio holdings table
- Trade history timeline
- Performance chart (vs S&P 500, JSE All Share)
- Virtual cash balance
- "Execute Trade" mockup
- Leaderboard

### 5.5 NEW: Broker Connect Page (/broker-connect)
**Features**:
- Grid of African brokers (EasyEquities, Bamboo, Chaka, Trove, Hisa)
- Each broker card shows:
  - Logo
  - Supported markets (JSE, NGX, NYSE, etc.)
  - Commission rates
  - "Connect" button
- OAuth2 flow mockup
- Success state

### 5.6 NEW: Payment Gateway Page (/payments)
**Features**:
- Deposit tab: M-Pesa, Airtel Money, Bank, Card
- Withdrawal tab: Same options
- Currency converter widget (KES ↔ USD ↔ ZAR ↔ NGN)
- Transaction history table
- M-Pesa STK push simulation

---

## 6. Implementation Steps

### Week 1: Data & Components
- [ ] Create new data files (african-stocks.json, alternative-data-events.json, etc.)
- [ ] Build MarketSelector component
- [ ] Build PaperTradingBanner component
- [ ] Build AlternativeDataFeed component
- [ ] Enhance StockCard for African markets

### Week 2: Pages
- [ ] Update landing page (African-first messaging)
- [ ] Refresh dashboard (mode toggle, African stocks, alt data sidebar)
- [ ] Enhance evidence trail (alt data nodes)
- [ ] Create Paper Trading page (/paper-trading)

### Week 3: Broker & Payments
- [ ] Create Broker Connect page (/broker-connect)
- [ ] Build BrokerConnectModal component
- [ ] Create Payment Gateway page (/payments)
- [ ] Build PaymentGatewayModal component

### Week 4: Polish & Demo
- [ ] Add leaderboard to dashboard
- [ ] Create demo walkthrough tour
- [ ] Add keyboard shortcuts
- [ ] Update DEMO_GUIDE.md
- [ ] Record demo video

---

## 7. Demo Flow (Updated)

### Investor Pitch Demo (5 minutes)
1. **Landing Page (30s)**
   - "Africa's first transparent AI investment platform"
   - Show JSE/NGX/NSE logos
   - "Start paper trading with $100k free"

2. **Dashboard Overview (1m)**
   - 4 quality badges (99.96% accuracy, 99.92% uptime, 1.62 Sharpe, 67.3% win rate)
   - Mixed recommendations: MTN (JSE), DANGCEM (NGX), AAPL (NYSE)
   - Alternative data feed: "Pelosi bought AAPL", "MTN CEO bought shares"
   - Leaderboard: "You're rank #142 out of 5,234 traders"

3. **Evidence Trail (1.5m)**
   - Click MTN recommendation
   - Show graph with:
     - Price data (Mansa API)
     - Insider buy (CEO Nhleko)
     - Mobile subscriber growth data
     - Analyst reports
   - "Every recommendation is traceable to source data"

4. **Paper Trading (1m)**
   - Show portfolio: $105,234 (+5.2% in 2 weeks)
   - Holdings: 10x MTN, 5x DANGCEM, 100x AAPL
   - "Practice with real market prices, zero risk"
   - Leaderboard ranking

5. **Broker Integration (30s)**
   - "When ready, connect your broker in 1-click"
   - Show EasyEquities, Bamboo, Chaka, Trove
   - OAuth2 flow mockup
   - "Execute MOBU recommendations instantly"

6. **Payment Gateway (30s)**
   - "Deposit with M-Pesa, Airtel Money, or bank"
   - Show M-Pesa STK push simulation
   - "Withdraw profits anytime"

7. **Closing (30s)**
   - "Built for African investors, backed by AI and alternative data"
   - "Try paper trading free → Connect broker when ready"
   - CTA: "Sign up for beta"

---

## 8. Success Metrics for MVP 2.0

### Engagement Metrics
- **Time on demo**: Target 8+ minutes (vs 3 minutes in MVP 1.0)
- **Pages visited**: Target 4+ pages per session
- **Evidence trail clicks**: Target 80% of users click at least one
- **Paper trading signups**: Target 60% conversion from landing page

### Feedback Metrics (Investor/User Testing)
- **"Would you use this?"**: Target 85%+ yes
- **"Is transparency valuable?"**: Target 95%+ yes
- **"Would you trust AI recommendations with evidence?"**: Target 75%+ yes
- **"African market support matters?"**: Target 90%+ yes (for African users)

---

## 9. Technical Stack (No Changes)

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Evidence Graph**: React Flow
- **Icons**: Lucide React
- **Deployment**: Vercel (production-ready)

---

## 10. Post-MVP 2.0 Roadmap

### Phase 3: Real Integrations (Month 3-4)
- [ ] Mansa API integration (real African stock data)
- [ ] Quiver Quantitative API (alternative data)
- [ ] Alpaca paper trading API (US stocks)
- [ ] Build custom paper trading engine (African stocks)

### Phase 4: Broker Partnerships (Month 5-6)
- [ ] EasyEquities API partnership discussion
- [ ] Bamboo API integration
- [ ] OAuth2 implementation

### Phase 5: Payment Rails (Month 7-8)
- [ ] Paystack integration (Nigeria, Ghana, SA, Kenya)
- [ ] Flutterwave integration (34 countries)
- [ ] M-Pesa direct integration (Kenya)

---

## Conclusion

**MVP 2.0 transforms MOBU from a "dashboard demo" into a "full platform preview"** showcasing:
✅ African market coverage (JSE, NGX, NSE)  
✅ Alternative data intelligence (congressional, insider, custom)  
✅ Paper trading (gamified, risk-free)  
✅ Broker integration path (EasyEquities, Bamboo, Chaka)  
✅ African payment rails (M-Pesa, Paystack, Flutterwave)  
✅ 4 AI quality criteria (99.95% accuracy target)

This positions MOBU as **THE investment intelligence platform for African investors**.

---

**Ready to implement?** Start with Week 1 data files and components.

**Document Version**: 2.0  
**Last Updated**: 2026-09-12  
**Approved for Build**: YES ✅
