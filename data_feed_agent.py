#!/usr/bin/env python3
"""
MOBU Data Feed Agent
Fetches data from external sources and writes to PostgreSQL raw_data schema
dbt will then validate, transform, and create analytics marts
"""

import os
import sys
import time
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import uuid4

import psycopg2
from psycopg2.extras import execute_values
from psycopg2 import pool

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('data_feed_agent')

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME', 'mobu_dev'),
    'user': os.getenv('DB_USER', 'mobu_user'),
    'password': os.getenv('DB_PASSWORD', os.getenv('MOBU_DB_PASSWORD', 'mobu_dev_2024'))
}

# Connection pool
connection_pool = None


def init_connection_pool():
    """Initialize PostgreSQL connection pool"""
    global connection_pool
    try:
        connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            **DB_CONFIG
        )
        logger.info("✅ Database connection pool initialized")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize connection pool: {e}")
        return False


def get_connection():
    """Get connection from pool"""
    if connection_pool:
        return connection_pool.getconn()
    return None


def return_connection(conn):
    """Return connection to pool"""
    if connection_pool and conn:
        connection_pool.putconn(conn)


def close_connection_pool():
    """Close all connections in pool"""
    if connection_pool:
        connection_pool.closeall()
        logger.info("Database connection pool closed")


# ============================================================================
# FEED FETCHERS (Simulated - Replace with real API calls)
# ============================================================================

def fetch_price_data() -> List[Dict]:
    """
    Fetch price data from external sources (Bloomberg, Refinitiv, exchanges)
    TODO: Replace with real API calls
    """
    logger.info("Fetching price data...")
    
    # Simulated data - replace with actual API calls
    now = datetime.now(timezone.utc)
    
    return [
        {
            'source_name': 'Bloomberg',
            'asset_id': 'AAPL',
            'asset_symbol': 'AAPL',
            'price_timestamp': now,
            'open_price': 174.50,
            'high_price': 176.20,
            'low_price': 173.80,
            'close_price': 175.50,
            'volume': 52340000,
            'currency': 'USD',
            'exchange': 'NASDAQ',
            'data_quality_score': 0.99
        },
        {
            'source_name': 'Bloomberg',
            'asset_id': 'MSFT',
            'asset_symbol': 'MSFT',
            'price_timestamp': now,
            'open_price': 415.30,
            'high_price': 418.90,
            'low_price': 414.20,
            'close_price': 417.80,
            'volume': 21560000,
            'currency': 'USD',
            'exchange': 'NASDAQ',
            'data_quality_score': 0.99
        },
        {
            'source_name': 'Coinbase',
            'asset_id': 'BTC-USD',
            'asset_symbol': 'BTC',
            'price_timestamp': now,
            'open_price': 62450.00,
            'high_price': 62780.00,
            'low_price': 62200.00,
            'close_price': 62550.00,
            'volume': 1250.5,
            'currency': 'USD',
            'exchange': 'Coinbase',
            'data_quality_score': 0.97
        }
    ]


def fetch_onchain_data() -> List[Dict]:
    """
    Fetch on-chain data from blockchain networks
    TODO: Replace with real blockchain API calls (Etherscan, Alchemy, etc.)
    """
    logger.info("Fetching on-chain data...")
    
    now = datetime.now(timezone.utc)
    
    return [
        {
            'source_name': 'Etherscan',
            'blockchain': 'Ethereum',
            'asset_id': 'ETH',
            'asset_symbol': 'ETH',
            'event_timestamp': now,
            'event_type': 'transfer',
            'transaction_hash': f'0x{uuid4().hex}',
            'wallet_address': f'0x{uuid4().hex[:40]}',
            'contract_address': None,
            'token_flow_amount': 15.5,
            'token_flow_direction': 'outflow',
            'gas_used': 21000,
            'network_congestion_score': 0.65,
            'data_quality_score': 0.95
        }
    ]


