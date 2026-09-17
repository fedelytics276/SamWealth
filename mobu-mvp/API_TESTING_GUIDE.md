# MOBU API Integration Testing Guide

This guide helps you test Mansa API (African markets) and Quiver Quantitative API (alternative data) before full integration.

---

## Prerequisites

1. **Node.js** installed (v16+ recommended)
2. **API Keys** from both providers

---

## Step 1: Get API Keys

### Mansa API (African Stock Markets)
1. Visit: https://mansaapi.com/
2. Sign up for an account
3. Get your API key from dashboard
4. **Pricing**: Free tier available, paid plans for higher rate limits

### Quiver Quantitative (Alternative Data)
1. Visit: https://www.quiverquant.com/api
2. Sign up for API access
3. Get your API token
4. **Pricing**: $30/month

---

## Step 2: Set Environment Variables

```bash
# Set your API keys
export MANSA_API_KEY="your_mansa_api_key_here"
export QUIVER_API_KEY="your_quiver_api_key_here"

# Verify they're set
echo $MANSA_API_KEY
echo $QUIVER_API_KEY
```

**Alternative**: Add to `.env.local` file:
```bash
MANSA_API_KEY=your_mansa_api_key_here
QUIVER_API_KEY=your_quiver_api_key_here
```

---

## Step 3: Install Dependencies

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp

# Install axios (if not already installed)
npm install axios
```

---

## Step 4: Test Mansa API

```bash
node test-mansa-api.js
```

### Expected Output (Success)
```
🧪 Testing Mansa API Integration

============================================================
🚀 Starting Mansa API Tests...

📊 Test 1: Fetch Single Ticker Price
------------------------------------------------------------
Fetching: DANGCEM (NGX) - Dangote Cement - Nigeria
✅ Success!
Response: {
  "ticker": "DANGCEM",
  "name": "Dangote Cement",
  "price": 285.50,
  "change": 2.3,
  "change_pct": 0.81,
  "volume": 1250000,
  "timestamp": "2026-09-12T10:30:00Z",
  "market_status": "open"
}

🕐 Test 2: Check Market Status
------------------------------------------------------------
Fetching market status for: NGX
✅ Success!
Market Status: open
...

============================================================
📊 Test Results Summary
============================================================
✅ Passed: 5/5
❌ Failed: 0/5
  ✅ singleTicker
  ✅ marketStatus
  ✅ batchPrices
  ✅ historicalData
  ✅ availableExchanges

🎉 All tests passed! Mansa API integration is ready.
```

### Tests Performed
1. **Single Ticker Price**: Fetch DANGCEM (NGX) price
2. **Market Status**: Check if NGX is open/closed
3. **Batch Prices**: Fetch multiple tickers at once
4. **Historical Data**: Get 1-month price history
5. **Available Exchanges**: List all supported exchanges

---

## Step 5: Test Quiver API

```bash
node test-quiver-api.js
```

### Expected Output (Success)
```
🧪 Testing Quiver Quantitative API Integration

============================================================
🚀 Starting Quiver Quantitative API Tests...

🏛️  Test 1: Congressional Trading Data
------------------------------------------------------------
Fetching congressional trades for: AAPL
✅ Success!
Found 47 congressional trades

Sample trades (most recent 3):
  - 2026-08-15: Nancy Pelosi - Purchase ($1,000,001 - $5,000,000)
  - 2026-08-10: Josh Gottheimer - Sale ($15,001 - $50,000)
  - 2026-07-28: Mark Green - Purchase ($1,001 - $15,000)

👔 Test 2: Insider Trading Data
------------------------------------------------------------
...

============================================================
📊 Test Results Summary
============================================================
✅ Passed: 6/6
❌ Failed: 0/6
  ✅ congressionalTrading
  ✅ insiderTrading
  ✅ filings13F
  ✅ lobbying
  ✅ governmentContracts
  ✅ twitterSentiment

