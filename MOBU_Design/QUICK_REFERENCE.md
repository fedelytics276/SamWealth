# MOBU Platform - Quick Reference Guide

> **One-page overview for rapid understanding**

---

## 🎯 What is MOBU?

**MOBU** = **M**odern **O**pen **B**anking & **U**nified Investments

A transparent investment intelligence platform for African capital markets where **every recommendation shows its work** through queryable evidence trails powered by knowledge graphs.

---

## 🌟 The Big Idea

**Problem**: Traditional robo-advisors are black boxes. Users don't know WHY a stock was recommended.

**MOBU Solution**: Every recommendation is a graph node with edges to its evidence:
```
[BUY Sasol] 
  ↓ CITES (weight: 0.4)
  [Valuation Signal: P/E = 0.8]
    ↓ DERIVED_FROM
    [Sasol ZAE000015889]
  
  ↓ CHECKED_AGAINST (result: pass)
  [FSCA Rule: Max 10% single equity]
```

**Result**: Users can literally traverse the reasoning path. Regulators can audit it. Trust is earned, not claimed.

---

## 📊 By The Numbers

| Metric | Phase 1A (6mo) | Phase 1B (12mo) | Phase 1C (18mo) |
|--------|---------------|----------------|----------------|
| **Users** | 1,000 | 10,000 | 50,000 |
| **Markets** | 2 (JSE, NGX) | 5 (+EGX, NSE, GSE) | 7 (+Casablanca, BRVM) |
| **Instruments** | 500 | 2,000 | 5,000 |
| **AUA** | - | $10M | $100M+ |
| **Team** | 15 people | 23 people | 30 people |
| **Investment** | $2M | +$1.5M | +$1.5M |

---

## 🏗️ Architecture in 60 Seconds

### The Four Layers
```
┌─────────────────────────────────────┐
│   10 Functional Domains             │
│   (Portfolio, Risk, Compliance...)  │
└─────────────────────────────────────┘
              ↓ consume
┌─────────────────────────────────────┐
│   AI / Recommendation Layer         │
│   (Signals → Scores → Explanations) │
└─────────────────────────────────────┘
              ↓ reads from
┌─────────────────────────────────────┐
│   Three Core Foundations            │
│   ┌──────────┐ ┌──────────┐ ┌────┐ │
│   │ Security │ │   Data   │ │Acct│ │
│   │  Master  │ │   Plane  │ │Eng │ │
│   └──────────┘ └──────────┘ └────┘ │
└─────────────────────────────────────┘
              ↓ fed by
┌─────────────────────────────────────┐
│   Exchange Data Ingestion           │
└─────────────────────────────────────┘
```

### Core Principle
**Single Source of Truth**: All modules read from same data → no divergence → full auditability

---

## 💻 Technology Stack (Lightning Round)

```
Frontend:    React + Next.js (web), React Native (mobile)
Backend:     Python (FastAPI), GraphQL (Apollo)
Databases:   PostgreSQL (master), Neo4j (graph), TimescaleDB (series)
Streaming:   Apache Kafka (Azure Event Hubs)
Cache:       Redis (Azure Cache for Redis)
Cloud:       Azure + Kubernetes
AI:          scikit-learn (signals), OpenAI (explanations)
```

**Why Neo4j?**: Evidence trails ARE graph traversals. Natural fit.

---

## 🎯 Target Users

| Persona | Profile | What They Need | What MOBU Gives |
|---------|---------|---------------|----------------|
| **Thabo** | Retail investor, R500K assets | Understand investments | Plain-language explanations, visual evidence |
| **Amara** | IFA, 25 clients | Scale advice | Multi-client dashboard, compliance automation |
| **Kwame** | Asset manager, $50M AUM | Institutional tools | Risk analytics, white-label reports, API |
| **Fatima** | First-time investor | Learn basics | Guided onboarding, educational content |

---

## 🗺️ Markets Coverage

### Phase 1 (African Markets)
1. 🇿🇦 **JSE** (Johannesburg) — $1.5T — Primary
2. 🇳🇬 **NGX** (Nigeria) — $114B — Primary
3. 🇪🇬 **EGX** (Egypt) — $74B — Core
4. 🇰🇪 **NSE** (Kenya) — $30B — Core
5. 🇬🇭 **GSE** (Ghana) — Mid-tier — Core
6. 🇲🇦 **Casablanca** — Top-5 — Later
7. 🌍 **BRVM** (8 countries) — $30B — Later

### Phase 2 (International)
- US, UK, EU, Asia-Pacific
- Same architecture, just more data

---

## 📱 Product Features

### MVP (Phase 1A)
- ✅ User registration & authentication
- ✅ Risk profile questionnaire
- ✅ Portfolio creation & tracking
- ✅ Recommendation engine (3 signals)
- ✅ Evidence trail visualization
- ✅ Dashboard (holdings, performance)
- ✅ Basic compliance (FSCA, SEC Nigeria)
- ✅ Mobile web (responsive)

