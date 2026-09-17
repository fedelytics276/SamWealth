# MOBU Quick Start Guide

## 🚀 Run the MVP (Right Now!)

```bash
# Terminal 1: Start the frontend
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev

# Open browser: http://localhost:3000
```

✅ **That's it!** You should see the MOBU dashboard with recommendations.

---

## 📊 Run dbt Data Pipeline

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"

# Build all models
dbt run

# Test data quality
dbt test

# Generate documentation
dbt docs generate
dbt docs serve  # Opens http://localhost:8080
```

---

## 🗄️ Check Database

```bash
# Connect to database
psql -d mobu_dev

# View tables
\dt raw_data.*

# View sample data
SELECT * FROM raw_data.price_data_raw LIMIT 5;
SELECT * FROM raw_data.recommendations LIMIT 5;

# View dbt staging models
\dv staging.*

# View marts
SELECT * FROM marts.mart_quality_dashboard;

# Exit
\q
```

---

## 📁 Key Files & Locations

### MVP Frontend
```
/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── dashboard.tsx          # Main dashboard
│   └── evidence/[id].tsx      # Evidence trail
├── components/
│   ├── PortfolioSummary.tsx   # Portfolio card
│   ├── RecommendationCard.tsx # Recommendations
│   └── EvidenceGraph.tsx      # React Flow graph
└── data/
    ├── portfolio.json
    ├── recommendations.json
    └── evidence-trails.json
```

### dbt Data Pipeline
```
/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt/
├── models/
│   ├── staging/               # 11 staging views
│   ├── intermediate/          # 4 quality models (ephemeral)
│   └── marts/                 # 1 dashboard table
├── dbt_project.yml            # Configuration
├── profiles.yml               # Database connection
└── database_setup.sql         # Initial schema & data
```

### Documentation
```
/Users/fedeanalytics/Documents/Sectors_solution/SamWealth/MOBU_Design/
├── 02_System_Architecture.md  # Full architecture
├── 03_Data_Model.md           # Database schema
├── 09_African_Market_Integration.md  # Mansa API, brokers, payments
└── (16 total design docs)
```

---

## 🔑 Environment Variables

Create `.env.local` in mobu-mvp directory:

```bash
# Database
MOBU_DB_PASSWORD=mobu_dev_2024

# APIs (when ready)
MANSA_API_KEY=your_mansa_key_here
QUIVER_API_KEY=your_quiver_key_here

# Payments (when ready)
PAYSTACK_SECRET_KEY=sk_test_xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
```

---

## 📈 What's Working Now

✅ **Frontend MVP**
- Dashboard with recommendations
- Evidence trail visualization
- Portfolio summary
- Quality metrics badges

✅ **Database**
- PostgreSQL configured
- 9 tables with sample data
- dbt models built (12 total)

✅ **Data Pipeline**
- Staging layer (validates data)
- Marts layer (analytics-ready)

---

## 🔄 What's Next

### This Week
1. Connect frontend to PostgreSQL
2. Replace JSON files with API calls
3. Test live data flow

### Next Week
1. Sign up for Mansa API (African markets)
2. Sign up for Quiver API (alternative data)
3. Build Data Feed Agent
4. Enable real-time price updates

---

## 🐛 Troubleshooting

### dbt command not found
```bash
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
# Or use full path:
/Users/fedeanalytics/Library/Python/3.13/bin/dbt run
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check password in profiles.yml
cat mobu_dbt/profiles.yml
```

### npm run dev fails
```bash
cd mobu-mvp
npm install  # Reinstall dependencies
npm run dev
```

### Port 3000 already in use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 📞 Quick Commands Reference

```bash
# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# dbt
dbt run                  # Build models
dbt test                 # Run tests
dbt docs generate        # Generate documentation
dbt docs serve           # View docs (port 8080)
dbt clean                # Clean generated files

# Database
psql -d mobu_dev         # Connect
\dt raw_data.*           # List tables
\dv staging.*            # List views
\q                       # Quit
```

---

## 🎯 Demo Flow (Show Investors)

1. **Start**: Open http://localhost:3000
2. **Dashboard**: Show 4 recommendations with confidence scores
3. **Quality Badges**: Point out 99.96% accuracy, 99.92% uptime
4. **Evidence Trail**: Click "View Evidence" on AAPL recommendation
5. **Graph**: Show data lineage (Price → Sentiment → Macro → AI)
6. **Portfolio**: Show holdings and P&L
7. **dbt Docs**: Open http://localhost:8080 to show data lineage
8. **Architecture**: Walk through `/MOBU_Design/02_System_Architecture.md`

---

## 📚 Documentation Links

- **MVP Status**: `MVP_STATUS.md` (this sprint status)
- **Live Portfolio Spec**: `MOBU_LIVE_PORTFOLIO_SPEC.md` (real-time updates)
- **African Integration**: `MOBU_Design/09_African_Market_Integration.md`
- **dbt Guide**: `DBT_INTEGRATION.md` (40 pages)
- **Quick Start dbt**: `DBT_QUICK_START.md`

---

## ✅ Success Checklist

**Before Demo**:
- [ ] `npm run dev` works (frontend loads)
- [ ] Can navigate to dashboard
- [ ] Can see 4 recommendations
- [ ] Can click "View Evidence" and see graph
- [ ] Quality badges show green checkmarks
- [ ] `dbt run` completes successfully
- [ ] Can connect to database (`psql -d mobu_dev`)

**All green?** → Ready to demo! 🎉

---

**Need Help?** Check:
1. `MVP_STATUS.md` for current state
2. `TROUBLESHOOTING.md` in mobu-mvp folder
3. `README.md` in each directory

**Version**: 1.0  
**Last Updated**: 2026-09-12
