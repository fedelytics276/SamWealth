# MOBU API Keys Setup Guide

Quick guide to get your free API keys and test the integrations.

---

## ✅ Already Configured

### 1. Mansa API (African Markets)
- **Status**: ✅ Already set in `.env.local`
- **Account**: info@fedeanalytics.com
- **Key**: `mansa_live_sk_tzcyx748xxcujppk`
- **Coverage**: NGX, JSE, NSE, EGX, GSE, BRVM, CSE, ZSE

### 2. Quiver Quantitative (Alternative Data)
- **Status**: ✅ Already set in `.env.local`
- **Username**: fede
- **Token**: `f17bdbc50fa03c96cb2cc9776ec4ba6848d3ff95`
- **Data**: Congressional trades, insider trades, 13F filings

---

## 🔧 Need to Configure

### 3. Alpha Vantage (Global Markets) - FREE

**Why needed**: For NYSE, NASDAQ, and global stocks not covered by Mansa

**Steps**:
1. Visit: https://www.alphavantage.co/support/#api-key
2. Enter your email (no credit card required)
3. Receive instant API key
4. Copy key and update `.env.local`:
   ```bash
   ALPHA_VANTAGE_API_KEY=your_key_here
   ```

**Free Tier**: 25 requests/day (enough for testing)  
**Pro Tip**: Request unlimited access for open-source projects

---

## 🧪 Test Your Setup

### Step 1: Install Dependencies
```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm install dotenv axios
```

### Step 2: Run Test Script
```bash
node test-price-service.js
```

### Expected Output (Success)
```
🧪 Testing MOBU Price Service Integration
======================================================================
📋 Environment Check:
----------------------------------------------------------------------
Mansa API Key: ✅ SET (mansa_li...)
Alpha Vantage API Key: ✅ SET (ABC1234...)

🚀 Starting API Tests...

📊 Test: Dangote Cement
----------------------------------------------------------------------
Symbol: DANGCEM | Exchange: NGX | API: Mansa
✅ Success! Price: $285.50
...

======================================================================
📊 Test Results Summary
======================================================================
✅ Passed: 5/5
🎉 All tests passed! Both APIs are working correctly.
```

---

## 🔍 Troubleshooting

### Issue: Mansa API returns ENOTFOUND
**Cause**: API endpoint might be incorrect or service down  
**Solutions**:
1. Check Mansa API documentation for correct endpoint
2. Contact Mansa support: support@mansaapi.com
3. Verify account is active at info@fedeanalytics.com
4. Alternative: Use Yahoo Finance for African stocks temporarily

### Issue: Alpha Vantage returns "Invalid API call"
**Cause**: Invalid or expired API key  
**Solutions**:
1. Regenerate API key from dashboard
2. Check for typos in `.env.local`
3. Ensure key has no extra spaces

### Issue: Alpha Vantage rate limit (25 calls/day)
**Cause**: Free tier limit reached  
**Solutions**:
1. Wait 24 hours for reset
2. Implement caching (already built-in)
3. Request unlimited access for open-source
4. Upgrade to premium ($49/month for 75 calls/min)

---

## 📊 API Coverage Matrix

| Market | Exchange | Mansa API | Alpha Vantage | Yahoo Finance |
|--------|----------|-----------|---------------|---------------|
| **African** |
| Nigeria | NGX | ✅ Primary | ❌ | ✅ Backup |
| South Africa | JSE | ✅ Primary | ❌ | ✅ Backup |
| Kenya | NSE | ✅ Primary | ❌ | ✅ Backup |
| Egypt | EGX | ✅ Primary | ❌ | ✅ Backup |
| Ghana | GSE | ✅ Primary | ❌ | ⚠️ Limited |
| **Global** |
| US | NYSE | ❌ | ✅ Primary | ✅ Backup |
| US | NASDAQ | ❌ | ✅ Primary | ✅ Backup |
| UK | LSE | ❌ | ✅ Primary | ✅ Backup |
| Canada | TSX | ❌ | ✅ Primary | ✅ Backup |

---

## 💰 Cost Analysis

### Current Setup (MVP/Testing)
- **Mansa API**: Already paid ✅
- **Alpha Vantage**: FREE (25 calls/day)
- **Quiver API**: Already paid ✅
- **Total**: $0/month additional cost

### Production (When Scaling)
- **Mansa API**: Current plan
- **Alpha Vantage**: $49/month (75 calls/min)
- **Quiver API**: Current plan
- **Total**: ~$49/month additional

### Optimization Strategy
To stay within free/low-cost limits:
1. **Cache aggressively**: 15-second TTL reduces calls by 90%
2. **Batch requests**: Fetch multiple symbols at once
3. **Smart refresh**: Only when market open
4. **Database fallback**: Use last known prices

---

## ✅ Verification Checklist

Before proceeding:

- [ ] Mansa API key in `.env.local`
- [ ] Alpha Vantage API key obtained and added
- [ ] Quiver API token in `.env.local`
- [ ] Database password set
- [ ] Test script runs successfully
- [ ] At least 3/5 tests pass

---

## 🚀 Next Steps (After Tests Pass)

1. **Run database setup**:
   ```bash
   psql -d mobu_dev -f mobu_dbt/database_setup_holdings.sql
   ```

2. **Create materialized views**:
   ```bash
   psql -d mobu_dev -f mobu_dbt/database_setup_views.sql
   ```

3. **Start development server**:
   ```bash
   cd mobu-mvp
   npm run dev
   ```

4. **Open dashboard**:
   http://localhost:3000/dashboard

---

## 📞 Support

**API Issues**:
- Mansa: support@mansaapi.com
- Alpha Vantage: support@alphavantage.co
- Quiver: support@quiverquant.com

**MOBU Issues**:
- Create issue in GitHub repo
- Email: contact@mobu.app

---

**Last Updated**: 2026-09-12  
**Status**: Ready for Testing
