# Congressional Trading Data Integration - MOBU Platform

## Executive Summary

**Objective**: Integrate congressional stock trading data (Capitol Trades) into MOBU to refine investment strategies by tracking and analyzing trades made by U.S. House and Senate members.

**Data Source**: Bargo Congress Trades API (free tier available)  
**Historical Data**: 2+ years available (42,000+ trades across 415 members)  
**Cost**: **FREE** for up to 1,000 rows/day with API key  
**Integration Complexity**: Low (REST API, JSON format)  
**Strategic Value**: High (sentiment signal, political trend analysis, contrarian indicators)

---

## Why Congressional Trades Matter for MOBU

### 1. **Sentiment Signal**
Congressional trades provide early signals about sector sentiment and upcoming legislative changes. Politicians often have advance knowledge of policy shifts affecting specific industries.

### 2. **Contrarian Indicators**
Research shows congressional trades historically underperform the market. Knowing what Congress is buying/selling can be used as a **contrarian signal** - potentially do the opposite or avoid their picks.

### 3. **Sector Rotation Insights**
Large-scale buying/selling by multiple members in specific sectors (defense, tech, healthcare) can indicate upcoming policy changes or lobbying pressure.

### 4. **Transparency Enhancement**
Displaying congressional trades alongside MOBU recommendations enhances platform transparency and differentiates from competitors.

---

## Data Source Analysis

### Bargo Congress Trades API

