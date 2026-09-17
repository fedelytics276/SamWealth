# MOBU MVP - Investment Platform Demo

This is a 2-4 week MVP demo for investor pitches, showcasing MOBU's core value proposition: transparent, evidence-based investment recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
mobu-mvp/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── dashboard.tsx          # Main dashboard (TO BE CREATED)
│   ├── evidence/[id].tsx      # Evidence trail viewer (TO BE CREATED)
│   └── api/                   # API routes
│       ├── recommendations.ts # Get recommendations
│       ├── evidence/[id].ts   # Get evidence trail
│       └── portfolio.ts       # Get portfolio data
├── components/                # Reusable components (TO BE CREATED)
├── data/                      # Static JSON data
│   ├── recommendations.json
│   ├── evidence-trails.json
│   └── portfolio.json
├── styles/
│   └── globals.css
└── public/                    # Static assets
```

## 🎯 Features

### ✅ Completed
- Landing page with hero section
- API routes for recommendations, evidence, and portfolio
- Sample data (3 JSE stocks)
- Project configuration (TypeScript, Tailwind, Next.js)

### 📝 To Do
- [ ] Dashboard page
- [ ] Recommendation cards component
- [ ] Evidence trail visualization (React Flow)
- [ ] Portfolio view component
- [ ] Navigation component
- [ ] Risk profile questionnaire (optional)

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Graph Visualization**: React Flow
- **Deployment**: Vercel (recommended)

## 📊 Sample Data

The demo includes 3 JSE stocks:
1. **Shoprite (SHP.JO)** - Consumer Staples
2. **Naspers (NPN.JO)** - Technology
3. **FirstRand (FSR.JO)** - Financials

## 🎨 Design System

### Colors
- Primary: Blue (#0ea5e9)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold (700-800)
- Body: Regular (400)

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Create `.env.local` for local development:
```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📝 Next Steps

1. **Week 1** (Priority):
   - Create dashboard page
   - Build recommendation cards
   - Implement evidence trail viewer (THE KEY FEATURE)

2. **Week 2**:
   - Polish UI/UX
   - Add loading states
   - Test demo flow

3. **Week 3** (Optional):
   - Risk profile questionnaire
   - Security detail pages
   - Mobile responsive

4. **Week 4** (Optional):
   - Deploy to production
   - Record demo video
   - Prepare pitch script

## 🎬 Demo Script

See `/MOBU_Design/MVP_DEMO_PLAN.md` for the complete 5-minute investor demo script.

## 📞 Support

For questions or issues, refer to:
- **Technical Documentation**: `/MOBU_Design/02_System_Architecture.md`
- **Product Requirements**: `/MOBU_Design/04_Product_Requirements.md`
- **MVP Plan**: `/MOBU_Design/MVP_DEMO_PLAN.md`

---

**Note**: This is a demo/prototype. Do not use in production without proper security, authentication, and data validation.


---

## ✨ NEW: Alpaca Trading Integration

### Features Added (September 2026)

✅ **Paper Trading** via Alpaca
- $100,000 virtual cash for risk-free practice
- Real market prices from NYSE & NASDAQ
- Execute trades with one click
- Track portfolio performance

✅ **Live Trading** via Alpaca (optional upgrade)
- Commission-free real trades
- Fractional shares from $1
- SEC regulated, SIPC protected
- Seamless OAuth connection

✅ **Interactive Leaderboard**
- Compete with other paper traders
- Rankings by % return, win rate, Sharpe ratio
- Top 3 badges (🏆🥈🥉)
- Gamification ready

✅ **Upgrade Flow**
- Paper vs. Live comparison
- Connect Alpaca account
- One-click authorization

### Setup Instructions

1. **Sign up for Alpaca** (free):
   ```
   https://app.alpaca.markets/signup
   ```

2. **Generate API keys** (Paper Trading section)

3. **Configure environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Alpaca keys
   ```

4. **Install dependencies**:
   ```bash
   npm install  # Installs @alpacahq/alpaca-trade-api
   ```

5. **Run the app**:
   ```bash
   npm run dev
   ```

### New Pages

- **/leaderboard** - Paper trading rankings
- **/upgrade** - Upgrade to live trading flow

### New API Routes

- `GET /api/alpaca/account?mode=paper` - Account info
- `GET /api/alpaca/positions?mode=paper` - Holdings
- `POST /api/alpaca/orders` - Execute trade
- `GET /api/leaderboard` - Rankings

### Documentation

- **Alpaca Setup**: See `ALPACA_SETUP.md`
- **African Markets**: See `../MOBU_Design/09_African_Market_Integration.md`
- **Complete Summary**: See `../IMPLEMENTATION_COMPLETE.md`

---

## 🌍 Currency & Exchange Support

### Supported (via Alpaca)
- **NYSE**: USD (United States)
- **NASDAQ**: USD (United States)
- **AMEX**: USD (United States)

### Coming Soon (African Markets)
- **JSE**: ZAR (South Africa)
- **NGX**: NGN (Nigeria)
- **NSE**: KES (Kenya)
- **EGX**: EGP (Egypt)
- **GSE**: GHS (Ghana)

All stock prices display in their native currency with automatic formatting.

---

## 📚 Complete Documentation

| Document | Description |
|----------|-------------|
| `SETUP.md` | Original MVP setup |
| `ALPACA_SETUP.md` | Alpaca integration guide |
| `TROUBLESHOOTING.md` | Common issues & fixes |
| `../IMPLEMENTATION_COMPLETE.md` | Full project summary |
| `../MOBU_Design/09_African_Market_Integration.md` | African markets strategy (40 pages) |

---

**Version**: 0.1.0 → 0.2.0 (Alpaca Integrated)  
**Status**: ✅ Ready for Beta Testing  
**Last Updated**: September 12, 2026
