# MOBU vs Alpaca: Quick Reference Guide

## TL;DR (60 Second Summary)

**Alpaca** = Commission-free broker with API for developers  
**MOBU** = AI investment advisor with evidence trails for African investors

**They're NOT competitors** → They're complementary!

MOBU can **use Alpaca** as execution partner for US stocks.

---

## Side-by-Side Comparison

| **Category** | **Alpaca** | **MOBU** |
|--------------|------------|----------|
| **What it does** | Executes your trades via API | Tells you what to trade & why |
| **Core value** | "Here's the infrastructure" | "Here's the intelligence" |
| **Business type** | Broker-dealer (SEC-registered) | Investment advisor (planned) |
| **Target user** | Algo traders, developers | Retail investors, advisors |
| **Required skill** | Python/JavaScript coding | None (point-and-click UI) |
| **Markets** | US only (NYSE, NASDAQ) | Africa (JSE, NGX, NSE) + US |
| **AI recommendations** | ❌ None (you provide signals) | ✅ AI-powered buy/sell signals |
| **Transparency** | Order fills & prices | Full evidence graph |
| **Paper trading** | ✅ Free, unlimited | ✅ $100k virtual cash |
| **Real trading** | Direct execution | Via broker partners |
| **Commissions** | $0 (PFOF model) | $0 (brokers handle execution) |
| **Minimum deposit** | $0 | $0 (paper), varies (live) |
| **Payment methods** | US bank transfer, ACH | M-Pesa, Paystack, Flutterwave |
| **Options trading** | ✅ Multi-leg strategies | ❌ Not planned |
| **Crypto trading** | ✅ BTC, ETH | ❌ Not planned |
| **API access** | ✅ REST, WebSocket, SDKs | ✅ Planned (recommendations API) |
| **Founded** | 2015 | 2026 (launching) |
| **Users** | 7 million API accounts | TBD |

---

## Key Difference: Layers of the Stack

```
┌─────────────────────────────────────────────────────────┐
│                  INTELLIGENCE LAYER                      │
│  What to buy? Why? When?                                │
│  ✅ MOBU operates here                                   │
│  ❌ Alpaca does NOT operate here                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   EXECUTION LAYER                        │
│  How to execute the trade?                              │
│  ✅ Alpaca operates here                                 │
│  ❌ MOBU does NOT operate here (partners with brokers)   │
└─────────────────────────────────────────────────────────┘
```

**Analogy**:
- **MOBU** = GPS (tells you where to go and why that route is best)
- **Alpaca** = Car (gets you there once you know where to go)

---

## Use Case Scenarios

### Scenario 1: Developer Building Trading Bot
**Best Platform**: Alpaca ✅

**Why**:
- You've coded your own algorithm
- You need API to execute trades
- You want commission-free US stock trading
- You're comfortable writing Python/JavaScript

**Example**:
```python
# Your custom algorithm
if moving_average_50 > moving_average_200:
    # Execute via Alpaca API
    alpaca.submit_order('AAPL', qty=10, side='buy')
```

---

### Scenario 2: African Investor Wants Stock Picks
**Best Platform**: MOBU ✅

**Why**:
- You want AI to recommend what to buy
- You want to see evidence/reasoning
- You want to trade JSE, NGX, or NSE stocks
- You want to pay with M-Pesa or local currency

**Example**:
- MOBU AI: "Buy Dangote Cement (NGX) - 87% confidence"
- User clicks to see evidence graph (earnings growth + low P/E + insider buying)
- User clicks "Execute" → Routed to Bamboo broker

---

### Scenario 3: African Investor Wants African + US Stocks
**Best Platform**: MOBU (using Alpaca for US execution) ✅

**Why**:
- You want AI recommendations for both markets
- You want one unified dashboard
- MOBU handles intelligence layer
- Alpaca handles US execution layer

**Flow**:
1. MOBU recommends: "Buy Safaricom (NSE)" → Execute via Chaka
2. MOBU recommends: "Buy Apple (NASDAQ)" → Execute via **Alpaca API**
3. User sees both holdings in MOBU dashboard

---

## Integration Strategy

