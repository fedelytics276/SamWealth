# MOBU Investment Platform
## Data Model & Knowledge Graph Schema

**Version:** 1.0  
**Date:** September 2026  
**Status:** State-of-the-Art Data Design

---

## Table of Contents

1. [Overview](#1-overview)
2. [Investment Domain Ontology](#2-investment-domain-ontology)
3. [Knowledge Graph Schema](#3-knowledge-graph-schema)
4. [Relational Database Schema](#4-relational-database-schema)
5. [Time-Series Data Model](#5-time-series-data-model)
6. [Data Standards & Alignment](#6-data-standards--alignment)
7. [Data Governance](#7-data-governance)

---

## 1. Overview

### 1.1 Dual Data Model Strategy

MOBU uses a **hybrid data architecture**:

1. **Knowledge Graph** (Neo4j): For relationships, reasoning, evidence trails
2. **Relational Database** (PostgreSQL): For transactions, accounting, integrity
3. **Time-Series Database** (TimescaleDB): For market data, metrics

```
┌─────────────────────────────────────────────────────────┐
│                    Knowledge Graph                       │
│   Ontology • Relationships • Evidence Trails            │
│   Neo4j                                                 │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                 Relational Database                      │
│   Master Data • Transactions • Accounting               │
│   PostgreSQL                                            │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                 Time-Series Database                     │
│   Market Data • Metrics • Performance                   │
│   TimescaleDB                                           │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Why This Matters

- **Graph**: Natural fit for "why this recommendation" queries
- **Relational**: ACID guarantees for money and compliance
- **Time-Series**: Optimized for historical analysis

---

## 2. Investment Domain Ontology

### 2.1 Core Entity Definitions

| Entity | Definition | Primary Identifier |
|--------|-----------|-------------------|
| **Instrument** | A tradeable financial instrument | ISIN (ISO 6166) |
| **Issuer** | Legal entity that issues securities | LEI (ISO 17442) |
| **Market** | Exchange or trading venue | MIC (ISO 10383) |
| **Portfolio** | Collection of holdings managed toward an objective | Internal UUID |
| **Position** | Quantity of an instrument held at a point in time | (Portfolio, Instrument, Date) |
| **Transaction** | Economic event changing a position | Internal UUID |
| **CorporateAction** | Issuer-driven event affecting a security | Internal UUID |
| **Benchmark** | Reference index for comparison | Provider-specific ID |
| **RiskFactor** | Variable driving risk or return | Internal taxonomy |
| **Signal** | Data-derived input for recommendation engine | (Type, Instrument, Date) |
| **Recommendation** | Engine output with evidence | Internal UUID |
| **ComplianceRule** | Constraint governing eligibility | Internal UUID |
| **Regulator** | Authority enforcing rules | ISO country code + name |

### 2.2 Entity Attribute Standards

**Instrument Attributes**:
```yaml
isin: "ZAE000015889"           # ISO 6166 - 12 characters
cfi_code: "ESVUFR"             # ISO 10962 - Classifies instrument type
name: "Sasol Limited"
asset_class: "equity"           # equity, fixed_income, cash, alternatives
currency: "ZAR"                 # ISO 4217
issuer_lei: "378900D9E44FE67A1B89"
sector: "Energy"                # GICS Level 1
industry: "Oil, Gas & Consumable Fuels"  # GICS Level 4
```

**Issuer Attributes**:
```yaml
lei: "378900D9E44FE67A1B89"    # ISO 17442 - 20 characters
name: "Sasol Limited"
country: "ZA"                   # ISO 3166-1 alpha-2
headquarters: "Johannesburg"
incorporation_date: "1950-09-01"
```

**Market Attributes**:
```yaml
mic: "XJSE"                     # ISO 10383 - Market Identifier Code
name: "Johannesburg Stock Exchange"
country: "ZA"
timezone: "Africa/Johannesburg"  # IANA timezone
currency: "ZAR"
trading_hours: "09:00-17:00"
settlement_cycle: "T+3"
```

### 2.3 Relationship Definitions

| Relationship | From → To | Meaning | Properties |
|-------------|-----------|---------|-----------|
| ISSUED_BY | Instrument → Issuer | Instrument issued by this entity | - |
| LISTED_ON | Instrument → Market | Instrument trades on this venue | listing_date |
| EXPOSED_TO | Instrument → RiskFactor | Instrument has this risk exposure | weight |
| HOLDS | Portfolio → Position | Portfolio contains this position | - |
| OF | Position → Instrument | Position is of this instrument | - |
| AFFECTS | Transaction → Position | Transaction changed this position | delta_quantity |
| INVOLVES | Transaction → Instrument | Transaction involved this instrument | - |
| APPLIES_TO | CorporateAction → Instrument | Corporate action affects instrument | - |
| DERIVED_FROM | Signal → Instrument | Signal computed for instrument | - |
| CITES | Recommendation → Signal | Recommendation uses signal as evidence | weight |
| CONCERNS | Recommendation → Instrument | Recommendation is about instrument | - |
| GENERATED_FOR | Recommendation → Portfolio | Recommendation for this portfolio | - |
| CHECKED_AGAINST | Recommendation → ComplianceRule | Screened against this rule | result |
| ENFORCED_BY | ComplianceRule → Regulator | Rule enforced by authority | - |
| GOVERNS | Regulator → Market | Regulator has jurisdiction over market | - |
| BENCHMARKED_TO | Portfolio → Benchmark | Portfolio measured against benchmark | - |

---

## 3. Knowledge Graph Schema

### 3.1 Complete Node & Relationship Definitions

**Cypher Schema Definitions**:

```cypher
// ============================================================
// NODE CONSTRAINTS & INDEXES
// ============================================================

// Instrument nodes
CREATE CONSTRAINT instrument_isin IF NOT EXISTS
FOR (i:Instrument) REQUIRE i.isin IS UNIQUE;

CREATE INDEX instrument_name IF NOT EXISTS
FOR (i:Instrument) ON (i.name);

CREATE INDEX instrument_asset_class IF NOT EXISTS
FOR (i:Instrument) ON (i.asset_class);

// Issuer nodes
CREATE CONSTRAINT issuer_lei IF NOT EXISTS
FOR (i:Issuer) REQUIRE i.lei IS UNIQUE;

// Market nodes
CREATE CONSTRAINT market_mic IF NOT EXISTS
FOR (m:Market) REQUIRE m.mic IS UNIQUE;

// Portfolio nodes
CREATE CONSTRAINT portfolio_id IF NOT EXISTS
FOR (p:Portfolio) REQUIRE p.id IS UNIQUE;

// Recommendation nodes
CREATE CONSTRAINT recommendation_id IF NOT EXISTS
FOR (r:Recommendation) REQUIRE r.id IS UNIQUE;

CREATE INDEX recommendation_generated_at IF NOT EXISTS
FOR (r:Recommendation) ON (r.generated_at);

// Signal nodes
CREATE INDEX signal_type_date IF NOT EXISTS
FOR (s:Signal) ON (s.type, s.as_of_date);

// ComplianceRule nodes
CREATE CONSTRAINT compliance_rule_id IF NOT EXISTS
FOR (c:ComplianceRule) REQUIRE c.id IS UNIQUE;

// Regulator nodes
CREATE CONSTRAINT regulator_id IF NOT EXISTS
FOR (r:Regulator) REQUIRE r.id IS UNIQUE;

// ============================================================
// EXAMPLE NODE CREATION
// ============================================================

// Create Issuer
CREATE (issuer:Issuer {
  lei: "378900D9E44FE67A1B89",
  name: "Sasol Limited",
  country: "ZA",
  sector: "Energy",
  created_at: datetime()
});

// Create Instrument
CREATE (instrument:Instrument {
  isin: "ZAE000015889",
  cfi_code: "ESVUFR",
  name: "Sasol Limited",
  asset_class: "equity",
  currency: "ZAR",
  status: "active",
  created_at: datetime()
});

// Create Market
CREATE (market:Market {
  mic: "XJSE",
  name: "Johannesburg Stock Exchange",
  country: "ZA",
  timezone: "Africa/Johannesburg",
  currency: "ZAR"
});

// Create relationships
MATCH (i:Instrument {isin: "ZAE000015889"})
MATCH (issuer:Issuer {lei: "378900D9E44FE67A1B89"})
CREATE (i)-[:ISSUED_BY]->(issuer);

MATCH (i:Instrument {isin: "ZAE000015889"})
MATCH (m:Market {mic: "XJSE"})
CREATE (i)-[:LISTED_ON {listing_date: date("2000-01-01")}]->(m);

// Create Signal
CREATE (signal:Signal {
  id: "sig_" + randomUUID(),
  type: "valuation_pe",
  value: 0.8,
  confidence: 0.85,
  as_of_date: date(),
  evidence: {
    price: 320.50,
    eps: 25.40,
    pe_ratio: 12.6,
    sector_median_pe: 15.8
  },
  computed_at: datetime()
});

// Link signal to instrument
MATCH (s:Signal {type: "valuation_pe"})
MATCH (i:Instrument {isin: "ZAE000015889"})
CREATE (s)-[:DERIVED_FROM]->(i);

// Create Recommendation
CREATE (rec:Recommendation {
  id: "rec_" + randomUUID(),
  action: "BUY",
  conviction: 0.72,
  target_weight: 0.05,
  generated_at: datetime(),
  valid_until: datetime() + duration({days: 30}),
  version: "1.0"
});

// Link recommendation to instrument
MATCH (r:Recommendation)
MATCH (i:Instrument {isin: "ZAE000015889"})
CREATE (r)-[:CONCERNS]->(i);

// Link recommendation to signals (with weights)
MATCH (r:Recommendation)
MATCH (s1:Signal {type: "valuation_pe"})
MATCH (s2:Signal {type: "momentum"})
MATCH (s3:Signal {type: "quality"})
CREATE (r)-[:CITES {weight: 0.4}]->(s1)
CREATE (r)-[:CITES {weight: 0.3}]->(s2)
CREATE (r)-[:CITES {weight: 0.3}]->(s3);

// Create ComplianceRule
CREATE (rule:ComplianceRule {
  id: "fsca_single_equity_limit",
  description: "No single equity shall exceed 10% of portfolio",
  rule_type: "concentration",
  severity: "error",
  jurisdiction: "ZA",
  parameters: {
    max_weight: 0.10,
    scope: "single_instrument"
  },
  active: true
});

// Create Regulator
CREATE (regulator:Regulator {
  id: "FSCA",
  name: "Financial Sector Conduct Authority",
  country: "ZA",
  url: "https://www.fsca.co.za"
});

// Link rule to regulator
MATCH (rule:ComplianceRule {id: "fsca_single_equity_limit"})
MATCH (reg:Regulator {id: "FSCA"})
CREATE (rule)-[:ENFORCED_BY]->(reg);

// Link regulator to market
MATCH (reg:Regulator {id: "FSCA"})
MATCH (m:Market {mic: "XJSE"})
CREATE (reg)-[:GOVERNS]->(m);

// Link recommendation to compliance check
MATCH (r:Recommendation)
MATCH (rule:ComplianceRule {id: "fsca_single_equity_limit"})
CREATE (r)-[:CHECKED_AGAINST {
  result: "pass",
  checked_at: datetime(),
  details: {
    proposed_weight: 0.05,
    limit: 0.10
  }
}]->(rule);
```

### 3.2 Evidence Trail Queries

**Query 1: Full evidence for a recommendation**

```cypher
MATCH (r:Recommendation {id: $rec_id})
MATCH (r)-[:CONCERNS]->(i:Instrument)
MATCH (r)-[cites:CITES]->(s:Signal)-[:DERIVED_FROM]->(i)
MATCH (r)-[checked:CHECKED_AGAINST]->(rule:ComplianceRule)-[:ENFORCED_BY]->(reg:Regulator)
RETURN 
  r.action as action,
  r.conviction as conviction,
  i.name as instrument,
  i.isin as isin,
  collect({
    signal_type: s.type,
    signal_value: s.value,
    confidence: s.confidence,
    weight: cites.weight,
    evidence: s.evidence
  }) as signals,
  collect({
    rule_description: rule.description,
    result: checked.result,
    regulator: reg.name
  }) as compliance_checks
ORDER BY cites.weight DESC
```

**Query 2: Why did this recommendation change?**

```cypher
// Compare two versions of recommendations for same instrument
MATCH (r1:Recommendation {version: "1.0"})-[:CONCERNS]->(i:Instrument {isin: $isin})
MATCH (r2:Recommendation {version: "1.1"})-[:CONCERNS]->(i)
MATCH (r1)-[c1:CITES]->(s1:Signal)
MATCH (r2)-[c2:CITES]->(s2:Signal)
WHERE r1.generated_at < r2.generated_at
  AND s1.type = s2.type
RETURN 
  s1.type as signal_type,
  s1.value as old_value,
  s2.value as new_value,
  s2.value - s1.value as delta,
  c1.weight as old_weight,
  c2.weight as new_weight,
  r1.action as old_action,
  r2.action as new_action
```

**Query 3: Impact analysis - which recommendations affected by rule change?**

```cypher
MATCH (rule:ComplianceRule {id: $rule_id})
MATCH (r:Recommendation)-[checked:CHECKED_AGAINST]->(rule)
WHERE checked.result = "fail" 
  AND r.generated_at > datetime() - duration({days: 30})
MATCH (r)-[:CONCERNS]->(i:Instrument)
RETURN 
  i.name as instrument,
  r.action as blocked_action,
  r.conviction as conviction,
  checked.details as failure_reason
ORDER BY r.conviction DESC
```

**Query 4: Portfolio exposure to a risk factor**

```cypher
MATCH (p:Portfolio {id: $portfolio_id})-[:HOLDS]->(pos:Position)-[:OF]->(i:Instrument)
MATCH (i)-[exp:EXPOSED_TO]->(rf:RiskFactor {name: $risk_factor})
RETURN 
  i.name as instrument,
  pos.weight as portfolio_weight,
  exp.weight as risk_exposure,
  pos.weight * exp.weight as contribution_to_risk
ORDER BY contribution_to_risk DESC
```

### 3.3 Graph Visualization

Using Neo4j Bloom or similar:

```
[Recommendation: BUY Sasol]
    ↓ CITES (0.4)
    [Signal: Valuation P/E = 0.8]
        ↓ DERIVED_FROM
        [Instrument: Sasol ZAE000015889]
            ↓ ISSUED_BY
            [Issuer: Sasol Limited]
            ↓ LISTED_ON
            [Market: JSE XJSE]
                ↓ GOVERNED_BY
                [Regulator: FSCA]
    
    ↓ CHECKED_AGAINST (pass)
    [ComplianceRule: 10% single equity limit]
        ↓ ENFORCED_BY
        [Regulator: FSCA]
```

---

## 4. Relational Database Schema

### 4.1 Security Master Tables

```sql
-- ============================================================
-- SECURITY MASTER
-- ============================================================

CREATE SCHEMA security_master;

-- Issuers (companies, governments, entities)
CREATE TABLE security_master.issuers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lei VARCHAR(20) UNIQUE, -- Legal Entity Identifier
    name TEXT NOT NULL,
    country_code CHAR(2) NOT NULL, -- ISO 3166-1
    sector VARCHAR(100),
    industry VARCHAR(200),
    incorporation_date DATE,
    website TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_issuers_country ON security_master.issuers(country_code);
CREATE INDEX idx_issuers_sector ON security_master.issuers(sector);

-- Markets (exchanges, trading venues)
CREATE TABLE security_master.markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mic CHAR(4) UNIQUE NOT NULL, -- Market Identifier Code (ISO 10383)
    name TEXT NOT NULL,
    country_code CHAR(2) NOT NULL,
    timezone TEXT NOT NULL, -- IANA timezone
    currency_code CHAR(3) NOT NULL, -- ISO 4217
    trading_hours JSONB, -- {"open": "09:00", "close": "17:00"}
    settlement_cycle VARCHAR(10), -- "T+3"
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Instruments (securities)
CREATE TABLE security_master.instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isin CHAR(12) UNIQUE NOT NULL, -- ISO 6166
    cfi_code CHAR(6), -- ISO 10962
    fisn VARCHAR(100), -- Financial Instrument Short Name
    name TEXT NOT NULL,
    asset_class VARCHAR(50) NOT NULL, -- equity, fixed_income, etc.
    instrument_type VARCHAR(50), -- common_stock, corporate_bond, etf
    currency_code CHAR(3) NOT NULL,
    issuer_id UUID REFERENCES security_master.issuers(id),
    primary_market_id UUID REFERENCES security_master.markets(id),
    sector VARCHAR(100), -- GICS Level 1
    industry VARCHAR(200), -- GICS Level 4
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, delisted
    inception_date DATE,
    maturity_date DATE, -- For bonds
    metadata JSONB, -- Flexible for instrument-specific data
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT valid_asset_class CHECK (
        asset_class IN ('equity', 'fixed_income', 'cash', 'alternatives', 'derivatives')
    )
);

CREATE INDEX idx_instruments_asset_class ON security_master.instruments(asset_class);
CREATE INDEX idx_instruments_issuer ON security_master.instruments(issuer_id);
CREATE INDEX idx_instruments_sector ON security_master.instruments(sector);
CREATE INDEX idx_instruments_status ON security_master.instruments(status);

-- Local market identifiers (tickers, sedol, cusip, etc.)
CREATE TABLE security_master.instrument_identifiers (
    instrument_id UUID REFERENCES security_master.instruments(id) ON DELETE CASCADE,
    identifier_type VARCHAR(50) NOT NULL, -- 'TICKER', 'SEDOL', 'CUSIP', 'JSE_CODE'
    identifier_value VARCHAR(50) NOT NULL,
    market_id UUID REFERENCES security_master.markets(id),
    is_primary BOOLEAN DEFAULT false,
    valid_from DATE,
    valid_to DATE,
    
    PRIMARY KEY (instrument_id, identifier_type, identifier_value)
);

CREATE INDEX idx_identifiers_lookup ON security_master.instrument_identifiers(
    identifier_type, identifier_value
);

-- Instrument relationships (parent/child for complex securities)
CREATE TABLE security_master.instrument_relationships (
    parent_instrument_id UUID REFERENCES security_master.instruments(id),
    child_instrument_id UUID REFERENCES security_master.instruments(id),
    relationship_type VARCHAR(50), -- 'underlying', 'component', 'successor'
    weight DECIMAL(10, 6), -- For index components
    effective_date DATE,
    
    PRIMARY KEY (parent_instrument_id, child_instrument_id, relationship_type)
);
```

### 4.2 Portfolio & Accounting Tables

```sql
-- ============================================================
-- PORTFOLIO MANAGEMENT & ACCOUNTING
-- ============================================================

CREATE SCHEMA portfolio;

-- Portfolios
CREATE TABLE portfolio.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    portfolio_type VARCHAR(50) NOT NULL, -- 'model', 'client', 'benchmark'
    base_currency CHAR(3) NOT NULL,
    inception_date DATE NOT NULL,
    mandate TEXT, -- Investment mandate description
    benchmark_id UUID, -- Reference to benchmark portfolio
    manager_id UUID, -- User ID of portfolio manager
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT valid_portfolio_type CHECK (
        portfolio_type IN ('model', 'client', 'benchmark', 'test')
    )
);

-- Chart of accounts
CREATE TABLE portfolio.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name TEXT NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- 'asset', 'liability', 'equity', 'income', 'expense'
    parent_account_id UUID REFERENCES portfolio.accounts(id),
    portfolio_id UUID REFERENCES portfolio.portfolios(id),
    currency_code CHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT valid_account_type CHECK (
        account_type IN ('asset', 'liability', 'equity', 'income', 'expense')
    )
);

CREATE INDEX idx_accounts_portfolio ON portfolio.accounts(portfolio_id);

-- Journal entries (immutable)
CREATE TABLE portfolio.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    description TEXT,
    source_type VARCHAR(50), -- 'trade', 'dividend', 'fee', 'fx', 'adjustment'
    source_id UUID, -- Reference to trade, corporate action, etc.
    status VARCHAR(20) DEFAULT 'posted',
    created_by UUID,
    reversed_by UUID REFERENCES portfolio.journal_entries(id),
    reversal_reason TEXT,
    
    CONSTRAINT no_update CHECK (false) -- Immutable table
);

CREATE INDEX idx_journal_entries_date ON portfolio.journal_entries(entry_date);
CREATE INDEX idx_journal_entries_source ON portfolio.journal_entries(source_type, source_id);

-- Journal lines (double-entry)
CREATE TABLE portfolio.journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID REFERENCES portfolio.journal_entries(id),
    line_number INTEGER NOT NULL,
    account_id UUID REFERENCES portfolio.accounts(id),
    debit_amount DECIMAL(19, 4) DEFAULT 0,
    credit_amount DECIMAL(19, 4) DEFAULT 0,
    currency_code CHAR(3) NOT NULL,
    instrument_id UUID REFERENCES security_master.instruments(id),
    quantity DECIMAL(19, 6), -- For security transactions
    price DECIMAL(19, 6), -- Price per unit
    description TEXT,
    
    PRIMARY KEY (journal_entry_id, line_number),
    
    CONSTRAINT one_side_only CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR
        (credit_amount > 0 AND debit_amount = 0)
    )
);

CREATE INDEX idx_journal_lines_account ON portfolio.journal_lines(account_id);
CREATE INDEX idx_journal_lines_instrument ON portfolio.journal_lines(instrument_id);

-- Materialized view: Current positions
CREATE MATERIALIZED VIEW portfolio.current_positions AS
SELECT 
    a.portfolio_id,
    jl.account_id,
    jl.instrument_id,
    i.name as instrument_name,
    i.isin,
    SUM(jl.quantity) as quantity,
    SUM(jl.debit_amount - jl.credit_amount) as cost_basis,
    MAX(je.posted_at) as last_updated
FROM portfolio.journal_lines jl
JOIN portfolio.journal_entries je ON je.id = jl.journal_entry_id
JOIN portfolio.accounts a ON a.id = jl.account_id
JOIN security_master.instruments i ON i.id = jl.instrument_id
WHERE je.status = 'posted' 
  AND je.reversed_by IS NULL
  AND jl.instrument_id IS NOT NULL
GROUP BY a.portfolio_id, jl.account_id, jl.instrument_id, i.name, i.isin
HAVING SUM(jl.quantity) != 0;

CREATE UNIQUE INDEX idx_current_positions_unique 
ON portfolio.current_positions(portfolio_id, instrument_id);

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_current_positions()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio.current_positions;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_positions
AFTER INSERT ON portfolio.journal_entries
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_current_positions();
```

### 4.3 Compliance & Rules Tables

```sql
-- ============================================================
-- COMPLIANCE
-- ============================================================

CREATE SCHEMA compliance;

-- Regulators
CREATE TABLE compliance.regulators (
    id VARCHAR(50) PRIMARY KEY, -- 'FSCA', 'SEC_NG', etc.
    name TEXT NOT NULL,
    country_code CHAR(2),
    jurisdiction TEXT,
    website TEXT,
    contact_info JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance rules
CREATE TABLE compliance.rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'concentration', 'eligibility', 'suitability'
    severity VARCHAR(20) DEFAULT 'error', -- 'error', 'warning', 'info'
    regulator_id VARCHAR(50) REFERENCES compliance.regulators(id),
    jurisdiction CHAR(2), -- Country code
    applicable_to VARCHAR(50), -- 'all', 'retail', 'institutional'
    parameters JSONB, -- Rule-specific parameters
    is_active BOOLEAN DEFAULT true,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT valid_severity CHECK (severity IN ('error', 'warning', 'info'))
);

CREATE INDEX idx_rules_regulator ON compliance.rules(regulator_id);
CREATE INDEX idx_rules_active ON compliance.rules(is_active);

-- Compliance checks (audit trail)
CREATE TABLE compliance.checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_type VARCHAR(50), -- 'pre_trade', 'post_trade', 'periodic'
    portfolio_id UUID REFERENCES portfolio.portfolios(id),
    rule_id UUID REFERENCES compliance.rules(id),
    checked_at TIMESTAMPTZ DEFAULT now(),
    result VARCHAR(20), -- 'pass', 'fail', 'warning'
    details JSONB, -- Specifics of the check
    checked_by UUID, -- User or system
    
    CONSTRAINT valid_result CHECK (result IN ('pass', 'fail', 'warning'))
);

