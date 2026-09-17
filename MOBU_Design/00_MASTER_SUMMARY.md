# MOBU Investment Platform
## Master Design Summary

**Platform Name:** MOBU (Modern Open Banking & Unified Investments)  
**Version:** 1.0  
**Date:** September 2026  
**Document Suite:** Complete State-of-the-Art Design

---

## Executive Summary

MOBU is a **transparent investment intelligence platform** for African capital markets with international expansion capability. Unlike traditional "black-box" robo-advisors, MOBU's core innovation is **explainable AI** — every recommendation comes with a complete, auditable evidence trail that investors and regulators can trust.

### Core Value Proposition

**"Show Your Work" Investment Intelligence**
- Every recommendation traceable to source data
- Visual evidence trails powered by knowledge graphs
- Compliance-by-design architecture
- Institutional-grade analytics, retail-grade UX

---

## Document Suite Overview

This design specification consists of 6 comprehensive documents:

### 01_Executive_Overview.md
**Purpose**: Strategic vision, market opportunity, business model  
**Audience**: Executives, investors, stakeholders  
**Key Content**:
- Vision & mission statements
- African market landscape ($1.7T+ opportunity)
- Competitive positioning
- User segments and personas
- Strategic roadmap (Phase 1: Africa, Phase 2: International)
- Business model & unit economics
- Investment requirements ($4M Phase 1)

---

### 02_System_Architecture.md
**Purpose**: Complete technical architecture and design  
**Audience**: Engineering team, technical architects  
**Key Content**:
- Core-out architecture philosophy
- Four foundational layers:
  - Single Security Master (canonical instrument data)
  - Single Data Plane (normalized time-series)
  - Single Accounting Engine (double-entry ledger)
  - AI/Recommendation Layer (explainable intelligence)
- Ten functional domains (Portfolio, Risk, Compliance, etc.)
- Technology stack (PostgreSQL, Neo4j, Kafka, React)
- Security architecture (encryption, auth, audit)
- Infrastructure (Azure, Kubernetes, multi-region)
- Integration patterns (exchanges, brokers, regulators)

---

### 03_Data_Model.md
**Purpose**: Knowledge graph schema and database design  
**Audience**: Data engineers, backend developers  
**Key Content**:
- Investment domain ontology (standardized vocabulary)
- Knowledge graph schema (Neo4j):
  - Node types (Instrument, Signal, Recommendation, etc.)
  - Relationship types (CITES, DERIVED_FROM, CHECKED_AGAINST)
  - Evidence trail queries
- Relational database schema (PostgreSQL):
  - Security master tables
  - Portfolio & accounting tables
  - Compliance tables
  - User management
- Time-series schema (TimescaleDB) for market data
- Data standards alignment (ISO 6166, ISO 17442, etc.)
- Data governance framework

---

### 04_Product_Requirements.md
**Purpose**: Complete product specification and requirements  
**Audience**: Product managers, designers, QA  
**Key Content**:
- User personas (Thabo, Amara, Kwame, Fatima)
- User stories across 5 epics:
  - Investment Discovery
  - Portfolio Management
  - Compliance & Risk
  - Reporting & Analytics
  - Education & Onboarding
- Functional requirements (150+ detailed specs)
- Non-functional requirements:
  - Performance (< 2s page load, < 500ms API)
  - Availability (99.9% uptime)
  - Security (TLS 1.3, AES-256, MFA)
  - Compliance (GDPR, POPIA, NDPR)
- UX requirements and user flows
- Success metrics (North Star: Explained Recommendations Acted Upon)
- Phase 1 scope definition

---

### 05_Implementation_Strategy.md
**Purpose**: Detailed 18-month build roadmap  
**Audience**: Engineering team, project managers  
**Key Content**:
- Sprint-by-sprint plan for 18 months
- Phase 1A (Months 0-6): Foundation
  - Security Master, Market Data, Auth, Portfolio, Recommendation Engine V1
  - Target: 1,000 alpha users
- Phase 1B (Months 6-12): Growth
  - Market expansion (5 markets), Advisor features, Mobile apps
  - Target: 10,000 users
