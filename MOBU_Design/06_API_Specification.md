# MOBU Investment Platform
## API Specification & Integration Guide

**Version:** 1.0  
**Date:** September 2026  
**Status:** Complete API Reference

---

## Table of Contents

1. [API Overview](#1-api-overview)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [REST API Endpoints](#3-rest-api-endpoints)
4. [GraphQL API](#4-graphql-api)
5. [WebSocket APIs](#5-websocket-apis)
6. [Webhooks](#6-webhooks)
7. [Rate Limiting](#7-rate-limiting)
8. [Error Handling](#8-error-handling)
9. [Code Examples](#9-code-examples)
10. [API Changelog](#10-api-changelog)

---

## 1. API Overview

### 1.1 Base URLs

**Environments**:
```
Production:  https://api.mobu.platform/v1
Staging:     https://api-staging.mobu.platform/v1
Sandbox:     https://api-sandbox.mobu.platform/v1
```

### 1.2 API Protocols

MOBU offers three API styles:

| Protocol | Use Case | Base Path |
|----------|----------|-----------|
| **REST** | CRUD operations, simple queries | `/v1/rest` |
| **GraphQL** | Complex queries, flexible data fetching | `/v1/graphql` |
| **WebSocket** | Real-time updates, streaming data | `wss://api.mobu.platform/v1/ws` |

### 1.3 Content Types

**Request**:
- `Content-Type: application/json`
- `Content-Type: application/graphql` (GraphQL only)

**Response**:
- `Content-Type: application/json`

### 1.4 Date/Time Format

All timestamps in **ISO 8601** format with timezone:
```
2026-09-05T14:30:00+02:00
```

### 1.5 Currency Format

All monetary values as **strings** to avoid floating-point issues:
```json
{
  "amount": "1234.56",
  "currency": "ZAR"
}
```

---

## 2. Authentication & Authorization

### 2.1 Authentication Methods

**OAuth 2.0 with JWT** (Recommended for user apps)

**Step 1: Obtain Access Token**
```http
POST /v1/auth/token
Content-Type: application/json

{
  "grant_type": "password",
  "email": "user@example.com",
  "password": "secure_password",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "read write"
}
```

**Step 2: Use Access Token**
```http
GET /v1/portfolios
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**API Keys** (For server-to-server)

Generate in dashboard: Settings → API Keys

```http
GET /v1/portfolios
X-API-Key: mobu_live_abc123def456
```

**Security**:
- Keep API keys secret
- Rotate regularly
- Use different keys for dev/prod
- Scope keys to minimum required permissions

---

### 2.2 Token Refresh

```http
POST /v1/auth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "your_refresh_token",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

---

### 2.3 Permissions & Scopes

| Scope | Description | Required For |
|-------|-------------|--------------|
| `portfolios:read` | View portfolios | All read operations |
| `portfolios:write` | Create/update portfolios | Portfolio management |
| `trades:execute` | Execute trades | Order placement |
| `recommendations:read` | View recommendations | Investment discovery |
| `compliance:read` | View compliance status | Compliance checks |
| `admin:manage` | Full admin access | Platform administration |

**Example Token Payload**:
```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "scopes": ["portfolios:read", "portfolios:write", "recommendations:read"],
  "user_type": "retail",
  "iat": 1725539400,
  "exp": 1725543000
}
```

---

## 3. REST API Endpoints

### 3.1 Users

#### Register New User
```http
POST /v1/users/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "country": "ZA",
  "accept_terms": true
}
```

**Response**: `201 Created`
```json
{
  "user_id": "usr_abc123",
  "email": "newuser@example.com",
  "full_name": "John Doe",
  "email_verified": false,
  "created_at": "2026-09-05T14:30:00Z"
}
```

#### Get User Profile
```http
GET /v1/users/me
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "user_id": "usr_abc123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "user_type": "retail",
  "country": "ZA",
  "mfa_enabled": true,
  "email_verified": true,
  "created_at": "2026-01-15T10:00:00Z",
  "preferences": {
    "currency": "ZAR",
    "language": "en",
    "notifications_enabled": true
  }
}
```

#### Update User Profile
```http
PATCH /v1/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "John Smith",
  "preferences": {
    "currency": "USD"
  }
}
```

---

### 3.2 Portfolios

#### List Portfolios
```http
GET /v1/portfolios
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (active, archived)

**Response**: `200 OK`
```json
{
  "data": [
    {
      "portfolio_id": "port_abc123",
      "name": "My Retirement Portfolio",
      "portfolio_type": "client",
      "base_currency": "ZAR",
      "inception_date": "2026-01-15",
      "current_value": "125450.75",
      "cost_basis": "100000.00",
      "total_return": "0.2545",
      "status": "active",
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-09-05T14:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 3,
    "total_pages": 1
  }
}
```

#### Create Portfolio
```http
POST /v1/portfolios
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Growth Portfolio",
  "portfolio_type": "client",
  "base_currency": "ZAR",
  "inception_date": "2026-09-05",
  "mandate": "Aggressive growth, tech-focused"
}
```

**Response**: `201 Created`
```json
{
  "portfolio_id": "port_xyz789",
  "name": "Growth Portfolio",
  "portfolio_type": "client",
  "base_currency": "ZAR",
  "inception_date": "2026-09-05",
  "current_value": "0.00",
  "status": "active",
  "created_at": "2026-09-05T14:30:00Z"
}
```

#### Get Portfolio Details
```http
GET /v1/portfolios/{portfolio_id}
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "portfolio_id": "port_abc123",
  "name": "My Retirement Portfolio",
  "portfolio_type": "client",
  "base_currency": "ZAR",
  "inception_date": "2026-01-15",
  "current_value": "125450.75",
  "cost_basis": "100000.00",
  "cash_balance": "5450.75",
  "total_return": "0.2545",
  "daily_return": "0.0023",
  "benchmark_id": "JSE_TOP40",
  "benchmark_return": "0.1890",
  "active_return": "0.0655",
  "holdings_count": 12,
  "status": "active",
  "risk_metrics": {
    "beta": 1.15,
    "volatility": 0.18,
    "sharpe_ratio": 1.42,
    "max_drawdown": -0.12
  },
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-09-05T14:30:00Z"
}
```

#### Get Portfolio Holdings
```http
GET /v1/portfolios/{portfolio_id}/holdings
Authorization: Bearer {token}
```

**Query Parameters**:
- `as_of_date` (date): Historical snapshot (default: today)

**Response**: `200 OK`
```json
{
  "portfolio_id": "port_abc123",
  "as_of_date": "2026-09-05",
  "total_value": "125450.75",
  "holdings": [
    {
      "instrument_id": "inst_sasol_123",
      "isin": "ZAE000015889",
      "name": "Sasol Limited",
      "asset_class": "equity",
      "quantity": "350.00",
      "average_cost": "280.50",
      "current_price": "320.50",
      "market_value": "112175.00",
      "cost_basis": "98175.00",
      "unrealized_gain": "14000.00",
      "unrealized_gain_pct": "0.1426",
      "weight": "0.0894",
      "currency": "ZAR",
      "last_updated": "2026-09-05T16:00:00Z"
    },
    {
      "instrument_id": "inst_naspers_456",
      "isin": "ZAE000015889",
      "name": "Naspers Limited",
      "asset_class": "equity",
      "quantity": "25.00",
      "average_cost": "3200.00",
      "current_price": "3450.00",
      "market_value": "86250.00",
      "cost_basis": "80000.00",
      "unrealized_gain": "6250.00",
      "unrealized_gain_pct": "0.0781",
      "weight": "0.0687",
      "currency": "ZAR",
      "last_updated": "2026-09-05T16:00:00Z"
    }
  ]
}
```

#### Delete Portfolio
```http
DELETE /v1/portfolios/{portfolio_id}
Authorization: Bearer {token}
```

**Response**: `204 No Content`

---

### 3.3 Transactions

#### Create Transaction
```http
POST /v1/portfolios/{portfolio_id}/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "transaction_type": "buy",
  "instrument_isin": "ZAE000015889",
  "quantity": "100.00",
  "price": "320.50",
  "transaction_date": "2026-09-05",
  "settlement_date": "2026-09-08",
  "fees": "150.00",
  "currency": "ZAR",
  "notes": "Adding to position"
}
```

**Response**: `201 Created`
```json
{
  "transaction_id": "txn_abc123",
  "portfolio_id": "port_abc123",
  "transaction_type": "buy",
  "instrument_isin": "ZAE000015889",
  "instrument_name": "Sasol Limited",
  "quantity": "100.00",
  "price": "320.50",
  "gross_amount": "32050.00",
  "fees": "150.00",
  "net_amount": "32200.00",
  "transaction_date": "2026-09-05",
  "settlement_date": "2026-09-08",
  "status": "pending_settlement",
  "created_at": "2026-09-05T14:30:00Z"
}
```

#### List Transactions
```http
GET /v1/portfolios/{portfolio_id}/transactions
Authorization: Bearer {token}
```

**Query Parameters**:
- `start_date` (date): Filter from date
- `end_date` (date): Filter to date
- `transaction_type` (string): buy, sell, dividend, fee
- `page`, `per_page`

**Response**: `200 OK`
```json
{
  "data": [
    {
      "transaction_id": "txn_abc123",
      "transaction_type": "buy",
      "instrument_isin": "ZAE000015889",
      "instrument_name": "Sasol Limited",
      "quantity": "100.00",
      "price": "320.50",
      "net_amount": "32200.00",
      "transaction_date": "2026-09-05",
      "status": "settled"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 45,
    "total_pages": 3
  }
}
```

---

### 3.4 Recommendations

#### Get Recommendations
```http
GET /v1/recommendations
Authorization: Bearer {token}
```

**Query Parameters**:
- `portfolio_id` (uuid): Filter by portfolio
- `action` (string): buy, sell, hold
- `min_conviction` (float): Minimum conviction score (0-1)
- `asset_class` (string): equity, fixed_income
- `market` (string): JSE, NGX, EGX, NSE, GSE
- `page`, `per_page`

**Response**: `200 OK`
```json
{
  "data": [
    {
      "recommendation_id": "rec_abc123",
      "action": "buy",
      "instrument": {
        "isin": "ZAE000015889",
        "name": "Sasol Limited",
        "ticker": "SOL",
        "market": "JSE",
        "asset_class": "equity",
        "sector": "Energy",
        "current_price": "320.50",
        "currency": "ZAR"
      },
      "conviction": 0.72,
      "confidence": 0.85,
      "target_weight": 0.05,
      "expected_return": 0.18,
      "time_horizon": "12_months",
      "summary": "Sasol is undervalued based on P/E ratio (12.6 vs sector median 15.8) and showing positive momentum. Quality metrics are solid with ROE of 18%.",
      "key_signals": [
        {
          "signal_type": "valuation_pe",
          "value": 0.8,
          "weight": 0.4,
          "description": "Trading at P/E of 12.6, 20% below sector median"
        },
        {
          "signal_type": "momentum",
          "value": 0.6,
          "weight": 0.3,
          "description": "Price up 15% over 90 days, outperforming benchmark"
        },
        {
          "signal_type": "quality_roe",
          "value": 0.5,
          "weight": 0.3,
          "description": "ROE of 18% above sector average of 14%"
        }
      ],
      "compliance_status": "pass",
      "data_quality": 0.92,
      "liquidity_score": 0.88,
      "generated_at": "2026-09-05T06:00:00Z",
      "valid_until": "2026-10-05T06:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 12,
    "total_pages": 1
  }
}
```

#### Get Recommendation Details
```http
GET /v1/recommendations/{recommendation_id}
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "recommendation_id": "rec_abc123",
  "action": "buy",
  "instrument": { /* full instrument details */ },
  "conviction": 0.72,
  "confidence": 0.85,
  "explanation": {
    "summary": "Sasol is undervalued...",
    "detailed_analysis": "Based on our analysis of multiple factors...",
    "risks": [
      "Oil price volatility could impact earnings",
      "Currency risk (ZAR weakness)"
    ],
    "catalysts": [
      "Upcoming earnings expected to beat estimates",
      "New project completion in Q4"
    ]
  },
  "evidence_trail": {
    "graph_query_url": "/v1/recommendations/{id}/evidence-graph",
    "signals": [ /* full signal details */ ],
    "compliance_checks": [ /* rules checked */ ],
    "data_sources": [ /* source data points */ ]
  },
  "alternative_recommendations": [
    {
      "recommendation_id": "rec_xyz789",
      "instrument_name": "Similar Energy Stock",
      "conviction": 0.68
    }
  ],
  "generated_at": "2026-09-05T06:00:00Z"
}
```

#### Get Evidence Graph
```http
GET /v1/recommendations/{recommendation_id}/evidence-graph
Authorization: Bearer {token}
```

**Response**: `200 OK` (Graph structure for visualization)
```json
{
  "nodes": [
    {
      "id": "rec_abc123",
      "type": "recommendation",
      "properties": {
        "action": "buy",
        "conviction": 0.72
      }
    },
    {
      "id": "sig_valuation_1",
      "type": "signal",
      "properties": {
        "signal_type": "valuation_pe",
        "value": 0.8,
        "confidence": 0.85
      }
    },
    {
      "id": "inst_sasol",
      "type": "instrument",
      "properties": {
        "isin": "ZAE000015889",
        "name": "Sasol Limited"
      }
    }
  ],
  "edges": [
    {
      "from": "rec_abc123",
      "to": "sig_valuation_1",
      "type": "CITES",
      "properties": {
        "weight": 0.4
      }
    },
    {
      "from": "sig_valuation_1",
      "to": "inst_sasol",
      "type": "DERIVED_FROM",
      "properties": {}
    }
  ]
}
```

#### Accept/Dismiss Recommendation
```http
POST /v1/recommendations/{recommendation_id}/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "accept",  // or "dismiss"
  "portfolio_id": "port_abc123",
  "notes": "Adding to portfolio as part of diversification"
}
```

**Response**: `200 OK`
```json
{
  "recommendation_id": "rec_abc123",
  "feedback_recorded": true,
  "status": "accepted",
  "recorded_at": "2026-09-05T14:30:00Z"
}
```

---

### 3.5 Instruments (Market Data)

#### Search Instruments
```http
GET /v1/instruments/search
Authorization: Bearer {token}
```

**Query Parameters**:
- `q` (string, required): Search query
- `market` (string): Filter by market (JSE, NGX, etc.)
- `asset_class` (string): equity, fixed_income
- `sector` (string): Energy, Financials, etc.
- `limit` (integer): Max results (default: 20)

**Response**: `200 OK`
```json
{
  "results": [
    {
      "instrument_id": "inst_sasol_123",
      "isin": "ZAE000015889",
      "name": "Sasol Limited",
      "ticker": "SOL",
      "asset_class": "equity",
      "market": "JSE",
      "sector": "Energy",
      "currency": "ZAR",
      "current_price": "320.50",
      "match_score": 0.95
    }
  ]
}
```

#### Get Instrument Details
```http
GET /v1/instruments/{isin}
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "instrument_id": "inst_sasol_123",
  "isin": "ZAE000015889",
  "cfi_code": "ESVUFR",
  "name": "Sasol Limited",
  "ticker": "SOL",
  "asset_class": "equity",
  "instrument_type": "common_stock",
  "market": "JSE",
  "currency": "ZAR",
  "sector": "Energy",
  "industry": "Oil, Gas & Consumable Fuels",
  "issuer": {
    "name": "Sasol Limited",
    "lei": "378900D9E44FE67A1B89",
    "country": "ZA"
  },
  "current_price": "320.50",
  "price_change_1d": "2.50",
  "price_change_1d_pct": "0.0079",
  "volume": 1250000,
  "market_cap": "210000000000",
  "pe_ratio": 12.6,
  "dividend_yield": 0.045,
  "status": "active",
  "last_updated": "2026-09-05T16:00:00Z"
}
```

#### Get Instrument Price History
```http
GET /v1/instruments/{isin}/prices
Authorization: Bearer {token}
```

**Query Parameters**:
- `start_date` (date, required)
- `end_date` (date, required)
- `interval` (string): daily, weekly, monthly (default: daily)

**Response**: `200 OK`
```json
{
  "isin": "ZAE000015889",
  "instrument_name": "Sasol Limited",
  "interval": "daily",
  "currency": "ZAR",
  "data": [
    {
      "date": "2026-09-05",
      "open": "318.50",
      "high": "325.00",
      "low": "315.00",
      "close": "320.50",
      "volume": 1250000,
      "vwap": "319.75"
    },
    {
      "date": "2026-09-04",
      "open": "315.00",
      "high": "320.00",
      "low": "312.50",
      "close": "318.00",
      "volume": 980000,
      "vwap": "316.25"
    }
  ]
}
```

---

### 3.6 Compliance

#### Check Pre-Trade Compliance
```http
POST /v1/compliance/check
Authorization: Bearer {token}
Content-Type: application/json

{
  "portfolio_id": "port_abc123",
  "proposed_trade": {
    "transaction_type": "buy",
    "instrument_isin": "ZAE000015889",
    "quantity": "500.00",
    "price": "320.50"
  }
}
```

**Response**: `200 OK`
```json
{
  "check_id": "check_abc123",
  "overall_result": "pass",  // or "fail", "warning"
  "can_proceed": true,
  "checks": [
    {
      "rule_id": "fsca_single_equity_limit",
      "rule_description": "No single equity > 10% of portfolio",
      "result": "pass",
      "details": {
        "current_weight": 0.0894,
        "proposed_weight": 0.1020,
        "limit": 0.1000,
        "buffer": 0.0000
      },
      "severity": "error"
    },
    {
      "rule_id": "fsca_sector_limit",
      "rule_description": "Energy sector < 25% of portfolio",
      "result": "pass",
      "details": {
        "current_weight": 0.1450,
        "proposed_weight": 0.1576,
        "limit": 0.2500
      },
      "severity": "warning"
    }
  ],
  "checked_at": "2026-09-05T14:30:00Z"
}
```

#### Get Active Compliance Rules
```http
GET /v1/compliance/rules
Authorization: Bearer {token}
```

**Query Parameters**:
- `jurisdiction` (string): ZA, NG, KE, etc.
- `portfolio_id` (uuid): Rules applicable to portfolio

**Response**: `200 OK`
```json
{
  "rules": [
    {
      "rule_id": "fsca_single_equity_limit",
      "rule_code": "FSCA-CONC-001",
      "description": "No single equity shall exceed 10% of portfolio",
      "rule_type": "concentration",
      "severity": "error",
      "regulator": "FSCA",
      "jurisdiction": "ZA",
      "applicable_to": ["retail", "advisor"],
      "parameters": {
        "max_weight": 0.10,
        "scope": "single_instrument",
        "asset_class": "equity"
      },
      "effective_from": "2020-01-01",
      "is_active": true
    }
  ]
}
```

---

### 3.7 Reports

#### Generate Performance Report
```http
POST /v1/reports/performance
Authorization: Bearer {token}
Content-Type: application/json

{
  "portfolio_id": "port_abc123",
  "start_date": "2026-01-01",
  "end_date": "2026-09-05",
  "report_format": "pdf",  // or "json", "excel"
  "include_attribution": true,
  "include_holdings_detail": true
}
```

**Response**: `202 Accepted`
```json
{
  "report_id": "rpt_abc123",
  "status": "processing",
  "estimated_completion": "2026-09-05T14:35:00Z",
  "download_url": null
}
```

#### Get Report Status
```http
GET /v1/reports/{report_id}
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "report_id": "rpt_abc123",
  "report_type": "performance",
  "status": "completed",  // or "processing", "failed"
  "download_url": "https://reports.mobu.platform/rpt_abc123.pdf",
  "expires_at": "2026-09-12T14:30:00Z",
  "generated_at": "2026-09-05T14:32:00Z"
}
```

#### List Available Report Templates
```http
GET /v1/reports/templates
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "templates": [
    {
      "template_id": "tmpl_performance",
      "name": "Performance Report",
      "description": "Portfolio returns vs benchmark",
      "supported_formats": ["pdf", "excel", "json"],
      "parameters": [
        {
          "name": "start_date",
          "type": "date",
          "required": true
        },
        {
          "name": "include_attribution",
          "type": "boolean",
          "required": false,
          "default": false
        }
      ]
    }
  ]
}
```

---

### 3.8 Risk Management

#### Get Portfolio Risk Metrics
```http
GET /v1/portfolios/{portfolio_id}/risk
Authorization: Bearer {token}
```

**Query Parameters**:
- `as_of_date` (date): Snapshot date

**Response**: `200 OK`
```json
{
  "portfolio_id": "port_abc123",
  "as_of_date": "2026-09-05",
  "risk_metrics": {
    "var_95": {
      "value": "-0.0450",
      "description": "95% VaR: 4.5% potential loss",
      "confidence_level": 0.95,
      "time_horizon_days": 1
    },
    "cvar_95": {
      "value": "-0.0680",
      "description": "Expected Shortfall beyond VaR"
    },
    "beta": {
      "value": 1.15,
      "benchmark": "JSE_TOP40"
    },
    "volatility": {
      "value": 0.18,
      "annualized": true
    },
    "sharpe_ratio": 1.42,
    "max_drawdown": {
      "value": "-0.12",
      "start_date": "2026-03-15",
      "end_date": "2026-04-22",
      "recovery_date": "2026-06-10"
    }
  },
  "concentration_risk": {
    "top_holding_weight": 0.0894,
    "top_5_holdings_weight": 0.3245,
    "herfindahl_index": 0.0654
  },
  "sector_exposure": [
    {
      "sector": "Financials",
      "weight": 0.2350,
      "risk_contribution": 0.1890
    },
    {
      "sector": "Energy",
      "weight": 0.1576,
      "risk_contribution": 0.2145
    }
  ],
  "currency_exposure": [
    {
      "currency": "ZAR",
      "weight": 0.7500
    },
    {
      "currency": "USD",
      "weight": 0.2500
    }
  ]
}
```

#### Run Scenario Analysis
```http
POST /v1/portfolios/{portfolio_id}/risk/scenarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "scenario_type": "historical",  // or "hypothetical"
  "scenario_id": "2008_financial_crisis",  // or custom parameters
  "as_of_date": "2026-09-05"
}
```

**Response**: `200 OK`
```json
{
  "portfolio_id": "port_abc123",
  "scenario": {
    "scenario_id": "2008_financial_crisis",
    "name": "2008 Financial Crisis",
    "description": "Market conditions from Sep 2008 - Mar 2009"
  },
  "impact": {
    "portfolio_return": "-0.3520",
    "portfolio_value_change": "-44150.26",
    "benchmark_return": "-0.4200",
    "relative_performance": "0.0680",
    "max_drawdown": "-0.4580",
    "recovery_time_estimate_days": 450
  },
  "holding_impacts": [
    {
      "instrument_name": "Sasol Limited",
      "current_weight": 0.0894,
      "return_in_scenario": "-0.5200",
      "contribution_to_loss": "-0.0465"
    }
  ],
  "recommendations": [
    "Consider reducing energy sector exposure",
    "Increase allocation to defensive sectors"
  ]
}
```

---

## 4. GraphQL API

### 4.1 GraphQL Endpoint

```
POST https://api.mobu.platform/v1/graphql
Authorization: Bearer {token}
Content-Type: application/json
```

### 4.2 Schema Overview

**Root Types**:
- `Query`: Read operations
- `Mutation`: Write operations
- `Subscription`: Real-time updates (WebSocket)

### 4.3 Example Queries

#### Get Portfolio with Holdings and Recommendations

```graphql
query GetPortfolioDetails($portfolioId: ID!) {
  portfolio(id: $portfolioId) {
    id
    name
    baseContrary
    currentValue
    totalReturn
    holdings {
      edges {
        node {
          instrument {
            isin
            name
            currentPrice
          }
          quantity
          marketValue
          weight
          unrealizedGain
        }
      }
    }
    recommendations(first: 5, filter: {action: BUY}) {
      edges {
        node {
          id
          action
          conviction
          instrument {
            isin
            name
            sector
          }
          summary
          keySignals {
            signalType
            value
            weight
          }
        }
      }
    }
    riskMetrics {
      beta
      sharpe
      maxDrawdown
    }
  }
}
```

**Variables**:
```json
{
  "portfolioId": "port_abc123"
}
```

**Response**:
```json
{
  "data": {
    "portfolio": {
      "id": "port_abc123",
      "name": "My Retirement Portfolio",
      "baseCurrency": "ZAR",
      "currentValue": "125450.75",
      "totalReturn": "0.2545",
      "holdings": {
        "edges": [
          {
            "node": {
              "instrument": {
                "isin": "ZAE000015889",
                "name": "Sasol Limited",
                "currentPrice": "320.50"
              },
              "quantity": "350.00",
              "marketValue": "112175.00",
              "weight": "0.0894",
              "unrealizedGain": "14000.00"
            }
          }
        ]
      },
      "recommendations": {
        "edges": [
          {
            "node": {
              "id": "rec_abc123",
              "action": "BUY",
              "conviction": 0.72,
              "instrument": {
                "isin": "ZAE000040141",
                "name": "MTN Group",
                "sector": "Telecommunications"
              },
              "summary": "MTN is undervalued...",
              "keySignals": [
                {
                  "signalType": "VALUATION_PE",
                  "value": 0.8,
                  "weight": 0.4
                }
              ]
            }
          }
        ]
      },
      "riskMetrics": {
        "beta": 1.15,
        "sharpe": 1.42,
        "maxDrawdown": -0.12
      }
    }
  }
}
```

#### Search Instruments with Fundamentals

```graphql
query SearchInstruments($query: String!, $market: Market) {
  searchInstruments(query: $query, market: $market, first: 10) {
    edges {
      node {
        isin
        name
        ticker
        market
        sector
        currentPrice
        priceChange1d
        fundamentals {
          peRatio
          pbRatio
          dividendYield
          roe
          marketCap
        }
        mobuAnalysis {
          recommendationAction
          conviction
          dataQuality
        }
      }
    }
  }
}
```

### 4.4 Example Mutations

#### Create Transaction

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    transaction {
      id
      transactionType
      instrument {
        name
      }
      quantity
      price
      netAmount
      status
    }
    portfolio {
      currentValue
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
```

**Variables**:
```json
{
  "input": {
    "portfolioId": "port_abc123",
    "transactionType": "BUY",
    "instrumentIsin": "ZAE000015889",
    "quantity": "100.00",
    "price": "320.50",
    "transactionDate": "2026-09-05",
    "fees": "150.00"
  }
}
```

#### Accept Recommendation

```graphql
mutation AcceptRecommendation($recommendationId: ID!, $portfolioId: ID!) {
  acceptRecommendation(recommendationId: $recommendationId, portfolioId: $portfolioId) {
    success
    recommendation {
      id
      status
    }
    suggestedTrade {
      instrumentIsin
      action
      quantity
      estimatedPrice
    }
  }
}
```

### 4.5 Subscriptions (Real-Time)

#### Subscribe to Portfolio Updates

```graphql
subscription PortfolioUpdates($portfolioId: ID!) {
  portfolioUpdated(portfolioId: $portfolioId) {
    portfolio {
      id
      currentValue
      totalReturn
      updatedAt
    }
    changeType
    changedFields
  }
}
```

#### Subscribe to New Recommendations

```graphql
subscription NewRecommendations($portfolioId: ID) {
  recommendationGenerated(portfolioId: $portfolioId) {
    recommendation {
      id
      action
      instrument {
        name
        ticker
      }
      conviction
      summary
    }
  }
}
```

---

## 5. WebSocket APIs

### 5.1 Connection

```javascript
const ws = new WebSocket('wss://api.mobu.platform/v1/ws');

// Authenticate after connection
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }));
};
```

### 5.2 Message Format

**Client → Server**:
```json
{
  "type": "subscribe",
  "channel": "portfolio",
  "portfolio_id": "port_abc123"
}
```

**Server → Client**:
```json
{
  "type": "portfolio_update",
  "channel": "portfolio",
  "portfolio_id": "port_abc123",
  "data": {
    "current_value": "125650.75",
    "change": "200.00",
    "timestamp": "2026-09-05T16:05:00Z"
  }
}
```

### 5.3 Available Channels

| Channel | Description | Subscription Parameters |
|---------|-------------|------------------------|
| `portfolio` | Portfolio value updates | `portfolio_id` |
| `prices` | Real-time price updates | `isin[]` (array of ISINs) |
| `recommendations` | New recommendations | `portfolio_id` (optional) |
| `alerts` | User alerts/notifications | (user-level, no params) |

---

## 6. Webhooks

### 6.1 Webhook Configuration

Configure webhooks in dashboard: Settings → Webhooks → Add Endpoint

**Webhook URL Requirements**:
- HTTPS only
- Responds with 200-299 status code within 5 seconds
- Acknowledges receipt before processing

### 6.2 Webhook Events

| Event Type | Description | Payload |
|------------|-------------|---------|
| `portfolio.updated` | Portfolio value changed | Portfolio object |
| `transaction.completed` | Transaction settled | Transaction object |
| `recommendation.generated` | New recommendation | Recommendation object |
| `compliance.alert` | Compliance issue | Alert object |
| `report.completed` | Report ready for download | Report object |

### 6.3 Webhook Payload Example

```json
{
  "event_id": "evt_abc123",
  "event_type": "recommendation.generated",
  "timestamp": "2026-09-05T06:00:00Z",
  "data": {
    "recommendation": {
      "recommendation_id": "rec_abc123",
      "action": "buy",
      "instrument": {
        "isin": "ZAE000015889",
        "name": "Sasol Limited"
      },
      "conviction": 0.72,
      "portfolio_id": "port_abc123"
    }
  },
  "signature": "sha256=abc123..."
}
```

### 6.4 Webhook Signature Verification

```python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    expected_sig = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected_sig}", signature)

# Usage
signature = request.headers.get('X-MOBU-Signature')
is_valid = verify_webhook_signature(request.body, signature, webhook_secret)
```

---

## 7. Rate Limiting

### 7.1 Rate Limit Tiers

| User Tier | Requests/Minute | Requests/Day | Burst |
|-----------|----------------|--------------|-------|
| **Free** | 60 | 2,000 | 100 |
| **Paid** | 300 | 20,000 | 500 |
| **Advisor** | 600 | 50,000 | 1,000 |
| **Institutional** | 1,200 | 200,000 | 2,000 |

### 7.2 Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 245
X-RateLimit-Reset: 1725541200
```

### 7.3 Rate Limit Exceeded Response

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60

{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "API rate limit exceeded. Retry after 60 seconds.",
    "limit": 300,
    "reset_at": "2026-09-05T14:40:00Z"
  }
}
```

---

## 8. Error Handling

### 8.1 Error Response Format

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid portfolio ID provided",
    "details": {
      "field": "portfolio_id",
      "reason": "Portfolio not found or access denied"
    },
    "request_id": "req_abc123",
    "timestamp": "2026-09-05T14:30:00Z"
  }
}
```

### 8.2 Standard Error Codes

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | `validation_error` | Request validation failed |
| 401 | `unauthorized` | Missing or invalid authentication |
| 403 | `forbidden` | Insufficient permissions |
| 404 | `not_found` | Resource not found |
| 409 | `conflict` | Resource conflict (duplicate) |
| 422 | `unprocessable_entity` | Business logic validation failed |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_error` | Server error |
| 503 | `service_unavailable` | Temporary unavailability |

