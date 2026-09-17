{{
  config(
    materialized='view',
    tags=['staging', 'onchain_feed']
  )
}}

-- Staging: Raw on-chain data (wallet flows, smart contract events, DeFi metrics)
-- Validates blockchain data, standardizes formats across chains
-- Part of Data Feed Lineage Layer

with source_data as (
    select
        feed_id,
        source_name,
        blockchain,
        asset_id,
        asset_symbol,
        event_timestamp,
        event_type,
        transaction_hash,
        wallet_address,
        contract_address,
        token_flow_amount,
        token_flow_direction,
        gas_used,
        network_congestion_score,
        data_quality_score,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'onchain_data_raw') }}
    where event_timestamp >= current_date - interval '90 days'
),

validated as (
    select
        feed_id,
        source_name,
        blockchain,
        asset_id,
        asset_symbol,
        event_timestamp,
        event_type,
        transaction_hash,
        wallet_address,
        contract_address,
        -- Validate amounts
        case 
            when token_flow_amount >= 0 
            then token_flow_amount
            else null
        end as token_flow_amount,
        token_flow_direction,
        gas_used,
        network_congestion_score,
        data_quality_score,
        ingested_at,
        created_at,
        -- Lineage metadata
        'onchain_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where transaction_hash is not null
      and data_quality_score >= 0.90
      and event_type in ('transfer', 'swap', 'stake', 'unstake', 'mint', 'burn')
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by transaction_hash, event_type
                order by data_quality_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    feed_id,
    source_name,
    blockchain,
    asset_id,
    asset_symbol,
    event_timestamp,
    event_type,
    transaction_hash,
    wallet_address,
    contract_address,
    token_flow_amount,
    token_flow_direction,
    gas_used,
    network_congestion_score,
    data_quality_score,
    feed_type,
    ingested_at,
    processed_at,
    created_at
from deduplicated