- Phase 1C (Months 12-18): Institutionalization
  - Complete 7 markets, Trade execution, Institutional features
  - Target: 50,000 users, $100M AUA
- Team structure (15 → 23 → 30 people)
- Development workflow (sprints, code review, Git)
- Testing strategy (unit, integration, E2E, load)
- CI/CD pipeline and deployment process
- Risk management matrix

---

### 06_API_Specification.md *(To be created)*
**Purpose**: Complete API reference documentation  
**Audience**: Backend developers, API consumers  
**Planned Content**:
- RESTful and GraphQL endpoints
- Authentication and authorization
- Request/response schemas
- Error codes and handling
- Rate limiting
- Webhooks
- Code examples (Python, JavaScript)

---

## Key Architectural Innovations

### 1. Knowledge Graph as Evidence Layer

Traditional platforms store recommendations in relational tables. MOBU stores them as **graph nodes with edges to their evidence**:

```cypher
(Recommendation)-[:CITES]->(Signal)-[:DERIVED_FROM]->(Instrument)
(Recommendation)-[:CHECKED_AGAINST]->(ComplianceRule)-[:ENFORCED_BY]->(Regulator)
```

**Why This Matters**:
- "Why this recommendation?" becomes a graph traversal
- Evidence trails are queryable, not reconstructed
- Regulators can audit reasoning paths
- Investors see visual "proof"

### 2. Compliance as Data, Not Code

Regulatory rules are stored as **data records** in the database:

```json
{
  "rule_id": "fsca_single_equity_limit",
  "description": "No single equity > 10% of portfolio",
  "parameters": {"max_weight": 0.10},
  "regulator": "FSCA",
  "jurisdiction": "ZA"
}
```

**Why This Matters**:
- Add new regulations without code deployment
- A/B test rule interpretations
- Clear audit trail of which rules affected which recommendations
- Multi-jurisdiction support from day one

### 3. Explainable AI by Construction

The recommendation engine is **not a black box** — it's a transparent pipeline:

1. **Signal Generation**: Transparent calculations (P/E ratio, momentum)
2. **Rule Screening**: Compliance filters with logged reasons
3. **Composite Scoring**: Documented, adjustable weights
4. **Confidence Flagging**: Low data quality = low confidence
5. **LLM Explanation**: Grounded in graph evidence, not hallucinated

**Why This Matters**:
- Every step is inspectable
- Confidence scores reflect data quality
- Explanations are traceable to source data
- Regulators can validate methodology

---

## Technology Stack at a Glance

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Next.js, React Native | Web and mobile UX |
| **API** | GraphQL (Apollo), FastAPI | Flexible queries, type safety |
| **Graph DB** | Neo4j 5.x | Evidence trails, relationships |
| **Relational DB** | PostgreSQL 15+ | Master data, transactions, ACID |
| **Time-Series DB** | TimescaleDB | Market data, performance metrics |
| **Message Queue** | Apache Kafka | Event streaming, decoupling |
| **Cache** | Redis 7.x | Fast lookups, sessions |
| **AI/ML** | Python (scikit-learn, PyTorch) | Signals, LLM for explanations |
| **Infrastructure** | Azure, Kubernetes, Terraform | Cloud-native, IaC |
| **Monitoring** | Azure Monitor, Datadog | Observability, alerting |
| **CI/CD** | GitHub Actions | Automated testing, deployment |

---

## Phase 1 Roadmap (18 Months)

### Phase 1A: Foundation (Months 0-6)
**Goal**: Prove the transparency model with alpha users

**Deliverables**:
- Single Security Master (JSE + NGX)
- Market data ingestion (daily EOD)
- Basic recommendation engine (3 signals)
- Evidence trail visualization
- Web application (responsive)
- 1,000 alpha users

**Budget**: $2M

---

### Phase 1B: Growth (Months 6-12)
**Goal**: Expand markets and add advisor tier

**Deliverables**:
- 5 African markets (+ EGX, NSE, GSE)
- Multi-client advisor features
- Native mobile apps (iOS, Android)
- Advanced risk metrics (VaR, concentration)
- White-label reporting
- API beta
- 10,000 users, 500 advisors

