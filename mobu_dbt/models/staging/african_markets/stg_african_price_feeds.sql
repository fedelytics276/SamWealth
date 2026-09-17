{{
  config(
    materialized='view',
    tags=['staging', 'african_markets', 'price_feed']
  )
}}

-- Staging: African stock price data from NGX, JSE, NSE, EGX, GSE, BRVM
-- Validates and standardizes data from Mansa API and African Markets API

with source_data as (
    select
        feed_id,
        source_name,
        exchange,
        asset_symbol,
        asset_name,
        sector,
        price_timestamp,
        open_price,
        high_price,
        low_price,
        close_price,
        volume,
        currency,
        market_cap,
        pe_ratio,
        data_quality_score,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'african_price_feeds') }}
    where price_timestamp >= current_date - interval '90 days'
),

validated as (
    select
        feed_id,
        source_name,
        exchange,
        asset_symbol,
        asset_name,
        sector,
        price_timestamp,
        -- Data quality validations
        case 
            when open_price > 0 and high_price >= open_price and low_price <= close_price
            then open_price
            else null
        end as open_price,
        case 
            when high_price >= greatest(coalesce(open_price, 0), close_price, coalesce(low_price, 0))
            then high_price
            else null
        end as high_price,
        case 
            when low_price <= least(coalesce(open_price, 999999), close_price, coalesce(high_price, 999999))
            then low_price
            else null
        end as low_price,
        close_price,
        volume,
        currency,
        market_cap,
        pe_ratio,
        data_quality_score,
        ingested_at,
        created_at,
        -- Lineage metadata
        'african_price_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where close_price is not null
      and close_price > 0
      and data_quality_score >= 0.90  -- Slightly lower threshold for emerging markets
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by exchange, asset_symbol, price_timestamp, source_name
                order by data_quality_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    feed_id,
    source_name,
    exchange,
    asset_symbol,
    asset_name,
    sector,
    price_timestamp,
    open_price,
    high_price,
    low_price,
    close_price,
    volume,
    currency,
    market_cap,
    pe_ratio,
    data_quality_score,
    feed_type,
    ingested_at,
    processed_at,
    created_at
from deduplicated
