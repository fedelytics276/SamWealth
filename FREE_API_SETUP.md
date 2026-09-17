# MOBU Free API Setup Guide

## Overview

MOBU uses **100% FREE APIs** for testing and development. No paid subscriptions required!

---

## 1. Stock Prices: Alpha Vantage (FREE)

**Website**: https://www.alphavantage.co/  
**Free Tier**: 25 API calls per day  
**Unlimited**: For open-source projects (request access)

### Setup Steps

1. **Get Free API Key**:
   - Visit https://www.alphavantage.co/support/#api-key
   - Enter your email
   - Receive instant API key (no credit card required)

2. **Add to Environment Variables**:
   ```bash
   # mobu-mvp/.env.local
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

3. **Test the API**:
   ```bash
   curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_API_KEY"
   ```

### Usage

```typescript
import { getAlphaVantagePrice } from '@/lib/alpha-vantage-api';

const priceData = await getAlphaVantagePrice('AAPL');
console.log(`AAPL price: $${priceData.price}`);
```

### Rate Limits

- **25 calls/day** on free tier
- Implement caching (5-minute TTL) to reduce calls
- For production: Request unlimited access for open-source projects

---

## 2. Alternative Data: Capitol Trades (FREE)

**Website**: https://www.capitoltrades.com/  
**Cost**: FREE (web scraping, no API key needed)  
**Alternative**: https://undercurrent.finance/ (free raw data)

### Setup Steps

1. **No API Key Required** - Just install dependencies:
   ```bash
   cd mobu-mvp
   npm install cheerio axios
   ```

2. **Test Scraper**:
   ```typescript
   import { getCongressTrades } from '@/lib/capitol-trades-api';
   
   const trades = await getCongressTrades('AAPL');
   console.log(`Found ${trades.length} congressional trades for AAPL`);
   ```

### Alternative Free Sources

#### Option A: LuxAlgo Trackers (FREE)
- **URL**: https://www.luxalgo.com/markets/trackers/
- **Data**: Congress trades, insider trades, filings
- **Format**: Free on website, open data, MCP server available

#### Option B: OSP-API (Open Source)
- **GitHub**: https://github.com/OpenSourcePatents/OSP-API
- **Data**: Congressional stock trades, campaign finance, voting records
- **Self-hosted**: Clone repo, run locally (100% free)

#### Option C: Undercurrent Finance (FREE)
- **URL**: https://undercurrent.finance/
- **Data**: Insider transactions, congressional trades, sentiment
- **Format**: Free raw data from 18 public sources

---

## 3. African Stocks: Yahoo Finance (FREE)

For JSE, NGX, NSE stocks, use Yahoo Finance (no API key required):

### Setup

```bash
npm install yahoo-finance2
```

### Usage

```typescript
import yahooFinance from 'yahoo-finance2';

// JSE stock (Anglo American)
const aglQuote = await yahooFinance.quote('AGL.JO');
console.log(`AGL (JSE): ${aglQuote.regularMarketPrice} ZAR`);

// NGX stock (Dangote Cement) - if available
const dangcemQuote = await yahooFinance.quote('DANGCEM.LG');
```

### Supported Exchanges

| Exchange | Yahoo Suffix | Example |
|----------|--------------|---------|
| JSE (Johannesburg) | `.JO` | `AGL.JO` |
| NSE (Nairobi) | `.NR` | `EQTY.NR` |
| EGX (Egypt) | `.CA` | `CIB.CA` |
| NGX (Nigeria) | `.LG` | Limited coverage |

---

## 4. Complete Free Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     FREE DATA SOURCES                        │
├─────────────────────────────────────────────────────────────┤
│  US Stocks (NYSE, NASDAQ)                                    │
│  ├─ Alpha Vantage (25 calls/day, unlimited for OSS)         │
│  ├─ Yahoo Finance (unlimited, no key)                        │
│  └─ Financial Modeling Prep (250 calls/day free)            │
│                                                              │
│  African Stocks (JSE, NSE, EGX)                              │
│  ├─ Yahoo Finance (free, no key)                             │
│  └─ Manual scraping (exchange websites)                      │
│                                                              │
│  Alternative Data                                            │
│  ├─ Capitol Trades (scraping, free)                          │
│  ├─ SEC EDGAR (official, free)                               │
│  ├─ Undercurrent Finance (free raw data)                     │
│  └─ LuxAlgo Trackers (free)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Recommended Free Tier Strategy

### Development (Current Phase)
- **Alpha Vantage**: 25 calls/day (enough for testing 10-15 stocks)
- **Yahoo Finance**: Unlimited (backup for Alpha Vantage rate limits)
- **Capitol Trades**: Scraping (no limits)

### Production (Future)
- **Alpha Vantage**: Request unlimited OSS access
- **Polygon.io**: Free tier (5 API calls/minute)
- **Self-hosted scrapers**: For African exchanges

---

## 6. Environment Variables (.env.local)

```bash
# Stock Prices
ALPHA_VANTAGE_API_KEY=your_free_key_here

