{{
  config(
    materialized='view',
    tags=['staging', 'alternative_data', 'signals']
  )
}}

-- Staging: Alternative data from Quiver Quantitative (US) + custom African sources
-- Congressional trades, insider trades, government contracts, mining licenses

with source_data as (
    select
        record_id,
        data_source,
        data_type,
        region,
        asset_symbol,
        asset_name,
        exchange,
        event_date,
        actor_name,
        actor_type,
        transaction_type,
        amount_min,
        amount_max,
        amount_currency,
        sentiment_signal,
        confidence_score,
        metadata,
        raw_data,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'alternative_data') }}
    where event_date >= current_date - interval '365 days'
),

validated as (
    select
        record_id,
        data_source,
        data_type,
        region,
        asset_symbol,
        asset_name,
        exchange,
        event_date,
        actor_name,
        actor_type,
        transaction_type,
        amount_min,
        amount_max,
        amount_currency,
        sentiment_signal,
        -- Validate confidence score
        case 
            when confidence_score between 0 and 1 
            then confidence_score
            else 0.5  -- Default to neutral confidence
        end as confidence_score,
        metadata,
        raw_data,
        ingested_at,
        created_at,
        -- Lineage metadata
        'alternative_data' as data_category,
        current_timestamp as processed_at
    from source_data
    where event_date is not null
      and sentiment_signal in ('bullish', 'bearish', 'neutral')
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by data_source, data_type, asset_symbol, event_date, actor_name
                order by confidence_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    record_id,
    data_source,
    data_type,
    region,
    asset_symbol,
    asset_name,
    exchange,
    event_date,
    actor_name,
    actor_type,
    transaction_type,
    amount_min,
    amount_max,
    amount_currency,
    sentiment_signal,
    confidence_score,
    metadata,
    data_category,
    ingested_at,
    processed_at,
    created_at
from deduplicated
