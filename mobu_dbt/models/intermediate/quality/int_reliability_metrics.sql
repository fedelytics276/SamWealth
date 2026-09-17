{{
  config(
    materialized='ephemeral',
    tags=['intermediate', 'quality', 'reliability']
  )
}}

-- Intermediate: Calculate reliability metrics for AI Quality Criteria #2
-- Reliability = (Uptime / Total time) >= 99.9% (24/7 availability)
-- Measures: System availability, data freshness, service health

with system_health_checks as (
    select
        check_timestamp,
        service_name,
        is_healthy,
        response_time_ms,
        error_count
    from {{ ref('stg_system_health') }}
    where check_timestamp >= current_date - interval '90 days'
),

hourly_uptime as (
    select
        date_trunc('hour', check_timestamp) as metric_hour,
        service_name,
        count(*) as total_checks,
        sum(case when is_healthy then 1 else 0 end) as healthy_checks,
        round(
            sum(case when is_healthy then 1 else 0 end)::numeric / count(*)::numeric,
            6
        ) as uptime_rate,
        avg(response_time_ms) as avg_response_time,
        sum(error_count) as total_errors
    from system_health_checks
    group by date_trunc('hour', check_timestamp), service_name
),

daily_uptime as (
    select
        date_trunc('day', metric_hour) as metric_date,
        service_name,
        count(*) as hours_checked,
        sum(total_checks) as total_checks,
        sum(healthy_checks) as healthy_checks,
        round(
            sum(healthy_checks)::numeric / sum(total_checks)::numeric,
            6
        ) as daily_uptime_rate,
        avg(avg_response_time) as avg_response_time,
        sum(total_errors) as daily_errors
    from hourly_uptime
    group by date_trunc('day', metric_hour), service_name
),

rolling_uptime as (
    select
        metric_date,
        service_name,
        hours_checked,
        daily_uptime_rate,
        avg_response_time,
        daily_errors,
        -- 7-day rolling uptime
        avg(daily_uptime_rate) over (
            partition by service_name
            order by metric_date
            rows between 6 preceding and current row
        ) as uptime_7d_avg,
        -- 30-day rolling uptime
        avg(daily_uptime_rate) over (
            partition by service_name
            order by metric_date
            rows between 29 preceding and current row
        ) as uptime_30d_avg
    from daily_uptime
)

select
    metric_date,
    service_name,
    hours_checked,
    daily_uptime_rate,
    avg_response_time,
    daily_errors,
    uptime_7d_avg,
    uptime_30d_avg,
    -- Compliance check against 99.9% threshold
    case 
        when daily_uptime_rate >= {{ var('reliability_threshold') }} then true
        else false
    end as meets_reliability_threshold,
    case 
        when uptime_7d_avg >= {{ var('reliability_threshold') }} then true
        else false
    end as meets_7d_threshold,
    case 
        when uptime_30d_avg >= {{ var('reliability_threshold') }} then true
        else false
    end as meets_30d_threshold
from rolling_uptime