**Provider**: [Bargo](https://www.bargo.ai/free-apis/congress/v1/trades)  
**Official Source**: U.S. House Clerk + Senate eFD (STOCK Act disclosures)  
**Coverage**: 42,000+ trades, 415 members, 4,100+ tickers  
**Update Frequency**: As filed (typically 30-45 day reporting lag per STOCK Act)  
**Data Quality**: Normalized, validated, with performance tracking

#### API Endpoints
```
Base URL: https://www.bargo.ai/free-apis/congress/v1/

GET /trades          # List all trades (filterable)
GET /members         # List all members
GET /tickers/{sym}   # Ticker history
GET /stats           # Aggregate statistics
```

#### Free Tier Limits
| Tier | Requests/Day | Rows/Day | API Key Required |
|------|--------------|----------|------------------|
| Keyless | 30 | 100 (shared per IP) | No |
| **Free Key** | 100 | **1,000** | Yes (free) |
| Paid (Apify) | Unlimited | Unlimited | ~$0.62/trade |

**Recommendation**: Use **Free Key tier** (1,000 rows/day = sufficient for MOBU)

---

## Historical Data Availability

### 2-Year Retroactive Data: ✅ **AVAILABLE**

**Confirmed**: The Bargo API provides historical data going back multiple years. From the live API response (September 2026), trades from August 2026 are returned, and the API supports filtering by date range.

**Example Query for 2-Year Historical Data**:
```bash
curl "https://www.bargo.ai/free-apis/congress/v1/trades?fromDate=2024-09-01&toDate=2026-09-12&apiKey=YOUR_FREE_KEY"
```

### Data Fields Available
| Field | Description | Example |
|-------|-------------|---------|
| `member` | Congress member name | "Rohit Khanna" |
| `chamber` | House or Senate | "house" |
| `ticker` | Stock symbol | "NVDA" |
| `type` | Transaction type | "purchase", "sale", "exchange" |
| `amount_low` | Minimum disclosed amount | 1001 |
| `amount_high` | Maximum disclosed amount | 15000 |
| `transaction_date` | Actual trade date | "2026-08-24" |
| `disclosure_date` | Filing date | "2026-09-04" |
| `est_price` | Estimated trade price | 229.29 |
| `recent_price` | Current price | 236.10 |
| `perf_pct` | Performance since trade | 2.97 |
| `outcome` | Trade outcome classification | "gain", "loss", "early_exit" |

### Performance Tracking
The API uniquely provides **per-trade performance metrics**:
- Estimated transaction price vs current price
- Percent gain/loss since disclosure
- Outcome classification (gain, loss, early_exit, good_exit)

---

## Cost Analysis

### Option 1: Bargo Free API ✅ **RECOMMENDED**

**Cost**: **$0/month**  
**Limits**: 1,000 trades/day (sufficient for MOBU)  
**Setup**: Sign up at [bargo.ai/free-apis/dash](https://www.bargo.ai/free-apis/dash)

**Calculation**:
- 1,000 trades/day × 30 days = 30,000 trades/month
- Historical backfill: ~10 days to download 2 years (42,000 trades ÷ 1,000/day = 42 days max)
- **Ongoing cost: $0**

---

### Option 2: Apify Congress Trades Actor

**Cost**: Pay-per-use via Apify platform  
**Pricing**: ~$0.62 per trade (Apify execution fees)  
**Use Case**: Bulk historical download or high-frequency scraping

**Calculation for 2-Year Historical Data**:
- 42,000 historical trades × $0.62 = **~$26,040** (NOT RECOMMENDED)
- Better to use free API and batch download over 42 days

---

### Option 3: Capitol Trades Premium (Third-Party)

**Provider**: CapitolTrades.com  
**Cost**: Not publicly disclosed (estimated $200-500/month for API access)  
**Features**: Additional UI, alerts, portfolio tracking  
**Verdict**: Unnecessary - Bargo provides same underlying data for free

---

## Integration Architecture

### Phase 1: Data Ingestion (Week 1)

#### 1.1 Create Raw Data Table
```sql
-- Add to database_setup.sql
CREATE TABLE IF NOT EXISTS raw_data.congressional_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_name VARCHAR(200) NOT NULL,
    member_slug VARCHAR(200),
    chamber VARCHAR(20) NOT NULL, -- house, senate
    state VARCHAR(10),
    party VARCHAR(20), -- republican, democrat, independent
    ticker VARCHAR(20) NOT NULL,
    asset_description TEXT,
    transaction_type VARCHAR(20) NOT NULL, -- purchase, sale, exchange
    amount_low NUMERIC(12,2),
    amount_high NUMERIC(12,2),
    amount_range VARCHAR(50),
    transaction_date DATE NOT NULL,
    disclosure_date DATE NOT NULL,
    est_price NUMERIC(20,8),
    recent_price NUMERIC(20,8),
    recent_price_date DATE,
    perf_pct NUMERIC(8,4),
    realized_return_pct NUMERIC(8,4),
    outcome VARCHAR(20), -- gain, loss, early_exit, good_exit, flat
    filing_portal_url TEXT,
    data_quality_score NUMERIC(5,4) DEFAULT 1.0,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_congressional_trades_ticker ON raw_data.congressional_trades(ticker, transaction_date DESC);
CREATE INDEX idx_congressional_trades_member ON raw_data.congressional_trades(member_slug, transaction_date DESC);
CREATE INDEX idx_congressional_trades_date ON raw_data.congressional_trades(transaction_date DESC);
CREATE INDEX idx_congressional_trades_type ON raw_data.congressional_trades(transaction_type);
```

#### 1.2 Python Data Feed Agent
```python
# scripts/congressional_trades_feed.py
import requests
import psycopg2
from datetime import datetime, timedelta
import os

BARGO_API_KEY = os.environ.get('BARGO_API_KEY')  # Get free key
BASE_URL = "https://www.bargo.ai/free-apis/congress/v1/trades"

def fetch_congressional_trades(from_date, to_date=None, ticker=None):
    """Fetch trades from Bargo API"""
    params = {
        'apiKey': BARGO_API_KEY,
        'fromDate': from_date.strftime('%Y-%m-%d'),
        'maxItems': 1000  # Free tier limit
    }
    if to_date:
        params['toDate'] = to_date.strftime('%Y-%m-%d')
    if ticker:
        params['ticker'] = ticker
        
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()['trades']

def ingest_to_database(trades):
    """Insert trades into PostgreSQL"""
    conn = psycopg2.connect(
        host="localhost",
        database="mobu_dev",
        user="mobu_user",
        password=os.environ['MOBU_DB_PASSWORD']
    )
    cursor = conn.cursor()
    
    for trade in trades:
        cursor.execute("""
            INSERT INTO raw_data.congressional_trades 
            (member_name, member_slug, chamber, state, ticker, asset_description,
             transaction_type, amount_low, amount_high, amount_range,
             transaction_date, disclosure_date, est_price, recent_price,
             recent_price_date, perf_pct, realized_return_pct, outcome,
             filing_portal_url, data_quality_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (
            trade['member'], trade['member_slug'], trade['chamber'],
            trade.get('state'), trade['ticker'], trade.get('asset'),
            trade['type'], trade.get('amount_low'), trade.get('amount_high'),
            trade.get('amount_range'), trade['transaction_date'],
            trade['disclosure_date'], trade.get('est_price'),
            trade.get('recent_price'), trade.get('recent_price_date'),
            trade.get('perf_pct'), trade.get('realized_return_pct'),
            trade.get('outcome'), trade.get('filing_portal'), 0.98
        ))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"Ingested {len(trades)} trades")

def backfill_historical_data():
    """Download 2 years of historical data (42 days @ 1k/day)"""
    start_date = datetime.now() - timedelta(days=730)  # 2 years ago
    current_date = start_date
    
    while current_date < datetime.now():
        end_date = current_date + timedelta(days=30)
        print(f"Fetching trades from {current_date.date()} to {end_date.date()}...")
        
        trades = fetch_congressional_trades(current_date, end_date)
        if trades:
            ingest_to_database(trades)
        
        current_date = end_date

if __name__ == "__main__":
    # First run: backfill 2 years
    backfill_historical_data()
    
    # Ongoing: run daily via cron
    # trades = fetch_congressional_trades(datetime.now() - timedelta(days=7))
    # ingest_to_database(trades)
```

---

### Phase 2: dbt Staging Model (Week 1)

```sql
-- models/staging/congressional/stg_congressional_trades.sql
{{
  config(
    materialized='view',
    tags=['staging', 'congressional', 'alternative_data']
  )
}}

-- Staging: Congressional trades for sentiment analysis

with source_data as (
    select
        trade_id,
        member_name,
        member_slug,
        chamber,
        state,
        ticker,
        asset_description,
        transaction_type,
        amount_low,
        amount_high,
        transaction_date,
        disclosure_date,
        est_price,
        recent_price,
        perf_pct,
        outcome,
        ingested_at
    from {{ source('raw_feeds', 'congressional_trades') }}
    where transaction_date >= current_date - interval '730 days'
),

validated as (
    select
        trade_id,
        member_name,
        member_slug,
        chamber,
        state,
        ticker,
        asset_description,
        transaction_type,
        amount_low,
        amount_high,
        transaction_date,
        disclosure_date,
        est_price,
        recent_price,
        perf_pct,
        outcome,
        -- Calculate reporting lag (disclosure - transaction date)
        disclosure_date - transaction_date as reporting_lag_days,
        -- Lineage metadata
        'congressional_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where ticker is not null
      and transaction_type in ('purchase', 'sale', 'exchange')
)

select
    trade_id,
    member_name,
    member_slug,
    chamber,
    state,
    ticker,
    asset_description,
    transaction_type,
    amount_low,
    amount_high,
    transaction_date,
    disclosure_date,
    reporting_lag_days,
    est_price,
    recent_price,
    perf_pct,
    outcome,
    feed_type,
    processed_at
from validated
```

---

### Phase 3: Analytics Marts (Week 2)

#### 3.1 Congressional Sentiment by Ticker
```sql
-- models/marts/congressional/mart_congressional_sentiment.sql
{{
  config(
    materialized='table',
    tags=['marts', 'congressional', 'sentiment']
  )
}}

-- Aggregate congressional trading activity by ticker

with recent_trades as (
    select
        ticker,
        transaction_type,
        transaction_date,
        amount_low,
        amount_high,
        member_name,
        chamber
    from {{ ref('stg_congressional_trades') }}
    where transaction_date >= current_date - interval '90 days'
),

ticker_sentiment as (
    select
        ticker,
        count(*) as total_trades,
        count(*) filter (where transaction_type = 'purchase') as purchase_count,
        count(*) filter (where transaction_type = 'sale') as sale_count,
        sum(amount_low) filter (where transaction_type = 'purchase') as total_purchase_amount_low,
        sum(amount_low) filter (where transaction_type = 'sale') as total_sale_amount_low,
        count(distinct member_name) as unique_members,
        max(transaction_date) as latest_trade_date
    from recent_trades
    group by ticker
)

select
    ticker,
    total_trades,
    purchase_count,
    sale_count,
    unique_members,
    latest_trade_date,
    -- Sentiment score: (purchases - sales) / total trades
    round(
        (purchase_count - sale_count)::numeric / total_trades::numeric,
        4
    ) as sentiment_score,
    -- Classify sentiment
    case
        when (purchase_count - sale_count)::numeric / total_trades::numeric > 0.3 then 'bullish'
        when (purchase_count - sale_count)::numeric / total_trades::numeric < -0.3 then 'bearish'
        else 'neutral'
    end as sentiment_label,
    current_timestamp as calculated_at
from ticker_sentiment
where total_trades >= 3  -- Minimum 3 trades for signal
order by total_trades desc
```

#### 3.2 Contrarian Signal Indicator
```sql
-- models/marts/congressional/mart_contrarian_signals.sql
-- Tickers with heavy congressional buying (potentially contrarian sell signal)

select
    ticker,
    purchase_count,
    sale_count,
    sentiment_score,
    unique_members,
    latest_trade_date,
    'contrarian_sell' as signal_type,
    case
        when sentiment_score > 0.5 and unique_members >= 5 then 'strong'
        when sentiment_score > 0.3 and unique_members >= 3 then 'moderate'
        else 'weak'
    end as signal_strength
from {{ ref('mart_congressional_sentiment') }}
where sentiment_score > 0.3  -- More purchases than sales
order by sentiment_score desc, unique_members desc
limit 50
```

---

### Phase 4: MOBU Integration (Week 2-3)

#### 4.1 Add to Recommendation Engine
```python
# services/recommendation_engine.py

def get_congressional_sentiment(ticker):
    """Get congressional trading sentiment for a ticker"""
    query = """
        SELECT sentiment_score, sentiment_label, total_trades, unique_members
        FROM analytics.mart_congressional_sentiment
        WHERE ticker = %s
    """
    result = db.execute(query, (ticker,))
    return result.fetchone() if result else None

def generate_recommendation(ticker):
    # ... existing logic ...
    
    # Add congressional sentiment as a factor
    congressional_data = get_congressional_sentiment(ticker)
    if congressional_data:
        sentiment_score, label, trades, members = congressional_data
        
        # Contrarian adjustment: heavy congressional buying = caution signal
        if label == 'bullish' and members >= 5:
            confidence_adjustment = -0.05  # Reduce confidence by 5%
            reasoning += f" Congressional insiders are heavily buying ({members} members, {trades} trades) - contrarian caution advised."
        elif label == 'bearish' and members >= 5:
            confidence_adjustment = +0.03  # Slight boost
            reasoning += f" Congressional insiders are selling - potential opportunity."
    
    # ... rest of recommendation logic ...
```

#### 4.2 Evidence Trail Integration
```typescript
// components/CongressionalTradesCard.tsx

export function CongressionalTradesCard({ ticker }: { ticker: string }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch(`/api/congressional-trades?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => setTrades(data));
  }, [ticker]);

  return (
    <Card>
      <CardHeader>
        <h3>Congressional Activity</h3>
        <Badge variant={sentiment === 'bullish' ? 'success' : 'warning'}>
          {sentiment}
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount Range</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.trade_id}>
                <td>{trade.member_name}</td>
                <td>
                  <Badge variant={trade.transaction_type === 'purchase' ? 'info' : 'default'}>
                    {trade.transaction_type}
                  </Badge>
                </td>
                <td>{formatDate(trade.transaction_date)}</td>
                <td>{trade.amount_range}</td>
                <td className={trade.perf_pct > 0 ? 'text-green-600' : 'text-red-600'}>
                  {trade.perf_pct > 0 ? '+' : ''}{trade.perf_pct}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

