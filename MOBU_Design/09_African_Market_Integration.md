# MOBU Investment Platform
## African Market Integration & Trading Infrastructure

**Version:** 1.0  
**Date:** September 2026  
**Status:** Strategic Implementation Plan

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [African Stock Exchanges](#2-african-stock-exchanges)
3. [Alternative Data Sources](#3-alternative-data-sources)
4. [Broker Integration](#4-broker-integration)
5. [Payment Gateway Integration](#5-payment-gateway-integration)
6. [Paper Trading / Demo Accounts](#6-paper-trading--demo-accounts)
7. [Data Model Extensions](#7-data-model-extensions)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Executive Summary

### Strategic Context
MOBU is positioning as an **investment intelligence platform** for African investors, not a broker itself. We integrate with:
- **African stock exchanges** (NSE, JSE, NGX, GSE, EGX, BRVM, etc.)
- **Alternative data providers** (Quiver Quantitative, Unusual Whales, Finviz-style data)
- **African brokers** (EasyEquities, Bamboo, Chaka, Trove) for trade execution
- **Payment gateways** (Paystack, Flutterwave, M-Pesa, dLocal) for deposits/withdrawals
- **Paper trading platforms** (Alpaca-style sandbox) for risk-free learning

### Value Proposition
**"AI-Powered Investment Intelligence + Seamless Execution for African Investors"**

1. **Intelligence Layer**: MOBU's AI analyzes African + global markets (NYSE, NASDAQ, LSE, local exchanges)
2. **Execution Layer**: Users execute recommendations via integrated African brokers
3. **Payment Layer**: Seamless deposits/withdrawals via local payment methods (mobile money, bank transfer, cards)
4. **Learning Layer**: Paper trading to practice before deploying real capital

---

## 2. African Stock Exchanges

### 2.1 Primary Markets (Phase 1)

| Exchange | Countries | Market Cap | API Availability | Priority |
|----------|-----------|------------|------------------|----------|
| **JSE** (Johannesburg) | South Africa | $1.2T | Limited | HIGH |
| **NGX** (Nigerian Exchange) | Nigeria | $60B | Yes (via Mansa API) | HIGH |
| **NSE** (Nairobi) | Kenya | $30B | Limited (scrapers) | HIGH |
| **EGX** (Egyptian Exchange) | Egypt | $50B | Yes | MEDIUM |
| **GSE** (Ghana) | Ghana | $8B | Yes (African Markets API) | MEDIUM |
| **BRVM** (West Africa) | 8 countries | $15B | Limited | MEDIUM |

### 2.2 Data Providers for African Markets

#### Option A: **Mansa API** (Recommended)
**URL**: https://mansaapi.com/  
**Coverage**: 15+ African exchanges (NGX, JSE, NSE, GSE, EGX, CSE, BRVM, ZSE)  
**Data**: Live quotes, tickers, price history, movers, indices  
**Format**: Structured JSON  
**Pricing**: Developer-friendly, starts free

**API Example**:
```bash
# Get NGX (Nigerian Exchange) quote
GET https://api.mansaapi.com/markets/ngx/ticker/DANGCEM

# Response:
{
  "ticker": "DANGCEM",
  "name": "Dangote Cement",
  "price": 285.50,
  "change": 2.3,
  "change_pct": 0.81,
  "volume": 1250000,
  "timestamp": "2026-09-12T10:30:00Z"
}
```

#### Option B: **African Markets API**
**URL**: https://github.com/abkd1211/african-markets-api  
**Coverage**: GSE (Ghana) + NGX (Nigeria)  
**Open Source**: Yes (self-hostable)  
**Real-time**: Yes

#### Option C: **Africa-API**
**URL**: https://africa-api.com/  
**Coverage**: Economic data, FX, government records, market layers  
**Use Case**: Macro data for African countries

### 2.3 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              AFRICAN STOCK EXCHANGES                         │
│  JSE │ NGX │ NSE │ EGX │ GSE │ BRVM │ CSE │ ZSE │ AELP      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            DATA AGGREGATION LAYER (Mansa API)                │
│  • Normalize formats across exchanges                        │
│  • Real-time price feeds                                     │
│  • Historical data (OHLCV)                                   │
│  • Top movers, indices, market depth                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           MOBU DATA FEED AGENT (Enhanced)                    │
│  • Ingest African market data                                │
│  • Merge with US/Global data (Bloomberg, Refinitiv)          │
│  • Quality scoring & validation                              │
│  • Write to raw_data.african_price_feeds                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              dbt STAGING LAYER                               │
│  • stg_african_price_feeds.sql                               │
│  • Validate & deduplicate                                    │
│  • Standardize currency (convert to USD/ZAR/NGN)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          MOBU RECOMMENDATION ENGINE                          │
│  Generates signals for African + Global stocks               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Alternative Data Sources

### 3.1 Alternative Data Concept
Traditional stock analysis relies on financial statements, price/volume. **Alternative data** provides an edge by tracking:
- **Congressional trading** (politicians' stock buys/sells)
- **Insider trading** (Form 4 filings)
- **Hedge fund 13F filings**
- **Corporate lobbying** (government spending patterns)
- **Dark pool activity** (institutional large block trades)
- **Social sentiment** (Twitter, Reddit, StockTwits)
- **Patent filings, FDA approvals, job postings**

### 3.2 Primary Providers

#### Option A: **Quiver Quantitative** (Recommended)
**URL**: https://www.quiverquant.com/ | https://api.quiverquant.com/  
**Pricing**: $30/month (API access)  
**Data Coverage**:
- Congressional stock trading (House/Senate)
- Insider transactions (Form 4)
- Hedge fund 13F filings
- Corporate lobbying spending
- Government contracts
- Patent filings
- Twitter sentiment
- Unusual options activity

**API Example**:
```python
import requests

# Get congressional trades for AAPL
response = requests.get(
    "https://api.quiverquant.com/beta/historical/congresstrading/AAPL",
    headers={"Authorization": f"Token {QUIVER_API_KEY}"}
)

# Response:
[
    {
        "Date": "2026-08-15",
        "Representative": "Nancy Pelosi",
        "Transaction": "Purchase",
        "Range": "$1,000,001 - $5,000,000",
        "ticker": "AAPL"
    }
]
```

**MOBU Integration**:
```sql
-- New table: raw_data.alternative_data_quiver
CREATE TABLE raw_data.alternative_data_quiver (
    record_id UUID PRIMARY KEY,
    data_type VARCHAR(50), -- 'congress_trade', 'insider', 'hedge_fund_13f', 'lobbying'
    asset_symbol VARCHAR(20),
    transaction_date DATE,
    actor_name VARCHAR(200), -- Politician, insider, fund manager name
    transaction_type VARCHAR(50), -- 'buy', 'sell', 'hold'
    amount_range VARCHAR(100),
    amount_min NUMERIC(20,2),
    amount_max NUMERIC(20,2),
    sentiment_signal VARCHAR(20), -- 'bullish', 'bearish', 'neutral'
    data_quality_score NUMERIC(5,4),
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### Option B: **Unusual Whales**
**URL**: https://unusualwhales.com/  
**Focus**: Options flow, dark pool activity, institutional trades  
**Pricing**: Premium subscription (~$50/month)  
**Use Case**: Detect institutional buying pressure before price moves

#### Option C: **Finviz-Style Screeners**
**URL**: https://finviz.com/  
**Data**: Stock screener, heatmaps, insider trading, news aggregation  
**Free Tier**: Yes (with rate limits)  
**Scraping**: Possible (respect robots.txt, rate limits)

### 3.3 African Alternative Data (Custom Sources)

Since established alternative data providers focus on US markets, MOBU can create **proprietary African alternative data** by scraping/monitoring:

| Data Source | Example | Value |
|-------------|---------|-------|
| **Government tender awards** | Kenya's eTender portal, SA Treasury | Identify companies winning large contracts |
| **Mining license approvals** | DRC, Zambia, SA mining registries | Early signal for mining stocks |
| **Telecom subscriber growth** | Safaricom, MTN, Airtel earnings calls | Predict revenue before earnings |
| **Port cargo volumes** | Mombasa Port, Lagos Port data | Measure trade activity (logistics stocks) |
| **Banking mobile money stats** | M-Pesa, Airtel Money transaction volumes | Banking sector health |
| **Agricultural commodity prices** | Local maize, coffee, cocoa prices | Agribusiness stock signals |

**Implementation**:
```python
# Custom African alternative data scraper
class AfricanAltDataScraper:
    def scrape_kenya_etender(self):
        """Scrape Kenya government tender awards"""
        # Parse https://supplier.treasury.go.ke/
        # Extract: Company name, tender amount, award date
        # Map company → NSE ticker
        pass
    
    def scrape_mining_licenses(self):
        """Track mining license approvals (DRC, SA, Zambia)"""
        # Mining companies often see stock jumps on license news
        pass
    
    def monitor_port_volumes(self):
        """Kenya Ports Authority, Transnet (SA) cargo stats"""
        # Correlates with logistics/shipping stock performance
        pass
```

---

## 4. Broker Integration

### 4.1 African Investment Platforms (Recommended Partners)

MOBU does NOT execute trades itself. We integrate with existing African brokers via API:

| Broker | Markets | Countries | API | Focus |
|--------|---------|-----------|-----|-------|
| **EasyEquities** | JSE, NYSE, NASDAQ | South Africa, globally | Yes | Fractional shares, low fees |
| **Bamboo** | NYSE, NASDAQ | Nigeria, Ghana, Kenya | Limited | US stocks for Africans |
| **Chaka** | NYSE, NASDAQ | Nigeria, Ghana | Yes | US + crypto |
| **Trove** | NYSE, NASDAQ | Nigeria | Yes | US stocks, bonds, ETFs |
| **Hisa** | NYSE, NASDAQ, NSE | Kenya, Uganda | Yes | Local + US stocks |
| **Invest Cent** | JSE | South Africa | Limited | SA stocks, ETFs |

### 4.2 Integration Architecture: Broker as Execution Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBU PLATFORM                             │
│  User sees recommendation: "Buy DANGCEM (NGX) - 85% confidence│
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MOBU BROKER INTEGRATION LAYER                   │
│  • User selects broker (EasyEquities, Bamboo, Chaka, etc.)   │
│  • MOBU sends trade order via broker API                     │
│  • OAuth2 authentication with user's broker account          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (API Call)
┌─────────────────────────────────────────────────────────────┐
│            BROKER APIs (e.g., EasyEquities)                  │
│  POST /orders                                                │
│  {                                                           │
│    "symbol": "DANGCEM",                                      │
│    "side": "buy",                                            │
│    "qty": 10,                                                │
│    "type": "market"                                          │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STOCK EXCHANGE (NGX, JSE, NSE)                  │
│  Trade executed on actual exchange                           │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 OAuth2 Broker Connection Flow

1. **User clicks "Connect Broker"** in MOBU dashboard
2. **OAuth2 redirect** to broker's authorization page (e.g., EasyEquities login)
3. **User grants permission** for MOBU to place trades on their behalf
4. **Broker returns auth token** to MOBU (stored encrypted in DB)
5. **MOBU can now execute trades** via broker API using user's token

**Security**:
- MOBU never stores broker passwords
- Tokens are encrypted at rest (AES-256)
- Tokens expire; users re-authenticate periodically
- MOBU shows audit trail of all trades sent to broker

### 4.4 Broker API Examples

#### EasyEquities API (Hypothetical - actual API requires partnership)
```python
import requests

# Place market order
response = requests.post(
    "https://api.easyequities.co.za/v1/orders",
    headers={"Authorization": f"Bearer {user_broker_token}"},
    json={
        "symbol": "AGL",  # Anglo American (JSE)
        "side": "buy",
        "quantity": 5,
        "order_type": "market"
    }
)

# Response:
{
    "order_id": "ea-12345",
    "status": "filled",
    "filled_qty": 5,
    "avg_price": 425.50,
    "total_cost": 2127.50,
    "currency": "ZAR"
}
```

#### Bamboo API (Hypothetical)
```python
# Buy fractional shares
response = requests.post(
    "https://api.bamboo.app/v1/orders",
    headers={"Authorization": f"Bearer {user_token}"},
    json={
        "symbol": "AAPL",  # Apple Inc.
        "side": "buy",
        "notional": 1000,  # Buy $1000 worth (fractional)
        "currency": "NGN"  # User pays in Naira
    }
)
```

### 4.5 Fallback: Manual Trade Confirmation

If broker doesn't have API, MOBU can:
1. **Generate trade ticket**: "Recommended: Buy 10 shares of DANGCEM at market price"
2. **User copies** and manually enters into broker's website/app
3. **User confirms execution** in MOBU (manual checkbox)

---

## 5. Payment Gateway Integration

### 5.1 African Payment Landscape

African users need to:
- **Deposit funds** into MOBU/broker account (to buy stocks)
- **Withdraw profits** back to bank/mobile money

**Payment Methods**:
| Method | Countries | Provider | Use Case |
|--------|-----------|----------|----------|
| **Mobile Money** | Kenya, Uganda, Tanzania | M-Pesa, Airtel Money | Deposits/withdrawals (most popular) |
| **Bank Transfer** | All | Paystack, Flutterwave | Larger amounts |
| **Debit/Credit Cards** | Nigeria, SA, Kenya | Paystack, Flutterwave | International cards |
| **USSD** | All | Paystack, Flutterwave | Feature phone users |
| **Crypto** | All | Binance, Luno | Alternative (volatile) |

### 5.2 Recommended Payment Gateways

#### Option A: **Paystack** (Nigeria-focused)
**URL**: https://paystack.com/  
**Coverage**: Nigeria, Ghana, South Africa, Kenya  
**Payment Methods**: Cards, bank transfer, mobile money, USSD  
**Fees**: 1.5% + NGN 100 per transaction  
**API**: RESTful, well-documented

**Integration Example**:
```python
import requests

# Initialize payment
response = requests.post(
    "https://api.paystack.co/transaction/initialize",
    headers={"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"},
    json={
        "email": "user@example.com",
        "amount": 50000,  # NGN 500 (amount in kobo)
        "currency": "NGN",
        "callback_url": "https://mobu.app/payment/callback"
    }
)

# Response:
{
    "status": true,
    "data": {
        "authorization_url": "https://checkout.paystack.com/abc123",
        "access_code": "abc123",
        "reference": "ref_xyz789"
    }
}

# User completes payment, Paystack calls callback URL
# MOBU verifies payment and credits user account
```

#### Option B: **Flutterwave** (Pan-African)
**URL**: https://www.flutterwave.com/  
**Coverage**: 34+ African countries  
**Payment Methods**: Cards, mobile money, bank transfer, M-Pesa, MTN, Airtel  
**Fees**: ~1.4% per transaction  
**Use Case**: Best for multi-country support

**Bamboo uses Flutterwave** for Naira collections (proven for investment platforms)

#### Option C: **dLocal** (Multi-Country Aggregator)
**URL**: https://www.dlocal.com/  
**Coverage**: 40+ emerging markets (including Africa)  
**Single API**: One integration for multiple countries  
**Use Case**: Scale across borders quickly

#### Option D: **M-Pesa Direct Integration** (Kenya)
**URL**: https://developer.safaricom.co.ke/  
**Use Case**: Kenya-specific, deep M-Pesa integration  
**Fees**: Lower than aggregators (direct to Safaricom)

### 5.3 Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 MOBU USER DEPOSITS $100                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            MOBU PAYMENT GATEWAY LAYER                        │
│  • User selects payment method (M-Pesa, card, bank)          │
│  • MOBU calls Paystack/Flutterwave API                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          PAYMENT GATEWAY (Paystack/Flutterwave)              │
│  • Processes payment via M-Pesa/bank/card                    │
│  • Webhook callback to MOBU with payment status              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MOBU CREDITS USER ACCOUNT                       │
│  • Update user_accounts.balance += $100                      │
│  • User can now execute trades                               │
└─────────────────────────────────────────────────────────────┘
```

**Withdrawal Flow** (reverse):
1. User requests withdrawal
2. MOBU calls Paystack/Flutterwave **payout API**
3. Funds sent to user's bank/mobile money
4. MOBU debits user_accounts.balance

### 5.4 Database Schema: Payments

```sql
CREATE TABLE raw_data.payment_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal'
    payment_method VARCHAR(50), -- 'm_pesa', 'bank_transfer', 'card', 'airtel_money'
    amount NUMERIC(20,2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- 'KES', 'NGN', 'ZAR', 'USD'
    gateway_provider VARCHAR(50), -- 'paystack', 'flutterwave', 'dlocal'
    gateway_reference VARCHAR(200), -- Provider's transaction ID
    status VARCHAR(20), -- 'pending', 'completed', 'failed', 'refunded'
    initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    callback_data JSONB, -- Raw webhook data from gateway
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON raw_data.payment_transactions(user_id, initiated_at DESC);
CREATE INDEX idx_payments_status ON raw_data.payment_transactions(status);
```

---

## 6. Paper Trading / Demo Accounts

### 6.1 Concept: Risk-Free Practice

**Problem**: Users want to test MOBU's recommendations before risking real money.

**Solution**: Paper trading (simulated trading with virtual money)
- User gets **$100,000 virtual cash**
- Executes trades using **real market prices**
- No real money at risk
- Tracks performance as if trades were real

### 6.2 Alpaca-Style Paper Trading

**Alpaca** (https://alpaca.markets/) offers:
- **Paper Trading API**: Free, no real money
- **Real-time market data**: Uses actual NYSE/NASDAQ prices
- **Same API as live trading**: Easy transition to real account

**For African Context**: Since Alpaca focuses on US markets, MOBU needs:

#### Option A: Use Alpaca for US Stocks (Global Markets)
```python
import alpaca_trade_api as tradeapi

# Paper trading credentials (free from Alpaca)
api = tradeapi.REST(
    key_id='PK...',  # Paper trading key
    secret_key='...',
    base_url='https://paper-api.alpaca.markets'  # Paper trading endpoint
)

# Place paper trade
order = api.submit_order(
    symbol='AAPL',
    qty=10,
    side='buy',
    type='market',
    time_in_force='gtc'
)

# Check paper account balance
account = api.get_account()
print(f"Paper cash: ${account.cash}")
print(f"Paper portfolio value: ${account.portfolio_value}")
```

#### Option B: Build Custom African Paper Trading System
For JSE, NGX, NSE stocks (not covered by Alpaca):

```python
class MobuPaperTradingEngine:
    """
    Simulates trades for African stocks using real market prices
    """
    def __init__(self, user_id):
        self.user_id = user_id
        self.virtual_cash = 100000.00  # Start with $100k virtual
        self.holdings = {}  # {'DANGCEM': {'qty': 10, 'avg_cost': 285.50}}
    
    def execute_paper_trade(self, symbol, side, qty, exchange='NGX'):
        # Fetch real-time price from Mansa API
        price = self._get_real_time_price(symbol, exchange)
        
        if side == 'buy':
            cost = price * qty
            if cost > self.virtual_cash:
                raise InsufficientFunds("Not enough virtual cash")
            
            self.virtual_cash -= cost
            self.holdings[symbol] = {
                'qty': self.holdings.get(symbol, {}).get('qty', 0) + qty,
                'avg_cost': price  # Simplified (should calculate weighted avg)
            }
        
        elif side == 'sell':
            if symbol not in self.holdings or self.holdings[symbol]['qty'] < qty:
                raise InsufficientShares("Not enough shares to sell")
            
            proceeds = price * qty
            self.virtual_cash += proceeds
            self.holdings[symbol]['qty'] -= qty
        
        # Log trade to DB for performance tracking
        self._log_paper_trade(symbol, side, qty, price)
    
    def _get_real_time_price(self, symbol, exchange):
        # Call Mansa API for African stocks
        response = requests.get(f"https://api.mansaapi.com/markets/{exchange}/ticker/{symbol}")
        return response.json()['price']
    
    def get_paper_portfolio_value(self):
        """Calculate current value of paper portfolio"""
        portfolio_value = self.virtual_cash
        for symbol, holding in self.holdings.items():
            current_price = self._get_real_time_price(symbol, exchange='NGX')
            portfolio_value += current_price * holding['qty']
        return portfolio_value
```

### 6.3 Database Schema: Paper Trading

```sql
CREATE TABLE raw_data.paper_trading_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL UNIQUE,
    virtual_cash NUMERIC(20,2) DEFAULT 100000.00,
    total_portfolio_value NUMERIC(20,2),
    total_pnl NUMERIC(20,2), -- Profit/loss
    total_pnl_pct NUMERIC(8,4), -- % return
    trades_count INTEGER DEFAULT 0,
    win_rate NUMERIC(5,4), -- % of winning trades
    sharpe_ratio NUMERIC(8,4),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE raw_data.paper_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES raw_data.paper_trading_accounts(account_id),
    user_id VARCHAR(50) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20), -- 'NGX', 'JSE', 'NSE', 'NYSE'
    side VARCHAR(10), -- 'buy', 'sell'
    quantity NUMERIC(20,8),
    price NUMERIC(20,8),
    total_value NUMERIC(20,2),
    currency VARCHAR(10),
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paper_trades_account ON raw_data.paper_trades(account_id, executed_at DESC);
CREATE INDEX idx_paper_trades_user ON raw_data.paper_trades(user_id);
```

### 6.4 Paper Trading UI Flow

1. **User signup**: "Try MOBU with $100,000 virtual cash"
2. **User sees recommendations**: Same AI recommendations as real accounts
3. **User clicks "Execute (Paper)"**: Trade recorded with real market prices
4. **Dashboard shows**:
   - Current paper portfolio value
   - P&L (profit/loss)
   - Win rate
   - Sharpe ratio
   - Leaderboard (compare with other paper traders)
5. **Confidence building**: After 30 days, user sees "You would have made $5,200 profit. Ready to go live?"
6. **Upgrade to live**: Connect real broker + payment gateway

---

## 7. Data Model Extensions

### 7.1 New Tables Required

```sql
-- African stock price feeds
CREATE TABLE raw_data.african_price_feeds (
    feed_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL, -- 'Mansa API', 'African Markets API'
    exchange VARCHAR(20) NOT NULL, -- 'NGX', 'JSE', 'NSE', 'EGX', 'GSE'
    asset_symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    price_timestamp TIMESTAMPTZ NOT NULL,
    open_price NUMERIC(20,8),
    high_price NUMERIC(20,8),
    low_price NUMERIC(20,8),
    close_price NUMERIC(20,8) NOT NULL,
    volume NUMERIC(30,8),
    currency VARCHAR(10) DEFAULT 'USD',
    data_quality_score NUMERIC(5,4) DEFAULT 1.0,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Alternative data (Quiver Quantitative, custom African sources)
CREATE TABLE raw_data.alternative_data (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source VARCHAR(100), -- 'Quiver', 'UnusualWhales', 'Kenya_eTender'
    data_type VARCHAR(50), -- 'congress_trade', 'insider', 'government_contract'
    asset_symbol VARCHAR(20),
    exchange VARCHAR(20),
    event_date DATE,
    actor_name VARCHAR(200),
    transaction_type VARCHAR(50),
    amount_min NUMERIC(20,2),
    amount_max NUMERIC(20,2),
    sentiment_signal VARCHAR(20), -- 'bullish', 'bearish', 'neutral'
    confidence_score NUMERIC(5,4),
    raw_data JSONB,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Broker connections (OAuth tokens)
CREATE TABLE raw_data.broker_connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    broker_name VARCHAR(100), -- 'EasyEquities', 'Bamboo', 'Chaka'
    broker_account_id VARCHAR(200), -- User's broker account ID
    oauth_access_token TEXT, -- Encrypted
    oauth_refresh_token TEXT, -- Encrypted
    token_expires_at TIMESTAMPTZ,
    connection_status VARCHAR(20), -- 'active', 'expired', 'revoked'
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trade execution history (real trades via brokers)
CREATE TABLE raw_data.executed_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    recommendation_id UUID, -- Links to MOBU recommendation
    broker_name VARCHAR(100),
    broker_order_id VARCHAR(200), -- Broker's order ID
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20),
    side VARCHAR(10), -- 'buy', 'sell'
    quantity NUMERIC(20,8),
    order_type VARCHAR(20), -- 'market', 'limit'
    limit_price NUMERIC(20,8),
    filled_qty NUMERIC(20,8),
    avg_fill_price NUMERIC(20,8),
    total_cost NUMERIC(20,2),
    currency VARCHAR(10),
    order_status VARCHAR(20), -- 'pending', 'filled', 'partial', 'cancelled'
    submitted_at TIMESTAMPTZ,
    filled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User payment/deposit/withdrawal history
CREATE TABLE raw_data.payment_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20), -- 'deposit', 'withdrawal'
    payment_method VARCHAR(50), -- 'm_pesa', 'bank_transfer', 'card'
    amount NUMERIC(20,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    gateway_provider VARCHAR(50), -- 'paystack', 'flutterwave'
    gateway_reference VARCHAR(200),
    status VARCHAR(20), -- 'pending', 'completed', 'failed'
    initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    callback_data JSONB
);

-- Paper trading accounts
CREATE TABLE raw_data.paper_trading_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL UNIQUE,
    virtual_cash NUMERIC(20,2) DEFAULT 100000.00,
    total_portfolio_value NUMERIC(20,2),
    total_pnl NUMERIC(20,2),
    trades_count INTEGER DEFAULT 0,
    win_rate NUMERIC(5,4),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Paper trades
CREATE TABLE raw_data.paper_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES raw_data.paper_trading_accounts(account_id),
    user_id VARCHAR(50) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20),
    side VARCHAR(10),
    quantity NUMERIC(20,8),
    price NUMERIC(20,8),
    total_value NUMERIC(20,2),
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 dbt Models to Create

```
models/staging/
├── stg_african_price_feeds.sql     # Validate African stock data
├── stg_alternative_data.sql        # Quiver + custom alt data
├── stg_broker_connections.sql      # User broker OAuth tokens
├── stg_executed_trades.sql         # Real trade history
├── stg_payment_transactions.sql    # Deposits/withdrawals
├── stg_paper_trades.sql            # Paper trading history

models/intermediate/
├── int_african_market_sentiment.sql  # Aggregate African market signals
├── int_alternative_data_signals.sql  # Convert alt data → trading signals
├── int_user_trading_performance.sql  # Real account P&L
├── int_paper_trading_performance.sql # Paper account P&L

models/marts/
├── mart_african_recommendations.sql  # African stock recommendations
├── mart_user_portfolio.sql           # User's current holdings (real + paper)
├── mart_trade_execution_analytics.sql # Broker trade success rates
├── mart_payment_analytics.sql        # Deposit/withdrawal trends
```

---

## 8. Implementation Roadmap

### Phase 1: Data Foundation (Weeks 1-4)
**Goal**: Ingest African market data + alternative data

**Tasks**:
1. ✅ Sign up for Mansa API (African stocks)
2. ✅ Sign up for Quiver Quantitative API (alternative data)
3. ✅ Create new database tables (african_price_feeds, alternative_data)
4. ✅ Build Data Feed Agent connectors
5. ✅ Create dbt staging models (stg_african_price_feeds, stg_alternative_data)
6. ✅ Test data pipeline end-to-end

**Deliverable**: MOBU dashboard shows JSE/NGX/NSE stocks + congressional trades

---

### Phase 2: Paper Trading (Weeks 5-8)
**Goal**: Launch risk-free demo accounts

**Tasks**:
1. ✅ Build paper trading engine (MobuPaperTradingEngine class)
2. ✅ Create database tables (paper_trading_accounts, paper_trades)
3. ✅ Build paper trading UI (MVP dashboard → "Paper Mode" toggle)
4. ✅ Implement leaderboard (top paper traders)
5. ✅ Add Alpaca paper trading for US stocks
6. ✅ User onboarding flow: "Start with $100k virtual cash"

**Deliverable**: Users can practice MOBU recommendations risk-free

---

### Phase 3: Broker Integration (Weeks 9-14)
**Goal**: Connect to 1-2 African brokers for live trading

**Tasks**:
1. ✅ Partnership discussion with EasyEquities / Bamboo / Chaka
2. ✅ OAuth2 integration (user authorizes MOBU to trade via broker)
3. ✅ Build broker API connectors (place orders, fetch account balance)
4. ✅ Create database tables (broker_connections, executed_trades)
5. ✅ UI: "Connect Broker" button → OAuth flow
6. ✅ Trade execution flow: MOBU recommendation → Broker API → Exchange
7. ✅ Audit trail: Show all trades sent to broker

**Deliverable**: Users can execute MOBU recommendations with 1-click via broker

---

### Phase 4: Payment Gateway (Weeks 15-18)
**Goal**: Enable deposits & withdrawals

**Tasks**:
1. ✅ Sign up for Paystack / Flutterwave
2. ✅ Build payment integration (deposit flow: M-Pesa, bank, card)
3. ✅ Build withdrawal flow (payout to user bank/mobile money)
4. ✅ Create database table (payment_transactions)
5. ✅ Implement webhook handling (Paystack/Flutterwave callbacks)
6. ✅ KYC/AML compliance (identity verification before withdrawals)
7. ✅ Currency conversion (NGN → USD → ZAR)

**Deliverable**: Users can deposit funds (M-Pesa, bank) & withdraw profits

---

### Phase 5: Alternative Data Signals (Weeks 19-24)
**Goal**: Integrate alternative data into recommendations

**Tasks**:
1. ✅ Build Quiver API connector (congressional trades, insiders, 13F)
2. ✅ Create African custom alternative data scrapers (government tenders, mining licenses)
3. ✅ dbt model: int_alternative_data_signals.sql (convert raw data → signals)
4. ✅ Enhance recommendation engine: Factor in alternative data
   - Example: "Congressman bought AAPL → Increase AAPL confidence score by 5%"
5. ✅ UI: Show alternative data in evidence trail
   - "Nancy Pelosi bought $2M AAPL on Aug 15"
   - "Anglo American won $500M mining contract in Zambia"

**Deliverable**: MOBU recommendations boosted by insider/congressional trading signals

---

### Phase 6: Multi-Exchange Expansion (Weeks 25-30)
**Goal**: Support 5+ African exchanges

**Tasks**:
1. ✅ Add EGX (Egypt), BRVM (West Africa), CSE (Morocco)
2. ✅ Normalize currency conversions (EGP, XOF, MAD → USD)
3. ✅ Add exchange-specific trading hours
4. ✅ Build market depth / order book data (if available)
5. ✅ Expand broker partnerships (local brokers for each country)

**Deliverable**: Pan-African coverage (JSE, NGX, NSE, EGX, GSE, BRVM, CSE)

---

## 9. Key Risks & Mitigations

### Risk 1: Broker Partnership Delays
**Mitigation**: Start with paper trading. Launch without live trading initially. Negotiate with 3+ brokers in parallel.

### Risk 2: Payment Gateway Compliance
**Mitigation**: Use established gateways (Paystack, Flutterwave) that handle compliance. Implement strict KYC/AML before allowing withdrawals.

### Risk 3: African Market Data Quality
**Mitigation**: Use data quality scores. Cross-validate between Mansa API + direct exchange scraping. Show users data freshness ("Last updated 5 mins ago").

### Risk 4: Currency Volatility (USD/NGN/KES/ZAR)
**Mitigation**: Offer multi-currency accounts. Show users FX rates prominently. Hedge currency risk with forward contracts (advanced).

### Risk 5: Regulatory Approval (Each Country)
**Mitigation**: Position MOBU as "investment intelligence platform" (not a broker). Users execute via licensed brokers. Consult local legal teams (Nigeria, Kenya, SA).

---

## 10. Success Metrics

### Month 3 (Paper Trading Launch)
- **5,000 paper trading accounts** created
- **50,000 paper trades** executed
- **Average paper account ROI**: 8-12% (vs market benchmark)

### Month 6 (Broker Integration)
- **500 live accounts** connected to brokers
- **$100,000 total AUM** (assets under management)
- **1,000 live trades executed** via MOBU recommendations

### Month 12 (Full Launch)
- **10,000 active users** (paper + live)
- **$5M AUM** across connected broker accounts
- **20,000 live trades/month**
- **Revenue**: $50K/month (subscription + broker revenue share)

---

## Conclusion

MOBU's African market integration positions the platform as **the first AI-powered investment intelligence platform built for African investors**, combining:
- **Local market data** (JSE, NGX, NSE) + **Global markets** (NYSE, NASDAQ)
- **Alternative data** (congressional trades, insiders, African gov contracts)
- **Seamless execution** via broker APIs (EasyEquities, Bamboo, Chaka)
- **African payment rails** (M-Pesa, Paystack, Flutterwave)
- **Risk-free practice** via paper trading

This architecture allows MOBU to launch quickly, iterate based on user feedback, and scale across the continent.

---

**Next Steps**:
1. Sign up for Mansa API + Quiver Quantitative
2. Build dbt models for African markets + alternative data
3. Launch paper trading MVP (Week 8 target)
4. Initiate broker partnership discussions

**Document Version**: 1.0  
**Last Updated**: 2026-09-12  
**Owner**: MOBU Engineering Team
