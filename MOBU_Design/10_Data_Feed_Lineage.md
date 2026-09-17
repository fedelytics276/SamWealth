# MOBU Data Feed Lineage & Architecture
## Multi-Source Data Integration with Schema Matching

**Document Version**: 1.0  
**Last Updated**: September 6, 2026  
**Status**: Enhanced Architecture

---

## Executive Summary

This document defines MOBU's data feed lineage architecture, inspired by institutional-grade data processing patterns. All data sources flow through a centralized **Data Feed Agent** that parses, validates, and types data according to strict schemas before consumption by the AI engine.

**Key Principles**:
1. **Multiple Sources** - Redundancy and cross-validation
2. **Centralized Parsing** - Single point of schema enforcement
3. **Typed Output** - Strongly typed data for AI consumption
4. **Schema Matching** - Automatic validation against predefined schemas
5. **Lineage Tracking** - Complete provenance from source to recommendation

---

## 1. Data Feed Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA FEED LINEAGE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │  PRICE FEED  │─────────┐                                     │
│  │   (JSE)      │         │                                     │
│  └──────────────┘         │                                     │
│                           │                                     │
│  ┌──────────────┐         │         ┌─────────────────┐       │
│  │  ON-CHAIN    │─────────┼────────▶│     AGENT       │       │
│  │  (Flows)     │         │         │                 │       │
│  └──────────────┘         │         │  parsed &       │       │
│                           │         │  typed          │       │
│  ┌──────────────┐         │         │                 │       │
│  │    NEWS      │─────────┤         │ schema match    │       │
│  │  (Headlines) │         │         │ required        │       │
│  └──────────────┘         │         └────────┬────────┘       │
│                           │                  │                 │
│  ┌──────────────┐         │                  │                 │
│  │    MACRO     │─────────┘                  │                 │
│  │ (Rates•VIX)  │                            │                 │
│  └──────────────┘                            │                 │
│                                              ▼                 │
│                                    ┌──────────────────┐        │
│                                    │  Validated Data  │        │
│                                    │   Lake (typed)   │        │
│                                    └────────┬─────────┘        │
│                                             │                  │
│                                             ▼                  │
│                                    ┌──────────────────┐        │
│                                    │   AI Engine      │        │
│                                    │  (Consumption)   │        │
│                                    └──────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Feeds Definition

### 2.1 Price Feed (Real-Time Market Data)

**Sources**:
- **Primary**: JSE SENS (Johannesburg Stock Exchange)
- **Secondary**: Reuters Refinitiv
- **Tertiary**: Bloomberg Terminal
- **Backup**: Interactive Brokers

**Data Types**:
- Real-time quotes (bid, ask, last)
- Trade executions (price, volume, timestamp)
- Order book depth (L2 data)
- Market status (open, closed, halted)

**Update Frequency**: Real-time (15-second delayed for retail)

**Schema**:
```json
{
  "type": "price_feed",
  "version": "1.0",
  "schema": {
    "ticker": "string",           // "SHP.JO"
    "isin": "string",             // "ZAE000012084"
    "timestamp": "datetime",       // ISO 8601
    "last_price": "decimal",       // 168.25
    "bid": "decimal",              // 168.20
    "ask": "decimal",              // 168.30
    "volume": "integer",           // 1500000
    "vwap": "decimal",             // 167.89
    "high": "decimal",             // 169.50
    "low": "decimal",              // 166.80
    "open": "decimal",             // 167.00
    "close_prev": "decimal",       // 165.50
    "change_pct": "decimal",       // 1.66
    "market_cap": "decimal",       // 153400000000
    "source": "enum",              // JSE, Reuters, Bloomberg
    "quality": "enum"              // real_time, delayed, estimated
  },
  "required": ["ticker", "timestamp", "last_price", "source"],
  "validation": {
    "price_range": [0.01, 10000],
    "spike_threshold": 20,         // % change
    "cross_source_tolerance": 0.5  // % deviation
  }
}
```

---

### 2.2 On-Chain Feed (Blockchain & Transaction Data)

**Sources**:
- **Flow Data**: Money flows (institutional buying/selling)
- **Smart Contract Events**: DeFi protocols (if crypto exposure)
- **Transaction Analysis**: Whale movements
- **Exchange Flows**: Net inflows/outflows

**Data Types**:
- Institutional order flow
- Dark pool activity
- Large block trades
- ETF creation/redemption

