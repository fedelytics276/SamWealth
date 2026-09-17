# MOBU Investment Platform
## Financial Models & Business Case

**Version:** 1.0  
**Date:** September 2026  
**Status:** Complete Financial Projections

---

## Table of Contents

1. [Executive Financial Summary](#1-executive-financial-summary)
2. [Revenue Model](#2-revenue-model)
3. [Unit Economics](#3-unit-economics)
4. [5-Year Financial Projections](#4-5-year-financial-projections)
5. [Cost Structure](#5-cost-structure)
6. [Investment Requirements](#6-investment-requirements)
7. [Break-Even Analysis](#7-break-even-analysis)
8. [Valuation Framework](#8-valuation-framework)
9. [Sensitivity Analysis](#9-sensitivity-analysis)
10. [Financial Assumptions](#10-financial-assumptions)

---

## 1. Executive Financial Summary

### 1.1 Key Metrics at a Glance

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| **Users** | 10,000 | 150,000 | 500,000 |
| **AUA** | $50M | $1.5B | $7.5B |
| **Revenue** | $600K | $15M | $60M |
| **Gross Margin** | 65% | 78% | 82% |
| **EBITDA** | -$3.2M | $3.5M | $22M |
| **EBITDA Margin** | -533% | 23% | 37% |
| **Cash Burn** | -$3.5M/year | Break-even | +$20M/year |

### 1.2 Investment Thesis

**Capital Required**: $12M over 3 years
- Seed: $4M (now)
- Series A: $8M (Month 18)

**Path to Profitability**: 30 months

**5-Year Exit Scenarios**:
- Conservative: $150M (3x ARR)
- Base Case: $300M (5x ARR)
- Optimistic: $600M (10x ARR)

---

## 2. Revenue Model

### 2.1 Revenue Streams

**Primary Revenue** (95% of total):

**1. Subscription Fees**
```
Retail Tier:
- Price: $9.99/month ($99/year if annual)
- Target: Mass-affluent investors
- Features: Basic recommendations, 1 portfolio, mobile app
- Conversion from free: 8-12%

Advisor Tier:
- Price: $99/month ($999/year if annual)
- Target: Independent financial advisors
- Features: Multi-client management, white-label reports
- Up to 20 clients
- Average per advisor: $99/month

Institutional Tier:
- Price: Custom ($500-$5,000/month)
- Target: Asset managers, family offices
- Features: API access, dedicated support, custom compliance
- Contract: Annual
- Average per institution: $2,000/month
```

**Secondary Revenue** (5% of total):

**2. Transaction Fees** (Phase 1C+)
```
- Execution fee: 0.15% per trade
- Minimum: $5 per trade
- Average trade size: $2,000
- Average fee per trade: $5
```

**3. Data/API Services** (Phase 2)
```
- API access: $200-$1,000/month based on usage
- Custom research: $5,000-$50,000 per project
```

**4. White-Label Licensing** (Phase 3)
```
- Platform licensing to banks: $50K-$500K/year
```

### 2.2 Pricing Strategy

**Freemium Model**:
- Free tier: Read-only portfolio tracking, limited recommendations
- Conversion to paid: 10% target
- Upsell path: Free → Retail → Advisor → Institutional

**Geographic Pricing** (Phase 2):
- South Africa: Base pricing
- Nigeria: 20% discount (lower GDP per capita)
- International: +20% premium (more data coverage)

**Annual Discounts**:
- Retail: 17% discount (2 months free)
- Advisor: 16% discount (2 months free)
- Institutional: Negotiated

---

## 3. Unit Economics

### 3.1 Customer Acquisition Cost (CAC)

**Retail Investors**:
```
Marketing spend per acquired user: $40
Channel mix:
- Digital ads (Google, Facebook): $25 (60%)
- Content marketing/SEO: $8 (20%)
- Referral program: $5 (12%)
- Partnerships: $2 (8%)

Organic vs Paid:
- Year 1: 20% organic, 80% paid
- Year 3: 40% organic, 60% paid
- Year 5: 60% organic, 40% paid

Blended CAC:
- Year 1: $50
- Year 3: $35
- Year 5: $25
```

**Advisors**:
```
Marketing spend per advisor: $400
- Sales team outreach: $200
- Industry events: $100
- Referrals: $50
- Content/thought leadership: $50

Blended CAC: $500 (Year 1) → $350 (Year 5)
```

**Institutions**:
```
Sales cost per institution: $5,000
- Direct sales team: $3,000
- Demos and pilots: $1,500
- Legal/contract negotiation: $500

Blended CAC: $5,000 (consistent)
```

### 3.2 Lifetime Value (LTV)

**Retail Investors**:
```
Monthly subscription: $9.99
Annual retention rate: 75% (Year 1) → 85% (Year 3)
Average customer lifetime: 4 years (Year 1) → 6.7 years (Year 3)

LTV Calculation (Year 3):
- Monthly revenue: $9.99
- Annual revenue: $119.88
- Gross margin: 80%
- Gross profit per year: $95.90
- Customer lifetime: 6.7 years
- LTV = $95.90 × 6.7 = $642

LTV:CAC Ratio: $642 / $35 = 18.3x (Excellent)
```

**Advisors**:
```
Monthly subscription: $99
Average clients per advisor: 15
Annual retention: 85% (Year 1) → 92% (Year 3)
Average customer lifetime: 6.7 years (Year 1) → 12.5 years (Year 3)

LTV Calculation (Year 3):
- Monthly revenue: $99
- Annual revenue: $1,188
- Gross margin: 85%
- Gross profit per year: $1,009
- Customer lifetime: 12.5 years
- LTV = $1,009 × 12.5 = $12,613

LTV:CAC Ratio: $12,613 / $350 = 36x (Exceptional)
```

**Institutions**:
```
Average monthly: $2,000
Annual retention: 95%
Average customer lifetime: 20 years

LTV = $2,000 × 12 × 0.90 × 20 = $432,000

LTV:CAC Ratio: $432,000 / $5,000 = 86x (Outstanding)
```

### 3.3 Payback Period

```
Retail: 5 months (Month 1) → 3 months (Year 3)
Advisor: 6 months (Month 1) → 4 months (Year 3)
Institutional: 3 months (consistent)
```

### 3.4 Cohort Analysis

**Retail Cohort (Illustrative)**:
```
Month 0:   100 users join
Month 1:    88 retained (12% churn)
Month 3:    79 retained (21% cumulative churn)
Month 6:    72 retained (28% cumulative churn)
Month 12:   67 retained (33% cumulative churn)
Month 24:   58 retained (42% cumulative churn)
Month 36:   53 retained (47% cumulative churn)

Cumulative Revenue per Cohort (3 years):
- 100 users × $9.99/month × Average 2.5 years × 75% retention
- Total: ~$18,700 per 100-user cohort
- Per user: $187
```

---

## 4. 5-Year Financial Projections

### 4.1 Revenue Projections

| Revenue Source | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|---------------|--------|--------|--------|--------|--------|
| **Subscription Revenue** | | | | | |
| Retail ($9.99/mo) | $400K | $3.2M | $9.6M | $24M | $48M |
| Advisor ($99/mo) | $180K | $1.8M | $5.0M | $10M | $16M |
| Institutional ($2K/mo) | $20K | $200K | $800K | $2M | $4M |
| **Subtotal Subscriptions** | $600K | $5.2M | $15.4M | $36M | $68M |
| | | | | | |
| **Transaction Fees** | - | - | $200K | $1M | $3M |
| **Data/API Services** | - | - | $100K | $500K | $1M |
| **White-Label** | - | - | - | $500K | $2M |
| | | | | | |
| **Total Revenue** | $600K | $5.2M | $15.7M | $38M | $74M |
| **Growth Rate** | - | 767% | 202% | 142% | 95% |

### 4.2 User Growth Projections

| User Metrics | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|-------------|--------|--------|--------|--------|--------|
| **Retail Users** | | | | | |
| - Free | 8,000 | 50,000 | 120,000 | 250,000 | 450,000 |
| - Paid | 1,000 | 10,000 | 30,000 | 75,000 | 150,000 |
| - Conversion % | 11.1% | 16.7% | 20.0% | 23.1% | 25.0% |
| | | | | | |
| **Advisors** | 50 | 500 | 1,500 | 3,000 | 5,000 |
| **Institutions** | 1 | 10 | 40 | 100 | 200 |
| | | | | | |
| **Total Users** | 9,051 | 60,510 | 151,540 | 328,100 | 605,200 |
| **Paying Users** | 1,051 | 10,510 | 31,540 | 78,100 | 155,200 |

### 4.3 Assets Under Advisement (AUA)

| AUA Metrics | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------------|--------|--------|--------|--------|--------|
| Retail (avg $5K/user) | $5M | $50M | $150M | $375M | $750M |
| Advisor (avg $100K/advisor) | $5M | $50M | $150M | $300M | $500M |
| Institutional (avg $20M/inst) | $20M | $200M | $800M | $2B | $4B |
| | | | | | |
| **Total AUA** | $30M | $300M | $1.1B | $2.7B | $5.25B |
| **Growth Rate** | - | 900% | 267% | 145% | 94% |

### 4.4 Cost of Goods Sold (COGS)

| COGS | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------|--------|--------|--------|--------|--------|
| Data Licensing | $150K | $600K | $1.5M | $3M | $5M |
| Infrastructure (AWS) | $40K | $200K | $600K | $1.5M | $3M |
| Payment Processing | $12K | $104K | $315K | $760K | $1.5M |
| Support Costs | $8K | $80K | $240K | $600K | $1.2M |
| | | | | | |
| **Total COGS** | $210K | $984K | $2.7M | $5.9M | $10.7M |
| **Gross Profit** | $390K | $4.2M | $13M | $32.1M | $63.3M |
| **Gross Margin** | 65% | 81% | 83% | 84% | 86% |

### 4.5 Operating Expenses

| OpEx | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------|--------|--------|--------|--------|--------|
| **Personnel** | | | | | |
| Engineering (15→25→35) | $1.8M | $3.0M | $4.2M | $5.6M | $7.0M |
| Product (3→5→8) | $450K | $750K | $1.2M | $1.6M | $2.0M |
| Sales & Marketing (2→8→15) | $300K | $1.2M | $2.3M | $3.8M | $5.0M |
| Operations (3→5→8) | $360K | $600K | $960K | $1.3M | $1.6M |
| Executive (3→5→7) | $750K | $1.3M | $1.8M | $2.3M | $2.8M |
| **Subtotal Personnel** | $3.7M | $6.9M | $10.5M | $14.6M | $18.4M |
| | | | | | |
| **Marketing** | $450K | $1.8M | $3.2M | $6M | $10M |
| **Office & General** | $120K | $240K | $360K | $480K | $600K |
| **Legal & Compliance** | $100K | $200K | $300K | $400K | $500K |
| **R&D (non-personnel)** | $50K | $100K | $150K | $200K | $250K |
| | | | | | |
| **Total OpEx** | $4.4M | $9.2M | $14.5M | $21.7M | $29.8M |

### 4.6 EBITDA & Net Income

| Profitability | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------------|--------|--------|--------|--------|--------|
| **Revenue** | $600K | $5.2M | $15.7M | $38M | $74M |
| **COGS** | $210K | $984K | $2.7M | $5.9M | $10.7M |
| **Gross Profit** | $390K | $4.2M | $13M | $32.1M | $63.3M |
| **OpEx** | $4.4M | $9.2M | $14.5M | $21.7M | $29.8M |
| | | | | | |
| **EBITDA** | -$4.0M | -$5.0M | -$1.5M | $10.4M | $33.5M |
| **EBITDA Margin** | -667% | -96% | -10% | 27% | 45% |
| | | | | | |
| **Depreciation** | $20K | $50K | $100K | $200K | $400K |
| **EBIT** | -$4.0M | -$5.1M | -$1.6M | $10.2M | $33.1M |
| **Interest** | -$10K | -$20K | -$30K | -$40K | -$50K |
| | | | | | |
| **Net Income** | -$4.0M | -$5.1M | -$1.6M | $10.2M | $33.1M |
| **Net Margin** | -667% | -98% | -10% | 27% | 45% |

### 4.7 Cash Flow Projections

| Cash Flow | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|-----------|--------|--------|--------|--------|--------|
| **Operating Activities** | | | | | |
| Net Income | -$4.0M | -$5.1M | -$1.6M | $10.2M | $33.1M |
| Add: Depreciation | $20K | $50K | $100K | $200K | $400K |
| Working Capital Changes | -$50K | -$200K | -$500K | -$1M | -$2M |
| **Cash from Operations** | -$4.0M | -$5.3M | -$2.0M | $9.4M | $31.5M |
| | | | | | |
| **Investing Activities** | | | | | |
| CapEx | -$100K | -$250K | -$500K | -$1M | -$2M |
| **Cash from Investing** | -$100K | -$250K | -$500K | -$1M | -$2M |
| | | | | | |
| **Financing Activities** | | | | | |
| Equity Raised | $4M | - | $8M | - | - |
| **Cash from Financing** | $4M | - | $8M | - | - |
| | | | | | |
| **Net Cash Flow** | -$100K | -$5.6M | $5.5M | $8.4M | $29.5M |
| **Ending Cash Balance** | $3.9M | -$1.7M | $3.8M | $12.2M | $41.7M |

**Note**: Negative cash balance in Year 2 triggers Series A raise of $8M in early Year 3.

---

## 5. Cost Structure

### 5.1 Personnel Costs (Detailed)

**Year 1 Team (20 people)** — $3.7M total
```
Engineering (10):
- Head of Engineering: $200K
- Senior Engineers (4): $150K each = $600K
- Mid Engineers (3): $120K each = $360K
- Junior Engineers (2): $90K each = $180K
- Subtotal: $1.34M

Product & Design (4):
- Head of Product: $180K
- Product Manager: $130K
- UX Designer: $110K
- Product Analyst: $100K
- Subtotal: $520K

Operations (3):
- Head of Operations: $160K
- Compliance Officer: $130K
- Data Ops Specialist: $110K
- Subtotal: $400K

Executive (3):
- CEO: $250K (+ equity)
- CFO: $200K (+ equity)
- CTO: Covered in Engineering
- Subtotal: $450K

Total Year 1: $2.71M salaries + 35% benefits/taxes = $3.66M
```

**Year 3 Team (45 people)** — $10.5M total
**Year 5 Team (70 people)** — $18.4M total

### 5.2 Marketing Spend Breakdown

**Year 1** — $450K
```
Digital Advertising: $200K (Google, Facebook, LinkedIn)
Content Marketing: $100K (Blog, videos, SEO)
Events & Sponsorships: $50K
Partnership Development: $50K
Referral Program: $50K
```

**Year 3** — $3.2M
```
Digital Advertising: $1.5M
Content Marketing: $600K
Sales Team Commissions: $500K
Events & Conferences: $300K
Partnerships: $200K
Brand & PR: $100K
```

**Year 5** — $10M
```
Digital Advertising: $4M
Content & SEO: $2M
Sales Commissions: $2M
Events & Sponsorships: $1M
TV/Radio (African markets): $500K
Partnerships: $300K
Brand & PR: $200K
```

### 5.3 Infrastructure Costs

**Year 1** — $40K
```
AWS Services: $30K
- EC2 instances: $12K
- RDS (PostgreSQL): $8K
- Neo4j hosting: $5K
- S3 storage: $3K
- Data transfer: $2K

Development Tools: $10K
- GitHub: $2K
- Figma: $1K
- Jira: $2K
- Monitoring (Datadog): $3K
- Other SaaS: $2K
```

**Year 3** — $600K
```
AWS: $450K
- Compute: $180K
- Databases: $150K
- Storage: $60K
- CDN: $40K
- Other: $20K

Tools & Services: $150K
```

**Year 5** — $3M
```
AWS: $2.5M (multi-region, high availability)
Tools & Services: $500K
```

---

## 6. Investment Requirements

### 6.1 Seed Round (Now) — $4M

**Use of Funds**:
```
Personnel (60%):            $2.4M
- Hire initial team (15-20 people)
- 12-18 months runway

Infrastructure (15%):        $600K
- AWS setup and hosting
- Development tools
- Office setup

Marketing (15%):             $600K
- Launch campaigns
- Early user acquisition
- Brand development

Data Licensing (5%):         $200K
- JSE, NGX data feeds
- Initial market coverage

Working Capital (5%):        $200K
- Buffer for unexpected costs

Total: $4M
```

**Milestones for Series A**:
- 10,000+ users (1,000+ paying)
- $1M+ ARR
- Product-market fit validated
- 2 African markets fully operational

### 6.2 Series A (Month 18) — $8M

**Use of Funds**:
```
Personnel (50%):            $4M
- Scale team to 40-50 people
- Sales and marketing hires

Market Expansion (20%):     $1.6M
- 5 more African markets
- Data licensing
- Regulatory compliance

Marketing & Growth (20%):   $1.6M
- User acquisition at scale
- Brand building
- Events and partnerships

Infrastructure (10%):        $800K
- Scale AWS infrastructure
- Multi-region deployment
- Enhanced security

Total: $8M
```

**Milestones for Series B (optional)**:
- 100,000+ users (10,000+ paying)
- $10M+ ARR
- Profitability in sight (positive unit economics)
- 7 African markets, starting international

### 6.3 Total Capital Required

```
Seed:      $4M (now)
Series A:  $8M (Month 18)
Total:     $12M over 3 years

Runway:
- Post-Seed: 18 months
- Post-Series A: 24 months (cash flow positive before running out)
```

---

## 7. Break-Even Analysis

### 7.1 Break-Even Timeline

**Monthly Break-Even**: Month 32 (2.7 years)
**Annual Break-Even**: Year 4 (first full year of positive EBITDA)

### 7.2 Break-Even Calculations

**Fixed Costs per Month** (Year 3):
```
Personnel: $875K
Office & G&A: $30K
Tools & Infrastructure: $50K
Total Fixed: $955K/month
```

**Variable Costs per User**:
```
Data costs: $1.50/user/month
Infrastructure: $0.50/user/month
Support: $0.30/user/month
Total Variable: $2.30/user/month
```

**Average Revenue per User (ARPU)** (Year 3):
```
Blended ARPU: $15/month
(Mix of retail $10, advisor $99, institutional $2,000)
```

**Contribution Margin per User**:
```
Revenue: $15
Variable costs: $2.30
Contribution: $12.70

Contribution margin: 84.7%
```

**Break-Even Users**:
```
Fixed costs / Contribution margin
$955K / $12.70 = 75,200 paying users

At 20% conversion: 376,000 total users
```

**Actual Achievement**:
```
Year 3 Target: 31,540 paying users
Deficit: 43,660 users short of break-even
Achieved: Month 32 (Year 3, Month 8)
```

---

## 8. Valuation Framework

### 8.1 Revenue Multiple Method

**SaaS Benchmarks** (2026):
```
Early-stage (pre-revenue): 5-10x ARR
Growth stage (profitable): 10-15x ARR
Mature (market leader): 15-25x ARR
```

**MOBU Valuation Scenarios** (Year 5):
```
Year 5 Revenue: $74M
ARR (assuming stable): ~$80M

Conservative (5x): $400M
Base Case (8x): $640M
Optimistic (12x): $960M
```

### 8.2 DCF Model (Discounted Cash Flow)

**Assumptions**:
- Discount rate (WACC): 15%
- Terminal growth rate: 3%
- Projection period: 10 years

**Simplified DCF**:
```
Year 1-5: As per projections
Year 6-10: 30% revenue growth tapering to 10%
Terminal value: Year 10 FCF × (1 + 3%) / (15% - 3%) = 8.58x

Present Value Calculation:
PV(Years 1-5): $45M
PV(Years 6-10): $180M
PV(Terminal): $520M
Enterprise Value: $745M

Less: Net Debt: -$40M (net cash)
Equity Value: $785M
```

### 8.3 Comparable Companies

**Public Comps** (fintech/investment platforms):
```
Company         Revenue    Market Cap    Multiple
Robinhood       $1.8B      $12B          6.7x
Betterment      $300M      $1.3B         4.3x
Wealthsimple    $200M      $4B           20.0x
Stash           $150M      $1.4B         9.3x

Median Multiple: 8.0x
```

**MOBU Implied Valuation** (Year 5, 8x):
```
$74M revenue × 8.0x = $592M
```

### 8.4 Venture Capital Method

**Exit Value** (Year 5):
```
Conservative exit: $400M
Base case exit: $640M
Optimistic exit: $960M
```

**Pre-Money Valuations**:

**Seed Round (Now)**:
```
Expected exit: $640M
Target ownership for VC: 20% (Seed + Series A)
Seed ownership target: 10%

Pre-money valuation: $36M
Post-money valuation: $40M
(Seed: $4M at $36M pre)
```

**Series A (Month 18)**:
```
Post-Seed valuation: $40M
Milestones hit, strong growth
Step-up: 3-4x

Pre-money valuation: $120M
Post-money valuation: $128M
(Series A: $8M at $120M pre)

VC ownership (Seed + A): ~15%
```

---

## 9. Sensitivity Analysis

### 9.1 Revenue Sensitivity

**Key Driver: User Acquisition**

| Users (Year 3) | Revenue | EBITDA | Valuation (8x) |
|---------------|---------|--------|----------------|
| 50% of target | $7.9M | -$8M | $63M |
| 75% of target | $11.8M | -$4.8M | $94M |
| **Base case** | **$15.7M** | **-$1.5M** | **$126M** |
| 125% of target | $19.6M | $1.8M | $157M |
| 150% of target | $23.5M | $5.1M | $188M |

**Insight**: Even at 75% of target, company reaches profitability by Year 4. Upside is significant with execution.

### 9.2 CAC Sensitivity

**Key Driver: Marketing Efficiency**

| CAC | LTV:CAC | Payback | Year 3 EBITDA |
|-----|---------|---------|---------------|
| $50 (High) | 12.8x | 5 months | -$3.2M |
| $40 (Medium) | 16.0x | 4 months | -$2.4M |
| **$35 (Base)** | **18.3x** | **3.5 months** | **-$1.5M** |
| $30 (Low) | 21.4x | 3 months | -$0.7M |
| $25 (Very Low) | 25.7x | 2.5 months | +$0.2M |

**Insight**: 30% improvement in CAC (from $35 to $25) makes company profitable a year earlier.

### 9.3 Churn Sensitivity

**Key Driver: Customer Retention**

| Annual Churn | LTV | LTV:CAC | Year 5 Revenue |
|--------------|-----|---------|----------------|
| 30% (High) | $400 | 11.4x | $52M |
| 20% (Medium) | $560 | 16.0x | $63M |
| **15% (Base)** | **$642** | **18.3x** | **$74M** |
| 10% (Low) | $800 | 22.9x | $89M |
| 5% (Very Low) | $1,120 | 32.0x | $112M |

**Insight**: Reducing churn from 15% to 10% adds $15M in Year 5 revenue. Retention is critical.

### 9.4 Pricing Sensitivity

**Key Driver: ARPU**

| Retail Price | Year 3 Revenue | EBITDA | Valuation |
|-------------|----------------|--------|-----------|
| $7.99/month | $13.2M | -$4.0M | $106M |
| $8.99/month | $14.4M | -$2.7M | $115M |
| **$9.99/month** | **$15.7M** | **-$1.5M** | **$126M** |
| $10.99/month | $17.0M | -$0.2M | $136M |
| $11.99/month | $18.2M | +$1.0M | $146M |

**Insight**: $2/month price increase (+20%) adds $2.5M revenue and moves profitability forward 6 months. Price elasticity matters.

### 9.5 Scenario Planning

**Bull Case** (Everything goes right):
- User growth: +50% vs base
- CAC: -30% vs base
- Churn: -33% vs base (from 15% to 10%)
- Result: Year 3 revenue $24M, EBITDA +$6M, Valuation $192M

**Base Case** (Plan as stated):
- Year 3 revenue: $15.7M
- EBITDA: -$1.5M
- Valuation: $126M

**Bear Case** (Challenges arise):
- User growth: -50% vs base
- CAC: +50% vs base
- Churn: +50% vs base (from 15% to 23%)
- Result: Year 3 revenue $6.3M, EBITDA -$11M, Valuation $50M
- Still viable with adjusted Series A pricing and timeline

---

## 10. Financial Assumptions

### 10.1 Market Assumptions

**African Market Growth**:
- Equity market capitalization growth: 8% CAGR
- Digital adoption: 15% CAGR
- Smartphone penetration: Growing from 45% to 65%
- Retail investor participation: Growing from 3% to 8%

**Addressable Market**:
- Total African adult population: 800M
- Middle class and above: 200M (25%)
- Interested in investing: 50M (25% of middle class)
- Serviceable market (7 countries): 30M
- Target penetration (Year 5): 2% = 600K users

### 10.2 Conversion Assumptions

**Free-to-Paid Conversion**:
- Month 1: 5%
- Month 3: 8%
- Month 6: 10%
- Month 12: 12%
- Steady state: 15%

**Advisor Conversion** (from free trial):
- Month 1: 60%
- After trial: 75%

**Institutional** (from demo):
- Pilot to paid: 40%

### 10.3 Retention Assumptions

**Monthly Churn Rates**:
```
Retail:
- Month 1: 12%
- Month 2-3: 8%
- Month 4-6: 4%
- Month 7-12: 2%
- After Year 1: 1.5% (18% annual)
- Mature (Year 3+): 1.25% (15% annual)

Advisor:
- First year: 1.5% monthly (18% annual)
- Mature: 0.75% monthly (9% annual)

Institutional:
- First year: 0.5% monthly (6% annual)
- Mature: 0.25% monthly (3% annual)
```

### 10.4 Operational Assumptions

**Data Costs**:
- Per instrument per month: $50
- Year 1: 500 instruments = $25K/month = $300K/year
- Negotiated discounts as volume grows
- Year 5: 5,000 instruments at $30/instrument = $1.8M/year

**Infrastructure**:
- Cost per 1,000 users: $100/month
- Economies of scale kick in at 50K users
- Cost per 1,000 users (at scale): $60/month

**Support**:
- Retail: 1 support agent per 1,000 users
- Advisor: 1 CSM per 100 advisors
- Institutional: 1 AM per 20 institutions
- Average support cost: $50K/person/year

### 10.5 Macroeconomic Assumptions

**Inflation**: 5% annual (African average)
**Salary Growth**: 7% annual
**Currency**: USD for reporting (hedge FX risk)
**Interest Rates**: 8-12% for African government bonds (risk-free proxy)

### 10.6 Risk Factors Quantified

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Regulatory delays | 30% | -6 months revenue | Early engagement, sandbox |
| Data quality issues | 40% | -$500K OpEx | Multi-source validation |
| Key person departure | 20% | -3 months | Documentation, equity retention |
| Competitor entry | 50% | -20% growth | Speed, transparency moat |
| Macro shock (recession) | 15% | -40% growth | Diversification, cost flex |

**Expected Value Loss**:
```
Weighted average impact: -$1.2M Year 3 EBITDA
Built into conservative projections
```

---

## Conclusion

### Key Takeaways

**Strong Unit Economics**:
- LTV:CAC ratio of 18x (retail) and 36x (advisor)
- Payback period of 3-4 months
- 80%+ gross margins at scale

**Clear Path to Profitability**:
- Break-even at Month 32
- EBITDA positive Year 4
- 45% EBITDA margin by Year 5

**Capital Efficient**:
- $12M total raise to profitability
- Compare to typical fintech: $50-100M

**Attractive Valuation**:
- Year 5 implied value: $400M-$960M
- 10x-24x return on Seed investment
- 3x-7.5x return on Series A

**African Opportunity**:
- Underserved market, limited competition
- First-mover advantage in transparency
- Natural path to international expansion

**De-Risked Execution**:
- MVP proven in 6 months
- Phased rollout reduces burn
- Multiple revenue streams
- Strong retention economics

---

**Financial Model Version**: 1.0  
**Last Updated**: September 2026  
**Contact**: cfo@mobu.platform

*These projections are forward-looking statements and subject to risks and uncertainties. Actual results may differ materially.*
