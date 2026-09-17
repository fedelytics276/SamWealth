{{
  config(
    materialized='view',
    tags=['staging', 'macro_feed', 'economics']
  )
}}

-- Staging: Raw macroeconomic data (Fed rates, CPI, unemployment, etc.)
-- Validates economic indicators from official sources
-- Part of Data Feed Lineage Layer

with source_data as (
    select
        feed_id,
        source_name,
        indicator_id,
        indicator_name,
        indicator_type,
        indicator_timestamp,
        indicator_value,
        unit_of_measure,
        country_code,
        release_frequency,
        revision_flag,
        data_quality_score,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'macro_data_raw') }}
    where indicator_timestamp >= current_date - interval '365 days'
),

validated as (
    select
        feed_id,
        source_name,
        indicator_id,
        indicator_name,
        indicator_type,
        indicator_timestamp,
        indicator_value,
        unit_of_measure,
        country_code,
        release_frequency,
        revision_flag,
        data_quality_score,
        ingested_at,
        created_at,
        -- Lineage metadata
        'macro_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where indicator_value is not null
      and indicator_name is not null
      and data_quality_score >= 0.98  -- High quality requirement for macro data
      and source_name in ('FRED', 'BLS', 'BEA', 'ECB', 'IMF', 'World Bank')
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by indicator_id, indicator_timestamp, country_code
                order by revision_flag desc, data_quality_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    feed_id,
    source_name,
    indicator_id,
    indicator_name,
    indicator_type,
    indicator_timestamp,
    indicator_value,
    unit_of_measure,
    country_code,
    release_frequency,
    revision_flag,
    data_quality_score,
    feed_type,
    ingested_at,
    processed_at,
    created_at
from deduplicated
