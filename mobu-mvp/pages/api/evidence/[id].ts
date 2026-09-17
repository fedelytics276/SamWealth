import type { NextApiRequest, NextApiResponse } from 'next'
import evidenceTrails from '@/data/evidence-trails.json'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    const evidence = evidenceTrails[id as keyof typeof evidenceTrails]
    
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence trail not found' })
    }

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return res.status(200).json({
      success: true,
      data: evidence,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