CREATE INDEX idx_checks_portfolio ON compliance.checks(portfolio_id);
CREATE INDEX idx_checks_result ON compliance.checks(result);
CREATE INDEX idx_checks_date ON compliance.checks(checked_at);
```

### 4.4 Users & Access Control Tables

```sql
-- ============================================================
-- USERS & ACCESS CONTROL
-- ============================================================

CREATE SCHEMA users;

-- Users
CREATE TABLE users.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    password_hash TEXT, -- Null if using SSO
    full_name TEXT,
    user_type VARCHAR(50), -- 'retail', 'advisor', 'institutional', 'admin'
    status VARCHAR(20) DEFAULT 'active',
    mfa_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Roles
CREATE TABLE users.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB, -- Array of permission strings
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User-Role assignments
CREATE TABLE users.user_roles (
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES users.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    assigned_by UUID REFERENCES users.users(id),
    
    PRIMARY KEY (user_id, role_id)
);

-- Portfolio access control
CREATE TABLE users.portfolio_access (
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolio.portfolios(id) ON DELETE CASCADE,
    access_level VARCHAR(20), -- 'read', 'write', 'admin'
    granted_at TIMESTAMPTZ DEFAULT now(),
    granted_by UUID REFERENCES users.users(id),
    
    PRIMARY KEY (user_id, portfolio_id)
);
```

---

## 5. Time-Series Data Model

### 5.1 Market Data Schema (TimescaleDB)

```sql
-- ============================================================
-- TIME-SERIES MARKET DATA
-- ============================================================

