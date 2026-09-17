{{
  config(
    materialized='view',
    tags=['staging', 'ml', 'models']
  )
}}

-- Staging: ML model versions for self-improvement tracking

select
    model_version_id,
    model_name,
    version_number,
    deployed_at,
    training_data_size,
    validation_accuracy,
    test_accuracy,
    hyperparameters,
    features_used,
    training_duration_seconds
from {{ source('raw_feeds', 'model_versions') }}
where deployed_at >= current_date - interval '180 days'