**Budget**: $1.5M

---

### Phase 1C: Institutionalization (Months 12-18)
**Goal**: Reach institutional scale

**Deliverables**:
- 7 African markets complete (+ Casablanca, BRVM)
- Trade execution integration
- Institutional features (SSO, teams, custom rules)
- Public API v2
- Regulatory reporting automation
- 50,000 users, $100M AUA

**Budget**: $1.5M

**Total Phase 1 Budget**: $5M (includes reserve)

---

## Success Metrics

### North Star Metric
**Explained Recommendations Acted Upon (ERAU)**
- User views evidence trail AND accepts recommendation
- Target: 30% of shown recommendations

### Key Performance Indicators

**User Metrics**:
- Monthly Active Users: 10K (Phase 1B), 50K (Phase 1C)
- 30-Day Retention: 60%
- 90-Day Retention: 40%
- Evidence trail engagement: 60% of recommendations

**Platform Metrics**:
- Data quality score: > 0.85
- Recommendation confidence: > 0.70 average
- API uptime: 99.9%
- Page load time: < 2s

**Business Metrics**:
- Assets Under Advisement: $100M (Phase 1C)
- Monthly Recurring Revenue: Growth to profitability
- LTV:CAC Ratio: > 3:1
- Net Revenue Retention: > 100%
- Gross Margin: > 75%

**Trust Metrics**:
- Net Promoter Score: > 60 (Phase 1C)
- Recommendation Trust: > 80% agree/strongly agree

---

## Target Markets (Phase 1)

| Exchange | Country | Market Cap | Instruments | Priority |
|----------|---------|-----------|-------------|----------|
| **JSE** | South Africa | ~$1.5T | 400+ | 1 (Primary) |
| **NGX** | Nigeria | ~$114B | 150+ | 1 (Primary) |
| **EGX** | Egypt | ~$74B | 250+ | 2 (Core) |
| **NSE** | Kenya | ~$30B | 60+ | 2 (Core) |
| **GSE** | Ghana | Mid-tier | 40+ | 2 (Core) |
| **Casablanca** | Morocco | Top-5 | 75+ | 3 (Later) |
| **BRVM** | 8 UEMOA States | ~$30B | 45+ | 3 (Later) |

**Total Phase 1 Coverage**: ~1,000 instruments, representing ~$1.7T in market capitalization

---

## Regulatory Landscape

| Market | Regulator | Key Requirements |
|--------|-----------|-----------------|
| South Africa | FSCA | Market conduct, client money rules |
| Nigeria | SEC Nigeria | Investment and Securities Act 2025 compliance |
| Kenya | CMA | Capital Markets Authority licensing |
| Egypt | FRA | Financial Regulatory Authority oversight |
| Ghana | SEC Ghana | Securities and Exchange Commission rules |
| Morocco | AMMC | Market authority registration |
| UEMOA | CREPMF / AMF-UMOA | Regional BRVM regulator |

**Compliance Strategy**: 
- Rules stored as data (not code)
- Per-jurisdiction configuration
- Audit trails for all actions
- Early regulator engagement

---

## Team & Organization

### Phase 1A Team (15 people)
- **Engineering**: 9 (Head + Backend + Frontend + Data + DevOps + QA)
- **Product**: 3 (Head + PM + Designer)
- **Operations**: 3 (Head + Compliance + Data Ops)

### Phase 1B Team Growth (+8 = 23)
- Mobile engineers, backend engineers, product manager, customer success

### Phase 1C Team Growth (+7 = 30)
- Integration specialists, security engineer, business analyst, marketing, sales

**Key Hires First**:
1. Head of Engineering / Tech Lead
2. Head of Product
3. Senior Backend Engineer (data pipelines)

---

## Investment Thesis

### Why MOBU Will Win

**1. Transparency as Moat**
- Competitors can copy features, not fundamental architecture
- Graph-native evidence trails are our patent-worthy innovation
- Trust compounds over time