def fetch_news_data() -> List[Dict]:
    """
    Fetch news and sentiment data
    TODO: Replace with real news API calls (NewsAPI, Reuters, Bloomberg Terminal)
    """
    logger.info("Fetching news data...")
    
    now = datetime.now(timezone.utc)
    
    return [
        {
            'source_name': 'Reuters',
            'article_id': f'reuters-{uuid4().hex[:8]}',
            'article_url': 'https://reuters.com/article/example',
            'published_timestamp': now,
            'headline': 'Tech stocks rally on positive earnings',
            'content_snippet': 'Major tech companies reported strong quarterly earnings...',
            'asset_ids': ['AAPL', 'MSFT', 'GOOGL'],
            'asset_symbols': ['AAPL', 'MSFT', 'GOOGL'],
            'sentiment_score': 0.75,
            'sentiment_label': 'positive',
            'confidence_score': 0.88,
            'entity_mentions': json.dumps({'companies': ['Apple', 'Microsoft', 'Google']}),
            'topic_tags': ['earnings', 'technology', 'stocks'],
            'data_quality_score': 0.92
        }
    ]


def fetch_macro_data() -> List[Dict]:
    """
    Fetch macroeconomic indicators
    TODO: Replace with real API calls (FRED, BLS, ECB APIs)
    """
    logger.info("Fetching macro data...")
    
    now = datetime.now(timezone.utc)
    
    return [
        {
            'source_name': 'FRED',
            'indicator_id': 'DGS3MO',
            'indicator_name': '3-Month Treasury Rate',
            'indicator_type': 'interest_rate',
            'indicator_timestamp': now,
            'indicator_value': 5.25,
            'unit_of_measure': 'percent',
            'country_code': 'US',
            'release_frequency': 'daily',
            'revision_flag': False,
            'data_quality_score': 1.0
        }
    ]


# ============================================================================
# DATA WRITERS (Insert into raw_data schema)
# ============================================================================

def write_price_data(conn, data: List[Dict]) -> int:
    """Write price data to raw_data.price_data_raw"""
    if not data:
        return 0
    
    cursor = conn.cursor()
    
    query = """
        INSERT INTO raw_data.price_data_raw 
        (source_name, asset_id, asset_symbol, price_timestamp, open_price, high_price, 
         low_price, close_price, volume, currency, exchange, data_quality_score)
        VALUES %s
        ON CONFLICT (feed_id) DO NOTHING
    """
    
    values = [
        (
            d['source_name'], d['asset_id'], d['asset_symbol'], d['price_timestamp'],
            d['open_price'], d['high_price'], d['low_price'], d['close_price'],
            d['volume'], d['currency'], d['exchange'], d['data_quality_score']
        )
        for d in data
    ]
    
    execute_values(cursor, query, values)
    count = cursor.rowcount
    conn.commit()
    cursor.close()
    
    logger.info(f"✅ Inserted {count} price records")
    return count


def write_onchain_data(conn, data: List[Dict]) -> int:
    """Write on-chain data to raw_data.onchain_data_raw"""
    if not data:
        return 0
    
    cursor = conn.cursor()
    
    query = """
        INSERT INTO raw_data.onchain_data_raw
        (source_name, blockchain, asset_id, asset_symbol, event_timestamp, event_type,
         transaction_hash, wallet_address, contract_address, token_flow_amount,
         token_flow_direction, gas_used, network_congestion_score, data_quality_score)
        VALUES %s
        ON CONFLICT (feed_id) DO NOTHING
    """
    
    values = [
        (
            d['source_name'], d['blockchain'], d['asset_id'], d['asset_symbol'],
            d['event_timestamp'], d['event_type'], d['transaction_hash'],
            d['wallet_address'], d['contract_address'], d['token_flow_amount'],
            d['token_flow_direction'], d['gas_used'], d['network_congestion_score'],
            d['data_quality_score']
        )
        for d in data
    ]
    
    execute_values(cursor, query, values)
    count = cursor.rowcount
    conn.commit()
    cursor.close()
    
    logger.info(f"✅ Inserted {count} on-chain records")
    return count


