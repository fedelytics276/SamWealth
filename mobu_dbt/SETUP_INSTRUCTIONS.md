# MOBU Database Setup Instructions

## ✅ Completed Steps

1. ✅ dbt installed (v1.8.0)
2. ✅ dbt project created (`mobu_dbt/`)
3. ✅ 15 dbt models created (staging → intermediate → marts)
4. ✅ Database setup SQL script created (`database_setup.sql`)
5. ✅ PostgreSQL driver installed in MVP (`pg` package)
6. ✅ Database utility created (`lib/db.ts`)
7. ✅ MVP server running without errors

## 🔄 Next Step: Run Database Setup

### Prerequisites Check

Before proceeding, ensure PostgreSQL is installed:

```bash
# Check if PostgreSQL is installed
which psql

# If not installed, install via Homebrew:
# brew install postgresql@16
# brew services start postgresql@16
```

### Option A: Quick Setup (Recommended)

Run the setup script directly:

```bash
# Navigate to dbt project
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt

# Run setup script (creates database, schemas, tables, sample data)
psql -U postgres -f database_setup.sql
```

If PostgreSQL requires a password, you'll be prompted.

### Option B: Step-by-Step Setup

#### 1. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE mobu_dev;
\q
```

#### 2. Run Setup Script
```bash
psql -U postgres -d mobu_dev -f database_setup.sql
```

#### 3. Verify Setup
```sql
-- Connect to database
psql -U postgres -d mobu_dev

-- Check schemas
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('raw_data', 'staging', 'intermediate', 'marts', 'analytics')
ORDER BY schema_name;

-- Check tables
\dt raw_data.*

-- Check sample data
SELECT COUNT(*) FROM raw_data.price_data_raw;
SELECT COUNT(*) FROM raw_data.recommendations;

-- Exit psql
\q
```

### Option C: Use Docker PostgreSQL

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name mobu-postgres \
  -e POSTGRES_PASSWORD=mobu_dev_2024 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=mobu_dev \
  -p 5432:5432 \
  -d postgres:16

# Wait for startup (5 seconds)
sleep 5

# Run setup script
docker exec -i mobu-postgres psql -U postgres -d mobu_dev < database_setup.sql

# Verify
docker exec -it mobu-postgres psql -U postgres -d mobu_dev -c "SELECT COUNT(*) FROM raw_data.price_data_raw;"
```

## Step 2: Configure Environment Variables

Create/update `.env.local` in the MVP project:

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp

# Add to .env.local:
cat >> .env.local << EOF

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mobu_dev
DB_USER=mobu_user
DB_PASSWORD=mobu_dev_2024
MOBU_DB_PASSWORD=mobu_dev_2024
EOF
```

## Step 3: Test dbt Connection

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt

# Add dbt to PATH
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"

# Set password
export MOBU_DB_PASSWORD="mobu_dev_2024"

# Test connection
dbt debug

# Expected output:
# All checks passed!
```

## Step 4: Run dbt Models

```bash
# Build all models (staging → intermediate → marts)
dbt run

# Expected output:
# Completed successfully
# 15 models built
```

## Step 5: Verify Marts Data

```bash
# Query the quality dashboard mart
psql -U postgres -d mobu_dev -c "SELECT * FROM analytics.mart_quality_dashboard;"

# Or use the MVP API (if server is running):
curl http://localhost:3000/api/quality-metrics
```

## Step 6: Restart MVP Server

The server should automatically pick up the database connection:

```bash
# Server is already running at http://localhost:3000
# Check logs for database connection confirmation
```

## Troubleshooting

### Issue: "FATAL: database 'mobu_dev' does not exist"
```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE mobu_dev;"
```

### Issue: "FATAL: role 'mobu_user' does not exist"
```bash
# Create user manually
psql -U postgres -d mobu_dev -c "CREATE USER mobu_user WITH PASSWORD 'mobu_dev_2024';"
```

### Issue: "connection refused"
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if needed
brew services start postgresql@16

# Or check Docker
docker ps | grep mobu-postgres
```

### Issue: dbt debug fails
```bash
# Check profiles.yml
cat mobu_dbt/profiles.yml

# Ensure password env var is set
echo $MOBU_DB_PASSWORD

# Test raw connection
psql -h localhost -U mobu_user -d mobu_dev
```

## Database Schema Overview

After setup, you'll have:

### Schemas (7 total)
- `raw_data` - Raw feed data (Data Feed Agent writes here)
- `staging` - Validated data (dbt staging models)
- `intermediate` - Calculated metrics (dbt intermediate models)
- `marts` - Analytics-ready tables (dbt marts models)
- `analytics` - Final dashboard queries (dbt target)
- `seed_data` - Static reference data
- `snapshots` - Historical snapshots

### Tables in raw_data (9 total)
1. `price_data_raw` - Price feeds (Bloomberg, Refinitiv, exchanges)
2. `onchain_data_raw` - Blockchain data
3. `news_data_raw` - News + sentiment
4. `macro_data_raw` - Economic indicators
5. `recommendations` - Recommendation history
6. `system_health` - Uptime monitoring
7. `portfolio_valuations` - Portfolio snapshots
8. `model_versions` - ML model tracking
9. `model_feedback` - Learning feedback

### Sample Data Included
- 4 price records (AAPL, MSFT, BTC)
- 2 on-chain events
- 2 news articles
- 3 macro indicators
- 3 recommendations
- 4 health checks
- 3 portfolio valuations
- 2 model versions
- 2 feedback events

## Next Steps After Setup

1. **Test dbt models**: `dbt run`
2. **View documentation**: `dbt docs generate && dbt docs serve`
3. **Test MVP integration**: Visit http://localhost:3000/dashboard
4. **Connect Data Feed Agent**: Point agent to `raw_data` schema
5. **Schedule dbt runs**: Set up hourly cron job or Azure Data Factory pipeline

## Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `mobu_dev` created
- [ ] Setup script executed successfully
- [ ] Sample data visible in raw tables
- [ ] Environment variables configured
- [ ] dbt debug shows "All checks passed!"
- [ ] dbt run completes successfully
- [ ] MVP server running without errors
- [ ] Can query `analytics.mart_quality_dashboard`

## Support

- **Database Issues**: See `database_setup.sql` comments
- **dbt Issues**: See `README.md` and `DBT_INTEGRATION.md`
- **MVP Integration**: See `lib/db.ts` for connection logic

---

**Ready?** Run `psql -U postgres -f database_setup.sql` to begin! 🚀
