import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/evidence/paper-trail?id=aapl-paper-trade
 * 
 * Returns complete evidence trail for a paper trade
 * Shows full data lineage, sources, and AI reasoning
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid trade ID' });
  }

  try {
    // Load evidence trails from JSON file
    const filePath = path.join(process.cwd(), 'data', 'evidence-trails-paper.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const trails = JSON.parse(fileContents);

    const trail = trails[id];

    if (!trail) {
      return res.status(404).json({ 
        error: 'Evidence trail not found',
        message: `No evidence trail exists for trade ID: ${id}`
      });
    }

    // Return the complete evidence trail
    res.status(200).json(trail);
  } catch (error) {
    console.error('Error loading evidence trail:', error);
    res.status(500).json({ 
      error: 'Failed to load evidence trail',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
