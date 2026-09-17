-- MOBU Holdings & Portfolio Tables Setup
-- Creates diverse user profiles with varying portfolios for realistic demo
-- Version: 1.0.0
-- Date: 2026-09-12

\c mobu_dev;

-- =====================================================================
-- SECTION 1: USER ACCOUNTS & HOLDINGS TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.user_accounts (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    username VARCHAR(100),
    account_type VARCHAR(20) DEFAULT 'standard',
    balance NUMERIC(20,2) DEFAULT 0.00,
    initial_deposit NUMERIC(20,2) DEFAULT 0.00,
    total_deposited NUMERIC(20,2) DEFAULT 0.00,
    total_withdrawn NUMERIC(20,2) DEFAULT 0.00,
    account_status VARCHAR(20) DEFAULT 'active',
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON raw_data.user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_status ON raw_data.user_accounts(account_status);

CREATE TABLE IF NOT EXISTS raw_data.user_holdings (
    holding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) REFERENCES raw_data.user_accounts(user_id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    asset_name VARCHAR(200),
    exchange VARCHAR(20) NOT NULL,
    quantity NUMERIC(20,8) NOT NULL,
    avg_cost_basis NUMERIC(20,8) NOT NULL,
    total_cost NUMERIC(20,2),
    first_purchased_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, symbol, exchange)
);

CREATE INDEX IF NOT EXISTS idx_user_holdings_user ON raw_data.user_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_holdings_symbol ON raw_data.user_holdings(symbol, exchange);

-- =====================================================================
-- SECTION 2: DIVERSE USER PROFILES (5 users with varying strategies)
-- =====================================================================

-- USER 1: Conservative Investor (Sarah) - Blue-chip stocks, $100k portfolio
INSERT INTO raw_data.user_accounts (user_id, email, username, balance, initial_deposit, total_deposited, kyc_verified, created_at)
VALUES ('user_001', 'sarah.conservative@mobu.app', 'SarahK', 8250.00, 100000.00, 100000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '180 days')
ON CONFLICT (user_id) DO UPDATE SET balance = 8250.00, initial_deposit = 100000.00;

INSERT INTO raw_data.user_holdings (user_id, symbol, asset_name, exchange, quantity, avg_cost_basis, total_cost, first_purchased_at) VALUES
('user_001', 'AAPL', 'Apple Inc.', 'NASDAQ', 50, 168.50, 8425.00, CURRENT_TIMESTAMP - INTERVAL '150 days'),
('user_001', 'MSFT', 'Microsoft', 'NASDAQ', 60, 380.00, 22800.00, CURRENT_TIMESTAMP - INTERVAL '140 days'),
('user_001', 'JNJ', 'Johnson & Johnson', 'NYSE', 100, 160.00, 16000.00, CURRENT_TIMESTAMP - INTERVAL '120 days'),
('user_001', 'DANGCEM', 'Dangote Cement', 'NGX', 80, 275.00, 22000.00, CURRENT_TIMESTAMP - INTERVAL '90 days'),
('user_001', 'MTN', 'MTN Group', 'JSE', 200, 110.50, 22100.00, CURRENT_TIMESTAMP - INTERVAL '60 days')
ON CONFLICT (user_id, symbol, exchange) DO NOTHING;

INSERT INTO raw_data.paper_trading_accounts (user_id, starting_capital, current_cash, trades_count, win_rate, created_at)
VALUES ('user_001', 100000.00, 8250.00, 25, 0.72, CURRENT_TIMESTAMP - INTERVAL '180 days')
ON CONFLICT (user_id) DO UPDATE SET current_cash = 8250.00;

-- USER 2: Aggressive Growth (James) - Tech-heavy, $50k portfolio
INSERT INTO raw_data.user_accounts (user_id, email, username, balance, initial_deposit, total_deposited, kyc_verified, created_at)
VALUES ('user_002', 'james.growth@mobu.app', 'JamesR', 2150.50, 50000.00, 50000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '90 days')
ON CONFLICT (user_id) DO UPDATE SET balance = 2150.50, initial_deposit = 50000.00;

