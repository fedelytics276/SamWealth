/**
 * Market Hours Utility
 * Track trading hours for global stock exchanges
 * Handle timezones, weekends, holidays
 */

interface MarketHours {
  openTime: string; // '09:30'
  closeTime: string; // '16:00'
  timezone: string; // 'America/New_York'
  utcOffset: number; // -5 for EST
  daysOpen: number[]; // [1,2,3,4,5] = Mon-Fri
}

export const MARKET_HOURS: Record<string, MarketHours> = {
  'NYSE': {
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
    utcOffset: -5,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'NASDAQ': {
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
    utcOffset: -5,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'JSE': {
    openTime: '09:00',
    closeTime: '17:00',
    timezone: 'Africa/Johannesburg',
    utcOffset: 2,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'NGX': {
    openTime: '10:00',
    closeTime: '14:30',
    timezone: 'Africa/Lagos',
    utcOffset: 1,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'NSE': {
    openTime: '09:00',
    closeTime: '15:00',
    timezone: 'Africa/Nairobi',
    utcOffset: 3,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'EGX': {
    openTime: '10:00',
    closeTime: '14:30',
    timezone: 'Africa/Cairo',
    utcOffset: 2,
    daysOpen: [0, 1, 2, 3, 4], // Sun-Thu (Egypt trading days)
  },
  'GSE': {
    openTime: '10:00',
    closeTime: '15:00',
    timezone: 'Africa/Accra',
    utcOffset: 0,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'BRVM': {
    openTime: '08:30',
    closeTime: '16:00',
    timezone: 'Africa/Abidjan',
    utcOffset: 0,
    daysOpen: [1, 2, 3, 4, 5],
  },
  'CSE': {
    openTime: '09:30',
    closeTime: '15:30',
    timezone: 'Africa/Casablanca',
    utcOffset: 1,
    daysOpen: [1, 2, 3, 4, 5],
  },
};

/**
 * Get market hours configuration for an exchange
 */
export function getMarketHours(exchange: string): MarketHours {
  return MARKET_HOURS[exchange] || MARKET_HOURS['NYSE'];
}

/**
 * Check if market is currently open
 */
export function isMarketOpen(exchange: string): boolean {
  const hours = getMarketHours(exchange);
  const now = new Date();

  // Check if today is a trading day
  const dayOfWeek = now.getUTCDay();
  if (!hours.daysOpen.includes(dayOfWeek)) {
    return false;
  }

  // Convert current time to market's timezone
  const marketTime = toMarketTime(now, hours.utcOffset);

  // Parse market hours
  const [openHour, openMin] = hours.openTime.split(':').map(Number);
  const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);

  const marketOpenMinutes = openHour * 60 + openMin;
  const marketCloseMinutes = closeHour * 60 + closeMin;
  const currentMinutes = marketTime.getHours() * 60 + marketTime.getMinutes();

  return currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes;
}

/**
 * Check if any market in a list is open
 */
export function isAnyMarketOpen(exchanges: string[]): boolean {
  return exchanges.some(exchange => isMarketOpen(exchange));
}

/**
 * Get next market event (open or close)
 */
export function getNextMarketEvent(exchange: string): {
  event: 'open' | 'close';
  time: string;
  date?: string;
} {
  const hours = getMarketHours(exchange);
  const now = new Date();

  if (isMarketOpen(exchange)) {
    // Market is open, next event is close
    const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);
    const marketTime = toMarketTime(now, hours.utcOffset);
    marketTime.setHours(closeHour, closeMin, 0, 0);

    return {
      event: 'close',
      time: formatTime(marketTime),
    };
  } else {
    // Market is closed, find next open
    const [openHour, openMin] = hours.openTime.split(':').map(Number);
    let nextOpen = new Date(now);
    nextOpen.setHours(openHour, openMin, 0, 0);

    // If past today's open time, move to next day
    const marketNow = toMarketTime(now, hours.utcOffset);
    if (marketNow.getHours() * 60 + marketNow.getMinutes() > openHour * 60 + openMin) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    // Skip non-trading days
    let daysChecked = 0;
    while (!hours.daysOpen.includes(nextOpen.getUTCDay()) && daysChecked < 7) {
      nextOpen.setDate(nextOpen.getDate() + 1);
      daysChecked++;
    }

    return {
      event: 'open',
      time: formatTime(nextOpen),
      date: formatDate(nextOpen),
    };
  }
}

/**
 * Get market status summary for multiple exchanges
 */
export function getMarketsStatus(exchanges: string[]): Array<{
  exchange: string;
  status: 'open' | 'closed';
  nextEvent: string;
}> {
  return exchanges.map(exchange => {
    const status = isMarketOpen(exchange) ? 'open' : 'closed';
    const next = getNextMarketEvent(exchange);
    const nextEvent =
      next.event === 'close'
        ? `Closes at ${next.time}`
        : next.date
        ? `Opens ${next.date} at ${next.time}`
        : `Opens at ${next.time}`;

    return { exchange, status, nextEvent };
  });
}

/**
 * Get minutes until market opens/closes
 */
export function getMinutesUntilEvent(exchange: string): number {
  const hours = getMarketHours(exchange);
  const now = new Date();
  const marketNow = toMarketTime(now, hours.utcOffset);

  if (isMarketOpen(exchange)) {
    // Minutes until close
    const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);
    const closeMinutes = closeHour * 60 + closeMin;
    const currentMinutes = marketNow.getHours() * 60 + marketNow.getMinutes();
    return closeMinutes - currentMinutes;
  } else {
    // Minutes until next open
    const nextEvent = getNextMarketEvent(exchange);
    // Simplified: return a large number if opening tomorrow
    return 480; // Assume ~8 hours
  }
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

/**
 * Convert UTC time to market's local time
 */
function toMarketTime(date: Date, utcOffset: number): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + utcOffset * 3600000);
}

/**
 * Format time as HH:MM AM/PM
 */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format date as "Monday, Sep 12"
 */
function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  return `${dayName}, ${monthName} ${dayNum}`;
}

/**
 * Get all unique exchanges from holdings
 */
export function getExchangesFromHoldings(holdings: Array<{ exchange: string }>): string[] {
  return [...new Set(holdings.map(h => h.exchange))];
}

/**
 * Determine if it's a good time to refresh prices
 * (only refresh frequently when markets are open)
 */
export function shouldRefreshPrices(exchanges: string[]): boolean {
  return isAnyMarketOpen(exchanges);
}

/**
 * Get recommended refresh interval in milliseconds
 */
export function getRefreshInterval(exchanges: string[]): number {
  if (isAnyMarketOpen(exchanges)) {
    return 15000; // 15 seconds when market open
  } else {
    return 300000; // 5 minutes when market closed
  }
}