CREATE SCHEMA market_data;

-- Price data (hypertable)
CREATE TABLE market_data.prices (
    instrument_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    open_price DECIMAL(19, 6),
    high_price DECIMAL(19, 6),
    low_price DECIMAL(19, 6),
    close_price DECIMAL(19, 6),
    volume BIGINT,
    vwap DECIMAL(19, 6), -- Volume-Weighted Average Price
    bid DECIMAL(19, 6),
    ask DECIMAL(19, 6),
    source VARCHAR(50), -- 'JSE', 'NGX', 'EGX', etc.
    quality_score DECIMAL(3, 2), -- 0.00 to 1.00
    
    PRIMARY KEY (instrument_id, timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('market_data.prices', 'timestamp', 
    chunk_time_interval => INTERVAL '1 month',
    if_not_exists => TRUE
);

-- Compression policy (keep last 3 months uncompressed)
ALTER TABLE market_data.prices SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'instrument_id'
);

SELECT add_compression_policy('market_data.prices', INTERVAL '3 months');

-- Retention policy (keep 10 years)
SELECT add_retention_policy('market_data.prices', INTERVAL '10 years');

-- Fundamental data (hypertable)
CREATE TABLE market_data.fundamentals (
    instrument_id UUID NOT NULL,
    report_date DATE NOT NULL,
    period_type VARCHAR(10), -- 'Q1', 'Q2', 'Q3', 'Q4', 'FY'
    fiscal_year INTEGER,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(19, 4),
    currency_code CHAR(3),
    source VARCHAR(50),
    reported_at TIMESTAMPTZ DEFAULT now(),
    
    PRIMARY KEY (instrument_id, report_date, period_type, metric_name)
);

-- Metrics examples: 'revenue', 'net_income', 'eps', 'total_assets', 'total_equity'

-- Calculated metrics (hypertable)
CREATE TABLE market_data.calculated_metrics (
    instrument_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'pe_ratio', 'pb_ratio', 'rsi', 'moving_avg_50d'
    value DECIMAL(19, 6),
    confidence DECIMAL(3, 2),
    parameters JSONB, -- Calculation parameters
    calculated_at TIMESTAMPTZ DEFAULT now(),
    
    PRIMARY KEY (instrument_id, timestamp, metric_type)
);

SELECT create_hypertable('market_data.calculated_metrics', 'timestamp',
    chunk_time_interval => INTERVAL '1 month',
    if_not_exists => TRUE
);

-- Corporate actions
CREATE TABLE market_data.corporate_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES security_master.instruments(id),
    action_type VARCHAR(50) NOT NULL, -- 'dividend', 'split', 'merger', 'rights_issue'
    ex_date DATE NOT NULL,
    record_date DATE,
    payment_date DATE,
    details JSONB, -- Action-specific details
    announced_at TIMESTAMPTZ,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_action_type CHECK (
        action_type IN ('dividend', 'split', 'reverse_split', 'rights_issue', 
                       'merger', 'spinoff', 'name_change', 'delisting')
    )
);

