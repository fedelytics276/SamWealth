# 📊 Chart Feature - Quick Test Guide

**Status**: ✅ Chart integrated in StockLookup component  
**Demo**: http://localhost:3000/dashboard

---

## 🎯 Quick Test (1 Minute)

### Step 1: Open Dashboard
```
http://localhost:3000/dashboard
```

### Step 2: Search Stock
Type in search box: **AAPL**

### Step 3: Verify Chart Appears
You should see:
1. ✅ Evidence card with BUY/SELL recommendation
2. ✅ **Interactive chart below** showing 3-month view
3. ✅ Timeframe buttons: [1D] [5D] [1M] [3M✓] [1Y]
4. ✅ Frequency buttons: [Hourly] [Daily✓] [Weekly]
5. ✅ Statistics: Current price, change %, high/low, volume

### Step 4: Test Interactions
- Click **[1Y]** → Chart updates to 1-year view
- Click **[1D]** → Chart updates to 1-day view
- Click **[Weekly]** → Chart updates to weekly frequency
- Hover over chart → Tooltip shows OHLC data

### Step 5: Test Different Stocks
- Search **MSFT** → Chart updates
- Search **DANGCEM** → Chart updates (African stock)
- Search **NVDA** → Chart updates

---

## ✅ What Should Work

### Chart Display
- ✅ Chart appears immediately after search
- ✅ Positioned below evidence card
- ✅ Height: 400px
- ✅ Full width of container
- ✅ Blue gradient area chart

### Timeframe Buttons
- ✅ 1D button works
- ✅ 5D button works
- ✅ 1M button works
- ✅ **3M button is selected by default**
- ✅ 1Y button works
- ✅ Selected button highlighted in blue

### Frequency Buttons
- ✅ Hourly button works
- ✅ **Daily button is selected by default**
- ✅ Weekly button works
- ✅ Selected button highlighted in green

### Statistics
- ✅ Current price displayed at top right
- ✅ Change % shown (green if positive, red if negative)
- ✅ High price shown
- ✅ Low price shown
- ✅ Average volume shown

### Tooltips
- ✅ Tooltip appears on hover
- ✅ Shows: Date, Open, High, Low, Close, Volume
- ✅ Follows mouse cursor
- ✅ White background with shadow
- ✅ Formatted prices (2 decimals)

### Data Loading
- ✅ Loading spinner shows while fetching
- ✅ Chart appears within 2 seconds
- ✅ No console errors
- ✅ Fallback to mock data if API fails

---

## 🐛 If Something's Wrong

### Chart Not Appearing?
1. Check browser console (F12)
2. Look for error messages
3. Verify dev server is running
4. Try refreshing page (Cmd+R)

### Chart Shows Error?
- This is okay! Using mock data for demo
- Chart should still display with fallback data
- No "No data" blank screen

### Tooltips Not Showing?
- Hover directly over the blue line
- Try different browser (Chrome recommended)
- Check if JavaScript is enabled

### Buttons Not Working?
- Check browser console for errors
- Verify component imported correctly
- Clear browser cache (Cmd+Shift+R)

---

## 📸 Expected Visual

```
After searching "AAPL", you should see:

┌────────────────────────────────────────────────────┐
│  AAPL    [BUY]                   Confidence: 87%   │
│  Apple Inc.                                        │
│  Current: $175 | Target: $195 | Upside: +11.3%    │
│  [View Evidence] [Purchase] [Auto]                 │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│  AAPL                                    $175.23   │
│  NASDAQ                                  +2.34     │
│  ────────────────────────────────────────────────  │
│  High: $180  |  Low: $165  |  Vol: 65M            │
│  ────────────────────────────────────────────────  │
│  [1D] [5D] [1M] [3M✓] [1Y]                        │
│  [Hourly] [Daily✓] [Weekly]                       │
│  ────────────────────────────────────────────────  │
│  $180 ┤                                            │
│       │       ╱╲                                   │
│  $175 ┤      ╱  ╲    ╱╲                           │
│       │     ╱    ╲  ╱  ╲  ╱╲                      │
│  $170 ┤    ╱      ╲╱    ╲╱  ╲                     │
│       │   ╱                   ╲                    │
│  $165 ┤──┴────────────────────────────            │
│       └───────────────────────────────            │
│        Jun      Jul      Aug      Sep             │
│  ────────────────────────────────────────────────  │
│  Historical price data (3M view, daily frequency)  │
└────────────────────────────────────────────────────┘
```

---

## ✅ Test Checklist

### Basic Functionality
- [ ] Open http://localhost:3000/dashboard
- [ ] Search for AAPL
- [ ] Chart appears below evidence
- [ ] Chart shows 3M view by default
- [ ] Chart shows daily frequency by default

### Timeframe Toggle
- [ ] Click [1D] → Chart updates
- [ ] Click [5D] → Chart updates
- [ ] Click [1M] → Chart updates
- [ ] Click [3M] → Chart updates (default)
- [ ] Click [1Y] → Chart updates

### Frequency Toggle
- [ ] Click [Hourly] → Chart updates
- [ ] Click [Daily] → Chart updates (default)
- [ ] Click [Weekly] → Chart updates

### Interactivity
- [ ] Hover over chart → Tooltip appears
- [ ] Tooltip shows OHLC data
- [ ] Tooltip follows mouse
- [ ] Statistics update when timeframe changes

### Multiple Stocks
- [ ] Search MSFT → Chart updates
- [ ] Search NVDA → Chart updates
- [ ] Search DANGCEM → Chart updates
- [ ] Each stock shows different data

### Performance
- [ ] Chart loads in < 2 seconds
- [ ] No console errors
- [ ] Smooth animations
- [ ] No lag when clicking buttons

---

## 🎉 Success Criteria

If you can:
1. ✅ See chart on every stock search
2. ✅ Toggle between timeframes (1D-1Y)
3. ✅ Toggle between frequencies (hourly/daily/weekly)
4. ✅ Hover for tooltips
5. ✅ See statistics update

**Then the chart feature is working perfectly!** 🎊

---

## 📊 Quick Test Commands

### Test Different Stocks
```
Search: AAPL    → US tech stock
Search: MSFT    → US tech stock
Search: NVDA    → US tech stock
Search: DANGCEM → Nigerian stock (NGX)
Search: AGL     → South African stock (JSE)
Search: MTN     → South African stock (JSE)
```

### Test Different Timeframes
```
Click: [1D] → Last 24 hours
Click: [5D] → Last 5 days
Click: [1M] → Last month
Click: [3M] → Last 3 months (DEFAULT)
Click: [1Y] → Last year
```

### Test Different Frequencies
```
Click: [Hourly] → Hour-by-hour
Click: [Daily]  → Day-by-day (DEFAULT)
Click: [Weekly] → Week-by-week
```

---

**Test Now**: http://localhost:3000/dashboard  
**Search**: AAPL  
**Expected**: Beautiful 3-month chart! 📈✨
