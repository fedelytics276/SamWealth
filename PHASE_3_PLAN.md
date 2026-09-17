# Phase 3: MVP Integration with dbt + PostgreSQL

## Status: Ready to Execute 🚀

**Prerequisites Complete**:
- ✅ dbt installed (v1.8.0)
- ✅ PostgreSQL operational (14.18)
- ✅ Database schemas created
- ✅ Sample data loaded
- ✅ 10 dbt models building successfully
- ✅ Quality dashboard operational (99.96% accuracy, 99.92% uptime)

---

## Phase 3 Goals

1. **Connect MVP Dashboard to PostgreSQL** (Replace JSON files with live database)
2. **Add Real-time Data Updates** (Quality metrics from dbt marts)
3. **Validate End-to-End Flow** (User sees live data in browser)

**Estimated Time**: 30-45 minutes

---

## Step-by-Step Implementation

### Step 1: Install PostgreSQL Client in MVP (5 min)

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm install pg
npm install --save-dev @types/pg
```

### Step 2: Create Database Connection Utility (5 min)

**File**: `mobu-mvp/lib/db.ts`

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mobu_dev',
  user: 'fedeanalytics',
  // No password needed for local development
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

### Step 3: Update Quality Metrics API (10 min)

**File**: `mobu-mvp/pages/api/quality-metrics.ts` (NEW)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        criterion_1_name,
        criterion_1_value,
        criterion_1_unit,
        criterion_1_threshold,
        criterion_1_compliant,
        criterion_1_30d_avg,
        
        criterion_2_name,
        criterion_2_value,
        criterion_2_unit,
        criterion_2_threshold,
        criterion_2_compliant,
        criterion_2_30d_avg,
        
        criterion_3_name,
        criterion_3_value,
        criterion_3_unit,
        criterion_3_threshold,
        criterion_3_compliant,
        criterion_3_90d_avg,
        
        criterion_4_name,
        criterion_4_value,
        criterion_4_unit,
        criterion_4_threshold,
        criterion_4_compliant,
        models_improving_count,
        
        overall_compliant,
        dashboard_updated_at
      FROM marts.mart_quality_dashboard
      ORDER BY dashboard_updated_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No quality metrics available',
        message: 'Run dbt models to generate metrics' 
      });
    }

    const data = result.rows[0];

    // Format for dashboard consumption
    const metrics = {
      accuracy: {
        name: data.criterion_1_name,
        value: data.criterion_1_value,
        unit: data.criterion_1_unit,
        threshold: data.criterion_1_threshold,
        compliant: data.criterion_1_compliant,
        trend_30d: data.criterion_1_30d_avg,
      },
      reliability: {
        name: data.criterion_2_name,
        value: data.criterion_2_value,
        unit: data.criterion_2_unit,
        threshold: data.criterion_2_threshold,
        compliant: data.criterion_2_compliant,
        trend_30d: data.criterion_2_30d_avg,
      },
      sharpe: {
        name: data.criterion_3_name,
        value: data.criterion_3_value,
        unit: data.criterion_3_unit,
        threshold: data.criterion_3_threshold,
        compliant: data.criterion_3_compliant,
        trend_90d: data.criterion_3_90d_avg,
      },
      learning: {
        name: data.criterion_4_name,
        value: data.criterion_4_value,
        unit: data.criterion_4_unit,
        threshold: data.criterion_4_threshold,
        compliant: data.criterion_4_compliant,
        models_improving: data.models_improving_count,
      },
      overall_compliant: data.overall_compliant,
      updated_at: data.dashboard_updated_at,
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quality metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

### Step 4: Update Dashboard Component (10 min)

**File**: `mobu-mvp/pages/dashboard.tsx`

Add API call to fetch quality metrics:

```typescript
// Add to imports
import { useEffect, useState } from 'react';

// Add state for quality metrics
const [qualityMetrics, setQualityMetrics] = useState<any>(null);
const [metricsLoading, setMetricsLoading] = useState(true);