CREATE INDEX idx_corporate_actions_instrument ON market_data.corporate_actions(instrument_id);
CREATE INDEX idx_corporate_actions_ex_date ON market_data.corporate_actions(ex_date);
```

### 5.2 Common Time-Series Queries

**Latest price for an instrument**:
```sql
SELECT close_price, timestamp
FROM market_data.prices
WHERE instrument_id = '...'
ORDER BY timestamp DESC
LIMIT 1;
```

**OHLCV data for a date range**:
```sql
SELECT 
    timestamp,
    open_price,
    high_price,
    low_price,
    close_price,
    volume
FROM market_data.prices
WHERE instrument_id = '...'
  AND timestamp BETWEEN '2026-01-01' AND '2026-09-01'
ORDER BY timestamp;
```

**Moving average (using continuous aggregates)**:
```sql
CREATE MATERIALIZED VIEW market_data.price_daily_avg
WITH (timescaledb.continuous) AS
SELECT 
    instrument_id,
    time_bucket('1 day', timestamp) AS day,
    first(open_price, timestamp) as open,
    max(high_price) as high,
    min(low_price) as low,
    last(close_price, timestamp) as close,
    sum(volume) as total_volume
FROM market_data.prices
GROUP BY instrument_id, day;

-- Refresh policy
SELECT add_continuous_aggregate_policy('market_data.price_daily_avg',
    start_offset => INTERVAL '1 week',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');
```

---

## 6. Data Standards & Alignment

### 6.1 International Standards Mapping

| Domain | Standard | Usage in MOBU |
|--------|----------|---------------|
| **Security Identification** | ISO 6166 (ISIN) | Primary key for instruments |
| **Instrument Classification** | ISO 10962 (CFI) | Instrument type classification |
| **Entity Identification** | ISO 17442 (LEI) | Issuer identification |
| **Market Identification** | ISO 10383 (MIC) | Exchange/venue identification |
| **Currency Codes** | ISO 4217 | All monetary values |
| **Country Codes** | ISO 3166-1 | Issuer, market countries |
| **Messaging** | ISO 20022 | Transaction messaging |
| **Sector Classification** | GICS / ICB | Sector/industry categorization |

### 6.2 Data Quality Dimensions

Every data point is assessed on:

1. **Completeness**: Are all required fields present?
2. **Accuracy**: Does the value match the source?
3. **Timeliness**: Is the data current enough?
4. **Consistency**: Does it match related data?
5. **Validity**: Does it pass business rule checks?

**Quality Score Calculation**:
```python
def calculate_quality_score(data_point: Dict) -> float:
    """
    Calculate data quality score (0.0 to 1.0)
    """
    scores = {
        'completeness': 0.0,
        'timeliness': 0.0,
        'validity': 0.0,
        'consistency': 0.0
    }
    
    # Completeness (30%)
    required_fields = ['price', 'volume', 'timestamp']
    present = sum(1 for f in required_fields if data_point.get(f) is not None)
    scores['completeness'] = present / len(required_fields)
    
    # Timeliness (30%)
    age_minutes = (datetime.now() - data_point['timestamp']).total_seconds() / 60
    if age_minutes < 5:
        scores['timeliness'] = 1.0
    elif age_minutes < 60:
        scores['timeliness'] = 0.8
    elif age_minutes < 1440:  # 1 day
        scores['timeliness'] = 0.5
    else:
        scores['timeliness'] = 0.2
    
    # Validity (20%)
    if data_point.get('price', 0) > 0 and data_point.get('volume', 0) >= 0:
        scores['validity'] = 1.0
    else:
        scores['validity'] = 0.0
    
    # Consistency (20%)
    # Check against previous day's price (shouldn't move > 50% in a day typically)
    prev_price = get_previous_close(data_point['instrument_id'])
    if prev_price:
        change_pct = abs(data_point['price'] - prev_price) / prev_price
        if change_pct < 0.20:
            scores['consistency'] = 1.0
        elif change_pct < 0.50:
            scores['consistency'] = 0.5
        else:
            scores['consistency'] = 0.2  # Suspicious but possible
    
    # Weighted average
    quality_score = (
        scores['completeness'] * 0.30 +
        scores['timeliness'] * 0.30 +
        scores['validity'] * 0.20 +
        scores['consistency'] * 0.20
    )
    
    return round(quality_score, 2)
```

---

## 7. AI Quality Framework Data Model

### 7.1 Data Quality Tracking

**Purpose**: Support Criterion 1 (Accuracy) - track data quality, validation, and corrections.

```sql
-- Data quality checks table
CREATE TABLE data_quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type VARCHAR(50) NOT NULL,           -- 'stock_price', 'financial_statement', etc.
    data_id VARCHAR(100) NOT NULL,            -- Identifier of the data record
    check_type VARCHAR(50) NOT NULL,          -- 'schema', 'range', 'spike', 'cross_source'
    check_result BOOLEAN NOT NULL,            -- TRUE = passed, FALSE = failed
    check_details JSONB,                      -- Additional context about the check
    severity VARCHAR(20),                     -- 'critical', 'high', 'medium', 'low'
    corrected BOOLEAN DEFAULT FALSE,          -- Whether issue was corrected
    corrected_at TIMESTAMP,
    checked_at TIMESTAMP DEFAULT NOW(),
    checked_by VARCHAR(100)                   -- System component that ran the check
);

