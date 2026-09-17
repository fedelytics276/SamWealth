{{
  config(
    materialized='view',
    tags=['staging', 'recommendations']
  )
}}

-- Staging: Recommendation outcomes for accuracy tracking

select
    recommendation_id,
    asset_id,
    asset_symbol,
    recommended_action,
    recommended_at,
    executed_at,
    actual_outcome,
    predicted_outcome,
    prediction_confidence,
    reasoning
from {{ source('raw_feeds', 'recommendations') }}
where executed_at is not null
