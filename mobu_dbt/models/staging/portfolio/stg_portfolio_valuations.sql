{{
  config(
    materialized='view',
    tags=['staging', 'portfolio', 'valuations']
  )
}}

-- Staging: Portfolio valuations for Sharpe ratio calculation

select
    valuation_id,
    portfolio_id,
    user_id,
    valuation_timestamp,
    portfolio_value,
    cash_balance,
    invested_amount,
    unrealized_pnl,
    realized_pnl
from {{ source('raw_feeds', 'portfolio_valuations') }}
where valuation_timestamp >= current_date - interval '365 days'