### MOBU Can Use Alpaca as Execution Partner

```
┌──────────────────────────────────────────┐
│         MOBU Intelligence Layer          │
│  • AI recommendations                    │
│  • Evidence trails                       │
│  • Alternative data (Quiver, African)    │
└─────────────────┬────────────────────────┘
                  │
                  ▼ Recommendation: "Buy AAPL"
┌──────────────────────────────────────────┐
│           User: "Execute"                │
└────────┬─────────────────────────┬───────┘
         │                         │
         ▼                         ▼
┌────────────────┐      ┌──────────────────┐
│ African Brokers│      │  Alpaca API      │
│ - EasyEquities │      │  (US stocks)     │
│ - Bamboo       │      │  - $0 commission │
│ - Chaka        │      │  - Fractional    │
└────────────────┘      └──────────────────┘
```

**Benefits**:
- MOBU doesn't need to build US brokerage infrastructure
- MOBU users get Alpaca's commission-free US trading
- Alpaca gains customers (MOBU users trading US stocks)
- Win-win partnership

---

## Who Should Use What?

### Use Alpaca If:
- ✅ You're a software developer/engineer
- ✅ You've built your own trading algorithm
- ✅ You need API access for automation
- ✅ You only trade US stocks/options/crypto
- ✅ You're comfortable with coding (Python, JavaScript, Go)

