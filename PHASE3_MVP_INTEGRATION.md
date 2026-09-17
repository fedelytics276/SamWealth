# Phase 3: MVP Integration with dbt

## Overview

This phase integrates the MOBU MVP dashboard with the dbt data pipeline, creating a complete data flow from external sources → raw data → dbt transformations → dashboard display.

## What Was Created

### 1. Database Connection Layer (`lib/db.ts`)
- PostgreSQL connection pooling
- Type-safe query wrapper
- Graceful fallback to JSON data
- TypeScript interfaces for all models

**Features**:
- ✅ Connection pool management (max 20 connections)
- ✅ Query logging with duration tracking
- ✅ Type definitions for QualityMetrics, Portfolio, Recommendations
- ✅ Automatic error handling

### 2. Updated API Endpoints

#### `/api/portfolio.ts` (Enhanced)
**Before**: Static JSON file  
**After**: Queries PostgreSQL with JSON fallback

```typescript
// Queries raw_data.portfolio_valuations
// Falls back to JSON if DB not configured
// Returns unified response format
```

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalValue": 105250.00,
      "cashBalance": 5250.00,
      "investedAmount": 100000.00,
      "totalReturn": 5250.00,
      "totalReturnPct": 5.25
    },
    "holdings": [...]
  },
  "timestamp": "2026-09-12T...",
  "source": "database" | "json" | "json-fallback"
}
```

#### `/api/quality-metrics.ts` (NEW)
**Purpose**: Query dbt mart_quality_dashboard  
**Fallback**: Mock data matching dbt schema

```typescript
// Queries analytics.mart_quality_dashboard
// Returns all 4 AI Quality Criteria
// Includes dbt lineage metadata
```

**Response**:
```json
{
  "success": true,
  "data": {
    "criterion_1_name": "Accuracy",
    "criterion_1_value": 99.96,
    "criterion_1_compliant": true,
    
    "criterion_2_name": "Reliability",
    "criterion_2_value": 99.92,
    "criterion_2_compliant": true,
    
    "criterion_3_name": "Sharpe Ratio",
    "criterion_3_value": 1.62,
    "criterion_3_compliant": true,
    
    "criterion_4_name": "Self-Improving",
    "criterion_4_value": 85.3,
    "criterion_4_compliant": true,
    
    "overall_compliant": true,
    "lineage_tool": "dbt",
    "dbt_run_timestamp": "2026-09-12T...",
    "dbt_invocation_id": "abc123..."
  },
  "source": "dbt-marts" | "mock"
}
```

### 3. Data Feed Agent (`data_feed_agent.py`)

**Purpose**: Fetch data from external sources and write to raw_data schema

**Features**:
- ✅ Connection pooling (1-10 connections)
- ✅ Modular fetchers for each feed type
- ✅ Bulk insert with conflict handling
- ✅ Configurable modes: single-run or continuous
- ✅ Comprehensive logging
- ✅ Graceful shutdown on SIGINT

**Feed Types**:
1. **Price Feeds**: Bloomberg, Refinitiv, exchanges
2. **On-Chain Feeds**: Ethereum, BSC, DeFi events
3. **News Feeds**: Reuters, Bloomberg news + sentiment
4. **Macro Feeds**: FRED, BLS economic indicators

**Usage**:
```bash
# Single run (testing)
export MOBU_DB_PASSWORD="your_password"
python3 data_feed_agent.py

# Continuous mode (production)
export FEED_MODE="continuous"
export FEED_INTERVAL="300"  # 5 minutes
python3 data_feed_agent.py

