import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/stockpick/upgrade-silver
 * Body: { userId: string }
 *
 * Upgrades a Bronze user to Silver tier and grants 200 credits.
 * Only allowed if current plan is 'bronze'.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch current user
    const { data: user, error: fetchError } = await supabase
      .from('advisor_users')
      .select('stockpick_plan')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.stockpick_plan !== 'bronze') {
      return NextResponse.json({ error: 'Only Bronze users can upgrade to Silver' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('advisor_users')
      .update({
        stockpick_plan: 'silver',
        stockspick_credits: 200,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[upgrade-silver] Update error:', updateError);
      return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Upgraded to Silver', credits: 200 });
  } catch (err) {
    console.error('[upgrade-silver] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
