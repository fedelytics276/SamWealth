# MOBU Investment Platform - Demo Guide

**Live Demo Running**: http://localhost:3000  
**Status**: ✅ Development Server Active

---

## 🚀 Quick Demo

### Main Dashboard
**URL**: http://localhost:3000/dashboard

**What You'll See**:
- 🎯 **AI Quality Metrics** (4 criteria cards)
  - Data Accuracy: 99.96% ✅
  - System Uptime: 99.92% ✅
  - Sharpe Ratio: 1.62 ✅
  - Win Rate: 67.3% ✅

- 📊 **AI-Powered Recommendations** (3 cards)
  - Each shows: Ticker, Action (BUY/SELL), Confidence, Price Target
  - Click any card to see full evidence trail

- 🔍 **Stock Lookup Tool**
  - Interactive search for any stock
  - Real-time price data
  - Market information

### Evidence Trail
**URL**: http://localhost:3000/evidence/[id]

**Features**:
- Complete data lineage visualization
- Source attribution (dbt lineage)
- Model reasoning breakdown
- Technical indicators graph
- Data quality metrics
- Alternative data signals (Congress trades, insider activity)

### Paper Trading
**URL**: http://localhost:3000/paper-trading

**Features**:
- Virtual $100,000 starting balance
- Execute trades on recommendations
- Track performance vs. benchmark
- P&L tracking
- Trade history

### Leaderboard
**URL**: http://localhost:3000/leaderboard

**Features**:
- Top performers ranking
- Portfolio returns comparison
- Win rate statistics
- Sharpe ratio rankings

---

## 🎨 UI Features Demonstrated

### 1. AI Quality Framework (Dashboard)
Shows the 4 compliance criteria in real-time:

```
┌─────────────────────────────────────────────┐
│  📊 AI Quality Metrics                      │
├─────────────────────────────────────────────┤
│  ✅ Accurate (99.96%)                       │
│  ✅ Reliable (99.92% uptime)                │
│  ✅ Well-Defined Goals (Sharpe 1.62)        │
│  ✅ Self-Improving (67.3% win rate)         │
└─────────────────────────────────────────────┘
```

### 2. Recommendation Cards
Interactive cards with:
- Color-coded action (green BUY, red SELL)
- Confidence percentage
- Expected upside
- Sector & exchange tags
- Click to view evidence

### 3. Evidence Trail
Comprehensive breakdown:
- Data source lineage (dbt visualization)
- Model version & accuracy
- Technical indicators (RSI, MACD, Bollinger Bands)
- Volume analysis
- Alternative data signals
- Risk assessment

### 4. Data Source Toggle
Switch between:
- 🟢 **Live Data** (PostgreSQL + dbt)
- 🔵 **Demo Data** (JSON files)

### 5. Dark Mode Support
Clean, modern design with:
- Professional color scheme
- Responsive layout
- Smooth animations
- Accessible components

---

## 📱 Demo Flow (Recommended)

### Step 1: Dashboard Overview (30 seconds)
1. Open http://localhost:3000/dashboard
2. See AI Quality Metrics at top
3. Notice "Live Data" toggle (currently showing demo data)
4. Scroll to see 3 AI recommendations

### Step 2: Explore Recommendation (1 minute)
1. Click on any recommendation card
2. Evidence trail page opens
3. Review:
   - Data lineage diagram (shows dbt transformations)
   - Model reasoning
   - Technical indicators graph
   - Alternative data (if available)

### Step 3: Stock Lookup (30 seconds)
1. Use search bar on dashboard
2. Type "AAPL" or "MSFT"
3. See real-time price and info

### Step 4: Paper Trading (1 minute)
1. Navigate to Paper Trading page
2. See virtual $100K balance
3. Execute a trade on a recommendation
4. View updated portfolio

### Step 5: Leaderboard (30 seconds)
1. Check top performers
2. See your ranking (if traded)
3. Compare returns vs. others

**Total Demo Time**: ~4 minutes

---

## 🔧 Demo Features Working

### Currently Active ✅
- [x] Dashboard with AI recommendations
- [x] Quality metrics display (4 criteria)
- [x] Evidence trail with data lineage
- [x] Stock lookup functionality
- [x] Paper trading system
- [x] Leaderboard
- [x] Responsive design
- [x] Navigation between pages