### Growth (Phase 1B)
- ✅ Multi-client management (advisors)
- ✅ Native mobile apps (iOS, Android)
- ✅ Advanced risk metrics (VaR)
- ✅ White-label reports
- ✅ API access (beta)
- ✅ 5 African markets

### Institutional (Phase 1C)
- ✅ Trade execution
- ✅ SSO, team collaboration
- ✅ Custom compliance rules
- ✅ Regulatory reporting
- ✅ Public API v2
- ✅ 7 markets complete

---

## 🔑 Key Innovations

### 1. Evidence as Graph
Not "here's a recommendation with an explanation"  
But "here's a graph you can query to understand reasoning"

**Impact**: Regulatory approval easier, user trust higher

---

### 2. Compliance as Data
```json
{
  "rule": "max_single_equity",
  "limit": 0.10,
  "regulator": "FSCA",
  "active": true
}
```

**Impact**: New regulations = config change, not code deployment

---

### 3. Confidence Scoring
African markets have thin data → explicitly show confidence

```
Recommendation: BUY Sasol
Conviction: 72%
Confidence: 85% ← data quality
```

**Impact**: Honest about limitations, builds trust

---

## 📈 Success Metrics

### North Star
**ERAU** = Explained Recommendations Acted Upon  
(User views evidence → accepts recommendation)

**Target**: 30% of shown recommendations

### Other Key Metrics
- NPS: > 60 (by Phase 1C)
- 90-day retention: > 40%
- Evidence trail engagement: > 60%
- API uptime: 99.9%
- LTV:CAC: > 3:1

---

## 💰 Business Model

### Revenue Streams
1. **Subscriptions**
   - Retail: $9.99/month
   - Advisor: $99/month
   - Institutional: Custom

2. **Transaction Fees** (Phase 1C+)
   - Execution: 0.1-0.25% per trade
   - FX spread: 0.2%

3. **Data Services**
   - API access: Usage-based
   - Custom research

4. **White-Label** (Phase 2)
   - Platform licensing to banks

### Unit Economics (Target)
- CAC: $50 (retail), $500 (advisor)
- LTV: $600 (retail), $6,000 (advisor)
- Gross Margin: 75%+
- Payback: 8-10 months

---

## 🚀 18-Month Roadmap

### Month 0-6: Foundation
**Sprint 1-2**: Data foundation (Security Master, market data)  
**Sprint 3-4**: User management, portfolio creation  
**Sprint 5-6**: Recommendation engine V1  
**Sprint 7-8**: Evidence trail (graph + UI)  
**Sprint 9-10**: Polish, alpha launch  
**Sprint 11-12**: Alpha feedback iteration

**Outcome**: 1,000 alpha users, 2 markets, web app

---

### Month 6-12: Growth
**M7-8**: Market expansion (EGX, NSE, GSE)  
**M9-10**: Advisor features (multi-client)  
**M11-12**: Mobile apps (iOS, Android)

**Outcome**: 10,000 users, 5 markets, mobile apps

---

### Month 12-18: Institutionalization
**M13-14**: Final markets (Casablanca, BRVM)  
**M15-16**: Institutional features (SSO, teams)  
**M17-18**: Trade execution integration

**Outcome**: 50,000 users, $100M AUA, 7 markets

---

## 🛠️ Implementation Highlights

### Development Workflow
- **Sprints**: 2 weeks
- **Code Review**: 2 approvals required
- **Testing**: 80% coverage minimum
- **CI/CD**: GitHub Actions, deploy on merge
- **Environments**: Dev → Staging → Production

### Testing Strategy
- **Unit**: 60% of tests (pytest, Jest)
- **Integration**: 30% (API end-to-end)
- **E2E**: 10% (Playwright)
- **Load**: Before each launch

### Deployment
- **Blue-Green**: Zero-downtime
- **Kubernetes**: Auto-scaling
- **Monitoring**: Datadog
- **Alerts**: PagerDuty (critical), Slack (warnings)

---

## 🛡️ Security & Compliance

### Security Features
- TLS 1.3 in transit
- AES-256 at rest
- Field-level PII encryption
- MFA for advisors/institutions
- Immutable audit logs
- Annual pen testing

### Regulatory Compliance
- FSCA (South Africa)
- SEC Nigeria
- CMA (Kenya)
- FRA (Egypt)
- + 3 more in Phase 1
- GDPR, POPIA, NDPR

### Data Residency
- Primary: Azure South Africa North (Johannesburg)
- DR: Azure West Europe (Amsterdam)
- Per-country rules respected

---

## 🎨 Design Principles

**Transparency First**
Show the work, not just the answer

