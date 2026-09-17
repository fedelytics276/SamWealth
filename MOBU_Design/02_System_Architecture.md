# MOBU Investment Platform
## System Architecture & Technical Design

**Version:** 1.0  
**Date:** September 2026  
**Status:** State-of-the-Art Technical Specification

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Core Architectural Principles](#2-core-architectural-principles)
3. [The Four Foundational Layers](#3-the-four-foundational-layers)
4. [Functional Domains](#4-functional-domains)
5. [Technology Stack](#5-technology-stack)
6. [Data Architecture](#6-data-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Infrastructure Architecture](#8-infrastructure-architecture)
9. [Integration Architecture](#9-integration-architecture)
10. [Scalability & Performance](#10-scalability--performance)

---

## 1. Architecture Overview

### 1.1 Core-Out Architecture Philosophy

MOBU is built **from the inside out**, not the outside in. A shared, single-source core sits beneath every user-facing capability, ensuring all modules read from and write to the same ground truth.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  Web App  │  Mobile App  │  API Gateway  │  Admin Portal        │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│                     FUNCTIONAL DOMAINS                           │
│  Portfolio │ Risk │ Compliance │ Reporting │ Attribution        │
│  Management        Investment  Client      Performance          │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│                   AI / RECOMMENDATION LAYER                      │
│  Signal     │  Scoring  │  Explanation  │  Confidence          │
│  Generation    Engine     Generation      Scoring               │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│                   CORE FOUNDATIONAL LAYERS                       │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Single Security │  │  Single Data     │  │   Single     │ │
│  │     Master       │  │     Plane        │  │  Accounting  │ │
│  │                  │  │                  │  │   Engine     │ │
│  │  Deduplication   │  │  Normalization   │  │  Double-Entry│ │
│  │  & Resolution    │  │  & Storage       │  │   Ledger     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│                      INGESTION LAYER                             │
│  Exchange  │  Corporate  │  Fundamental  │  Alternative         │
│  Feeds       Actions       Data            Data                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Logical Layer Breakdown

| Layer | Responsibility | Key Technologies |
|-------|---------------|------------------|
| **Ingestion** | Connect to data sources, normalize formats | Kafka, Apache NiFi, Python |
| **Core Foundational** | Master data, unified storage, ledger | PostgreSQL, Neo4j, TimescaleDB |
| **AI/Recommendation** | Scoring, ranking, explanation | Python, scikit-learn, LLMs |
| **Functional Domains** | Business logic modules | Microservices, Domain-Driven Design |
| **Presentation** | User interfaces and APIs | React, React Native, GraphQL |

### 1.3 Key Architectural Characteristics

- **Single Source of Truth**: One canonical record for every entity
- **Event-Driven**: Asynchronous communication between services
- **Graph-Native**: Knowledge graph as core data structure
- **API-First**: All functionality exposed via well-defined APIs
- **Cloud-Native**: Containerized, orchestrated, auto-scaling
- **Multi-Tenant**: Secure isolation between users and organizations

---

## 2. Core Architectural Principles

### 2.1 Transparency as Architecture

Transparency is not a feature added at the UI layer — it's embedded in the data model.

**Implementation**:
- Every recommendation MUST cite source data
- All data transformations are logged
- Evidence trails are queryable graph paths
- Audit logs are immutable and versioned

### 2.2 Compliance by Design

Regulatory rules are **data**, not code. This allows:
- Rule changes without code deployment
- Multi-jurisdictional compliance from single codebase
- Audit trail of which rules affected which recommendations
- A/B testing of rule interpretations (in sandbox)

### 2.3 Modularity & Extensibility

Each functional domain is:
- **Independently deployable**: Microservice architecture
- **Loosely coupled**: Event-driven communication
- **Highly cohesive**: Single responsibility per service
- **Versioned APIs**: Backward compatibility guaranteed

### 2.4 Correctness over Speed

For African markets, correctness and auditability trump microsecond latency:
- Strong consistency where it matters (accounting, compliance)
- Eventual consistency where acceptable (analytics, reporting)
- Explicit confidence scoring when data is incomplete
- Graceful degradation over silent failures

---

## 3. The Four Foundational Layers

### 3.1 Single Security Master

**Purpose**: Canonical, deduplicated reference for every investable instrument

**Responsibilities**:
- Unique identification using international standards (ISIN, CFI)
- Mapping to local market identifiers (tickers, codes)
- Issuer information with LEI linkage
- Asset classification (GICS, ICB)
- Lifecycle management (IPO, delisting, corporate actions)

**Data Model**:
```sql
-- Simplified schema
CREATE TABLE instruments (
    id UUID PRIMARY KEY,
    isin VARCHAR(12) UNIQUE NOT NULL,
    cfi_code VARCHAR(6),
    name TEXT NOT NULL,
    asset_class VARCHAR(50),
    currency_code VARCHAR(3),
    issuer_id UUID REFERENCES issuers(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE instrument_identifiers (
    instrument_id UUID REFERENCES instruments(id),
    identifier_type VARCHAR(50), -- 'JSE_CODE', 'NGX_TICKER', etc.
    identifier_value VARCHAR(50),
    market_id UUID REFERENCES markets(id),
    PRIMARY KEY (instrument_id, identifier_type, market_id)
);

CREATE TABLE issuers (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    lei VARCHAR(20) UNIQUE, -- Legal Entity Identifier
    country_code VARCHAR(2),
    sector VARCHAR(50),
    industry VARCHAR(100)
);
```

**Technology**:
- **Primary Store**: PostgreSQL with strict referential integrity
- **Caching**: Redis for high-frequency lookups
- **Change Data Capture**: Debezium for downstream propagation

**Key Operations**:
- `resolveInstrument(isin)`: Get canonical instrument record
- `mapIdentifier(marketCode, localTicker)`: Map local ID to ISIN
- `getInstrumentsByIssuer(issuerId)`: All instruments for an issuer
- `searchInstruments(query)`: Full-text search across instruments

### 3.2 Single Data Plane

**Purpose**: Unified, normalized time-series and reference data

**Responsibilities**:
- Ingest data from multiple exchanges in different formats
- Normalize currencies, timestamps, conventions
- Store pricing, volume, fundamentals, corporate actions
- Serve as single read layer for all downstream modules

**Data Domains**:

1. **Market Data**
   - OHLCV (Open, High, Low, Close, Volume)
   - Intraday ticks (where available)
   - Bid/ask spreads
   - Market depth

2. **Fundamental Data**
   - Financial statements (income, balance sheet, cash flow)
   - Key ratios (P/E, P/B, ROE, etc.)
   - Analyst estimates
   - Earnings announcements

3. **Corporate Actions**
   - Dividends (cash, stock)
   - Splits and reverse splits
   - Rights issues
   - Mergers and acquisitions

4. **Alternative Data**
   - News sentiment
   - Social media signals
   - Satellite imagery (commodities)
   - Mobile data patterns

**Technology**:
- **Time-Series DB**: TimescaleDB (PostgreSQL extension)
- **Blob Storage**: S3-compatible for documents
- **Streaming**: Kafka for real-time ingestion
- **Data Quality**: Great Expectations for validation

**Schema Design**:
```sql
-- Time-series data (hypertable)
CREATE TABLE market_data (
    instrument_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    data_type VARCHAR(20), -- 'price', 'volume', 'fundamental'
    values JSONB, -- flexible schema for different data types
    source VARCHAR(50),
    quality_score DECIMAL(3,2),
    PRIMARY KEY (instrument_id, timestamp, data_type)
);

SELECT create_hypertable('market_data', 'timestamp');

-- Corporate actions
CREATE TABLE corporate_actions (
    id UUID PRIMARY KEY,
    instrument_id UUID REFERENCES instruments(id),
    action_type VARCHAR(50), -- 'dividend', 'split', 'rights'
    ex_date DATE,
    record_date DATE,
    payment_date DATE,
    details JSONB,
    announced_at TIMESTAMP,
    processed BOOLEAN DEFAULT false
);
```

### 3.3 Single Accounting Engine

**Purpose**: One ledger for all positions, transactions, and valuations

**Responsibilities**:
- Double-entry bookkeeping for all transactions
- Position tracking across portfolios
- P&L calculation (realized and unrealized)
- Cash management and reconciliation
- Multi-currency support with explicit FX handling

**Accounting Principles**:
- Every transaction affects at least two accounts
- Debits must equal credits
- Immutable transaction history
- Point-in-time portfolio reconstruction

**Data Model**:
```sql
-- Chart of accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE,
    account_type VARCHAR(20), -- 'asset', 'liability', 'equity', 'income', 'expense'
    parent_account_id UUID REFERENCES accounts(id),
    currency_code VARCHAR(3),
    portfolio_id UUID REFERENCES portfolios(id)
);

-- Immutable journal entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY,
    entry_date DATE NOT NULL,
    posted_at TIMESTAMP NOT NULL,
    description TEXT,
    source_type VARCHAR(50), -- 'trade', 'dividend', 'fee', 'fx'
    source_id UUID,
    status VARCHAR(20) DEFAULT 'posted',
    created_by UUID,
    reversed_by UUID REFERENCES journal_entries(id)
);

-- Double-entry lines
CREATE TABLE journal_lines (
    id UUID PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id),
    account_id UUID REFERENCES accounts(id),
    debit_amount DECIMAL(19,4),
    credit_amount DECIMAL(19,4),
    currency_code VARCHAR(3),
    instrument_id UUID REFERENCES instruments(id),
    quantity DECIMAL(19,6)
);

-- Materialized positions view
CREATE MATERIALIZED VIEW current_positions AS
SELECT 
    account_id,
    instrument_id,
    SUM(quantity) as position_quantity,
    SUM(debit_amount - credit_amount) as cost_basis,
    MAX(posted_at) as last_update
FROM journal_lines jl
JOIN journal_entries je ON je.id = jl.journal_entry_id
WHERE je.status = 'posted' AND je.reversed_by IS NULL
GROUP BY account_id, instrument_id
HAVING SUM(quantity) != 0;
```

**Key Operations**:
- `bookTransaction(trade)`: Create journal entries for a trade
- `getPositions(portfolioId, asOfDate)`: Point-in-time positions
- `calculatePnL(portfolioId, startDate, endDate)`: P&L report
- `reconcile(portfolioId, externalStatement)`: Reconciliation

**Technology**:
- **Primary Store**: PostgreSQL with strict ACID guarantees
- **Computation**: Python for complex P&L calculations
- **Reporting**: Materialized views, refreshed on schedule

### 3.4 AI / Recommendation Layer

**Purpose**: Explainable investment intelligence sitting above verified data

**Architecture**:

```
┌──────────────────────────────────────────────────────┐
│            Recommendation Pipeline                    │
│                                                       │
│  1. Signal Generation                                │
│     ├─ Valuation Signals (P/E, P/B, DCF)            │
│     ├─ Momentum Signals (Price trends, volume)       │
│     ├─ Quality Signals (ROE, debt ratios)           │
│     └─ Sentiment Signals (News, social)             │
│                    ↓                                 │
│  2. Universe Filtering                               │
│     ├─ Liquidity Screens                            │
│     ├─ Data Quality Gates                           │
│     └─ Mandate Constraints                          │
│                    ↓                                 │
│  3. Compliance Checking                              │
│     ├─ Regulatory Rules (per jurisdiction)          │
│     ├─ Portfolio Limits (concentration, exposure)    │
│     └─ Suitability Rules                            │
│                    ↓                                 │
│  4. Composite Scoring                                │
│     ├─ Weighted Signal Aggregation                  │
│     ├─ Confidence Adjustment                         │
│     └─ Rank Ordering                                │
│                    ↓                                 │
│  5. Explanation Generation                           │
│     ├─ Graph Traversal (evidence collection)        │
│     ├─ LLM Synthesis (natural language)             │
│     └─ Visualization (charts, tables)               │
│                    ↓                                 │
│  6. Recommendation Output                            │
│     ├─ Action (BUY/SELL/HOLD)                       │
│     ├─ Conviction Score                              │
│     ├─ Evidence Trail                                │
│     └─ Plain-Language Rationale                     │
└──────────────────────────────────────────────────────┘
```

**Key Principle**: No black-box models. Every step is inspectable.

**Signal Examples**:

```python
# Valuation Signal - Price-to-Earnings Ratio
def calculate_pe_signal(instrument_id: UUID, as_of_date: date) -> Signal:
    """
    Calculate P/E signal with full transparency.
    """
    # Get current price from Data Plane
    price = data_plane.get_latest_price(instrument_id, as_of_date)
    
    # Get earnings from fundamentals
    earnings = data_plane.get_fundamental(
        instrument_id, 
        'earnings_per_share', 
        period='ttm',  # Trailing twelve months
        as_of_date=as_of_date
    )
    
    if earnings <= 0:
        return Signal(
            type='valuation_pe',
            value=None,
            confidence=0,
            reason='Negative or zero earnings'
        )
    
    pe_ratio = price / earnings
    
    # Get sector median for comparison
    sector = security_master.get_sector(instrument_id)
    sector_median_pe = data_plane.get_sector_metric(
        sector, 
        'median_pe', 
        as_of_date
    )
    
    # Relative valuation score
    if pe_ratio < sector_median_pe * 0.7:
        score = 1.0  # Undervalued
    elif pe_ratio > sector_median_pe * 1.3:
        score = -1.0  # Overvalued
    else:
        score = 0.0  # Fairly valued
    
    return Signal(
        type='valuation_pe',
        value=score,
        confidence=0.8,
        evidence={
            'price': price,
            'earnings_per_share': earnings,
            'pe_ratio': pe_ratio,
            'sector': sector,
            'sector_median_pe': sector_median_pe
        },
        computed_at=datetime.now()
    )
```

**Explainability Mechanism**:

Every recommendation is stored in the knowledge graph with explicit edges:

```cypher
// Example recommendation in graph
CREATE (r:Recommendation {
    id: 'rec_123',
    action: 'BUY',
    instrument_isin: 'ZAE000015889', // Example: Sasol
    conviction: 0.72,
    generated_at: datetime()
})

// Link to signals
CREATE (r)-[:CITES {weight: 0.4}]->(s1:Signal {type: 'valuation_pe', value: 0.8})
CREATE (r)-[:CITES {weight: 0.3}]->(s2:Signal {type: 'momentum', value: 0.6})
CREATE (r)-[:CITES {weight: 0.3}]->(s3:Signal {type: 'quality', value: 0.5})

// Link signals to data
CREATE (s1)-[:DERIVED_FROM]->(i:Instrument {isin: 'ZAE000015889'})

// Link to compliance
CREATE (r)-[:CHECKED_AGAINST {result: 'pass'}]->(rule:ComplianceRule {
    id: 'fsca_concentration_limit',
    regulator: 'FSCA'
})
```

To explain a recommendation:
```cypher
// Get full evidence trail
MATCH (r:Recommendation {id: 'rec_123'})
MATCH (r)-[c:CITES]->(s:Signal)-[:DERIVED_FROM]->(i:Instrument)
MATCH (r)-[:CHECKED_AGAINST]->(rule:ComplianceRule)-[:ENFORCED_BY]->(reg:Regulator)
RETURN r, s, c.weight, i, rule, reg
```

This returns the complete, queryable evidence trail.

**LLM Explanation Generation**:

```python
def generate_explanation(recommendation_id: UUID) -> str:
    """
    Generate natural language explanation from graph evidence.
    """
    # Traverse graph to get evidence
    evidence = graph.query("""
        MATCH (r:Recommendation {id: $rec_id})
        MATCH (r)-[c:CITES]->(s:Signal)-[:DERIVED_FROM]->(i:Instrument)
        MATCH (r)-[:CHECKED_AGAINST]->(rule:ComplianceRule)
        RETURN r, collect({signal: s, weight: c.weight}) as signals, 
               collect(rule) as rules, i
    """, rec_id=recommendation_id)
    
    # Structure prompt for LLM
    prompt = f"""
    Generate a clear, jargon-free explanation for why we recommend {evidence.action} 
    for {evidence.instrument.name}.
    
    Evidence:
    {json.dumps(evidence.signals, indent=2)}
    
    Compliance checks passed:
    {json.dumps(evidence.rules, indent=2)}
    
    Write for a retail investor. Be specific about numbers and reasoning.
    Do not invent information not in the evidence.
    """
    
    # Call LLM with grounded prompt
    explanation = llm.generate(
        prompt,
        max_tokens=300,
        temperature=0.3  # Low temperature for factual output
    )
    
    # Store explanation with linkage to evidence
    store_explanation(recommendation_id, explanation, evidence)
    
    return explanation
```

---

## 4. Functional Domains

Each domain is a microservice consuming the four foundational layers.

### 4.1 Portfolio Management

**Responsibilities**:
- Model portfolio construction
- Client portfolio tracking
- Rebalancing recommendations
- Asset allocation optimization

**Key APIs**:
- `POST /portfolios` - Create new portfolio
- `GET /portfolios/{id}` - Get portfolio details
- `GET /portfolios/{id}/holdings` - Current positions
- `POST /portfolios/{id}/rebalance` - Get rebalancing recommendations

**Technology**: Python (FastAPI), PostgreSQL

### 4.2 Risk Management

**Responsibilities**:
- VaR (Value at Risk) calculation
- Scenario analysis
- Concentration risk monitoring
- Currency risk assessment

**Key APIs**:
- `GET /portfolios/{id}/risk` - Risk metrics
- `POST /portfolios/{id}/risk/scenarios` - Scenario analysis
- `GET /portfolios/{id}/risk/exposures` - Risk exposures breakdown

**Technology**: Python (NumPy, SciPy), TimescaleDB

### 4.3 Investment Compliance

**Responsibilities**:
- Pre-trade compliance checks
- Post-trade monitoring
- Regulatory reporting
- Mandate adherence

**Key APIs**:
- `POST /compliance/check` - Check if trade is compliant
- `GET /compliance/rules` - List active rules
- `GET /portfolios/{id}/compliance-status` - Compliance dashboard

**Technology**: Rule engine (Python-based), PostgreSQL

### 4.4 Client Reporting

**Responsibilities**:
- Performance reports
- Holdings statements
- Tax reporting
- Recommendation explanations

**Key APIs**:
- `GET /reports/performance/{portfolio_id}` - Performance report
- `GET /reports/holdings/{portfolio_id}` - Holdings statement
- `GET /reports/tax/{portfolio_id}` - Tax report

**Technology**: Python (Jinja2 templates), PDF generation (WeasyPrint)

### 4.5 Data Management

**Responsibilities**:
- Exchange feed ingestion
- Data quality monitoring
- Reference data maintenance
- Corporate actions processing

**Key APIs**:
- `POST /data/instruments` - Add new instrument
- `GET /data/quality-metrics` - Data quality dashboard
- `POST /data/corporate-actions` - Process corporate action

**Technology**: Apache NiFi (ingestion), Python, Kafka

### 4.6 Performance Attribution

**Responsibilities**:
- Return attribution analysis
- Factor decomposition
- Benchmark comparison
- Manager skill analysis

**Technology**: Python (Pandas), PostgreSQL

### 4.7 Regulatory Reporting

**Responsibilities**:
- Generate regulatory filings
- Submit reports to authorities
- Maintain filing history

**Technology**: Python, regulatory APIs

### 4.8 Order/Deal Execution *(Phase 1B)*

**Responsibilities**:
- Order routing
- Broker connectivity
- Execution confirmation
- Best execution monitoring

**Technology**: FIX protocol, broker APIs

### 4.9 Investment Operations *(Phase 2)*

**Responsibilities**:
- Trade settlement
- Reconciliation
- Corporate action processing
- Cash management

**Technology**: ISO 20022, SWIFT integration

---

## 5. Technology Stack

### 5.1 Core Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Languages** | Python, TypeScript | Python for data/AI, TS for web |
| **Primary Database** | PostgreSQL 15+ | ACID, rich ecosystem, TimescaleDB |
| **Graph Database** | Neo4j 5.x | Property graph, Cypher, APOC |
| **Time-Series** | TimescaleDB | PostgreSQL extension, SQL familiar |
| **Cache** | Redis 7.x | Fast lookups, pub/sub |
| **Message Queue** | Apache Kafka | Event streaming, replay |
| **API Layer** | GraphQL (Apollo) | Flexible queries, type-safe |
| **Web Frontend** | React 18 + Next.js | SSR, performance, ecosystem |
| **Mobile** | React Native | Code sharing, native feel |
| **AI/ML** | scikit-learn, PyTorch | Standard tools, LLM integration |
| **Infrastructure** | Kubernetes, Terraform | Cloud-native, IaC |
| **Cloud Provider** | Azure (primary) | African region availability |
| **CI/CD** | GitHub Actions | Integrated, flexible |
| **Monitoring** | Azure Monitor, Datadog | APM, logs, metrics |

### 5.2 Detailed Technology Justifications

**PostgreSQL** (Primary Database)
- ✅ ACID compliance critical for accounting
- ✅ Rich extension ecosystem (TimescaleDB, PostGIS)
- ✅ Mature replication and backup
- ✅ Strong typing and constraints
- ✅ JSON support for flexible schemas

**Neo4j** (Graph Database)
- ✅ Native property graph
- ✅ Cypher query language (expressive, readable)
- ✅ APOC library for graph algorithms
- ✅ Excellent visualization tools
- ✅ Graph traversal performance

**Kafka** (Event Streaming)
- ✅ High-throughput, low-latency
- ✅ Event replay for debugging
- ✅ Decouples producers/consumers
- ✅ Battle-tested at scale

**GraphQL** (API Layer)
- ✅ Clients request exactly what they need
- ✅ Strong typing with schema
- ✅ Single endpoint (simplified)
- ✅ Real-time subscriptions
- ✅ Rich tooling ecosystem

**React + Next.js** (Web)
- ✅ Component reusability
- ✅ Server-side rendering (SEO, performance)
- ✅ Large talent pool
- ✅ Rich UI library ecosystem

**React Native** (Mobile)
- ✅ Code sharing with web (logic layer)
- ✅ Native performance
- ✅ Single team for both platforms
- ✅ Hot reload for fast iteration

---

## 6. Data Architecture

### 6.1 Knowledge Graph Schema

The platform's data model is implemented as a property graph:

**Node Labels**:
- `Instrument`, `Issuer`, `Market`, `Portfolio`, `Position`
- `Transaction`, `CorporateAction`, `Benchmark`, `RiskFactor`
- `Signal`, `Recommendation`, `ComplianceRule`, `Regulator`

**Relationship Types**:
- `ISSUED_BY`, `LISTED_ON`, `EXPOSED_TO`, `HOLDS`, `OF`
- `AFFECTS`, `INVOLVES`, `APPLIES_TO`, `DERIVED_FROM`
- `CITES`, `CONCERNS`, `GENERATED_FOR`, `CHECKED_AGAINST`
- `ENFORCED_BY`, `GOVERNS`, `BENCHMARKED_TO`

See **03_Data_Model.md** for complete graph schema.

### 6.2 Data Flow Architecture

```
Exchange Feeds → Kafka → Ingestion Service → Data Plane → Graph + PostgreSQL
                                                  ↓
                                           AI Layer reads
                                                  ↓
                                         Recommendation written
                                                  ↓
                                         Accounting Engine books
                                                  ↓
                                         APIs serve to clients
```

### 6.3 Data Quality Framework

Every data point has:
- **Source**: Where it came from
- **Timestamp**: When it was observed
- **Quality Score**: 0-1 confidence rating
- **Lineage**: Transformation history

**Data Quality Rules**:
```python
# Example using Great Expectations
import great_expectations as ge

# Price data quality suite
price_expectations = ge.dataset.PandasDataset({
    'instrument_id': [...],
    'timestamp': [...],
    'close_price': [...]
})

price_expectations.expect_column_values_to_not_be_null('close_price')
price_expectations.expect_column_values_to_be_between('close_price', min_value=0)
price_expectations.expect_column_values_to_be_unique(['instrument_id', 'timestamp'])

# Run validation
results = price_expectations.validate()
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────────────────────┐
│  Application Layer Security                 │
│  - OWASP Top 10 coverage                   │
│  - Input validation                         │
│  - Output encoding                          │
└─────────────────────────────────────────────┘
         ▲
┌─────────────────────────────────────────────┐
│  API Security                               │
│  - OAuth 2.0 + OIDC                        │
│  - JWT tokens (short-lived)                │
│  - Rate limiting                            │
│  - API key management                       │
└─────────────────────────────────────────────┘
         ▲
┌─────────────────────────────────────────────┐
│  Network Security                           │
│  - WAF (Web Application Firewall)          │
│  - DDoS protection                          │
│  - TLS 1.3 only                            │
│  - Private subnets for databases           │
└─────────────────────────────────────────────┘
         ▲
┌─────────────────────────────────────────────┐
│  Data Security                              │
│  - Encryption at rest (AES-256)            │
│  - Encryption in transit                    │
│  - Field-level encryption (PII)            │
│  - Key rotation                             │
└─────────────────────────────────────────────┘
         ▲
┌─────────────────────────────────────────────┐
│  Infrastructure Security                    │
│  - RBAC (Role-Based Access Control)        │
│  - Least privilege principle               │
│  - Audit logging                            │
│  - Secrets management (Vault)              │
└─────────────────────────────────────────────┘
```

### 7.2 Authentication & Authorization

**Authentication**: OAuth 2.0 with OpenID Connect
- Identity provider: Auth0 or Azure AD B2C
- MFA enforced for advisors and institutions
- Biometric support for mobile

**Authorization**: RBAC + ABAC (Attribute-Based)
```typescript
// Permission model
interface User {
  id: string;
  roles: Role[];
  attributes: UserAttributes;
}

interface Role {
  name: string;
  permissions: Permission[];
}

type Permission = 
  | 'portfolios:read'
  | 'portfolios:write'
  | 'trades:execute'
  | 'compliance:override'
  | 'admin:manage';

// Authorization check
function canAccess(user: User, resource: Resource, action: Action): boolean {
  // Check role-based permissions
  const hasRolePermission = user.roles.some(role =>
    role.permissions.includes(`${resource}:${action}`)
  );
  
  // Check attribute-based rules
  const meetsAttributeRequirements = checkAttributePolicy(
    user.attributes,
    resource,
    action
  );
  
  return hasRolePermission && meetsAttributeRequirements;
}
```

### 7.3 Data Privacy & Compliance

**GDPR & POPIA Compliance**:
- Right to access (data export API)
- Right to erasure (anonymization, not deletion of financial records)
- Data minimization
- Purpose limitation
- Consent management

**PII Protection**:
- Field-level encryption for sensitive data
- Tokenization of account numbers
- Pseudonymization in analytics
- Access logging for all PII reads

### 7.4 Audit Trail

Every action is logged immutably:
```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    request_payload JSONB,
    response_status INTEGER,
    changes JSONB, -- Before/after for mutations
    CONSTRAINT no_updates CHECK (false) -- Immutable
) PARTITION BY RANGE (timestamp);

-- Partitions by month for efficient querying and archival
```

---

## 8. Infrastructure Architecture

### 8.1 Cloud Architecture (Azure)

```
┌─────────────────────────────────────────────────────────┐
│              Azure DNS / Traffic Manager                │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Azure CDN + WAF                            │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           Azure Application Gateway                     │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           AKS (Azure Kubernetes Service)                │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐ │
│  │  API    │  │Portfolio│  │  Risk   │  │Compliance│ │
│  │Gateway  │  │ Service │  │ Service │  │ Service  │ │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘ │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │  AI     │  │ Data    │  │ Reporting│              │
│  │ Engine  │  │ Ingest  │  │ Service  │              │
│  └─────────┘  └─────────┘  └─────────┘               │
└─────────────────────────────────────────────────────────┘
          ▼                ▼               ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│   Azure DB   │  │ Event Hubs  │  │   Neo4j      │
│(PostgreSQL)  │  │  (Kafka)    │  │  (Azure VM)  │
└──────────────┘  └─────────────┘  └──────────────┘
          ▼                           
┌────────────────────────────────────────────────┐
│          Azure Blob Storage (Data Lake)        │
│  - Raw data  - Backups  - Documents           │
└────────────────────────────────────────────────┘
```

### 8.2 Kubernetes Architecture

**Namespaces**:
- `production` - Live services
- `staging` - Pre-production testing
- `development` - Dev environment
- `monitoring` - Observability stack

**Deployment Pattern**: Blue-Green deployments
- Zero-downtime updates
- Easy rollback
- A/B testing capable

**Resource Management**:
```yaml
# Example deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-service
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: portfolio-service
        image: mobu/portfolio-service:v1.2.3
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
```

### 8.3 Data Residency & Regional Architecture

**African Region Strategy**:
- Primary: AWS Africa (Cape Town) region
- DR: AWS Europe (Frankfurt) with data replication
- Edge: CloudFront PoPs across Africa

**Compliance Considerations**:
- South Africa: POPIA compliance, data can be in Cape Town
- Nigeria: Exploring local data center requirements
- Kenya: CMA guidelines on data sovereignty
- Egypt: Data residency requirements

**Multi-Region Setup** (Phase 2):
- Active-Active for read workloads
- Active-Passive for write workloads (accounting)
- Cross-region replication for disaster recovery

### 8.4 Disaster Recovery

**RPO (Recovery Point Objective)**: 15 minutes
**RTO (Recovery Time Objective)**: 1 hour

**Backup Strategy**:
- Continuous: PostgreSQL streaming replication
- Hourly: S3 snapshots
- Daily: Full backup to separate region
- Weekly: Disaster recovery drill

**Failure Scenarios**:
| Scenario | Detection | Response | RTO |
|----------|-----------|----------|-----|
| Pod crash | Kubernetes | Auto-restart | 30s |
| Node failure | Kubernetes | Reschedule pods | 5min |
| AZ failure | Health checks | Failover to other AZ | 15min |
| Region failure | Active monitoring | Failover to DR region | 1hr |

---

## 9. Integration Architecture

### 9.1 Exchange Integrations

**Integration Types**:
1. **Real-time Market Data**: WebSocket connections
2. **End-of-Day Data**: Batch file downloads (FTP/SFTP)
3. **Corporate Actions**: API or email notifications
4. **Reference Data**: Daily synchronization

**Exchange-Specific Implementations**:

**JSE (Johannesburg Stock Exchange)**:
- **Data**: INET trading system feeds
- **Format**: FIX protocol or proprietary
- **Latency**: < 1 second for market data

**NGX (Nigerian Exchange)**:
- **Data**: X-Gen trading platform
- **Format**: CSV files, API (under development)
- **Latency**: End-of-day batch primarily

**EGX (Egyptian Exchange)**:
- **Data**: NILEX platform
- **Format**: Excel files, proprietary API
- **Challenges**: Limited real-time access

**Implementation Pattern**:
```python
# Exchange adapter interface
class ExchangeAdapter(ABC):
    @abstractmethod
    async def connect(self) -> None:
        """Establish connection to exchange"""
        
    @abstractmethod
    async def subscribe_market_data(
        self, 
        instruments: List[str]
    ) -> AsyncIterator[MarketDataPoint]:
        """Stream market data for instruments"""
        
    @abstractmethod
    async def get_eod_data(self, trade_date: date) -> pd.DataFrame:
        """Fetch end-of-day data"""
        
    @abstractmethod
    async def get_corporate_actions(
        self, 
        start_date: date,
        end_date: date
    ) -> List[CorporateAction]:
        """Fetch corporate actions"""

# JSE implementation
class JSEAdapter(ExchangeAdapter):
    def __init__(self, credentials: Credentials):
        self.client = JSEAPIClient(credentials)
        
    async def subscribe_market_data(
        self, 
        instruments: List[str]
    ) -> AsyncIterator[MarketDataPoint]:
        async with self.client.websocket() as ws:
            await ws.send({"action": "subscribe", "symbols": instruments})
            async for message in ws:
                yield self._parse_market_data(message)
```

### 9.2 Third-Party Data Providers

**Fundamental Data**:
- Primary: Bloomberg (for African coverage)
- Alternative: Refinitiv, S&P Capital IQ
- Local: African Markets (Nigeria-focused)

**News & Sentiment**:
- News: Reuters, local news aggregators
- Social: Twitter API, Reddit (where relevant)

**Alternative Data** (Phase 2):
- Satellite imagery: Orbital Insight
- Mobile data: Safaricom API (Kenya)

### 9.3 Regulatory Integrations

**Reporting Submissions**:
- South Africa: FSCA portal integration
- Nigeria: SEC Nigeria e-filing system
- Kenya: CMA reporting system

**Implementation**:
```python
# Regulatory reporter
class FSCAReporter:
    async def submit_client_money_report(
        self,
        report_date: date,
        data: ClientMoneyReport
    ) -> SubmissionReceipt:
        # Generate XML in required format
        xml_payload = self._generate_xml(data)
        
        # Digital signature
        signed_payload = self._sign_document(xml_payload)
        
        # Submit via SFTP or API
        receipt = await self.fsca_client.submit(
            report_type='CLIENT_MONEY',
            payload=signed_payload
        )
        
        # Store receipt
        await self.store_submission(receipt)
        
        return receipt
```

### 9.4 Broker Integrations (Phase 1B)

**FIX Protocol** for order routing:
```python
# FIX session configuration
fix_config = {
    'BeginString': 'FIX.4.4',
    'SenderCompID': 'MOBU',
    'TargetCompID': 'BROKER_ABC',
    'HeartBtInt': 30,
    'ReconnectInterval': 30
}

# Order submission
def send_order(order: Order) -> ExecutionReport:
    fix_message = {
        '35': 'D',  # NewOrderSingle
        '11': order.client_order_id,
        '55': order.symbol,
        '54': '1' if order.side == 'BUY' else '2',
        '38': str(order.quantity),
        '40': '2',  # Limit order
        '44': str(order.limit_price),
        '59': '0'   # Day order
    }
    
    return fix_session.send_and_wait(fix_message)
```

---

## 10. Scalability & Performance

### 10.1 Scalability Targets

| Metric | Phase 1 Target | Phase 2 Target |
|--------|---------------|----------------|
| Concurrent Users | 10,000 | 100,000 |
| Portfolios | 50,000 | 500,000 |
| Instruments | 5,000 (African) | 50,000 (Global) |
| Daily Recommendations | 100,000 | 1,000,000 |
| API Requests/sec | 1,000 | 10,000 |
| Data Points/day | 10M | 100M |

### 10.2 Performance Optimization Strategies

**Database**:
- Read replicas for query workloads
- Connection pooling (PgBouncer)
- Query optimization (EXPLAIN ANALYZE)
- Materialized views for complex reports
- Partitioning for large tables

**Caching**:
- Redis for hot data (prices, user sessions)
- CDN for static assets
- API response caching (GraphQL automatic persistence)
- Browser caching with ETags

**Asynchronous Processing**:
- Celery for background tasks
- Kafka for event-driven workflows
- Batch processing for non-urgent operations

**Example - Caching Strategy**:
```python
from redis import Redis
from functools import wraps

redis = Redis(host='redis.mobu.internal')

def cached(ttl: int = 300):
    """Cache decorator with TTL"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{func.__name__}:{hash((args, frozenset(kwargs)))}"
            
            # Try cache first
            cached_value = redis.get(cache_key)
            if cached_value:
                return json.loads(cached_value)
            
            # Cache miss - compute
            result = await func(*args, **kwargs)
            
            # Store in cache
            redis.setex(cache_key, ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator

@cached(ttl=60)
async def get_market_data(instrument_id: UUID) -> Dict:
    # This will be cached for 60 seconds
    return await data_plane.get_latest(instrument_id)
```

### 10.3 Monitoring & Observability

**Metrics** (Datadog):
- Application metrics (requests, latency, errors)
- Business metrics (recommendations generated, trades executed)
- Infrastructure metrics (CPU, memory, disk, network)
- Custom metrics (data quality scores, compliance pass rates)

**Logging** (Structured JSON):
```python
import structlog

logger = structlog.get_logger()

logger.info(
    "recommendation_generated",
    recommendation_id=rec_id,
    instrument_isin=isin,
    action="BUY",
    conviction=0.72,
    user_id=user_id,
    latency_ms=processing_time
)
```

**Tracing** (OpenTelemetry):
- Distributed tracing across microservices
- Request flow visualization
- Performance bottleneck identification

**Alerting**:
- PagerDuty for critical issues
- Slack for warnings
- Email for daily summaries

---

## Conclusion

This architecture provides:
- ✅ **Transparency**: Graph-native evidence trails
- ✅ **Correctness**: ACID compliance where it matters
- ✅ **Scalability**: Cloud-native, horizontally scalable
- ✅ **Extensibility**: Microservices, event-driven
- ✅ **Compliance**: Built-in, not bolted on
- ✅ **Auditability**: Immutable logs, versioned recommendations

The architecture is specifically designed for African markets in Phase 1 while being extensible to international markets in Phase 2 — without requiring fundamental redesign.

---

*Next: 03_Data_Model.md — Complete knowledge graph schema and ontology*


---

## 11. dbt Integration for Data Lineage & Quality

### 11.1 Overview

**Status**: ✅ Integrated (v1.8.0)  
**Location**: `/mobu_dbt/`  
**Purpose**: Enhanced data lineage, transformation management, and quality validation

dbt (data build tool) provides:
- **Transparent Data Lineage**: Track data from raw feeds → dashboard metrics
- **SQL-Based Transformations**: Version-controlled, tested transformations
- **Quality Validation**: Automated tests for 4 AI Quality Criteria
- **Documentation**: Auto-generated docs with interactive lineage graphs

### 11.2 Architecture Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL DATA SOURCES                         │
│  Bloomberg │ Refinitiv │ Binance │ Ethereum │ News APIs │ FRED  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATA FEED AGENT (Python)                       │
│  • Fetch from APIs          • Parse & validate                   │
│  • Type checking            • Write to raw_data schema           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RAW DATA LAYER (PostgreSQL)                     │
│  Schema: raw_data                                                │
│  • price_data_raw           • onchain_data_raw                   │
│  • news_data_raw            • macro_data_raw                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼ [dbt STAGING LAYER - Views]
┌─────────────────────────────────────────────────────────────────┐
│                    STAGING LAYER (PostgreSQL)                    │
│  Schema: staging                                                 │
│  ✓ Validate schema          ✓ Standardize formats               │
│  ✓ Remove duplicates        ✓ Quality score filtering           │
│  • stg_price_feeds (≥0.95 quality)                               │
│  • stg_onchain_feeds (≥0.90 quality)                             │
│  • stg_news_feeds (≥0.70 confidence)                             │
│  • stg_macro_feeds (≥0.98 quality)                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼ [dbt INTERMEDIATE LAYER - Ephemeral]
┌─────────────────────────────────────────────────────────────────┐
│                  INTERMEDIATE LAYER (PostgreSQL)                 │
│  Schema: intermediate                                            │
│  ⚡ Metric calculations      ⚡ Business logic                    │
│  • int_accuracy_metrics     → Criterion 1: ≥99.95% accuracy      │
│  • int_reliability_metrics  → Criterion 2: ≥99.9% uptime         │
│  • int_sharpe_ratio         → Criterion 3: Sharpe ≥1.5           │
│  • int_learning_metrics     → Criterion 4: Self-improving        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼ [dbt MARTS LAYER - Tables]
┌─────────────────────────────────────────────────────────────────┐
│                     MARTS LAYER (PostgreSQL)                     │
│  Schema: marts                                                   │
│  📊 Analytics-ready         📊 Optimized for queries             │
│  • mart_quality_dashboard   → Powers MVP quality badges          │
│  • mart_portfolio_performance                                    │
│  • mart_recommendations                                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                MOBU MVP DASHBOARD (Next.js)                      │
│  🎯 4 Quality Metric Badges  🎯 Evidence Graphs                  │
│  🎯 Compliance Reports       🎯 Portfolio Analytics              │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 dbt Models Hierarchy

#### Staging Models (Layer 1: Raw → Validated)
| Model | Purpose | Quality Threshold |
|-------|---------|-------------------|
| `stg_price_feeds` | Validate price data from Bloomberg, Refinitiv, exchanges | ≥95% quality score |
| `stg_onchain_feeds` | Validate blockchain data (wallet flows, DeFi events) | ≥90% quality score |
| `stg_news_feeds` | Validate news + sentiment data | ≥70% confidence |
| `stg_macro_feeds` | Validate economic indicators (FRED, BLS, ECB) | ≥98% quality score |

#### Intermediate Models (Layer 2: Validated → Calculated)
| Model | Purpose | AI Criterion |
|-------|---------|--------------|
| `int_accuracy_metrics` | Calculate prediction accuracy rates | Criterion 1: ≥99.95% |
| `int_reliability_metrics` | Calculate system uptime rates | Criterion 2: ≥99.9% |
| `int_sharpe_ratio` | Calculate risk-adjusted returns | Criterion 3: Sharpe ≥1.5 |
| `int_learning_metrics` | Track model improvements + feedback | Criterion 4: Self-improving |

#### Marts Models (Layer 3: Calculated → Aggregated)
| Model | Purpose | Consumers |
|-------|---------|-----------|
| `mart_quality_dashboard` | Aggregate 4 quality criteria + compliance status | MVP dashboard API |
| `mart_portfolio_performance` | Portfolio analytics and metrics | Portfolio views |
| `mart_recommendations` | Recommendation outcomes and evidence | Evidence trail pages |

### 11.4 Data Lineage Capabilities

#### Column-Level Lineage
dbt tracks which source columns feed into each downstream metric:
```
raw_data.price_data_raw.close_price
  ↓
staging.stg_price_feeds.close_price (validated)
  ↓
intermediate.int_portfolio_returns.daily_return (calculated)
  ↓
intermediate.int_sharpe_ratio.sharpe_30d (risk-adjusted)
  ↓
marts.mart_quality_dashboard.criterion_3_value (displayed)
```

#### Documentation & Visualization
```bash
# Generate interactive lineage graph
dbt docs generate
dbt docs serve  # Opens http://localhost:8080

# Features:
# - Click any model to see SQL code
# - View column-level dependencies
# - Trace data from source to dashboard
# - See test coverage per model
```

### 11.5 Quality Validation Framework

#### Built-in Tests (schema.yml)
```yaml
columns:
  - name: close_price
    tests:
      - not_null                    # No missing prices
      - dbt_utils.accepted_range:   # Positive prices only
          min_value: 0
          inclusive: false
          
  - name: data_quality_score
    tests:
      - not_null
      - dbt_utils.accepted_range:   # Between 0 and 1
          min_value: 0.0
          max_value: 1.0
```

#### Custom Tests (tests/)
```sql
-- tests/assert_accuracy_threshold.sql
-- Fails if accuracy drops below 99.95%
select *
from {{ ref('int_accuracy_metrics') }}
where accuracy_rate < {{ var('accuracy_threshold') }}
```

### 11.6 Integration Points

#### 1. Data Feed Agent → Raw Data
```python
# data_feed_agent.py
import psycopg2

conn = psycopg2.connect(dbname="mobu_dev", schema="raw_data")
cursor = conn.cursor()

# Insert price data
cursor.execute("""
    INSERT INTO raw_data.price_data_raw 
    (feed_id, source_name, asset_id, close_price, data_quality_score, ...)
    VALUES (%s, %s, %s, %s, %s, ...)
""", (uuid4(), 'Bloomberg', 'AAPL', 175.50, 0.98, ...))

conn.commit()
```

#### 2. dbt Scheduled Runs
```bash
# Cron: Every hour at minute 5
5 * * * * cd /path/to/mobu_dbt && dbt run --select tag:staging tag:marts

# Azure Data Factory: 
# - Trigger: Time-based (hourly)
# - Activity: Execute dbt CLI command
# - Alert: On failure, send notification
```

#### 3. MVP Dashboard → Marts
```typescript
// pages/api/quality-metrics.ts
import { Pool } from 'pg';

const pool = new Pool({ 
  host: 'localhost',
  database: 'mobu_dev',
  user: 'mobu_user',
  password: process.env.MOBU_DB_PASSWORD
});

export default async function handler(req, res) {
  const result = await pool.query(`
    SELECT 
      criterion_1_name, criterion_1_value, criterion_1_compliant,
      criterion_2_name, criterion_2_value, criterion_2_compliant,
      criterion_3_name, criterion_3_value, criterion_3_compliant,
      criterion_4_name, criterion_4_value, criterion_4_compliant,
      overall_compliant
    FROM analytics.mart_quality_dashboard
    ORDER BY dashboard_updated_at DESC
    LIMIT 1
  `);
  
  res.status(200).json(result.rows[0]);
}
```

### 11.7 Performance & Scalability

#### Materialization Strategy
| Layer | Materialization | Rationale |
|-------|-----------------|-----------|
| Staging | **View** | Always fresh, lightweight validation |
| Intermediate | **Ephemeral** | Not persisted, recomputed when needed |
| Marts | **Table** | Persisted, indexed for fast queries |

#### Incremental Models (Future)
```sql
-- models/staging/stg_price_feeds_incremental.sql
{{ config(
    materialized='incremental',
    unique_key='feed_id'
) }}

select * from {{ source('raw_feeds', 'price_data_raw') }}

{% if is_incremental() %}
    -- Only process new records
    where ingested_at > (select max(ingested_at) from {{ this }})
{% endif %}
```

#### Parallel Execution
```yaml
# dbt_project.yml
# Configure threads for parallel model execution
threads: 8  # Run up to 8 models concurrently
```

### 11.8 Alignment with Strategy.yaml

dbt variables are synchronized with `strategy.yaml` hot-reload config:

```yaml
# dbt_project.yml
vars:
  accuracy_threshold: 0.9995      # 99.95% from strategy.yaml
  reliability_threshold: 0.999    # 99.9% from strategy.yaml
  sharpe_threshold: 1.5           # From strategy.yaml
  lookback_days: 90               # From strategy.yaml
  forecast_days: 30               # From strategy.yaml
```

When strategy.yaml changes, update dbt vars and rerun models.

### 11.9 Compliance & Audit Benefits

#### For Regulators
- **Full Lineage**: Trace any metric back to raw source data
- **Immutable Transformations**: SQL logic is version-controlled in Git
- **Test Coverage**: 100+ automated data quality tests
- **Audit Logs**: dbt run metadata (timestamp, invocation_id, user)

#### For Investors
- **Transparency**: View lineage graphs showing data provenance
- **Reproducibility**: Rerun any transformation with same results
- **Quality Proof**: Show test results for 4 AI Quality Criteria
- **Documentation**: Auto-generated docs explain every calculation

### 11.10 Monitoring & Alerting

#### dbt Cloud (Optional)
- Automated scheduling
- Run monitoring dashboard
- Slack/email alerts on test failures
- Historical run performance

#### Custom Monitoring
```sql
-- Monitor dbt run health
SELECT 
    dbt_run_timestamp,
    dbt_invocation_id,
    overall_compliant,
    CASE 
        WHEN overall_compliant = false THEN 'ALERT'
        ELSE 'OK'
    END as status
FROM analytics.mart_quality_dashboard
ORDER BY dbt_run_timestamp DESC
LIMIT 10;
```

### 11.11 Documentation References

- **dbt Project README**: `/mobu_dbt/README.md`
- **Integration Guide**: `/DBT_INTEGRATION.md`
- **dbt Official Docs**: https://docs.getdbt.com/
- **Data Model**: See `03_Data_Model.md` for table schemas

---

**dbt Integration Status**: ✅ Complete  
**Models**: 15 (4 staging feeds + 5 staging system + 4 intermediate + 1 mart + 1 dashboard)  
**Tests**: Schema validation + custom quality tests  
**Next Step**: Set up PostgreSQL database and connect Data Feed Agent