## Strategic Use Cases for MOBU

### 1. **Contrarian Signal**
- Heavy congressional buying in a sector → Potential overvaluation → Reduce exposure
- Heavy congressional selling → Potential undervaluation → Consider entry

### 2. **Sector Rotation Early Warning**
- Multiple members buying defense stocks → Potential defense spending increase
- Multiple members buying energy → Potential policy shift

### 3. **Insider Knowledge Proxy**
- Track which members sit on relevant committees (Finance, Energy, Defense)
- Weight their trades more heavily in sentiment calculations

### 4. **Transparency & Marketing**
- Display congressional trades alongside MOBU recommendations
- "Unlike Congress, MOBU recommendations are backed by evidence, not insider knowledge"

### 5. **Performance Comparison**
- Track MOBU portfolio vs "Congress Portfolio" (mimicking their trades)
- Show that MOBU outperforms congressional trading (likely)

---

## Implementation Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Database setup, API integration, historical backfill | 2 years of congressional trades in PostgreSQL |
| **Week 2** | dbt staging models, sentiment marts | Congressional sentiment dashboard |
| **Week 3** | Recommendation engine integration | Congressional factor in MOBU recommendations |
| **Week 4** | MVP UI components, testing | Congressional trades visible in evidence trail |

**Total Timeline**: 4 weeks (1 month)  
**Total Cost**: **$0** (using Bargo Free API)