### Use MOBU If:
- ✅ You want AI to recommend stocks (don't want to build algorithms)
- ✅ You want to see evidence/reasoning behind recommendations
- ✅ You want to trade African stocks (JSE, NGX, NSE)
- ✅ You want African + US stocks in one platform
- ✅ You want to pay with M-Pesa, Paystack, or local currency
- ✅ You're a retail investor (not a developer)

### Use Both If:
- ✅ You want MOBU's intelligence for stock picks
- ✅ You want Alpaca's infrastructure for US execution
- ✅ You want the best of both worlds

---

## Pricing Comparison

| **Item** | **Alpaca** | **MOBU** |
|----------|------------|----------|
| **Account opening** | Free | Free |
| **Stock trading commissions** | $0 | $0 (via brokers) |
| **Market data (basic)** | Free (IEX only) | Included |
| **Market data (pro)** | $9/month | Included |
| **AI recommendations** | N/A (no AI) | $20-50/month (planned) |
| **Paper trading** | Free, unlimited | Free (planned) |
| **API access** | Free | Free tier + paid tiers (planned) |

**Total Monthly Cost Examples**:
- **Algo trader using Alpaca**: $0-9/month (just data)
- **Investor using MOBU**: $20-50/month (intelligence + data)
- **Investor using MOBU + Alpaca**: $20-50/month (MOBU subscription, Alpaca free)

---

## Geographic Coverage

### Alpaca
- ✅ **US Markets**: NYSE, NASDAQ, Cboe (options)
- ❌ **African Markets**: Not supported
- ❌ **European Markets**: Not supported
- ❌ **Asian Markets**: Not supported

### MOBU
- ✅ **African Markets**: JSE, NGX, NSE, EGX, GSE, BRVM (via Mansa API)
- ✅ **US Markets**: NYSE, NASDAQ (via Alpaca/broker integration)
- ⏳ **European Markets**: Planned (LSE, Euronext)
- ⏳ **Asian Markets**: Planned (HKEX, SGX)

---

## Regulatory Status

### Alpaca
- **US**: SEC-registered broker-dealer
- **Licenses**: FINRA member, SIPC member
- **Custodian**: Holds customer assets
- **Regulation**: Broker regulations (execution-only, no advice)

### MOBU
- **Africa**: Registered investment advisor (planned - varies by country)
- **Licenses**: Kenya CMA, Nigerian SEC, SA FSCA (planned)
- **Custodian**: Does NOT hold customer assets (users connect own brokers)
- **Regulation**: Investment advisor regulations (provides advice)

**Key Difference**:
- **Alpaca** = Like Charles Schwab (broker)
- **MOBU** = Like Morningstar + Bloomberg Terminal (research/advice)

---

## Technical Architecture

### Alpaca
```
User's Algorithm (Python)
    ↓
Alpaca REST API
    ↓
Alpaca's Order Management System
    ↓
US Stock Exchanges (NYSE, NASDAQ)
    ↓
Alpaca Custodian (holds shares)
```

### MOBU
```
MOBU AI Engine (analyzes 1000+ signals)
    ↓
MOBU Dashboard (user sees recommendation + evidence)
    ↓
User clicks "Execute"
    ↓
Broker API (EasyEquities, Bamboo, or Alpaca)
    ↓
Stock Exchange (JSE, NGX, NSE, or NYSE/NASDAQ)
    ↓
User's Broker (holds shares)
```

---

## Competitive Positioning

### Market Positioning Matrix

```
        Intelligence (What to Buy)
                ↑
                │
      High  MOBU│  Danelfin
            🏆  │  (US only)
                │
                │
    Medium      │  TradeAlgo
                │  (US only)
                │
                │
      Low   Hisa│  Alpaca
          (DIY) │  (API)
                │
                └────────────────────→
           African Markets    US Markets
           (JSE, NGX, NSE)   (NYSE, NASDAQ)
```

**Insight**: MOBU is the ONLY high-intelligence platform for African markets.

---

## Future Roadmap: Potential Collaboration

### Phase 1: MOBU Uses Alpaca (Current Plan)
- MOBU recommends US stocks
- User executes via Alpaca API
- MOBU pays Alpaca per trade (revenue share)

### Phase 2: Alpaca White-Labels MOBU Intelligence (Future)
- Alpaca offers "MOBU AI Recommendations" to its 7M users
- Alpaca users get AI stock picks (powered by MOBU)
- MOBU gets distribution to Alpaca's user base

### Phase 3: Joint Product (Future)
- "Alpaca + MOBU" co-branded platform
- Intelligence layer (MOBU) + Execution layer (Alpaca)
- One-stop shop for algo traders who want AI insights

---

## Frequently Asked Questions

### Q: Can I use MOBU without a broker?
**A**: Yes, for paper trading only. For live trading, you need to connect a broker (EasyEquities, Bamboo, Chaka, or Alpaca).

### Q: Can I use Alpaca without coding?
**A**: Technically yes (basic web interface), but Alpaca is designed for developers. If you don't code, MOBU is better.

### Q: Does MOBU support Alpaca as a broker?
**A**: Yes (planned). MOBU users can execute US stock recommendations via Alpaca API.

### Q: Can African investors use Alpaca directly?
**A**: Yes, but difficult:
- Hard to fund from Africa (US bank transfers only)
- Only US stocks (no JSE, NGX, NSE)
- No M-Pesa or local payment support
- Better to use MOBU → Alpaca integration

### Q: Is MOBU cheaper than Alpaca?
**A**: Different pricing models:
- **Alpaca**: $0 trading, optional $9/mo market data
- **MOBU**: $20-50/mo subscription (includes intelligence + data)
- **Combined**: $20-50/mo (MOBU subscription, Alpaca trading free)

### Q: Which is better for beginners?
**A**: MOBU (AI recommends stocks, no coding required). Alpaca is for developers.

### Q: Which is better for algo traders?
**A**: Alpaca (API-first design). But MOBU can provide signals, Alpaca executes.

---

## Bottom Line

### MOBU ≠ Alpaca

They operate at **different layers**:

- **Alpaca** = Plumbing (execution infrastructure)
- **MOBU** = Intelligence (what to trade & why)

### MOBU + Alpaca = Powerful Combo

- **MOBU** recommends African + US stocks (with evidence)
- **Alpaca** executes US stock trades (commission-free)
- **User** gets unified portfolio in MOBU dashboard

### Target Markets

- **Alpaca**: US-based algo traders & developers (7M users)
- **MOBU**: African retail investors & advisors (500M+ potential market)

**Overlap is minimal**. Most MOBU users wouldn't use Alpaca directly (not developers, want African stocks). Most Alpaca users wouldn't use MOBU (already have their own algos).

---

**Document Version**: 1.0  
**Created**: 2026-09-12  
**Next Update**: After MOBU-Alpaca integration discussions
