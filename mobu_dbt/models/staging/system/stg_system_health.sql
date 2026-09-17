{{
  config(
    materialized='view',
    tags=['staging', 'system', 'health']
  )
}}

-- Staging: System health checks for reliability tracking

select
    check_id,
    check_timestamp,
    service_name,
    is_healthy,
    response_time_ms,
    error_count,
    error_message
from {{ source('raw_feeds', 'system_health') }}
where check_timestamp >= current_date - interval '90 days'
