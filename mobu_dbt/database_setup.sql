-- MOBU Database Setup Script
-- Creates schemas and raw data tables for dbt integration

\c mobu_dev;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS raw_data;
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS intermediate;
CREATE SCHEMA IF NOT EXISTS marts;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Price Data Raw Table
CREATE TABLE IF NOT EXISTS raw_data.price_data_raw (
    feed_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL,
    asset_id VARCHAR(50) NOT NULL,
    asset_symbol VARCHAR(20) NOT NULL,
    price_timestamp TIMESTAMPTZ NOT NULL,
    open_price NUMERIC(20,8),
    high_price NUMERIC(20,8),
    low_price NUMERIC(20,8),
    close_price NUMERIC(20,8) NOT NULL,
    volume NUMERIC(30,8),
    currency VARCHAR(10) DEFAULT 'USD',
    exchange VARCHAR(50),
    data_quality_score NUMERIC(5,4) DEFAULT 1.0,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_price_raw_asset_time ON raw_data.price_data_raw(asset_id, price_timestamp DESC);

-- Insert sample data
INSERT INTO raw_data.price_data_raw 
(source_name, asset_id, asset_symbol, price_timestamp, open_price, high_price, low_price, close_price, volume, exchange, data_quality_score)
VALUES
('Bloomberg', 'AAPL', 'AAPL', CURRENT_TIMESTAMP - INTERVAL '1 day', 174.50, 176.20, 173.80, 175.50, 52340000, 'NASDAQ', 0.99)
ON CONFLICT DO NOTHING;

\echo 'Basic setup complete! Run full setup with psql -d mobu_dev -f database_setup_full.sql'
