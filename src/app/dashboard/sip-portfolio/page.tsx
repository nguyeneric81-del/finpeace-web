import React from 'react';
import { createClient } from '@/utils/supabase/server';
import SipPortfolioClient from './SipPortfolioClient';
import { redirect } from 'next/navigation';

export default async function SipPortfolioPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect('/login');
  }

  // Fetch their active SIP plans
  const { data: plans } = await supabase
    .from('sip_service_plans')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('status', 'Active');

  // Fetch performance data
  const { data: performance } = await supabase
    .from('sip_performance_snapshots')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('month', { ascending: true });

  // Fetch Latest Insights (assuming FPT for generic example if plans exist)
  // In a real app we'd map this to their specific stocks.
  const { data: insights } = await supabase
    .from('sip_asset_valuations')
    .select('*')
    .eq('status', 'Published')
    .order('update_date', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Your Tích Sản (SIP) Portfolio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track your systematic accumulation and performance against the VN-Index.
        </p>
      </div>

      <SipPortfolioClient 
        plans={plans || []} 
        performanceData={performance || []} 
        insights={insights || []} 
      />
    </div>
  );
}
