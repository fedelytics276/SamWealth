{{
  config(
    materialized='ephemeral',
    tags=['intermediate', 'quality', 'accuracy']
  )
}}

-- Intermediate: Calculate accuracy metrics for AI Quality Criteria #1
-- Accuracy = (Correct predictions / Total predictions) >= 99.95%
-- Measures: Right data shape, correct transformations, validation pass rate

with recommendation_outcomes as (
    select
        recommendation_id,
        asset_id,
        recommended_action,
        recommended_at,
        executed_at,
        actual_outcome,
        predicted_outcome,
        prediction_confidence,
        case 
            when actual_outcome = predicted_outcome then 1
            else 0
        end as is_accurate
    from {{ ref('stg_recommendations') }}
    where executed_at is not null
      and actual_outcome is not null
),

daily_accuracy as (
    select
        date_trunc('day', executed_at) as metric_date,
        count(*) as total_predictions,
        sum(is_accurate) as accurate_predictions,
        round(sum(is_accurate)::numeric / count(*)::numeric, 6) as accuracy_rate,
        avg(prediction_confidence) as avg_confidence
    from recommendation_outcomes
    group by date_trunc('day', executed_at)
),

rolling_accuracy as (
    select
        metric_date,
        total_predictions,
        accurate_predictions,
        accuracy_rate,
        avg_confidence,
        -- 7-day rolling average
        avg(accuracy_rate) over (
            order by metric_date
            rows between 6 preceding and current row
        ) as accuracy_7d_avg,
        -- 30-day rolling average
        avg(accuracy_rate) over (
            order by metric_date
            rows between 29 preceding and current row
        ) as accuracy_30d_avg
    from daily_accuracy
)

select
    metric_date,
    total_predictions,
    accurate_predictions,
    accuracy_rate,
    avg_confidence,
    accuracy_7d_avg,
    accuracy_30d_avg,
    -- Compliance check against 99.95% threshold
    case 
        when accuracy_rate >= {{ var('accuracy_threshold') }} then true
        else false
    end as meets_accuracy_threshold,
    case 
        when accuracy_7d_avg >= {{ var('accuracy_threshold') }} then true
        else false
    end as meets_7d_threshold,
    case 
        when accuracy_30d_avg >= {{ var('accuracy_threshold') }} then true
        else false
    end as meets_30d_threshold
from rolling_accuracy