def write_news_data(conn, data: List[Dict]) -> int:
    """Write news data to raw_data.news_data_raw"""
    if not data:
        return 0
    
    cursor = conn.cursor()
    
    query = """
        INSERT INTO raw_data.news_data_raw
        (source_name, article_id, article_url, published_timestamp, headline,
         content_snippet, asset_ids, asset_symbols, sentiment_score, sentiment_label,
         confidence_score, entity_mentions, topic_tags, data_quality_score)
        VALUES %s
        ON CONFLICT (feed_id) DO NOTHING
    """
    
    values = [
        (
            d['source_name'], d['article_id'], d['article_url'], d['published_timestamp'],
            d['headline'], d['content_snippet'], d['asset_ids'], d['asset_symbols'],
            d['sentiment_score'], d['sentiment_label'], d['confidence_score'],
            d['entity_mentions'], d['topic_tags'], d['data_quality_score']
        )
        for d in data
    ]
    
    execute_values(cursor, query, values)
    count = cursor.rowcount
    conn.commit()
    cursor.close()
    
    logger.info(f"✅ Inserted {count} news records")
    return count


def write_macro_data(conn, data: List[Dict]) -> int:
    """Write macro data to raw_data.macro_data_raw"""
    if not data:
        return 0
    
    cursor = conn.cursor()
    
    query = """
        INSERT INTO raw_data.macro_data_raw
        (source_name, indicator_id, indicator_name, indicator_type, indicator_timestamp,
         indicator_value, unit_of_measure, country_code, release_frequency,
         revision_flag, data_quality_score)
        VALUES %s
        ON CONFLICT (feed_id) DO NOTHING
    """
    
    values = [
        (
            d['source_name'], d['indicator_id'], d['indicator_name'], d['indicator_type'],
            d['indicator_timestamp'], d['indicator_value'], d['unit_of_measure'],
            d['country_code'], d['release_frequency'], d['revision_flag'],
            d['data_quality_score']
        )
        for d in data
    ]
    
    execute_values(cursor, query, values)
    count = cursor.rowcount
    conn.commit()
    cursor.close()
    
    logger.info(f"✅ Inserted {count} macro records")
    return count


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def run_feed_cycle():
    """Run one cycle of data fetching and writing"""
    logger.info("=" * 60)
    logger.info("Starting data feed cycle...")
    
    conn = get_connection()
    if not conn:
        logger.error("❌ Failed to get database connection")
        return False
    
    try:
        # Fetch data from all sources
        price_data = fetch_price_data()
        onchain_data = fetch_onchain_data()
        news_data = fetch_news_data()
        macro_data = fetch_macro_data()
        
        # Write to database
        price_count = write_price_data(conn, price_data)
        onchain_count = write_onchain_data(conn, onchain_data)
        news_count = write_news_data(conn, news_data)
        macro_count = write_macro_data(conn, macro_data)
        
        total_records = price_count + onchain_count + news_count + macro_count
        logger.info(f"✅ Feed cycle complete: {total_records} total records inserted")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Feed cycle error: {e}", exc_info=True)
        conn.rollback()
        return False
        
    finally:
        return_connection(conn)


def main():
    """Main entry point"""
    logger.info("🚀 MOBU Data Feed Agent starting...")
    
    # Initialize connection pool
    if not init_connection_pool():
        logger.error("Failed to initialize database connection")
        sys.exit(1)
    
    try:
        # Run mode: single run or continuous
        mode = os.getenv('FEED_MODE', 'single')  # 'single' or 'continuous'
        interval = int(os.getenv('FEED_INTERVAL', '300'))  # 5 minutes default
        
        if mode == 'continuous':
            logger.info(f"Running in continuous mode (interval: {interval}s)")
            while True:
                run_feed_cycle()
                logger.info(f"Sleeping for {interval} seconds...")
                time.sleep(interval)
        else:
            logger.info("Running in single-run mode")
            run_feed_cycle()
            logger.info("✅ Single run complete")
            
    except KeyboardInterrupt:
        logger.info("\n🛑 Received interrupt signal, shutting down...")
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}", exc_info=True)
        sys.exit(1)
    finally:
        close_connection_pool()
        logger.info("👋 Data Feed Agent stopped")


if __name__ == '__main__':
    main()
