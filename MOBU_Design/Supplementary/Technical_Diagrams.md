# MOBU Investment Platform
## Technical Diagrams & Visualizations

**Purpose**: Visual architecture reference for engineering team  
**Audience**: Engineers, architects, technical stakeholders  
**Last Updated**: September 2026

---

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Data Flow Diagrams](#2-data-flow-diagrams)
3. [Neo4j Graph Schema](#3-neo4j-graph-schema)
4. [Database Schema (PostgreSQL)](#4-database-schema-postgresql)
5. [Deployment Architecture](#5-deployment-architecture)
6. [Integration Architecture](#6-integration-architecture)
7. [Security Architecture](#7-security-architecture)

---

## 1. High-Level System Architecture

### 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Web App     │  │  Mobile App  │  │   Advisor    │              │
│  │  (React)     │  │ (React Native│  │   Portal     │              │
│  │              │  │  iOS/Android)│  │              │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┼──────────────────┘                       │
│                            │                                          │
│                            │  HTTPS/WSS                               │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────────┐
│                       API GATEWAY LAYER                               │
├────────────────────────────┼──────────────────────────────────────────┤
│                            ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │         Kong API Gateway / Azure Application Gateway         │    │
│  │  • Rate Limiting  • Authentication  • Routing                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────────┐
│                      APPLICATION LAYER                                │
├────────────────────────────┼──────────────────────────────────────────┤
│                            ▼                                          │
│  ┌───────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  Auth     │  │ Recommendation│  │ Portfolio  │  │  Evidence   │  │
│  │  Service  │  │    Engine     │  │  Service   │  │   Service   │  │
│  │ (FastAPI) │  │  (FastAPI)    │  │ (FastAPI)  │  │  (FastAPI)  │  │
│  └─────┬─────┘  └───────┬───────┘  └─────┬──────┘  └──────┬──────┘  │
│        │                │                 │                │          │
│  ┌─────┴────────────────┴─────────────────┴────────────────┴──────┐  │
│  │                     GraphQL Gateway (Apollo)                    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────────┐
│                         DATA LAYER                                    │
├────────────────────────────┼──────────────────────────────────────────┤
│                            ▼                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │    Neo4j     │  │ TimescaleDB  │              │
│  │  (Transact)  │  │  (Knowledge  │  │ (Time-Series)│              │
│  │              │  │    Graph)    │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    Redis     │  │  Blob Storage│  │  Elasticsearch│              │
│  │   (Cache)    │  │  (Documents) │  │   (Search)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION LAYER                                │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Market     │  │   News API   │  │   Banking    │              │
│  │   Data       │  │   (Alpha     │  │   (Plaid/    │              │
│  │ (JSE, NGX)   │  │   Vantage)   │  │   Yodlee)    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                      EVENT STREAMING                                  │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  Apache Kafka Cluster                          │  │
│  │  Topics: market-data, user-events, recommendation-computed    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagrams

### 2.1 User Onboarding Flow

```
┌──────────┐
│  User    │
│ Arrives  │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Registration    │
│ • Email/Phone   │──────┐
│ • Password      │      │
│ • KYC Info      │      │
└────┬────────────┘      │
     │                   │
     ▼                   ▼
┌─────────────────┐  ┌──────────────┐
│ Auth Service    │  │  KYC Service │
│ • Create User   │  │  • Verify ID │
│ • Send OTP      │  │  • FICA Check│
└────┬────────────┘  └──────┬───────┘
     │                      │
     ▼                      │
┌─────────────────┐         │
│ OTP Verification│         │
│ • Email/SMS     │         │
└────┬────────────┘         │
     │                      │
     │◄─────────────────────┘
     │
     ▼
┌─────────────────┐
│ Risk Profile    │
│ Questionnaire   │
│ • Horizon       │
│ • Risk Appetite │
│ • Goals         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Store in DB     │
│ PostgreSQL:     │
│ • users         │
│ • risk_profiles │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Dashboard       │
│ (First Login)   │
└─────────────────┘
```

---

### 2.2 Recommendation Generation Flow

```
┌──────────────┐
│ Trigger:     │
│ • Daily Cron │
│ • User       │
│   Request    │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Recommendation Engine  │
│ Service                │
└────────┬───────────────┘
         │
         ▼
    ┌────────────┐
    │ Get User   │
    │ Context    │
    └─────┬──────┘
          │
          ▼
┌─────────────────────────────────┐
│ Query Neo4j Knowledge Graph     │
│                                 │
│ MATCH (user:Investor)-[:HAS]-  │
│   >(profile:RiskProfile)        │
│ MATCH (security:Security)       │
│ WHERE security.risk <= profile  │
│ RETURN security, reasons        │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────┐
│ ML Model Scoring        │
│ • Feature Engineering   │
│ • Score Securities      │
│ • Rank by Fit           │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Generate Evidence Trail │
│ • Query graph for paths │
│ • Build reasoning chain │
│ • Format for display    │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Store Results           │
│ PostgreSQL:             │
│ • recommendations       │
│ Neo4j:                  │
│ • RECOMMENDED edges     │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Publish Event           │
│ Kafka Topic:            │
│ recommendation-computed │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Notify User             │
│ • Push Notification     │
│ • Email (if opted-in)   │
└─────────────────────────┘
```

---

### 2.3 Trade Execution Flow

```
┌──────────┐
│  User    │
│  Clicks  │
│  "Buy"   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Portfolio       │
│ Service         │
│ • Validate      │
│ • Check Balance │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Create Order    │
│ PostgreSQL:     │
│ • orders table  │
│ status=PENDING  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Broker API      │
│ (e.g., EasyEqui)│
│ • Place Order   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Poll for        │
│ Execution       │
│ (async)         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Order Filled    │
│ Update:         │
│ status=EXECUTED │
│ fill_price=X    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Update Holdings │
│ PostgreSQL:     │
│ • holdings      │
│ • transactions  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Notify User     │
│ • Push          │
│ • In-App        │
└─────────────────┘
```

---

## 3. Neo4j Graph Schema

### 3.1 Node Types and Relationships

```
                    ┌──────────────┐
                    │   Investor   │
                    │ • user_id    │
                    │ • name       │
                    └──────┬───────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
        [:HAS]  │  [:HOLDS]│  [:ASKED]│
                │          │          │
                ▼          ▼          ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │ RiskProfile  │ │   Holding    │ │   Question   │
      │ • horizon    │ │ • quantity   │ │ • text       │
      │ • risk_score │ │ • cost_basis │ │ • timestamp  │
      └──────────────┘ └──────┬───────┘ └──────────────┘
                              │
                      [:OF]   │
                              │
                              ▼
                    ┌──────────────┐
                    │  Security    │
                    │ • ticker     │
                    │ • name       │
                    │ • asset_type │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
 [:LISTED_ON]        [:IN_SECTOR]      [:HAS_METRIC]
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Exchange   │   │    Sector    │   │   Metric     │
│ • code       │   │ • name       │   │ • name       │
│ • country    │   │ • gics_code  │   │ • value      │
└──────────────┘   └──────┬───────┘   │ • date       │
                          │           └──────────────┘
                   [:PART_OF]
                          │
                          ▼
                   ┌──────────────┐
                   │  Industry    │
                   │ • name       │
                   └──────────────┘


        ┌──────────────┐
        │  Regulator   │
        │ • name       │
        └──────┬───────┘
               │
      [:ISSUED]│
               │
               ▼
        ┌──────────────┐
        │  Regulation  │
        │ • title      │
        │ • date       │
        └──────┬───────┘
               │
     [:AFFECTS]│
               │
               ▼
        ┌──────────────┐
        │  Security    │
        └──────────────┘
```

---

### 3.2 Example Recommendation Path

```
Recommendation: "Buy Shoprite (SHP.JO)"

Path in Graph:

(user:Investor {user_id: 123})
  |
  [:HAS]
  |
  v
(profile:RiskProfile {risk_score: 4, horizon: "5_years"})
  |
  [:COMPATIBLE_WITH]  <-- Computed relationship
  |
  v
(security:Security {ticker: "SHP.JO", name: "Shoprite"})
  |
  [:HAS_METRIC]
  |
  v
(metric:Metric {name: "PE_Ratio", value: 12.5, date: "2026-09-01"})
  |
  [:BELOW_SECTOR_AVG]  <-- Reasoning edge
  |
  v
(sector:Sector {name: "Consumer Staples", avg_pe: 18.2})

Evidence Trail:
1. Your risk profile (score: 4/10) matches Shoprite's volatility (beta: 0.8)
2. Shoprite's P/E ratio (12.5) is 31% below sector average (18.2)
3. Consumer Staples sector is defensive (good for 5-year horizon)
4. Shoprite is listed on JSE (your preferred exchange)
```

---

## 4. Database Schema (PostgreSQL)

### 4.1 Core Tables

```sql
-- Users and Authentication
┌─────────────────────────────────────────┐
│              users                      │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ email           VARCHAR(255) UNIQUE     │
│ phone           VARCHAR(20)  UNIQUE     │
│ password_hash   VARCHAR(255)            │
│ kyc_status      ENUM (PENDING,VERIFIED) │
│ created_at      TIMESTAMP               │
│ last_login      TIMESTAMP               │
└─────────────────────────────────────────┘
             │
             │ 1:1
             ▼
┌─────────────────────────────────────────┐
│         risk_profiles                   │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ user_id         UUID         FK → users │
│ horizon         VARCHAR(20)             │
│ risk_score      INT (1-10)              │
│ income          DECIMAL                 │
│ investable_cash DECIMAL                 │
│ updated_at      TIMESTAMP               │
└─────────────────────────────────────────┘


-- Securities Master
┌─────────────────────────────────────────┐
│           securities                    │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ ticker          VARCHAR(20)  UNIQUE     │
│ name            VARCHAR(255)            │
│ asset_type      VARCHAR(50)             │
│ exchange_code   VARCHAR(10)             │
│ sector          VARCHAR(100)            │
│ currency        VARCHAR(3)              │
│ status          VARCHAR(20)             │
└─────────────────────────────────────────┘
             │
             │ 1:N
             ▼
┌─────────────────────────────────────────┐
│          price_history                  │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ security_id     UUID         FK         │
│ date            DATE                    │
│ open            DECIMAL                 │
│ high            DECIMAL                 │
│ low             DECIMAL                 │
│ close           DECIMAL                 │
│ volume          BIGINT                  │
│ PRIMARY KEY (security_id, date)         │
└─────────────────────────────────────────┘


-- Portfolio Management
┌─────────────────────────────────────────┐
│            portfolios                   │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ user_id         UUID         FK → users │
│ name            VARCHAR(100)            │
│ type            VARCHAR(50)             │
│ cash_balance    DECIMAL                 │
│ created_at      TIMESTAMP               │
└─────────────────────────────────────────┘
             │
             │ 1:N
             ▼
┌─────────────────────────────────────────┐
│            holdings                     │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ portfolio_id    UUID         FK         │
│ security_id     UUID         FK         │
│ quantity        DECIMAL                 │
│ avg_cost        DECIMAL                 │
│ updated_at      TIMESTAMP               │
│ UNIQUE (portfolio_id, security_id)      │
└─────────────────────────────────────────┘


-- Recommendations
┌─────────────────────────────────────────┐
│        recommendations                  │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ user_id         UUID         FK → users │
│ security_id     UUID         FK         │
│ action          VARCHAR(10) (BUY/SELL)  │
│ confidence      DECIMAL (0-1)           │
│ price_target    DECIMAL                 │
│ reasoning       JSONB                   │
│ created_at      TIMESTAMP               │
│ expires_at      TIMESTAMP               │
│ status          VARCHAR(20)             │
└─────────────────────────────────────────┘


-- Orders and Transactions
┌─────────────────────────────────────────┐
│              orders                     │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ user_id         UUID         FK         │
│ security_id     UUID         FK         │
│ type            VARCHAR(10) (BUY/SELL)  │
│ quantity        DECIMAL                 │
│ limit_price     DECIMAL                 │
│ status          VARCHAR(20)             │
│ created_at      TIMESTAMP               │
│ filled_at       TIMESTAMP               │
│ fill_price      DECIMAL                 │
└─────────────────────────────────────────┘
             │
             │ 1:1 (when filled)
             ▼
┌─────────────────────────────────────────┐
│          transactions                   │
├─────────────────────────────────────────┤
│ id              UUID         PK         │
│ order_id        UUID         FK         │
│ portfolio_id    UUID         FK         │
│ security_id     UUID         FK         │
│ type            VARCHAR(10)             │
│ quantity        DECIMAL                 │
│ price           DECIMAL                 │
│ fees            DECIMAL                 │
│ executed_at     TIMESTAMP               │
└─────────────────────────────────────────┘
```

---

### 4.2 Indexes for Performance

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Securities
CREATE INDEX idx_securities_ticker ON securities(ticker);
CREATE INDEX idx_securities_exchange ON securities(exchange_code);
CREATE INDEX idx_securities_sector ON securities(sector);

-- Price History (TimescaleDB hypertable)
CREATE INDEX idx_price_history_security_date 
  ON price_history(security_id, date DESC);

-- Holdings
CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
CREATE INDEX idx_holdings_security ON holdings(security_id);

-- Recommendations
CREATE INDEX idx_recommendations_user_created 
  ON recommendations(user_id, created_at DESC);
CREATE INDEX idx_recommendations_security 
  ON recommendations(security_id);
CREATE INDEX idx_recommendations_status 
  ON recommendations(status) WHERE status = 'ACTIVE';

-- Orders
CREATE INDEX idx_orders_user_created 
  ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status 
  ON orders(status) WHERE status IN ('PENDING', 'PARTIAL');
```

---

## 5. Deployment Architecture

### 5.1 Azure Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AZURE CLOUD                                  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                VNet (10.0.0.0/16)                             │ │
│  │            Resource Group: mobu-prod                          │ │
│  │            Region: South Africa North (Johannesburg)          │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │         Public Subnet (10.0.1.0/24)                     │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────┐    ┌──────────────────┐          │ │ │
│  │  │  │  Application     │    │  NAT Gateway     │          │ │ │
│  │  │  │  Gateway (HTTPS) │    │                  │          │ │ │
│  │  │  │  • SSL Cert      │    │                  │          │ │ │
│  │  │  │  • WAF enabled   │    │                  │          │ │ │
│  │  │  └────────┬─────────┘    └──────────────────┘          │ │ │
│  │  │           │                                             │ │ │
│  │  └───────────┼─────────────────────────────────────────────┘ │ │
│  │              │                                               │ │
│  │  ┌───────────┼─────────────────────────────────────────────┐ │ │
│  │  │    Private Subnet (10.0.2.0/24) - Zone 1               │ │ │
│  │  │           │                                             │ │ │
│  │  │  ┌────────▼────────┐    ┌──────────────────┐           │ │ │
│  │  │  │   AKS Cluster   │    │  Azure Database  │           │ │ │
│  │  │  │  (Worker Nodes) │    │  for PostgreSQL  │           │ │ │
│  │  │  │                 │    │  (Primary)       │           │ │ │
│  │  │  │  • API Pods     │    │  • B_Standard_B2s│           │ │ │
│  │  │  │  • Engine Pods  │    └──────────────────┘           │ │ │
│  │  │  └─────────────────┘                                   │ │ │
│  │  │                         ┌──────────────────┐           │ │ │
│  │  │                         │  Neo4j           │           │ │ │
│  │  │                         │  on Azure VMs    │           │ │ │
│  │  │                         │  • 3 Core Nodes  │           │ │ │
│  │  │                         └──────────────────┘           │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │    Private Subnet (10.0.3.0/24) - Zone 2               │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────┐    ┌──────────────────┐          │ │ │
│  │  │  │   AKS Cluster    │    │  Azure Database  │          │ │ │
│  │  │  │  (Worker Nodes)  │    │  for PostgreSQL  │          │ │ │
│  │  │  │                  │    │  (Replica)       │          │ │ │
│  │  │  └──────────────────┘    └──────────────────┘          │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │    Private Subnet (10.0.4.0/24) - Data Services        │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────┐    ┌──────────────────┐          │ │ │
│  │  │  │  Azure Cache     │    │  Event Hubs      │          │ │ │
│  │  │  │  for Redis       │    │  (Kafka API)     │          │ │ │
│  │  │  │  • Premium tier  │    │  • 3 partitions  │          │ │ │
│  │  │  └──────────────────┘    └──────────────────┘          │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    External Services                          │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │ Blob Storage │  │ Azure Monitor│  │ Communication│       │ │
│  │  │  • Backups   │  │  • Logs      │  │ Services     │       │ │
│  │  │  • Documents │  │  • Metrics   │  │  • Email/SMS │       │ │
│  │  │  • Hot tier  │  │  • Alerts    │  │              │       │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │  Key Vault   │  │  Container   │  │  Azure DDoS  │       │ │
│  │  │  • Secrets   │  │  Registry    │  │  Protection  │       │ │
│  │  │  • Keys      │  │  (ACR)       │  │              │       │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Kubernetes (AKS) Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AKS Cluster                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Namespace: mobu-prod                     │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │         Ingress Controller (nginx)              │ │ │
│  │  │  • Routes traffic to services                   │ │ │
│  │  └──────────────────┬──────────────────────────────┘ │ │
│  │                     │                                │ │
│  │  ┌──────────────────┼────────────────┐              │ │
│  │  │                  │                │              │ │
│  │  │  ┌───────────────▼──────────┐    │              │ │
│  │  │  │   API Gateway Service    │    │              │ │
│  │  │  │   • 3 replicas           │    │              │ │
│  │  │  │   • HPA (2-10 pods)      │    │              │ │
│  │  │  └───────────┬──────────────┘    │              │ │
│  │  │              │                   │              │ │
│  │  │  ┌───────────┼───────────────────┼───────┐      │ │
│  │  │  │           │                   │       │      │ │
│  │  │  │  ┌────────▼─────┐  ┌─────────▼──┐  ┌─▼────┐ │ │
│  │  │  │  │ Auth Service │  │ Rec Engine │  │Port- │ │ │
│  │  │  │  │ • 2 replicas │  │ • 3 replicas  │folio │ │ │
│  │  │  │  └──────────────┘  └────────────┘  │Svc   │ │ │
│  │  │  │                                    └──────┘ │ │
│  │  │  └────────────────────────────────────────────┘ │ │
│  │  │                                                 │ │
│  │  │  ┌─────────────────────────────────────────┐   │ │
│  │  │  │        Background Workers              │   │ │
│  │  │  │                                        │   │ │
│  │  │  │  ┌──────────────────────────────────┐  │   │ │
│  │  │  │  │  Data Ingestion Worker          │  │   │ │
│  │  │  │  │  • CronJob (every 5 min)        │  │   │ │
│  │  │  │  └──────────────────────────────────┘  │   │ │
│  │  │  │                                        │   │ │
│  │  │  │  ┌──────────────────────────────────┐  │   │ │
│  │  │  │  │  Recommendation Generator       │  │   │ │
│  │  │  │  │  • CronJob (daily 6am)          │  │   │ │
│  │  │  │  └──────────────────────────────────┘  │   │ │
│  │  │  └─────────────────────────────────────────┘   │ │
│  │  └─────────────────────────────────────────────────┘ │
│  │                                                       │
│  │  ┌─────────────────────────────────────────────────┐ │
│  │  │              ConfigMaps & Secrets               │ │
│  │  │  • DB connection strings                        │ │
│  │  │  • API keys (from Key Vault)                    │ │
│  │  │  • Feature flags                                │ │
│  │  └─────────────────────────────────────────────────┘ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Integration Architecture

### 6.1 External Integrations

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBU Platform                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Market Data  │ │   News API   │ │   Banking    │
│ Providers    │ │              │ │   APIs       │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       │                │                │
   ┌───┴───┐        ┌───┴───┐       ┌────┴────┐
   │       │        │       │       │         │
   ▼       ▼        ▼       ▼       ▼         ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌──────┐
│ JSE │ │ NGX │ │Alpha│ │Bloomb│ │Plaid │ │Yodlee│
│     │ │     │ │Vanta│ │-erg  │ │      │ │      │
└─────┘ └─────┘ └─────┘ └─────┘ └──────┘ └──────┘

South    Nigeria  General News    Account  Account
Africa           Market            Aggr     Aggr
Exchange Exchange Data            (US)     (Global)
```

**Integration Patterns**:

1. **JSE/NGX (Market Data)**:
   - Protocol: REST API
   - Frequency: Real-time (WebSocket) + EOD batch
   - Data: Prices, volumes, fundamentals
   - Fallback: CSV download if API down

2. **Alpha Vantage (Market Data)**:
   - Protocol: REST API
   - Frequency: Daily batch (free tier: 5 calls/min)
   - Data: International stocks, forex, crypto
   - Caching: 24 hours

3. **Bloomberg (Premium Data)**:
   - Protocol: BLPAPI (if budget allows)
   - Frequency: Real-time
   - Data: Analyst estimates, news sentiment
   - Cost: ~$2K/month (Phase 1B+)

4. **Plaid (Banking)**:
   - Protocol: REST API
   - Purpose: Link US bank accounts
   - Flow: OAuth → token → periodic sync
   - Data: Balances, transactions

5. **Yodlee (Banking)**:
   - Protocol: REST API
   - Purpose: Link African bank accounts (limited coverage)
   - Alternative: Manual CSV upload (Phase 1A)

---

### 6.2 Webhook Architecture

```
External Service               MOBU Platform
(e.g., Broker)
                              
┌──────────────┐             ┌──────────────┐
│ Order Filled │────────────▶│ Webhook      │
│ Event        │  HTTPS POST │ Endpoint     │
└──────────────┘             │ /api/webhook/│
                             │ order-update │
                             └──────┬───────┘
                                    │
                                    ▼
                             ┌──────────────┐
                             │ Verify       │
                             │ Signature    │
                             │ (HMAC-SHA256)│
                             └──────┬───────┘
                                    │
                                    ▼
                             ┌──────────────┐
                             │ Publish to   │
                             │ Kafka Topic  │
                             │ "webhooks"   │
                             └──────┬───────┘
                                    │
                                    ▼
                             ┌──────────────┐
                             │ Consumer     │
                             │ Processes    │
                             │ Event        │
                             └──────┬───────┘
                                    │
                                    ▼
                             ┌──────────────┐
                             │ Update DB    │
                             │ • orders     │
                             │ • holdings   │
                             └──────────────┘
```

---

## 7. Security Architecture

### 7.1 Authentication Flow (JWT)

```
┌──────────┐                                    ┌──────────────┐
│  Client  │                                    │ Auth Service │
└─────┬────┘                                    └──────┬───────┘
      │                                                │
      │  1. POST /auth/login                          │
      │     {email, password}                         │
      ├──────────────────────────────────────────────▶│
      │                                                │
      │                                         2. Verify password
      │                                         (bcrypt.compare)
      │                                                │
      │                                         3. Generate JWT
      │                                         • sub: user_id
      │                                         • exp: 15min
      │                                                │
      │  4. Return tokens                             │
      │     {access_token, refresh_token}             │
      │◀──────────────────────────────────────────────┤
      │                                                │
      │  5. Subsequent requests                       │
      │     Authorization: Bearer <token>             │
      ├──────────────────────────────────────────────▶│
      │                                                │
      │                                         6. Verify JWT
      │                                         (signature + exp)
      │                                                │
      │  7. Response                                  │
      │◀──────────────────────────────────────────────┤
      │                                                │
```

**Token Structure**:
```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "role": "investor",
  "iat": 1693526400,
  "exp": 1693527300
}
```

---

### 7.2 Data Encryption

```
┌─────────────────────────────────────────────────────────────┐
│                    Encryption Layers                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: In-Transit (TLS 1.3)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Client ◄──── HTTPS (TLS 1.3) ────▶ Load Balancer   │   │
│  │ ALB    ◄──── TLS (internal) ────▶ Kubernetes Pods  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 2: At-Rest (AES-256)                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ RDS: Encrypted volumes (AWS KMS)                    │   │
│  │ S3: Server-side encryption (SSE-S3)                 │   │
│  │ EBS: Encrypted volumes (KMS keys)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 3: Application-Level (Field Encryption)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PII Fields (SSN, ID numbers):                       │   │
│  │   • Encrypted with Fernet (Python cryptography)     │   │
│  │   • Key stored in AWS Secrets Manager               │   │
│  │ Example:                                            │   │
│  │   plaintext: "8001015009087"                        │   │
│  │   ciphertext: "gAAAAABjK8X..."                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.3 Network Security

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    WAF (CloudFlare)                         │
│  • DDoS protection                                          │
│  • SQL injection filtering                                  │
│  • Rate limiting (100 req/min per IP)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  AWS Shield (DDoS)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            Application Load Balancer (ALB)                  │
│  • SSL termination                                          │
│  • Security groups (only 443)                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   VPC (Private Subnets)                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  EKS Cluster                                          │ │
│  │  • Network policies (Calico)                          │ │
│  │  • Pod security policies                              │ │
│  │  • No direct internet access                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Databases (RDS, Neo4j)                               │ │
│  │  • Security groups (only from EKS)                    │ │
│  │  • No public IPs                                      │ │
│  │  • Encrypted connections                              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Security Group Rules**:
```
ALB Security Group:
  Inbound:  0.0.0.0/0:443 (HTTPS from internet)
  Outbound: 10.0.0.0/16:* (to VPC)

EKS Security Group:
  Inbound:  ALB SG:* (from load balancer only)
  Outbound: 0.0.0.0/0:443 (for external API calls)

RDS Security Group:
  Inbound:  AKS SG:5432 (PostgreSQL from pods only)
  Outbound: None
```

---

### 7.4 Secrets Management

```
┌─────────────────────────────────────────────────────────────┐
│              Azure Key Vault                                │
│                                                             │
│  • DB credentials (rotated monthly)                         │
│  • API keys (3rd party services)                            │
│  • Encryption keys (Fernet key for PII)                     │
│  • JWT signing secret                                       │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Managed Identity
                           │ (AKS Service Account)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Kubernetes Cluster                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Azure Key Vault Provider for Secrets Store CSI       │ │
│  │  • Syncs secrets every 1 hour                         │ │
│  │  • Creates K8s Secrets from Azure Key Vault           │ │
│  └───────────────────────┬───────────────────────────────┘ │
│                          │                                 │
│                          ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Kubernetes Secrets                                   │ │
│  │  • mobu-db-credentials                                │ │
│  │  • mobu-api-keys                                      │ │
│  └───────────────────────┬───────────────────────────────┘ │
│                          │                                 │
│                          │ Mounted as env vars             │
│                          │                                 │
│                          ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Application Pods                                     │ │
│  │  env:                                                 │ │
│  │    DB_URL: $(DB_CREDENTIALS_URL)                      │ │
│  │    API_KEY: $(ALPHA_VANTAGE_KEY)                      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Monitoring & Observability

### 8.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FastAPI Services                                   │   │
│  │  • Prometheus client (metrics)                      │   │
│  │  • Structured logging (JSON)                        │   │
│  └──────────────────┬──────────────────────────────────┘   │
└────────────────────┬┼───────────────────────────────────────┘
                     ││
         ┌───────────┘└───────────┐
         │ Metrics                │ Logs
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│   Prometheus     │     │  Azure Monitor   │
│   • Scrape /     │     │  Logs            │
│     metrics      │     │  • Log Analytics │
│   • 15s interval │     │  • Retention:    │
│                  │     │    30 days       │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │ Query                  │ Query (KQL)
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│    Grafana       │     │  Azure Monitor   │
│    Dashboards    │     │  Workbooks       │
│  • System health │     │  • Error queries │
│  • Business KPIs │     │  • Custom viz    │
└──────────────────┘     └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Alerting Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Azure Monitor Alerts                               │   │
│  │  • Routes alerts                                    │   │
│  │  • Action Groups                                    │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                       │
│      ┌──────────────┼──────────────┐                       │
│      │              │              │                       │
│      ▼              ▼              ▼                       │
│  ┌───────┐     ┌────────┐     ┌───────┐                   │
│  │ Email │     │ Slack  │     │PagerDu│                   │
│  │       │     │        │     │ty     │                   │
│  └───────┘     └────────┘     └───────┘                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- **System**: CPU, memory, disk, network
- **Application**: Request rate, latency (p50, p95, p99), error rate
- **Business**: Daily active users, recommendations generated, orders placed
- **Database**: Query latency, connection pool usage, slow queries

**Alert Examples** (KQL):
```kusto
// High Error Rate
requests
| where timestamp > ago(5m)
| where resultCode startswith "5"
| summarize errorRate = count() by bin(timestamp, 1m)
| where errorRate > 50

// Database Down
Heartbeat
| where Computer contains "postgresql"
| summarize LastHeartbeat = max(TimeGenerated) by Computer
| where LastHeartbeat < ago(5m)

// Recommendation Job Failed
KubePodInventory
| where Name contains "recommendation-generator"
| where ContainerStatusReason == "Error"
```

---

## Conclusion

This document provides visual references for MOBU's technical architecture. Use these diagrams during:

- **Architecture reviews**: Ensure everyone understands system design
- **Onboarding**: Help new engineers visualize the platform
- **Debugging**: Trace data flows when investigating issues
- **Capacity planning**: Identify bottlenecks before they occur

**Living Document**: Update diagrams as architecture evolves (especially during Phase 1B when mobile apps and more integrations are added).

---

**Document Version**: 1.0  
**Last Updated**: September 2026  
**Owner**: Head of Engineering

*For implementation details, see: 02_System_Architecture.md, 03_Data_Model.md, 06_API_Specification.md*
