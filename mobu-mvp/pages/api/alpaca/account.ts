import type { NextApiRequest, NextApiResponse } from 'next';
import { paperTradingClient, liveTradingClient } from '../../../lib/alpaca';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode } = req.query;
    const client = mode === 'live' ? liveTradingClient : paperTradingClient;

    const account = await client.getAccount();

    res.status(200).json({
      success: true,
      data: {
        accountNumber: account.account_number,
        status: account.status,
        currency: account.currency,
        cash: parseFloat(account.cash),
        portfolioValue: parseFloat(account.portfolio_value),
        buyingPower: parseFloat(account.buying_power),
        equity: parseFloat(account.equity),
        lastEquity: parseFloat(account.last_equity),
        dayReturn: parseFloat(account.equity) - parseFloat(account.last_equity),
        dayReturnPct: ((parseFloat(account.equity) - parseFloat(account.last_equity)) / parseFloat(account.last_equity)) * 100,
        mode: mode === 'live' ? 'live' : 'paper'
      }
    });
  } catch (error: any) {
    console.error('Alpaca account error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch account data'
    });
  }
}
