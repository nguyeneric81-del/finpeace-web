import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;
  const supabase = createAdminClient();

  // 1. Fetch their active SIP plans
  const { data: plans } = await supabase
    .from('sip_service_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'Active');

  // 2. Fetch performance data
  const { data: performance } = await supabase
    .from('sip_performance_snapshots')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: true });

  // 3. Fetch Latest Insights
  const { data: insights } = await supabase
    .from('sip_asset_valuations')
    .select('*')
    .eq('status', 'Published')
    .order('update_date', { ascending: false })
    .limit(5);

  return NextResponse.json({
    plans: plans || [],
    performanceData: performance || [],
    insights: insights || [],
  });
}

// Optional: DELETE to close a SIP plan
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const planId = resolvedParams.id; // Passing plan.id in this case
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('sip_service_plans')
    .update({ status: 'Closed' })
    .eq('id', planId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Plan closed successfully.' });
}
