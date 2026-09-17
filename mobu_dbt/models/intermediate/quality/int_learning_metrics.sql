{{
  config(
    materialized='ephemeral',
    tags=['intermediate', 'quality', 'learning', 'self-improvement']
  )
}}

-- Intermediate: Calculate self-improvement metrics for AI Quality Criteria #4
-- Self-Improving = Model learns from outcomes (success & failure)
-- Measures: Model version improvements, accuracy trends, feedback incorporation

with model_versions as (
    select
        model_version_id,
        model_name,
        version_number,
        deployed_at,
        training_data_size,
        validation_accuracy,
        test_accuracy,
        hyperparameters,
        features_used
    from {{ ref('stg_model_versions') }}
    where deployed_at >= current_date - interval '180 days'
),

model_performance as (
    select
        mv.model_version_id,
        mv.model_name,
        mv.version_number,
        mv.deployed_at,
        mv.validation_accuracy,
        mv.test_accuracy,
        -- Compare to previous version
        lag(mv.validation_accuracy) over (
            partition by mv.model_name
            order by mv.version_number
        ) as prev_validation_accuracy,
        lag(mv.test_accuracy) over (
            partition by mv.model_name
            order by mv.version_number
        ) as prev_test_accuracy
    from model_versions mv
),

learning_improvements as (
    select
        model_version_id,
        model_name,
        version_number,
        deployed_at,
        validation_accuracy,
        test_accuracy,
        prev_validation_accuracy,
        prev_test_accuracy,
        -- Calculate improvement
        case 
            when prev_validation_accuracy is not null then
                validation_accuracy - prev_validation_accuracy
            else null
        end as validation_improvement,
        case 
            when prev_test_accuracy is not null then
                test_accuracy - prev_test_accuracy
            else null
        end as test_improvement,
        -- Is improving?
        case 
            when prev_validation_accuracy is not null 
                and validation_accuracy > prev_validation_accuracy then true
            when prev_validation_accuracy is null then null
            else false
        end as is_improving
    from model_performance
),

feedback_incorporation as (
    select
        model_version_id,
        count(*) as feedback_events,
        sum(case when feedback_type = 'success' then 1 else 0 end) as success_feedback,
        sum(case when feedback_type = 'failure' then 1 else 0 end) as failure_feedback,
        sum(case when was_incorporated then 1 else 0 end) as feedback_incorporated
    from {{ ref('stg_model_feedback') }}
    group by model_version_id
)

select
    li.model_version_id,
    li.model_name,
    li.version_number,
    li.deployed_at,
    li.validation_accuracy,
    li.test_accuracy,
    li.prev_validation_accuracy,
    li.prev_test_accuracy,
    li.validation_improvement,
    li.test_improvement,
    li.is_improving,
    coalesce(fi.feedback_events, 0) as feedback_events,
    coalesce(fi.success_feedback, 0) as success_feedback,
    coalesce(fi.failure_feedback, 0) as failure_feedback,
    coalesce(fi.feedback_incorporated, 0) as feedback_incorporated,
    case 
        when fi.feedback_events > 0 then
            fi.feedback_incorporated::numeric / fi.feedback_events::numeric
        else 0
    end as feedback_incorporation_rate,
    -- Compliance: Model must show improvement or high feedback incorporation
    case 
        when li.is_improving = true 
            or (fi.feedback_events > 10 and fi.feedback_incorporated::numeric / fi.feedback_events::numeric >= 0.80)
        then true
        else false
    end as meets_learning_threshold
from learning_improvements li
left join feedback_incorporation fi on li.model_version_id = fi.model_version_id
