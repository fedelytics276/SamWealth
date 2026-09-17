{{
  config(
    materialized='view',
    tags=['staging', 'price_feed']
  )
}}

-- Staging: Raw price data from multiple sources (Bloomberg, Refinitiv, exchanges)
-- Validates schema, removes duplicates, standardizes formats
-- Part of Data Feed Lineage Layer

with source_data as (
    select
        feed_id,
        source_name,
        asset_id,
        asset_symbol,
        price_timestamp,
        open_price,
        high_price,
        low_price,
        close_price,
        volume,
        currency,
        exchange,
        data_quality_score,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'price_data_raw') }}
    where price_timestamp >= current_date - interval '90 days'
),

validated as (
    select
        feed_id,
        source_name,
        asset_id,
        asset_symbol,
        price_timestamp,
        -- Data quality validations
        case 
            when open_price > 0 and high_price >= open_price and low_price <= close_price
            then open_price
            else null
        end as open_price,
        case 
            when high_price >= greatest(open_price, close_price, low_price)
            then high_price
            else null
        end as high_price,
        case 
            when low_price <= least(open_price, close_price, high_price)
            then low_price
            else null
        end as low_price,
        close_price,
        volume,
        currency,
        exchange,
        data_quality_score,
        ingested_at,
        created_at,
        -- Lineage metadata
        'price_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where close_price is not null
      and close_price > 0
      and data_quality_score >= 0.95
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by asset_id, price_timestamp, source_name
                order by data_quality_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    feed_id,
    source_name,
    asset_id,
    asset_symbol,
    price_timestamp,
    open_price,
    high_price,
    low_price,
    close_price,
    volume,
    currency,
    exchange,
    data_quality_score,
    feed_type,
    ingested_at,
    processed_at,
    created_at
from deduplicated
