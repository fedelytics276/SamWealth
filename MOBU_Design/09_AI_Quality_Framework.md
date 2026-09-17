# MOBU AI Quality Framework
## Ensuring Accuracy, Reliability, Goal Definition & Self-Improvement

**Document Version**: 1.0  
**Last Updated**: September 6, 2026  
**Status**: Implementation Ready

---

## Executive Summary

This document defines MOBU's AI Quality Framework based on four critical compliance criteria:

1. **Accuracy** - Right data, right shape, right time
2. **Reliability** - 24/7 availability, always-on operations
3. **Well-Defined Goals** - Clear success/failure metrics, Sharpe ratio integration
4. **Self-Improving** - Learn from outcomes, continuous optimization

These criteria ensure MOBU delivers institutional-grade AI recommendations that regulators can trust and investors can rely on.

---

## Table of Contents

1. [Criterion 1: Accuracy](#criterion-1-accuracy)
2. [Criterion 2: Reliability](#criterion-2-reliability)
3. [Criterion 3: Well-Defined Goals](#criterion-3-well-defined-goals)
4. [Criterion 4: Self-Improving](#criterion-4-self-improving)
5. [Architecture Updates](#architecture-updates)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Regulatory Compliance](#regulatory-compliance)

---

## Criterion 1: Accuracy

### Definition
**Accuracy** means MOBU uses the right data, in the right shape, at the right time to make recommendations.

### Components

#### 1.1 Data Quality Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA QUALITY PIPELINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Ingestion → Validation → Transformation → Storage → Use    │
│     ↓           ↓              ↓              ↓         ↓    │
│  Sources    Schemas       Normalization   PostgreSQL  AI    │
│  (JSE,      (JSON         (Clean,         (Audited)  Engine │
│  Reuters)   Schema)       Dedupe)                            │
│                                                              │
│              [Quality Checks at Each Stage]                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 1.2 Data Sources & Validation

| Data Type | Source | Update Frequency | Validation Rules | Accuracy Target |
|-----------|--------|------------------|------------------|-----------------|
| **Stock Prices** | JSE SENS, Reuters | Real-time (15s delay) | Range check, spike detection | 99.99% |
| **Financial Statements** | JSE filings, audited reports | Quarterly | Schema validation, ratio checks | 100% |
| **Technical Indicators** | Calculated from prices | Real-time | Statistical bounds, correlation | 99.9% |
| **News Sentiment** | Reuters, local news | Hourly | NLP confidence > 0.7 | 95% |
| **Analyst Ratings** | Bloomberg, local brokers | Daily | Consistency check | 98% |

#### 1.3 Data Shape Requirements

**Schema Enforcement**:
```json
{
  "stock_price": {
    "ticker": "string (JSE format: XXX.JO)",
    "timestamp": "ISO 8601",
    "price": "decimal(10,2)",
    "volume": "integer",
    "bid": "decimal(10,2)",
    "ask": "decimal(10,2)",
    "source": "enum(JSE, Reuters, Bloomberg)",
    "validated": "boolean",
    "validation_timestamp": "ISO 8601"
  }
}
```

**Validation Rules**:
- Price must be > 0 and < 10,000 (reasonable bounds)
- Volume must be >= 0
- Bid <= Last Price <= Ask
- Timestamp must be within last 60 seconds (for real-time)
- Source must be whitelisted

#### 1.4 Data Accuracy Checks

**Real-Time Checks** (Every ingestion):
1. **Schema Validation**: JSON schema compliance
2. **Range Check**: Values within expected bounds
3. **Spike Detection**: Price change > 20% triggers manual review
4. **Cross-Source Validation**: Compare JSE vs Reuters (< 0.5% diff)
5. **Completeness Check**: All required fields present

**Daily Checks**:
1. **Historical Consistency**: Compare to previous day
2. **Corporate Actions**: Adjust for splits, dividends
3. **Reconciliation**: Match closing prices across sources
4. **Audit Trail**: Log all data modifications

**Weekly Checks**:
1. **Statistical Outliers**: Identify anomalies in historical data
2. **Source Reliability**: Track error rates per source
3. **Data Freshness**: Ensure no stale data in production

#### 1.5 Data Quality Metrics

**Dashboard Metrics**:
- **Accuracy Score**: % of data passing all validation checks
- **Completeness Score**: % of expected data points received
- **Timeliness Score**: % of data received within SLA
- **Consistency Score**: % of cross-source matches

**Target SLAs**:
- Accuracy: 99.95%
- Completeness: 99.9%
- Timeliness: 99.5% (within 30s of source update)
- Consistency: 99% (< 1% cross-source deviation)

#### 1.6 Data Correction Workflow

```
Data Quality Issue Detected
         ↓
   [Automatic Fix?]
    /          \
  YES          NO
   ↓            ↓
Apply       Alert Data
Fix         Quality Team
   ↓            ↓
Log        Manual Review
Correction      ↓
   ↓        [Can Fix?]
Audit       /        \
Trail     YES        NO
           ↓          ↓
       Apply Fix   Escalate
           ↓          ↓
       Update    Block Bad
       System      Data
                    ↓
                Notify
                Stakeholders
```

#### 1.7 Implementation: Data Quality Service

**PostgreSQL Extension**:
```sql
-- Data quality tracking table
CREATE TABLE data_quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type VARCHAR(50) NOT NULL,
    data_id VARCHAR(100) NOT NULL,
    check_type VARCHAR(50) NOT NULL,
    check_result BOOLEAN NOT NULL,
    check_details JSONB,
    checked_at TIMESTAMP DEFAULT NOW(),
    checked_by VARCHAR(100)
);

-- Create index for fast lookups
CREATE INDEX idx_dq_checks_type_result 
ON data_quality_checks(data_type, check_result, checked_at);

-- Function to validate stock price
CREATE OR REPLACE FUNCTION validate_stock_price(
    p_ticker VARCHAR,
    p_price DECIMAL,
    p_volume INTEGER,
    p_timestamp TIMESTAMP
) RETURNS BOOLEAN AS $$
DECLARE
    v_prev_price DECIMAL;
    v_price_change_pct DECIMAL;
BEGIN
    -- Get previous price
    SELECT price INTO v_prev_price
    FROM stock_prices
    WHERE ticker = p_ticker
    ORDER BY timestamp DESC
    LIMIT 1;
    
    -- Check price bounds
    IF p_price <= 0 OR p_price > 10000 THEN
        RETURN FALSE;
    END IF;
    
    -- Check volume
    IF p_volume < 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check spike (> 20% change)
    IF v_prev_price IS NOT NULL THEN
        v_price_change_pct := ABS((p_price - v_prev_price) / v_prev_price * 100);
        IF v_price_change_pct > 20 THEN
            -- Log for manual review
            INSERT INTO data_quality_checks (
                data_type, data_id, check_type, check_result, check_details
            ) VALUES (
                'stock_price', p_ticker, 'spike_detection', FALSE,
                jsonb_build_object('change_pct', v_price_change_pct)
            );
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

**Python Data Quality Service**:
```python
# services/data_quality_service.py

from typing import Dict, List, Optional
from datetime import datetime, timedelta
import jsonschema
from prometheus_client import Counter, Histogram

class DataQualityService:
    """Ensures data accuracy and quality"""
    
    # Metrics
    validation_counter = Counter(
        'data_validations_total',
        'Total data validations',
        ['data_type', 'result']
    )
    
    validation_duration = Histogram(
        'data_validation_duration_seconds',
        'Data validation duration'
    )
    
    def __init__(self, db, logger):
        self.db = db
        self.logger = logger
        self.schemas = self._load_schemas()
        self.accuracy_threshold = 0.9995  # 99.95%
    
    def validate_stock_price(self, data: Dict) -> tuple[bool, Optional[str]]:
        """
        Validate stock price data
        Returns: (is_valid, error_message)
        """
        with self.validation_duration.time():
            # Schema validation
            try:
                jsonschema.validate(data, self.schemas['stock_price'])
            except jsonschema.ValidationError as e:
                self.validation_counter.labels('stock_price', 'schema_fail').inc()
                return False, f"Schema validation failed: {e.message}"
            
            # Range checks
            if data['price'] <= 0 or data['price'] > 10000:
                self.validation_counter.labels('stock_price', 'range_fail').inc()
                return False, "Price out of range"
            
            if data['volume'] < 0:
                self.validation_counter.labels('stock_price', 'range_fail').inc()
                return False, "Negative volume"
            
            # Spike detection
            prev_price = self._get_previous_price(data['ticker'])
            if prev_price:
                change_pct = abs((data['price'] - prev_price) / prev_price * 100)
                if change_pct > 20:
                    self._alert_spike(data['ticker'], change_pct)
                    self.validation_counter.labels('stock_price', 'spike_detected').inc()
                    return False, f"Price spike detected: {change_pct:.2f}%"
            
            # Cross-source validation
            if not self._validate_cross_source(data):
                self.validation_counter.labels('stock_price', 'cross_source_fail').inc()
                return False, "Cross-source validation failed"
            
            self.validation_counter.labels('stock_price', 'success').inc()
            return True, None
    
    def get_accuracy_score(self, time_window: timedelta = timedelta(hours=24)) -> float:
        """Calculate accuracy score for time window"""
        query = """
            SELECT 
                COUNT(*) FILTER (WHERE check_result = TRUE) AS passed,
                COUNT(*) AS total
            FROM data_quality_checks
            WHERE checked_at > NOW() - INTERVAL '%s hours'
        """
        result = self.db.execute(query, (time_window.total_seconds() / 3600,))
        row = result.fetchone()
        
        if row['total'] == 0:
            return 1.0
        
        accuracy = row['passed'] / row['total']
        
        # Alert if below threshold
        if accuracy < self.accuracy_threshold:
            self.logger.error(
                f"Accuracy score {accuracy:.4f} below threshold {self.accuracy_threshold}"
            )
            self._send_alert('accuracy_threshold_breach', {'score': accuracy})
        
        return accuracy
    
    def _validate_cross_source(self, data: Dict) -> bool:
        """Validate data against alternative source"""
        # Get data from alternative source
        alt_data = self._get_alternative_source(data['ticker'])
        if not alt_data:
            return True  # No alternative source available
        
        # Check price deviation
        price_diff_pct = abs((data['price'] - alt_data['price']) / alt_data['price'] * 100)
        
        # Allow 0.5% deviation
        return price_diff_pct < 0.5
```

---

## Criterion 2: Reliability

### Definition
**Reliability** means MOBU operates 24/7 with 99.9% uptime, handling failures gracefully.

### Components

#### 2.1 High Availability Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    RELIABILITY ARCHITECTURE                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Region 1   │  │  Region 2   │  │  Region 3   │         │
│  │  (Primary)  │  │  (Standby)  │  │  (DR)       │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ API (3x)    │  │ API (2x)    │  │ API (1x)    │         │
│  │ AI (2x)     │  │ AI (1x)     │  │ AI (1x)     │         │
│  │ DB Master   │  │ DB Replica  │  │ DB Replica  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                  │
│                   Load Balancer                              │
│                  (Azure Front Door)                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.2 Uptime Requirements

| Component | Target Uptime | Max Downtime/Year | Failover Time |
|-----------|---------------|-------------------|---------------|
| **API Gateway** | 99.95% | 4.4 hours | < 30 seconds |
| **AI Engine** | 99.9% | 8.8 hours | < 2 minutes |
| **Database** | 99.99% | 53 minutes | < 1 minute |
| **Data Pipeline** | 99.5% | 43.8 hours | < 5 minutes |
| **Overall System** | 99.9% | 8.8 hours | < 2 minutes |

#### 2.3 Redundancy Strategy

**Application Tier**:
- **3x API instances** in primary region (AKS pods)
- **2x AI Engine instances** with load balancing
- **Auto-scaling**: 3-10 instances based on load
- **Health checks**: Every 10 seconds
- **Circuit breakers**: Fail fast, prevent cascade

**Data Tier**:
- **PostgreSQL**: Primary + 2 read replicas
- **Neo4j**: 3-node cluster (1 leader, 2 followers)
- **Redis**: 3-node cluster with sentinel
- **Replication lag**: < 1 second
- **Automatic failover**: < 60 seconds

**Network Tier**:
- **Azure Front Door**: Global load balancer
- **Multi-region**: South Africa (primary), Europe (secondary), US (DR)
- **CDN**: Static assets cached at edge
- **DDoS Protection**: Azure DDoS Standard

#### 2.4 Failure Modes & Recovery

| Failure Type | Detection Time | Recovery Action | Recovery Time | Data Loss |
|--------------|----------------|-----------------|---------------|-----------|
| **Pod Crash** | 10s (health check) | Restart pod | 30s | None |
| **Node Failure** | 30s (kubelet) | Reschedule pods | 2m | None |
| **DB Primary Failure** | 15s (replication lag) | Promote replica | 60s | < 1s of writes |
| **Region Outage** | 60s (health checks) | Failover to secondary | 5m | < 5s of writes |
| **Data Source Outage** | 30s (ingestion timeout) | Use cached data | Immediate | Recommendations delayed |

#### 2.5 Circuit Breaker Pattern

```python
# services/circuit_breaker.py

from enum import Enum
from datetime import datetime, timedelta
from typing import Callable, Any
import threading

class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failures detected, block requests
    HALF_OPEN = "half_open"  # Testing if service recovered

class CircuitBreaker:
    """Prevent cascade failures by failing fast"""
    
    def __init__(
        self,
        failure_threshold: int = 5,
        timeout: timedelta = timedelta(seconds=60),
        expected_exception: Exception = Exception
    ):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
        self.lock = threading.Lock()
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        with self.lock:
            if self.state == CircuitState.OPEN:
                if self._should_attempt_reset():
                    self.state = CircuitState.HALF_OPEN
                else:
                    raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except self.expected_exception as e:
            self._on_failure()
            raise e
    
    def _on_success(self):
        """Reset circuit breaker on successful call"""
        with self.lock:
            self.failure_count = 0
            self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        """Handle failure"""
        with self.lock:
            self.failure_count += 1
            self.last_failure_time = datetime.now()
            
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to retry"""
        return (
            self.last_failure_time and
            datetime.now() - self.last_failure_time >= self.timeout
        )

# Usage in data ingestion
class DataIngestionService:
    def __init__(self):
        self.jse_circuit = CircuitBreaker(failure_threshold=3, timeout=timedelta(minutes=5))
        self.reuters_circuit = CircuitBreaker(failure_threshold=3, timeout=timedelta(minutes=5))
    
    def ingest_stock_prices(self):
        """Ingest stock prices with circuit breaker protection"""
        try:
            # Try primary source (JSE)
            data = self.jse_circuit.call(self._fetch_from_jse)
            return data
        except Exception as e:
            logger.warning(f"JSE ingestion failed: {e}, trying fallback")
            try:
                # Fallback to Reuters
                data = self.reuters_circuit.call(self._fetch_from_reuters)
                return data
            except Exception as e2:
                logger.error(f"All data sources failed: {e2}")
                # Use cached data
                return self._get_cached_data()
```

#### 2.6 Graceful Degradation

**Degradation Levels**:

| Level | Condition | Available Features | User Impact |
|-------|-----------|-------------------|-------------|
| **Normal** | All systems operational | Full features | None |
| **Degraded 1** | Data source delayed | Recommendations with warning | Minimal |
| **Degraded 2** | AI engine slow | Cached recommendations | Moderate |
| **Degraded 3** | Database read-only | View only, no new recs | Significant |
| **Emergency** | Critical failure | Static content only | Severe |

**Implementation**:
```python
class SystemHealthService:
    def get_degradation_level(self) -> int:
        """Determine current system degradation level"""
        health_scores = {
            'data_freshness': self._check_data_freshness(),
            'ai_latency': self._check_ai_latency(),
            'db_status': self._check_db_status(),
            'api_errors': self._check_api_errors()
        }
        
        # Calculate overall health
        if all(score > 0.95 for score in health_scores.values()):
            return 0  # Normal
        elif all(score > 0.80 for score in health_scores.values()):
            return 1  # Degraded 1
        elif all(score > 0.60 for score in health_scores.values()):
            return 2  # Degraded 2
        elif any(score > 0.40 for score in health_scores.values()):
            return 3  # Degraded 3
        else:
            return 4  # Emergency
```

#### 2.7 Monitoring & Alerting

**Key Metrics**:
- **Availability**: % uptime per component
- **Latency**: P50, P95, P99 response times
- **Error Rate**: % of failed requests
- **Throughput**: Requests per second
- **Saturation**: CPU, memory, disk usage

**Alert Rules**:
```yaml
# alerts/reliability.yaml

groups:
  - name: reliability
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% over last 5 minutes"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency"
          description: "P95 latency is {{ $value }}s"
      
      - alert: DatabaseReplicationLag
        expr: pg_replication_lag_seconds > 5
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database replication lag high"
          description: "Replication lag is {{ $value }}s"
```

---

## Criterion 3: Well-Defined Goals

### Definition
**Well-Defined Goals** means MOBU has clear, measurable success criteria including Sharpe ratio and risk-adjusted returns.

### Components

#### 3.1 Success Metrics Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SUCCESS METRICS PYRAMID                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                     ┌─────────────────┐                     │
│                     │   Portfolio     │                     │
│                     │  Performance    │                     │
│                     │  (Sharpe > 1.5) │                     │
│                     └────────┬────────┘                     │
│                              │                              │
│             ┌────────────────┼────────────────┐            │
│             │                                 │            │
│      ┌──────▼───────┐               ┌────────▼────────┐   │
│      │ Recommendation│               │ Risk Management │   │
│      │   Accuracy    │               │   (Max DD 15%)  │   │
│      │  (Win Rate    │               │                 │   │
│      │    > 65%)     │               │                 │   │
│      └──────┬───────┘               └────────┬────────┘   │
│             │                                 │            │
│   ┌─────────┼─────────┐             ┌────────┼────────┐   │
│   │         │         │             │        │        │   │
│ ┌─▼──┐   ┌─▼──┐   ┌─▼──┐       ┌──▼───┐ ┌──▼───┐ ┌──▼──┐│
│ │Data│   │ AI │   │UX  │       │Divers│ │Risk  │ │ Max │││
│ │Qual│   │Conf│   │Eng │       │ ific││ │Adjst│ │Loss │││
│ └────┘   └────┘   └────┘       └──────┘ └──────┘ └─────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2 Primary Goal: Portfolio Performance

**Target Metrics**:

| Metric | Target | Measurement Period | Benchmark |
|--------|--------|-------------------|-----------|
| **Sharpe Ratio** | > 1.5 | Trailing 12 months | S&P 500: ~0.9 |
| **Annualized Return** | > JSE Top 40 + 5% | 12 months | JSE Top 40 |
| **Win Rate** | > 65% | Per recommendation | Industry: 55% |
| **Max Drawdown** | < 15% | Rolling 12 months | Acceptable: < 20% |
| **Information Ratio** | > 0.5 | 12 months | Active managers: 0.4 |

**Sharpe Ratio Calculation**:
```python
def calculate_sharpe_ratio(
    returns: np.array,
    risk_free_rate: float = 0.05  # South African risk-free rate
) -> float:
    """
    Calculate annualized Sharpe ratio
    
    Sharpe = (Mean Return - Risk Free Rate) / Std Dev of Returns
    
    Target: > 1.5 (excellent performance)
    """
    excess_returns = returns - risk_free_rate / 252  # Daily risk-free rate
    
    if len(excess_returns) == 0:
        return 0.0
    
    sharpe = np.mean(excess_returns) / np.std(excess_returns)
    
    # Annualize (assuming 252 trading days)
    sharpe_annualized = sharpe * np.sqrt(252)
    
    return sharpe_annualized
```

#### 3.3 Recommendation-Level Goals

**Per-Recommendation Metrics**:

```python
@dataclass
class RecommendationGoals:
    """Success criteria for individual recommendations"""
    
    # Target metrics
    expected_return: float  # % return expected
    holding_period: int  # Days to hold
    confidence_threshold: float  # Min 0.75 to show to users
    
    # Risk limits
    max_position_size: float  # % of portfolio (max 10%)
    stop_loss: float  # % loss to trigger exit (-15%)
    take_profit: float  # % gain to trigger exit (+25%)
    
    # Success criteria
    def is_successful(self, actual_return: float, holding_days: int) -> bool:
        """Define success: return > 0 within holding period"""
        if holding_days > self.holding_period:
            # Holding too long = failure
            return False
        
        # Success if positive return
        return actual_return > 0
    
    def calculate_score(self, actual_return: float, holding_days: int) -> float:
        """
        Score recommendation outcome (0-100)
        
        Score factors:
        - Return magnitude (50%)
        - Return vs expectation (30%)
        - Timing (20%)
        """
        # Return magnitude score
        return_score = min(actual_return / 0.25, 1.0) * 50  # Cap at 25% return
        
        # Expectation score
        expectation_score = min(actual_return / self.expected_return, 1.0) * 30
        
        # Timing score
        timing_score = (1 - holding_days / self.holding_period) * 20
        
        total_score = return_score + expectation_score + timing_score
        
        return max(0, min(100, total_score))
```

#### 3.4 Success/Failure Definition

**Recommendation Outcomes**:

| Outcome | Definition | Action | Learning |
|---------|-----------|--------|----------|
| **Strong Success** | Return > 15% within period | Increase confidence in similar patterns | Boost feature weights |
| **Success** | Return > 0% within period | Continue current approach | Maintain weights |
| **Weak Failure** | Return -5% to 0% | Review recommendation logic | Slight weight adjustment |
| **Failure** | Return < -5% | Investigate root cause | Reduce feature weights |
| **Critical Failure** | Return < -15% | Emergency review, halt similar recs | Major model update |

**Database Schema**:
```sql
-- Track recommendation outcomes
CREATE TABLE recommendation_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES recommendations(id),
    
    -- Entry
    entry_date DATE NOT NULL,
    entry_price DECIMAL(10,2) NOT NULL,
    
    -- Exit
    exit_date DATE,
    exit_price DECIMAL(10,2),
    exit_reason VARCHAR(50), -- 'target_reached', 'stop_loss', 'time_expired'
    
    -- Performance
    return_pct DECIMAL(6,2),
    holding_days INTEGER,
    
    -- Goals
    expected_return DECIMAL(6,2),
    target_holding_days INTEGER,
    
    -- Outcome
    outcome_type VARCHAR(20), -- 'strong_success', 'success', 'weak_failure', 'failure', 'critical_failure'
    outcome_score DECIMAL(5,2), -- 0-100
    
    -- Metrics
    sharpe_contribution DECIMAL(6,4),
    risk_adjusted_return DECIMAL(6,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_outcomes_recommendation ON recommendation_outcomes(recommendation_id);
CREATE INDEX idx_outcomes_date ON recommendation_outcomes(exit_date);
CREATE INDEX idx_outcomes_type ON recommendation_outcomes(outcome_type);
```

#### 3.5 Goal Tracking Dashboard

**Real-Time Metrics**:
```python
class GoalTrackingService:
    """Track progress toward defined goals"""
    
    def get_current_metrics(self) -> Dict:
        """Get current performance vs goals"""
        return {
            'sharpe_ratio': {
                'current': self._calculate_current_sharpe(),
                'target': 1.5,
                'status': 'on_track' if self._calculate_current_sharpe() > 1.3 else 'needs_improvement'
            },
            'win_rate': {
                'current': self._calculate_win_rate(),
                'target': 0.65,
                'status': 'on_track' if self._calculate_win_rate() > 0.60 else 'needs_improvement'
            },
            'max_drawdown': {
                'current': self._calculate_max_drawdown(),
                'target': 0.15,
                'status': 'on_track' if self._calculate_max_drawdown() < 0.18 else 'at_risk'
            },
            'avg_return': {
                'current': self._calculate_avg_return(),
                'target': self._get_benchmark_return() + 0.05,
                'status': self._compare_to_benchmark()
            }
        }
    
    def _calculate_current_sharpe(self) -> float:
        """Calculate Sharpe ratio for trailing 12 months"""
        query = """
            SELECT return_pct
            FROM recommendation_outcomes
            WHERE exit_date > NOW() - INTERVAL '12 months'
            AND exit_date IS NOT NULL
            ORDER BY exit_date
        """
        returns = self.db.query(query)
        return calculate_sharpe_ratio(np.array(returns))
```

---

## Criterion 4: Self-Improving

### Definition
**Self-Improving** means MOBU learns from every recommendation outcome to continuously optimize performance.

### Components

#### 4.1 Learning Loop

```
┌────────────────────────────────────────────────────────────┐
│                    SELF-IMPROVING LOOP                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                          │
│  │ Generate    │                                          │
│  │ Recommend   │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ User Acts   │                                          │
│  │ (or Ignores)│                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ Track       │                                          │
│  │ Outcome     │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ Analyze     │                                          │
│  │ Performance │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ Extract     │                                          │
│  │ Learnings   │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ Update      │                                          │
│  │ Model       │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         └─────────────┐                                   │
│                       │                                   │
│         ┌─────────────┘                                   │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ A/B Test    │                                          │
│  │ New Model   │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                          │
│  │ Deploy if   │                                          │
│  │ Better      │                                          │
│  └──────┬──────┘                                          │
│         │                                                  │
│         └────────► (Loop continues)                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### 4.2 Feature Importance Learning

**Track Feature Performance**:
```python
class FeatureLearningService:
    """Learn which features drive successful recommendations"""
    
    def analyze_feature_importance(
        self,
        recommendation_id: UUID
    ) -> Dict[str, float]:
        """
        Analyze which features contributed to outcome
        
        Returns: Dict of feature -> importance score
        """
        # Get recommendation details
        rec = self.db.get_recommendation(recommendation_id)
        outcome = self.db.get_outcome(recommendation_id)
        
        # Get evidence nodes
        evidence = self.db.get_evidence_nodes(recommendation_id)
        
        # Calculate contribution of each evidence node
        importance_scores = {}
        for node in evidence:
            # Weight by node confidence and outcome success
            node_contribution = (
                node['confidence'] *
                outcome['outcome_score'] / 100 *
                node['weight_in_decision']
            )
            importance_scores[node['type']] = node_contribution
        
        return importance_scores
    
    def update_feature_weights(self):
        """
        Update model feature weights based on historical performance
        
        Runs daily to incorporate learnings
        """
        # Get all outcomes from last 90 days
        query = """
            SELECT 
                ro.recommendation_id,
                ro.outcome_type,
                ro.outcome_score,
                ro.return_pct
            FROM recommendation_outcomes ro
            WHERE ro.exit_date > NOW() - INTERVAL '90 days'
            AND ro.exit_date IS NOT NULL
        """
        outcomes = self.db.query(query)
        
        # Aggregate feature importance across all outcomes
        feature_performance = defaultdict(list)
        
        for outcome in outcomes:
            importance = self.analyze_feature_importance(outcome['recommendation_id'])
            for feature, score in importance.items():
                feature_performance[feature].append(score)
        
        # Calculate average importance per feature
        new_weights = {}
        for feature, scores in feature_performance.items():
            new_weights[feature] = np.mean(scores)
        
        # Normalize weights to sum to 1.0
        total = sum(new_weights.values())
        new_weights = {k: v/total for k, v in new_weights.items()}
        
        # Store new weights
        self.db.save_feature_weights(new_weights, version=self._get_next_version())
        
        logger.info(f"Updated feature weights: {new_weights}")
        
        return new_weights
```

#### 4.3 Model Retraining Pipeline

**Automated Retraining**:
```python
class ModelRetrainingService:
    """Automatically retrain AI models based on new data"""
    
    def __init__(self):
        self.retrain_schedule = 'weekly'  # Retrain every week
        self.min_new_samples = 100  # Need 100 new outcomes
        self.performance_threshold = 0.02  # Must improve by 2%
    
    def should_retrain(self) -> bool:
        """Check if it's time to retrain"""
        # Check if enough new data
        new_samples = self.db.count_outcomes_since_last_training()
        if new_samples < self.min_new_samples:
            return False
        
        # Check if last training was > 7 days ago
        last_training = self.db.get_last_training_date()
        if (datetime.now() - last_training).days < 7:
            return False
        
        return True
    
    async def retrain_model(self):
        """Retrain AI model with new data"""
        logger.info("Starting model retraining")
        
        # 1. Prepare training data
        train_data = self._prepare_training_data()
        logger.info(f"Training data: {len(train_data)} samples")
        
        # 2. Split data
        train_set, val_set, test_set = self._split_data(train_data)
        
        # 3. Train new model
        new_model = await self._train_model(train_set, val_set)
        
        # 4. Evaluate on test set
        new_performance = self._evaluate_model(new_model, test_set)
        old_performance = self._get_current_model_performance()
        
        logger.info(f"New model Sharpe: {new_performance['sharpe']:.3f}")
        logger.info(f"Old model Sharpe: {old_performance['sharpe']:.3f}")
        
        # 5. Compare to current model
        improvement = new_performance['sharpe'] - old_performance['sharpe']
        
        if improvement > self.performance_threshold:
            # New model is better - deploy it
            logger.info(f"New model improves Sharpe by {improvement:.3f}, deploying")
            await self._deploy_model(new_model)
            return True
        else:
            # Keep old model
            logger.info(f"New model doesn't improve enough ({improvement:.3f} < {self.performance_threshold}), keeping old model")
            return False
    
    def _prepare_training_data(self) -> pd.DataFrame:
        """Prepare features and labels for training"""
        query = """
            SELECT 
                r.id,
                r.ticker,
                r.confidence,
                r.features,
                ro.return_pct,
                ro.outcome_score,
                ro.outcome_type
            FROM recommendations r
            JOIN recommendation_outcomes ro ON r.id = ro.recommendation_id
            WHERE ro.exit_date IS NOT NULL
            ORDER BY ro.exit_date DESC
            LIMIT 10000
        """
        return pd.read_sql(query, self.db.connection)
```

#### 4.4 A/B Testing Framework

**Test New Models Safely**:
```python
class ABTestingService:
    """A/B test new models before full deployment"""
    
    def __init__(self):
        self.test_duration_days = 14  # Test for 2 weeks
        self.test_traffic_pct = 0.20  # 20% of users see new model
        self.confidence_level = 0.95  # 95% statistical confidence
    
    def start_ab_test(
        self,
        model_a: str,  # Current model (control)
        model_b: str,  # New model (treatment)
        test_name: str
    ):
        """Start A/B test of new model"""
        test = {
            'name': test_name,
            'model_a': model_a,
            'model_b': model_b,
            'start_date': datetime.now(),
            'end_date': datetime.now() + timedelta(days=self.test_duration_days),
            'traffic_split': {'A': 0.80, 'B': 0.20},
            'status': 'running'
        }
        
        self.db.save_ab_test(test)
        logger.info(f"Started A/B test: {test_name}")
        
        return test
    
    def assign_user_to_variant(self, user_id: str, test_name: str) -> str:
        """Consistently assign user to A or B variant"""
        # Hash user_id to get consistent assignment
        hash_val = int(hashlib.md5(f"{user_id}{test_name}".encode()).hexdigest(), 16)
        
        # 80% get A (control), 20% get B (treatment)
        return 'B' if hash_val % 100 < 20 else 'A'
    
    def evaluate_ab_test(self, test_name: str) -> Dict:
        """Evaluate A/B test results"""
        # Get results for both variants
        results_a = self._get_variant_results(test_name, 'A')
        results_b = self._get_variant_results(test_name, 'B')
        
        # Statistical significance test
        p_value = self._calculate_p_value(results_a, results_b)
        is_significant = p_value < (1 - self.confidence_level)
        
        # Calculate metrics
        sharpe_a = results_a['sharpe_ratio']
        sharpe_b = results_b['sharpe_ratio']
        improvement = (sharpe_b - sharpe_a) / sharpe_a
        
        # Decision
        if is_significant and improvement > 0.05:
            decision = 'deploy_b'
            reason = f"Model B improves Sharpe by {improvement:.1%} with {self.confidence_level:.0%} confidence"
        elif is_significant and improvement < -0.05:
            decision = 'keep_a'
            reason = f"Model B performs worse by {abs(improvement):.1%}"
        else:
            decision = 'inconclusive'
            reason = f"Not enough evidence (p={p_value:.3f}, improvement={improvement:.1%})"
        
        return {
            'test_name': test_name,
            'variant_a': results_a,
            'variant_b': results_b,
            'p_value': p_value,
            'is_significant': is_significant,
            'improvement': improvement,
            'decision': decision,
            'reason': reason
        }
```

#### 4.5 Learning From Failures

**Failure Analysis Pipeline**:
```python
class FailureAnalysisService:
    """Analyze failed recommendations to prevent recurrence"""
    
    def analyze_failure(self, recommendation_id: UUID):
        """Deep dive into why a recommendation failed"""
        # Get full context
        rec = self.db.get_recommendation(recommendation_id)
        outcome = self.db.get_outcome(recommendation_id)
        evidence = self.db.get_evidence_graph(recommendation_id)
        market_context = self.db.get_market_conditions(rec['created_at'])
        
        # Analyze failure type
        failure_analysis = {
            'recommendation_id': recommendation_id,
            'ticker': rec['ticker'],
            'return_pct': outcome['return_pct'],
            'failure_severity': self._classify_failure_severity(outcome['return_pct']),
            'root_causes': [],
            'lessons_learned': [],
            'corrective_actions': []
        }
        
        # Check for data quality issues
        if self._had_data_quality_issues(rec):
            failure_analysis['root_causes'].append('data_quality')
            failure_analysis['lessons_learned'].append('Improve data validation for this source')
            failure_analysis['corrective_actions'].append('Add stricter validation rules')
        
        # Check for market regime change
        if self._detected_regime_change(market_context):
            failure_analysis['root_causes'].append('market_regime_change')
            failure_analysis['lessons_learned'].append('Model didn't adapt to new market conditions')
            failure_analysis['corrective_actions'].append('Add regime detection features')
        
        # Check for overconfidence
        if rec['confidence'] > 0.90 and outcome['return_pct'] < -10:
            failure_analysis['root_causes'].append('overconfidence')
            failure_analysis['lessons_learned'].append('High confidence didn't translate to success')
            failure_analysis['corrective_actions'].append('Recalibrate confidence model')
        
        # Check for ignored signals
        ignored_signals = self._find_contradicting_evidence(evidence)
        if ignored_signals:
            failure_analysis['root_causes'].append('ignored_negative_signals')
            failure_analysis['lessons_learned'].append(f'Ignored {len(ignored_signals)} negative signals')
            failure_analysis['corrective_actions'].append('Increase weight of negative evidence')
        
        # Save analysis
        self.db.save_failure_analysis(failure_analysis)
        
        # Create tickets for corrective actions
        for action in failure_analysis['corrective_actions']:
            self._create_improvement_ticket(action, priority='high')
        
        return failure_analysis
```

---

## Architecture Updates

### 5.1 New Components Required

**Add to System Architecture**:

1. **Data Quality Service** (New)
   - Real-time validation
   - Cross-source reconciliation
   - Accuracy tracking

2. **Goal Tracking Service** (New)
   - Sharpe ratio calculation
   - Outcome tracking
   - Performance dashboards

3. **Learning Pipeline** (New)
   - Feature importance analysis
   - Model retraining
   - A/B testing framework

4. **Failure Analysis Service** (New)
   - Root cause analysis
   - Pattern detection
   - Corrective actions

### 5.2 Updated Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                   MOBU ENHANCED ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │   Data Sources  │────────▶│  Data Quality   │               │
│  │ (JSE, Reuters)  │         │    Service      │               │
│  └─────────────────┘         └────────┬────────┘               │
│                                        │                         │
│                                        ▼                         │
│                              ┌─────────────────┐                │
│                              │   PostgreSQL    │                │
│                              │  (Validated)    │                │
│                              └────────┬────────┘                │
│                                       │                          │
│                                       ▼                          │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │   AI Engine     │◀────────│  Feature Store  │               │
│  │                 │         │                 │               │
│  └────────┬────────┘         └─────────────────┘               │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │ Recommendations │────────▶│  Goal Tracking  │               │
│  │                 │         │    Service      │               │
│  └────────┬────────┘         └────────┬────────┘               │
│           │                           │                         │
│           │                           ▼                         │
│           │                  ┌─────────────────┐               │
│           │                  │   Sharpe Ratio  │               │
│           │                  │   Calculator    │               │
│           │                  └────────┬────────┘               │
│           │                           │                         │
│           ▼                           ▼                         │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │ Outcome Tracker │────────▶│    Learning     │               │
│  │                 │         │    Pipeline     │               │
│  └─────────────────┘         └────────┬────────┘               │
│                                        │                         │
│                                        ▼                         │
│                              ┌─────────────────┐                │
│                              │ Model Retrainer │                │
│                              │   (Weekly)      │                │
│                              └────────┬────────┘                │
│                                       │                          │
│                                       ▼                          │
│                              ┌─────────────────┐                │
│                              │   A/B Testing   │                │
│                              │   Framework     │                │
│                              └────────┬────────┘                │
│                                       │                          │
│                                       ▼                          │
│                              ┌─────────────────┐                │
│                              │ Deploy if Better│                │
│                              └─────────────────┘                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Accuracy & Reliability (Weeks 1-4)

**Week 1-2: Data Quality**
- [ ] Implement Data Quality Service
- [ ] Add validation rules for all data sources
- [ ] Create accuracy tracking dashboard
- [ ] Set up cross-source validation

**Week 3-4: Reliability**
- [ ] Configure multi-region deployment
- [ ] Implement circuit breakers
- [ ] Add graceful degradation
- [ ] Set up monitoring & alerting

### Phase 2: Goals & Tracking (Weeks 5-8)

**Week 5-6: Goal Definition**
- [ ] Implement Goal Tracking Service
- [ ] Add Sharpe ratio calculation
- [ ] Create outcome tracking tables
- [ ] Build performance dashboard

**Week 7-8: Success Metrics**
- [ ] Define success/failure criteria
- [ ] Implement scoring system
- [ ] Create real-time metrics API
- [ ] Build investor-facing dashboards

### Phase 3: Self-Improvement (Weeks 9-12)

**Week 9-10: Learning Pipeline**
- [ ] Implement Feature Learning Service
- [ ] Build model retraining pipeline
- [ ] Add feature importance tracking
- [ ] Create learning loop

**Week 11-12: Continuous Optimization**
- [ ] Implement A/B testing framework
- [ ] Build failure analysis service
- [ ] Add automated model updates
- [ ] Create learning dashboards

---

## Monitoring & Alerting

### Dashboard Widgets

**1. Accuracy Dashboard**
- Data quality score (target: 99.95%)
- Validation pass rate
- Cross-source consistency
- Data freshness

**2. Reliability Dashboard**
- System uptime (target: 99.9%)
- API latency (P50, P95, P99)
- Error rates
- Circuit breaker status

**3. Goals Dashboard**
- Current Sharpe ratio vs target (1.5)
- Win rate vs target (65%)
- Max drawdown vs limit (15%)
- Return vs benchmark

**4. Learning Dashboard**
- Model version & last training date
- Feature importance rankings
- A/B test results
- Improvement trends

---

## Regulatory Compliance

### Audit Trail Requirements

**All 4 Criteria Must Be Auditable**:

1. **Accuracy**: Prove data quality through validation logs
2. **Reliability**: Demonstrate 99.9% uptime through monitoring logs
3. **Goals**: Show clear performance metrics and Sharpe ratios
4. **Self-Improving**: Document model updates and A/B test results

**Audit Reports**:
```python
class RegulatoryReportingService:
    """Generate audit reports for regulators"""
    
    def generate_quarterly_report(self, quarter: str) -> Dict:
        """Generate comprehensive quarterly audit report"""
        return {
            'accuracy': {
                'data_quality_score': self._get_avg_accuracy(quarter),
                'validation_failures': self._count_validation_failures(quarter),
                'corrective_actions': self._list_corrections(quarter)
            },
            'reliability': {
                'uptime_pct': self._calculate_uptime(quarter),
                'incidents': self._list_incidents(quarter),
                'mttr': self._calculate_mttr(quarter)  # Mean time to repair
            },
            'goals': {
                'sharpe_ratio': self._calculate_sharpe(quarter),
                'win_rate': self._calculate_win_rate(quarter),
                'vs_benchmark': self._compare_to_benchmark(quarter),
                'goal_achievement': self._assess_goals(quarter)
            },
            'self_improving': {
                'models_trained': self._count_retrainings(quarter),
                'performance_improvements': self._measure_improvements(quarter),
                'ab_tests_run': self._list_ab_tests(quarter),
                'lessons_learned': self._summarize_learnings(quarter)
            }
        }
```

---

## Success Criteria

### Definition of Done

**MOBU is compliant when**:

✅ **Accuracy**:
- Data quality score > 99.95%
- All data sources have validation rules
- Cross-source consistency > 99%
- Real-time accuracy dashboards operational

✅ **Reliability**:
- System uptime > 99.9%
- Multi-region deployment active
- Circuit breakers implemented
- Graceful degradation tested

✅ **Well-Defined Goals**:
- Sharpe ratio calculation implemented
- Target: > 1.5 (defined and tracked)
- Win rate target: > 65% (tracked)
- Max drawdown limit: < 15% (enforced)
- Real-time goal dashboards

✅ **Self-Improving**:
- Learning pipeline operational
- Weekly model retraining automated
- A/B testing framework active
- Failure analysis automated
- Performance improvements documented

---

## Next Steps

1. **Review this framework** with technical team
2. **Prioritize implementation** based on MVP timeline
3. **Allocate resources** (2 backend engineers, 1 ML engineer)
4. **Set milestones** for each phase
5. **Begin Phase 1** (Accuracy & Reliability)

---

**Document Status**: ✅ Complete and Ready for Implementation  
**Owner**: CTO / Lead AI Engineer  
**Review Date**: Weekly during implementation  
**Success Metric**: All 4 criteria operational within 12 weeks