**Update Frequency**: Hourly aggregation

**Schema**:
```json
{
  "type": "on_chain_feed",
  "version": "1.0",
  "schema": {
    "ticker": "string",
    "timestamp": "datetime",
    "flow_type": "enum",          // institutional, retail, etf
    "net_flow": "decimal",         // Net buy/sell in ZAR
    "volume": "integer",
    "avg_trade_size": "decimal",
    "num_transactions": "integer",
    "buyer_seller_ratio": "decimal",
    "dark_pool_pct": "decimal",    // % in dark pools
    "block_trades": "array",       // List of large trades
    "sentiment": "enum",           // bullish, bearish, neutral
    "confidence": "decimal",       // 0-1
    "source": "string"
  },
  "required": ["ticker", "timestamp", "flow_type", "net_flow"],
  "validation": {
    "net_flow_range": [-1000000000, 1000000000],
    "confidence_range": [0, 1]
  }
}
```

---

### 2.3 News Feed (Sentiment & Events)

**Sources**:
- **Primary**: Reuters News API
- **Secondary**: Bloomberg News
- **Tertiary**: Local SA News (Business Day, Moneyweb)
- **Social**: Twitter/X Financial (verified accounts only)

**Data Types**:
- Corporate announcements
- Earnings releases
- Management changes
- Regulatory filings
- Market commentary

**Update Frequency**: Real-time (as published)

**Schema**:
```json
{
  "type": "news_feed",
  "version": "1.0",
  "schema": {
    "article_id": "string",
    "ticker": "string",            // May be null (market-wide news)
    "headline": "string",
    "summary": "string",
    "full_text": "string",
    "author": "string",
    "source": "string",            // Reuters, Bloomberg, etc.
    "published_at": "datetime",
    "url": "string",
    "category": "enum",            // earnings, M&A, regulatory, etc.
    "sentiment_score": "decimal",  // -1 (bearish) to +1 (bullish)
    "sentiment_confidence": "decimal", // 0-1
    "relevance_score": "decimal",  // 0-1 (how relevant to ticker)
    "entities": "array",           // [{"name": "Shoprite", "type": "company"}]
    "topics": "array",             // ["retail", "earnings", "south_africa"]
    "language": "string",          // "en", "af"
    "word_count": "integer"
  },
  "required": ["article_id", "headline", "published_at", "source"],
  "validation": {
    "sentiment_range": [-1, 1],
    "confidence_range": [0, 1],
    "min_word_count": 20
  }
}
```

---

### 2.4 Macro Feed (Economic Indicators)

**Sources**:
- **Primary**: South African Reserve Bank (SARB)
- **Secondary**: Bloomberg Economic Calendar
- **Tertiary**: Trading Economics
- **Global**: FRED (Federal Reserve Economic Data)

**Data Types**:
- Interest rates (repo rate)
- Inflation (CPI, PPI)
- GDP growth
- Unemployment
- Currency rates (USD/ZAR)
- VIX (volatility index)
- Commodity prices (gold, oil)

**Update Frequency**: Daily (or on release dates)

**Schema**:
```json
{
  "type": "macro_feed",
  "version": "1.0",
  "schema": {
    "indicator": "string",         // "SARB_Repo_Rate"
    "timestamp": "datetime",
    "value": "decimal",             // 8.25
    "unit": "string",               // "percent", "index", "currency"
    "period": "string",             // "2026-Q3"
    "country": "string",            // "ZA"
    "source": "string",             // "SARB", "Bloomberg"
    "previous_value": "decimal",
    "change": "decimal",
    "change_pct": "decimal",
    "forecast": "decimal",          // Consensus forecast
    "surprise": "decimal",          // Actual vs forecast
    "importance": "enum",           // high, medium, low
    "release_schedule": "string"    // "monthly", "quarterly"
  },
  "required": ["indicator", "timestamp", "value", "source"],
  "validation": {
    "value_range_check": true,      // Different per indicator
    "release_schedule_check": true
  }
}
```

---

## 3. Data Feed Agent (Central Parser)

### 3.1 Agent Architecture

