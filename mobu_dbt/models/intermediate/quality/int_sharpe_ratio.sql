{{
  config(
    materialized='ephemeral',
    tags=['intermediate', 'quality', 'sharpe', 'performance']
  )
}}

-- Intermediate: Calculate Sharpe Ratio for AI Quality Criteria #3
-- Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Std Dev >= 1.5
-- Measures: Well-defined goal, risk-adjusted returns

with portfolio_returns as (
    select
        portfolio_id,
        date_trunc('day', valuation_timestamp) as metric_date,
        portfolio_value,
        lag(portfolio_value) over (
            partition by portfolio_id
            order by valuation_timestamp
        ) as previous_value
    from {{ ref('stg_portfolio_valuations') }}
    where valuation_timestamp >= current_date - interval '365 days'
),

daily_returns as (
    select
        portfolio_id,
        metric_date,
        portfolio_value,
        previous_value,
        case 
            when previous_value > 0 then
                (portfolio_value - previous_value) / previous_value
            else null
        end as daily_return
    from portfolio_returns
    where previous_value is not null
),

risk_free_rates as (
    select
        metric_date,
        indicator_value / 100.0 / 252 as daily_risk_free_rate  -- Annualized to daily
    from {{ ref('stg_macro_feeds') }}
    where indicator_id = 'DGS3MO'  -- 3-month Treasury rate
      and metric_date >= current_date - interval '365 days'
),

returns_with_rf as (
    select
        dr.portfolio_id,
        dr.metric_date,
        dr.daily_return,
        coalesce(rf.daily_risk_free_rate, 0.0) as risk_free_rate,
        dr.daily_return - coalesce(rf.daily_risk_free_rate, 0.0) as excess_return
    from daily_returns dr
    left join risk_free_rates rf on dr.metric_date = rf.metric_date
    where dr.daily_return is not null
),

rolling_sharpe as (
    select
        portfolio_id,
        metric_date,
        daily_return,
        risk_free_rate,
        excess_return,
        -- 30-day rolling Sharpe
        case 
            when stddev(excess_return) over (
                partition by portfolio_id
                order by metric_date
                rows between 29 preceding and current row
            ) > 0 then
                avg(excess_return) over (
                    partition by portfolio_id
                    order by metric_date
                    rows between 29 preceding and current row
                ) / stddev(excess_return) over (
                    partition by portfolio_id
                    order by metric_date
                    rows between 29 preceding and current row
                ) * sqrt(252)  -- Annualize
            else null
        end as sharpe_30d,
        -- 90-day rolling Sharpe
        case 
            when stddev(excess_return) over (
                partition by portfolio_id
                order by metric_date
                rows between 89 preceding and current row
            ) > 0 then
                avg(excess_return) over (
                    partition by portfolio_id
                    order by metric_date
                    rows between 89 preceding and current row
                ) / stddev(excess_return) over (
                    partition by portfolio_id
                    order by metric_date
                    rows between 89 preceding and current row
                ) * sqrt(252)
            else null
        end as sharpe_90d
    from returns_with_rf
)

select
    portfolio_id,
    metric_date,
    daily_return,
    risk_free_rate,
    excess_return,
    sharpe_30d,
    sharpe_90d,
    -- Compliance check against 1.5 threshold
    case 
        when sharpe_30d >= {{ var('sharpe_threshold') }} then true
        else false
    end as meets_sharpe_30d_threshold,
    case 
        when sharpe_90d >= {{ var('sharpe_threshold') }} then true
        else false
    end as meets_sharpe_90d_threshold
from rolling_sharpe
