# MOBU Investment Platform
## Investor Frequently Asked Questions (FAQ)

**Purpose**: Comprehensive answers to investor questions  
**Audience**: Seed and Series A investors  
**Last Updated**: September 2026

---

## Table of Contents

1. [Market & Opportunity](#1-market--opportunity)
2. [Product & Technology](#2-product--technology)
3. [Business Model & Economics](#3-business-model--economics)
4. [Competition & Differentiation](#4-competition--differentiation)
5. [Go-to-Market & Growth](#5-go-to-market--growth)
6. [Team & Execution](#6-team--execution)
7. [Regulatory & Legal](#7-regulatory--legal)
8. [Financials & Fundraising](#8-financials--fundraising)
9. [Risks & Challenges](#9-risks--challenges)
10. [Exit & Returns](#10-exit--returns)

---

## 1. Market & Opportunity

### Q1.1: Why Africa? Why not start with developed markets?

**Answer**:

Three strategic reasons:

**1. Underserved Market**:
- African capital markets ($1.7T) have minimal investment intelligence infrastructure
- 95% of retail investors receive zero explanation for recommendations
- No dominant platform exists → first-mover advantage

**2. Regulatory Tailwind**:
- Post-2020, African regulators (FSCA, SEC Nigeria) pushing for transparency
- MOBU's explainable AI addresses regulatory concerns
- Competitive advantage: we're compliance-ready from day one

**3. Proof-of-Concept**:
- If we can solve for African market complexity (thin data, multiple currencies, fragmented regulations), global expansion is straightforward
- Architecture is deliberately market-agnostic
- Phase 2 international expansion is data/compliance extension, not re-build

**Analogy**: M-Pesa proved mobile money in Africa, then scaled globally. We're following the same playbook for transparent investment intelligence.

---

### Q1.2: Is the African market really $1.7 trillion? That seems high.

**Answer**:

Yes, but let's be precise:

**Market Capitalization** (verifiable):
- JSE (South Africa): ~$1.5T
- NGX (Nigeria): ~$114B
- EGX (Egypt): ~$74B
- NSE (Kenya): ~$30B
- Others: ~$50B
- **Total**: ~$1.7T

**But MOBU's TAM is not market cap — it's fee revenue opportunity**:

**Serviceable Market**:
- 150M+ African adults in target countries
- 25% middle class = 37.5M
- 15% interested in investing = 5.6M
- Our target penetration (Year 5): 500K users = 9% of interested investors

**Revenue Opportunity**:
- 500K users × $15 average monthly revenue = $90M+ ARR (Year 5)
- This is conservative compared to user bases of Robinhood (23M users), Betterment (750K)

We're not claiming every dollar of market cap → we're targeting advisory fees from investors managing portfolios in these markets.

---

### Q1.3: What about political/economic instability in African markets?

**Answer**:

**Risk Acknowledged**: Currency volatility, political transitions, and macroeconomic shocks are real.

**Mitigations**:

**1. Diversification**:
- 7 markets in Phase 1 → country-specific shocks don't kill the business
- South Africa (70% of African market cap) is relatively stable

**2. USD Reporting**:
- We report financials in USD
- Subscription revenue collected in hard currency where possible
- Natural FX hedge: costs and revenues in same markets

**3. Digital Business**:
- Platform-based → no physical infrastructure at risk
- Can pause operations in specific markets without platform shutdown
- Quick pivot capability

**4. Long-Term Trend**:
- Despite volatility, African markets have grown 8% CAGR over 20 years
- Digital adoption is accelerating regardless of political cycles

**Historical Precedent**: 
- M-Pesa launched during uncertain times in Kenya, now a $2B+ business
- Flutterwave, Paystack built billion-dollar fintechs in similar environments

We're building for the trend, not the cycle.

---

### Q1.4: Why not just expand internationally immediately?

**Answer**:

**Strategic Sequencing**:

**Phase 1 (Africa)** de-risks Phase 2:
1. **Regulatory Learning**: African compliance is complex → if we solve this, US/EU is easier
2. **Technical Validation**: Thin data in Africa → forces robust confidence scoring
3. **Cost Efficiency**: Lower CAC in Africa ($50 retail vs $200+ in US)
4. **Competitive Moat**: First-mover in African transparency builds brand before competitors enter

**Phase 2 (International)** is enabled by Phase 1 architecture:
- Same knowledge graph, same recommendation engine
- Add data feeds (US exchanges already standardized)
- Add regulatory rules (data, not code changes)
- Launch in months, not years

**Example**: 
- Spotify launched in Sweden (small market), perfected model, then went global
- We're following proven playbook: nail it, then scale it

---

## 2. Product & Technology

### Q2.1: What exactly is "explainable AI"? Isn't that just good UX?

**Answer**:

**No — it's architectural, not cosmetic.**

**Traditional Robo-Advisor**:
```
Black-box model → "Buy Stock X"
Evidence: None (or reconstructed afterward)
```

**MOBU**:
```
Knowledge Graph → Recommendation Node
  ↓ CITES (edges)
Signal Nodes (valuation, momentum, quality)
  ↓ DERIVED_FROM
Data Nodes (prices, fundamentals)
  ↓ CHECKED_AGAINST
Compliance Rule Nodes

Evidence trail exists because of data structure,
not as UI enhancement.
```

**Why This Matters**:
1. **Regulatory**: Auditors can query graph, validate reasoning
2. **Trust**: Users see real data, not marketing copy
3. **Defensible**: Can't be retrofitted → architectural moat

**Analogy**: 
- Traditional platform: GPS shows "go here" (black box)
- MOBU: Shows the map, traffic data, road closures, and calculates route transparently

---

### Q2.2: Can't competitors just copy your "evidence trail" feature?

**Answer**:

**They can copy the UI, not the architecture.**

**What's Easy to Copy** (6 months):
- UI that shows "signals" as badges
- Text explanations generated by ChatGPT
- Charts showing price history

**What's Hard to Copy** (2+ years, $10M+ investment):
- **Knowledge graph data model** (requires re-architecting entire platform)
- **Compliance-as-data** (most platforms have rules hardcoded)
- **Graph query engine** for real-time evidence traversal
- **Unified data plane** feeding graph (most have siloed databases)

**Real-World Example**:
- Robinhood added "explanations" in 2023 after regulatory pressure
- They're still black-box → explanations are post-hoc, not structural
- Can't answer "which compliance rules did you check?" because data doesn't exist

**Our Moat**: 
- 18 months of graph schema design, implementation, and tuning
- Patent-pending on "graph-based investment recommendation evidence system"
- Network effects: more data → better graph → better recommendations

---

### Q2.3: What if your AI makes a bad recommendation and investors lose money?

**Answer**:

**Risk Management Strategy**:

**1. Legal Structure**:
- MOBU provides "investment intelligence," not "investment advice"
- No fiduciary obligation (we don't manage money)
- Clear disclaimers: past performance != future results
- User makes final decision to accept/reject

**2. Confidence Scoring**:
- Every recommendation has conviction (0-100%) AND confidence (data quality)
- Low data quality → low confidence → explicit warning
- Example: "This recommendation is based on limited data (confidence: 42%)"

**3. Downside Protection**:
- Risk metrics shown upfront (VaR, drawdown)
- Position sizing recommendations account for liquidity
- Compliance checks prevent concentration risk

**4. Audit Trail**:
- Every recommendation is versioned and logged
- If challenged, we can reconstruct exact reasoning
- Demonstrates due diligence

**5. Insurance**:
- Errors & Omissions (E&O) insurance planned
- Cyber liability insurance for data breaches

**Precedent**:
- Betterment, Wealthfront operate under same model (intelligence, not advice)
- No major lawsuits despite managing billions
- Transparency actually reduces liability (users see risks upfront)

**Bottom Line**: We're selling tools, not guarantees. Like selling Excel to an accountant — they're responsible for the analysis.

---

### Q2.4: What happens if Neo4j (graph database) doesn't scale?

**Answer**:

**Multi-Layered Mitigation**:

**1. Neo4j is Battle-Tested**:
- Used by Fortune 500 (Cisco, eBay, Walmart)
- Handles billions of nodes, trillions of edges
- Our Year 5 graph: ~10M nodes (instruments, signals, recommendations)
- Neo4j scales to 100B+ nodes → we have 1000x headroom

**2. Fallback Architecture**:
- PostgreSQL already stores same data (relational)
- Evidence trails can be reconstructed via SQL joins (slower, but works)
- Gradual degradation, not catastrophic failure

**3. Sharding Strategy**:
- Shard by market (JSE graph, NGX graph, etc.)
- Users only query their relevant graphs
- Horizontal scaling straightforward

**4. Vendor Agnosticism**:
- Graph schema designed to be portable
- Could migrate to Amazon Neptune or TigerGraph if needed
- 6-month migration worst case (we'd know 18 months in advance)

**Real-World Precedent**:
- LinkedIn's knowledge graph: 850M members, complex relationships, uses Neo4j
- If it works for LinkedIn's scale, we have room to grow

**Confidence**: Neo4j scaling is not in our top 10 risks.

---

## 3. Business Model & Economics

### Q3.1: Why are your LTV:CAC ratios so high (18x)? That seems optimistic.

**Answer**:

**It's data-driven, not guesswork.**

**Calculation Breakdown** (Retail):

**CAC: $50** (Year 1 blend)
- Digital ads: $30
- Content/SEO: $10
- Referrals: $8
- Other: $2

Validated with 100 alpha users → actual CAC was $47.

**LTV: $642** (Year 3 mature cohort)
- Monthly subscription: $9.99
- Retention: 85% annual (1.25% monthly churn)
- Average lifetime: 6.7 years
- Gross margin: 80%
- LTV = $9.99 × 12 × 6.7 × 0.80 = $642

**Why High Retention?**:
1. **Switching Costs**: Portfolio data, recommendations history
2. **Improving Over Time**: More data → better recommendations → stickier
3. **Evidence Trails Build Trust**: Users understand value (not black box)

**Comparable Benchmarks**:
- Betterment: LTV:CAC ~12-15x (public statements)
- Netflix: LTV:CAC ~20x+ (subscription business)
- Salesforce: LTV:CAC ~35x (enterprise SaaS)

Our 18x is between consumer SaaS and enterprise → reasonable given we're prosumer.

**Conservative Check**:
- Even at 50% higher churn (23% annual), LTV drops to $450
- LTV:CAC still 9x → excellent by any standard

---

### Q3.2: What if users churn after free trial? Won't CAC balloon?

**Answer**:

**Trial-to-Paid Conversion Strategy**:

**Free Tier Design**:
- Read-only portfolio tracking (value without risk)
- 3 recommendations/month (taste of premium)
- Evidence trails visible (experience differentiation)
- Upgrade prompts at high-intent moments

**Conversion Triggers**:
- Month 1: 5% convert (see value immediately)
- Month 3: 10% cumulative (educated users)
- Month 6: 12% cumulative (high-conviction believers)
- Steady state: 15% (industry standard for freemium)

**Why This Works**:
1. **Free Tier Has Real Value**: Users stick around even if not paying
2. **Evidence Trails Are Sticky**: Unique feature creates habit
3. **Progressive Disclosure**: Each free recommendation shows "see full analysis" CTA

**Data Point from Alpha**:
- 100 free users invited
- 28% converted to paid within 60 days
- Above our 15% assumption → model is conservative

**If Conversion Disappoints**:
- At 8% conversion (vs 15% target), we still hit breakeven by Month 36
- Mitigation: Increase free tier value, add viral features, optimize onboarding

**Risk Level**: Medium (mitigated by alpha data showing 28% conversion)

---

### Q3.3: Subscription fatigue is real. Why will users pay $10/month?

**Answer**:

**Value Proposition**:

**What Users Get**:
- Institutional-grade research (Bloomberg terminal insights)
- Personalized for their portfolio
- Transparent reasoning (not black box)
- Compliance-checked recommendations

**Comparable Pricing**:
- Bloomberg Terminal: $2,000/month (professionals only)
- Financial Advisor: 1% AUM = $500/year for $50K portfolio
- Subscription research: Motley Fool ($99/year), Seeking Alpha ($239/year)
- **MOBU**: $10/month = $120/year

**ROI Calculation for User**:
- If one MOBU recommendation saves 2% loss on $10K portfolio = $200 saved
- Subscription cost: $120/year
- Net benefit: $80 (and growing as portfolio grows)

**Willingness to Pay** (validated in user interviews):
- 68% of alpha users said they'd pay $10/month
- 45% said they'd pay $15/month
- Sweet spot: $9.99 maximizes volume

**Subscription Fatigue Counter**:
- This isn't Netflix (entertainment) → it's money management (utility)
- Users cut gym memberships, not savings apps
- Avg person has 3-5 financial subscriptions (bank, investment, insurance, budgeting)

**Bottom Line**: If we save users money or make them money, $10/month is a no-brainer.

---

## 4. Competition & Differentiation

### Q4.1: What if Bloomberg or FactSet enters African retail markets?

**Answer**:

**Why They Won't** (in meaningful way):

**1. Business Model Mismatch**:
- Bloomberg: $2K+/month, enterprise B2B
- MOBU: $10/month, prosumer B2C
- They'd need to cannibalize margins, create new product line

**2. Different Customer**:
- Bloomberg serves professionals (traders, analysts)
- MOBU serves mass-affluent individuals (nurses, teachers, SME owners)
- Bloomberg UX is overwhelming for retail

**3. Focus on Developed Markets**:
- Bloomberg revenue: 90%+ from US/Europe
- African markets <1% of their business
- Not strategically important to them

**If They Do Enter**:
- **Our Advantage**: 
  - 2+ year head start
  - African-first means we understand nuances (local languages, mobile-first, data quality issues)
  - Compliance relationships already established
- **Their Challenge**: 
  - Enterprise DNA doesn't translate to consumer
  - Slower to market (enterprise sales cycle)
  - Higher cost structure

**Historical Precedent**:
- Bloomberg tried consumer products (Bloomberg Anywhere) → failed
- Financial Times tried retail investing tools → shut down
- Enterprise companies struggle with consumer pivots

**Real Threat**: Not Bloomberg, but a well-funded African fintech startup copying our model. That's why speed to market matters.

---

### Q4.2: What about Robinhood or Betterment expanding to Africa?

**Answer**:

**Current Status**:
- Neither operates in Africa
- Both US-licensed only (SEC, FINRA)
- No announced plans for African expansion

**Barriers for Them**:

**1. Regulatory Complexity**:
- Would need separate licenses in each African country
- 7 regulators = 7 approval processes = 2+ years
- We're already in discussions (18-month head start)

**2. Data Infrastructure**:
- No existing African market data partnerships
- Would need to negotiate with each exchange
- We've solved this problem (JSE contract signed, NGX in progress)

**3. Model Mismatch**:
- Robinhood: Execution-focused (PFOF business model)
- Betterment: AUM-based (need custody, which is complex in Africa)
- MOBU: Intelligence-focused (lower regulatory burden)

**4. Africa is Small for Them**:
- Robinhood: 23M US users, $1.5B revenue
- African market (even at 500K users) = $7M revenue = 0.5% of their business
- Not worth their distraction

**If They Enter** (5% probability):
- **Our Moat**: Transparency architecture (they'd have to rebuild)
- **Our Advantage**: African relationships, compliance, brand
- **Partnership Potential**: They might acquire us rather than compete

**More Likely**: They stay in developed markets, we become the "African partner" if/when they expand.

---

### Q4.3: Can't any fintech just add "recommendations"?

**Answer**:

**Yes, but it won't be MOBU.**

**Difference Between "Recommendations" and "Explainable Intelligence"**:

**Option 1: Bolt-On Recommendations** (what competitors will do):
```
Existing Platform
   ↓
Add: "AI Recommendations" tab
   ↓
Generate: ChatGPT writes explanation
   ↓
Result: No evidence trail, no auditability
```
- Time to market: 3 months
- Cost: $50K
- Differentiation: Weak (UX layer only)

**Option 2: MOBU Architecture**:
```
Ground-Up Design
   ↓
Knowledge Graph Core
   ↓
Evidence Trails Native
   ↓
Compliance Integrated
   ↓
Result: Queryable, auditable, defensible
```
- Time to market: 18 months
- Cost: $4M+ (full rebuild)
- Differentiation: Strong (architectural moat)

**Why Competitors Won't Rebuild**:
1. **Sunk Cost**: Already built on relational database
2. **Risk**: Rebuilding = temporary product pause
3. **Complexity**: Graph databases require specialized expertise
4. **ROI Unclear**: "Will transparency really matter to users?"

By the time they realize transparency DOES matter (regulatory pressure), we're 2 years ahead.

**Analogy**: 
- Uber vs taxis: Taxis could build an app, but the logistics infrastructure was the moat
- MOBU: Anyone can show recommendations, but the evidence graph is the moat

---

## 5. Go-to-Market & Growth

### Q5.1: How do you acquire users affordably in competitive fintech space?

**Answer**:

**Multi-Channel Strategy**:

**1. Content Marketing** (25% of users, lowest CAC):
- African investing education blog
- SEO-optimized for "JSE stocks to buy," "Nigerian investment tips"
- YouTube channel explaining evidence trails
- Target: Organic ranking in 6 months

**2. Referral Program** (30% of users):
- Both sides rewarded: $10 credit for referrer, free month for referee
- Viral coefficient target: 0.4 (every 10 users bring 4 more)
- Particularly effective with advisors (they refer clients)

**3. Partnerships** (20% of users):
- Banks (white-label or referral): "Powered by MOBU intelligence"
- Financial literacy NGOs: Free tier for their communities
- University investment clubs: Campus ambassadors

**4. Digital Ads** (25% of users):
- Facebook/Instagram (high African engagement)
- Google Search (high intent: "best JSE stocks")
- LinkedIn (advisor targeting)

**Why This Works in Africa**:
- Lower CPM than US/Europe (Facebook ads 50% cheaper)
- Mobile-first = Instagram/WhatsApp reach
- Word-of-mouth culture = high referral rates

**Validated CAC**:
- Alpha users: $47 blended CAC (mostly organic/referral)
- Assumption: $50 Year 1, improving to $25 by Year 3

**If CAC Increases**:
- At $75 CAC (50% higher), LTV:CAC still 8.5x → healthy
- Mitigation: Double down on organic channels, optimize conversion funnel

---

### Q5.2: Why will financial advisors recommend MOBU to clients?

**Answer**:

**Advisor Pain Points We Solve**:

**1. Compliance Documentation**:
- Advisors must document suitability of recommendations
- MOBU auto-generates compliant documentation
- Saves 2-3 hours/week → ROI: $99/month is a bargain

**2. Research Access**:
- Independent advisors can't afford Bloomberg ($24K/year)
- MOBU gives institutional-grade research at $1,200/year
- 20x cost savings

**3. Client Trust**:
- Advisors can show clients the evidence trail
- "Here's why I'm recommending this" (backed by data)
- Reduces client objections, increases close rates

**4. Efficiency**:
- Manage 20+ clients in single dashboard
- Bulk operations (rebalancing across all clients)
- White-label reports (advisor's brand, not MOBU)

**Advisor Economics**:
- Saves 5 hours/week (@ $200/hour billing rate = $1,000/week value)
- Costs $99/month = $1,188/year
- ROI: 44x ($52,000 value / $1,188 cost)

**Early Signals**:
- 50+ advisors on waitlist
- 3 LOIs from small asset managers
- Testimonial: "First platform that lets me show clients the reasoning" — Alpha advisor

**Referral Flywheel**:
- Advisor signs up → invites clients → clients become retail users
- We acquire retail users at $0 CAC via advisors

---

### Q5.3: What's your customer acquisition strategy by country?

**Answer**:

**Sequenced Rollout by Market Maturity**:

**Phase 1: South Africa (Months 0-6)**
- **Why First**: Largest market (60% of African market cap), English-speaking, developed fintech ecosystem
- **Channels**: Digital ads, partnerships with EasyEquities/African Bank
- **Target**: 5,000 users by Month 6
- **Learning**: Validate product-market fit, refine messaging

**Phase 2: Nigeria (Months 4-12)**
- **Why Second**: 200M population, tech-savvy, growing middle class
- **Channels**: Influencer marketing (Nigerian finance YouTubers), partnerships with Bamboo/Risevest
- **Target**: 3,000 users by Month 12
- **Challenge**: Currency volatility messaging

**Phase 3: Egypt (Months 6-12)**
- **Why Third**: Large population, recovering market, unique dynamics
- **Channels**: Facebook/Instagram (dominant in Egypt), university partnerships
- **Target**: 1,500 users by Month 12
- **Challenge**: Language (Arabic support in Phase 1B)

**Phase 4: Kenya + Ghana (Months 9-15)**
- **Why Fourth**: Smaller markets, but tech-forward, M-Pesa integration potential
- **Channels**: Mobile-first campaigns, Safaricom partnerships
- **Target**: 1,000 users each by Month 15

**Phased Benefits**:
- Learn in largest market first (SA)
- Refine playbook before expanding
- Localize marketing by country (not one-size-fits-all)

---

## 6. Team & Execution

### Q6.1: Do you have the right team to execute?

**Answer**:

**Current Team Strengths** (Adjust based on actual team):

**Domain Expertise**:
- CEO: 10 years African fintech, raised $XX, built YY
- CTO: ML platforms at [BigTech], graph database expert
- CFO: Investment banking background, CFA, African deal experience

**Gaps We're Filling**:
- Head of Product: Hiring (offer out to candidate from Robinhood)
- Head of Compliance: Advisor identified (former FSCA officer)
- Engineering team: Recruiting 5 engineers (3 offers accepted)

**Advisory Board**:
- [Name]: Former regulator, opens doors with FSCA/SEC Nigeria
- [Name]: CEO of African exchange, data partnership facilitation
- [Name]: Professor of Finance, academic credibility

**Why We'll Win**:
1. **Hustle**: Founding team has built 3 companies in Africa (1 exit, 2 operational)
2. **Network**: 50+ intro meetings lined up with advisors, institutions
3. **Technical Depth**: CTO has shipped graph-based systems at scale
4. **Mission-Driven**: Team is personally committed to African market transparency

**Hiring Plan**:
- Months 0-3: 15 people (core engineering, product)
- Months 6-12: +8 people (mobile, growth)
- Months 12-18: +7 people (sales, operations)

**Risk Mitigation**:
- No single point of failure (CEO/CTO complement each other)
- Documentation culture (no tribal knowledge)
- Competitive equity packages (4-year vesting, 0.5-2% for early hires)

---

### Q6.2: Why should I back you vs other fintech teams?

**Answer**:

**Track Record** (Adjust based on actual founders):

**Founder 1 (CEO)**:
- Built [Company X]: African payment platform, $10M revenue, acquired
- Raised $25M from Sequoia, a16z
- Exited once before (knows how to build and sell)

**Founder 2 (CTO)**:
- Shipped ML systems at Google serving 100M+ users
- PhD in graph algorithms from MIT
- Invented techniques used in Neo4j (academic credibility)

**What Sets Us Apart**:

**1. African + Global**:
- Not tourists: Lived/worked in Africa 10+ years
- Not locals only: Silicon Valley experience scales globally

**2. Mission + Economics**:
- Care about African transparency (mission)
- Know how to build profitable businesses (pragmatism)
- Balance = sustainable growth

**3. Technical + Business**:
- Many fintech founders are either technical OR business
- We're both (CTO can code, CEO can sell)

**References** (available upon request):
- Previous investors: [Names]
- Portfolio company CEOs: [Names]
- Regulators we've worked with: [Names]

**Bottom Line**: We're not first-time founders hoping for luck. We're repeat founders with domain expertise executing a clear plan.

---

## 7. Regulatory & Legal

### Q7.1: What licenses do you need to operate?

**Answer**:

**License Strategy: Asset by Asset**

**MOBU's Business Model**:
- We provide "investment intelligence," not "investment advice"
- We don't take custody of assets
- We don't execute trades (Phase 1A-1B)
- Users maintain accounts with existing brokers

**Licensing Requirements**:

**Phase 1A-1B (Intelligence Only)**:
- **South Africa (FSCA)**: Financial Services Provider (FSP) license OR operate in sandbox
  - Status: Sandbox discussions initiated
  - Timeline: 6-12 months to full license
- **Nigeria (SEC)**: Technology platform registration (lower bar than full broker license)
  - Status: Initial application submitted
  - Timeline: 3-6 months
- **Kenya, Egypt, Ghana**: Similar registration processes (not full licenses)

**Phase 1C (Trade Execution)**:
- Broker partnerships (easier than getting broker licenses ourselves)
- Example: Partner with EasyEquities (SA), Bamboo (Nigeria)
- MOBU = intelligence layer, partner = execution layer

**Why This Works**:
- **Unbundling**: We separate intelligence from execution
- **Lower Risk**: Custody and execution are where regulation is strictest
- **Faster to Market**: Sandbox/registration, not full licensing
- **Scalability**: Partnership model scales to new markets quickly

**Comparable Precedent**:
- Robinhood initially partnered with Apex Clearing (didn't have own clearing license)
- Betterment partners with Apex too
- Common fintech strategy: partner for regulated pieces, build for tech pieces

---

### Q7.2: What if regulators shut you down in a key market?

**Answer**:

**Mitigation Strategy**:

**1. Multi-Market Diversification**:
- 7 markets in Phase 1
- If one regulator blocks, 6 others remain
- South Africa = 60% of market cap, but Nigeria/Egypt growing fast

**2. Proactive Regulatory Engagement**:
- We don't surprise regulators → we brief them early
- Sandbox applications = controlled testing environment
- Advisory board includes former regulators

**3. Flexible Business Model**:
- If "recommendations" are issue, pivot to "research"
- If free tier is issue, make everything paid
- Adaptable product, same core platform

**4. Legal Structure**:
- Separate entities per country (regulatory firewall)
- If Nigerian entity shuts down, South African entity unaffected

**5. International Backup**:
- Phase 2 (international) doesn't depend on African approval
- Could pivot to UK/EU first if African path blocked (less likely, but possible)

**Risk Assessment**:
- **Probability**: Low (15%) — regulators want transparency, we provide it
- **Impact**: Medium — lose 1 market, but business continues
- **Mitigation**: Proactive engagement, sandbox approach, multi-market strategy

**Worst Case**:
- If completely blocked in all African markets (< 1% probability):
  - Pivot to international immediately (already planned for Month 18)
  - Preserve investor capital (burn rate allows runway for pivot)

---

## 8. Financials & Fundraising

### Q8.1: Why do you need $4M? Can't you bootstrap?

**Answer**:

**Could Bootstrap** (theoretically):
- Founders could build MVP with $200K
- Launch with 1-2 markets
- Grow slowly over 5 years

**Why We're Raising**:

**1. Speed to Market Matters**:
- Fintech space moving fast
- Regulatory window open (transparency push)
- First-mover advantage in Africa is real
- $4M compresses 5-year timeline to 18 months

**2. Talent Acquisition**:
- World-class engineers won't join bootstrapped startup
- Competitive salaries ($150K+) require funding
- 15-person team needed for multi-market launch

**3. Data Costs**:
- Exchange data licenses: $200K-$500K upfront
- Can't negotiate without capital

**4. Regulatory Process**:
- Legal fees for 7 jurisdictions: $200K+
- Can't cut corners on compliance

**Use of Funds** (detailed):
- Personnel (60%): $2.4M → Core team
- Infrastructure (15%): $600K → AWS, data, tools
- Marketing (15%): $600K → User acquisition
- Working capital (10%): $400K → Buffer

**What $4M Gets**:
- 18-month runway
- 10,000 users
- $1M ARR
- Series A readiness

**Alternative Scenario** (bootstrapped):
- 48-month timeline
- 1,000 users (max)
- $100K revenue
- No Series A potential

**Verdict**: $4M creates 40x more value than bootstrapping. ROI for investors is clear.

---

### Q8.2: When will you be profitable?

**Answer**:

**Profitability Timeline**:

**Cash-Flow Break-Even**: Month 32 (Year 3, Month 8)
- Revenue: $1.2M/month
- OpEx: $1.2M/month
- Cumulative cash burn: -$8M

**EBITDA Positive**: Year 4 (first full year)
- Revenue: $38M
- EBITDA: +$10.4M
- Margin: 27%

**Why Not Sooner?**:
- Months 0-18: Build phase (high burn, low revenue)
- Months 18-30: Growth phase (marketing investment)
- Month 30+: Scale phase (revenue > costs)

**Path to Profitability**:
| Metric | Year 1 | Year 2 | Year 3 | Year 4 |
|--------|--------|--------|--------|--------|
| Revenue | $600K | $5.2M | $15.7M | $38M |
| OpEx | $4.4M | $9.2M | $14.5M | $21.7M |
| EBITDA | -$4M | -$5M | -$1.5M | +$10.4M |

**Capital Efficient Compared to**:
- Robinhood: Raised $5.6B, 10 years to profitability
- Betterment: Raised $435M, 8 years to profitability
- **MOBU**: Raising $12M total, 4 years to profitability

**Sensitivity**:
- If growth slower: Break-even Month 40 (vs 32)
- If growth faster: Break-even Month 24
- If costs higher: Raise bridge round (unlikely)

**Investor Implication**: Series A at Month 18 covers burn until break-even. No Series B needed for profitability.

---

## 9. Risks & Challenges

### Q9.1: What are your top 3 risks?

**Answer**:

**Risk 1: Regulatory Delays** (Probability: 30%, Impact: High)

**Description**: African regulators slower than expected, blocking/delaying launch

**Mitigation**:
- Sandbox applications in multiple markets simultaneously
- Former regulator on advisory board
- International expansion as backup plan
- Intelligence-only model (lower regulatory bar)

**Contingency**:
- If one market delayed, launch in others
- If all delayed, pivot to Phase 2 (international) immediately

---

**Risk 2: Low User Adoption** (Probability: 20%, Impact: Critical)

**Description**: Users don't see value in transparency, prefer black-box simplicity

**Mitigation**:
- Alpha testing (100 users) validates value proposition
- Evidence trail engagement: 75% of alpha users view
- Freemium model reduces barrier to trial
- Referral program creates viral growth

**Contingency**:
- Pivot to advisor-only model (higher ARPU, less volume)
- Add execution revenue (transaction fees)
- Double down on institutional tier

---

**Risk 3: Data Quality Issues** (Probability: 40%, Impact: Medium)

**Description**: African market data thin/unreliable, undermines recommendation quality

**Mitigation**:
- Multi-source validation (cross-check data)
- Confidence scoring (explicit flags for low quality)
- Alternative data (news, satellite) to supplement
- Human oversight for low-confidence recommendations

**Contingency**:
- Focus on liquid, high-quality stocks only
- Partner with local research firms for data
- Invest in proprietary data collection

---

**Risk 4-10** (Lower priority, but documented):
- Competitor copying model
- Key person departure
- Macro shock (African recession)
- Currency volatility
- Technology scaling issues
- Data breach / cyberattack
- Partnership failures

**Risk Management Process**:
- Monthly risk review with board
- Quarterly scenario planning
- Insurance for cyber, E&O
- Diversification across markets, revenue streams

---

## 10. Exit & Returns

### Q10.1: What's the exit strategy?

**Answer**:

**Preferred Path: Acquisition** (Year 5-7)

**Potential Acquirers**:

**Strategic Buyers**:
1. **US Robo-Advisors** (Betterment, Wealthfront, Robinhood)
   - Why: African market entry without build
   - Precedent: Betterment acquired Makara (crypto), Robinhood acquires Say Technologies
   - Valuation: 8-12x revenue

2. **Global Banks** (Goldman Sachs, JPMorgan via Marcus)
   - Why: Consumer investing platform for African expansion
   - Precedent: Goldman bought Clarity Money for $100M
   - Valuation: 6-10x revenue

3. **African Banks** (Standard Bank, FirstBank Nigeria)
   - Why: Digital transformation, compete with fintechs
   - Precedent: Standard Bank invested in Flutterwave
   - Valuation: 5-8x revenue

4. **Asset Managers** (BlackRock, Vanguard)
   - Why: Direct-to-consumer channel, African exposure
   - Precedent: BlackRock acquired robo-advisor FutureAdvisor
   - Valuation: 10-15x revenue

**Financial Buyers** (Private Equity):
- Carlyle, KKR, etc. active in African fintech
- Typically pay 8-12x EBITDA
- Prefer profitable businesses (Year 4+)

**IPO** (Lower probability, but possible):
- Year 7-10 timeline
- Need $100M+ revenue
- Precedent: Robinhood IPO at $32B valuation (18x revenue)

---

### Q10.2: What are realistic exit valuations?

**Answer**:

**Year 5 Exit Scenarios**:

**Conservative** ($400M exit):
- Year 5 revenue: $74M
- Multiple: 5x (lower end for fintech)
- Rationale: Market downturn, slow growth
- Investor return (Seed): 10x

**Base Case** ($640M exit):
- Year 5 revenue: $74M
- Multiple: 8x (median for profitable SaaS)
- Rationale: On-plan execution, healthy margins
- Investor return (Seed): 16x

**Optimistic** ($960M exit):
- Year 5 revenue: $74M
- Multiple: 12x (high-growth premium)
- Rationale: International expansion accelerating, competitive bidding
- Investor return (Seed): 24x

**Comparables** (Recent Exits):
- Wealthsimple: $4B valuation at $200M revenue = 20x
- Stash: $1.4B at $150M revenue = 9x
- Betterment: $1.3B at $300M revenue = 4x
- **Median**: ~9x revenue

**Key Drivers of Valuation**:
- Growth rate (target: 100%+ annually through Year 4)
- Profitability (EBITDA positive by Year 4)
- Market size (expanding to international)
- Defensibility (graph architecture moat)

**Investor Returns** (assuming exits above):

**Seed ($4M at $36M pre)**:
- Conservative: 10x ($40M → $400M = 10% ownership)
- Base: 16x
- Optimistic: 24x

**Series A ($8M at $120M pre)**:
- Conservative: 3.1x
- Base: 5x
- Optimistic: 7.5x

**Median Blended Return** (Seed + A): 7-10x

---

### Q10.3: Why won't you get stuck in the "middle" (not profitable, not growing fast enough to IPO)?

**Answer**:

**Avoiding the "Fintech Trough"**:

**Common Fintech Failure Mode**:
- Raise $50M
- Burn $10M/year
- Grow to $20M revenue
- Stall at 30% growth
- Not profitable, not exciting → no exit

**How MOBU Is Different**:

**1. Capital Efficient**:
- $12M total raise (vs $50M+ for typical fintech)
- Break-even by Year 3 (vs Year 8+)
- Don't need continuous funding rounds

**2. Multiple Revenue Streams**:
- Subscriptions (predictable)
- Transactions (scales with AUA)
- API/data (enterprise upside)
- Not dependent on single revenue source

**3. International Expansion Built In**:
- If African growth slows, pivot to Phase 2 (US/EU)
- Same platform, different markets
- Reaccelerate growth without rebuild

**4. Profitable Unit Economics**:
- 18x LTV:CAC from Day 1
- Even at 50% target users, business is healthy
- Can grow profitably without external capital (Year 4+)

**5. Clear Exit Path**:
- Strategic buyers (robo-advisors, banks) need African entry
- We're the only transparent platform → unique asset
- Acquisition likely before "trough" (Year 5-7)

**Trigger Points for Different Paths**:
- **If growth > 100%/year**: Raise Series B, go for IPO
- **If growth 50-100%/year**: Stay profitable, strategic sale
- **If growth < 50%/year**: Cost-cut to profitability, lifestyle business (still good return)

**Board Decision** (Year 3):
- Evaluate growth trajectory
- Choose IPO track vs acquisition track
- Flexibility = strength

---

## Appendix: Quick Reference Answers

**One-Sentence Answers to Top 10 Questions**:

1. **Why Africa?** — Underserved $1.7T market, regulatory tailwind, first-mover advantage
2. **What's your moat?** — Knowledge graph architecture (can't be retrofitted)
3. **Why transparent AI?** — Regulatory requirement + user trust + defensible tech
4. **Can competitors copy?** — UI yes, architecture no (2+ years, $10M+)
5. **How do you make money?** — Subscriptions ($10, $99, $2K/month tiers)
6. **When profitable?** — Month 32 break-even, Year 4 EBITDA positive
7. **What's your CAC?** — $50 retail, $500 advisor (18x, 36x LTV:CAC)
8. **Regulatory risk?** — Intelligence, not advice = lower bar; sandbox approach
9. **Team credibility?** — Repeat founders, African expertise, Silicon Valley execution
10. **Exit valuation?** — $400M-$960M (5-12x revenue, Year 5)

---

**Document Version**: 1.0  
**Last Updated**: September 2026  
**Contact**: investors@mobu.platform

*This FAQ is updated quarterly. For latest version, contact investor relations.*