```python
# services/data_feed_agent.py

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import jsonschema
from enum import Enum

class FeedType(Enum):
    PRICE = "price_feed"
    ON_CHAIN = "on_chain_feed"
    NEWS = "news_feed"
    MACRO = "macro_feed"

@dataclass
class ParsedData:
    """Strongly typed output from Data Feed Agent"""
    feed_type: FeedType
    ticker: Optional[str]
    timestamp: datetime
    data: Dict[str, Any]
    source: str
    quality_score: float
    schema_version: str
    lineage: List[str]  # Track data provenance

class DataFeedAgent:
    """
    Central agent for parsing, validating, and typing all data feeds
    
    Responsibilities:
    1. Ingest raw data from multiple sources
    2. Parse according to feed type
    3. Validate against schema
    4. Type conversion and normalization
    5. Quality scoring
    6. Lineage tracking
    7. Output to validated data lake
    """
    
    def __init__(self, config: dict):
        self.config = config
        self.schemas = self._load_schemas()
        self.parsers = self._initialize_parsers()
        self.validators = self._initialize_validators()
        
    def parse_and_type(
        self, 
        raw_data: Any, 
        feed_type: FeedType,
        source: str
    ) -> ParsedData:
        """
        Main entry point: parse raw data and output typed result
        
        Schema match required - will fail if data doesn't match
        """
        # 1. Identify feed type (if not provided)
        if feed_type is None:
            feed_type = self._identify_feed_type(raw_data)
        
        # 2. Get appropriate parser
        parser = self.parsers[feed_type]
        
        # 3. Parse raw data to structured format
        parsed = parser.parse(raw_data, source)
        
        # 4. Validate against schema
        schema = self.schemas[feed_type]
        is_valid, errors = self._validate_schema(parsed, schema)
        
        if not is_valid:
            raise SchemaValidationError(
                f"Data does not match {feed_type.value} schema: {errors}"
            )
        
        # 5. Type conversion
        typed_data = self._convert_types(parsed, schema)
        
        # 6. Quality scoring
        quality_score = self._calculate_quality(typed_data, feed_type)
        
        # 7. Lineage tracking
        lineage = self._build_lineage(raw_data, source, feed_type)
        
        # 8. Create typed output
        result = ParsedData(
            feed_type=feed_type,
            ticker=typed_data.get('ticker'),
            timestamp=typed_data['timestamp'],
            data=typed_data,
            source=source,
            quality_score=quality_score,
            schema_version=schema['version'],
            lineage=lineage
        )
        
        # 9. Log for audit trail
        self._log_lineage(result)
        
        return result
    
    def _validate_schema(
        self, 
        data: Dict, 
        schema: Dict
    ) -> tuple[bool, List[str]]:
        """Validate data against JSON schema"""
        try:
            jsonschema.validate(data, schema['schema'])
            
            # Additional validation rules
            if 'validation' in schema:
                self._apply_custom_validations(data, schema['validation'])
            
            return True, []
        except jsonschema.ValidationError as e:
            return False, [str(e)]
        except CustomValidationError as e:
            return False, [str(e)]
    
    def _convert_types(self, data: Dict, schema: Dict) -> Dict:
        """Convert strings to proper types based on schema"""
        typed_data = {}
        
        for field, field_type in schema['schema'].items():
            if field not in data:
                continue
                
            value = data[field]
            
            # Type conversion based on schema
            if field_type == 'decimal':
                typed_data[field] = Decimal(str(value))
            elif field_type == 'integer':
                typed_data[field] = int(value)
            elif field_type == 'datetime':
                typed_data[field] = self._parse_datetime(value)
            elif field_type == 'enum':
                typed_data[field] = self._validate_enum(value, field, schema)
            else:
                typed_data[field] = value
        
        return typed_data
    
    def _calculate_quality(
        self, 
        data: Dict, 
        feed_type: FeedType
    ) -> float:
        """
        Calculate quality score (0-1) based on:
        - Completeness (all required fields present)
        - Freshness (timestamp recency)
        - Cross-source consistency (if multiple sources)
        - Historical patterns (outlier detection)
        """
        score = 1.0
        
        # Completeness check
        required_fields = self._get_required_fields(feed_type)
        missing = [f for f in required_fields if f not in data]
        score -= 0.2 * len(missing) / len(required_fields)
        
        # Freshness check
        age_minutes = (datetime.now() - data['timestamp']).total_seconds() / 60
        if age_minutes > 60:
            score -= 0.1
        
        # Source reliability
        source_reliability = self._get_source_reliability(data['source'])
        score *= source_reliability
        
        return max(0.0, min(1.0, score))
    
    def _build_lineage(
        self, 
        raw_data: Any, 
        source: str, 
        feed_type: FeedType
    ) -> List[str]:
        """Build complete data lineage for audit trail"""
        lineage = [
            f"source:{source}",
            f"feed_type:{feed_type.value}",
            f"ingestion_time:{datetime.now().isoformat()}",
            f"parser_version:{self.config['version']}",
            f"raw_data_hash:{self._hash_data(raw_data)}"
        ]
        return lineage
    
    def _log_lineage(self, result: ParsedData):
        """Log to lineage database for complete provenance"""
        # Store in Neo4j for graph-based lineage queries
        lineage_record = {
            'id': str(uuid.uuid4()),
            'feed_type': result.feed_type.value,
            'ticker': result.ticker,
            'timestamp': result.timestamp,
            'source': result.source,
            'quality_score': result.quality_score,
            'lineage': result.lineage,
            'created_at': datetime.now()
        }
        
        self.lineage_db.insert(lineage_record)
```

