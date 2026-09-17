# MOBU Strategy Configuration

## Overview

The `strategy.yaml` file contains all configurable parameters for MOBU's AI Quality Framework. Adjust goals, thresholds, and behavior without modifying code.

## Quick Configuration Changes

### Adjust Sharpe Ratio Target
```yaml
goals:
  sharpe_ratio:
    target: 1.5        # Change to 1.7 for higher bar
```

### Change Retraining Schedule
```yaml
self_improving:
  retraining:
    schedule: "weekly"      # Options: weekly, biweekly, monthly
```

### Modify Risk Limits
```yaml
goals:
  max_drawdown:
    limit: 0.15        # 15% max drawdown
```

Changes take effect immediately (hot reload).

## Support
Questions: technical-team@mobu.co.za
