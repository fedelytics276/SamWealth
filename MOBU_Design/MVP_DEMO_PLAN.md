# MOBU Investment Platform
## MVP Demo Plan for Investor Pitches

**Purpose**: 2-4 week prototype to demonstrate core value proposition  
**Audience**: Investors, potential hires, early design partners  
**Goal**: Secure seed funding + validate product-market fit  
**Last Updated**: September 2026

---

## Table of Contents

1. [MVP Philosophy](#1-mvp-philosophy)
2. [Demo Scope (What's In)](#2-demo-scope-whats-in)
3. [What's NOT in MVP](#3-whats-not-in-mvp)
4. [Technical Architecture (Simplified)](#4-technical-architecture-simplified)
5. [Implementation Plan (2-4 Weeks)](#5-implementation-plan-2-4-weeks)
6. [Demo Script](#6-demo-script)
7. [Sample Data & Scenarios](#7-sample-data--scenarios)
8. [Deployment Strategy](#8-deployment-strategy)
9. [Investor Demo Checklist](#9-investor-demo-checklist)

---

## 1. MVP Philosophy

### 1.1 Core Principle

**"Show, don't tell."**

Build the **minimum** product that demonstrates **maximum** value: transparent, evidence-based investment recommendations.

### 1.2 Success Criteria

A successful MVP demo achieves:

✅ **Demonstrates core value prop** (evidence trails are the product)  
✅ **Works live** (not slides, not mockups — real working software)  
✅ **Takes <5 minutes** to show the "aha!" moment  
✅ **Invites interaction** (investors can click around)  
✅ **Feels production-ready** (not obviously a prototype)

### 1.3 What Makes MOBU Unique

Your demo MUST show:

1. **Recommendation** → User sees "Buy Shoprite"
2. **Evidence Trail** → User clicks "Why?" and sees the graph
3. **Transparency** → Every claim links to a data source

**This is your moat. Everything else is table stakes.**

---

## 2. Demo Scope (What's In)

### 2.1 Features Included (Priority Order)

#### **P0** (Must Have — Week 1-2)

1. **Landing Page**
   - Hero: "Africa's First Transparent Investment Platform"
   - 3 value props (Transparent, Evidence-Based, African-First)
   - "See Demo" CTA

2. **Simple Auth** (Email only, no password for demo)
   - Email input → Magic link → Dashboard
   - Pre-seeded demo account: `demo@mobu.ai`

3. **Dashboard**
   - Welcome message: "Hi Thabo, here are your recommendations"
   - 3 recommendation cards (static for demo)
   - Each shows: Ticker, Name, Action (BUY), Confidence (85%)

4. **Evidence Trail (THE CORE FEATURE)**
   - Click "View Evidence" on any recommendation
   - Show interactive graph visualization:
     - Center: Recommended security (e.g., Shoprite)
     - Connected nodes: Signals (P/E ratio, sector, volatility)
     - Connected nodes: Data sources (JSE, financial statements)
   - Click any node → See detail panel
   - **This is the "wow" moment**

5. **Simple Portfolio View**
   - List of holdings (2-3 securities)
   - Total value, day change
   - No transactions, no live prices

#### **P1** (Nice to Have — Week 3)

6. **Risk Profile Questionnaire** (3 questions)
   - Time horizon (slider: 1-10 years)
   - Risk tolerance (slider: 1-10)
   - Investment goal (dropdown)
   - Results → Influences recommendations shown

7. **Security Detail Page**
   - Click on Shoprite → See detail page
   - Price chart (static image for demo)
   - Key metrics (P/E, Market Cap, Sector)
   - Recent news (2-3 headlines, fake for demo)

#### **P2** (If Time Permits — Week 4)

8. **Comparison View**
   - "Compare with sector average"
   - Side-by-side table: Shoprite vs Consumer Staples
   - Shows why Shoprite is undervalued

9. **Mobile Responsive**
   - Works on iPhone (not a separate app, just responsive web)

---

## 3. What's NOT in MVP

### 3.1 Explicitly Out of Scope

❌ **Real authentication** (no passwords, no KYC, no MFA)  
❌ **Real market data** (use static/mocked data)  
❌ **Real-time prices** (show stale prices, that's fine)  
❌ **Trading/order execution** (just recommendations)  
❌ **Real Neo4j** (fake the graph with hardcoded JSON)  
❌ **Multiple users** (single demo account)  
❌ **Mobile apps** (web only, but responsive)  
❌ **Multiple markets** (JSE only)  
❌ **Admin panel** (not needed for demo)  
❌ **Email notifications** (no background jobs)  
❌ **Performance optimization** (doesn't need to scale)

### 3.2 Technical Shortcuts Allowed

- **Database**: SQLite (not PostgreSQL)
- **Graph**: Hardcoded JSON (not Neo4j)
- **Hosting**: Vercel/Netlify (not Azure/Kubernetes)
- **API**: JSON files (not real API calls)
- **Auth**: Magic links, no sessions (not OAuth)

**Rule**: If it's not visible in the demo, don't build it.

---

## 4. Technical Architecture (Simplified)

### 4.1 MVP Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React + Next.js | Fast to build, looks professional |
| **Styling** | Tailwind CSS | Pre-made components, looks good fast |
| **Charts** | Recharts or Chart.js | Simple, works well |
| **Graph Viz** | React Flow or D3.js | Interactive graph visualization |
| **Backend** | Next.js API Routes | No separate backend needed |
| **Database** | JSON files or SQLite | Fast setup, no infra |
| **Hosting** | Vercel | Deploy in 5 minutes, free tier |
| **Domain** | mobu.ai or mobu-demo.vercel.app | mobu.ai if available |

### 4.2 Architecture Diagram (MVP)

```
┌──────────────────────────────────────────────┐
│         User's Browser                       │
│  ┌────────────────────────────────────────┐ │
│  │  React App (Next.js)                   │ │
│  │  • Landing Page                        │ │
│  │  • Dashboard                           │ │
│  │  • Evidence Trail Viewer               │ │
│  │  • Portfolio View                      │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────┘
                   │
                   ▼ API Calls (Next.js routes)
┌──────────────────────────────────────────────┐
│         Server (Vercel)                      │
│  ┌────────────────────────────────────────┐ │
│  │  API Routes                            │ │
│  │  • GET /api/recommendations            │ │
│  │  • GET /api/evidence/:id               │ │
│  │  • GET /api/portfolio                  │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│                   ▼                          │
│  ┌────────────────────────────────────────┐ │
│  │  Static Data (JSON files)              │ │
│  │  • recommendations.json                │ │
│  │  • evidence-trails.json                │ │
│  │  • portfolio.json                      │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**No Azure, No Kubernetes, No PostgreSQL, No Neo4j.**

Build the illusion of the full platform with 10% of the effort.

---

## 5. Implementation Plan (2-4 Weeks)

### 5.1 Week 1: Core Demo Flow

**Goal**: Investor can see recommendations → evidence trail → "wow!"

#### Day 1-2: Setup & Landing Page
```bash
# Setup
npx create-next-app@latest mobu-demo --typescript --tailwind
cd mobu-demo
npm install recharts react-flow-renderer

# Components to build:
✅ Landing page with hero section
✅ "See Demo" button → /dashboard
✅ Basic navigation (logo, menu)
```

**Files**:
- `pages/index.tsx` — Landing page
- `components/Hero.tsx` — Hero section
- `components/ValueProps.tsx` — 3 value propositions

#### Day 3-4: Dashboard with Recommendations
```typescript
// pages/dashboard.tsx
interface Recommendation {
  id: string;
  ticker: string;
  name: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  priceTarget: number;
  reasoning: string;
}

// Sample data
const recommendations: Recommendation[] = [
  {
    id: '1',
    ticker: 'SHP.JO',
    name: 'Shoprite Holdings Ltd',
    action: 'BUY',
    confidence: 0.85,
    priceTarget: 185.50,
    reasoning: 'Undervalued relative to sector, strong fundamentals'
  },
  // ... 2 more
];
```

**Components**:
- `pages/dashboard.tsx` — Main dashboard
- `components/RecommendationCard.tsx` — Card component
- `components/PortfolioSummary.tsx` — Simple portfolio widget

#### Day 5-7: Evidence Trail Visualization

**This is the most important part!**

```typescript
// pages/evidence/[id].tsx
import ReactFlow from 'react-flow-renderer';

interface EvidenceNode {
  id: string;
  type: 'recommendation' | 'signal' | 'data_source';
  data: {
    label: string;
    description: string;
  };
  position: { x: number; y: number };
}

const evidenceGraph: EvidenceNode[] = [
  {
    id: '1',
    type: 'recommendation',
    data: { 
      label: 'BUY Shoprite', 
      description: 'Confidence: 85%' 
    },
    position: { x: 400, y: 200 }
  },
  {
    id: '2',
    type: 'signal',
    data: { 
      label: 'P/E Ratio: 12.5', 
      description: '31% below sector avg (18.2)' 
    },
    position: { x: 200, y: 100 }
  },
  // ... more nodes
];
```

**Features**:
- Interactive graph (zoom, pan, click nodes)
- Node detail panel (click node → show details)
- Breadcrumb trail (Recommendation → Signal → Data Source)
- Visual styling (color code by node type)

**Design Inspo**: Look at knowledge graph visualizations from:
- Neo4j Bloom
- Obsidian graph view
- Roam Research

---

### 5.2 Week 2: Polish & Refine

#### Day 8-10: UI Polish
- [ ] Design system (colors, fonts, spacing)
- [ ] Consistent styling across pages
- [ ] Loading states (skeleton screens)
- [ ] Empty states
- [ ] Error states

#### Day 11-12: Data Refinement
- [ ] Create 5-10 realistic recommendations
- [ ] Build evidence graphs for each (5-10 nodes each)
- [ ] Add realistic numbers (JSE tickers, actual P/E ratios)
- [ ] Source real company data (use Yahoo Finance for inspiration)

#### Day 13-14: Demo Flow Optimization
- [ ] Smooth transitions between pages
- [ ] Reduce friction (no unnecessary clicks)
- [ ] Add micro-interactions (hover effects, animations)
- [ ] Test with 3 people (friends/family)

---

### 5.3 Week 3: Risk Profile & Security Details (Optional)

#### Day 15-17: Risk Profile Questionnaire
```typescript
// pages/onboarding/risk-profile.tsx
const questions = [
  {
    id: 'horizon',
    question: 'What is your investment time horizon?',
    type: 'slider',
    min: 1,
    max: 10,
    labels: ['1 year', '5 years', '10+ years']
  },
  {
    id: 'risk_tolerance',
    question: 'How comfortable are you with market volatility?',
    type: 'slider',
    min: 1,
    max: 10,
    labels: ['Very conservative', 'Moderate', 'Aggressive']
  },
  {
    id: 'goal',
    question: 'What is your primary investment goal?',
    type: 'select',
    options: ['Retirement', 'Wealth Growth', 'Income', 'Education']
  }
];
```

#### Day 18-19: Security Detail Page
- Stock header (name, ticker, price, change)
- Simple price chart (static image or basic Recharts)
- Key metrics table (P/E, Market Cap, Dividend Yield)
- Recent news (3-5 fake headlines)

#### Day 20-21: Testing & Bug Fixes
- [ ] Test all user flows
- [ ] Fix bugs
- [ ] Test on mobile (iPhone)
- [ ] Test in different browsers (Chrome, Safari, Firefox)

---

### 5.4 Week 4: Deployment & Refinement (Optional)

#### Day 22-24: Deployment
```bash
# Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# Result: https://mobu-demo.vercel.app
```

- [ ] Custom domain (if you have mobu.ai)
- [ ] SSL certificate (automatic with Vercel)
- [ ] Performance testing
- [ ] Analytics (Vercel Analytics or Google Analytics)

#### Day 25-28: Investor-Ready Polish
- [ ] Add "About" page (team, mission, vision)
- [ ] Add "Contact" page (for interested investors)
- [ ] Create demo video (3-minute walkthrough)
- [ ] Prepare demo script (see Section 6)
- [ ] Backup plan (if live demo fails, show video)

---

## 6. Demo Script

### 6.1 Investor Demo (5 Minutes)

**Setup**: Have laptop open to landing page. HDMI connected to projector/TV.

---

**[MINUTE 0:00 - Landing Page]**

**YOU**: "Let me show you what we've built. This is MOBU — Africa's first transparent investment platform."

*[Show landing page]*

**YOU**: "Most investment platforms are black boxes. They say 'Buy this stock' but never explain why. We're different. Let me show you."

*[Click "See Demo"]*

---

**[MINUTE 0:30 - Dashboard]**

**YOU**: "This is Thabo. He's a 35-year-old professional in Johannesburg. He logs in and sees personalized recommendations."

*[Point to recommendations]*

**YOU**: "Notice: We're not just saying 'Buy Shoprite.' We're showing a confidence score — 85%. And there's a button: 'View Evidence.'"

*[Pause for emphasis]*

**YOU**: "This is where we're different."

*[Click "View Evidence" on Shoprite]*

---

**[MINUTE 1:30 - Evidence Trail - THE MONEY SHOT]**

**YOU**: "This is the evidence trail. Every recommendation is a graph of reasoning."

*[Show graph visualization]*

**YOU**: "Here's why we recommend Shoprite:
- Center: The recommendation itself
- Connected: Three key signals:
  1. P/E ratio is 12.5 — 31% below sector average
  2. Beta is 0.8 — matches Thabo's risk profile
  3. Sector is Consumer Staples — defensive, good for his 5-year horizon

And here's the key: Every node links to a data source."

*[Click on P/E ratio node]*

**YOU**: "See? This comes from Shoprite's latest financial statements, filed with the JSE on March 15th. We show the source, the date, and the calculation."

*[Let them absorb this]*

**YOU**: "This is what we mean by transparent. You can verify every claim. Click any node, trace it back."

---

**[MINUTE 3:00 - Portfolio (Quick)]**

**YOU**: "Once Thabo acts on a recommendation, we track it here."

*[Show portfolio]*

**YOU**: "Simple view: Holdings, value, performance. But the magic is the transparency."

---

**[MINUTE 3:30 - Wrap Up]**

**YOU**: "So that's MOBU. Three things make us unique:

1. **Evidence trails** — We show our work, every time
2. **African-first** — JSE, NGX, EGX data from day one
3. **Trust through transparency** — Verify, don't just trust

This is a demo with static data. The full platform scales to real-time data, 7 African exchanges, and 500,000 users."

*[Pause]*

**YOU**: "Questions?"

---

### 6.2 Handling Objections

**Q: "Is this live data?"**  
A: "This demo uses static data to show the concept. The production platform connects to JSE, NGX APIs for real-time data."

**Q: "How does the evidence graph scale?"**  
A: "We use Neo4j graph database. Each recommendation has 10-50 nodes. Rendering is client-side, so it's fast even with complex graphs."

**Q: "What if users don't care about evidence trails?"**  
A: "Early user research (20 interviews) shows 70% of African investors don't trust platforms because they don't explain recommendations. This is our moat."

**Q: "How do you compare to [Competitor]?"**  
A: "They're black boxes. We're transparent. That's the difference."

---

## 7. Sample Data & Scenarios

### 7.1 Demo User Persona

**Name**: Thabo Mokoena  
**Age**: 35  
**Location**: Johannesburg, South Africa  
**Job**: Software Engineer  
**Income**: R 720,000/year ($42K)  
**Investable Cash**: R 200,000 ($12K)  
**Risk Profile**: Moderate (6/10)  
**Time Horizon**: 5 years  
**Goal**: Wealth accumulation (saving for house down payment)

### 7.2 Sample Recommendations

#### Recommendation 1: Shoprite Holdings (SHP.JO)

```json
{
  "id": "rec-001",
  "ticker": "SHP.JO",
  "name": "Shoprite Holdings Ltd",
  "action": "BUY",
  "confidence": 0.85,
  "priceTarget": 185.50,
  "currentPrice": 168.20,
  "upside": 10.3,
  "reasoning": "Undervalued relative to sector, strong fundamentals, defensive sector",
  "evidenceTrail": {
    "nodes": [
      {
        "id": "node-1",
        "type": "recommendation",
        "label": "BUY Shoprite",
        "description": "Confidence: 85%"
      },
      {
        "id": "node-2",
        "type": "signal",
        "label": "P/E Ratio: 12.5",
        "description": "31% below sector average (18.2)",
        "source": "JSE Financial Statements, March 2026"
      },
      {
        "id": "node-3",
        "type": "signal",
        "label": "Beta: 0.8",
        "description": "Matches user risk profile (6/10)",
        "source": "Historical volatility analysis, 24-month window"
      },
      {
        "id": "node-4",
        "type": "signal",
        "label": "Sector: Consumer Staples",
        "description": "Defensive, stable revenue in economic downturns",
        "source": "GICS Sector Classification"
      },
      {
        "id": "node-5",
        "type": "data_source",
        "label": "Shoprite FY2026 Results",
        "description": "Revenue: R 204B, EPS: R 13.46",
        "source": "JSE SENS, March 15 2026"
      }
    ],
    "edges": [
      { "from": "node-1", "to": "node-2" },
      { "from": "node-1", "to": "node-3" },
      { "from": "node-1", "to": "node-4" },
      { "from": "node-2", "to": "node-5" }
    ]
  }
}
```

#### Recommendation 2: Naspers (NPN.JO)

```json
{
  "id": "rec-002",
  "ticker": "NPN.JO",
  "name": "Naspers Ltd",
  "action": "BUY",
  "confidence": 0.78,
  "priceTarget": 3520.00,
  "currentPrice": 3280.50,
  "upside": 7.3,
  "reasoning": "Discount to NAV, Tencent exposure, tech sector growth",
  "evidenceTrail": {
    "nodes": [
      {
        "id": "node-1",
        "type": "recommendation",
        "label": "BUY Naspers",
        "description": "Confidence: 78%"
      },
      {
        "id": "node-2",
        "type": "signal",
        "label": "NAV Discount: 45%",
        "description": "Trading at 55% of Net Asset Value",
        "source": "Naspers Holdings Report, Q1 2026"
      },
      {
        "id": "node-3",
        "type": "signal",
        "label": "Tencent Stake: 26%",
        "description": "Exposure to Chinese tech growth",
        "source": "Prosus Shareholder Report"
      },
      {
        "id": "node-4",
        "type": "signal",
        "label": "Sector: Technology",
        "description": "High growth potential, matches user goal",
        "source": "GICS Sector Classification"
      }
    ],
    "edges": [
      { "from": "node-1", "to": "node-2" },
      { "from": "node-1", "to": "node-3" },
      { "from": "node-1", "to": "node-4" }
    ]
  }
}
```

#### Recommendation 3: FirstRand Bank (FSR.JO)

```json
{
  "id": "rec-003",
  "ticker": "FSR.JO",
  "name": "FirstRand Bank Ltd",
  "action": "BUY",
  "confidence": 0.72,
  "priceTarget": 68.50,
  "currentPrice": 64.20,
  "upside": 6.7,
  "reasoning": "Strong dividend yield, financial sector recovery, SA economic stabilization",
  "evidenceTrail": {
    "nodes": [
      {
        "id": "node-1",
        "type": "recommendation",
        "label": "BUY FirstRand",
        "description": "Confidence: 72%"
      },
      {
        "id": "node-2",
        "type": "signal",
        "label": "Dividend Yield: 5.2%",
        "description": "Above sector average (4.1%)",
        "source": "FirstRand Dividend Announcement, Feb 2026"
      },
      {
        "id": "node-3",
        "type": "signal",
        "label": "ROE: 18.5%",
        "description": "Strong return on equity",
        "source": "FY2026 Financial Results"
      },
      {
        "id": "node-4",
        "type": "signal",
        "label": "Sector: Financials",
        "description": "Recovering post-pandemic",
        "source": "JSE Financial Sector Index"
      }
    ],
    "edges": [
      { "from": "node-1", "to": "node-2" },
      { "from": "node-1", "to": "node-3" },
      { "from": "node-1", "to": "node-4" }
    ]
  }
}
```

### 7.3 Sample Portfolio

```json
{
  "totalValue": 198500.00,
  "dayChange": 2450.00,
  "dayChangePercent": 1.25,
  "holdings": [
    {
      "ticker": "SHP.JO",
      "name": "Shoprite Holdings",
      "quantity": 500,
      "avgCost": 155.20,
      "currentPrice": 168.20,
      "value": 84100.00,
      "gainLoss": 6500.00,
      "gainLossPercent": 8.37
    },
    {
      "ticker": "NPN.JO",
      "name": "Naspers Ltd",
      "quantity": 30,
      "avgCost": 3150.00,
      "currentPrice": 3280.50,
      "value": 98415.00,
      "gainLoss": 3915.00,
      "gainLossPercent": 4.14
    },
    {
      "ticker": "CASH",
      "name": "Cash",
      "quantity": 1,
      "currentPrice": 15985.00,
      "value": 15985.00
    }
  ]
}
```

---

## 8. Deployment Strategy

### 8.1 Vercel Deployment (Recommended)

**Why Vercel**:
- Free tier sufficient for demo
- Deploy from GitHub in 5 minutes
- Automatic HTTPS
- Global CDN
- Zero configuration

**Steps**:
```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mobu-demo.git
git push -u origin main

# 2. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# 3. Set custom domain (optional)
vercel domains add mobu.ai
```

**Result**: https://mobu-demo.vercel.app (or https://mobu.ai)

### 8.2 Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_URL=https://mobu-demo.vercel.app/api
```

### 8.3 Backup Plan

**If live demo fails** (internet issues, bug, etc.):

1. **Record screen video** (before pitch)
   - Use QuickTime (Mac) or OBS (Windows/Mac)
   - 3-minute walkthrough of full demo
   - Upload to Vimeo (unlisted)
   - Have link ready: vimeo.com/123456789

2. **Static slides** (as last resort)
   - Screenshots of key screens
   - Annotated to explain features
   - Not ideal, but better than nothing

---

## 9. Investor Demo Checklist

### 9.1 Pre-Demo (24 Hours Before)

- [ ] Test demo on laptop (full walkthrough)
- [ ] Test demo on phone (quick check)
- [ ] Charge laptop fully
- [ ] Bring HDMI adapter (USB-C to HDMI)
- [ ] Bring backup adapter (in case first fails)
- [ ] Test with projector/TV (if available)
- [ ] Have backup video ready (Vimeo link)
- [ ] Print slide deck (in case demo fails completely)
- [ ] Clear browser cache (fresh load)
- [ ] Disable browser extensions (no ad blockers, etc.)
- [ ] Close all other tabs/apps

### 9.2 Pre-Demo (1 Hour Before)

- [ ] Check internet connection (if using live site)
- [ ] Open demo in browser (pre-load pages)
- [ ] Rehearse demo script (5 minutes)
- [ ] Check audio/video setup
- [ ] Have water nearby (stay hydrated)

### 9.3 During Demo

- [ ] Start on landing page (clean slate)
- [ ] Speak slowly and clearly
- [ ] Pause for reactions (don't rush)
- [ ] Point at screen (use cursor or laser pointer)
- [ ] Ask "Questions?" after each section
- [ ] Be ready to click back if investor asks

### 9.4 Post-Demo

- [ ] Share demo link: https://mobu-demo.vercel.app
- [ ] Share pitch deck (PDF)
- [ ] Share investor FAQ document
- [ ] Follow up email within 24 hours
- [ ] Track engagement (did they visit the demo link?)

---

## 10. Success Metrics

### 10.1 Demo Success Indicators

**During Pitch**:
- ✅ Investor leans forward during evidence trail
- ✅ Investor asks technical questions (shows engagement)
- ✅ Investor asks "How did you build this?" (validates effort)
- ✅ Investor asks "Can I try it?" (wants to interact)
- ✅ Investor immediately asks about next meeting

**Post-Pitch**:
- ✅ Investor visits demo link (track with analytics)
- ✅ Investor spends >3 minutes on site
- ✅ Investor shares demo with partners
- ✅ Investor mentions demo in follow-up email
- ✅ Investor requests term sheet within 1 week

### 10.2 Iteration Plan

After 5-10 pitches, review:
- Which slides get most questions?
- Where do investors seem confused?
- Which features get most excitement?
- What objections come up repeatedly?

**Then iterate**:
- Add FAQ page to demo
- Simplify confusing parts
- Emphasize exciting parts
- Add requested features (if quick)

---

## Appendix A: Code Snippets

### A.1 Evidence Trail Visualization (React Flow)

```typescript
// components/EvidenceGraph.tsx
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
} from 'react-flow-renderer';

interface EvidenceGraphProps {
  recommendationId: string;
}

const EvidenceGraph: React.FC<EvidenceGraphProps> = ({ recommendationId }) => {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'BUY Shoprite' },
      position: { x: 400, y: 200 },
      style: { 
        background: '#10b981', 
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
      },
    },
    {
      id: '2',
      data: { label: 'P/E: 12.5 (31% below avg)' },
      position: { x: 200, y: 100 },
      style: { background: '#3b82f6', color: 'white' },
    },
    {
      id: '3',
      data: { label: 'Beta: 0.8 (Low volatility)' },
      position: { x: 600, y: 100 },
      style: { background: '#3b82f6', color: 'white' },
    },
    {
      id: '4',
      data: { label: 'Consumer Staples Sector' },
      position: { x: 400, y: 300 },
      style: { background: '#3b82f6', color: 'white' },
    },
    {
      id: '5',
      type: 'output',
      data: { label: 'JSE Financial Statements' },
      position: { x: 200, y: 0 },
      style: { background: '#6b7280', color: 'white' },
    },
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e1-4', source: '1', target: '4', animated: true },
    { id: 'e2-5', source: '2', target: '5' },
  ];

  return (
    <div style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default EvidenceGraph;
```

### A.2 Recommendation Card Component

```typescript
// components/RecommendationCard.tsx
interface RecommendationCardProps {
  ticker: string;
  name: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasoning: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  ticker,
  name,
  action,
  confidence,
  priceTarget,
  currentPrice,
  reasoning,
}) => {
  const upside = ((priceTarget - currentPrice) / currentPrice * 100).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{ticker}</h3>
          <p className="text-sm text-gray-600">{name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          action === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {action}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Confidence</p>
          <p className="text-lg font-bold text-gray-900">{(confidence * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Target Price</p>
          <p className="text-lg font-bold text-gray-900">R {priceTarget.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Upside</p>
          <p className="text-lg font-bold text-green-600">+{upside}%</p>
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-gray-700 mb-4">{reasoning}</p>

      {/* CTA */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        View Evidence
      </button>
    </div>
  );
};

export default RecommendationCard;
```

---

## Conclusion

**Timeline Summary**:
- **Week 1**: Core demo (landing, dashboard, evidence trail)
- **Week 2**: Polish + realistic data
- **Week 3**: Risk profile + security details (optional)
- **Week 4**: Deployment + investor prep (optional)

**Minimum Viable Demo**: Week 1-2 (10-14 days)  
**Investor-Ready Demo**: Week 1-3 (21 days)  
**Polished Demo**: Week 1-4 (28 days)

**Remember**: The evidence trail is your moat. Spend 50% of your time making that perfect.

---

**Document Version**: 1.0  
**Last Updated**: September 2026  
**Owner**: CEO / CTO

*Go build! Show, don't tell.*