### 8.3 Field Validation Errors

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "fields": [
      {
        "field": "quantity",
        "message": "Quantity must be positive",
        "value": "-100"
      },
      {
        "field": "price",
        "message": "Price is required",
        "value": null
      }
    ]
  }
}
```

---

## 9. Code Examples

### 9.1 Python

```python
import requests
from typing import Dict, List

class MOBUClient:
    def __init__(self, api_key: str, base_url: str = "https://api.mobu.platform/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        })
    
    def get_portfolios(self) -> List[Dict]:
        """Get all portfolios for authenticated user"""
        response = self.session.get(f"{self.base_url}/portfolios")
        response.raise_for_status()
        return response.json()['data']
    
    def get_recommendations(self, portfolio_id: str, min_conviction: float = 0.7) -> List[Dict]:
        """Get recommendations for a portfolio"""
        params = {
            'portfolio_id': portfolio_id,
            'min_conviction': min_conviction
        }
        response = self.session.get(
            f"{self.base_url}/recommendations",
            params=params
        )
        response.raise_for_status()
        return response.json()['data']
    
    def create_transaction(self, portfolio_id: str, transaction_data: Dict) -> Dict:
        """Create a new transaction"""
        response = self.session.post(
            f"{self.base_url}/portfolios/{portfolio_id}/transactions",
            json=transaction_data
        )
        response.raise_for_status()
        return response.json()
    
    def check_compliance(self, portfolio_id: str, proposed_trade: Dict) -> Dict:
        """Check compliance for a proposed trade"""
        response = self.session.post(
            f"{self.base_url}/compliance/check",
            json={
                'portfolio_id': portfolio_id,
                'proposed_trade': proposed_trade
            }
        )
        response.raise_for_status()
        return response.json()

# Usage
client = MOBUClient(api_key='mobu_live_abc123')

# Get recommendations
recs = client.get_recommendations(
    portfolio_id='port_abc123',
    min_conviction=0.7
)

for rec in recs:
    print(f"{rec['action']} {rec['instrument']['name']} - Conviction: {rec['conviction']}")

# Check compliance before trade
compliance_result = client.check_compliance(
    portfolio_id='port_abc123',
    proposed_trade={
        'transaction_type': 'buy',
        'instrument_isin': 'ZAE000015889',
        'quantity': '100.00',
        'price': '320.50'
    }
)

if compliance_result['can_proceed']:
    # Execute trade
    transaction = client.create_transaction(
        portfolio_id='port_abc123',
        transaction_data={
            'transaction_type': 'buy',
            'instrument_isin': 'ZAE000015889',
            'quantity': '100.00',
            'price': '320.50',
            'transaction_date': '2026-09-05',
            'fees': '150.00'
        }
    )
    print(f"Transaction created: {transaction['transaction_id']}")
else:
    print("Trade blocked by compliance")
```

### 9.2 JavaScript/TypeScript

```typescript
interface Portfolio {
  portfolio_id: string;
  name: string;
  current_value: string;
  total_return: string;
}

interface Recommendation {
  recommendation_id: string;
  action: 'buy' | 'sell' | 'hold';
  instrument: {
    isin: string;
    name: string;
  };
  conviction: number;
}

class MOBUClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.mobu.platform/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async getPortfolios(): Promise<Portfolio[]> {
    const result = await this.request<{ data: Portfolio[] }>('/portfolios');
    return result.data;
  }

  async getRecommendations(
    portfolioId: string,
    minConviction: number = 0.7
  ): Promise<Recommendation[]> {
    const params = new URLSearchParams({
      portfolio_id: portfolioId,
      min_conviction: minConviction.toString(),
    });
    const result = await this.request<{ data: Recommendation[] }>(
      `/recommendations?${params}`
    );
    return result.data;
  }

  async acceptRecommendation(
    recommendationId: string,
    portfolioId: string
  ): Promise<void> {
    await this.request(`/recommendations/${recommendationId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'accept',
        portfolio_id: portfolioId,
      }),
    });
  }
}

// Usage
const client = new MOBUClient('mobu_live_abc123');

// Get and display recommendations
const recommendations = await client.getRecommendations('port_abc123', 0.7);

recommendations.forEach((rec) => {
  console.log(
    `${rec.action.toUpperCase()} ${rec.instrument.name} - ${(rec.conviction * 100).toFixed(0)}% conviction`
  );
});

// Accept a recommendation
await client.acceptRecommendation('rec_abc123', 'port_abc123');
console.log('Recommendation accepted');
```

### 9.3 GraphQL Client (JavaScript)

```javascript
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Setup Apollo Client
const httpLink = new HttpLink({
  uri: 'https://api.mobu.platform/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('mobu_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Query with variables
const GET_PORTFOLIO_DETAILS = gql`
  query GetPortfolioDetails($portfolioId: ID!) {
    portfolio(id: $portfolioId) {
      id
      name
      currentValue
      holdings {
        edges {
          node {
            instrument {
              name
              currentPrice
            }
            quantity
            marketValue
          }
        }
      }
      recommendations(first: 5) {
        edges {
          node {
            id
            action
            conviction
            instrument {
              name
            }
            summary
          }
        }
      }
    }
  }
`;

// Execute query
const { data, loading, error } = await client.query({
  query: GET_PORTFOLIO_DETAILS,
  variables: { portfolioId: 'port_abc123' },
});

if (data) {
  console.log(`Portfolio: ${data.portfolio.name}`);
  console.log(`Value: ${data.portfolio.currentValue}`);
  
  data.portfolio.recommendations.edges.forEach(({ node }) => {
    console.log(`${node.action} ${node.instrument.name} - ${node.conviction}`);
  });
}
```

---

## 10. API Changelog

### Version 1.0.0 (September 2026)
- Initial API release
- REST endpoints for portfolios, transactions, recommendations
- GraphQL API with comprehensive schema
- WebSocket support for real-time updates
- Webhook integration
- Rate limiting implementation

### Upcoming in v1.1.0 (Planned)
- Bulk operations API
- Advanced filtering and sorting
- Batch transaction creation
- Custom report templates via API
- Enhanced webhook events

---

## Appendix A: API Quick Reference

### Base URLs
```
Production:  https://api.mobu.platform/v1
Sandbox:     https://api-sandbox.mobu.platform/v1
```

### Authentication
```http
X-API-Key: mobu_live_abc123
# OR
Authorization: Bearer {jwt_token}
```

### Core Endpoints
```
GET    /v1/portfolios
POST   /v1/portfolios
GET    /v1/portfolios/{id}
GET    /v1/portfolios/{id}/holdings
POST   /v1/portfolios/{id}/transactions

GET    /v1/recommendations
GET    /v1/recommendations/{id}
POST   /v1/recommendations/{id}/feedback

GET    /v1/instruments/search
GET    /v1/instruments/{isin}
GET    /v1/instruments/{isin}/prices

POST   /v1/compliance/check
GET    /v1/compliance/rules

POST   /v1/reports/performance
GET    /v1/reports/{id}
```

### Rate Limits
- Free: 60 req/min
- Paid: 300 req/min
- Advisor: 600 req/min
- Institutional: 1,200 req/min

### Support
- Documentation: https://docs.mobu.platform
- API Status: https://status.mobu.platform
- Support: api-support@mobu.platform

---

**API Version**: 1.0.0  
**Last Updated**: September 2026  
**Maintained By**: MOBU Platform Team