🎉 All tests passed! Quiver API integration is ready.
```

### Tests Performed
1. **Congressional Trading**: Politician stock trades (STOCK Act filings)
2. **Insider Trading**: Form 4 insider transactions
3. **13F Filings**: Hedge fund quarterly holdings
4. **Lobbying**: Corporate lobbying spending
5. **Government Contracts**: Federal contract awards
6. **Twitter Sentiment**: Social media sentiment analysis

---

## Troubleshooting

### Error: "Could not reach API (DNS resolution failed)"
**Cause**: API endpoint incorrect or service down  
**Solution**: 
- Check API base URL in test script
- Verify internet connection
- Try pinging the API endpoint

### Error: Status 401 (Unauthorized)
**Cause**: Invalid or missing API key  
**Solution**:
- Verify API key is set: `echo $MANSA_API_KEY`
- Check for typos in the key
- Regenerate key from provider dashboard

### Error: Status 429 (Too Many Requests)
**Cause**: Rate limit exceeded  
**Solution**:
- Wait 1 minute and try again
- Upgrade to higher tier plan
- Implement rate limiting in production

### Error: Status 404 (Not Found)
**Cause**: Symbol not found or invalid exchange  
**Solution**:
- Verify ticker symbol is correct (e.g., "DANGCEM" not "DNGCEM")
- Check exchange code (NGX, JSE, NSE)
- Try a different symbol from the supported list

---

## Supported Exchanges (Mansa API)

| Code | Exchange | Location | Example Ticker |
|------|----------|----------|----------------|
| **NGX** | Nigerian Exchange | Nigeria | DANGCEM, MTN |
| **JSE** | Johannesburg Stock Exchange | South Africa | AGL, SHOPRITE |
| **NSE** | Nairobi Securities Exchange | Kenya | SAFARICOM, EQUITY |
| **EGX** | Egyptian Exchange | Egypt | CIB, ETEL |
| **GSE** | Ghana Stock Exchange | Ghana | MTN, TOTAL |
| **BRVM** | Bourse Régionale | West Africa | SONATEL |
| **CSE** | Casablanca Stock Exchange | Morocco | IAM, ATTIJARIWAFA |
| **ZSE** | Zimbabwe Stock Exchange | Zimbabwe | DELTA, OK |

---

## Supported Data Types (Quiver API)

### 1. Congressional Trading
- **Description**: US Senators and Representatives stock trades
- **Source**: STOCK Act filings
- **Update Frequency**: Real-time (within 24-48 hours of filing)
- **Use Case**: Follow politician investment signals

### 2. Insider Trading
- **Description**: Corporate insider transactions (Form 4)
- **Source**: SEC Form 4 filings
- **Update Frequency**: Same-day
- **Use Case**: Track insider buying/selling activity

### 3. 13F Filings
- **Description**: Hedge fund quarterly holdings
- **Source**: SEC 13F filings
- **Update Frequency**: Quarterly (45 days after quarter-end)
- **Use Case**: Follow institutional investor moves

### 4. Lobbying
- **Description**: Corporate lobbying spending
- **Source**: Senate lobbying disclosure database
- **Update Frequency**: Quarterly
- **Use Case**: Gauge government relations activity

### 5. Government Contracts
- **Description**: Federal contract awards
- **Source**: USA Spending database
- **Update Frequency**: Weekly
- **Use Case**: Track revenue from government work

### 6. Twitter Sentiment
- **Description**: Social media sentiment scores
- **Source**: Twitter mentions analysis
- **Update Frequency**: Daily
- **Use Case**: Gauge retail investor sentiment

---

## Next Steps After Testing

### If All Tests Pass ✅
1. **Database Integration**
   - Run `database_setup_holdings.sql` to create tables
   - Set up Mansa price cache table
   - Set up Quiver data cache table

2. **Build API Libraries**
   - Create `lib/mansa-api.ts` with TypeScript types
   - Create `lib/quiver-api.ts` with TypeScript types
   - Add error handling and retries

3. **Create Data Feed Agent**
   - Schedule Mansa price updates (every 15 seconds when market open)
   - Schedule Quiver data updates (hourly)
   - Store in raw_data tables

4. **Build dbt Models**
   - `stg_african_price_feeds.sql`
   - `stg_alternative_data.sql`
   - Validate and deduplicate data

5. **Update Dashboard**
   - Replace JSON files with API calls
   - Add live price updates
   - Show alternative data in evidence trail

### If Tests Fail ❌
1. **Check API Keys**
   - Verify keys are correct
   - Check if subscription is active
   - Regenerate keys if needed

2. **Review Rate Limits**
   - Check plan limits on provider dashboard
   - Implement caching to reduce API calls
   - Consider upgrading plan

3. **Contact Support**
   - Mansa: support@mansaapi.com
   - Quiver: support@quiverquant.com

---

## Cost Estimates

### Development/Testing
- **Mansa Free Tier**: 1,000 requests/month (sufficient for testing)
- **Quiver Trial**: Ask for trial access before committing

### Production
- **Mansa Standard**: ~$49/month (10,000 requests/month)
- **Quiver API**: $30/month (unlimited requests)
- **Total**: ~$79/month

### Usage Estimates
- **Price Updates**: 100 symbols × 240 updates/day (15-sec when market open) = 24,000 req/day
- **Alternative Data**: 50 symbols × 6 data types × 1/hour = 7,200 req/day
- **Total**: ~31,200 requests/day (~940,000/month)

**Recommendation**: Implement aggressive caching to stay within limits:
- Cache prices for 15 seconds (market open) / 1 hour (market closed)
- Cache alternative data for 1 hour
- Use batch endpoints when available

---

## Questions?

- **Technical Issues**: Check logs in test output
- **API Documentation**: 
  - Mansa: https://mansaapi.com/docs
  - Quiver: https://api.quiverquant.com/docs
- **MOBU Team**: Create issue in project repo

---

**Last Updated**: 2026-09-12  
**Status**: Ready for testing
