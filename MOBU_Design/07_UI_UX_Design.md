# MOBU Investment Platform
## UI/UX Design Specification

**Version:** 1.0  
**Date:** September 2026  
**Status:** Complete Design System & Mockups

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [User Flows](#3-user-flows)
4. [Screen Designs](#4-screen-designs)
5. [Mobile Experience](#5-mobile-experience)
6. [Accessibility](#6-accessibility)
7. [Animation & Micro-interactions](#7-animation--micro-interactions)
8. [Design Deliverables](#8-design-deliverables)

---

## 1. Design Philosophy

### 1.1 Core Principles

**Transparency as Visual Language**
- Evidence trails are visual, not buried in text
- Data quality always visible
- Confidence levels shown with every recommendation
- "Show your work" is the UI paradigm

**Clarity over Cleverness**
- One primary action per screen
- Clear visual hierarchy
- Progressive disclosure for complexity
- Plain language, no jargon

**Trust through Design**
- Professional, institutional aesthetic
- Consistent patterns build familiarity
- No dark patterns, no manipulation
- Honest about limitations

**Accessible by Default**
- WCAG 2.1 Level AA compliance
- Multiple ways to accomplish tasks
- Keyboard navigation everywhere
- Screen reader optimized

---

### 1.2 Brand Personality

**Professional yet Approachable**
- Not stuffy banking, not playful fintech
- Confident without being arrogant
- Warm colors, clean layouts

**Transparent**
- Literally: evidence trails are visual graphs
- Figuratively: clear communication, no hidden fees

**Empowering**
- Users feel in control
- Education built into experience
- Progress indicators everywhere

---

## 2. Design System

### 2.1 Color Palette

**Primary Colors**
```
MOBU Blue:     #0066CC  (Trust, stability, intelligence)
MOBU Dark:     #003366  (Headers, emphasis)
MOBU Light:    #E6F2FF  (Backgrounds, highlights)
```

**Secondary Colors**
```
Success Green: #00B050  (Positive returns, confirmations)
Warning Amber: #FFA500  (Cautions, pending actions)
Error Red:     #DC3545  (Losses, errors, alerts)
Neutral Gray:  #6C757D  (Secondary text, disabled states)
```

**Market Colors**
```
JSE Blue:      #004C97  (South Africa)
NGX Green:     #00A651  (Nigeria)
EGX Gold:      #C9A000  (Egypt)
NSE Orange:    #FF6600  (Kenya)
```

**Semantic Colors**
```
Buy Signal:    #00B050  (Recommendations to buy)
Sell Signal:   #DC3545  (Recommendations to sell)
Hold Signal:   #6C757D  (Hold recommendations)
High Conviction: #0066CC (Strong recommendations)
Low Conviction:  #B3D9FF (Weak recommendations)
```

---

### 2.2 Typography

**Font Family**
```
Primary:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif
Monospace: 'Roboto Mono', 'Courier New', monospace (for numbers, codes)
```

**Type Scale**
```
Display:   48px / 56px line-height, weight 700 (H1, Hero)
Heading 1: 36px / 44px, weight 600 (Page titles)
Heading 2: 28px / 36px, weight 600 (Section titles)
Heading 3: 20px / 28px, weight 600 (Subsections)
Body:      16px / 24px, weight 400 (Main content)
Small:     14px / 20px, weight 400 (Labels, captions)
Tiny:      12px / 16px, weight 400 (Metadata, footnotes)
```

**Number Formatting**
```
Currency:  Monospace, 18px, weight 500
  Positive: #00B050
  Negative: #DC3545
  Neutral:  #1a1a1a

Percentages: Monospace, 16px
  +0.00% (green)
  -0.00% (red)
```

---

### 2.3 Spacing System

**8px Base Grid**
```
XXS: 4px   (Tight spacing, icon padding)
XS:  8px   (Compact spacing)
SM:  16px  (Default spacing)
MD:  24px  (Section spacing)
LG:  32px  (Component spacing)
XL:  48px  (Page section spacing)
XXL: 64px  (Hero spacing)
```

---

### 2.4 Component Library

#### Buttons

**Primary Button**
```
Background: #0066CC
Text: #FFFFFF
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Hover: #0052A3
Active: #003D7A
Disabled: #B3D9FF (50% opacity)
```

**Secondary Button**
```
Background: transparent
Border: 2px solid #0066CC
Text: #0066CC
Hover: Background #E6F2FF
```

**Danger Button**
```
Background: #DC3545
Text: #FFFFFF
(Used for destructive actions like "Delete Portfolio")
```

**Button Sizes**
```
Small:  py-2 px-4 text-sm (32px height)
Medium: py-3 px-6 text-base (44px height)
Large:  py-4 px-8 text-lg (56px height)
```

---

#### Cards

**Standard Card**
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover: Shadow 0 4px 6px rgba(0,0,0,0.1)
```

**Highlighted Card** (for recommendations)
```
Border: 2px solid #0066CC
Background: linear-gradient(to bottom, #FFFFFF, #F8FBFF)
```

---

#### Form Inputs

**Text Input**
```
Border: 1px solid #D1D5DB
Border-radius: 8px
Padding: 12px 16px
Font-size: 16px
Focus: Border #0066CC, Shadow 0 0 0 3px rgba(0,102,204,0.1)
Error: Border #DC3545
```

**Label**
```
Font-size: 14px
Font-weight: 600
Color: #374151
Margin-bottom: 8px
```

---

#### Tags & Badges

**Conviction Badge**
```
High (>0.7):   Background #00B050, Text #FFFFFF
Medium (0.4-0.7): Background #FFA500, Text #FFFFFF
Low (<0.4):    Background #6C757D, Text #FFFFFF
Padding: 4px 12px
Border-radius: 16px (pill shape)
Font-size: 12px
Font-weight: 600
```

**Market Tag**
```
Border: 1px solid {market_color}
Background: transparent
Text: {market_color}
Padding: 4px 8px
Border-radius: 4px
Font-size: 12px
```

---

#### Data Visualization

**Chart Colors**
```
Line (Portfolio): #0066CC
Line (Benchmark): #6C757D
Positive Bar: #00B050
Negative Bar: #DC3545
Neutral Bar: #6C757D
```

**Evidence Graph**
```
Recommendation Node: #0066CC
Signal Node: #00B050
Instrument Node: #FFA500
Compliance Node: #6C757D
Edge (strong): 3px solid
Edge (weak): 1px dashed
```

---

### 2.5 Iconography

**Icon Style**: Outlined, 2px stroke  
**Icon Library**: Heroicons, Feather Icons  
**Sizes**: 16px, 20px, 24px, 32px

**Key Icons**:
```
Portfolio:      📊 Bar chart
Recommendations: 💡 Light bulb
Risk:           ⚠️  Alert triangle
Reports:        📄 Document
Search:         🔍 Magnifying glass
Settings:       ⚙️  Cog
Help:           ❓ Question circle
Trending Up:    📈 Chart up
Trending Down:  📉 Chart down
```

---

## 3. User Flows

### 3.1 New User Onboarding (10 minutes)

```
[Landing Page]
      ↓
[Sign Up Form]
  - Email
  - Password
  - Country
  - Terms acceptance
      ↓
[Email Verification]
  - Check your inbox
  - Click verify link
      ↓
[Welcome Screen]
  - "Welcome to MOBU"
  - Brief platform intro (30 seconds)
      ↓
[Risk Tolerance Questionnaire]
  - 10 questions
  - Multiple choice
  - Progress bar
      ↓
[Goal Setting]
  - What are you investing for?
  - Retirement, Home, Education, Wealth
  - Time horizon
      ↓
[Suggested Portfolio]
  - Based on risk profile
  - Asset allocation pie chart
  - "This is your starting point"
      ↓
[Dashboard Tour]
  - Interactive walkthrough
  - 5 key features highlighted
  - Skip button always visible
      ↓
[Dashboard - Ready to Use]
```

---

### 3.2 Daily Check-In Flow (2 minutes)

```
[Login]
      ↓
[Dashboard]
  - Portfolio value front and center
  - Today's change (+ or -)
  - Alerts badge (if any)
      ↓
[Recommendations Tab] (optional)
  - 3-5 new recommendations
  - Sorted by conviction
  - One-tap to see details
      ↓
[Recommendation Detail] (optional)
  - Evidence trail visualization
  - Plain-language explanation
  - Accept / Dismiss buttons
      ↓
[Confirmation] (if accepted)
  - "Added to your action items"
  - Option to execute trade
```

---

### 3.3 Deep Dive on Recommendation (5 minutes)

```
[Recommendations Page]
  - List of all recommendations
  - Filters: action, sector, market
      ↓
[Click Recommendation Card]
      ↓
[Recommendation Detail Page]
  ├─ [Summary Section]
  │   - Action, instrument, conviction
  │   - Key signals snapshot
  │
  ├─ [Evidence Trail Visualization]
  │   - Interactive graph
  │   - Click nodes to expand
  │   - Zoom and pan
  │
  ├─ [Detailed Explanation]
  │   - Why now?
  │   - What signals support this?
  │   - What are the risks?
  │
  ├─ [Supporting Data]
  │   - Price chart
  │   - Fundamentals table
  │   - News sentiment
  │
  └─ [Action Buttons]
      - Accept recommendation
      - Dismiss
      - Save for later
      - Share
```

---

## 4. Screen Designs

### 4.1 Landing Page

```
┌────────────────────────────────────────────────────┐
│  MOBU Logo          Features  About  Login  Sign Up│
└────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────┐
        │                                      │
        │    Investment Intelligence           │
        │    You Can Trust                     │
        │                                      │
        │    Every recommendation shows its    │
        │    work. See the evidence trail.     │
        │                                      │
        │    [Start Investing →]               │
        │                                      │
        │    [See How It Works ↓]              │
        │                                      │
        └──────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    How MOBU Works

    [Icon]                [Icon]              [Icon]
    Transparent AI        Smart Analysis      Your Control
    
    Every recommendation  We analyze 7        You decide every
    comes with a visual   African markets     trade. No auto-
    evidence trail you    with explainable    pilot without
    can explore.          intelligence.       your approval.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Trusted by 10,000+ African Investors

    [Testimonial 1]  [Testimonial 2]  [Testimonial 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Ready to start?

    [Sign Up Free →]
```

---

### 4.2 Dashboard (Main Screen)

```
┌────────────────────────────────────────────────────┐
│ MOBU   [Search]              🔔3  [Profile ▼]     │
├────────────────────────────────────────────────────┤
│ Dashboard  Portfolios  Recommendations  Reports    │
└────────────────────────────────────────────────────┘

┌─────────────────────────────┬──────────────────────┐
│ My Retirement Portfolio      │ Recommendations      │
│                             │                      │
│     R 125,450.75            │ ┌──────────────────┐ │
│     +R 3,245.50 (+2.65%)    │ │ 🟢 BUY            │ │
│     Today                   │ │ MTN Group         │ │
│                             │ │ Conviction: 72%   │ │
│ [View Full Portfolio →]     │ │ [View Details]    │ │
│                             │ └──────────────────┘ │
├─────────────────────────────┤                      │
│ Performance                 │ ┌──────────────────┐ │
│                             │ │ 🟢 BUY            │ │
│  Portfolio ━━━━━━━          │ │ Naspers          │ │
│  Benchmark ┄┄┄┄┄┄┄          │ │ Conviction: 68%   │ │
│                             │ │ [View Details]    │ │
│  [Chart: Last 30 days]      │ └──────────────────┘ │
│                             │                      │
├─────────────────────────────┤ [See All (5) →]      │
│ Allocation                  │                      │
│                             ├──────────────────────┤
│  [Pie Chart]                │ Quick Actions        │
│   Equities   75%            │                      │
│   Bonds      15%            │ [Add Transaction]    │
│   Cash       10%            │ [Generate Report]    │
│                             │ [Rebalance]          │
└─────────────────────────────┴──────────────────────┘

┌────────────────────────────────────────────────────┐
│ Recent Activity                                    │
├────────────────────────────────────────────────────┤
│ 🟢 Bought 100 shares of Sasol       Sep 5, 2026   │
│ 📊 Monthly report generated         Sep 1, 2026   │
│ 💰 Dividend received: Naspers       Aug 28, 2026  │
└────────────────────────────────────────────────────┘
```

---

### 4.3 Recommendations Page

```
┌────────────────────────────────────────────────────┐
│ MOBU   Recommendations                 [Profile]   │
├────────────────────────────────────────────────────┤
│ Dashboard  Portfolios  Recommendations  Reports    │
└────────────────────────────────────────────────────┘

Your Recommendations (5)

Filters: [All Actions ▼] [All Sectors ▼] [All Markets ▼]
Sort by: [Conviction ▼]

┌────────────────────────────────────────────────────┐
│ 🟢 BUY                               Conviction 72% │
│ MTN Group                                          │
│ JSE: MTN  |  Telecommunications  |  R 95.50        │
│                                                    │
│ Undervalued based on P/E ratio. Positive momentum. │
│ Strong fundamentals with ROE of 22%.               │
│                                                    │
│ Key Signals:                                       │
│ • Valuation (40%): P/E 11.2 vs sector 14.5        │
│ • Momentum (30%): Up 12% in 90 days               │
│ • Quality (30%): ROE 22%, above average            │
│                                                    │
│ Data Quality: ███████░░░ 85%                       │
│ Compliance: ✓ Passed all checks                    │
│                                                    │
│ [View Evidence Trail] [Accept] [Dismiss]           │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ 🟢 BUY                               Conviction 68% │
│ Naspers Limited                                    │
│ JSE: NPN  |  Media & Entertainment  |  R 3,450.00  │
│                                                    │
│ Trading below intrinsic value. Tech exposure.      │
│ Recent Tencent results positive.                   │
│                                                    │
│ [View Details →]                                   │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ 🔴 SELL                              Conviction 65% │
│ Shoprite Holdings                                  │
│ JSE: SHP  |  Consumer Staples  |  R 182.00         │
│                                                    │
│ Overvalued. Weak momentum. Competition concerns.   │
│                                                    │
│ [View Details →]                                   │
└────────────────────────────────────────────────────┘
```

---

### 4.4 Recommendation Detail & Evidence Trail

```
┌────────────────────────────────────────────────────┐
│ ← Back to Recommendations                          │
└────────────────────────────────────────────────────┘

BUY MTN Group                        Conviction: 72%
JSE: MTN  |  Current Price: R 95.50  |  Target: R 115

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary

MTN Group is currently undervalued based on multiple 
valuation metrics. The stock shows positive price momentum 
and strong quality signals. With a P/E ratio of 11.2 
compared to the sector median of 14.5, there's 23% upside 
potential. Quality metrics are solid with ROE of 22%.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Evidence Trail (Click to explore)

        [Recommendation: BUY MTN]
                  │
        ┌─────────┼─────────┐
        │         │         │
    [Signal]  [Signal]  [Signal]
   Valuation  Momentum  Quality
    ⚡ 0.8     ⚡ 0.6    ⚡ 0.5
    40%       30%       30%
        │         │         │
        └─────────┼─────────┘
                  │
           [MTN: ZAE000042164]
                  │
        ┌─────────┴─────────┐
    [Price Data]      [Fundamentals]
    Quality: 92%      Quality: 85%

    [Compliance: ✓ All Rules Pass]
           │
    [FSCA: Single Equity Limit]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Signal Details

┌──────────────────────────────────────────┐
│ Valuation Signal                    40%  │
│ ⚡ Strength: 0.8 (Strong)                 │
│                                          │
│ P/E Ratio: 11.2                          │
│ Sector Median: 14.5                      │
│ Discount: 23%                            │
│                                          │
│ Why this matters: MTN is trading below   │
│ sector peers despite similar growth.     │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Momentum Signal                     30%  │
│ ⚡ Strength: 0.6 (Moderate)               │
│                                          │
│ Price Change (90d): +12.5%               │
│ Benchmark Change: +8.2%                  │
│ Relative Strength: Outperforming         │
│                                          │
│ [Price Chart: 90 days]                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Quality Signal                      30%  │
│ ⚡ Strength: 0.5 (Moderate)               │
│                                          │
│ ROE: 22%                                 │
│ Sector Average: 18%                      │
│ Debt/Equity: 0.45 (Healthy)              │
│                                          │
│ Why this matters: Strong profitability   │
│ and manageable debt levels.              │
└──────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risks to Consider

⚠️  Currency Risk: ZAR volatility could impact returns
⚠️  Regulatory: Nigerian operations face policy uncertainty
⚠️  Competition: Market share pressure from new entrants

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Compliance Checks

✓ FSCA Single Equity Limit (< 10%)
✓ FSCA Sector Limit (< 25%)
✓ Portfolio Liquidity Requirements
✓ Suitability for Risk Profile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data Quality: 85%

Sources:
• Price data: JSE (Updated 16:00, Real-time)
• Fundamentals: MTN Annual Report 2026
• Analyst estimates: 3 sources, avg. consensus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actions

[Accept Recommendation]  [Dismiss]  [Save for Later]

If you accept, suggested trade:
• Buy 50 shares of MTN
• Estimated cost: R 4,775 + R 50 fees
• New portfolio weight: 3.8%
```

---

### 4.5 Portfolio Detail Page

```
┌────────────────────────────────────────────────────┐
│ My Retirement Portfolio                 [Edit] [⋮] │
└────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────────────────┐
│ R 125,450.75        │ Performance vs Benchmark     │
│ +R 25,450.75 (+25.45%)                            │
│ Since inception     │ Portfolio: +25.45%           │
│                     │ Benchmark: +18.90%           │
│ Today: +2.65%       │ Outperformance: +6.55%       │
└─────────────────────┴──────────────────────────────┘

[Holdings] [Performance] [Transactions] [Risk] [Settings]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Holdings (12 positions)                    [Add ⊕]

┌────────────────────────────────────────────────────┐
│ Sasol Limited                              8.94%   │
│ ZAE000015889  |  Energy  |  JSE                   │
│                                                    │
│ 350 shares @ R 320.50 = R 112,175                 │
│ Cost basis: R 280.50                               │
│ Gain: +R 14,000 (+14.26%)                         │
│                                                    │
│ [View Details] [Trade]                             │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ Naspers Limited                            6.87%   │
│ ZAE000015889  |  Media  |  JSE                    │
│                                                    │
│ 25 shares @ R 3,450 = R 86,250                    │
│ Gain: +R 6,250 (+7.81%)                           │
│                                                    │
│ [View Details] [Trade]                             │
└────────────────────────────────────────────────────┘

... (10 more holdings)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Allocation

[Pie Chart]
Equities:    75% (R 94,088)
Bonds:       15% (R 18,818)
Cash:        10% (R 12,545)

By Sector:
Financials:  23.5%
Energy:      15.8%
Consumer:    12.3%
...

By Market:
JSE:         85%
NGX:         10%
NSE:         5%
```

---

## 5. Mobile Experience

### 5.1 Mobile Dashboard

```
╔════════════════════════╗
║  MOBU    🔔3    [☰]   ║
╠════════════════════════╣
║                        ║
║  My Retirement         ║
║  Portfolio             ║
║                        ║
║    R 125,450.75        ║
║    +R 3,245 (+2.65%)   ║
║    Today               ║
║                        ║
║  [View Portfolio →]    ║
║                        ║
╠════════════════════════╣
║ New Recommendations    ║
║                        ║
║ ┌────────────────────┐ ║
║ │ 🟢 BUY        72%  │ ║
║ │ MTN Group          │ ║
║ │ [Tap to view]      │ ║
║ └────────────────────┘ ║
║                        ║
║ ┌────────────────────┐ ║
║ │ 🟢 BUY        68%  │ ║
║ │ Naspers            │ ║
║ │ [Tap to view]      │ ║
║ └────────────────────┘ ║
║                        ║
║ [See All (5)]          ║
║                        ║
╠════════════════════════╣
║ Performance (30d)      ║
║                        ║
║ [Sparkline chart]      ║
║                        ║
║ +25.45% vs +18.90%     ║
║                        ║
╚════════════════════════╝

[Home] [Portfolio] [Recs] [More]
```

### 5.2 Mobile Navigation Pattern

**Bottom Tab Bar** (Primary Navigation)
```
┌─────┬─────┬─────┬─────┐
│ 🏠  │ 📊  │ 💡  │ ⋮   │
│Home │Port │Recs │More │
└─────┴─────┴─────┴─────┘
```

**Swipe Gestures**
- Swipe left on recommendation card: Dismiss
- Swipe right on recommendation card: Accept
- Pull down to refresh: Update data
- Swipe between tabs: Navigate sections

---

## 6. Accessibility

### 6.1 WCAG 2.1 Compliance

**Level AA Requirements**:
- ✓ Color contrast ratio ≥ 4.5:1 for text
- ✓ Color contrast ratio ≥ 3:1 for UI components
- ✓ All functionality available via keyboard
- ✓ Focus indicators visible
- ✓ Skip links to main content
- ✓ Proper heading hierarchy (H1 → H2 → H3)
- ✓ Alt text for all images
- ✓ ARIA labels for icons
- ✓ Form labels associated with inputs

### 6.2 Screen Reader Optimization

**Example: Recommendation Card**
```html
<article role="article" aria-label="Buy recommendation for MTN Group">
  <header>
    <span aria-label="Action: Buy">🟢 BUY</span>
    <h3>MTN Group</h3>
    <span aria-label="Conviction score: 72%">72%</span>
  </header>
  <p>Undervalued based on P/E ratio...</p>
  <footer>
    <button aria-label="View evidence trail for MTN Group">
      View Evidence Trail
    </button>
    <button aria-label="Accept recommendation to buy MTN Group">
      Accept
    </button>
  </footer>
</article>
```

### 6.3 Keyboard Navigation

**Standard Navigation**:
- `Tab`: Move to next interactive element
- `Shift+Tab`: Move to previous element
- `Enter/Space`: Activate button or link
- `Arrow keys`: Navigate within components (dropdowns, tabs)
- `Esc`: Close modals/popovers

**Custom Shortcuts**:
- `Cmd/Ctrl + K`: Open search
- `Cmd/Ctrl + H`: Go to home/dashboard
- `Cmd/Ctrl + P`: Go to portfolios
- `Cmd/Ctrl + R`: Go to recommendations
- `?`: Show keyboard shortcuts help

### 6.4 Responsive Text Sizing

All text scales up to 200% without breaking layout or losing functionality.

---

## 7. Animation & Micro-interactions

### 7.1 Animation Principles

**Purposeful**: Every animation serves a function (feedback, guidance, or delight)
**Fast**: 200-300ms for most transitions
**Subtle**: Easing curves, not bouncy or distracting
**Respectful**: Respect `prefers-reduced-motion` setting

### 7.2 Key Animations

**Page Transitions**
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 250ms ease-out;
}
```

**Card Hover**
```css
.card {
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

**Button Click**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}
```

**Loading Skeleton**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #E5E7EB 25%,
    #F3F4F6 50%,
    #E5E7EB 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 7.3 Micro-interactions

**Conviction Badge Pulse** (when new recommendation arrives)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.new-recommendation .conviction-badge {
  animation: pulse 1.5s ease-in-out 3;
}
```

**Evidence Trail Node Expansion**
```
Click node → 
  - Node scales to 1.1x (100ms)
  - Connected edges highlight (200ms)
  - Detail panel slides in from right (250ms)
```

**Acceptance Confirmation**
```
Click "Accept" →
  - Button text changes to checkmark (instant)
  - Success message fades in (200ms)
  - Confetti animation (optional, 1s)
  - Auto-redirect after 2s
```

---

## 8. Design Deliverables

### 8.1 Figma Files

**Structure**:
```
MOBU Design System v1.0/
├── 01_Foundation/
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Grid
│
├── 02_Components/
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   ├── Navigation
│   ├── Charts
│   └── Evidence Graph
│
├── 03_Screens/
│   ├── Public/
│   │   ├── Landing
│   │   ├── Login
│   │   └── Signup
│   │
│   ├── Onboarding/
│   │   ├── Welcome
│   │   ├── Risk Quiz
│   │   ├── Goals
│   │   └── Portfolio Setup
│   │
│   ├── Dashboard/
│   │   ├── Overview
│   │   ├── Portfolio Detail
│   │   ├── Holdings
│   │   └── Transactions
│   │
│   ├── Recommendations/
│   │   ├── List
│   │   ├── Detail
│   │   └── Evidence Trail
│   │
│   └── Settings/
│       ├── Profile
│       ├── Security
│       └── Preferences
│
└── 04_Mobile/
    ├── iOS
    └── Android
```

### 8.2 Design Tokens (JSON)

```json
{
  "colors": {
    "primary": {
      "main": "#0066CC",
      "dark": "#003366",
      "light": "#E6F2FF"
    },
    "semantic": {
      "success": "#00B050",
      "warning": "#FFA500",
      "error": "#DC3545",
      "neutral": "#6C757D"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "'Inter', -apple-system, sans-serif",
      "mono": "'Roboto Mono', 'Courier New', monospace"
    },
    "fontSize": {
      "display": "48px",
      "h1": "36px",
      "h2": "28px",
      "h3": "20px",
      "body": "16px",
      "small": "14px",
      "tiny": "12px"
    }
  },
  "spacing": {
    "xxs": "4px",
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "48px",
    "xxl": "64px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  }
}
```

### 8.3 Component Documentation

Each component includes:
- Visual examples
- Usage guidelines
- Code snippets (React)
- Accessibility notes
- Do's and Don'ts

**Example: Button Component**
```
Button Component

Purpose: Primary user actions

Variants:
- Primary (default)
- Secondary (outlined)
- Danger (destructive actions)

Sizes:
- Small: 32px height
- Medium: 44px height (default)
- Large: 56px height

States:
- Default
- Hover
- Active
- Disabled
- Loading

Accessibility:
- Always has visible focus ring
- Disabled state uses aria-disabled
- Loading state shows spinner + aria-busy

Usage:
✓ Do: Use primary for main call-to-action
✓ Do: Use secondary for less important actions
✗ Don't: Use more than one primary button per section
✗ Don't: Make buttons too small (min 44px for touch)
```

---

## Conclusion

This UI/UX design specification provides a complete visual language for the MOBU platform. The design system ensures consistency across web and mobile, while the detailed screen designs demonstrate how transparency and evidence trails become visual experiences.

Key design principles:
- **Transparency as visual language** — not just text
- **Clarity over cleverness** — users understand immediately
- **Accessible by default** — WCAG 2.1 AA compliance
- **Mobile-first thinking** — but desktop-grade power

The design deliverables (Figma files, design tokens, component library) enable efficient handoff to engineering and consistent implementation.

---

**Design System Version**: 1.0  
**Last Updated**: September 2026  
**Maintained By**: MOBU Design Team