CREATE INDEX idx_dq_checks_type_result ON data_quality_checks(data_type, check_result, checked_at);
CREATE INDEX idx_dq_checks_severity ON data_quality_checks(severity, corrected);

-- Data quality metrics (aggregated)
CREATE TABLE data_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type VARCHAR(50) NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Accuracy metrics
    total_records INTEGER NOT NULL,
    validated_records INTEGER NOT NULL,
    failed_records INTEGER NOT NULL,
    accuracy_score DECIMAL(5,4),              -- % passing validation
    
    -- Completeness metrics
    expected_records INTEGER,
    received_records INTEGER,
    completeness_score DECIMAL(5,4),
    
    -- Timeliness metrics
    avg_ingestion_delay_seconds INTEGER,
    on_time_records INTEGER,
    timeliness_score DECIMAL(5,4),
    
    -- Consistency metrics
    cross_source_matches INTEGER,
    cross_source_total INTEGER,
    consistency_score DECIMAL(5,4),
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(data_type, metric_date)
);

CREATE INDEX idx_dq_metrics_date ON data_quality_metrics(metric_date DESC);

-- Data corrections log
CREATE TABLE data_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID REFERENCES data_quality_checks(id),
    data_type VARCHAR(50) NOT NULL,
    data_id VARCHAR(100) NOT NULL,
    
    original_value JSONB NOT NULL,
    corrected_value JSONB NOT NULL,
    correction_method VARCHAR(50),            -- 'automatic', 'manual', 'imputed'
    correction_reason TEXT,
    
    corrected_by VARCHAR(100),
    corrected_at TIMESTAMP DEFAULT NOW(),
    approved_by VARCHAR(100),
    approved_at TIMESTAMP
);