**Simplicity in Complexity**
Institutional-grade intelligence, retail-grade UX

**Trust Through Truth**
Acknowledge what we don't know

**African-First**
Built for market realities (thin data, multiple currencies)

---

## 📚 Document Roadmap

| Document | Purpose | Pages | Audience |
|----------|---------|-------|----------|
| **README.md** | Getting started | 5 | Everyone |
| **QUICK_REFERENCE.md** | This doc | 3 | Quick overview |
| **00_MASTER_SUMMARY.md** | Complete overview | 15 | All stakeholders |
| **01_Executive_Overview.md** | Strategy & business | 45 | Execs, investors |
| **02_System_Architecture.md** | Technical design | 65 | Engineers, architects |
| **03_Data_Model.md** | Databases & graph | 55 | Data engineers |
| **04_Product_Requirements.md** | Features & specs | 70 | Product, QA |
| **05_Implementation_Strategy.md** | Build roadmap | 50 | Engineering, PM |

---

## 🎯 Critical Success Factors

1. **Data Quality First** — Everything depends on it
2. **User Feedback Loops** — Alpha users from Sprint 3
3. **Transparency as Architecture** — Not bolted on later
4. **Team Culture** — Documentation, testing, review
5. **Measured Progress** — Metrics at every stage

---

## ⚡ Competitive Advantages

| Advantage | Description | Defensibility |
|-----------|-------------|---------------|
| **Evidence Trails** | Patent-worthy graph architecture | High |
| **African-First** | Built for market, not adapted | Medium |
| **Compliance-by-Design** | Rules as data from day one | Medium |
| **API Platform** | Ecosystem lock-in potential | Medium-High |
| **Trust Brand** | Compounds over time | High |

---

## 🚨 Known Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Data quality | High | High | Confidence scoring, multi-source |
| Regulatory delays | High | Medium | Early engagement, sandboxes |
| Low adoption | Critical | Medium | Alpha testing, pivot capability |
| Competitor entry | Medium | Low | Speed, transparency moat |
| Key person risk | High | Medium | Documentation, redundancy |

---

## 💡 Next Actions

### Week 1
- [ ] Secure seed funding ($4-5M)
- [ ] Draft job descriptions (Head of Eng, Head of Product)
- [ ] Legal entity setup
- [ ] Azure subscription + GitHub org

### Week 2-4
- [ ] Hire Head of Engineering
- [ ] Hire Head of Product
- [ ] Recruit initial team (5 engineers)
- [ ] Architecture validation workshop
- [ ] FSCA/SEC Nigeria introductions

### Month 2
- [ ] Team onboarded
- [ ] Sprint 1 begins
- [ ] JSE data licensing signed
- [ ] Development environment live
- [ ] First code committed

### Month 6
- [ ] Alpha launch
- [ ] 1,000 users signed up
- [ ] Product-market fit signal
- [ ] Beta planning

---

## 📞 Key Contacts

**Leadership** (to be hired):
- Head of Engineering: TBD
- Head of Product: TBD
- Head of Operations: TBD

**Advisors**:
- Regulatory: TBD
- Technical: TBD
- African Markets: TBD

---

## 🎓 Learn More

**Start Here**:
1. Read this doc (you are here!)
2. Read [README.md](./README.md)
3. Read [00_MASTER_SUMMARY.md](./00_MASTER_SUMMARY.md)

**Then Dive Deep**:
- Strategy → [01_Executive_Overview.md](./01_Executive_Overview.md)
- Product → [04_Product_Requirements.md](./04_Product_Requirements.md)
- Architecture → [02_System_Architecture.md](./02_System_Architecture.md)
- Data → [03_Data_Model.md](./03_Data_Model.md)
- Implementation → [05_Implementation_Strategy.md](./05_Implementation_Strategy.md)

---

## ✨ The Vision in One Sentence

**"MOBU makes investment recommendations you can trust by showing you exactly why they were made — through transparent, auditable, graph-based evidence trails."**

---

## 🏁 Bottom Line

| Question | Answer |
|----------|--------|
| **What?** | Transparent investment intelligence platform |
| **Where?** | African markets → International |
| **How?** | Knowledge graphs + explainable AI |
| **Why Trust?** | Evidence trails are queryable, not reconstructed |
| **When?** | Alpha in 6 months, scale in 18 months |
| **How Much?** | $5M for Phase 1 (18 months) |
| **How Big?** | $1.7T+ African markets, 150M+ investors |
| **Why Win?** | Transparency moat + African-first + compliance-ready |

---

**Status**: Design Complete ✅  
**Next**: Build 🚀  
**Timeline**: 18 months to institutional scale  
**Confidence**: High 📈

---

*"Show your work. Build trust. Scale globally."*  
— MOBU Platform Team, September 2026
