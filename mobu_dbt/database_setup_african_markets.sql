-- MOBU African Market Integration - Database Schema
-- Extends existing database with African markets, alternative data, broker connections, payments, paper trading
-- Version: 1.0.0
-- Date: 2026-09-12

\c mobu_dev;

-- =====================================================================
-- SECTION 1: AFRICAN STOCK PRICE FEEDS
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.african_price_feeds (
    feed_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL, -- 'Mansa API', 'African Markets API', 'Direct Scraper'
    exchange VARCHAR(20) NOT NULL, -- 'NGX', 'JSE', 'NSE', 'EGX', 'GSE', 'BRVM', 'CSE', 'ZSE'
    asset_symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    sector VARCHAR(100), -- 'Banking', 'Mining', 'Telecom', 'Agriculture'
    price_timestamp TIMESTAMPTZ NOT NULL,
    open_price NUMERIC(20,8),
    high_price NUMERIC(20,8),
    low_price NUMERIC(20,8),
    close_price NUMERIC(20,8) NOT NULL,
    volume NUMERIC(30,8),
    currency VARCHAR(10) NOT NULL, -- 'NGN', 'ZAR', 'KES', 'EGP', 'GHS', 'USD'
    market_cap NUMERIC(20,2),
    pe_ratio NUMERIC(10,4),
    data_quality_score NUMERIC(5,4) DEFAULT 1.0,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_african_price_exchange_symbol ON raw_data.african_price_feeds(exchange, asset_symbol, price_timestamp DESC);
CREATE INDEX idx_african_price_ingested ON raw_data.african_price_feeds(ingested_at DESC);
CREATE INDEX idx_african_price_currency ON raw_data.african_price_feeds(currency);

COMMENT ON TABLE raw_data.african_price_feeds IS 'Stock price data from African exchanges (NGX, JSE, NSE, etc.)';
COMMENT ON COLUMN raw_data.african_price_feeds.exchange IS 'JSE=Johannesburg, NGX=Nigeria, NSE=Nairobi, EGX=Egypt, GSE=Ghana, BRVM=West Africa';

-- =====================================================================
-- SECTION 2: ALTERNATIVE DATA (Quiver Quantitative + Custom African)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.alternative_data (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source VARCHAR(100) NOT NULL, -- 'Quiver', 'UnusualWhales', 'Kenya_eTender', 'SA_Mining_Registry'
    data_type VARCHAR(50) NOT NULL, -- 'congress_trade', 'insider', '13f_filing', 'government_contract', 'mining_license'
    region VARCHAR(50), -- 'US', 'Africa', 'Kenya', 'South_Africa', 'Nigeria'
    asset_symbol VARCHAR(20),
    asset_name VARCHAR(200),
    exchange VARCHAR(20),
    event_date DATE NOT NULL,
    actor_name VARCHAR(200), -- Politician, insider, fund manager, company name
    actor_type VARCHAR(50), -- 'politician', 'insider', 'hedge_fund', 'government', 'mining_authority'
    transaction_type VARCHAR(50), -- 'buy', 'sell', 'hold', 'contract_award', 'license_grant'
    amount_min NUMERIC(20,2),
    amount_max NUMERIC(20,2),
    amount_currency VARCHAR(10),
    sentiment_signal VARCHAR(20), -- 'bullish', 'bearish', 'neutral'
    confidence_score NUMERIC(5,4),
    metadata JSONB, -- Flexible additional data
    raw_data JSONB, -- Full API response
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alt_data_symbol ON raw_data.alternative_data(asset_symbol, event_date DESC);
CREATE INDEX idx_alt_data_type ON raw_data.alternative_data(data_type, event_date DESC);
CREATE INDEX idx_alt_data_source ON raw_data.alternative_data(data_source);
CREATE INDEX idx_alt_data_signal ON raw_data.alternative_data(sentiment_signal);
CREATE INDEX idx_alt_data_region ON raw_data.alternative_data(region);

COMMENT ON TABLE raw_data.alternative_data IS 'Alternative data from Quiver Quantitative (US) and custom African sources';
COMMENT ON COLUMN raw_data.alternative_data.data_type IS 'Types: congress_trade, insider, 13f_filing, lobbying, government_contract, mining_license, port_volume';

-- =====================================================================
-- SECTION 3: BROKER CONNECTIONS (OAuth Tokens)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.broker_connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    broker_name VARCHAR(100) NOT NULL, -- 'EasyEquities', 'Bamboo', 'Chaka', 'Trove', 'Hisa'
    broker_type VARCHAR(50), -- 'african_broker', 'us_broker', 'crypto_exchange'
    broker_account_id VARCHAR(200), -- User's account ID at broker
    oauth_access_token TEXT, -- ENCRYPTED (use pgcrypto)
    oauth_refresh_token TEXT, -- ENCRYPTED
    token_expires_at TIMESTAMPTZ,
    connection_status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'revoked', 'error'
    last_sync_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    supported_exchanges TEXT[], -- ARRAY['NGX', 'JSE', 'NYSE', 'NASDAQ']
    api_base_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, broker_name)
);