# Or via cron (every 5 minutes)
*/5 * * * * cd /path/to/SamWealth && python3 data_feed_agent.py
```

**Current Implementation**: Simulated data (mock)  
**TODO**: Replace fetchers with real API calls

### 4. Database Setup Script (`mobu_dbt/database_setup.sql`)

**Features**:
- ✅ Creates all schemas (raw_data, staging, intermediate, marts, analytics)
- ✅ Creates 9 raw data tables
- ✅ Indexes for performance
- ✅ Sample data for testing
- ✅ User permissions
- ✅ Verification queries

**Tables Created**:
1. `raw_data.price_data_raw` - Price feeds
2. `raw_data.onchain_data_raw` - Blockchain data
3. `raw_data.news_data_raw` - News + sentiment
4. `raw_data.macro_data_raw` - Economic indicators
5. `raw_data.recommendations` - AI recommendations
6. `raw_data.system_health` - Uptime monitoring
7. `raw_data.portfolio_valuations` - Portfolio values
8. `raw_data.model_versions` - ML model tracking
9. `raw_data.model_feedback` - Learning feedback

**Sample Data**: Includes realistic test data for all tables

## Complete Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL DATA SOURCES                         │
│  Bloomberg │ Refinitiv │ Binance │ Ethereum │ Reuters │ FRED    │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│              DATA FEED AGENT (data_feed_agent.py)                │
│  • Fetch from APIs      • Validate data types                    │
│  • Quality scoring      • Bulk insert                            │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                RAW DATA (PostgreSQL raw_data schema)             │
│  • price_data_raw       • onchain_data_raw                       │
│  • news_data_raw        • macro_data_raw                         │
│  • recommendations      • system_health                          │
│  • portfolio_valuations • model_versions                         │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼ [dbt run every hour]
┌──────────────────────────────────────────────────────────────────┐
│                    dbt STAGING LAYER (Views)                     │
│  ✓ Schema validation    ✓ Deduplication                          │
│  ✓ Quality filtering    ✓ Standardization                        │
│  • stg_price_feeds      • stg_onchain_feeds                      │
│  • stg_news_feeds       • stg_macro_feeds                        │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                dbt INTERMEDIATE LAYER (Ephemeral)                │
│  ⚡ Business logic      ⚡ Metric calculations                    │
│  • int_accuracy_metrics (Criterion 1: 99.95%)                    │
│  • int_reliability_metrics (Criterion 2: 99.9%)                  │
│  • int_sharpe_ratio (Criterion 3: Sharpe ≥1.5)                   │
│  • int_learning_metrics (Criterion 4: Self-improving)            │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  dbt MARTS LAYER (Tables)                        │
│  📊 Analytics-ready     📊 Indexed & optimized                   │
│  • mart_quality_dashboard (4 criteria + compliance)              │
│  • mart_portfolio_performance (future)                           │
│  • mart_recommendations (future)                                 │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                 MOBU MVP APIs (Next.js)                          │
│  • /api/quality-metrics  → Query marts                           │
│  • /api/portfolio        → Query raw_data or marts               │
│  • /api/recommendations  → Query raw_data or marts               │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    MOBU MVP DASHBOARD                            │
│  🎯 Quality Metrics (4 badges)  🎯 Evidence Graphs               │
│  🎯 Compliance Reports          🎯 Portfolio Analytics           │
└──────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### Step 1: Set Up PostgreSQL Database (5 minutes)

```bash
# Option A: Local PostgreSQL
createdb mobu_dev

# Option B: Docker PostgreSQL
docker run --name mobu-postgres \
  -e POSTGRES_DB=mobu_dev \
  -e POSTGRES_USER=mobu_user \
  -e POSTGRES_PASSWORD=mobu_dev_2024 \
  -p 5432:5432 \
  -d postgres:15

# Run setup script
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
psql -h localhost -U mobu_user -d mobu_dev -f database_setup.sql
```

**Expected Output**:
```
CREATE SCHEMA
CREATE SCHEMA
...
CREATE TABLE
CREATE TABLE
...
INSERT 0 4
INSERT 0 2
...
Database setup complete!
```

### Step 2: Configure Environment Variables

```bash
# Add to ~/.zshrc or ~/.bash_profile
export MOBU_DB_PASSWORD="mobu_dev_2024"
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="mobu_dev"
export DB_USER="mobu_user"

# For dbt
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"

# Reload shell
source ~/.zshrc
```

### Step 3: Test dbt Connection (1 minute)

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
dbt debug
```

**Expected Output**:
```
Connection test: [OK]
All checks passed!
```

### Step 4: Run dbt Models (2 minutes)

```bash
# Build all models
dbt run

# Run specific layers
dbt run --select tag:staging
dbt run --select tag:quality
dbt run --select mart_quality_dashboard

# Run tests
dbt test
```

**Expected Output**:
```
Completed successfully
Done. PASS=15 WARN=0 ERROR=0 SKIP=0 TOTAL=15
```

### Step 5: Run Data Feed Agent (1 minute)

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth

# Install Python dependencies
pip3 install psycopg2-binary --user

# Single run (testing)
python3 data_feed_agent.py
```

**Expected Output**:
```
2026-09-12 15:45:00 - data_feed_agent - INFO - 🚀 MOBU Data Feed Agent starting...
2026-09-12 15:45:00 - data_feed_agent - INFO - ✅ Database connection pool initialized
2026-09-12 15:45:00 - data_feed_agent - INFO - Fetching price data...
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 3 price records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 1 on-chain records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 1 news records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 1 macro records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Feed cycle complete: 6 total records inserted
```

### Step 6: Install MVP Dependencies (2 minutes)

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp

# Install pg (PostgreSQL client)
npm install
```

### Step 7: Update MVP Environment

```bash
# Create or update .env.local
cat > .env.local <<EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mobu_dev
DB_USER=mobu_user
DB_PASSWORD=mobu_dev_2024
MOBU_DB_PASSWORD=mobu_dev_2024

# Set to 'false' to use database, 'true' for JSON fallback
USE_MOCK_DATA=false
EOF
```

### Step 8: Start MVP Dashboard (1 minute)

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev
```

**Visit**: http://localhost:3000

### Step 9: Verify Integration

#### Test Quality Metrics API:
```bash
curl http://localhost:3000/api/quality-metrics | jq
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "criterion_1_name": "Accuracy",
    "criterion_1_value": 99.96,
    "criterion_1_compliant": true,
    ...
    "overall_compliant": true,
    "lineage_tool": "dbt"
  },
  "source": "dbt-marts" or "mock"
}
```

#### Test Portfolio API:
```bash
curl http://localhost:3000/api/portfolio | jq
```

#### Check Database:
```sql
-- Connect to database
psql -h localhost -U mobu_user -d mobu_dev

