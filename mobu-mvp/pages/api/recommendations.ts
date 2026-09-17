import type { NextApiRequest, NextApiResponse } from 'next'
import recommendations from '@/data/recommendations.json'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Simulate a small delay for realism
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return res.status(200).json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