CREATE INDEX idx_corrections_check ON data_corrections(check_id);
CREATE INDEX idx_corrections_date ON data_corrections(corrected_at);
```

### 7.2 Recommendation Goals & Outcomes

**Purpose**: Support Criterion 3 (Well-Defined Goals) - track Sharpe ratio, win rates, and goal achievement.

```sql
-- Recommendation goals
CREATE TABLE recommendation_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES recommendations(id) NOT NULL,
    
    -- Target metrics
    expected_return_pct DECIMAL(6,2) NOT NULL,       -- Expected % return
    target_holding_days INTEGER NOT NULL,             -- Days to hold
    confidence_threshold DECIMAL(4,3) NOT NULL,       -- Min confidence (e.g., 0.75)
    
    -- Risk limits
    max_position_size_pct DECIMAL(5,2),              -- Max % of portfolio
    stop_loss_pct DECIMAL(6,2),                      -- Trigger exit (e.g., -15%)
    take_profit_pct DECIMAL(6,2),                    -- Trigger exit (e.g., +25%)
    
    -- Success criteria
    success_threshold_pct DECIMAL(6,2) DEFAULT 0,    -- Min return for "success"
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rec_goals_recommendation ON recommendation_goals(recommendation_id);

-- Recommendation outcomes
CREATE TABLE recommendation_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES recommendations(id) NOT NULL,
    goal_id UUID REFERENCES recommendation_goals(id),
    
    -- Entry
    entry_date DATE NOT NULL,
    entry_price DECIMAL(10,2) NOT NULL,
    entry_confidence DECIMAL(4,3),
    
    -- Exit
    exit_date DATE,
    exit_price DECIMAL(10,2),
    exit_reason VARCHAR(50),                         -- 'target_reached', 'stop_loss', 'time_expired', 'manual'
    
    -- Performance
    return_pct DECIMAL(6,2),
    holding_days INTEGER,
    
    -- Risk-adjusted metrics
    sharpe_contribution DECIMAL(6,4),                -- Contribution to portfolio Sharpe
    sortino_ratio DECIMAL(6,4),                      -- Downside risk-adjusted
    max_drawdown_pct DECIMAL(6,2),
    
    -- Outcome classification
    outcome_type VARCHAR(20),                        -- 'strong_success', 'success', 'weak_failure', 'failure', 'critical_failure'
    outcome_score DECIMAL(5,2),                      -- 0-100 score
    
    -- Goal achievement
    met_return_goal BOOLEAN,
    met_timing_goal BOOLEAN,
    met_risk_goal BOOLEAN,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_outcomes_recommendation ON recommendation_outcomes(recommendation_id);
CREATE INDEX idx_outcomes_exit_date ON recommendation_outcomes(exit_date);
CREATE INDEX idx_outcomes_type ON recommendation_outcomes(outcome_type);