-- Check raw data
SELECT COUNT(*) FROM raw_data.price_data_raw;
SELECT COUNT(*) FROM raw_data.onchain_data_raw;

-- Check if dbt ran
SELECT * FROM analytics.mart_quality_dashboard LIMIT 1;
```

## Deployment Architecture

### Development
```
Local Machine:
├── PostgreSQL (localhost:5432)
├── Data Feed Agent (python3 data_feed_agent.py)
├── dbt (manual runs: dbt run)
└── MVP Dashboard (npm run dev → localhost:3000)
```

### Production (Future)
```
Azure Cloud:
├── Azure Database for PostgreSQL
├── Azure Container Instances (Data Feed Agent)
├── Azure Data Factory (dbt scheduler)
└── Azure App Service (MVP Dashboard)
```

## Scheduling

### Option 1: Cron (Simple)
```bash
# Edit crontab
crontab -e

# Run Data Feed Agent every 5 minutes
*/5 * * * * cd /path/to/SamWealth && /usr/bin/python3 data_feed_agent.py >> /tmp/feed_agent.log 2>&1

# Run dbt every hour
0 * * * * cd /path/to/mobu_dbt && /Users/fedeanalytics/Library/Python/3.13/bin/dbt run >> /tmp/dbt.log 2>&1
```

### Option 2: Systemd Services
```bash
# Create service files
sudo nano /etc/systemd/system/mobu-feed-agent.service
sudo nano /etc/systemd/system/mobu-dbt.timer

# Enable and start
sudo systemctl enable mobu-feed-agent.service
sudo systemctl start mobu-feed-agent.service
```

### Option 3: Azure Data Factory (Production)
```yaml
Pipeline:
  - Trigger: Schedule (every hour)
  - Activities:
      1. Execute Python Script (data_feed_agent.py)
      2. Execute dbt CLI (dbt run)
      3. Send notification on failure
```

## Troubleshooting

### Database Connection Fails
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -U mobu_user -d mobu_dev -c "SELECT 1;"

# Check credentials
echo $MOBU_DB_PASSWORD
```

### dbt Models Fail
```bash
# Check connection
dbt debug

# Compile to see generated SQL
dbt compile --select model_name

# Check logs
cat target/run.log
```

### MVP Can't Connect
```bash
# Check .env.local exists
cat mobu-mvp/.env.local

# Check API response
curl http://localhost:3000/api/quality-metrics

# Check browser console (F12)
# Look for database errors
```

### No Data in Database
```bash
# Run Data Feed Agent manually
python3 data_feed_agent.py

# Check if data was inserted
psql -h localhost -U mobu_user -d mobu_dev \
  -c "SELECT COUNT(*) FROM raw_data.price_data_raw;"

# Run dbt to transform
cd mobu_dbt && dbt run
```

## Next Steps

### Immediate (This Week)
1. ✅ Database setup complete
2. ✅ dbt models created
3. ✅ Data Feed Agent created
4. ✅ MVP APIs enhanced
5. ⏳ Test end-to-end data flow
6. ⏳ Update dashboard components to use new API

### Short-term (Next 2 Weeks)
7. Replace mock fetchers with real APIs:
   - Bloomberg API integration
   - Coinbase/Binance WebSocket feeds
   - NewsAPI or Reuters integration
   - FRED API for macro data
8. Add authentication to APIs
9. Set up monitoring/alerting
10. Schedule dbt runs automatically

### Medium-term (Next Month)
11. Create additional dbt marts (portfolio, recommendations)
12. Add incremental models for performance
13. Deploy to Azure
14. Set up CI/CD pipeline
15. Create investor demo with live data

## Summary

✅ **Phase 3 Complete**:
- Database layer created (`lib/db.ts`)
- APIs enhanced (`/api/quality-metrics`, `/api/portfolio`)
- Data Feed Agent implemented (`data_feed_agent.py`)
- Database setup script ready (`database_setup.sql`)
- PostgreSQL dependency added to MVP

**Current State**:
- MVP can query database OR fall back to JSON
- Data Feed Agent can populate raw tables
- dbt can transform raw → marts
- End-to-end data flow is ready

**Next**: Execute setup steps to test full integration, then proceed to Phase 4 (Production deployment).

---

**Files Created**:
- `mobu-mvp/lib/db.ts` - Database connection layer
- `mobu-mvp/pages/api/quality-metrics.ts` - Quality metrics API
- `data_feed_agent.py` - Data ingestion agent
- `mobu_dbt/database_setup.sql` - Database initialization
- `PHASE3_MVP_INTEGRATION.md` - This document

**Dependencies Added**:
- `pg` (PostgreSQL client for Node.js)
- `@types/pg` (TypeScript types)
- `psycopg2-binary` (PostgreSQL client for Python)
