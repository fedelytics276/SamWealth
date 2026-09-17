import type { NextApiRequest, NextApiResponse } from 'next';
import { paperTradingClient } from '../../lib/alpaca';

// Mock leaderboard data (in production, this would come from database)
// Simulate multiple paper trading accounts with performance data
const generateMockLeaderboard = async () => {
  try {
    // Get current user's account for comparison
    const currentAccount = await paperTradingClient.getAccount();
    const currentEquity = parseFloat(currentAccount.equity);
    const currentReturn = ((currentEquity - 100000) / 100000) * 100;

    const mockUsers = [
      { username: 'TradeWizard', equity: 125500, return: 25.5, trades: 47, winRate: 72.3, sharpe: 2.1 },
      { username: 'AlphaSeeker', equity: 118200, return: 18.2, trades: 63, winRate: 68.5, sharpe: 1.9 },
      { username: 'MarketMaster', equity: 115600, return: 15.6, trades: 52, winRate: 65.4, sharpe: 1.7 },
      { username: 'BullRun2026', equity: 112300, return: 12.3, trades: 41, winRate: 70.7, sharpe: 1.8 },
      { username: 'DividendKing', equity: 110100, return: 10.1, trades: 28, winRate: 75.0, sharpe: 1.6 },
      { username: 'TechInvestor', equity: 108900, return: 8.9, trades: 55, winRate: 63.6, sharpe: 1.5 },
      { username: 'ValueHunter', equity: 106500, return: 6.5, trades: 35, winRate: 71.4, sharpe: 1.4 },
      { username: 'MomentumPro', equity: 104200, return: 4.2, trades: 68, winRate: 60.3, sharpe: 1.3 },
      { username: 'SwingTrader', equity: 102800, return: 2.8, trades: 44, winRate: 65.9, sharpe: 1.2 },
      { username: 'MOBU_User (You)', equity: currentEquity, return: currentReturn, trades: 12, winRate: 66.7, sharpe: 1.45 }
    ];

    // Sort by return
    mockUsers.sort((a, b) => b.return - a.return);

    // Add rank
    return mockUsers.map((user, index) => ({
      rank: index + 1,
      ...user,
      badge: index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : null
    }));
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    // Fallback mock data
    return [
      { rank: 1, username: 'TradeWizard', equity: 125500, return: 25.5, trades: 47, winRate: 72.3, sharpe: 2.1, badge: '🏆' },
      { rank: 2, username: 'AlphaSeeker', equity: 118200, return: 18.2, trades: 63, winRate: 68.5, sharpe: 1.9, badge: '🥈' },
      { rank: 3, username: 'MarketMaster', equity: 115600, return: 15.6, trades: 52, winRate: 65.4, sharpe: 1.7, badge: '🥉' },
      { rank: 4, username: 'BullRun2026', equity: 112300, return: 12.3, trades: 41, winRate: 70.7, sharpe: 1.8, badge: null },
      { rank: 5, username: 'DividendKing', equity: 110100, return: 10.1, trades: 28, winRate: 75.0, sharpe: 1.6, badge: null },
      { rank: 6, username: 'MOBU_User (You)', equity: 100000, return: 0.0, trades: 0, winRate: 0, sharpe: 0, badge: null }
    ];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period = 'monthly' } = req.query;

    const leaderboard = await generateMockLeaderboard();

    res.status(200).json({
      success: true,
      data: leaderboard,
      period,
      updatedAt: new Date().toISOString(),
      message: 'Compete with other paper traders! Top performers get featured.'
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch leaderboard'
    });
  }
}