-- Portfolio performance metrics
CREATE TABLE portfolio_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Returns
    daily_return_pct DECIMAL(6,2),
    cumulative_return_pct DECIMAL(7,2),
    annualized_return_pct DECIMAL(6,2),
    
    -- Risk metrics
    volatility_annualized DECIMAL(6,4),
    max_drawdown_pct DECIMAL(6,2),
    var_95_pct DECIMAL(6,2),                         -- Value at Risk (95% confidence)
    
    -- Risk-adjusted returns
    sharpe_ratio DECIMAL(6,4),                       -- TARGET: > 1.5
    sortino_ratio DECIMAL(6,4),
    information_ratio DECIMAL(6,4),                  -- TARGET: > 0.5
    
    -- Comparison to benchmark
    benchmark_return_pct DECIMAL(6,2),
    alpha_pct DECIMAL(6,2),                          -- Excess return vs benchmark
    beta DECIMAL(6,4),                               -- Market sensitivity
    
    -- Goal achievement
    meets_sharpe_goal BOOLEAN,                       -- Sharpe > 1.5?
    meets_drawdown_limit BOOLEAN,                    -- Max DD < 15%?
    beats_benchmark BOOLEAN,                         -- Return > benchmark?
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(portfolio_id, metric_date)
);

CREATE INDEX idx_perf_portfolio_date ON portfolio_performance(portfolio_id, metric_date DESC);
CREATE INDEX idx_perf_sharpe ON portfolio_performance(sharpe_ratio DESC);

-- Goal tracking (system-level)
CREATE TABLE system_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_name VARCHAR(100) NOT NULL,
    goal_type VARCHAR(50) NOT NULL,                  -- 'sharpe_ratio', 'win_rate', 'max_drawdown', etc.
    
    target_value DECIMAL(10,4) NOT NULL,
    current_value DECIMAL(10,4),
    
    measurement_period VARCHAR(50),                  -- 'trailing_12_months', 'ytd', 'all_time'
    last_calculated_at TIMESTAMP,
    
    status VARCHAR(20),                              -- 'on_track', 'at_risk', 'needs_improvement'
    status_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(goal_name, measurement_period)
);

CREATE INDEX idx_system_goals_type ON system_goals(goal_type, status);
```

### 7.3 Model Learning & Improvement

**Purpose**: Support Criterion 4 (Self-Improving) - track feature performance, model versions, and A/B tests.

```sql
-- Feature performance tracking
CREATE TABLE feature_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name VARCHAR(100) NOT NULL,
    feature_type VARCHAR(50) NOT NULL,               -- 'financial', 'technical', 'sentiment', etc.
    
    analysis_period_start DATE NOT NULL,
    analysis_period_end DATE NOT NULL,
    
    -- Performance metrics
    avg_importance_score DECIMAL(6,4),               -- Average importance in successful recs
    success_rate DECIMAL(5,4),                       -- % of recs with this feature that succeeded
    avg_contribution_to_return DECIMAL(6,4),         -- Average impact on returns
    
    -- Weight recommendations
    current_weight DECIMAL(6,4),
    recommended_weight DECIMAL(6,4),
    weight_change_pct DECIMAL(6,2),
    
    samples_analyzed INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feat_perf_name ON feature_performance(feature_name, analysis_period_end DESC);

-- Model versions
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_number INTEGER NOT NULL UNIQUE,
    model_type VARCHAR(50) NOT NULL,                 -- 'recommendation_engine', 'risk_model', etc.
    
    -- Training info
    training_start_date DATE NOT NULL,
    training_end_date DATE NOT NULL,
    training_samples INTEGER NOT NULL,
    training_duration_seconds INTEGER,
    
    -- Feature weights
    feature_weights JSONB NOT NULL,                  -- { "feature_name": weight, ... }
    hyperparameters JSONB,
    
    -- Performance on test set
    test_sharpe_ratio DECIMAL(6,4),
    test_win_rate DECIMAL(5,4),
    test_avg_return_pct DECIMAL(6,2),
    
    -- Deployment status
    status VARCHAR(20),                              -- 'training', 'testing', 'deployed', 'retired'
    deployed_at TIMESTAMP,
    retired_at TIMESTAMP,
    
    -- Comparison to previous
    previous_version_id UUID REFERENCES model_versions(id),
    performance_improvement_pct DECIMAL(6,2),
    
    trained_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_model_versions_number ON model_versions(version_number DESC);
CREATE INDEX idx_model_versions_status ON model_versions(status);

-- A/B tests
CREATE TABLE ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(100) NOT NULL UNIQUE,
    test_description TEXT,
    
    -- Models being compared
    model_a_version_id UUID REFERENCES model_versions(id),  -- Control
    model_b_version_id UUID REFERENCES model_versions(id),  -- Treatment
    
    -- Test configuration
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    traffic_split_pct DECIMAL(5,2) DEFAULT 50.00,   -- % of traffic to model B
    min_sample_size INTEGER DEFAULT 1000,
    confidence_level DECIMAL(4,3) DEFAULT 0.95,
    
    -- Status
    status VARCHAR(20),                              -- 'planned', 'running', 'completed', 'stopped'
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ab_tests_status ON ab_tests(status, start_date);

-- A/B test results
CREATE TABLE ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES ab_tests(id) NOT NULL,
    variant VARCHAR(1) NOT NULL,                     -- 'A' or 'B'
    
    -- Sample size
    total_recommendations INTEGER NOT NULL,
    total_outcomes INTEGER NOT NULL,
    
    -- Performance metrics
    win_rate DECIMAL(5,4),
    avg_return_pct DECIMAL(6,2),
    sharpe_ratio DECIMAL(6,4),
    max_drawdown_pct DECIMAL(6,2),
    
    -- Statistical significance
    p_value DECIMAL(6,5),
    is_significant BOOLEAN,
    confidence_interval_lower DECIMAL(6,4),
    confidence_interval_upper DECIMAL(6,4),
    
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(test_id, variant)
);

CREATE INDEX idx_ab_results_test ON ab_test_results(test_id);

-- A/B test decisions
CREATE TABLE ab_test_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES ab_tests(id) NOT NULL UNIQUE,
    
    decision VARCHAR(20) NOT NULL,                   -- 'deploy_b', 'keep_a', 'inconclusive'
    decision_reason TEXT NOT NULL,
    
    improvement_pct DECIMAL(6,2),
    decided_by VARCHAR(100),
    decided_at TIMESTAMP DEFAULT NOW()
);