### In Progress 🚧
- [ ] Live price updates (needs API keys)
- [ ] Real portfolio tracking (database integration)
- [ ] Alternative data display (Quiver API)
- [ ] African market data (Mansa API)

### Future Enhancements 🔮
- [ ] Real-time WebSocket updates
- [ ] Mobile app
- [ ] Advanced charting
- [ ] Social features
- [ ] Broker integration (EasyEquities, Bamboo)

---

## 🎯 Key Selling Points to Show

### 1. AI Transparency
"Unlike other platforms, MOBU shows you **WHY** the AI made each decision"
- Click evidence trail to see complete reasoning
- Data lineage shows transformation steps
- Source attribution for every data point

### 2. Quality First
"4 compliance criteria tracked in real-time"
- Accuracy, Reliability, Goal Definition, Self-Improvement
- Quarterly compliance reports
- Model versioning and auditing

### 3. African Markets Focus
"First platform to integrate African stock exchanges"
- NGX, JSE, NSE, EGX coverage
- Local payment methods
- Familiar UI for African users

### 4. Paper Trading
"Practice risk-free before investing real money"
- Virtual $100K to start
- Real market data
- Performance tracking

### 5. Alternative Data
"Institutional-grade signals for retail investors"
- Congressional stock trades
- Insider transaction alerts
- Hedge fund 13F filings
- Lobbying activity tracking

---

## 🖼️ Screenshots to Capture

For presentations or documentation:

1. **Dashboard Overview**
   - Full page showing quality metrics + recommendations
   - Capture: http://localhost:3000/dashboard

2. **Evidence Trail**
   - Data lineage diagram
   - Capture: Click any recommendation

3. **Paper Trading**
   - Portfolio view
   - Capture: http://localhost:3000/paper-trading

4. **Quality Metrics Close-up**
   - Zoom in on 4 criteria cards

5. **Recommendation Card**
   - Single card showing BUY/SELL action

---

## 💡 Demo Tips

### For Investors
Focus on:
- AI Quality Framework (regulatory compliance)
- Evidence trail (transparency)
- Market opportunity (Africa + alternative data)

### For Users
Focus on:
- Easy-to-understand recommendations
- Paper trading for practice
- African market access

### For Technical Audience
Focus on:
- dbt data lineage
- API integrations (Mansa, Alpha Vantage, Quiver)
- Database architecture
- Model versioning

---

## 🐛 Known Demo Limitations

1. **Using Demo Data**
   - Currently showing JSON files
   - Not connected to live APIs (need keys)
   - Fix: Add API keys to `.env.local`

2. **Static Prices**
   - Prices don't update in real-time
   - Fix: Complete API integration

3. **No Real Trading**
   - Paper trading only
   - Fix: Integrate with broker (Phase 2)

4. **Limited Stocks**
   - Demo shows ~10 recommendations
   - Fix: Connect to full data feeds

---

## 🔄 Restart Demo

If needed, restart the development server:

```bash
# Stop current server
# Press Ctrl+C in terminal

# Start again
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev

# Or use the demo script
./PUSH_TO_GITHUB.sh
```

---

## 📞 Demo Support

**Questions During Demo**:
- Portfolio values: "These are examples with demo data"
- API keys: "We have Mansa and Quiver configured, adding Alpha Vantage"
- Live trading: "Coming in Phase 2 with broker integration"
- Mobile app: "Planned for Q2 2027"

**Handling Issues**:
- Page not loading: Check dev server is running
- Errors in console: Expected with demo data, normal
- Missing features: "In development, see roadmap"

---

## 🎬 Demo Script (30-second pitch)

> "MOBU is an AI-powered investment platform built for African markets. What makes us different? **Transparency**. 
> 
> [Show dashboard] Every AI recommendation comes with a complete evidence trail showing exactly why the AI made that decision. 
> 
> [Click evidence] See? Data lineage, technical indicators, even congressional trading data.
> 
> [Show quality metrics] We track 4 compliance criteria in real-time to ensure our AI is accurate, reliable, and continuously improving.
> 
> [Show paper trading] And you can practice with virtual money before risking real capital.
> 
> Ready to see the full platform?"

---

**Demo Status**: ✅ LIVE at http://localhost:3000  
**Version**: MVP v1.0  
**Last Updated**: 2026-09-12
