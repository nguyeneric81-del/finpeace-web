import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(req: Request) {
  const supabase = createAdminClient();

  // Fetch all active/pending sip_service_plans, joining with profiles
  const { data, error } = await supabase
    .from('sip_service_plans')
    .select(`
      id,
      user_id,
      stock_code,
      start_date,
      end_date,
      securities_company,
      securities_account,
      assigned_dealer,
      status,
      created_at,
      profiles:user_id (email, full_name, phone)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Deduplicate and group into Client objects natively containing their SIP plans
  const groupedClients = Object.values(
    (data || []).reduce((acc: any, plan: any) => {
      const uid = plan.user_id;
      if (!acc[uid]) {
        acc[uid] = {
          user_id: uid,
          email: plan.profiles?.email || 'N/A',
          full_name: plan.profiles?.full_name || 'CRM Direct',
          phone: plan.profiles?.phone,
          plans: []
        };
      }
      // strip out huge relations to avoid bloat
      const cleanedPlan = { ...plan };
      delete cleanedPlan.profiles;
      acc[uid].plans.push(cleanedPlan);
      return acc;
    }, {})
  );

  return NextResponse.json({ clients: groupedClients });
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      email,
      stock_code,
      securities_company,
      securities_account,
      assigned_dealer,
      start_date,
      end_date,
      status = 'Active'
    } = body;

    if (!email || !stock_code) {
      return NextResponse.json({ error: 'Email and Stock Code are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let targetUserId = null;

    // 1. Check if user already exists in profiles
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (profileData?.id) {
      targetUserId = profileData.id;
    } else {
      // 2. User completely new, create an Auth account on their behalf
      // Generate a long dummy password. Will rely on "Forgot Password" to onboard the customer later.
      const dummyPassword = Math.random().toString(36).substring(2, 10) + 'A' + Math.floor(Math.random() * 10) + '!';
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: dummyPassword,
        email_confirm: true, // Silently create without sending an invite link by confirming instantly
      });

      if (authError || !authData.user) {
        return NextResponse.json({ error: 'Failed to create user auth account: ' + authError?.message }, { status: 500 });
      }

      targetUserId = authData.user.id;
    }

    // 3. Create the SIP Service Plan
    const planPayload = {
      user_id: targetUserId,
      stock_code: stock_code.trim().toUpperCase(),
      start_date: start_date || null,
      end_date: end_date || null,
      securities_company: securities_company || null,
      securities_account: securities_account || null,
      assigned_dealer: assigned_dealer || null,
      status,
    };

    const { data: planData, error: planError } = await supabase
      .from('sip_service_plans')
      .insert(planPayload)
      .select('*')
      .single();

    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Client and SIP Plan successfully created',
      plan: planData,
      isNewUser: !profileData
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
