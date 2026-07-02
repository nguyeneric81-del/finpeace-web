import { supabase } from './supabase'; // assuming standard supabase client

export interface YieldCurveSignal {
  date: string;
  level: number;
  slope: number;
  curvature: number;
  risk_signal: 'Risk-On' | 'Risk-Off' | 'Neutral';
}

export async function getLatestYieldCurveSignal(): Promise<YieldCurveSignal | null> {
  const { data, error } = await supabase
    .from('yield_curve_factors')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching yield curve signal:', error);
    return null;
  }

  return data as YieldCurveSignal;
}

export async function getYieldCurveHistory(limit = 12): Promise<YieldCurveSignal[]> {
  const { data, error } = await supabase
    .from('yield_curve_factors')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching yield curve history:', error);
    return [];
  }

  // Return in chronological order
  return (data as YieldCurveSignal[]).reverse();
}
