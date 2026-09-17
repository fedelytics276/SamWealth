{{
  config(
    materialized='view',
    tags=['staging', 'ml', 'feedback']
  )
}}

-- Staging: Model feedback events for learning metrics

select
    feedback_id,
    model_version_id,
    feedback_type,
    feedback_timestamp,
    was_incorporated,
    incorporation_timestamp,
    feedback_details
from {{ source('raw_feeds', 'model_feedback') }}
where feedback_timestamp >= current_date - interval '180 days'