---

### 3.2 Parser Implementations

```python
# parsers/price_feed_parser.py

class PriceFeedParser:
    """Parse price feed from various sources"""
    
    def parse(self, raw_data: Any, source: str) -> Dict:
        """Parse based on source format"""
        if source == "JSE_SENS":
            return self._parse_jse(raw_data)
        elif source == "Reuters":
            return self._parse_reuters(raw_data)
        elif source == "Bloomberg":
            return self._parse_bloomberg(raw_data)
        else:
            raise UnsupportedSourceError(f"Unknown source: {source}")
    
    def _parse_jse(self, raw_data: str) -> Dict:
        """Parse JSE SENS format (XML/JSON)"""
        # JSE-specific parsing logic
        parsed = xmltodict.parse(raw_data)
        
        return {
            'ticker': parsed['Instrument']['Code'] + '.JO',
            'isin': parsed['Instrument']['ISIN'],
            'timestamp': self._parse_jse_timestamp(parsed['Timestamp']),
            'last_price': float(parsed['LastPrice']),
            'bid': float(parsed['Bid']),
            'ask': float(parsed['Ask']),
            'volume': int(parsed['Volume']),
            'source': 'JSE_SENS',
            'quality': 'real_time'
        }
```

---

## 4. Schema Registry

### 4.1 Centralized Schema Management

```python
# schema_registry.py

class SchemaRegistry:
    """
    Central registry for all data schemas
    
    Benefits:
    - Single source of truth
    - Version control
    - Backward compatibility
    - Schema evolution
    """
    
    def __init__(self):
        self.schemas = {}
        self._load_all_schemas()
    
    def get_schema(self, feed_type: str, version: str = "latest") -> Dict:
        """Get schema for feed type"""
        if version == "latest":
            version = self._get_latest_version(feed_type)
        
        return self.schemas[feed_type][version]
    
    def register_schema(self, feed_type: str, schema: Dict):
        """Register new schema version"""
        # Validate schema format
        self._validate_schema_format(schema)
        
        # Check backward compatibility
        if feed_type in self.schemas:
            self._check_compatibility(feed_type, schema)
        
        # Store schema
        version = schema['version']
        if feed_type not in self.schemas:
            self.schemas[feed_type] = {}
        
        self.schemas[feed_type][version] = schema
        
        # Persist to database
        self._persist_schema(feed_type, version, schema)
```

---

## 5. Lineage Tracking

### 5.1 Complete Data Provenance

**Neo4j Graph Model**:

```cypher
// Create nodes for each stage
CREATE (source:DataSource {name: 'JSE_SENS', type: 'exchange'})
CREATE (raw:RawData {id: '12345', timestamp: datetime()})
CREATE (agent:Agent {name: 'DataFeedAgent', version: '1.0'})
CREATE (parsed:ParsedData {id: '67890', quality_score: 0.99})
CREATE (validated:ValidatedData {id: 'abc123'})
CREATE (rec:Recommendation {id: 'rec-001', ticker: 'SHP.JO'})

// Create relationships (lineage)
CREATE (source)-[:PRODUCED]->(raw)
CREATE (raw)-[:PROCESSED_BY]->(agent)
CREATE (agent)-[:GENERATED]->(parsed)
CREATE (parsed)-[:VALIDATED_TO]->(validated)
CREATE (validated)-[:CONTRIBUTED_TO]->(rec)

// Query lineage for a recommendation
MATCH path = (source:DataSource)-[*]->(rec:Recommendation {id: 'rec-001'})
RETURN path
```

