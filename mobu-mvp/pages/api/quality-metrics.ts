import type { NextApiRequest, NextApiResponse } from 'next';

// Optional: Import database connection
let query: any = null;
try {
  const db = require('@/lib/db');
  query = db.query;
} catch (e) {
  console.log('Database not configured, using mock data');
}

// Mock data matching dbt mart_quality_dashboard structure
const mockQualityMetrics = {
  dashboard_updated_at: new Date().toISOString(),
  
  // Criterion 1: Accuracy
  criterion_1_name: 'Accuracy',
  criterion_1_value: 99.96,
  criterion_1_unit: '%',
  criterion_1_threshold: 99.95,
  criterion_1_compliant: true,
  criterion_1_30d_avg: 99.97,
  
  // Criterion 2: Reliability  
  criterion_2_name: 'Reliability',
  criterion_2_value: 99.92,
  criterion_2_unit: '%',
  criterion_2_threshold: 99.9,
  criterion_2_compliant: true,
  criterion_2_30d_avg: 99.94,
  
  // Criterion 3: Sharpe Ratio
  criterion_3_name: 'Sharpe Ratio',
  criterion_3_value: 1.62,
  criterion_3_unit: 'ratio',
  criterion_3_threshold: 1.5,
  criterion_3_compliant: true,
  criterion_3_90d_avg: 1.58,
  
  // Criterion 4: Self-Improving
  criterion_4_name: 'Self-Improving',
  criterion_4_value: 85.3,
  criterion_4_unit: '%',
  criterion_4_threshold: 80.0,
  criterion_4_compliant: true,
  models_improving_count: 2,
  
  // Overall
  overall_compliant: true,
  lineage_tool: 'dbt',
  dbt_run_timestamp: new Date().toISOString(),
  dbt_invocation_id: 'mock-' + Date.now()
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if database is available and configured
    const useMockData = !query || process.env.USE_MOCK_DATA === 'true' || !process.env.DB_PASSWORD;
    
    if (useMockData) {
      // Return mock data
      return res.status(200).json({
        success: true,
        data: mockQualityMetrics,
        timestamp: new Date().toISOString(),
        source: 'mock'
      });
    }

    // Query from dbt marts
    const metrics = await query(`
      SELECT 
        dashboard_updated_at::text,
        
        -- Criterion 1
        criterion_1_name,
        criterion_1_value,
        criterion_1_unit,
        criterion_1_threshold,
        criterion_1_compliant,
        criterion_1_30d_avg,
        
        -- Criterion 2
        criterion_2_name,
        criterion_2_value,
        criterion_2_unit,
        criterion_2_threshold,
        criterion_2_compliant,
        criterion_2_30d_avg,
        
        -- Criterion 3
        criterion_3_name,
        criterion_3_value,
        criterion_3_unit,
        criterion_3_threshold,
        criterion_3_compliant,
        criterion_3_90d_avg,
        
        -- Criterion 4
        criterion_4_name,
        criterion_4_value,
        criterion_4_unit,
        criterion_4_threshold,
        criterion_4_compliant,
        models_improving_count,
        
        -- Overall
        overall_compliant,
        lineage_tool,
        dbt_run_timestamp::text,
        dbt_invocation_id
        
      FROM analytics.mart_quality_dashboard
      ORDER BY dashboard_updated_at DESC
      LIMIT 1
    `);

    if (metrics.length === 0) {
      // No data from dbt yet, use mock
      return res.status(200).json({
        success: true,
        data: mockQualityMetrics,
        timestamp: new Date().toISOString(),
        source: 'mock-no-dbt-data'
      });
    }

    res.status(200).json({
      success: true,
      data: metrics[0],
      timestamp: new Date().toISOString(),
      source: 'dbt-marts'
    });
    
  } catch (error) {
    console.error('Quality metrics API error:', error);
    
    // Fallback to mock data on error
    res.status(200).json({
      success: true,
      data: mockQualityMetrics,
      timestamp: new Date().toISOString(),
      source: 'mock-error-fallback',
      error: String(error)
    });
  }
}
