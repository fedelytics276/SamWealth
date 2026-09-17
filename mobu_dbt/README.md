# MOBU dbt Integration

## Overview
This dbt project provides **data lineage, transformation, and quality validation** for the MOBU investment platform. It implements the 4 AI Quality Criteria with full data lineage tracking from raw feeds to analytics marts.

## Architecture

### Data Flow (Lineage)
```
Raw Feeds → Staging → Intermediate → Marts → Dashboard/APIs
    ↓          ↓           ↓            ↓
 External   Validate   Transform    Aggregate
 Sources    & Dedupe   & Calculate  & Serve
```

### Layer Structure

#### 1. **Staging Layer** (`models/staging/`)
- **Purpose**: Validate and standardize raw data from external sources
- **Materialization**: Views (lightweight, always fresh)
- **Models**:
  - `stg_price_feeds.sql` - Price data (Bloomberg, Refinitiv, exchanges)
  - `stg_onchain_feeds.sql` - Blockchain data (wallet flows, DeFi events)
  - `stg_news_feeds.sql` - News articles with sentiment analysis
  - `stg_macro_feeds.sql` - Macroeconomic indicators (FRED, BLS, ECB)

#### 2. **Intermediate Layer** (`models/intermediate/`)
- **Purpose**: Business logic and metric calculations
- **Materialization**: Ephemeral (not persisted, recomputed on-demand)
- **Models**:
  - `int_accuracy_metrics.sql` - **Criterion 1**: Accuracy ≥ 99.95%
  - `int_reliability_metrics.sql` - **Criterion 2**: Uptime ≥ 99.9%
  - `int_sharpe_ratio.sql` - **Criterion 3**: Sharpe Ratio ≥ 1.5
  - `int_learning_metrics.sql` - **Criterion 4**: Self-improving AI

#### 3. **Marts Layer** (`models/marts/`)
- **Purpose**: Final analytics tables for consumption
- **Materialization**: Tables (persisted, optimized for queries)
- **Models**:
  - `mart_quality_dashboard.sql` - Quality metrics for MVP dashboard
  - `mart_portfolio_performance.sql` - Portfolio analytics
  - `mart_recommendations.sql` - Recommendation outcomes

## 4 AI Quality Criteria Implementation

### Criterion 1: Accuracy (≥99.95%)
- **Metric**: `(Correct predictions / Total predictions) * 100`
- **Model**: `int_accuracy_metrics.sql`
- **Tracking**: Daily, 7-day rolling, 30-day rolling
- **Data**: Compares predicted vs actual recommendation outcomes

### Criterion 2: Reliability (≥99.9%)
- **Metric**: `(Uptime / Total time) * 100`
- **Model**: `int_reliability_metrics.sql`
- **Tracking**: Hourly health checks, daily uptime, 30-day rolling
- **Data**: System health checks, service availability

### Criterion 3: Sharpe Ratio (≥1.5)
- **Metric**: `(Portfolio Return - Risk Free Rate) / Portfolio Std Dev`
- **Model**: `int_sharpe_ratio.sql`
- **Tracking**: 30-day rolling, 90-day rolling
- **Data**: Portfolio valuations + 3-month Treasury rates

### Criterion 4: Self-Improving (Learning Required)
- **Metric**: Model improvement rate + Feedback incorporation ≥80%
- **Model**: `int_learning_metrics.sql`
- **Tracking**: Model versions, accuracy improvements, feedback loops
- **Data**: Model deployments + user feedback events

## Setup & Configuration

### 1. Install Dependencies
```bash
# Already installed in your environment
python3 -m pip install dbt-core==1.8.0 dbt-postgres==1.8.0 --user
```

### 2. Configure Database Connection
Edit `profiles.yml`:
```yaml
mobu_dbt:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: mobu_user
      password: "{{ env_var('MOBU_DB_PASSWORD', 'mobu_dev_2024') }}"
      dbname: mobu_dev
      schema: analytics
```

### 3. Set Environment Variables
```bash
export MOBU_DB_PASSWORD="your_password_here"
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
```

### 4. Test Connection
```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
dbt debug
```

## Running dbt

### Build All Models
```bash
dbt run
```

### Run Specific Model
```bash
dbt run --select stg_price_feeds
dbt run --select mart_quality_dashboard
```

### Run by Tag
```bash
dbt run --select tag:staging
dbt run --select tag:quality
dbt run --select tag:compliance
```

### Test Data Quality
```bash
dbt test
```

### Generate Documentation
```bash
dbt docs generate
dbt docs serve
```

## Data Lineage Features

### 1. **Source Tracking**
Every model tracks its data sources:
- Feed provider (Bloomberg, Refinitiv, etc.)
- Ingestion timestamp
- Data quality scores

### 2. **Transformation Lineage**
dbt automatically creates lineage graphs:
```
Raw Feed → Staging → Intermediate → Marts
```

