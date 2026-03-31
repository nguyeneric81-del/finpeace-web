import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { LucideTrendingUp, LucideUsers, LucideDatabase } from 'lucide-react';
import Link from 'next/link';

export default async function SipAdminDashboard() {
  const supabase = await createClient();

  // Fetch all asset valuations
  const { data: valuations, error: valError } = await supabase
    .from('sip_asset_valuations')
    .select('*')
    .order('update_date', { ascending: false });

  // Fetch count of active SIP plans
  const { count: activeSips } = await supabase
    .from('sip_service_plans')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            SIP Operations Dashboard
          </h1>
          <p className="text-zinc-400 mt-2">Manage Research Valuations and SIP Accumulators</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/advisor/admin">
            <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition">
              Back to Admin
            </button>
          </Link>
          <button className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 rounded-lg hover:bg-emerald-600/30 transition flex items-center">
            <LucideDatabase className="w-4 h-4 mr-2" />
            Bulk Import CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* KPI Cards */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg shadow-black/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Active SIP Clients</h3>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <LucideUsers className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{activeSips || 0}</p>
        </div>
      </div>

      {/* Valuations Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-black/50">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <LucideTrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
            Quarterly Asset Valuations
          </h2>
          <button className="text-sm px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition">
            Add New Valuation
          </button>
        </div>
        {valError || !valuations || valuations.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No valuation data found in database. 
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Stock Code</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Update Qtr</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Old Value</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Intrinsic Value</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Expected Growth</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">CTA</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {valuations.map((val) => (
                  <tr key={val.id} className="hover:bg-zinc-800/50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-400">{val.stock_code}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{val.quarter_update || 'N/A'}</td>
                    <td className="px-6 py-4 text-zinc-500">{val.old_intrinsic_value?.toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 font-medium text-white">{val.new_intrinsic_value?.toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 text-zinc-300">{val.expected_growth || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${val.cta?.toLowerCase().includes('dừng') ? 'border-red-500/30 text-red-400 bg-red-500/10' : val.cta?.toLowerCase().includes('mua') ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                        {val.cta || 'Neutral'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-zinc-400 hover:text-white transition">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