### 5.2 Lineage Query Examples

```python
# Query: What data sources contributed to this recommendation?
def get_recommendation_lineage(recommendation_id: str) -> List[Dict]:
    """Get complete lineage for a recommendation"""
    query = """
    MATCH path = (source:DataSource)-[*]->(rec:Recommendation {id: $rec_id})
    RETURN source.name as source, 
           length(path) as hops,
           [node in nodes(path) | node.timestamp] as timestamps
    ORDER BY hops
    """
    return graph.run(query, rec_id=recommendation_id).data()

# Query: Which recommendations used data from JSE on 2026-09-06?
def get_recommendations_by_source_date(source: str, date: str) -> List[str]:
    """Find recommendations using specific source and date"""
    query = """
    MATCH (source:DataSource {name: $source})
          -[:PRODUCED]->(raw:RawData)
          -[*]->(rec:Recommendation)
    WHERE date(raw.timestamp) = date($date)
    RETURN DISTINCT rec.id as recommendation_id
    """
    return graph.run(query, source=source, date=date).data()
```

---

## 6. Implementation Example

### 6.1 End-to-End Flow

```python
# main.py - Example usage

from data_feed_agent import DataFeedAgent, FeedType

# Initialize agent
agent = DataFeedAgent(config={
    'version': '1.0',
    'quality_threshold': 0.8
})

# Ingest price data from JSE
raw_jse_data = jse_client.get_quotes(['SHP.JO', 'NPN.JO'])

for raw in raw_jse_data:
    try:
        # Parse and type
        parsed_data = agent.parse_and_type(
            raw_data=raw,
            feed_type=FeedType.PRICE,
            source='JSE_SENS'
        )
        
        # Check quality
        if parsed_data.quality_score >= 0.8:
            # Store in validated data lake
            data_lake.store(parsed_data)
            
            # Make available to AI engine
            ai_engine.ingest(parsed_data)
        else:
            logger.warning(
                f"Low quality data: {parsed_data.quality_score} for {parsed_data.ticker}"
            )
            
    except SchemaValidationError as e:
        logger.error(f"Schema validation failed: {e}")
        # Alert data quality team
        alert_service.send_alert('schema_validation_failed', str(e))
```

---

## 7. Benefits of This Approach

### 7.1 For Data Quality
- ✅ **Single validation point** - All data validated by agent
- ✅ **Schema enforcement** - Catches errors early
- ✅ **Type safety** - No runtime type errors
- ✅ **Quality scoring** - Track data reliability

### 7.2 For AI Engine
- ✅ **Clean input** - Only validated data consumed
- ✅ **Consistent format** - Same structure across sources
- ✅ **Lineage available** - Can trace back to source
- ✅ **Quality metadata** - Make informed decisions

### 7.3 For Compliance
- ✅ **Complete audit trail** - Every data point tracked
- ✅ **Provenance** - Can answer "where did this come from?"
- ✅ **Version control** - Schema evolution documented
- ✅ **Reproducibility** - Can replay any recommendation

---

## 8. Next Steps

### Phase 1: Setup (Weeks 1-2)
- [ ] Define all schemas (price, on-chain, news, macro)
- [ ] Build schema registry
- [ ] Implement base Data Feed Agent

### Phase 2: Parsers (Weeks 3-4)
- [ ] Build JSE parser
- [ ] Build Reuters parser
- [ ] Build news parser
- [ ] Build macro parser

### Phase 3: Integration (Weeks 5-6)
- [ ] Connect to data sources
- [ ] Implement lineage tracking (Neo4j)
- [ ] Build quality dashboards
- [ ] Test end-to-end flow

### Phase 4: Production (Weeks 7-8)
- [ ] Deploy agent
- [ ] Monitor data quality
- [ ] Tune quality scoring
- [ ] Document for team

---

## Conclusion

This data feed lineage architecture ensures MOBU has:
- **Clean, typed data** for AI consumption
- **Complete provenance** for audit trails
- **Quality assurance** at ingestion
- **Regulatory compliance** through lineage

**Inspired by institutional best practices** for data management.

---

**Document Owner**: CTO / Data Engineering Lead  
**Review Date**: Weekly during implementation  
**Status**: ✅ Ready for Implementation