---

## Cost Summary

### Recommended Approach: **Bargo Free API**

| Component | Cost |
|-----------|------|
| **Historical Data (2 years)** | $0 (42-day download @ 1k/day) |
| **Ongoing Data (daily updates)** | $0 (well within 1k/day limit) |
| **API Key** | $0 (free tier) |
| **Development Time** | ~80 hours ($8,000 @ $100/hr) |
| **Infrastructure** | $0 (uses existing PostgreSQL + dbt) |
| **Monthly Maintenance** | $0 (API is free) |

**Total One-Time Cost**: ~$8,000 (development only)  
**Total Monthly Cost**: **$0**

---

## Alternative: Paid Data (NOT RECOMMENDED)

If Bargo API becomes unavailable or rate-limited:

| Provider | Setup Cost | Monthly Cost | Notes |
|----------|------------|--------------|-------|
| Capitol Trades API | Unknown | ~$200-500 | Proprietary, limited docs |
| Apify Actor | $26k (2yr backfill) | $50-200 | Pay-per-use, expensive backfill |
| Custom Scraper | $15k dev | $100 hosting | Legal risk (STOCK Act data is public but scraping may violate ToS) |

**Verdict**: Stick with **Bargo Free API** - it's official, free, and comprehensive.

---

## Compliance & Legal

