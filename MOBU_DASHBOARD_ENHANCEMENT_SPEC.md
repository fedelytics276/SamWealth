# MOBU Dashboard Enhancement Specification

**Version**: 1.0  
**Date**: 2026-09-12  
**Status**: Ready for Implementation

---

## Requirements Summary

Based on user request, the dashboard needs:

1. ✅ **Portfolio tied to Paper Trading** - Same balance shown in dashboard portfolio value
2. ✅ **Last 3 Recommendations** - Only show 3 most recent
3. ✅ **History Dropdown** - All past recommendations accessible via dropdown with dates/times
4. ✅ **Interactive Checkboxes** - Mark recommendations as "executed" or "viewed"
5. ✅ **Real-time Updates** - Auto-refresh every 15 seconds when market open

---

## 1. Portfolio Integration (Paper Trading)

### Current Issue
- Dashboard shows static portfolio from JSON
- Paper trading account is separate

### Solution
**Unified Portfolio Display**:
```typescript
// Fetch portfolio based on mode
const portfolio = await fetch(`/api/portfolio?mode=${paperTradingMode ? 'paper' : 'real'}`)

// Paper trading mode (default):
{
  totalValue: $100,000 (starting) + current holdings value,
  cashBalance: $15,985 (remaining virtual cash),
  paperTradingMode: true
}

// Live mode:
{
  totalValue: actual account balance + holdings,
  cashBalance: actual available cash,
  paperTradingMode: false
}
```

### UI Changes

```tsx
<PortfolioSummary
  totalValue={portfolio.totalValue}  // SAME VALUE for paper & live
  cashBalance={portfolio.cashBalance}
  paperTradingMode={portfolio.paperTradingMode}
  // Shows badge: "📊 Paper Trading" or "💼 Live Trading"
/>
```

**Toggle Button**:
```tsx
<div className="flex space-x-2">
  <button 
    onClick={() => setPaperTradingMode(true)}
    className={paperTradingMode ? 'active' : ''}
  >
    📊 Paper Trading
  </button>
  <button 
    onClick={() => setPaperTradingMode(false)}
    className={!paperTradingMode ? 'active' : ''}
  >
    💼 Live Trading
  </button>
</div>
```

---

## 2. Last 3 Recommendations with History Dropdown

### Current State
- Shows all recommendations in grid (3-6 cards)
- No history functionality

### Enhanced Design

