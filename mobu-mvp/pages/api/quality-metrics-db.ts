import type { NextApiRequest, NextApiResponse } from 'next';
import { queryOne } from '../../lib/db';

export interface QualityMetrics {
  dashboardUpdatedAt: string;
  
  // Criterion 1: Accuracy
  criterion1Name: string;
  criterion1Value: number;
  criterion1Unit: string;
  criterion1Threshold: number;
  criterion1Compliant: boolean;
  criterion130dAvg: number;
  
  // Criterion 2: Reliability
  criterion2Name: string;
  criterion2Value: number;
  criterion2Unit: string;
  criterion2Threshold: number;
  criterion2Compliant: boolean;
  criterion230dAvg: number;
  
  // Criterion 3: Sharpe Ratio
  criterion3Name: string;
  criterion3Value: number;
  criterion3Unit: string;
  criterion3Threshold: number;
  criterion3Compliant: boolean;
  criterion390dAvg: number;
  
  // Criterion 4: Self-Improving
  criterion4Name: string;
  criterion4Value: number;
  criterion4Unit: string;
  criterion4Threshold: number;
  criterion4Compliant: boolean;
  modelsImprovingCount: number;
  
  // Overall
  overallCompliant: boolean;
  lineageTool: string;
  dbtRunTimestamp: string;
  dbtInvocationId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QualityMetrics | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Query the mart_quality_dashboard table created by dbt
    const row = await queryOne(`
      SELECT 
        dashboard_updated_at,
        criterion_1_name,
        criterion_1_value,
        criterion_1_unit,
        criterion_1_threshold,
        criterion_1_compliant,
        criterion_1_30d_avg,
        criterion_2_name,
        criterion_2_value,
        criterion_2_unit,
        criterion_2_threshold,
        criterion_2_compliant,
        criterion_2_30d_avg,
        criterion_3_name,
        criterion_3_value,
        criterion_3_unit,
        criterion_3_threshold,
        criterion_3_compliant,
        criterion_3_90d_avg,
        criterion_4_name,
        criterion_4_value,
        criterion_4_unit,
        criterion_4_threshold,
        criterion_4_compliant,
        models_improving_count,
        overall_compliant,
        lineage_tool,
        dbt_run_timestamp,
        dbt_invocation_id
      FROM marts.mart_quality_dashboard
      ORDER BY dashboard_updated_at DESC
      LIMIT 1
    `);

    if (!row) {
      return res.status(404).json({ error: 'No quality metrics found' });
    }

    // Transform snake_case to camelCase for frontend
    const metrics: QualityMetrics = {
      dashboardUpdatedAt: row.dashboard_updated_at,
      criterion1Name: row.criterion_1_name,
      criterion1Value: parseFloat(row.criterion_1_value),
      criterion1Unit: row.criterion_1_unit,
      criterion1Threshold: parseFloat(row.criterion_1_threshold),
      criterion1Compliant: row.criterion_1_compliant,
      criterion130dAvg: parseFloat(row.criterion_1_30d_avg),
      criterion2Name: row.criterion_2_name,
      criterion2Value: parseFloat(row.criterion_2_value),
      criterion2Unit: row.criterion_2_unit,
      criterion2Threshold: parseFloat(row.criterion_2_threshold),
      criterion2Compliant: row.criterion_2_compliant,
      criterion230dAvg: parseFloat(row.criterion_2_30d_avg),
      criterion3Name: row.criterion_3_name,
      criterion3Value: parseFloat(row.criterion_3_value),
      criterion3Unit: row.criterion_3_unit,
      criterion3Threshold: parseFloat(row.criterion_3_threshold),
      criterion3Compliant: row.criterion_3_compliant,
      criterion390dAvg: parseFloat(row.criterion_3_90d_avg),
      criterion4Name: row.criterion_4_name,
      criterion4Value: parseFloat(row.criterion_4_value),
      criterion4Unit: row.criterion_4_unit,
      criterion4Threshold: parseFloat(row.criterion_4_threshold),
      criterion4Compliant: row.criterion_4_compliant,
      modelsImprovingCount: parseInt(row.models_improving_count),
      overallCompliant: row.overall_compliant,
      lineageTool: row.lineage_tool,
      dbtRunTimestamp: row.dbt_run_timestamp,
      dbtInvocationId: row.dbt_invocation_id,
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching quality metrics:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch quality metrics' 
    });
  }
}
