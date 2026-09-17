# MOBU Investment Platform
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** September 2026  
**Status:** Comprehensive Requirements Specification

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [User Personas](#2-user-personas)
3. [User Stories & Requirements](#3-user-stories--requirements)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Experience Requirements](#6-user-experience-requirements)
7. [Success Metrics](#7-success-metrics)
8. [Phase 1 Scope](#8-phase-1-scope)

---

## 1. Product Vision

### 1.1 Vision Statement
MOBU is the transparent investment intelligence platform that shows its work — where every recommendation comes with a complete, auditable evidence trail that investors and regulators can trust.

### 1.2 Product Principles

**Transparency First**
- Every recommendation must be explainable
- Evidence trails are visual and queryable
- No black-box algorithms

**Simplicity in Complexity**
- Institutional-grade intelligence
- Retail-grade user experience
- Plain language, not jargon

**Trust Through Truth**
- Data quality visible to users
- Confidence scores on every recommendation
- Acknowledge what we don't know

**African-First, Global-Ready**
- Built for African market realities
- Extensible to international markets
- Multi-currency, multi-regulatory by design

---

## 2. User Personas

### Persona 1: Thabo - Mass-Affluent Retail Investor

**Demographics**
- Age: 35
- Location: Johannesburg, South Africa
- Income: R850,000/year
- Investable Assets: R500,000

**Goals**
- Build wealth for retirement
- Understand where to invest
- See performance vs. benchmarks
- Make informed decisions

**Pain Points**
- Doesn't trust opaque robo-advisors
- Can't afford financial advisor fees
- JSE research overwhelming
- Doesn't understand why stocks recommended

**How MOBU Helps**
- Clear explanations for every recommendation
- Plain-language insights
- Transparent performance tracking
- Educational content built-in

**Key Features Needed**
- Mobile-first experience
- Push notifications for opportunities
- Simple portfolio dashboard
- One-click evidence trail viewing

---

### Persona 2: Amara - Independent Financial Advisor

**Demographics**
- Age: 42
- Location: Lagos, Nigeria
- Clients: 25 individuals + 3 small businesses
- AUM: $2.5M across clients

**Goals**
- Provide professional advice at scale
- Stay compliant with SEC Nigeria
- Differentiate from bank advisors
- Grow client base through referrals

**Pain Points**
- Manual portfolio tracking across clients
- Compliance reporting burden
- Limited research tools
- Can't afford Bloomberg terminal

**How MOBU Helps**
- Multi-client management dashboard
- Automated compliance checks
- Professional research platform
- White-label client reports

**Key Features Needed**
- Bulk portfolio operations
- Client comparison views
- Regulatory report generation
- API access for integration

---

### Persona 3: Kwame - Asset Manager (Emerging)

**Demographics**
- Age: 38
- Location: Accra, Ghana
- Firm AUM: $50M
- Team: 5 people

**Goals**
- Manage institutional capital professionally
- Meet fiduciary obligations
- Scale AUM to $100M+
- Maintain regulatory compliance

**Pain Points**
- Data reconciliation overhead
- Manual risk calculations
- Performance attribution complexity
- Audit trail requirements

**How MOBU Helps**
- Institutional-grade analytics
- Built-in audit trails
- Risk management tools
- API for existing systems

**Key Features Needed**
- Advanced analytics
- Custom report builder
- Batch operations
- Dedicated support

---

### Persona 4: Fatima - Retail Investor (New to Investing)

**Demographics**
- Age: 28
- Location: Cairo, Egypt
- Income: 180,000 EGP/year
- Investable Assets: 50,000 EGP

**Goals**
- Start investing for first time
- Learn about Egyptian stock market
- Not lose money from bad advice
- Grow savings steadily

**Pain Points**
- Zero investment knowledge
- Doesn't trust banks after 2020
- Afraid of making mistakes
- Overwhelmed by choices

**How MOBU Helps**
- Guided onboarding
- Educational tooltips everywhere
- Risk assessment questionnaire
- Conservative default portfolios

**Key Features Needed**
- Beginner mode
- Educational content
- Small minimum investment
- Simplified interface

---

## 3. User Stories & Requirements

### 3.1 Core User Stories

**Epic 1: Investment Discovery**

**US-101**: As an investor, I want to see personalized investment recommendations so I can identify opportunities matching my goals.
- **Acceptance Criteria**:
  - Recommendations based on risk profile, goals, existing holdings
  - Ranked by conviction score
  - Filtered by liquidity, market cap, sector
  - Updated daily

**US-102**: As an investor, I want to understand WHY each recommendation is made so I can make informed decisions.
- **Acceptance Criteria**:
  - Plain-language explanation for every recommendation
  - Visual evidence trail showing data sources
  - Confidence score visible
  - Alternative viewpoints shown (if any)

**US-103**: As an investor, I want to see data quality indicators so I know how reliable the recommendation is.
- **Acceptance Criteria**:
  - Data completeness score
  - Last updated timestamp
  - Source attribution
  - Quality warnings for thin coverage

---

**Epic 2: Portfolio Management**

**US-201**: As an investor, I want to track all my investments in one place so I can see my complete financial picture.
- **Acceptance Criteria**:
  - Multi-portfolio support
  - Real-time (or near-real-time) valuations
  - Multi-currency display
  - Benchmarked performance

**US-202**: As an advisor, I want to manage multiple client portfolios simultaneously so I can serve more clients efficiently.
- **Acceptance Criteria**:
  - Switch between clients instantly
  - Bulk operations (rebalancing, reporting)
  - Client grouping (by strategy, risk profile)
  - Aggregate views

**US-203**: As a portfolio manager, I want automated rebalancing recommendations so I can maintain target allocations.
- **Acceptance Criteria**:
  - Detect drift from target allocation
  - Suggest trades to rebalance
  - Minimize transaction costs
  - Tax-aware (where applicable)

**US-204**: As an investor, I want to see how my portfolio would perform under different scenarios so I can assess risk.
- **Acceptance Criteria**:
  - Historical scenario replay (2008 crisis, COVID crash)
  - Custom scenarios (inflation spike, currency devaluation)
  - Impact on portfolio value and drawdown
  - Comparison to benchmark

---

**Epic 3: Compliance & Risk**

**US-301**: As an advisor, I want pre-trade compliance checks so I don't accidentally violate regulations.
- **Acceptance Criteria**:
  - Check before order submission
  - Clear pass/fail indicator
  - Specific rule citation if fail
  - Suggestion to make compliant

**US-302**: As a portfolio manager, I want to monitor portfolio risk metrics so I can stay within mandates.
- **Acceptance Criteria**:
  - VaR (Value at Risk) calculation
  - Concentration risk by sector, issuer
  - Currency exposure
  - Alerts when approaching limits

**US-303**: As a compliance officer, I want audit trails for all recommendations and trades so I can respond to regulator inquiries.
- **Acceptance Criteria**:
  - Immutable log of all actions
  - User, timestamp, rationale recorded
  - Queryable by date, user, portfolio
  - Exportable in standard formats

---

**Epic 4: Reporting & Analytics**

**US-401**: As an investor, I want monthly performance reports so I can track progress toward goals.
- **Acceptance Criteria**:
  - Return vs. benchmark
  - Contribution by holding
  - Realized vs. unrealized gains
  - PDF export, email delivery

**US-402**: As an advisor, I want white-label client reports so I can maintain my brand.
- **Acceptance Criteria**:
  - Custom logo, colors
  - Firm name on report
  - Professional PDF output
  - Scheduled delivery

**US-403**: As a portfolio manager, I want performance attribution analysis so I can understand what drove returns.
- **Acceptance Criteria**:
  - Brinson-Fachler attribution
  - Sector, security, timing effects
  - Active vs. passive return
  - Skill vs. luck decomposition

---

**Epic 5: Education & Onboarding**

**US-501**: As a new investor, I want guided onboarding so I can set up my account correctly.
- **Acceptance Criteria**:
  - Step-by-step wizard
  - Risk tolerance questionnaire
  - Goal setting (retirement, home, education)
  - Suggested starting portfolio

**US-502**: As an investor, I want contextual help so I can learn as I use the platform.
- **Acceptance Criteria**:
  - Tooltips on financial terms
  - "Learn more" links to articles
  - Video tutorials
  - In-app FAQ

**US-503**: As an investor, I want educational content about African markets so I can become a better investor.
- **Acceptance Criteria**:
  - Market primers (JSE, NGX, EGX guides)
  - Investment concepts (diversification, risk)
  - Case studies
  - Weekly market commentary

---

## 4. Functional Requirements

### 4.1 User Management

**FR-UM-001**: System shall support multiple user types (retail, advisor, institutional, admin)
**FR-UM-002**: System shall enforce role-based access control (RBAC)
**FR-UM-003**: System shall support multi-factor authentication (MFA)
**FR-UM-004**: System shall allow users to manage their profile and preferences
**FR-UM-005**: System shall support single sign-on (SSO) for institutional users
**FR-UM-006**: System shall track user activity for audit purposes
**FR-UM-007**: System shall allow password reset via email
**FR-UM-008**: System shall enforce strong password requirements
**FR-UM-009**: System shall support user impersonation for support purposes (with audit trail)
**FR-UM-010**: System shall allow users to delete their account (GDPR compliance)

### 4.2 Portfolio Management

**FR-PM-001**: System shall support creating multiple portfolios per user
**FR-PM-002**: System shall track positions across portfolios in real-time
**FR-PM-003**: System shall support manual transaction entry (buy, sell, transfer)
**FR-PM-004**: System shall support CSV import of historical transactions
**FR-PM-005**: System shall calculate cost basis using FIFO, LIFO, or average cost methods
**FR-PM-006**: System shall support fractional shares
**FR-PM-007**: System shall calculate unrealized gains/losses
**FR-PM-008**: System shall calculate realized gains/losses
**FR-PM-009**: System shall support portfolio cloning (for model portfolios)
**FR-PM-010**: System shall support portfolio comparison (side-by-side)
**FR-PM-011**: System shall support portfolio consolidation view (all portfolios)
**FR-PM-012**: System shall recalculate valuations when market data updates
**FR-PM-013**: System shall support historical point-in-time portfolio snapshots
**FR-PM-014**: System shall support cash accounts in multiple currencies
**FR-PM-015**: System shall track dividends and corporate actions automatically

### 4.3 Recommendation Engine

**FR-RE-001**: System shall generate daily investment recommendations per user
**FR-RE-002**: System shall personalize recommendations based on risk profile
**FR-RE-003**: System shall filter recommendations by liquidity thresholds
**FR-RE-004**: System shall provide confidence score (0-100) for each recommendation
**FR-RE-005**: System shall generate plain-language explanation for each recommendation
**FR-RE-006**: System shall cite specific data points in explanations
**FR-RE-007**: System shall show evidence trail as queryable graph
**FR-RE-008**: System shall update recommendations when underlying data changes
**FR-RE-009**: System shall support user feedback on recommendations (thumbs up/down)
**FR-RE-010**: System shall learn from user feedback to improve personalization
**FR-RE-011**: System shall mark recommendations as stale if data is outdated
**FR-RE-012**: System shall support multi-signal recommendations (valuation + momentum + quality)
**FR-RE-013**: System shall adjust recommendations for existing portfolio holdings
**FR-RE-014**: System shall provide alternative recommendations if primary fails compliance
**FR-RE-015**: System shall version all recommendations for audit trail

### 4.4 Compliance

**FR-CO-001**: System shall check trades against regulatory rules before execution
**FR-CO-002**: System shall support multiple regulatory jurisdictions simultaneously
**FR-CO-003**: System shall maintain library of compliance rules per regulator
**FR-CO-004**: System shall allow compliance officers to add/modify rules without code changes
**FR-CO-005**: System shall support rule effective dates (past, present, future)
**FR-CO-006**: System shall log all compliance check results
**FR-CO-007**: System shall alert users when approaching compliance limits
**FR-CO-008**: System shall block trades that violate hard rules
**FR-CO-009**: System shall warn (but allow) trades that trigger soft rules
**FR-CO-010**: System shall generate regulatory reports on schedule
**FR-CO-011**: System shall support manual override of compliance checks (with reason)
**FR-CO-012**: System shall track override history for audit
**FR-CO-013**: System shall support concentration limits (single issuer, sector, geography)
**FR-CO-014**: System shall support suitability checks based on investor profile
**FR-CO-015**: System shall generate compliance violation reports

### 4.5 Data Management

**FR-DM-001**: System shall ingest market data from multiple exchanges daily
**FR-DM-002**: System shall normalize data into consistent format
**FR-DM-003**: System shall validate data quality on ingestion
**FR-DM-004**: System shall assign quality scores to all data points
**FR-DM-005**: System shall deduplicate instruments across data sources
**FR-DM-006**: System shall maintain single security master
**FR-DM-007**: System shall track corporate actions (dividends, splits, mergers)
**FR-DM-008**: System shall apply corporate actions to portfolios automatically
**FR-DM-009**: System shall support multiple currencies with FX rates
**FR-DM-010**: System shall update FX rates daily
**FR-DM-011**: System shall maintain historical time-series for all instruments
**FR-DM-012**: System shall support missing data gracefully (flags, estimates)
**FR-DM-013**: System shall provide data lineage (source to destination)
**FR-DM-014**: System shall version reference data changes
**FR-DM-015**: System shall export data via API for authorized users

### 4.6 Risk Management

**FR-RM-001**: System shall calculate Value at Risk (VaR) for portfolios
**FR-RM-002**: System shall calculate Expected Shortfall (CVaR)
**FR-RM-003**: System shall identify concentration risks (issuer, sector, geography)
**FR-RM-004**: System shall calculate portfolio beta
**FR-RM-005**: System shall calculate Sharpe ratio
**FR-RM-006**: System shall calculate maximum drawdown
**FR-RM-007**: System shall support scenario analysis (historical, hypothetical)
**FR-RM-008**: System shall calculate stress test results
**FR-RM-009**: System shall identify correlated holdings
**FR-RM-010**: System shall track risk metrics over time
**FR-RM-011**: System shall alert when risk limits are breached
**FR-RM-012**: System shall support custom risk models
**FR-RM-013**: System shall calculate currency risk exposure
**FR-RM-014**: System shall calculate liquidity risk
**FR-RM-015**: System shall provide risk decomposition by position

### 4.7 Reporting

**FR-RP-001**: System shall generate monthly portfolio statements
**FR-RP-002**: System shall generate performance reports (daily, monthly, quarterly, annual)
**FR-RP-003**: System shall generate tax reports (capital gains, dividends)
**FR-RP-004**: System shall generate compliance reports for regulators
**FR-RP-005**: System shall support custom report builder
**FR-RP-006**: System shall export reports to PDF, Excel, CSV
**FR-RP-007**: System shall email reports on schedule
**FR-RP-008**: System shall support white-label reports (custom branding)
**FR-RP-009**: System shall generate attribution analysis reports
**FR-RP-010**: System shall generate risk reports
**FR-RP-011**: System shall generate transaction history reports
**FR-RP-012**: System shall generate benchmark comparison reports
**FR-RP-013**: System shall support report templates
**FR-RP-014**: System shall archive reports for regulatory retention periods
**FR-RP-015**: System shall support multi-currency reports

### 4.8 API & Integrations

**FR-API-001**: System shall expose GraphQL API for all core functions
**FR-API-002**: System shall support API key authentication
**FR-API-003**: System shall rate-limit API requests per user tier
**FR-API-004**: System shall version API endpoints
**FR-API-005**: System shall provide API documentation (OpenAPI/Swagger)
**FR-API-006**: System shall log all API requests
**FR-API-007**: System shall support webhooks for events
**FR-API-008**: System shall integrate with broker APIs for execution (Phase 1B)
**FR-API-009**: System shall integrate with bank APIs for funding (Phase 2)
**FR-API-010**: System shall support data export to accounting systems

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-PERF-001**: Web pages shall load in < 2 seconds on 4G connection
**NFR-PERF-002**: API responses shall complete in < 500ms for 95th percentile
**NFR-PERF-003**: System shall support 10,000 concurrent users (Phase 1)
**NFR-PERF-004**: System shall process 1,000 portfolio valuations per second
**NFR-PERF-005**: Recommendation generation shall complete in < 30 seconds per portfolio
**NFR-PERF-006**: Database queries shall complete in < 100ms for 90th percentile
**NFR-PERF-007**: System shall handle 100M data points ingested per day
**NFR-PERF-008**: Mobile app shall launch in < 3 seconds
**NFR-PERF-009**: Graph traversals for evidence trails shall complete in < 1 second
**NFR-PERF-010**: Report generation shall complete in < 10 seconds

### 5.2 Availability

**NFR-AVAIL-001**: System shall maintain 99.9% uptime (8.76 hours downtime/year)
**NFR-AVAIL-002**: Planned maintenance windows shall be communicated 48 hours in advance
**NFR-AVAIL-003**: System shall support graceful degradation (serve stale data if fresh unavailable)
**NFR-AVAIL-004**: System shall failover to backup region within 1 hour for disasters
**NFR-AVAIL-005**: System shall maintain read replicas for query workloads
**NFR-AVAIL-006**: Critical services shall auto-restart on failure

### 5.3 Scalability

**NFR-SCALE-001**: System shall scale horizontally for web and API tiers
**NFR-SCALE-002**: Database shall support up to 500,000 portfolios (Phase 1)
**NFR-SCALE-003**: Database shall support up to 50,000 instruments (Phase 2)
**NFR-SCALE-004**: System shall handle 10x traffic spike without degradation
**NFR-SCALE-005**: Storage shall support 10TB of time-series data
**NFR-SCALE-006**: System shall partition data by geography for compliance

### 5.4 Security

**NFR-SEC-001**: All data in transit shall be encrypted with TLS 1.3
**NFR-SEC-002**: All data at rest shall be encrypted with AES-256
**NFR-SEC-003**: PII shall be encrypted at field level
**NFR-SEC-004**: Passwords shall be hashed with bcrypt (cost factor 12+)
**NFR-SEC-005**: System shall enforce MFA for advisors and institutional users
**NFR-SEC-006**: System shall implement rate limiting to prevent brute force
**NFR-SEC-007**: System shall implement CSRF protection
**NFR-SEC-008**: System shall sanitize all user inputs
**NFR-SEC-009**: System shall implement principle of least privilege for database access
**NFR-SEC-010**: System shall rotate encryption keys annually
**NFR-SEC-011**: System shall conduct quarterly security audits
**NFR-SEC-012**: System shall implement Web Application Firewall (WAF)
**NFR-SEC-013**: System shall monitor for suspicious activity
**NFR-SEC-014**: System shall implement DDoS protection
**NFR-SEC-015**: System shall conduct annual penetration testing

### 5.5 Compliance & Regulatory

**NFR-COMP-001**: System shall comply with GDPR (for EU users)
**NFR-COMP-002**: System shall comply with POPIA (South Africa)
**NFR-COMP-003**: System shall comply with NDPR (Nigeria)
**NFR-COMP-004**: System shall maintain audit logs for 7 years minimum
**NFR-COMP-005**: System shall support right to access (data export)
**NFR-COMP-006**: System shall support right to erasure (anonymization)
**NFR-COMP-007**: System shall obtain explicit consent for data processing
**NFR-COMP-008**: System shall maintain data processing records
**NFR-COMP-009**: System shall report data breaches within 72 hours
**NFR-COMP-010**: System shall conduct Data Protection Impact Assessments

### 5.6 Usability

**NFR-USE-001**: System shall support English, French, Arabic (Phase 1)
**NFR-USE-002**: System shall support mobile, tablet, desktop viewports
**NFR-USE-003**: System shall meet WCAG 2.1 Level AA accessibility standards
**NFR-USE-004**: System shall support keyboard navigation
**NFR-USE-005**: System shall support screen readers
**NFR-USE-006**: System shall provide consistent UI patterns across modules
**NFR-USE-007**: System shall provide inline help and tooltips
**NFR-USE-008**: System shall display loading states for async operations
**NFR-USE-009**: System shall provide clear error messages
**NFR-USE-010**: System shall support light and dark themes

### 5.7 Maintainability

**NFR-MAINT-001**: Code shall maintain 80%+ test coverage
**NFR-MAINT-002**: System shall use consistent coding standards (linted)
**NFR-MAINT-003**: API changes shall be backward compatible for 6 months
**NFR-MAINT-004**: System shall support zero-downtime deployments
**NFR-MAINT-005**: System shall maintain comprehensive documentation
**NFR-MAINT-006**: System shall log all errors with stack traces
**NFR-MAINT-007**: System shall support feature flags for gradual rollouts
**NFR-MAINT-008**: System shall version all database migrations
**NFR-MAINT-009**: System shall maintain disaster recovery runbooks
**NFR-MAINT-010**: System shall conduct monthly code reviews

### 5.8 Observability

**NFR-OBS-001**: System shall log all user actions
**NFR-OBS-002**: System shall emit metrics for key business events
**NFR-OBS-003**: System shall trace requests across microservices
**NFR-OBS-004**: System shall alert on-call engineers for critical failures
**NFR-OBS-005**: System shall maintain 30-day retention for logs
**NFR-OBS-006**: System shall provide real-time dashboards for operations
**NFR-OBS-007**: System shall conduct weekly review of errors and warnings
**NFR-OBS-008**: System shall measure and optimize slow queries
**NFR-OBS-009**: System shall track API usage by endpoint
**NFR-OBS-010**: System shall measure user satisfaction scores

---

## 6. User Experience Requirements

### 6.1 Design Principles

**Clarity**
- One primary action per screen
- Clear visual hierarchy
- Minimal cognitive load

**Transparency**
- Show confidence levels
- Expose data quality
- Make evidence trails visible

**Trustworthiness**
- Professional design
- Consistent branding
- No dark patterns

**Accessibility**
- Support diverse users
- Multiple languages
- Inclusive design

### 6.2 Key User Flows

**Flow 1: New User Onboarding (10 minutes)**
1. Landing page → Sign up
2. Email verification
3. Risk tolerance questionnaire (10 questions)
4. Investment goals selection
5. Suggested portfolio presentation
6. Account funding explanation
7. Dashboard tour

**Flow 2: Daily Check-In (2 minutes)**
1. Login → Dashboard
2. View portfolio performance (today, week, month)
3. See new recommendations
4. Read one recommendation explanation
5. (Optional) Accept recommendation
6. Check alerts/notifications

**Flow 3: Deep Dive on Recommendation (5 minutes)**
1. Recommendations page
2. Click recommendation
3. View evidence trail visualization
4. Read plain-language explanation
5. Explore supporting data (price charts, fundamentals)
6. Compare to alternatives
7. Decide to accept or dismiss

**Flow 4: Portfolio Rebalancing (15 minutes)**
1. Portfolio page → Rebalancing tool
2. View current vs. target allocation
3. See suggested trades
4. Review tax implications
5. Adjust trades manually if desired
6. Pre-trade compliance check
7. Confirm and execute (or export for manual execution)

**Flow 5: Monthly Review (30 minutes)**
1. Reports page → Performance report
2. View return vs. benchmark
3. Drill into best/worst performers
4. Read attribution analysis
5. Adjust risk profile if needed
6. Update investment goals
7. Download PDF report

### 6.3 Mobile-Specific Requirements

**UX-MOB-001**: All core functions accessible on mobile
**UX-MOB-002**: Touch targets minimum 44x44 pixels
**UX-MOB-003**: Forms optimized for mobile input
**UX-MOB-004**: Swipe gestures for common actions
**UX-MOB-005**: Biometric login support (Face ID, fingerprint)
**UX-MOB-006**: Offline mode for viewing portfolio (stale data acceptable)
**UX-MOB-007**: Push notifications for important events
**UX-MOB-008**: Progressive Web App (PWA) support
**UX-MOB-009**: Dark mode for OLED battery savings
**UX-MOB-010**: Data usage optimization (lazy load images)

### 6.4 Information Architecture

```
MOBU Platform
│
├── Dashboard (Home)
│   ├── Portfolio Summary
│   ├── Recent Recommendations
│   ├── Market Overview
│   └── Alerts & Notifications
│
├── Portfolios
│   ├── All Portfolios List
│   ├── Portfolio Detail
│   │   ├── Holdings
│   │   ├── Performance
│   │   ├── Transactions
│   │   ├── Risk Metrics
│   │   └── Rebalancing
│   └── Create Portfolio
│
├── Recommendations
│   ├── For You (Personalized)
│   ├── By Asset Class
│   ├── By Market
│   ├── Saved Recommendations
│   └── Recommendation Detail
│       ├── Explanation
│       ├── Evidence Trail
│       ├── Supporting Data
│       └── Action (Accept/Dismiss)
│
├── Markets
│   ├── Market Overview
│   ├── Instrument Search
│   ├── Instrument Detail
│   │   ├── Price Chart
│   │   ├── Fundamentals
│   │   ├── News
│   │   └── MOBU Analysis
│   └── Watchlists
│
├── Reports
│   ├── Performance Reports
│   ├── Tax Reports
│   ├── Compliance Reports
│   ├── Custom Reports
│   └── Report History
│
├── Education
│   ├── Getting Started
│   ├── Investment Concepts
│   ├── Market Guides
│   ├── Video Tutorials
│   └── FAQ
│
├── Settings
│   ├── Profile
│   ├── Security (Password, MFA)
│   ├── Notifications
│   ├── Preferences
│   ├── API Keys (for developers)
│   └── Subscription & Billing
│
└── (Advisor-Only) Clients
    ├── Client List
    ├── Client Detail (same as Portfolio)
    ├── Bulk Operations
    └── Client Reports
```

---

## 7. Success Metrics

### 7.1 North Star Metric
**Explained Recommendations Acted Upon (ERAU)**
- Definition: Number of recommendations where user viewed evidence trail AND then accepted
- Target: 30% of shown recommendations
- Rationale: Measures core value prop (transparency leading to trust leading to action)

### 7.2 Product Metrics

**Engagement**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness) — Target: > 25%
- Session frequency — Target: 3+ times/week
- Session duration — Target: 8+ minutes
- Evidence trail view rate — Target: 60% of recommendations

**Conversion**
- Signup to first portfolio: Target < 24 hours
- Signup to first recommendation accepted: Target < 7 days
- Free to paid conversion: Target 10%
- Recommendation acceptance rate: Target 20-30%
- Retention (30-day): Target 60%
- Retention (90-day): Target 40%

**Platform Health**
- Data quality score: Target > 0.85
- Recommendation confidence: Target > 0.70 average
- API uptime: Target 99.9%
- Page load time: Target < 2s
- Error rate: Target < 0.1%

**Business**
- Monthly Recurring Revenue (MRR)
- Net Revenue Retention (NRR): Target > 100%
- Customer Acquisition Cost (CAC): Target < $50 retail, < $500 advisor
- Lifetime Value (LTV): Target > $600 retail, > $6000 advisor
- LTV:CAC ratio: Target > 3:1
- Gross margin: Target > 75%

### 7.3 User Satisfaction

**Net Promoter Score (NPS)**: Target > 50
- Survey quarterly
- Segment by user type
- Follow up with detractors

**Customer Satisfaction (CSAT)**: Target > 4.5/5
- Survey after key interactions
- Track trends over time

**Recommendation Trust Score**: Custom metric
- "I trust MOBU's recommendations" — Target > 80% agree/strongly agree
- Survey monthly

---

## 8. Phase 1 Scope

### 8.1 Phase 1A: Foundation (Months 0-6)

**Markets**
- JSE (Johannesburg) — Primary
- NGX (Nigeria) — Primary

**User Types**
- Retail investors only
- Single portfolio per user

**Features**
- ✅ User registration and authentication
- ✅ Risk profile questionnaire
- ✅ Single portfolio creation
- ✅ Manual transaction entry
- ✅ Basic recommendation engine (valuation + momentum signals)
- ✅ Plain-language explanations
- ✅ Evidence trail visualization (graph)
- ✅ Portfolio dashboard (holdings, performance)
- ✅ Basic compliance (FSCA, SEC Nigeria)
- ✅ Mobile web (responsive)
- ❌ Native mobile app (Phase 1B)
- ❌ Multi-client management (Phase 1B)
- ❌ Advanced risk metrics (Phase 1B)
- ❌ Custom reports (Phase 1B)

**Data Coverage**
- ~500 most liquid instruments (JSE + NGX)
- Daily EOD data
- Quarterly fundamentals
- Major corporate actions

**Target Users**: 1,000 alpha users

### 8.2 Phase 1B: Growth (Months 6-12)

**Markets**
- + EGX (Egypt)
- + NSE (Kenya)
- + GSE (Ghana)

**User Types**
- + Independent financial advisors
- Multi-client management
- Up to 10 portfolios per user

**Features**
- ✅ Native mobile apps (iOS, Android)
- ✅ Advanced risk metrics (VaR, concentration)
- ✅ Performance attribution
- ✅ White-label reports
- ✅ API access (beta)
- ✅ Rebalancing recommendations
- ✅ Tax reporting (ZA, NG)
- ✅ Push notifications
- ✅ Watchlists
- ✅ Multi-language (English, French)
- ❌ Trade execution (Phase 1C)
- ❌ Bank integrations (Phase 2)

**Data Coverage**
- ~2,000 instruments (5 markets)
- Intraday data for top 100 stocks
- Alternative data pilots (news sentiment)

**Target Users**: 10,000 users, 500 advisors

### 8.3 Phase 1C: Institutionalization (Months 12-18)

**Markets**
- + Casablanca Stock Exchange
- + BRVM (West Africa)

**User Types**
- + Institutional asset managers
- Unlimited portfolios
- Team collaboration features

**Features**
- ✅ Trade execution integration (broker APIs)
- ✅ Advanced compliance (custom rules)
- ✅ Regulatory reporting automation
- ✅ Custom report builder
- ✅ Scenario analysis
- ✅ API v2 (public release)
- ✅ Webhooks
- ✅ SSO for institutions
- ✅ Audit log exports
- ✅ Data exports (positions, transactions)

**Data Coverage**
- ~5,000 instruments (7 markets)
- Alternative data (satellite, mobile patterns)

**Target Users**: 50,000 users, 2,000 advisors, 50 institutions

### 8.4 Out of Scope for Phase 1

**Deferred to Phase 2**
- International markets (US, UK, EU, Asia)
- Derivatives and options
- Fixed income beyond bonds
- Alternative investments (PE, real estate)
- Automated portfolio construction (vs. recommendations only)
- Social/copy trading
- Margin trading
- Cryptocurrency

**Never in Scope**
- Investment advice (regulatory licensing required)
- Guaranteed returns
- Proprietary trading
- Market making

---

## 9. Acceptance Criteria

### 9.1 Phase 1A Launch Criteria

**Must Have**
- [ ] 1,000+ alpha users signed up
- [ ] 500+ portfolios created
- [ ] 10,000+ recommendations generated
- [ ] Evidence trail viewed on 60%+ of recommendations
- [ ] 20%+ recommendation acceptance rate
- [ ] 99%+ uptime over 30 days
- [ ] < 0.5% error rate
- [ ] FSCA and SEC Nigeria compliance rules implemented
- [ ] Security audit passed
- [ ] Load test passed (10,000 concurrent users)

**Should Have**
- [ ] NPS > 40
- [ ] 50%+ 30-day retention
- [ ] < 2s page load time (p95)
- [ ] Mobile web fully functional

**Could Have**
- [ ] Press coverage in 3+ African tech publications
- [ ] Partnership with 1+ fintech accelerator

### 9.2 Phase 1B Launch Criteria

**Must Have**
- [ ] 10,000+ total users
- [ ] 500+ advisors managing 5,000+ client portfolios
- [ ] iOS and Android apps in stores
- [ ] 5 African markets covered
- [ ] API documentation complete
- [ ] White-label reports generated
- [ ] Advanced risk metrics accurate (validated against Bloomberg)

**Should Have**
- [ ] NPS > 50
- [ ] 40%+ 90-day retention
- [ ] 10%+ free-to-paid conversion
- [ ] API adopted by 3+ partners

### 9.3 Phase 1C Launch Criteria

**Must Have**
- [ ] 50,000+ total users
- [ ] $100M+ Assets Under Advisement (AUA)
- [ ] 3+ institutional clients signed
- [ ] Trade execution live (1+ broker integrated)
- [ ] All 7 Phase 1 markets covered
- [ ] Public API v2 released
- [ ] Profitability path clear (unit economics validated)

**Should Have**
- [ ] NPS > 60
- [ ] Net Revenue Retention > 100%
- [ ] Recognized by 1+ African regulator as industry example

---

## 10. Open Questions & Decisions Needed

**Product Decisions**
1. Should we allow manual portfolio rebalancing or force users to follow recommendations?
   - **Recommendation**: Allow manual, but make recommendations the default path
   
2. How do we handle illiquid securities (can't execute recommendations)?
   - **Recommendation**: Mark as "research only" with warning, provide liquidity score

3. Should we show recommendations user can't afford?
   - **Recommendation**: Yes, but mark as "goal" or "future consideration"

4. How much historical data do we need before making first recommendation?
   - **Recommendation**: Minimum 90 days price data, 1 year fundamentals

**Business Decisions**
5. What is free vs. paid tier split?
   - **Recommendation**: Free = basic recommendations, 1 portfolio; Paid = unlimited portfolios, advanced analytics
   
6. How do we price advisor tier?
   - **Recommendation**: Per-client pricing ($5/client/month) or flat rate ($99/month unlimited)

7. Do we charge for API access?
   - **Recommendation**: Free tier (1000 calls/day), paid tier (unlimited) at $200/month

**Technical Decisions**
8. Do we need real-time data in Phase 1?
   - **Recommendation**: No, daily EOD sufficient, add real-time in Phase 1B for top stocks

9. How do we handle multi-currency portfolios?
   - **Recommendation**: Display in user's base currency, allow currency drill-down

10. What's our backup plan if Neo4j doesn't scale?
    - **Recommendation**: Have PostgreSQL-only fallback architecture designed

---

## Appendix A: Glossary

**Terms used throughout this PRD**

| Term | Definition |
|------|-----------|
| **AUA** | Assets Under Advisement — value of portfolios on platform |
| **Evidence Trail** | Visual graph showing data sources supporting a recommendation |
| **Conviction Score** | 0-100 scale indicating confidence in recommendation |
| **Quality Score** | 0-1 scale indicating completeness/accuracy of data |
| **Liquidity Score** | Measure of how easily a security can be traded |
| **Compliance Rule** | Regulatory or mandate constraint |
| **Signal** | Data-derived input for recommendation (valuation, momentum, etc.) |
| **Phase 1** | African markets launch (Months 0-18) |
| **Phase 2** | International expansion (Months 18+) |

---

*This PRD is a living document. Version history and change log maintained separately.*

**Next Document**: 05_UI_UX_Design.md — Interface mockups and design system