**Main Display - Last 3 Only**:
```tsx
<div className="recommendations-section">
  <div className="flex justify-between items-center mb-4">
    <h2>Active Recommendations (Last 3)</h2>
    <button 
      onClick={() => setShowHistory(!showHistory)}
      className="history-button"
    >
      <History className="h-4 w-4" />
      View History ({allRecommendations.length - 3} older)
      <ChevronDown className={showHistory ? 'rotate-180' : ''} />
    </button>
  </div>

  {/* Show last 3 recommendations */}
  <div className="grid grid-cols-3 gap-6">
    {recommendations.slice(0, 3).map(rec => (
      <RecommendationCard 
        key={rec.id} 
        {...rec} 
        onCheck={handleCheckRecommendation}
        checked={checkedRecs.includes(rec.id)}
      />
    ))}
  </div>

  {/* History Dropdown (collapsible) */}
  {showHistory && (
    <div className="history-dropdown mt-6 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Recommendation History</h3>
      <div className="space-y-3">
        {allRecommendations.slice(3).map(rec => (
          <div key={rec.id} className="history-item border-b pb-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{rec.ticker}</span>
                <span className="text-gray-600 ml-2">{rec.name}</span>
                <span className={`ml-2 ${rec.action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                  {rec.action}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{formatDate(rec.timestamp)}</div>
                <div className="text-sm text-gray-500">{formatTime(rec.timestamp)}</div>
              </div>
              <button 
                onClick={() => viewDetails(rec.id)}
                className="text-primary-600 hover:underline text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
```

### Data Structure

```json
// Each recommendation includes timestamp
{
  "id": "rec_20260912_001",
  "ticker": "SHP.JO",
  "name": "Shoprite Holdings Ltd",
  "action": "BUY",
  "confidence": 85,
  "priceTarget": 168.20,
  "currentPrice": 158.40,
  "timestamp": "2026-09-12T09:15:00Z",  // NEW
  "executed": false,  // NEW - user can mark as executed
  "checked": false  // NEW - user can check off
}
```

---

## 3. Interactive Checkboxes

### Feature: Mark Recommendations

Users can:
1. ✅ **Check off** viewed recommendations
2. ✅ **Mark as executed** when they place the trade
3. ✅ Track which recommendations they've acted on

**UI Enhancement**:
```tsx
<RecommendationCard>
  {/* Existing card content */}
  
  {/* NEW: Interactive footer */}
  <div className="card-footer flex justify-between items-center mt-4 pt-4 border-t">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={recommendation.checked}
        onChange={() => handleCheck(recommendation.id)}
        className="w-4 h-4"
      />
      <span className="text-sm text-gray-600">Viewed</span>
    </label>
    
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={recommendation.executed}
        onChange={() => handleExecute(recommendation.id)}
        className="w-4 h-4"
      />
      <span className="text-sm text-gray-600">Executed</span>
    </label>
    
    <span className="text-xs text-gray-400">
      {formatRelativeTime(recommendation.timestamp)}
    </span>
  </div>
</RecommendationCard>
```

### State Management

```typescript
const [checkedRecs, setCheckedRecs] = useState<string[]>([])
const [executedRecs, setExecutedRecs] = useState<string[]>([])

const handleCheck = (recId: string) => {
  setCheckedRecs(prev => 
    prev.includes(recId) 
      ? prev.filter(id => id !== recId)
      : [...prev, recId]
  )
  // Save to localStorage or API
  localStorage.setItem('checkedRecs', JSON.stringify(checkedRecs))
}

const handleExecute = (recId: string) => {
  setExecutedRecs(prev => 
    prev.includes(recId) 
      ? prev.filter(id => id !== recId)
      : [...prev, recId]
  )
  // Record execution in database
  fetch('/api/recommendations/execute', {
    method: 'POST',
    body: JSON.stringify({ recommendationId: recId, timestamp: new Date() })
  })
}
```

---

## 4. API Updates

### 4.1 Portfolio API Enhancement

```typescript
// pages/api/portfolio.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query.mode as string || 'paper' // 'paper' or 'real'
  const userId = 'demo_user' // From auth session
  
  if (mode === 'paper') {
    // Fetch paper trading account
    const paperAccount = await db.query(`
      SELECT 
        current_cash,
        (current_cash + COALESCE(
          (SELECT SUM(quantity * current_price) 
           FROM paper_holdings ph
           JOIN live_prices lp ON ph.symbol = lp.symbol
           WHERE ph.user_id = $1), 
          0
        )) as total_value,
        starting_capital
      FROM paper_trading_accounts
      WHERE user_id = $1
    `, [userId])
    
    const account = paperAccount.rows[0]
    
    return res.json({
      totalValue: account.total_value,
      cashBalance: account.current_cash,
      dayChange: account.total_value - account.starting_capital,
      dayChangePercent: ((account.total_value - account.starting_capital) / account.starting_capital) * 100,
      paperTradingMode: true,
    })
  } else {
    // Fetch real trading account (similar logic)
    // ...
  }
}
```

### 4.2 Recommendations API Enhancement

```typescript
// pages/api/recommendations.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Load from JSON (demo) or database
  const allRecs = await loadRecommendations()
  
  // Add timestamps if missing
  const enrichedRecs = allRecs.map((rec, idx) => ({
    ...rec,
    timestamp: rec.timestamp || new Date(Date.now() - idx * 3600000).toISOString(),
    executed: false,
    checked: false,
  }))
  
  // Sort by timestamp (newest first)
  enrichedRecs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  return res.json({
    recommendations: enrichedRecs,
    total: enrichedRecs.length,
    last3: enrichedRecs.slice(0, 3),
    history: enrichedRecs.slice(3),
  })
}
```

---

## 5. Visual Design

### Last 3 Recommendations (Main Display)

```
┌────────────────────────────────────────────────────────────────┐
│  Active Recommendations (Last 3)        [📜 View History (24)] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  SHP.JO     │  │  NPN.JO     │  │  FSR.JO     │            │
│  │  BUY        │  │  BUY        │  │  BUY        │            │
│  │  85% conf   │  │  78% conf   │  │  72% conf   │            │
│  │  +6.2%      │  │  +8.3%      │  │  +8.7%      │            │
│  │             │  │             │  │             │            │
│  │  ☐ Viewed   │  │  ☑ Viewed   │  │  ☐ Viewed   │            │
│  │  ☐ Executed │  │  ☐ Executed │  │  ☐ Executed │            │
│  │  2 hrs ago  │  │  5 hrs ago  │  │  1 day ago  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

### History Dropdown (Expanded)

