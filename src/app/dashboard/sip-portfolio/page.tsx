import React from 'react';
import { createClient } from '@/utils/supabase/server';
import SipPortfolioClient from './SipPortfolioClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SipPortfolioPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) redirect('/login');

  const userId = userData.user.id;

  const [{ data: plans }, { data: transactions }, { data: performance }, { data: profile }] = await Promise.all([
    supabase.from('sip_service_plans').select('*').eq('user_id', userId),
    supabase.from('sip_transactions').select('*').eq('user_id', userId).order('order_date', { ascending: false }),
    supabase.from('sip_performance_snapshots').select('*').eq('user_id', userId).order('month', { ascending: true }),
    supabase.from('profiles').select('full_name').eq('id', userId).single(),
  ]);

  // Only fetch insights for the stocks this user actually has
  const userStocks = [...new Set((plans || []).map((p: any) => p.stock_code))];
  const { data: insights } = await supabase
    .from('sip_asset_valuations')
    .select('*')
    .in('stock_code', userStocks.length > 0 ? userStocks : ['__none__'])
    .in('status', ['Published', 'PUBLISHED'])
    .order('update_date', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Về Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">
            Kho Cổ Phiếu Tích Sản
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Xin chào {profile?.full_name || 'bạn'} — đây là toàn bộ hành trình tích lũy của bạn cùng FinPeace.
          </p>
        </div>

        <SipPortfolioClient
          plans={plans || []}
          transactions={transactions || []}
          performanceData={performance || []}
          insights={insights || []}
        />
      </div>
    </div>
  );
}