### STOCK Act Data
- All congressional trading data is **public record** under the STOCK Act (2012)
- MOBU displaying this data is **100% legal**
- No privacy concerns - members of Congress voluntarily disclosed these trades

### Attribution
Bargo API requires attribution in documentation but not in UI. Recommended footer text:
> "Congressional trading data sourced from official House and Senate STOCK Act filings"

---

## Next Steps

### Immediate (This Week)
1. ✅ Research complete - Bargo API identified
2. ⏳ Sign up for free Bargo API key at [bargo.ai/free-apis/dash](https://www.bargo.ai/free-apis/dash)
3. ⏳ Add `congressional_trades` table to `database_setup.sql`
4. ⏳ Create Python data feed script

### Short-term (Next 2 Weeks)
5. ⏳ Run historical backfill (42 days to download 2 years)
6. ⏳ Create dbt staging model `stg_congressional_trades`
7. ⏳ Build sentiment marts
8. ⏳ Test API integration

### Medium-term (Next Month)
9. ⏳ Integrate into recommendation engine
10. ⏳ Add congressional trades card to MVP evidence trail
11. ⏳ Create "Congress vs MOBU" performance comparison report
12. ⏳ Schedule daily cron job for ongoing updates

---

## References

- **Bargo Congress Trades API**: https://www.bargo.ai/free-apis/congress/v1/
- **Apify Actor**: https://apify.com/russet_flea/congress-trades-api
- **Capitol Trades Website**: https://www.capitoltrades.com/
- **STOCK Act (2012)**: https://www.congress.gov/bill/112th-congress/senate-bill/2038

---

**Version**: 1.0.0  
**Created**: 2026-09-12  
**Status**: Ready for Implementation  
**Cost**: $0/month (FREE with Bargo API)  
**Historical Data**: 2+ years available (42,000+ trades)
