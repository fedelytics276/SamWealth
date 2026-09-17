{{
  config(
    materialized='view',
    tags=['staging', 'news_feed', 'sentiment']
  )
}}

-- Staging: Raw news and sentiment data from multiple sources
-- Validates sentiment scores, NLP-processed content
-- Part of Data Feed Lineage Layer

with source_data as (
    select
        feed_id,
        source_name,
        article_id,
        article_url,
        published_timestamp,
        headline,
        content_snippet,
        asset_ids,
        asset_symbols,
        sentiment_score,
        sentiment_label,
        confidence_score,
        entity_mentions,
        topic_tags,
        data_quality_score,
        ingested_at,
        created_at
    from {{ source('raw_feeds', 'news_data_raw') }}
    where published_timestamp >= current_date - interval '90 days'
),

validated as (
    select
        feed_id,
        source_name,
        article_id,
        article_url,
        published_timestamp,
        headline,
        content_snippet,
        asset_ids,
        asset_symbols,
        -- Validate sentiment scores (-1 to +1 range)
        case 
            when sentiment_score between -1 and 1 
            then sentiment_score
            else null
        end as sentiment_score,
        sentiment_label,
        -- Validate confidence (0 to 1 range)
        case 
            when confidence_score between 0 and 1 
            then confidence_score
            else null
        end as confidence_score,
        entity_mentions,
        topic_tags,
        data_quality_score,
        ingested_at,
        created_at,
        -- Lineage metadata
        'news_feed' as feed_type,
        current_timestamp as processed_at
    from source_data
    where headline is not null
      and sentiment_score is not null
      and confidence_score >= 0.70
      and data_quality_score >= 0.85
),

deduplicated as (
    select * from (
        select
            *,
            row_number() over (
                partition by article_url
                order by confidence_score desc, data_quality_score desc, ingested_at desc
            ) as rn
        from validated
    ) ranked
    where rn = 1
)

select
    feed_id,
    source_name,
    article_id,
    article_url,
    published_timestamp,
    headline,
    content_snippet,
    asset_ids,
    asset_symbols,
    sentiment_score,
    sentiment_label,
    confidence_score,
    entity_mentions,
    topic_tags,
    data_quality_score,
    feed_type,
    ingested_at,
    processed_at,
    created_at
from deduplicated