INSERT INTO raw_data.user_holdings (user_id, symbol, asset_name, exchange, quantity, avg_cost_basis, total_cost, first_purchased_at) VALUES
('user_002', 'TSLA', 'Tesla', 'NASDAQ', 40, 240.00, 9600.00, CURRENT_TIMESTAMP - INTERVAL '75 days'),
('user_002', 'NVDA', 'NVIDIA', 'NASDAQ', 30, 450.00, 13500.00, CURRENT_TIMESTAMP - INTERVAL '60 days'),
('user_002', 'SCOM', 'Safaricom', 'NSE', 5000, 3.50, 17500.00, CURRENT_TIMESTAMP - INTERVAL '45 days'),
('user_002', 'AIRTEL', 'Airtel Africa', 'NSE', 3000, 2.20, 6600.00, CURRENT_TIMESTAMP - INTERVAL '30 days')
ON CONFLICT (user_id, symbol, exchange) DO NOTHING;

INSERT INTO raw_data.paper_trading_accounts (user_id, starting_capital, current_cash, trades_count, win_rate, created_at)
VALUES ('user_002', 50000.00, 2150.50, 42, 0.64, CURRENT_TIMESTAMP - INTERVAL '90 days')
ON CONFLICT (user_id) DO UPDATE SET current_cash = 2150.50;

-- USER 3: Balanced African-focused (Amina) - $75k portfolio
INSERT INTO raw_data.user_accounts (user_id, email, username, balance, initial_deposit, total_deposited, kyc_verified, created_at)
VALUES ('user_003', 'amina.balanced@mobu.app', 'AminaM', 15600.00, 75000.00, 75000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '120 days')
ON CONFLICT (user_id) DO UPDATE SET balance = 15600.00, initial_deposit = 75000.00;

INSERT INTO raw_data.user_holdings (user_id, symbol, asset_name, exchange, quantity, avg_cost_basis, total_cost, first_purchased_at) VALUES
('user_003', 'NPN', 'Naspers', 'JSE', 15, 3200.00, 48000.00, CURRENT_TIMESTAMP - INTERVAL '110 days'),
('user_003', 'ZENITHBANK', 'Zenith Bank', 'NGX', 1000, 28.50, 28500.00, CURRENT_TIMESTAMP - INTERVAL '95 days'),
('user_003', 'EQBNK', 'Equity Bank', 'NSE', 2000, 4.80, 9600.00, CURRENT_TIMESTAMP - INTERVAL '80 days'),
('user_003', 'AGL', 'Anglo American', 'JSE', 50, 425.00, 21250.00, CURRENT_TIMESTAMP - INTERVAL '60 days')
ON CONFLICT (user_id, symbol, exchange) DO NOTHING;

INSERT INTO raw_data.paper_trading_accounts (user_id, starting_capital, current_cash, trades_count, win_rate, created_at)
VALUES ('user_003', 75000.00, 15600.00, 18, 0.78, CURRENT_TIMESTAMP - INTERVAL '120 days')
ON CONFLICT (user_id) DO UPDATE SET current_cash = 15600.00;