CREATE INDEX idx_broker_conn_user ON raw_data.broker_connections(user_id);
CREATE INDEX idx_broker_conn_status ON raw_data.broker_connections(connection_status);

COMMENT ON TABLE raw_data.broker_connections IS 'OAuth connections to African brokers (EasyEquities, Bamboo, Chaka) for trade execution';

-- =====================================================================
-- SECTION 4: TRADE EXECUTION HISTORY
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
    submitted_at TIMESTAMPTZ NOT NULL,
    filled_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exec_trades_user ON raw_data.executed_trades(user_id, submitted_at DESC);
CREATE INDEX idx_exec_trades_recommendation ON raw_data.executed_trades(recommendation_id);
CREATE INDEX idx_exec_trades_status ON raw_data.executed_trades(order_status);
CREATE INDEX idx_exec_trades_symbol ON raw_data.executed_trades(symbol, submitted_at DESC);

COMMENT ON TABLE raw_data.executed_trades IS 'Real trades executed via broker APIs';

-- =====================================================================
-- SECTION 5: PAYMENT TRANSACTIONS (Deposits/Withdrawals)
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.payment_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'broker_transfer'
    payment_method VARCHAR(50), -- 'm_pesa', 'airtel_money', 'bank_transfer', 'card', 'ussd'
    amount NUMERIC(20,2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- 'KES', 'NGN', 'ZAR', 'USD', 'GHS', 'EGP'
    amount_usd NUMERIC(20,2), -- Converted to USD for reporting
    gateway_provider VARCHAR(50), -- 'paystack', 'flutterwave', 'dlocal', 'mpesa_direct'
    gateway_reference VARCHAR(200), -- Provider's transaction ID
    gateway_fee NUMERIC(20,2),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    failure_reason TEXT,
    user_bank_account VARCHAR(200), -- For bank transfers
    user_mobile_number VARCHAR(50), -- For mobile money (M-Pesa, Airtel)
    user_wallet_address VARCHAR(200), -- For crypto (future)
    initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    callback_data JSONB, -- Raw webhook data from payment gateway
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON raw_data.payment_transactions(user_id, initiated_at DESC);
CREATE INDEX idx_payments_status ON raw_data.payment_transactions(status);
CREATE INDEX idx_payments_gateway ON raw_data.payment_transactions(gateway_provider, gateway_reference);

COMMENT ON TABLE raw_data.payment_transactions IS 'Deposits/withdrawals via Paystack, Flutterwave, M-Pesa';

-- =====================================================================
-- SECTION 6: PAPER TRADING ACCOUNTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.paper_trading_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL UNIQUE,
    starting_capital NUMERIC(20,2) DEFAULT 100000.00, -- Virtual cash at start
    current_cash NUMERIC(20,2) DEFAULT 100000.00, -- Current virtual cash
    total_portfolio_value NUMERIC(20,2), -- Cash + holdings value
    total_pnl NUMERIC(20,2), -- Total profit/loss
    total_pnl_pct NUMERIC(8,4), -- % return
    trades_count INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    win_rate NUMERIC(5,4), -- % of winning trades
    sharpe_ratio NUMERIC(8,4),
    max_drawdown NUMERIC(8,4), -- Worst peak-to-trough decline
    longest_winning_streak INTEGER DEFAULT 0,
    longest_losing_streak INTEGER DEFAULT 0,
    avg_trade_return NUMERIC(8,4),
    largest_win NUMERIC(20,2),
    largest_loss NUMERIC(20,2),
    risk_score NUMERIC(5,2), -- 0-100 (100 = very risky)
    leaderboard_rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paper_accounts_user ON raw_data.paper_trading_accounts(user_id);
CREATE INDEX idx_paper_accounts_leaderboard ON raw_data.paper_trading_accounts(total_pnl_pct DESC NULLS LAST, created_at);

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

CREATE INDEX idx_paper_trades_account ON raw_data.paper_trades(account_id, executed_at DESC);
CREATE INDEX idx_paper_trades_user ON raw_data.paper_trades(user_id, executed_at DESC);
CREATE INDEX idx_paper_trades_symbol ON raw_data.paper_trades(symbol);
CREATE INDEX idx_paper_trades_recommendation ON raw_data.paper_trades(recommendation_id);

COMMENT ON TABLE raw_data.paper_trades IS 'Simulated trades using real market prices';

-- =====================================================================
-- SECTION 8: CURRENCY EXCHANGE RATES
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.currency_exchange_rates (
    rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(10) NOT NULL, -- 'USD'
    quote_currency VARCHAR(10) NOT NULL, -- 'NGN', 'KES', 'ZAR', 'GHS', 'EGP'
    exchange_rate NUMERIC(20,8) NOT NULL, -- 1 USD = X NGN
    rate_timestamp TIMESTAMPTZ NOT NULL,
    source VARCHAR(100), -- 'Central Bank of Nigeria', 'XE.com', 'OANDA', 'Fixer.io'
    bid_rate NUMERIC(20,8),
    ask_rate NUMERIC(20,8),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(base_currency, quote_currency, rate_timestamp)
);

CREATE INDEX idx_fx_rates_pair ON raw_data.currency_exchange_rates(base_currency, quote_currency, rate_timestamp DESC);

COMMENT ON TABLE raw_data.currency_exchange_rates IS 'FX rates for African currencies (NGN, KES, ZAR, GHS, EGP) vs USD';

-- =====================================================================
-- SECTION 9: SAMPLE DATA - AFRICAN STOCKS
-- =====================================================================

INSERT INTO raw_data.african_price_feeds 
(source_name, exchange, asset_symbol, asset_name, sector, price_timestamp, open_price, high_price, low_price, close_price, volume, currency, market_cap, pe_ratio, data_quality_score)
VALUES
-- Nigerian Exchange (NGX)
('Mansa API', 'NGX', 'DANGCEM', 'Dangote Cement', 'Materials', CURRENT_TIMESTAMP - INTERVAL '1 hour', 285.00, 287.50, 283.50, 285.50, 1250000, 'NGN', 4800000000, 8.5, 0.98),
('Mansa API', 'NGX', 'GTCO', 'Guaranty Trust Holding Company', 'Banking', CURRENT_TIMESTAMP - INTERVAL '1 hour', 32.50, 33.20, 32.30, 32.80, 3500000, 'NGN', 950000000, 6.2, 0.97),
('Mansa API', 'NGX', 'MTNN', 'MTN Nigeria', 'Telecom', CURRENT_TIMESTAMP - INTERVAL '1 hour', 198.00, 201.50, 197.50, 200.00, 850000, 'NGN', 4100000000, 9.8, 0.96),

-- Johannesburg Stock Exchange (JSE)
('Mansa API', 'JSE', 'AGL', 'Anglo American', 'Mining', CURRENT_TIMESTAMP - INTERVAL '1 hour', 425.00, 428.50, 423.00, 425.50, 2100000, 'ZAR', 580000000, 7.3, 0.99),
('Mansa API', 'JSE', 'SBK', 'Standard Bank', 'Banking', CURRENT_TIMESTAMP - INTERVAL '1 hour', 142.50, 144.20, 141.80, 143.50, 1850000, 'ZAR', 230000000, 8.9, 0.98),
('Mansa API', 'JSE', 'SOL', 'Sasol', 'Energy', CURRENT_TIMESTAMP - INTERVAL '1 hour', 285.00, 288.50, 283.00, 286.50, 1350000, 'ZAR', 180000000, 11.2, 0.97),

-- Nairobi Securities Exchange (NSE)
('African Markets API', 'NSE', 'SCOM', 'Safaricom', 'Telecom', CURRENT_TIMESTAMP - INTERVAL '1 hour', 18.50, 18.85, 18.40, 18.70, 8500000, 'KES', 750000000, 12.5, 0.96),
('African Markets API', 'NSE', 'EQTY', 'Equity Bank', 'Banking', CURRENT_TIMESTAMP - INTERVAL '1 hour', 48.50, 49.20, 48.00, 48.75, 1200000, 'KES', 185000000, 6.8, 0.95),
('African Markets API', 'NSE', 'EABL', 'East African Breweries', 'Consumer Goods', CURRENT_TIMESTAMP - INTERVAL '1 hour', 185.00, 187.50, 184.00, 186.50, 450000, 'KES', 145000000, 14.3, 0.94);

-- =====================================================================
-- SECTION 10: SAMPLE DATA - ALTERNATIVE DATA
-- =====================================================================

INSERT INTO raw_data.alternative_data
(data_source, data_type, region, asset_symbol, exchange, event_date, actor_name, actor_type, transaction_type, amount_min, amount_max, amount_currency, sentiment_signal, confidence_score)
VALUES
-- US Congressional Trades (Quiver Quantitative)
('Quiver', 'congress_trade', 'US', 'AAPL', 'NASDAQ', CURRENT_DATE - INTERVAL '7 days', 'Nancy Pelosi', 'politician', 'buy', 1000000, 5000000, 'USD', 'bullish', 0.85),
('Quiver', 'congress_trade', 'US', 'MSFT', 'NASDAQ', CURRENT_DATE - INTERVAL '10 days', 'Tommy Tuberville', 'politician', 'buy', 500000, 1000000, 'USD', 'bullish', 0.78),

-- African Custom Alternative Data
('Kenya_eTender', 'government_contract', 'Kenya', 'SCOM', 'NSE', CURRENT_DATE - INTERVAL '3 days', 'Kenya Government', 'government', 'contract_award', 500000000, 500000000, 'KES', 'bullish', 0.92),
('SA_Mining_Registry', 'mining_license', 'South_Africa', 'AGL', 'JSE', CURRENT_DATE - INTERVAL '15 days', 'South African DMR', 'mining_authority', 'license_grant', NULL, NULL, 'ZAR', 'bullish', 0.88);

-- =====================================================================
-- SECTION 11: SAMPLE DATA - PAPER TRADING
-- =====================================================================

-- Create sample paper trading account
INSERT INTO raw_data.paper_trading_accounts
(user_id, starting_capital, current_cash, total_portfolio_value, total_pnl, total_pnl_pct, trades_count, winning_trades, losing_trades, win_rate, sharpe_ratio)
VALUES
('demo_user_001', 100000.00, 95000.00, 107500.00, 7500.00, 0.075, 12, 8, 4, 0.6667, 1.45);

-- Sample paper trades
INSERT INTO raw_data.paper_trades
(account_id, user_id, symbol, asset_name, exchange, side, quantity, price, total_value, currency, pnl, pnl_pct, is_closed, executed_at)
VALUES
((SELECT account_id FROM raw_data.paper_trading_accounts WHERE user_id = 'demo_user_001'), 
 'demo_user_001', 'DANGCEM', 'Dangote Cement', 'NGX', 'buy', 100, 270.00, 27000.00, 'NGN', 1550.00, 0.0574, TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
 
((SELECT account_id FROM raw_data.paper_trading_accounts WHERE user_id = 'demo_user_001'), 
 'demo_user_001', 'SCOM', 'Safaricom', 'NSE', 'buy', 500, 18.20, 9100.00, 'KES', 250.00, 0.0275, TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- =====================================================================
-- SECTION 12: SAMPLE DATA - CURRENCY RATES
-- =====================================================================

INSERT INTO raw_data.currency_exchange_rates
(base_currency, quote_currency, exchange_rate, rate_timestamp, source, bid_rate, ask_rate)
VALUES
('USD', 'NGN', 1580.50, CURRENT_TIMESTAMP, 'Central Bank of Nigeria', 1578.00, 1583.00),
('USD', 'KES', 144.75, CURRENT_TIMESTAMP, 'Central Bank of Kenya', 144.50, 145.00),
('USD', 'ZAR', 18.45, CURRENT_TIMESTAMP, 'South African Reserve Bank', 18.42, 18.48),
('USD', 'GHS', 16.20, CURRENT_TIMESTAMP, 'Bank of Ghana', 16.15, 16.25),
('USD', 'EGP', 49.35, CURRENT_TIMESTAMP, 'Central Bank of Egypt', 49.20, 49.50);

-- =====================================================================
-- VERIFICATION QUERIES
-- =====================================================================

\echo 'African Market Tables Created Successfully!'
\echo ''
\echo 'Table Counts:'
SELECT 'african_price_feeds' as table_name, COUNT(*) as row_count FROM raw_data.african_price_feeds
UNION ALL SELECT 'alternative_data', COUNT(*) FROM raw_data.alternative_data
UNION ALL SELECT 'paper_trading_accounts', COUNT(*) FROM raw_data.paper_trading_accounts
UNION ALL SELECT 'paper_trades', COUNT(*) FROM raw_data.paper_trades
UNION ALL SELECT 'currency_exchange_rates', COUNT(*) FROM raw_data.currency_exchange_rates;

\echo ''
\echo 'Sample African Stocks:'
SELECT exchange, asset_symbol, asset_name, close_price, currency 
FROM raw_data.african_price_feeds 
ORDER BY exchange, asset_symbol 
LIMIT 10;