View with: `dbt docs generate && dbt docs serve`

### 3. **Quality Metadata**
Each row includes:
- `feed_type` - Origin data feed
- `processed_at` - When validated/transformed
- `data_quality_score` - Source quality rating

### 4. **Audit Trail**
Marts include:
- `dbt_run_timestamp` - When model was built
- `dbt_invocation_id` - Unique run identifier
- `lineage_tool` - Always "dbt"

## Integration with MOBU

### MVP Dashboard Connection
The MVP currently uses JSON files. To integrate dbt:

```typescript
// pages/api/quality-metrics.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  user: 'mobu_user',
  password: process.env.MOBU_DB_PASSWORD,
  database: 'mobu_dev',
  port: 5432,
});

export default async function handler(req, res) {
  const result = await pool.query(
    'SELECT * FROM analytics.mart_quality_dashboard LIMIT 1'
  );
  res.status(200).json(result.rows[0]);
}
```

### Data Feed Agent Integration
The Data Feed Agent should write to `raw_data` schema:
- `raw_data.price_data_raw`
- `raw_data.onchain_data_raw`
- `raw_data.news_data_raw`
- `raw_data.macro_data_raw`

dbt will automatically validate and transform.

### Schedule
Run dbt on a schedule:
```bash
# Cron: Every hour
0 * * * * cd /path/to/mobu_dbt && dbt run --select tag:staging tag:marts

# Azure Data Factory: Trigger dbt CLI
# AWS Lambda: Invoke dbt via Python
```

## Quality Thresholds

Configured in `dbt_project.yml`:
```yaml
vars:
  accuracy_threshold: 0.9995    # 99.95%
  reliability_threshold: 0.999  # 99.9%
  sharpe_threshold: 1.5         # Sharpe Ratio
```

Aligned with `strategy.yaml` hot-reload config.

## Testing Strategy

### Source Tests
- `unique` - No duplicate IDs
- `not_null` - Required fields present
- `accepted_values` - Enum validation

### Model Tests
- `dbt_utils.accepted_range` - Numeric bounds
- Custom tests in `tests/` directory

### Run Tests
```bash
dbt test                           # All tests
dbt test --select stg_price_feeds # Specific model
dbt test --select tag:quality     # By tag
```

## Documentation

### Generate Docs
```bash
dbt docs generate
dbt docs serve  # Opens in browser at http://localhost:8080
```

### Lineage Graph
The docs site includes an interactive lineage graph showing:
- Data flow from sources to marts
- Column-level lineage
- Model dependencies
- Test coverage

## Next Steps

### Phase 1: Database Setup (Current)
- [ ] Create PostgreSQL database `mobu_dev`
- [ ] Create schemas: `raw_data`, `staging`, `intermediate`, `marts`, `analytics`
- [ ] Create source tables (price, onchain, news, macro)
- [ ] Test dbt connection

### Phase 2: Seed Data (Testing)
- [ ] Add sample data to `seeds/` directory
- [ ] Run `dbt seed` to populate
- [ ] Validate models with sample data

### Phase 3: Production Integration
- [ ] Connect Data Feed Agent to `raw_data` schema
- [ ] Schedule dbt runs (hourly/daily)
- [ ] Update MVP to query marts instead of JSON
- [ ] Set up monitoring/alerting

### Phase 4: Advanced Features
- [ ] Add snapshots for SCD Type 2 tracking
- [ ] Create incremental models for large tables
- [ ] Add macros for reusable SQL
- [ ] Set up CI/CD with dbt Cloud or GitHub Actions

## File Structure
```
mobu_dbt/
├── README.md                    # This file
├── dbt_project.yml              # Project configuration
├── profiles.yml                 # Database connections
├── models/
│   ├── staging/
│   │   └── data_feeds/
│   │       ├── stg_price_feeds.sql
│   │       ├── stg_onchain_feeds.sql
│   │       ├── stg_news_feeds.sql
│   │       ├── stg_macro_feeds.sql
│   │       └── schema.yml       # Tests & docs
│   ├── intermediate/
│   │   └── quality/
│   │       ├── int_accuracy_metrics.sql
│   │       ├── int_reliability_metrics.sql
│   │       ├── int_sharpe_ratio.sql
│   │       └── int_learning_metrics.sql
│   └── marts/
│       ├── quality/
│       │   └── mart_quality_dashboard.sql
│       ├── portfolio/
│       └── recommendations/
├── tests/                       # Custom tests
├── macros/                      # Reusable SQL
├── seeds/                       # Static data
├── snapshots/                   # SCD Type 2
└── target/                      # Generated artifacts
```

## Support

- **dbt Docs**: https://docs.getdbt.com/
- **dbt Slack**: https://community.getdbt.com/
- **MOBU Docs**: See `../MOBU_Design/` directory

---

**Version**: 1.0.0  
**dbt Version**: 1.8.0  
**Last Updated**: {{ "now()" }}
