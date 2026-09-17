# dbt Quick Reference Card

## Setup (One-Time)
```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
./setup.sh
```

## Environment Setup (Each Terminal Session)
```bash
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
export MOBU_DB_PASSWORD="mobu_dev_2024"
```

## Common Commands
```bash
# Connection
dbt debug                       # Test database connection

# Build
dbt run                         # Build all models
dbt run --select stg_price_feeds  # Build specific model
dbt run --select tag:staging    # Build by tag

# Test
dbt test                        # Run all tests
dbt test --select stg_price_feeds  # Test specific model

# Documentation
dbt docs generate               # Generate documentation
dbt docs serve                  # View in browser (localhost:8080)

# Utility
dbt list                        # List all models
dbt compile                     # Compile SQL without running
dbt clean                       # Clean generated files
```

## Database Commands
```bash
# Connect
psql -d mobu_dev

# Common queries
SELECT * FROM raw_data.price_data_raw LIMIT 5;
SELECT * FROM marts.mart_quality_dashboard;
SELECT COUNT(*) FROM staging.stg_price_feeds;
```

## File Locations
- **dbt Project**: `/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt`
- **dbt Binary**: `/Users/fedeanalytics/Library/Python/3.13/bin/dbt`
- **Models**: `mobu_dbt/models/`
- **Logs**: `mobu_dbt/target/run.log`

## Documentation
- **Quick Start**: `DBT_QUICK_START.md`
- **Setup Guide**: `SETUP_INSTRUCTIONS.md`
- **Full Guide**: `DBT_INTEGRATION.md`
- **Summary**: `DBT_COMPLETE.md`

## Troubleshooting
```bash
# dbt command not found
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"

# Connection failed
pg_isready  # Check PostgreSQL is running
dbt debug   # See detailed error

# Check logs
cat mobu_dbt/target/run.log
```

## Next Steps
1. Run `./setup.sh` to set up database
2. Run `dbt docs serve` to view lineage
3. Connect Data Feed Agent to `raw_data` schema
4. Integrate MVP dashboard with `marts` tables