-- USER 4: Beginner (Kofi) - Small $5k starter portfolio
INSERT INTO raw_data.user_accounts (user_id, email, username, balance, initial_deposit, total_deposited, kyc_verified, created_at)
VALUES ('user_004', 'kofi.starter@mobu.app', 'KofiG', 750.00, 5000.00, 5000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days')
ON CONFLICT (user_id) DO UPDATE SET balance = 750.00, initial_deposit = 5000.00;

INSERT INTO raw_data.user_holdings (user_id, symbol, asset_name, exchange, quantity, avg_cost_basis, total_cost, first_purchased_at) VALUES
('user_004', 'AAPL', 'Apple Inc.', 'NASDAQ', 5, 172.00, 860.00, CURRENT_TIMESTAMP - INTERVAL '25 days'),
('user_004', 'DANGCEM', 'Dangote Cement', 'NGX', 10, 278.00, 2780.00, CURRENT_TIMESTAMP - INTERVAL '15 days'),
('user_004', 'SCOM', 'Safaricom', 'NSE', 300, 3.60, 1080.00, CURRENT_TIMESTAMP - INTERVAL '10 days')
ON CONFLICT (user_id, symbol, exchange) DO NOTHING;

INSERT INTO raw_data.paper_trading_accounts (user_id, starting_capital, current_cash, trades_count, win_rate, created_at)
VALUES ('user_004', 5000.00, 750.00, 8, 0.625, CURRENT_TIMESTAMP - INTERVAL '30 days')
ON CONFLICT (user_id) DO UPDATE SET current_cash = 750.00;

-- USER 5: Institutional (InvestCorp) - Large $500k portfolio
INSERT INTO raw_data.user_accounts (user_id, email, username, balance, initial_deposit, total_deposited, kyc_verified, created_at)
VALUES ('user_005', 'institutional@mobu.app', 'InvestCorp', 85000.00, 500000.00, 500000.00, TRUE, CURRENT_TIMESTAMP - INTERVAL '365 days')
ON CONFLICT (user_id) DO UPDATE SET balance = 85000.00, initial_deposit = 500000.00;

INSERT INTO raw_data.user_holdings (user_id, symbol, asset_name, exchange, quantity, avg_cost_basis, total_cost, first_purchased_at) VALUES
('user_005', 'AAPL', 'Apple Inc.', 'NASDAQ', 500, 165.00, 82500.00, CURRENT_TIMESTAMP - INTERVAL '350 days'),
('user_005', 'MSFT', 'Microsoft', 'NASDAQ', 400, 375.00, 150000.00, CURRENT_TIMESTAMP - INTERVAL '340 days'),
('user_005', 'GOOGL', 'Alphabet', 'NASDAQ', 200, 138.00, 27600.00, CURRENT_TIMESTAMP - INTERVAL '320 days'),
('user_005', 'NPN', 'Naspers', 'JSE', 50, 3150.00, 157500.00, CURRENT_TIMESTAMP - INTERVAL '300 days'),
('user_005', 'MTN', 'MTN Group', 'JSE', 1000, 108.00, 108000.00, CURRENT_TIMESTAMP - INTERVAL '280 days'),
('user_005', 'DANGCEM', 'Dangote Cement', 'NGX', 500, 270.00, 135000.00, CURRENT_TIMESTAMP - INTERVAL '250 days')
ON CONFLICT (user_id, symbol, exchange) DO NOTHING;

INSERT INTO raw_data.paper_trading_accounts (user_id, starting_capital, current_cash, trades_count, win_rate, created_at)
VALUES ('user_005', 500000.00, 85000.00, 156, 0.82, CURRENT_TIMESTAMP - INTERVAL '365 days')
ON CONFLICT (user_id) DO UPDATE SET current_cash = 85000.00;

-- =====================================================================
-- SECTION 3: API CACHE TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS raw_data.mansa_price_cache (
    cache_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    price NUMERIC(20,8) NOT NULL,
    change NUMERIC(20,8),
    change_pct NUMERIC(8,4),
    volume NUMERIC(30,8),
    market_status VARCHAR(20),
    cached_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    UNIQUE(symbol, exchange)
);

CREATE INDEX IF NOT EXISTS idx_mansa_cache_symbol ON raw_data.mansa_price_cache(symbol, exchange);

CREATE TABLE IF NOT EXISTS raw_data.quiver_data_cache (
    cache_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    UNIQUE(symbol, data_type)
);

-- =====================================================================
-- SECTION 4: SUMMARY
-- =====================================================================

SELECT 'Users Created' as metric, COUNT(*) as value FROM raw_data.user_accounts
UNION ALL
SELECT 'Total Holdings', COUNT(*) FROM raw_data.user_holdings
UNION ALL
SELECT 'Paper Accounts', COUNT(*) FROM raw_data.paper_trading_accounts;

\echo '✅ 5 diverse users created with varying portfolios!';
\echo 'User 1 (Sarah): Conservative, $100k, Blue-chip stocks';
\echo 'User 2 (James): Aggressive, $50k, Tech-heavy';
\echo 'User 3 (Amina): Balanced, $75k, African-focused';
\echo 'User 4 (Kofi): Beginner, $5k, Starter portfolio';
\echo 'User 5 (InvestCorp): Institutional, $500k, Diversified';