// Add useEffect to fetch data
useEffect(() => {
  async function fetchMetrics() {
    try {
      const response = await fetch('/api/quality-metrics');
      if (response.ok) {
        const data = await response.json();
        setQualityMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch quality metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  }
  
  fetchMetrics();
  // Refresh every 60 seconds
  const interval = setInterval(fetchMetrics, 60000);
  return () => clearInterval(interval);
}, []);

// Update quality badges section to use live data
{qualityMetrics && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <QualityBadge
      label={qualityMetrics.accuracy.name}
      value={`${qualityMetrics.accuracy.value}${qualityMetrics.accuracy.unit}`}
      threshold={`≥${qualityMetrics.accuracy.threshold}%`}
      status={qualityMetrics.accuracy.compliant ? 'compliant' : 'warning'}
    />
    <QualityBadge
      label={qualityMetrics.reliability.name}
      value={`${qualityMetrics.reliability.value}${qualityMetrics.reliability.unit}`}
      threshold={`≥${qualityMetrics.reliability.threshold}%`}
      status={qualityMetrics.reliability.compliant ? 'compliant' : 'warning'}
    />
    <QualityBadge
      label={qualityMetrics.sharpe.name}
      value={qualityMetrics.sharpe.value}
      threshold={`≥${qualityMetrics.sharpe.threshold}`}
      status={qualityMetrics.sharpe.compliant ? 'compliant' : 'warning'}
    />
    <QualityBadge
      label={qualityMetrics.learning.name}
      value={`${qualityMetrics.learning.value}${qualityMetrics.learning.unit}`}
      threshold={`≥${qualityMetrics.learning.threshold}%`}
      status={qualityMetrics.learning.compliant ? 'compliant' : 'warning'}
    />
  </div>
)}
```

### Step 5: Test the Integration (10 min)

```bash
# 1. Ensure PostgreSQL is running
pg_isready

# 2. Verify dbt data is current
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
dbt run

# 3. Start MVP server
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000/dashboard
# Verify quality badges show live data from PostgreSQL
```

### Step 6: Verify Data Flow (5 min)

**Test queries to verify**:

```sql
-- 1. Check raw data exists
psql -d mobu_dev -c "SELECT COUNT(*) FROM raw_data.price_data_raw;"

-- 2. Check staging views work
psql -d mobu_dev -c "SELECT COUNT(*) FROM staging.stg_price_feeds;"

-- 3. Check marts table has data
psql -d mobu_dev -c "SELECT criterion_1_value, criterion_2_value, overall_compliant FROM marts.mart_quality_dashboard;"

-- 4. Test API endpoint
curl http://localhost:3000/api/quality-metrics | jq
```

---

## Expected Results

### Before Phase 3
```
Dashboard → JSON files (static data)
No database connection
Manual updates required
```

### After Phase 3
```
Dashboard → PostgreSQL → dbt marts (live data)
Real-time quality metrics
Automatic updates from dbt runs
```

---

## Verification Checklist

- [ ] `npm install pg` completes successfully
- [ ] `lib/db.ts` created with connection pool
- [ ] `pages/api/quality-metrics.ts` created
- [ ] Dashboard component updated with `useEffect`
- [ ] MVP server starts without errors
- [ ] Browser shows dashboard at http://localhost:3000/dashboard
- [ ] Quality badges display live PostgreSQL data
- [ ] API endpoint returns JSON: `curl http://localhost:3000/api/quality-metrics`
- [ ] Metrics update when dbt runs: `dbt run && refresh browser`

---

## Troubleshooting

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
pg_isready

# Test connection manually
psql -d mobu_dev -c "SELECT 1;"

# Check if database exists
psql -l | grep mobu_dev
```

### Issue: "No quality metrics available"
```bash
# Run dbt to populate marts table
cd mobu_dbt
dbt run

# Verify data exists
psql -d mobu_dev -c "SELECT * FROM marts.mart_quality_dashboard;"
```

### Issue: "Module 'pg' not found"
```bash
# Reinstall
cd mobu-mvp
npm install pg @types/pg
rm -rf node_modules/.cache
npm run dev
```

---

## Phase 4 Preview: Production Deployment

After Phase 3 completes:

1. **Deploy to Azure**
   - Azure Database for PostgreSQL
   - Azure Container Instances (Next.js MVP)
   - Azure Data Factory (dbt scheduling)

2. **Data Feed Agent**
   - Python script to fetch Bloomberg/Refinitiv data
   - Write to raw_data tables
   - Trigger dbt runs

3. **Monitoring**
   - Azure Monitor for dbt runs
   - Alert if quality thresholds not met
   - Dashboard for data freshness

---

## Summary

**Phase 3 connects the dots**:
- dbt transforms data ✅
- PostgreSQL stores results ✅  
- MVP displays live metrics ⏳ **← YOU ARE HERE**

**Time**: 30-45 minutes  
**Complexity**: Low (mostly configuration)  
**Outcome**: Full end-to-end data flow operational

---

Ready to proceed? Let me know and I'll implement Phase 3 step-by-step!