```
┌────────────────────────────────────────────────────────────────┐
│  📜 Recommendation History                                      │
├────────────────────────────────────────────────────────────────┤
│  MTN.JO  MTN Group  BUY     2026-09-10 14:30  [View Details]   │
│  AGL.JO  Anglo Amer SELL    2026-09-09 09:15  [View Details]   │
│  BTI.JO  British Am BUY     2026-09-08 16:45  [View Details]   │
│  ...                                                            │
│  [Load More (20 older)]                                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Checklist

### Phase 1: Portfolio Integration ✅
- [ ] Add `paperTradingMode` state to dashboard
- [ ] Add toggle button (Paper / Live)
- [ ] Update `/api/portfolio` to accept `?mode=paper` param
- [ ] Fetch paper trading account from DB
- [ ] Display unified portfolio value

### Phase 2: Last 3 Recommendations ✅
- [ ] Update state: `recommendations` (last 3), `allRecommendations` (all)
- [ ] Update API to return sorted by timestamp
- [ ] Slice first 3 for main display
- [ ] Add timestamps to all recommendations

### Phase 3: History Dropdown ✅
- [ ] Add `showHistory` state
- [ ] Create collapsible history section
- [ ] Format dates/times (e.g., "2 hours ago", "Sep 12, 2:30 PM")
- [ ] Add "View Details" button per history item

### Phase 4: Interactive Checkboxes ✅
- [ ] Add `checked` and `executed` fields to recommendation data
- [ ] Add checkboxes to RecommendationCard footer
- [ ] Implement `handleCheck()` and `handleExecute()`
- [ ] Persist state (localStorage + database)
- [ ] Show visual indicators (gray out checked items)

### Phase 5: Real-time Updates ✅
- [ ] Add `setInterval` for auto-refresh (15 seconds)
- [ ] Only refresh when market is open
- [ ] Show "Live" indicator when updating
- [ ] Preserve checkbox state across refreshes

---

## 7. Data Model Updates

### Recommendations Table Enhancement

```sql
ALTER TABLE raw_data.recommendations
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS viewed_by_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS executed_by_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS executed_at TIMESTAMPTZ;

CREATE INDEX idx_recommendations_timestamp ON raw_data.recommendations(timestamp DESC);
```

### User Interactions Table

```sql
CREATE TABLE raw_data.user_recommendation_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    recommendation_id UUID REFERENCES raw_data.recommendations(recommendation_id),
    interaction_type VARCHAR(20), -- 'viewed', 'executed', 'dismissed'
    interaction_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_user_interactions ON raw_data.user_recommendation_interactions(user_id, interaction_timestamp DESC);
```

---

## 8. Success Criteria

✅ **Portfolio Tied to Paper Trading**
- Portfolio value shown on dashboard = Paper trading account value
- Toggle switches between paper and live mode
- Cash balance updates when trades executed

✅ **Last 3 Recommendations**
- Dashboard shows only 3 most recent recommendations
- Sorted by timestamp (newest first)
- Each shows relative time ("2 hours ago")

✅ **History Dropdown**
- Clicking "View History" expands all past recommendations
- Each history item shows: Ticker, Action, Date, Time
- "View Details" button opens evidence trail

✅ **Interactive Checkboxes**
- Users can mark recommendations as "Viewed"
- Users can mark recommendations as "Executed"
- State persists across page refreshes
- Checked items show visual indicator

✅ **Real-time Updates**
- Portfolio value updates every 15 seconds (market open)
- New recommendations appear automatically
- Checkbox states preserved during updates

---

## 9. Example Updated JSON (recommendations.json)

```json
{
  "recommendations": [
    {
      "id": "rec_20260912_001",
      "ticker": "SHP.JO",
      "name": "Shoprite Holdings Ltd",
      "action": "BUY",
      "confidence": 85,
      "priceTarget": 168.20,
      "currentPrice": 158.40,
      "upside": 6.2,
      "sector": "Consumer Goods",
      "exchange": "JSE",
      "timestamp": "2026-09-12T09:15:00Z",
      "executed": false,
      "checked": false,
      "reasoning": "Underheld by institutions..."
    },
    {
      "id": "rec_20260912_002",
      "ticker": "NPN.JO",
      "name": "Naspers Ltd",
      "action": "BUY",
      "confidence": 78,
      "priceTarget": 3280.50,
      "currentPrice": 3280.50,
      "upside": 8.3,
      "sector": "Technology",
      "exchange": "JSE",
      "timestamp": "2026-09-12T04:30:00Z",
      "executed": false,
      "checked": true,
      "reasoning": "Strong earnings momentum..."
    }
    // ... more recommendations with timestamps
  ]
}
```

---

## 10. Next Steps

1. **Update dashboard.tsx** with new state variables
2. **Add toggle buttons** for Paper/Live mode
3. **Update API endpoints** to handle mode parameter
4. **Modify RecommendationCard** to add checkboxes
5. **Create history dropdown** component
6. **Test end-to-end** with paper trading account

---

**Document Version**: 1.0  
**Ready for**: Immediate implementation  
**Estimated Time**: 4-6 hours development
