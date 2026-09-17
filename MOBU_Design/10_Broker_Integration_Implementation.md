# MOBU Investment Platform
## Broker Integration Implementation Guide

**Version:** 1.0  
**Date:** September 2026  
**Status:** Technical Implementation Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Broker Selection & Analysis](#2-broker-selection--analysis)
3. [Integration Architecture](#3-integration-architecture)
4. [Implementation: Interactive Brokers](#4-implementation-interactive-brokers)
5. [Implementation: Alpaca Broker API](#5-implementation-alpaca-broker-api)
6. [Implementation: EasyEquities (Unofficial)](#6-implementation-easyequities-unofficial)
7. [Trade Execution Flow](#7-trade-execution-flow)
8. [Security & Compliance](#8-security--compliance)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Roadmap](#10-deployment-roadmap)

---

## 1. Executive Summary

### Current State
MOBU provides **AI-powered investment recommendations** with full transparency and evidence trails. Users can see WHY they should invest, but cannot yet execute trades directly.

### Target State
Users can **execute MOBU recommendations with 1-click** through integrated broker accounts:
- **African users**: Trade JSE, NGX, NSE via EasyEquities, Bamboo, Chaka
- **Global users**: Trade NYSE, NASDAQ, LSE via Interactive Brokers, Alpaca
- **Seamless flow**: Recommendation → Click "Execute" → Trade sent to broker → Confirmation

### Broker Integration Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   MOBU RECOMMENDATION                        │
│  "Buy DANGCEM (NGX) - 85% confidence based on:              │
│   • Insider buying +$2M                                      │
│   • Q3 earnings beat by 15%                                  │
│   • Government contract awarded"                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  User Clicks "Execute" │
        └────────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              MOBU BROKER ROUTING LAYER                       │
│  • Detects user's connected broker                           │
│  • Routes trade to correct API                               │
│  • Handles authentication (OAuth2, API keys)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼────────────┬───────────────┐
         │           │            │               │
         ▼           ▼            ▼               ▼
┌─────────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐
│ Interactive │ │ Alpaca  │ │  Easy    │ │   Bamboo     │
│  Brokers    │ │ (US)    │ │ Equities │ │  (Africa)    │
│ (Global)    │ │         │ │  (SA)    │ │              │
└─────┬───────┘ └────┬────┘ └────┬─────┘ └──────┬───────┘
      │              │           │               │
      └──────────────┴───────────┴───────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Stock Exchange │
            │  (NYSE, NGX,    │
            │   JSE, NSE)     │
            └────────────────┘
```

---

## 2. Broker Selection & Analysis

### 2.1 Recommended Brokers for MOBU

| Broker | API Available | Markets | Target Users | Integration Difficulty | Priority |
|--------|---------------|---------|--------------|----------------------|----------|
| **Interactive Brokers** | ✅ Yes (Web API, FIX, TWS) | Global (150+ markets) | Professional traders | Medium | **HIGH** |
| **Alpaca** | ✅ Yes (Broker API) | US stocks, options, crypto | US + International | Easy | **HIGH** |
| **EasyEquities** | ⚠️ Unofficial (reverse-engineered) | JSE, NYSE, NASDAQ | South Africa | Hard (unofficial) | MEDIUM |
| **Bamboo** | ⚠️ No public API | NYSE, NASDAQ | Nigeria, Ghana, Kenya | N/A (partnership needed) | LOW |
| **Chaka** | ⚠️ Limited API | NYSE, NASDAQ, Crypto | Nigeria, Ghana | Medium | LOW |

### 2.2 Decision Matrix

**Phase 1 (Immediate)**: 
- **Interactive Brokers** (global reach, 150+ markets, official API)
- **Alpaca Broker API** (easy integration, US markets, paper trading built-in)

**Phase 2 (3-6 months)**:
- **EasyEquities** (unofficial scraping, South African dominance)
- **Partnerships** with Bamboo, Chaka (negotiate API access)

**Why Interactive Brokers + Alpaca First?**
1. **Official APIs**: Well-documented, stable, supported
2. **Global reach**: Interactive Brokers covers African exchanges (JSE via global platform)
3. **Ease of integration**: Both have RESTful APIs, OAuth2
4. **Paper trading**: Both offer sandbox environments
5. **Proven track record**: Used by thousands of fintech apps

---

## 3. Integration Architecture

### 3.1 Broker Abstraction Layer

Instead of coupling MOBU to specific broker implementations, create an abstraction layer:

```python
# mobu_backend/brokers/base.py
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class BrokerAccount:
    """Standardized broker account representation"""
    account_id: str
    broker_name: str
    cash_balance: float
    portfolio_value: float
    buying_power: float
    currency: str

@dataclass
class BrokerPosition:
    """Standardized position representation"""
    symbol: str
    quantity: float
    avg_entry_price: float
    current_price: float
    market_value: float
    unrealized_pnl: float
    unrealized_pnl_pct: float

@dataclass
class BrokerOrder:
    """Standardized order representation"""
    order_id: str
    symbol: str
    side: str  # 'buy' or 'sell'
    quantity: float
    order_type: str  # 'market', 'limit', 'stop'
    limit_price: Optional[float]
    stop_price: Optional[float]
    status: str  # 'pending', 'filled', 'cancelled', 'rejected'
    filled_qty: float
    avg_fill_price: float
    submitted_at: str
    filled_at: Optional[str]

class BrokerAdapter(ABC):
    """
    Abstract base class for all broker integrations.
    Each broker implements this interface.
    """
    
    def __init__(self, api_key: str, api_secret: str, paper_trading: bool = False):
        self.api_key = api_key
        self.api_secret = api_secret
        self.paper_trading = paper_trading
    
    @abstractmethod
    def get_account(self) -> BrokerAccount:
        """Fetch account balance and buying power"""
        pass
    
    @abstractmethod
    def get_positions(self) -> List[BrokerPosition]:
        """Fetch current open positions"""
        pass
    
    @abstractmethod
    def place_order(
        self, 
        symbol: str, 
        side: str, 
        quantity: float, 
        order_type: str = 'market',
        limit_price: Optional[float] = None,
        stop_price: Optional[float] = None
    ) -> BrokerOrder:
        """Place a buy/sell order"""
        pass
    
    @abstractmethod
    def get_order(self, order_id: str) -> BrokerOrder:
        """Get order status"""
        pass
    
    @abstractmethod
    def cancel_order(self, order_id: str) -> bool:
        """Cancel pending order"""
        pass
    
    @abstractmethod
    def get_market_price(self, symbol: str) -> float:
        """Get current market price for symbol"""
        pass
```

### 3.2 Broker Factory Pattern

```python
# mobu_backend/brokers/factory.py
from typing import Dict, Type
from .base import BrokerAdapter
from .interactive_brokers import InteractiveBrokersAdapter
from .alpaca import AlpacaAdapter
from .easyequities import EasyEquitiesAdapter

class BrokerFactory:
    """
    Factory to instantiate the correct broker adapter
    based on user's connected broker
    """
    
    _brokers: Dict[str, Type[BrokerAdapter]] = {
        'interactive_brokers': InteractiveBrokersAdapter,
        'alpaca': AlpacaAdapter,
        'easyequities': EasyEquitiesAdapter,
    }
    
    @classmethod
    def create(
        cls, 
        broker_name: str, 
        api_key: str, 
        api_secret: str, 
        paper_trading: bool = False
    ) -> BrokerAdapter:
        """
        Create broker adapter instance
        
        Args:
            broker_name: 'interactive_brokers', 'alpaca', 'easyequities'
            api_key: User's API key for broker
            api_secret: User's API secret
            paper_trading: If True, use paper trading mode
        
        Returns:
            BrokerAdapter instance
        """
        broker_class = cls._brokers.get(broker_name.lower())
        if not broker_class:
            raise ValueError(f"Unsupported broker: {broker_name}")
        
        return broker_class(
            api_key=api_key,
            api_secret=api_secret,
            paper_trading=paper_trading
        )
    
    @classmethod
    def supported_brokers(cls) -> List[str]:
        """Get list of supported brokers"""
        return list(cls._brokers.keys())
```

---

## 4. Implementation: Interactive Brokers

### 4.1 Why Interactive Brokers?

**Pros**:
- **150+ markets**: NYSE, NASDAQ, JSE (South Africa), NSE (Kenya), EGX (Egypt), etc.
- **Official API**: Web API (REST + WebSocket), FIX, TWS API
- **Low costs**: $0.005/share US stocks, competitive forex
- **Global reach**: Serves 200+ countries
- **Regulatory compliance**: SEC, FINRA, FCA, FSCA (South Africa)

**Cons**:
- **Minimum balance**: $0 for paper, $2,000 for live (US), varies by country
- **Complexity**: More complex API than Alpaca
- **Account approval**: Takes 1-2 days

### 4.2 Interactive Brokers Web API

**Documentation**: https://www.interactivebrokers.com/docs/web-api/trading/

**Authentication**: OAuth 2.0

**Base URL**: `https://api.ibkr.com/v1/api`

### 4.3 Implementation

```python
# mobu_backend/brokers/interactive_brokers.py
import requests
from typing import List, Optional
from .base import BrokerAdapter, BrokerAccount, BrokerPosition, BrokerOrder

class InteractiveBrokersAdapter(BrokerAdapter):
    """
    Interactive Brokers Web API integration
    Docs: https://www.interactivebrokers.com/docs/web-api/trading/
    """
    
    def __init__(self, api_key: str, api_secret: str, paper_trading: bool = False):
        super().__init__(api_key, api_secret, paper_trading)
        self.base_url = 'https://api.ibkr.com/v1/api'
        self.access_token = None
        self._authenticate()
    
    def _authenticate(self):
        """
        Authenticate with Interactive Brokers OAuth2
        """
        response = requests.post(
            f"{self.base_url}/token",
            data={
                'grant_type': 'client_credentials',
                'client_id': self.api_key,
                'client_secret': self.api_secret
            }
        )
        response.raise_for_status()
        self.access_token = response.json()['access_token']
    
    def _get_headers(self) -> dict:
        """Get authorization headers"""
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
    
    def get_account(self) -> BrokerAccount:
        """
        Fetch account balance
        GET /portfolio/accounts/{accountId}/summary
        """
        response = requests.get(
            f"{self.base_url}/portfolio/accounts",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        accounts = response.json()
        if not accounts:
            raise ValueError("No accounts found")
        
        account_id = accounts[0]['id']
        
        # Get account summary
        summary_response = requests.get(
            f"{self.base_url}/portfolio/accounts/{account_id}/summary",
            headers=self._get_headers()
        )
        summary_response.raise_for_status()
        summary = summary_response.json()
        
        return BrokerAccount(
            account_id=account_id,
            broker_name='interactive_brokers',
            cash_balance=summary.get('availableFunds', 0),
            portfolio_value=summary.get('totalCashValue', 0),
            buying_power=summary.get('buyingPower', 0),
            currency=summary.get('currency', 'USD')
        )
    
    def get_positions(self) -> List[BrokerPosition]:
        """
        Fetch current positions
        GET /portfolio/accounts/{accountId}/positions
        """
        account = self.get_account()
        
        response = requests.get(
            f"{self.base_url}/portfolio/accounts/{account.account_id}/positions",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        positions = []
        for pos in response.json():
            positions.append(BrokerPosition(
                symbol=pos['symbol'],
                quantity=pos['position'],
                avg_entry_price=pos['avgCost'],
                current_price=pos['marketPrice'],
                market_value=pos['marketValue'],
                unrealized_pnl=pos['unrealizedPnL'],
                unrealized_pnl_pct=(pos['unrealizedPnL'] / pos['avgCost']) * 100
            ))
        
        return positions
    
    def place_order(
        self,
        symbol: str,
        side: str,
        quantity: float,
        order_type: str = 'market',
        limit_price: Optional[float] = None,
        stop_price: Optional[float] = None
    ) -> BrokerOrder:
        """
        Place order
        POST /iserver/account/{accountId}/orders
        """
        account = self.get_account()
        
        order_data = {
            'conid': self._get_contract_id(symbol),  # Contract ID lookup
            'orderType': order_type.upper(),  # MKT, LMT, STP
            'side': 'BUY' if side == 'buy' else 'SELL',
            'quantity': quantity,
            'tif': 'DAY'  # Time in force
        }
        
        if order_type == 'limit' and limit_price:
            order_data['price'] = limit_price
        
        if order_type == 'stop' and stop_price:
            order_data['auxPrice'] = stop_price
        
        response = requests.post(
            f"{self.base_url}/iserver/account/{account.account_id}/orders",
            headers=self._get_headers(),
            json=order_data
        )
        response.raise_for_status()
        
        order_response = response.json()
        
        return BrokerOrder(
            order_id=order_response['order_id'],
            symbol=symbol,
            side=side,
            quantity=quantity,
            order_type=order_type,
            limit_price=limit_price,
            stop_price=stop_price,
            status='pending',
            filled_qty=0,
            avg_fill_price=0,
            submitted_at=order_response['order_time'],
            filled_at=None
        )
    
    def get_order(self, order_id: str) -> BrokerOrder:
        """
        Get order status
        GET /iserver/account/orders/{orderId}
        """
        response = requests.get(
            f"{self.base_url}/iserver/account/orders/{order_id}",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        order = response.json()
        
        return BrokerOrder(
            order_id=order['order_id'],
            symbol=order['symbol'],
            side='buy' if order['side'] == 'BUY' else 'sell',
            quantity=order['totalQuantity'],
            order_type=order['orderType'].lower(),
            limit_price=order.get('lmtPrice'),
            stop_price=order.get('auxPrice'),
            status=order['status'].lower(),
            filled_qty=order.get('filledQuantity', 0),
            avg_fill_price=order.get('avgPrice', 0),
            submitted_at=order['order_time'],
            filled_at=order.get('lastExecutionTime')
        )
    
    def cancel_order(self, order_id: str) -> bool:
        """
        Cancel order
        DELETE /iserver/account/orders/{orderId}
        """
        response = requests.delete(
            f"{self.base_url}/iserver/account/orders/{order_id}",
            headers=self._get_headers()
        )
        return response.status_code == 200
    
    def get_market_price(self, symbol: str) -> float:
        """
        Get current market price
        GET /iserver/marketdata/snapshot
        """
        conid = self._get_contract_id(symbol)
        
        response = requests.get(
            f"{self.base_url}/iserver/marketdata/snapshot",
            headers=self._get_headers(),
            params={'conids': conid, 'fields': '31'}  # Field 31 = Last Price
        )
        response.raise_for_status()
        
        data = response.json()
        return float(data[0]['31'])  # Last price
    
    def _get_contract_id(self, symbol: str) -> str:
        """
        Search for contract ID by symbol
        GET /iserver/secdef/search
        """
        response = requests.get(
            f"{self.base_url}/iserver/secdef/search",
            headers=self._get_headers(),
            params={'symbol': symbol}
        )
        response.raise_for_status()
        
        contracts = response.json()
        if not contracts:
            raise ValueError(f"No contract found for symbol: {symbol}")
        
        return contracts[0]['conid']
```

### 4.4 Interactive Brokers Setup Steps

1. **Open IBKR Account**: https://www.interactivebrokers.com/
2. **Enable Web API**: In account management, enable "Web API" access
3. **Create OAuth2 App**: Generate client_id and client_secret
4. **Test in Paper Trading**: Use paper trading account first
5. **MOBU Integration**: Store user's OAuth tokens encrypted in DB

---

## 5. Implementation: Alpaca Broker API

### 5.1 Why Alpaca?

**Pros**:
- **Zero commission**: Free trading (US stocks, options, crypto)
- **Broker API**: Build investment apps on top of Alpaca's brokerage
- **Paper trading**: Built-in paper trading (no setup needed)
- **Easy integration**: RESTful API, excellent documentation
- **Fast approval**: Account opening via API (KYC automated)

**Cons**:
- **US markets only**: NYSE, NASDAQ (no African exchanges directly)
- **Requires partnership**: Must apply for Broker API access (not open to all)

### 5.2 Alpaca Broker API vs Trading API

| Feature | Trading API | Broker API |
|---------|-------------|------------|
| **Use Case** | Individual traders | Fintech apps embedding brokerage |
| **Account Opening** | Manual (user signs up) | Programmatic (via API) |
| **User Management** | N/A | Full control (create accounts, manage users) |
| **Compliance** | Alpaca handles | Alpaca handles + partner co-branded |
| **Revenue Share** | No | Yes (partner earns revenue) |

**MOBU should use**: **Broker API** (allows us to create accounts for users programmatically)

### 5.3 Implementation

```python
# mobu_backend/brokers/alpaca.py
import alpaca_trade_api as tradeapi
from typing import List, Optional
from .base import BrokerAdapter, BrokerAccount, BrokerPosition, BrokerOrder

class AlpacaAdapter(BrokerAdapter):
    """
    Alpaca Broker API integration
    Docs: https://docs.alpaca.markets/docs/brokerapi-trading
    """
    
    def __init__(self, api_key: str, api_secret: str, paper_trading: bool = False):
        super().__init__(api_key, api_secret, paper_trading)
        
        base_url = 'https://paper-api.alpaca.markets' if paper_trading else 'https://api.alpaca.markets'
        
        self.api = tradeapi.REST(
            key_id=api_key,
            secret_key=api_secret,
            base_url=base_url,
            api_version='v2'
        )
    
    def get_account(self) -> BrokerAccount:
        """Fetch account balance"""
        account = self.api.get_account()
        
        return BrokerAccount(
            account_id=account.id,
            broker_name='alpaca',
            cash_balance=float(account.cash),
            portfolio_value=float(account.portfolio_value),
            buying_power=float(account.buying_power),
            currency='USD'
        )
    
    def get_positions(self) -> List[BrokerPosition]:
        """Fetch current positions"""
        positions = self.api.list_positions()
        
        result = []
        for pos in positions:
            result.append(BrokerPosition(
                symbol=pos.symbol,
                quantity=float(pos.qty),
                avg_entry_price=float(pos.avg_entry_price),
                current_price=float(pos.current_price),
                market_value=float(pos.market_value),
                unrealized_pnl=float(pos.unrealized_pl),
                unrealized_pnl_pct=float(pos.unrealized_plpc) * 100
            ))
        
        return result
    
    def place_order(
        self,
        symbol: str,
        side: str,
        quantity: float,
        order_type: str = 'market',
        limit_price: Optional[float] = None,
        stop_price: Optional[float] = None
    ) -> BrokerOrder:
        """Place order"""
        order = self.api.submit_order(
            symbol=symbol,
            qty=quantity,
            side=side,
            type=order_type,
            time_in_force='gtc',  # Good till cancelled
            limit_price=limit_price,
            stop_price=stop_price
        )
        
        return BrokerOrder(
            order_id=order.id,
            symbol=order.symbol,
            side=order.side,
            quantity=float(order.qty),
            order_type=order.type,
            limit_price=float(order.limit_price) if order.limit_price else None,
            stop_price=float(order.stop_price) if order.stop_price else None,
            status=order.status,
            filled_qty=float(order.filled_qty) if order.filled_qty else 0,
            avg_fill_price=float(order.filled_avg_price) if order.filled_avg_price else 0,
            submitted_at=order.submitted_at,
            filled_at=order.filled_at
        )
    
    def get_order(self, order_id: str) -> BrokerOrder:
        """Get order status"""
        order = self.api.get_order(order_id)
        
        return BrokerOrder(
            order_id=order.id,
            symbol=order.symbol,
            side=order.side,
            quantity=float(order.qty),
            order_type=order.type,
            limit_price=float(order.limit_price) if order.limit_price else None,
            stop_price=float(order.stop_price) if order.stop_price else None,
            status=order.status,
            filled_qty=float(order.filled_qty) if order.filled_qty else 0,
            avg_fill_price=float(order.filled_avg_price) if order.filled_avg_price else 0,
            submitted_at=order.submitted_at,
            filled_at=order.filled_at
        )
    
    def cancel_order(self, order_id: str) -> bool:
        """Cancel order"""
        try:
            self.api.cancel_order(order_id)
            return True
        except Exception:
            return False
    
    def get_market_price(self, symbol: str) -> float:
        """Get current market price"""
        quote = self.api.get_latest_trade(symbol)
        return float(quote.price)
```

### 5.4 Alpaca Broker API Setup

1. **Apply for Broker API**: https://alpaca.markets/broker (requires business entity)
2. **Complete onboarding**: Provide business docs, compliance info
3. **Get API credentials**: Receive broker API keys
4. **Test in sandbox**: Use paper trading environment
5. **Create MOBU accounts**: Use Account API to create sub-accounts for MOBU users

**Account Creation Example**:
```python
import requests

# Create account for MOBU user
response = requests.post(
    'https://broker-api.alpaca.markets/v1/accounts',
    headers={'Authorization': f'Bearer {BROKER_API_KEY}'},
    json={
        'contact': {
            'email_address': 'user@example.com',
            'phone_number': '+27-11-555-0123',
            'street_address': ['123 Main St'],
            'city': 'Johannesburg',
            'state': 'GP',
            'postal_code': '2000',
            'country': 'ZAF'
        },
        'identity': {
            'given_name': 'John',
            'family_name': 'Doe',
            'date_of_birth': '1990-01-15',
            'tax_id_type': 'ZAF_TAX',
            'country_of_citizenship': 'ZAF',
            'country_of_tax_residence': 'ZAF'
        },
        'disclosures': {
            'is_control_person': False,
            'is_affiliated_exchange_or_finra': False,
            'is_politically_exposed': False,
            'immediate_family_exposed': False
        },
        'agreements': [
            {'agreement': 'customer_agreement', 'signed_at': '2026-09-12T10:00:00Z'}
        ]
    }
)

account = response.json()
print(f"Created account: {account['id']}")
```

---

## 6. Implementation: EasyEquities (Unofficial)

### 6.1 Why EasyEquities?

**Pros**:
- **South African dominance**: Most popular retail brokerage in SA
- **JSE access**: Direct access to Johannesburg Stock Exchange
- **Low fees**: Fractional shares, no minimums
- **User base**: 800,000+ users (massive market)

**Cons**:
- **No official API**: Must reverse-engineer web interface
- **Fragile**: Breaks if EasyEquities changes their website
- **TOS risk**: May violate terms of service
- **No partnership**: Would prefer official API via partnership

### 6.2 Implementation (Unofficial)

**Disclaimer**: This is based on community reverse-engineering. Use at own risk. Official partnership preferred.

```python
# mobu_backend/brokers/easyequities.py
import requests
from typing import List, Optional
from .base import BrokerAdapter, BrokerAccount, BrokerPosition, BrokerOrder

class EasyEquitiesAdapter(BrokerAdapter):
    """
    UNOFFICIAL EasyEquities integration via reverse-engineered API
    Based on: https://github.com/deanmalan/easy-equities-client
    
    WARNING: This is not officially supported by EasyEquities.
    Prefer official partnership/API access.
    """
    
    def __init__(self, api_key: str, api_secret: str, paper_trading: bool = False):
        super().__init__(api_key, api_secret, paper_trading)
        self.base_url = 'https://api.easyequities.io'
        self.session_token = None
        self._authenticate()
    
    def _authenticate(self):
        """
        Login to EasyEquities
        Uses username/password (stored as api_key/api_secret)
        """
        response = requests.post(
            f"{self.base_url}/Account/login",
            json={
                'emailAddress': self.api_key,  # Actually username/email
                'password': self.api_secret
            }
        )
        response.raise_for_status()
        self.session_token = response.json()['token']
    
    def _get_headers(self) -> dict:
        return {
            'Authorization': f'Bearer {self.session_token}',
            'Content-Type': 'application/json'
        }
    
    def get_account(self) -> BrokerAccount:
        """Fetch account info"""
        response = requests.get(
            f"{self.base_url}/AccountManagement/accounts",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        accounts = response.json()
        if not accounts:
            raise ValueError("No accounts found")
        
        account = accounts[0]
        
        return BrokerAccount(
            account_id=account['accountId'],
            broker_name='easyequities',
            cash_balance=account['cashBalance'],
            portfolio_value=account['totalValue'],
            buying_power=account['buyingPower'],
            currency='ZAR'  # South African Rand
        )
    
    def get_positions(self) -> List[BrokerPosition]:
        """Fetch positions"""
        account = self.get_account()
        
        response = requests.get(
            f"{self.base_url}/AccountManagement/holdings/{account.account_id}",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        positions = []
        for holding in response.json():
            positions.append(BrokerPosition(
                symbol=holding['symbol'],
                quantity=holding['quantity'],
                avg_entry_price=holding['averagePrice'],
                current_price=holding['currentPrice'],
                market_value=holding['marketValue'],
                unrealized_pnl=holding['profit'],
                unrealized_pnl_pct=(holding['profit'] / holding['costBasis']) * 100
            ))
        
        return positions
    
    def place_order(
        self,
        symbol: str,
        side: str,
        quantity: float,
        order_type: str = 'market',
        limit_price: Optional[float] = None,
        stop_price: Optional[float] = None
    ) -> BrokerOrder:
        """
        Place order
        Note: EasyEquities may only support market orders via web
        """
        account = self.get_account()
        
        order_data = {
            'accountId': account.account_id,
            'instrument': symbol,
            'action': 'buy' if side == 'buy' else 'sell',
            'quantity': quantity,
            'orderType': 'market'  # Limit orders may not be supported
        }
        
        response = requests.post(
            f"{self.base_url}/orders",
            headers=self._get_headers(),
            json=order_data
        )
        response.raise_for_status()
        
        order = response.json()
        
        return BrokerOrder(
            order_id=order['orderId'],
            symbol=symbol,
            side=side,
            quantity=quantity,
            order_type='market',
            limit_price=None,
            stop_price=None,
            status='pending',
            filled_qty=0,
            avg_fill_price=0,
            submitted_at=order['createdAt'],
            filled_at=None
        )
    
    def get_order(self, order_id: str) -> BrokerOrder:
        """Get order status"""
        response = requests.get(
            f"{self.base_url}/orders/{order_id}",
            headers=self._get_headers()
        )
        response.raise_for_status()
        
        order = response.json()
        
        return BrokerOrder(
            order_id=order['orderId'],
            symbol=order['instrument'],
            side=order['action'],
            quantity=order['quantity'],
            order_type='market',
            limit_price=None,
            stop_price=None,
            status=order['status'].lower(),
            filled_qty=order.get('filledQuantity', 0),
            avg_fill_price=order.get('filledPrice', 0),
            submitted_at=order['createdAt'],
            filled_at=order.get('filledAt')
        )
    
    def cancel_order(self, order_id: str) -> bool:
        """Cancel order"""
        try:
            response = requests.delete(
                f"{self.base_url}/orders/{order_id}",
                headers=self._get_headers()
            )
            return response.status_code == 200
        except Exception:
            return False
    
    def get_market_price(self, symbol: str) -> float:
        """Get current price"""
        response = requests.get(
            f"{self.base_url}/instruments/quote",
            headers=self._get_headers(),
            params={'symbol': symbol}
        )
        response.raise_for_status()
        
        return response.json()['lastPrice']
```

### 6.3 EasyEquities Partnership Strategy

Instead of unofficial API:

1. **Reach out to EasyEquities**: Propose official partnership
2. **Value proposition**: MOBU brings AI-powered recommendations → more trades → more revenue for EasyEquities
3. **Revenue share**: 50/50 split on commission (or referral fee per user)
4. **White-label option**: Co-branded "Powered by EasyEquities" in MOBU
5. **Official API access**: Request developer API credentials

---

## 7. Trade Execution Flow

### 7.1 User Journey

```
1. User sees MOBU recommendation
   ┌─────────────────────────────────────────┐
   │ Buy DANGCEM (NGX) - 85% Confidence      │
   │ Target Price: ₦295                      │
   │ Current Price: ₦285.50                  │
   │                                         │
   │ Evidence:                               │
   │ • Insider buying +₦2M                   │
   │ • Q3 earnings beat 15%                  │
   │ • Govt contract awarded                 │
   │                                         │
   │ [Execute Trade] [Dismiss]               │
   └─────────────────────────────────────────┘

2. User clicks "Execute Trade"
   ┌─────────────────────────────────────────┐
   │ Confirm Trade                           │
   │ Symbol: DANGCEM                         │
   │ Action: Buy                             │
   │ Quantity: [10] shares                   │
   │ Order Type: [Market ▼]                  │
   │ Est. Cost: ₦2,855                       │
   │                                         │
   │ Broker: [Interactive Brokers ▼]        │
   │                                         │
   │ [Confirm] [Cancel]                      │
   └─────────────────────────────────────────┘

3. MOBU sends order to broker
   Loading...

4. Trade confirmation
   ┌─────────────────────────────────────────┐
   │ ✓ Trade Executed                        │
   │ Bought 10 shares of DANGCEM             │
   │ Avg Price: ₦285.60                      │
   │ Total Cost: ₦2,856                      │
   │ Order ID: IB-12345678                   │
   │                                         │
   │ [View in Portfolio]                     │
   └─────────────────────────────────────────┘
```

### 7.2 Backend API Endpoint

```python
# mobu_backend/api/trade_execution.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from ..brokers.factory import BrokerFactory
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/api/v1/trade", tags=["Trading"])

class TradeRequest(BaseModel):
    recommendation_id: str
    symbol: str
    side: str  # 'buy' or 'sell'
    quantity: float
    order_type: str = 'market'
    limit_price: Optional[float] = None
    stop_price: Optional[float] = None
    broker_name: str  # 'interactive_brokers', 'alpaca', 'easyequities'

@router.post("/execute")
async def execute_trade(
    trade: TradeRequest,
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    """
    Execute trade via connected broker
    """
    # 1. Get user's broker connection
    broker_conn = db.query(BrokerConnection).filter(
        BrokerConnection.user_id == user.id,
        BrokerConnection.broker_name == trade.broker_name,
        BrokerConnection.connection_status == 'active'
    ).first()
    
    if not broker_conn:
        raise HTTPException(
            status_code=400,
            detail=f"No active {trade.broker_name} connection found. Please connect your broker first."
        )
    
    # 2. Create broker adapter
    broker = BrokerFactory.create(
        broker_name=trade.broker_name,
        api_key=decrypt(broker_conn.oauth_access_token),  # Decrypt from DB
        api_secret=decrypt(broker_conn.oauth_refresh_token),
        paper_trading=False
    )
    
    # 3. Verify user has sufficient buying power
    account = broker.get_account()
    est_cost = await _estimate_order_cost(broker, trade.symbol, trade.side, trade.quantity)
    
    if trade.side == 'buy' and est_cost > account.buying_power:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient buying power. Need ${est_cost:.2f}, have ${account.buying_power:.2f}"
        )
    
    # 4. Place order
    try:
        order = broker.place_order(
            symbol=trade.symbol,
            side=trade.side,
            quantity=trade.quantity,
            order_type=trade.order_type,
            limit_price=trade.limit_price,
            stop_price=trade.stop_price
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order failed: {str(e)}")
    
    # 5. Save to database
    executed_trade = ExecutedTrade(
        user_id=user.id,
        recommendation_id=trade.recommendation_id,
        broker_connection_id=broker_conn.connection_id,
        broker_name=trade.broker_name,
        broker_order_id=order.order_id,
        symbol=order.symbol,
        side=order.side,
        quantity=order.quantity,
        order_type=order.order_type,
        limit_price=order.limit_price,
        stop_price=order.stop_price,
        order_status=order.status,
        submitted_at=order.submitted_at
    )
    db.add(executed_trade)
    db.commit()
    
    # 6. Return success
    return {
        'success': True,
        'order_id': order.order_id,
        'status': order.status,
        'message': f"Order submitted successfully. Order ID: {order.order_id}"
    }

async def _estimate_order_cost(broker, symbol: str, side: str, quantity: float) -> float:
    """Estimate order cost"""
    price = broker.get_market_price(symbol)
    return price * quantity
```

### 7.3 Frontend Integration (React)

```typescript
// mobu-mvp/components/TradeExecutionModal.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface TradeExecutionModalProps {
  recommendation: Recommendation;
  onClose: () => void;
}

export const TradeExecutionModal: React.FC<TradeExecutionModalProps> = ({
  recommendation,
  onClose
}) => {
  const [quantity, setQuantity] = useState(10);
  const [broker, setBroker] = useState('interactive_brokers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/trade/execute', {
        recommendation_id: recommendation.id,
        symbol: recommendation.symbol,
        side: recommendation.action, // 'buy' or 'sell'
        quantity,
        order_type: 'market',
        broker_name: broker
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/portfolio'; // Redirect to portfolio
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Trade execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Execute Trade</h2>
        
        {success ? (
          <div className="success-message">
            ✓ Trade executed successfully!
            Redirecting to portfolio...
          </div>
        ) : (
          <>
            <div className="trade-details">
              <p><strong>Symbol:</strong> {recommendation.symbol}</p>
              <p><strong>Action:</strong> {recommendation.action.toUpperCase()}</p>
              <p><strong>Current Price:</strong> ${recommendation.current_price}</p>
              <p><strong>Target Price:</strong> ${recommendation.target_price}</p>
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="form-group">
              <label>Broker:</label>
              <select value={broker} onChange={(e) => setBroker(e.target.value)}>
                <option value="interactive_brokers">Interactive Brokers</option>
                <option value="alpaca">Alpaca</option>
                <option value="easyequities">EasyEquities</option>
              </select>
            </div>

            <div className="estimated-cost">
              <strong>Estimated Cost:</strong> $
              {(recommendation.current_price * quantity).toFixed(2)}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button
                onClick={handleExecute}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Executing...' : 'Confirm Trade'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
```

---

## 8. Security & Compliance

### 8.1 OAuth Token Storage

**Never store plaintext credentials**. Encrypt OAuth tokens before storing in database.

```python
# mobu_backend/security/encryption.py
from cryptography.fernet import Fernet
import os

# Generate encryption key (store in environment variable)
ENCRYPTION_KEY = os.getenv('MOBU_ENCRYPTION_KEY').encode()
cipher = Fernet(ENCRYPTION_KEY)

def encrypt(plaintext: str) -> str:
    """Encrypt sensitive data"""
    return cipher.encrypt(plaintext.encode()).decode()

def decrypt(ciphertext: str) -> str:
    """Decrypt sensitive data"""
    return cipher.decrypt(ciphertext.encode()).decode()
```

### 8.2 Trade Authorization

**Two-factor confirmation** for large trades:

```python
@router.post("/execute")
async def execute_trade(trade: TradeRequest, user=Depends(get_current_user)):
    # If trade value > $10,000, require 2FA
    est_cost = _estimate_order_cost(...)
    
    if est_cost > 10000:
        if not user.two_factor_confirmed:
            raise HTTPException(
                status_code=403,
                detail="2FA required for trades over $10,000"
            )
    
    # Proceed with trade...
```

### 8.3 Compliance & Regulations

| Region | Regulation | Requirement |
|--------|-----------|-------------|
| **US** | SEC, FINRA | Use registered broker (Alpaca, Interactive Brokers) |
| **South Africa** | FSCA (Financial Sector Conduct Authority) | EasyEquities is FSCA-licensed |
| **Nigeria** | SEC Nigeria | Bamboo, Chaka are licensed |
| **Kenya** | CMA (Capital Markets Authority) | Hisa is CMA-licensed |

**MOBU Compliance**:
- We do NOT handle custody (broker holds securities)
- We do NOT process payments directly (broker handles deposits/withdrawals)
- We are an **investment intelligence platform** (not a broker)
- Users execute trades via licensed brokers

---

## 9. Testing Strategy

### 9.1 Paper Trading Testing

**Before live deployment**, test with paper trading accounts:

```python
# Test with paper trading
broker = BrokerFactory.create(
    broker_name='alpaca',
    api_key='PK...',  # Paper trading key
    api_secret='...',
    paper_trading=True  # ← Paper mode
)

# Place test order
order = broker.place_order(
    symbol='AAPL',
    side='buy',
    quantity=10
)

print(f"Paper order placed: {order.order_id}")
```

### 9.2 Integration Tests

```python
# tests/test_broker_integration.py
import pytest
from mobu_backend.brokers.factory import BrokerFactory

@pytest.mark.integration
def test_alpaca_paper_trading():
    """Test Alpaca paper trading integration"""
    broker = BrokerFactory.create(
        broker_name='alpaca',
        api_key=os.getenv('ALPACA_PAPER_KEY'),
        api_secret=os.getenv('ALPACA_PAPER_SECRET'),
        paper_trading=True
    )
    
    # Get account
    account = broker.get_account()
    assert account.broker_name == 'alpaca'
    assert account.cash_balance > 0
    
    # Place order
    order = broker.place_order(
        symbol='AAPL',
        side='buy',
        quantity=1
    )
    assert order.status in ['pending', 'filled']
    
    # Get order status
    order_status = broker.get_order(order.order_id)
    assert order_status.order_id == order.order_id
```

---

## 10. Deployment Roadmap

### Phase 1: Paper Trading (Weeks 1-2)
- ✅ Build broker abstraction layer
- ✅ Integrate Alpaca paper trading
- ✅ Test trade execution flow
- ✅ Deploy to staging

### Phase 2: Interactive Brokers Integration (Weeks 3-6)
- ✅ Apply for Interactive Brokers API access
- ✅ Build InteractiveBrokersAdapter
- ✅ Test with paper account
- ✅ Deploy to production

### Phase 3: Alpaca Broker API (Weeks 7-10)
- ✅ Apply for Alpaca Broker API partnership
- ✅ Build account creation flow
- ✅ Test KYC/onboarding
- ✅ Go live with first users

### Phase 4: EasyEquities Partnership (Weeks 11-16)
- ✅ Reach out to EasyEquities for official API
- ✅ Negotiate revenue share agreement
- ✅ Build integration with official API
- ✅ Launch in South Africa

---

## Conclusion

MOBU now has a **clear path** to enable trade execution:

1. **Immediate**: Alpaca paper trading (zero setup, test today)
2. **Short-term**: Interactive Brokers (global reach, 150+ markets)
3. **Medium-term**: Alpaca Broker API (US stocks, programmatic account opening)
4. **Long-term**: EasyEquities partnership (South African dominance)

**Next Steps**:
1. Set up Alpaca paper trading account
2. Build broker abstraction layer
3. Test trade execution with MOBU recommendations
4. Apply for Interactive Brokers API access
5. Apply for Alpaca Broker API partnership

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-12  
**Owner**: MOBU Engineering Team
