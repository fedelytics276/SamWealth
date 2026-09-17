# MOBU dbt Integration - Deployment Checklist

## Prerequisites ✅
- [x] dbt-core 1.8.0 installed
- [x] dbt-postgres 1.8.0 installed
- [x] PostgreSQL available (local or cloud)
- [x] Python 3 installed
- [x] Node.js & npm installed

---

## Deployment Steps

### Step 1: Database Setup (5 min) ⏳
```bash
# Option A: Local PostgreSQL
createdb mobu_dev

# Option B: Use Docker
docker run --name mobu-postgres \
  -e POSTGRES_DB=mobu_dev \
  -e POSTGRES_USER=mobu_user \
  -e POSTGRES_PASSWORD=mobu_dev_2024 \
  -p 5432:5432 \
  -d postgres:15

# Run setup script
cd mobu_dbt
psql -h localhost -U mobu_user -d mobu_dev -f database_setup.sql
```

**Verification**:
```bash
psql -h localhost -U mobu_user -d mobu_dev -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'raw_data';"
```

**Expected**: Should return `raw_data`

---

### Step 2: Environment Configuration (2 min) ⏳
```bash
# Add to ~/.zshrc or ~/.bash_profile
cat >> ~/.zshrc <<'EOF'

# MOBU Environment Variables
export MOBU_DB_PASSWORD="mobu_dev_2024"
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="mobu_dev"
export DB_USER="mobu_user"
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
EOF

# Reload shell
source ~/.zshrc
```

**Verification**:
```bash
echo $MOBU_DB_PASSWORD
dbt --version
```

**Expected**: 
- Password displayed
- dbt version 1.8.0

---

### Step 3: Test dbt Connection (1 min) ⏳
```bash
cd mobu_dbt
dbt debug
```

**Expected Output**:
```
Configuration:
  profiles.yml file [OK found and valid]
  dbt_project.yml file [OK found and valid]

Required dependencies:
 - git [OK found]

Connection:
  host: localhost
  port: 5432
  user: mobu_user
  database: mobu_dev
  schema: analytics
  Connection test: [OK connection ok]

All checks passed!
```

---

### Step 4: Run dbt Models (2 min) ⏳
```bash
# From mobu_dbt directory
dbt run
```

**Expected Output**:
```
Running with dbt=1.8.0
Found 15 models, 40 tests, 0 snapshots, 0 analyses, 0 macros, 0 operations, 0 seed files

Completed successfully
Done. PASS=15 WARN=0 ERROR=0 SKIP=0 TOTAL=15
```

---

### Step 5: Run dbt Tests (1 min) ⏳
```bash
dbt test
```

**Expected**: All tests pass (some may warn if no data yet)

---

### Step 6: Populate Sample Data (1 min) ⏳
```bash
# Install Python dependency
pip3 install psycopg2-binary --user

# Run Data Feed Agent (single run)
cd ..
python3 data_feed_agent.py
```

**Expected Output**:
```
2026-09-12 15:45:00 - data_feed_agent - INFO - ✅ Database connection pool initialized
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 3 price records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Inserted 1 on-chain records
2026-09-12 15:45:01 - data_feed_agent - INFO - ✅ Feed cycle complete: 6 total records inserted
```

---

### Step 7: Rebuild dbt with New Data (1 min) ⏳
```bash
cd mobu_dbt
dbt run
```

**Verification**:
```bash
psql -h localhost -U mobu_user -d mobu_dev \
  -c "SELECT COUNT(*) FROM analytics.mart_quality_dashboard;"
```

**Expected**: Should return 1 row

---

### Step 8: Install MVP Dependencies (2 min) ⏳
```bash
cd ../mobu-mvp
npm install
```

**Expected**: `pg` and `@types/pg` packages installed

---

### Step 9: Configure MVP Environment (1 min) ⏳
```bash
# Create .env.local
cat > .env.local <<EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mobu_dev
DB_USER=mobu_user
DB_PASSWORD=mobu_dev_2024
MOBU_DB_PASSWORD=mobu_dev_2024

# Set to 'false' to use database
USE_MOCK_DATA=false
EOF
```

---

### Step 10: Start MVP Dashboard (1 min) ⏳
```bash
npm run dev
```

**Expected**: Server starts on http://localhost:3000

---

### Step 11: Test APIs (2 min) ⏳

#### Test 1: Quality Metrics API
```bash
curl http://localhost:3000/api/quality-metrics | jq
```

**Expected**: JSON with 4 criteria and `"source": "dbt-marts"` or `"source": "mock"`

#### Test 2: Portfolio API
```bash
curl http://localhost:3000/api/portfolio | jq
```

**Expected**: JSON with portfolio data and `"source": "database"` or `"source": "json"`

---

### Step 12: View dbt Documentation (1 min) ⏳
```bash
cd mobu_dbt
dbt docs generate
dbt docs serve
```

**Expected**: Browser opens to http://localhost:8080 with interactive docs

---

### Step 13: Verify Data Lineage (2 min) ⏳

