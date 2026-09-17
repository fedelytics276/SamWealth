-- MOBU Portfolio Materialized Views
-- Real-time portfolio snapshots for fast queries
-- Version: 1.0.0
-- Date: 2026-09-12

\c mobu_dev;

-- =====================================================================
-- SECTION 1: REAL TRADING PORTFOLIO SNAPSHOT
-- =====================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.user_portfolio_snapshot AS
SELECT 
    ua.user_id,
    ua.email,
    ua.username,
    ua.balance as cash,
    COALESCE(SUM(uh.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0) as holdings_value,
    ua.balance + COALESCE(SUM(uh.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0) as total_value,
    ua.initial_deposit,
    (ua.balance + COALESCE(SUM(uh.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0)) - ua.initial_deposit as total_pnl,
    CASE 
        WHEN ua.initial_deposit > 0 THEN
            ((ua.balance + COALESCE(SUM(uh.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0)) - ua.initial_deposit) / ua.initial_deposit * 100
        ELSE 0
    END as total_pnl_pct,
    COUNT(DISTINCT uh.holding_id) as holdings_count,
    ua.account_status,
    CURRENT_TIMESTAMP as snapshot_timestamp
FROM raw_data.user_accounts ua
LEFT JOIN raw_data.user_holdings uh ON ua.user_id = uh.user_id
LEFT JOIN raw_data.mansa_price_cache mpc ON uh.symbol = mpc.symbol AND uh.exchange = mpc.exchange
LEFT JOIN LATERAL (
    SELECT close_price 
    FROM raw_data.african_price_feeds apf
    WHERE apf.asset_symbol = uh.symbol 
      AND apf.exchange = uh.exchange
    ORDER BY price_timestamp DESC
    LIMIT 1
) apf ON mpc.price IS NULL
WHERE ua.account_status = 'active'
GROUP BY ua.user_id, ua.email, ua.username, ua.balance, ua.initial_deposit, ua.account_status;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_portfolio_snapshot_user 
ON analytics.user_portfolio_snapshot(user_id);

COMMENT ON MATERIALIZED VIEW analytics.user_portfolio_snapshot IS 
'Real-time portfolio values for real trading accounts. Refreshed every 15 seconds when markets open.';

-- =====================================================================
-- SECTION 2: PAPER TRADING PORTFOLIO SNAPSHOT
-- =====================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.paper_portfolio_snapshot AS
SELECT 
    pta.user_id,
    pta.account_id,
    pta.current_cash as cash,
    COALESCE(SUM(ph.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0) as holdings_value,
    pta.current_cash + COALESCE(SUM(ph.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0) as total_value,
    pta.starting_capital,
    (pta.current_cash + COALESCE(SUM(ph.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0)) - pta.starting_capital as total_pnl,
    CASE 
        WHEN pta.starting_capital > 0 THEN
            ((pta.current_cash + COALESCE(SUM(ph.quantity * COALESCE(mpc.price, apf.close_price, 0)), 0)) - pta.starting_capital) / pta.starting_capital * 100
        ELSE 0
    END as total_pnl_pct,
    pta.trades_count,
    pta.winning_trades,
    pta.losing_trades,
    pta.win_rate,
    pta.sharpe_ratio,
    pta.max_drawdown,
    COUNT(DISTINCT ph.holding_id) as holdings_count,
    CURRENT_TIMESTAMP as snapshot_timestamp
FROM raw_data.paper_trading_accounts pta
LEFT JOIN raw_data.paper_holdings ph ON pta.account_id = ph.account_id
LEFT JOIN raw_data.mansa_price_cache mpc ON ph.symbol = mpc.symbol AND ph.exchange = mpc.exchange
LEFT JOIN LATERAL (
    SELECT close_price 
    FROM raw_data.african_price_feeds apf
    WHERE apf.asset_symbol = ph.symbol 
      AND apf.exchange = ph.exchange
    ORDER BY price_timestamp DESC
    LIMIT 1
) apf ON mpc.price IS NULL
GROUP BY pta.user_id, pta.account_id, pta.current_cash, pta.starting_capital, 
         pta.trades_count, pta.winning_trades, pta.losing_trades, 
         pta.win_rate, pta.sharpe_ratio, pta.max_drawdown;

CREATE UNIQUE INDEX IF NOT EXISTS idx_paper_portfolio_snapshot_user 
ON analytics.paper_portfolio_snapshot(user_id);

COMMENT ON MATERIALIZED VIEW analytics.paper_portfolio_snapshot IS 
'Real-time portfolio values for paper trading accounts. Refreshed every 15 seconds when markets open.';

-- =====================================================================
-- SECTION 3: REFRESH FUNCTIONS
-- =====================================================================

-- Refresh real portfolio
CREATE OR REPLACE FUNCTION analytics.refresh_user_portfolio_snapshot()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.user_portfolio_snapshot;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION analytics.refresh_user_portfolio_snapshot IS 
'Refreshes real trading portfolio snapshot. Call every 15 seconds when markets open.';

-- Refresh paper portfolio
CREATE OR REPLACE FUNCTION analytics.refresh_paper_portfolio_snapshot()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.paper_portfolio_snapshot;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION analytics.refresh_paper_portfolio_snapshot IS 
'Refreshes paper trading portfolio snapshot. Call every 15 seconds when markets open.';

-- Refresh both
CREATE OR REPLACE FUNCTION analytics.refresh_all_portfolio_snapshots()
RETURNS void AS $$
BEGIN
    PERFORM analytics.refresh_user_portfolio_snapshot();
    PERFORM analytics.refresh_paper_portfolio_snapshot();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION analytics.refresh_all_portfolio_snapshots IS 
'Refreshes both real and paper trading portfolio snapshots.';

-- =====================================================================
-- SECTION 4: INITIAL REFRESH
-- =====================================================================

SELECT analytics.refresh_all_portfolio_snapshots();

-- Verify snapshots
SELECT 'Real Portfolio Snapshots' as snapshot_type, COUNT(*) as user_count, 
       ROUND(AVG(total_value), 2) as avg_portfolio_value
FROM analytics.user_portfolio_snapshot;

SELECT 'Paper Portfolio Snapshots' as snapshot_type, COUNT(*) as user_count, 
       ROUND(AVG(total_value), 2) as avg_portfolio_value
FROM analytics.paper_portfolio_snapshot;

\echo 'Portfolio snapshots created and refreshed!';
\echo 'To refresh manually: SELECT analytics.refresh_all_portfolio_snapshots();';
\echo 'Set up cron job to refresh every 15 seconds during market hours.';