-- Failure analysis
CREATE TABLE failure_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES recommendations(id) NOT NULL,
    outcome_id UUID REFERENCES recommendation_outcomes(id) NOT NULL,
    
    failure_severity VARCHAR(20) NOT NULL,           -- 'weak', 'moderate', 'severe', 'critical'
    
    -- Root causes (can have multiple)
    root_causes JSONB NOT NULL,                      -- ["data_quality", "market_regime_change", ...]
    
    -- Analysis findings
    ignored_signals JSONB,                           -- Negative signals that were ignored
    data_quality_issues JSONB,
    market_context JSONB,
    
    -- Lessons learned
    lessons_learned TEXT[],
    corrective_actions TEXT[],
    
    -- Follow-up
    tickets_created TEXT[],                          -- Links to improvement tickets
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    
    analyzed_by VARCHAR(100),
    analyzed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_failures_recommendation ON failure_analyses(recommendation_id);
CREATE INDEX idx_failures_severity ON failure_analyses(failure_severity, resolved);

-- Learning loop metrics
CREATE TABLE learning_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    
    -- Retraining activity
    models_trained INTEGER DEFAULT 0,
    models_deployed INTEGER DEFAULT 0,
    ab_tests_run INTEGER DEFAULT 0,
    
    -- Performance improvements
    avg_performance_improvement_pct DECIMAL(6,2),
    features_adjusted INTEGER DEFAULT 0,
    
    -- Failure analysis
    failures_analyzed INTEGER DEFAULT 0,
    corrective_actions_taken INTEGER DEFAULT 0,
    
    -- Overall learning score (0-100)
    learning_effectiveness_score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

CREATE INDEX idx_learning_metrics_date ON learning_metrics(metric_date DESC);
```

### 7.4 System Reliability Tracking

**Purpose**: Support Criterion 2 (Reliability) - track uptime, incidents, and system health.

```sql
-- System health checks
CREATE TABLE system_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component VARCHAR(50) NOT NULL,                  -- 'api', 'ai_engine', 'database', etc.
    check_type VARCHAR(50) NOT NULL,                 -- 'health', 'latency', 'error_rate'
    
    status VARCHAR(20) NOT NULL,                     -- 'healthy', 'degraded', 'down'
    status_value DECIMAL(10,4),                      -- Numeric value (e.g., latency in ms)
    
    checked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_health_component_time ON system_health_checks(component, checked_at DESC);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_number VARCHAR(20) UNIQUE NOT NULL,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL,                   -- 'critical', 'high', 'medium', 'low'
    
    component VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    detected_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    
    -- Impact
    affected_users INTEGER,
    downtime_minutes INTEGER,
    
    -- Root cause
    root_cause TEXT,
    resolution TEXT,
    
    -- SLA tracking
    breached_sla BOOLEAN DEFAULT FALSE,
    mttr_minutes INTEGER,                            -- Mean Time To Repair
    
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_incidents_started ON incidents(started_at DESC);
CREATE INDEX idx_incidents_severity ON incidents(severity, resolved_at);

-- Uptime tracking
CREATE TABLE uptime_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component VARCHAR(50) NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Availability
    total_minutes INTEGER NOT NULL,
    uptime_minutes INTEGER NOT NULL,
    downtime_minutes INTEGER NOT NULL,
    uptime_pct DECIMAL(6,4),                         -- TARGET: > 99.9%
    
    -- Performance
    avg_response_time_ms INTEGER,
    p95_response_time_ms INTEGER,
    p99_response_time_ms INTEGER,
    
    -- Errors
    total_requests INTEGER,
    failed_requests INTEGER,
    error_rate_pct DECIMAL(5,4),
    
    -- SLA compliance
    meets_sla BOOLEAN,
    sla_target_pct DECIMAL(6,4),
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(component, metric_date)
);

CREATE INDEX idx_uptime_component_date ON uptime_metrics(component, metric_date DESC);
```

## 8. Data Governance

### 7.1 Data Ownership

| Data Domain | Owner | Responsibilities |
|-------------|-------|------------------|
| Security Master | Data Team | Accuracy, completeness, deduplication |
| Market Data | Data Team | Ingestion, normalization, quality |
| Portfolio Data | Portfolio Team | Position accuracy, reconciliation |
| Compliance Rules | Compliance Team | Rule accuracy, jurisdiction mapping |
| User Data | Product Team | Privacy, consent, access control |

### 7.2 Data Lineage

Every data transformation is tracked:

```sql
CREATE TABLE data_governance.lineage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table TEXT,
    source_column TEXT,
    transformation TEXT, -- SQL or description
    target_table TEXT,
    target_column TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Example
INSERT INTO data_governance.lineage VALUES (
    gen_random_uuid(),
    'market_data.prices',
    'close_price',
    'AVG(close_price) OVER (ORDER BY timestamp ROWS BETWEEN 49 PRECEDING AND CURRENT ROW)',
    'market_data.calculated_metrics',
    'moving_avg_50d',
    now()
);
```

### 7.3 Data Versioning

Critical reference data (security master, compliance rules) is versioned:

```sql
-- Add to each governed table
ALTER TABLE security_master.instruments ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE security_master.instruments ADD COLUMN valid_from TIMESTAMPTZ DEFAULT now();
ALTER TABLE security_master.instruments ADD COLUMN valid_to TIMESTAMPTZ;

-- Audit table for changes
CREATE TABLE data_governance.change_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT,
    record_id UUID,
    old_version INTEGER,
    new_version INTEGER,
    changes JSONB, -- {"field": {"old": "...", "new": "..."}}
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT now(),
    reason TEXT
);
```

### 7.4 Data Dictionary

Maintained as a queryable table:

```sql
CREATE TABLE data_governance.data_dictionary (
    table_schema TEXT,
    table_name TEXT,
    column_name TEXT,
    data_type TEXT,
    is_nullable BOOLEAN,
    description TEXT,
    business_definition TEXT,
    example_value TEXT,
    valid_values TEXT[], -- For enums
    pii_classification VARCHAR(20), -- 'none', 'sensitive', 'highly_sensitive'
    update_frequency VARCHAR(50),
    data_owner TEXT,
    
    PRIMARY KEY (table_schema, table_name, column_name)
);
```

---

## Conclusion

The MOBU data model is designed for:
- ✅ **Transparency**: Graph enables queryable evidence trails
- ✅ **Integrity**: Relational DB ensures ACID compliance
- ✅ **Performance**: Time-series DB optimized for market data
- ✅ **Standards**: Aligned with ISO and industry standards
- ✅ **Governance**: Versioned, owned, auditable

This hybrid approach gives us the best of all worlds: relationship reasoning, transactional integrity, and analytical performance.

---

*Next: 04_Implementation_Strategy.md — Build roadmap and technical specifications*