**2. African-First Strategy**
- Underserved market with limited competition
- Market realities (thin data, multiple currencies) baked into design
- Not an afterthought adaptation of developed-market platform

**3. Regulatory Tailwinds**
- Post-2020 push for platform transparency
- FSCA, SEC Nigeria increasingly scrutinizing robo-advisors
- MOBU's compliance-by-design is competitive advantage

**4. Scalable Architecture**
- Phase 2 international expansion is data/compliance extension
- No re-architecture needed
- Same core serves retail, advisor, institutional

**5. Defensible Network Effects**
- More users → more feedback → better recommendations
- More advisors → more portfolios → richer benchmarks
- API partners → ecosystem lock-in

### Risk Mitigation

**Identified Risks**:
- Data quality in African markets → Confidence scoring, multi-source validation
- Regulatory delays → Early engagement, sandbox applications
- Competitor entry → Speed to market, patent evidence trail method
- Low adoption → Alpha/beta testing, pivot capability

---

## Next Steps

### Immediate (30 Days)
1. **Secure Funding**: Close seed round ($4-5M)
2. **Team Formation**: Hire Head of Engineering, Head of Product
3. **Regulatory**: Initial FSCA/SEC Nigeria meetings
4. **Data**: Begin JSE/NGX data licensing negotiations
5. **Technical**: Architecture validation workshop

### 90-Day Milestones
1. Ontology ratified and documented
2. Security Master V1 operational (JSE + NGX)
3. Alpha platform functional (basic recommendations)
4. Regulatory sandbox approval (1+ jurisdiction)
5. Design system complete

### 6-Month Goal
- **1,000 alpha users on platform**
- **500+ portfolios with real holdings**
- **Evidence trails generating user trust**
- **Clear product-market fit signal**
- **Beta launch ready**

---

## Conclusion

MOBU represents a **fundamental rethinking of investment platforms** — not incremental improvement, but architectural innovation that makes transparency inherent rather than aspirational.

By building on a **knowledge graph foundation**, implementing **explainable AI**, and treating **compliance as data**, MOBU delivers what African markets desperately need: **trustworthy, auditable, institutional-grade investment intelligence accessible to everyone**.

### The Opportunity is Clear
- $1.7T+ African markets underserved
- 150M+ potential investors
- No transparent platform exists today

### The Technology is Ready
- Knowledge graphs mature (Neo4j 5.x)
- LLMs enable grounded explanations
- Cloud infrastructure available in Africa

### The Timing is Ideal
- Post-2020 trust deficit
- Regulatory push for transparency
- Mobile-first African tech adoption

**MOBU is the platform African investors deserve — and the blueprint shows exactly how to build it.**

---

## Document Version Control

| Document | Version | Last Updated | Status |
|----------|---------|--------------|--------|
| 00_MASTER_SUMMARY.md | 1.0 | Sep 2026 | ✅ Complete |
| 01_Executive_Overview.md | 1.0 | Sep 2026 | ✅ Complete |
| 02_System_Architecture.md | 1.0 | Sep 2026 | ✅ Complete |
| 03_Data_Model.md | 1.0 | Sep 2026 | ✅ Complete |
| 04_Product_Requirements.md | 1.0 | Sep 2026 | ✅ Complete |
| 05_Implementation_Strategy.md | 1.0 | Sep 2026 | ✅ Complete |
| 06_API_Specification.md | - | - | 📋 Planned |

---

## Contact & Governance

**Document Owners**: Product & Engineering Leadership  
**Review Cycle**: Monthly during Phase 1A, Quarterly thereafter  
**Change Process**: PRs to documentation repo, review required  
**Feedback**: Internal Slack #mobu-design, External via partnerships@mobu.platform

---

*This master summary provides the 30,000-foot view. Dive into individual documents for depth.*

**Read in Order**:
1. Start with 01_Executive_Overview for vision and strategy
2. Then 04_Product_Requirements for what we're building
3. Then 02_System_Architecture for how it works
4. Then 03_Data_Model for the knowledge graph
5. Finally 05_Implementation_Strategy for the build plan

**"Show your work. Build trust. Scale globally."**  
— MOBU Platform Team