# Database
MOBU_DB_PASSWORD=mobu_dev_2024

# Optional: Financial Modeling Prep (250 calls/day free)
FMP_API_KEY=your_fmp_key_optional

# Optional: Twelve Data (800 calls/day free)
TWELVE_DATA_API_KEY=your_twelve_data_key_optional
```

---

## 7. Caching Strategy (Reduce API Calls)

### Price Cache (Database)

```sql
-- Cached prices (15-second TTL when market open, 1-day when closed)
CREATE TABLE raw_data.price_cache (
    symbol VARCHAR(20),
    exchange VARCHAR(20),
    price NUMERIC(20,8),
    cached_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    UNIQUE(symbol, exchange)
);
```

### In-Memory Cache (Application)

```typescript
const priceCache = new Map<string, { price: number; expiresAt: number }>();

export async function getCachedPrice(symbol: string): Promise<number> {
  const cached = priceCache.get(symbol);
  
  if (cached && Date.now() < cached.expiresAt) {
    return cached.price;
  }
  
  // Fetch from API only if cache expired
  const freshPrice = await getAlphaVantagePrice(symbol);
  priceCache.set(symbol, {
    price: freshPrice.price,
    expiresAt: Date.now() + (5 * 60 * 1000), // 5-minute cache
  });
  
  return freshPrice.price;
}
```

---

## 8. API Call Optimization

### Batch Requests (Reduce Calls)

```typescript
// Instead of: 10 individual API calls
for (const symbol of holdings) {
  await getPrice(symbol); // 10 calls ❌
}

// Do: 1 batch request
const symbols = holdings.map(h => h.symbol);
const prices = await getBatchPrices(symbols); // 1 call ✅
```

### Lazy Loading (Only When Needed)

```typescript
// Don't fetch prices for all stocks on page load
// Only fetch when user views the portfolio tab

useEffect(() => {
  if (activeTab === 'portfolio') {
    fetchPortfolioPrices(); // Load only when tab active
  }
}, [activeTab]);
```

### Smart Refresh Intervals

```typescript
const refreshInterval = isMarketOpen() 
  ? 15000  // 15 seconds (market open)
  : 300000; // 5 minutes (market closed)

setInterval(fetchPrices, refreshInterval);
```

---

## 9. Fallback Strategy

If API fails, use last known price from database:

```typescript
export async function getPrice(symbol: string): Promise<number> {
  try {
    // Try API first
    const apiPrice = await getAlphaVantagePrice(symbol);
    return apiPrice.price;
  } catch (error) {
    console.warn(`API failed for ${symbol}, using cached price`);
    
    // Fallback: Get last known price from DB
    const lastKnown = await getLastKnownPrice(symbol);
    return lastKnown || 0;
  }
}
```

---

## 10. Testing Without API Calls

Use mock data during development:

```typescript
// lib/mock-data.ts
export const MOCK_PRICES = {
  'AAPL': 175.50,
  'MSFT': 415.30,
  'DANGCEM': 285.50,
  'AGL': 425.00,
};

export function getMockPrice(symbol: string): number {
  return MOCK_PRICES[symbol] || 100.00;
}

// In development mode
const price = process.env.NODE_ENV === 'development'
  ? getMockPrice(symbol)
  : await getAlphaVantagePrice(symbol);
```

---

## 11. Migration to Paid APIs (Future)

When MOBU scales, migrate to:

1. **Polygon.io** ($99/month - real-time, unlimited)
2. **Mansa API** (African markets, developer-friendly pricing)
3. **Quiver Quantitative** ($30/month - alternative data)

But for now, **100% free APIs work perfectly** for testing and MVP!

---

## 12. Getting Started Checklist

- [ ] Get Alpha Vantage free API key
- [ ] Add `ALPHA_VANTAGE_API_KEY` to `.env.local`
- [ ] Install dependencies: `npm install axios cheerio yahoo-finance2`
- [ ] Test Alpha Vantage: `curl` command above
- [ ] Test Capitol Trades scraper
- [ ] Implement price caching
- [ ] Set up fallback to mock data

---

## Summary

✅ **Stock Prices**: Alpha Vantage (25/day free) + Yahoo Finance (unlimited)  
✅ **Alternative Data**: Capitol Trades (scraping) + SEC EDGAR (official)  
✅ **African Stocks**: Yahoo Finance (JSE, NSE, EGX)  
✅ **Cost**: $0/month  

**Perfect for testing, demo, and early users!**

---

**Document Version**: 1.0  
**Created**: 2026-09-12  
**APIs**: 100% Free Tier