In dbt docs (http://localhost:8080):
1. Click on `mart_quality_dashboard` model
2. Click "Lineage" tab
3. Verify graph shows: raw_data → staging → intermediate → marts

---

## Post-Deployment: Automation

### Option A: Cron Jobs (Simple)
```bash
crontab -e

# Add these lines:
# Run Data Feed Agent every 5 minutes
*/5 * * * * cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth && /usr/bin/python3 data_feed_agent.py >> /tmp/feed_agent.log 2>&1

# Run dbt every hour
0 * * * * cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt && /Users/fedeanalytics/Library/Python/3.13/bin/dbt run >> /tmp/dbt.log 2>&1
```

### Option B: Continuous Mode (Development)
```bash
# Run Data Feed Agent in continuous mode
export FEED_MODE="continuous"
export FEED_INTERVAL="300"  # 5 minutes
python3 data_feed_agent.py &

# Run dbt manually as needed
cd mobu_dbt && dbt run
```

---

## Troubleshooting

### ❌ dbt debug fails
```bash
# Check PostgreSQL running
pg_isready -h localhost -p 5432

# Test direct connection
psql -h localhost -U mobu_user -d mobu_dev -c "SELECT 1;"

# Check environment variables
echo $MOBU_DB_PASSWORD
```

### ❌ dbt run fails
```bash
# Check error in logs
cat target/run.log

# Compile to see generated SQL
dbt compile --select model_name

# Run single model with debug
dbt run --select stg_price_feeds --debug
```

### ❌ Data Feed Agent fails
```bash
# Check Python dependencies
pip3 list | grep psycopg2

# Test database connection
python3 -c "import psycopg2; conn = psycopg2.connect('dbname=mobu_dev user=mobu_user password=mobu_dev_2024'); print('✅ Connected')"

# Run with verbose logging
python3 data_feed_agent.py
```

### ❌ MVP can't connect to database
```bash
# Check .env.local exists
cat mobu-mvp/.env.local

# Check pg module installed
cd mobu-mvp
npm list pg

# Test API directly
curl http://localhost:3000/api/quality-metrics

# Check logs in terminal running npm run dev
```

### ❌ No data in mart_quality_dashboard
```bash
# Check raw data exists
psql -h localhost -U mobu_user -d mobu_dev <<EOF
SELECT 
  'price' as table_name, COUNT(*) FROM raw_data.price_data_raw
UNION ALL SELECT 'recommendations', COUNT(*) FROM raw_data.recommendations
UNION ALL SELECT 'system_health', COUNT(*) FROM raw_data.system_health
UNION ALL SELECT 'portfolio_valuations', COUNT(*) FROM raw_data.portfolio_valuations;
EOF

# If no data, run feed agent
python3 data_feed_agent.py

# Rebuild dbt
cd mobu_dbt && dbt run
```

---

## Success Criteria

✅ **All Complete When**:
- [ ] Database created with 9 tables
- [ ] dbt debug shows "All checks passed!"
- [ ] dbt run completes 15 models successfully
- [ ] Data Feed Agent inserts records
- [ ] mart_quality_dashboard has 1 row
- [ ] MVP starts without errors
- [ ] `/api/quality-metrics` returns data
- [ ] `/api/portfolio` returns data
- [ ] dbt docs display interactive lineage

---

## Quick Reference

### Key Commands
```bash
# dbt
cd mobu_dbt
dbt debug          # Test connection
dbt run            # Build all models
dbt test           # Run tests
dbt docs serve     # View documentation

# Data Feed Agent
python3 data_feed_agent.py                    # Single run
FEED_MODE=continuous python3 data_feed_agent.py  # Continuous

# MVP
cd mobu-mvp
npm run dev        # Start development server
npm run build      # Production build

# Database
psql -h localhost -U mobu_user -d mobu_dev    # Connect
psql ... -c "SELECT COUNT(*) FROM raw_data.price_data_raw;"  # Query
```

### Key Ports
- PostgreSQL: 5432
- MVP Dashboard: 3000
- dbt Docs: 8080

### Key Files
- `mobu_dbt/dbt_project.yml` - dbt configuration
- `mobu_dbt/profiles.yml` - Database connection
- `mobu_dbt/database_setup.sql` - DB initialization
- `data_feed_agent.py` - Data ingestion
- `mobu-mvp/.env.local` - MVP environment
- `mobu-mvp/lib/db.ts` - Database connection

---

## Documentation

- **Quick Start**: `DBT_QUICK_START.md`
- **Integration Guide**: `DBT_INTEGRATION.md`
- **Phase 3 Details**: `PHASE3_MVP_INTEGRATION.md`
- **Complete Summary**: `DBT_COMPLETE_SUMMARY.md`
- **This Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

**Estimated Total Time**: 20 minutes  
**Complexity**: Medium  
**Prerequisites**: PostgreSQL, Python 3, Node.js

**Status After Completion**: ✅ Full end-to-end data pipeline operational

---

*Last Updated: September 12, 2026*
