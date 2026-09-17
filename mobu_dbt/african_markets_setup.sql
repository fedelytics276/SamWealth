-- MOBU African Market Integration - Database Setup
-- Creates tables for African exchanges, alternative data, brokers, payments, paper trading
-- Version: 1.0.0
-- Date: 2026-09-12

\c mobu_dev;

-- =====================================================================
-- SECTION 1: AFRICAN STOCK PRICE FEEDS
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.african_price_feeds (
    feed_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL, -- 'Mansa API', 'African Markets API'
    exchange VARCHAR(20) NOT NULL, -- 'NGX', 'JSE', 'NSE', 'EGX', 'GSE', 'BRVM'
    asset_symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    asset_isin VARCHAR(50),
    sector VARCHAR(100),
    industry VARCHAR(100),
    price_timestamp TIMESTAMPTZ NOT NULL,
    open_price NUMERIC(20,8),
    high_price NUMERIC(20,8),
    low_price NUMERIC(20,8),
    close_price NUMERIC(20,8) NOT NULL,
    volume NUMERIC(30,8),
    currency VARCHAR(10) DEFAULT 'USD', -- 'NGN', 'ZAR', 'KES', 'EGP', 'GHS'
    market_cap NUMERIC(20,2),
    pe_ratio NUMERIC(10,4),
    dividend_yield NUMERIC(6,4),
    data_quality_score NUMERIC(5,4) DEFAULT 1.0,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_african_price_exchange_symbol ON raw_data.african_price_feeds(exchange, asset_symbol, price_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_african_price_ingested ON raw_data.african_price_feeds(ingested_at DESC);
CREATE INDEX IF NOT EXISTS idx_african_price_timestamp ON raw_data.african_price_feeds(price_timestamp DESC);

COMMENT ON TABLE raw_data.african_price_feeds IS 'African stock price data from JSE, NGX, NSE, EGX, GSE, BRVM, CSE, ZSE';

-- =====================================================================
-- SECTION 2: ALTERNATIVE DATA (Quiver Quantitative + Custom African)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.alternative_data (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source VARCHAR(100) NOT NULL, -- 'Quiver', 'UnusualWhales', 'Kenya_eTender', 'SA_Mining'
    data_type VARCHAR(50) NOT NULL, -- 'congress_trade', 'insider', '13f_filing', 'government_contract'
    region VARCHAR(50), -- 'US', 'Africa', 'Kenya', 'South_Africa'
    asset_symbol VARCHAR(20),
    asset_name VARCHAR(200),
    exchange VARCHAR(20),
    event_date DATE NOT NULL,
    actor_name VARCHAR(200), -- Politician, insider, fund manager, company name
    actor_type VARCHAR(50), -- 'politician', 'insider', 'hedge_fund', 'government'
    actor_position VARCHAR(100), -- 'Senator', 'CEO', 'CFO', 'Portfolio Manager'
    transaction_type VARCHAR(50), -- 'buy', 'sell', 'hold', 'contract_award', 'license_grant'
    amount_min NUMERIC(20,2),
    amount_max NUMERIC(20,2),
    amount_currency VARCHAR(10),
    shares_traded NUMERIC(20,8),
    sentiment_signal VARCHAR(20), -- 'bullish', 'bearish', 'neutral'
    confidence_score NUMERIC(5,4),
    description TEXT,
    metadata JSONB, -- Additional unstructured data
    raw_data JSONB,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alt_data_symbol ON raw_data.alternative_data(asset_symbol, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_alt_data_type ON raw_data.alternative_data(data_type, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_alt_data_source ON raw_data.alternative_data(data_source);
CREATE INDEX IF NOT EXISTS idx_alt_data_signal ON raw_data.alternative_data(sentiment_signal);
CREATE INDEX IF NOT EXISTS idx_alt_data_region ON raw_data.alternative_data(region);

COMMENT ON TABLE raw_data.alternative_data IS 'Alternative data: congressional trades, insiders, 13F, African government contracts, mining licenses';

-- =====================================================================
-- SECTION 3: BROKER CONNECTIONS (OAuth Tokens)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.broker_connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    broker_name VARCHAR(100) NOT NULL, -- 'EasyEquities', 'Bamboo', 'Chaka', 'Trove', 'Hisa'
    broker_type VARCHAR(50), -- 'african_broker', 'us_broker', 'crypto_exchange'
    broker_region VARCHAR(50), -- 'South_Africa', 'Nigeria', 'Kenya', 'Global'
    broker_account_id VARCHAR(200), -- User's account ID at broker
    oauth_access_token TEXT, -- Encrypted (AES-256)
    oauth_refresh_token TEXT, -- Encrypted
    token_expires_at TIMESTAMPTZ,
    connection_status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'revoked', 'error'
    last_sync_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    supported_exchanges TEXT[], -- ['NGX', 'JSE', 'NYSE', 'NASDAQ']
    api_base_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, broker_name)
);

CREATE INDEX IF NOT EXISTS idx_broker_conn_user ON raw_data.broker_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_conn_status ON raw_data.broker_connections(connection_status);
CREATE INDEX IF NOT EXISTS idx_broker_conn_broker ON raw_data.broker_connections(broker_name);

COMMENT ON TABLE raw_data.broker_connections IS 'User OAuth connections to African brokers (EasyEquities, Bamboo, Chaka)';

-- =====================================================================
-- SECTION 4: EXECUTED TRADES (Real Broker Trades)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.executed_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    recommendation_id UUID, -- Links to MOBU AI recommendation
    broker_connection_id UUID REFERENCES raw_data.broker_connections(connection_id),
    broker_name VARCHAR(100) NOT NULL,
    broker_order_id VARCHAR(200), -- Broker's internal order ID
    symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    exchange VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    quantity NUMERIC(20,8) NOT NULL,
    order_type VARCHAR(20) DEFAULT 'market', -- 'market', 'limit', 'stop', 'stop_limit'
    limit_price NUMERIC(20,8),
    stop_price NUMERIC(20,8),
    filled_qty NUMERIC(20,8),
    avg_fill_price NUMERIC(20,8),
    total_cost NUMERIC(20,2),
    commission NUMERIC(20,2),
    currency VARCHAR(10) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'filled', 'partial', 'cancelled', 'rejected'
    rejection_reason TEXT,
    execution_venue VARCHAR(100), -- Which exchange/venue executed
    submitted_at TIMESTAMPTZ NOT NULL,
    filled_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exec_trades_user ON raw_data.executed_trades(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_exec_trades_recommendation ON raw_data.executed_trades(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_exec_trades_status ON raw_data.executed_trades(order_status);
CREATE INDEX IF NOT EXISTS idx_exec_trades_symbol ON raw_data.executed_trades(symbol, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_exec_trades_broker ON raw_data.executed_trades(broker_name);

COMMENT ON TABLE raw_data.executed_trades IS 'Real trades executed via broker APIs (EasyEquities, Bamboo, Chaka)';

-- =====================================================================
-- SECTION 5: PAYMENT TRANSACTIONS
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.payment_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'broker_transfer'
    payment_method VARCHAR(50), -- 'm_pesa', 'airtel_money', 'bank_transfer', 'card', 'ussd'
    amount NUMERIC(20,2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- 'KES', 'NGN', 'ZAR', 'USD', 'GHS', 'EGP'
    amount_usd NUMERIC(20,2), -- Converted to USD for reporting
    fx_rate NUMERIC(20,8), -- Exchange rate used
    gateway_provider VARCHAR(50), -- 'paystack', 'flutterwave', 'dlocal', 'mpesa_direct'
    gateway_reference VARCHAR(200), -- Provider's transaction ID
    gateway_fee NUMERIC(20,2),
    mobu_fee NUMERIC(20,2),
    net_amount NUMERIC(20,2), -- Amount after fees
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    failure_reason TEXT,
    user_bank_account VARCHAR(200), -- For bank transfers
    user_bank_name VARCHAR(100),
    user_mobile_number VARCHAR(50), -- For mobile money (M-Pesa, Airtel)
    user_wallet_address VARCHAR(200), -- For crypto (future)
    initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    callback_data JSONB, -- Raw webhook data from payment gateway
    ip_address INET,
    user_agent TEXT,
    country_code VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON raw_data.payment_transactions(user_id, initiated_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON raw_data.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON raw_data.payment_transactions(gateway_provider, gateway_reference);
CREATE INDEX IF NOT EXISTS idx_payments_type ON raw_data.payment_transactions(transaction_type, status);

COMMENT ON TABLE raw_data.payment_transactions IS 'Deposits/withdrawals via M-Pesa, Paystack, Flutterwave';

-- =====================================================================
-- SECTION 6: PAPER TRADING ACCOUNTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.paper_trading_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100),
    starting_capital NUMERIC(20,2) DEFAULT 100000.00, -- Virtual cash at start
    current_cash NUMERIC(20,2) DEFAULT 100000.00, -- Current virtual cash
    total_portfolio_value NUMERIC(20,2), -- Cash + holdings value
    total_pnl NUMERIC(20,2), -- Total profit/loss
    total_pnl_pct NUMERIC(8,4), -- % return
    total_deposits NUMERIC(20,2) DEFAULT 0.00, -- Virtual deposits (resets)
    total_withdrawals NUMERIC(20,2) DEFAULT 0.00,
    trades_count INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    win_rate NUMERIC(5,4), -- % of winning trades
    sharpe_ratio NUMERIC(8,4),
    sortino_ratio NUMERIC(8,4),
    max_drawdown NUMERIC(8,4), -- Worst peak-to-trough decline
    current_drawdown NUMERIC(8,4),
    longest_winning_streak INTEGER DEFAULT 0,
    longest_losing_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    avg_trade_return NUMERIC(8,4),
    largest_win NUMERIC(20,2),
    largest_loss NUMERIC(20,2),
    avg_holding_days NUMERIC(10,2),
    risk_score NUMERIC(5,2), -- 0-100 (100 = very risky)
    leaderboard_rank INTEGER,
    badges TEXT[], -- ['top_10', 'best_sharpe', '100_trades', 'diamond_hands']
    account_status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'closed'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_paper_accounts_user ON raw_data.paper_trading_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_accounts_leaderboard ON raw_data.paper_trading_accounts(total_pnl_pct DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_paper_accounts_status ON raw_data.paper_trading_accounts(account_status);

COMMENT ON TABLE raw_data.paper_trading_accounts IS 'Virtual trading accounts with $100k starting capital for risk-free practice';

-- =====================================================================
-- SECTION 7: PAPER TRADES
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.paper_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES raw_data.paper_trading_accounts(account_id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    recommendation_id UUID, -- Links to MOBU recommendation (if followed)
    symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    exchange VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    quantity NUMERIC(20,8) NOT NULL,
    price NUMERIC(20,8) NOT NULL, -- Real market price at execution
    total_value NUMERIC(20,2),
    commission NUMERIC(20,2) DEFAULT 0.00, -- Simulated commission (optional)
    currency VARCHAR(10) DEFAULT 'USD',
    order_type VARCHAR(20) DEFAULT 'market',
    pnl NUMERIC(20,2), -- Profit/loss when closed
    pnl_pct NUMERIC(8,4), -- % return on trade
    holding_period_days INTEGER, -- Days between buy and sell
    is_closed BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_paper_trades_account ON raw_data.paper_trades(account_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_paper_trades_user ON raw_data.paper_trades(user_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_paper_trades_symbol ON raw_data.paper_trades(symbol);
CREATE INDEX IF NOT EXISTS idx_paper_trades_recommendation ON raw_data.paper_trades(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_paper_trades_closed ON raw_data.paper_trades(is_closed, executed_at DESC);

COMMENT ON TABLE raw_data.paper_trades IS 'Simulated trades using real market prices (paper trading)';

-- =====================================================================
-- SECTION 8: PAPER HOLDINGS (Current Positions)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.paper_holdings (
    holding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES raw_data.paper_trading_accounts(account_id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    exchange VARCHAR(20) NOT NULL,
    quantity NUMERIC(20,8) NOT NULL,
    avg_cost_basis NUMERIC(20,8) NOT NULL, -- Weighted average purchase price
    total_cost NUMERIC(20,2),
    current_price NUMERIC(20,8),
    current_value NUMERIC(20,2),
    unrealized_pnl NUMERIC(20,2),
    unrealized_pnl_pct NUMERIC(8,4),
    first_purchased_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(account_id, symbol, exchange)
);

CREATE INDEX IF NOT EXISTS idx_paper_holdings_account ON raw_data.paper_holdings(account_id);
CREATE INDEX IF NOT EXISTS idx_paper_holdings_user ON raw_data.paper_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_holdings_symbol ON raw_data.paper_holdings(symbol);

COMMENT ON TABLE raw_data.paper_holdings IS 'Current open positions in paper trading accounts';

-- =====================================================================
-- SECTION 9: LEADERBOARD (Gamification)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.paper_trading_leaderboard (
    leaderboard_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(100),
    rank INTEGER NOT NULL,
    total_return NUMERIC(8,4), -- % return
    total_trades INTEGER,
    win_rate NUMERIC(5,4),
    sharpe_ratio NUMERIC(8,4),
    portfolio_value NUMERIC(20,2),
    badges TEXT[], -- ['top_10', 'best_sharpe', '100_trades']
    prize VARCHAR(200), -- 'Free Premium Month', '$50 Trading Credit'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(period_type, period_start, user_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON raw_data.paper_trading_leaderboard(period_type, period_start, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON raw_data.paper_trading_leaderboard(user_id);

COMMENT ON TABLE raw_data.paper_trading_leaderboard IS 'Paper trading leaderboard rankings (daily, weekly, monthly, all-time)';

-- =====================================================================
-- SECTION 10: CURRENCY EXCHANGE RATES
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.currency_exchange_rates (
    rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(10) NOT NULL, -- 'USD'
    quote_currency VARCHAR(10) NOT NULL, -- 'NGN', 'KES', 'ZAR', 'GHS'
    exchange_rate NUMERIC(20,8) NOT NULL, -- 1 USD = X NGN
    rate_timestamp TIMESTAMPTZ NOT NULL,
    source VARCHAR(100), -- 'Central Bank of Nigeria', 'XE.com', 'OANDA'
    bid_rate NUMERIC(20,8),
    ask_rate NUMERIC(20,8),
    mid_rate NUMERIC(20,8),
    daily_change NUMERIC(8,4), -- % change from previous day
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(base_currency, quote_currency, rate_timestamp)
);

CREATE INDEX IF NOT EXISTS idx_fx_rates_pair ON raw_data.currency_exchange_rates(base_currency, quote_currency, rate_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_fx_rates_timestamp ON raw_data.currency_exchange_rates(rate_timestamp DESC);

COMMENT ON TABLE raw_data.currency_exchange_rates IS 'FX rates for African currencies (USD/NGN, USD/KES, USD/ZAR, USD/GHS)';

-- =====================================================================
-- SECTION 11: SAMPLE DATA
-- =====================================================================

-- Sample African stock prices
INSERT INTO raw_data.african_price_feeds 
(source_name, exchange, asset_symbol, asset_name, price_timestamp, open_price, high_price, low_price, close_price, volume, currency, data_quality_score)
VALUES
('Mansa API', 'NGX', 'DANGCEM', 'Dangote Cement', CURRENT_TIMESTAMP - INTERVAL '1 hour', 285.00, 287.50, 284.00, 285.50, 1250000, 'NGN', 0.98),
('Mansa API', 'JSE', 'AGL', 'Anglo American Platinum', CURRENT_TIMESTAMP - INTERVAL '1 hour', 1200.00, 1215.30, 1198.50, 1210.75, 456000, 'ZAR', 0.99),
('Mansa API', 'NSE', 'SCOM', 'Safaricom', CURRENT_TIMESTAMP - INTERVAL '1 hour', 28.50, 28.80, 28.40, 28.65, 8900000, 'KES', 0.97),
('Mansa API', 'GSE', 'GCB', 'GCB Bank', CURRENT_TIMESTAMP - INTERVAL '1 hour', 5.20, 5.35, 5.18, 5.30, 120000, 'GHS', 0.95),
('Mansa API', 'EGX', 'COMI', 'Commercial International Bank', CURRENT_TIMESTAMP - INTERVAL '1 hour', 75.50, 76.20, 75.00, 75.80, 3400000, 'EGP', 0.96)
ON CONFLICT DO NOTHING;

-- Sample alternative data (Congressional trade)
INSERT INTO raw_data.alternative_data
(data_source, data_type, region, asset_symbol, event_date, actor_name, actor_type, transaction_type, amount_min, amount_max, sentiment_signal, confidence_score)
VALUES
('Quiver', 'congress_trade', 'US', 'AAPL', CURRENT_DATE - INTERVAL '5 days', 'Nancy Pelosi', 'politician', 'buy', 1000000, 5000000, 'bullish', 0.92),
('Kenya_eTender', 'government_contract', 'Kenya', 'SCOM', CURRENT_DATE - INTERVAL '10 days', 'Kenya Railways', 'government', 'contract_award', 50000000, 50000000, 'bullish', 0.88)
ON CONFLICT DO NOTHING;

-- Sample paper trading account
INSERT INTO raw_data.paper_trading_accounts
(user_id, username, starting_capital, current_cash, total_portfolio_value, total_pnl, total_pnl_pct, trades_count, winning_trades, win_rate)
VALUES
('user_demo_001', 'DemoTrader', 100000.00, 95000.00, 108500.00, 8500.00, 8.50, 15, 10, 0.6667)
ON CONFLICT (user_id) DO NOTHING;

-- Sample paper trades
INSERT INTO raw_data.paper_trades
(account_id, user_id, symbol, exchange, side, quantity, price, total_value, is_closed, executed_at)
VALUES
((SELECT account_id FROM raw_data.paper_trading_accounts WHERE user_id = 'user_demo_001' LIMIT 1),
 'user_demo_001', 'DANGCEM', 'NGX', 'buy', 100, 280.00, 28000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Sample FX rates
INSERT INTO raw_data.currency_exchange_rates
(base_currency, quote_currency, exchange_rate, rate_timestamp, source)
VALUES
('USD', 'NGN', 1580.50, CURRENT_TIMESTAMP, 'Central Bank of Nigeria'),
('USD', 'KES', 145.30, CURRENT_TIMESTAMP, 'Central Bank of Kenya'),
('USD', 'ZAR', 18.75, CURRENT_TIMESTAMP, 'South African Reserve Bank'),
('USD', 'GHS', 16.20, CURRENT_TIMESTAMP, 'Bank of Ghana'),
('USD', 'EGP', 49.50, CURRENT_TIMESTAMP, 'Central Bank of Egypt')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- SETUP COMPLETE
-- =====================================================================

-- Verify table creation
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_schema = 'raw_data' AND columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'raw_data'
AND table_name IN (
    'african_price_feeds',
    'alternative_data',
    'broker_connections',
    'executed_trades',
    'payment_transactions',
    'paper_trading_accounts',
    'paper_trades',
    'paper_holdings',
    'paper_trading_leaderboard',
    'currency_exchange_rates'
)
ORDER BY table_name;

-- Check sample data
SELECT 'african_price_feeds' as table_name, COUNT(*) as row_count FROM raw_data.african_price_feeds
UNION ALL SELECT 'alternative_data', COUNT(*) FROM raw_data.alternative_data
UNION ALL SELECT 'paper_trading_accounts', COUNT(*) FROM raw_data.paper_trading_accounts
UNION ALL SELECT 'paper_trades', COUNT(*) FROM raw_data.paper_trades
UNION ALL SELECT 'currency_exchange_rates', COUNT(*) FROM raw_data.currency_exchange_rates;

\echo '✅ African Market Integration - Database Setup Complete!'
\echo 'Tables created: 10'
\echo 'Next steps:'
\echo '1. Create dbt staging models for African data'
\echo '2. Sign up for Mansa API (https://mansaapi.com/)'
\echo '3. Sign up for Quiver Quantitative API (https://api.quiverquant.com/)'
\echo '4. Build Data Feed Agent connectors'
\echo '5. Test paper trading engine'
