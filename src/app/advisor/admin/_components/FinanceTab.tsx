'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, UserPlus, FileBarChart, CheckCircle2, ChevronDown, MonitorStop } from 'lucide-react';
import SipPortfolioClient from '@/app/dashboard/sip-portfolio/SipPortfolioClient';

export default function FinanceTab() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedProfileData, setSelectedProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    stock_code: '',
    securities_company: '',
    securities_account: '',
    assigned_dealer: '',
    start_date: '',
    end_date: ''
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sip-clients');
      const data = await res.json();
      if (data.clients) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/sip-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.isNewUser 
          ? 'New profile dynamically created! SIP Plan assigned.' 
          : 'SIP Plan assigned to existing user.');
        setShowAddForm(false);
        fetchClients();
        setFormData({ email: '', stock_code: '', securities_company: '', securities_account: '', assigned_dealer: '', start_date: '', end_date: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      alert('Network Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectClient = async (user_id: string, email: string) => {
    setSelectedUser(email);
    setLoadingProfile(true);
    document.getElementById('portfolio-view')?.scrollIntoView({ behavior: 'smooth' });
    try {
      const res = await fetch(`/api/admin/sip-clients/${user_id}`);
      const data = await res.json();
      setSelectedProfileData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="text-[#c4a67a] w-6 h-6"/> 
            Quản trị Vận hành Tích Sản (SIP)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý kế hoạch và giám sát biểu đồ tăng trưởng danh mục cá nhân của khách hàng.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#c4a67a] text-[#0d1119] px-4 py-2 flex items-center gap-2 rounded-lg font-bold hover:bg-[#d6b789] transition"
        >
          {showAddForm ? <MonitorStop className="w-4 h-4" /> : <UserPlus className="w-4 h-4"/>}
          {showAddForm ? 'Hủy' : 'Thêm Khách hàng SIP'}
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <form onSubmit={handleCreatePlan} className="bg-[#111827] border border-[#c4a67a]/40 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-[#1e2535] pb-4">
            <div className="w-8 h-8 rounded-full bg-[#c4a67a]/20 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#c4a67a]"/>
            </div>
            <h3 className="text-white font-bold text-lg">Khởi tạo Kế hoạch Tích Sản (Tạo Mới hoặc Gán)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email Khách hàng <span className="text-red-400">*</span></label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c4a67a]" placeholder="khachhang@finpeace.vn" />
              <p className="text-[10px] text-slate-500 mt-1">Hệ thống sẽ tự cấp tài khoản nếu email này chưa tồn tại (ko spam KH).</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Mã Cổ Phiếu <span className="text-red-400">*</span></label>
              <input type="text" required value={formData.stock_code} onChange={e => setFormData({...formData, stock_code: e.target.value.toUpperCase()})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c4a67a]" placeholder="FPT, VCB..." />
            </div>
             <div>
              <label className="block text-xs text-slate-400 mb-1">Công ty Chứng khoán</label>
              <input type="text" value={formData.securities_company} onChange={e => setFormData({...formData, securities_company: e.target.value})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c4a67a]" placeholder="KBSV, TCBS..." />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Số Tiểu khoản</label>
              <input type="text" value={formData.securities_account} onChange={e => setFormData({...formData, securities_account: e.target.value})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c4a67a]" placeholder="VD: 077C123..." />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Mã NV Chăm sóc (Dealer)</label>
              <input type="text" value={formData.assigned_dealer} onChange={e => setFormData({...formData, assigned_dealer: e.target.value})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c4a67a]" placeholder="Tuấn Anh..." />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">Ngày Bắt đầu</label>
                <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-[#c4a67a]" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button type="submit" disabled={submitting} className="bg-[#c4a67a] text-[#0d1119] px-6 py-2 rounded-lg font-bold hover:bg-[#d6b789] transition disabled:opacity-50 flex items-center">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <CheckCircle2 className="w-4 h-4 mr-2"/>}
                Gán Kế Hoạch SIP
             </button>
          </div>
        </form>
      )}

      {/* CRM DATA TABLE */}
      <div className="bg-[#111827] border border-[#1e2535] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-[#1e2535] flex items-center justify-between">
           <h3 className="text-white font-bold text-lg">Danh sách Hoạt động (List Active)</h3>
           <span className="bg-[#1e2535] text-slate-300 text-xs px-2 py-1 rounded font-medium">{clients.length} KH</span>
        </div>
        
        {loading ? (
           <div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin text-[#c4a67a]"/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-[#0a0f1c] text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3">Khách hàng (Line)</th>
                  <th className="px-5 py-3">Phân bổ SIP</th>
                  <th className="px-5 py-3">Tài khoản & Dealer</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2535]">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-[#1e2535]/30 group transition">
                    <td className="px-5 py-3">
                      <div className="text-white font-medium">{client.profiles?.email || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{client.profiles?.full_name || 'CRM Direct'}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono text-xs border border-emerald-500/20">
                        {client.stock_code}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-slate-300">{client.securities_company || '--'}</div>
                      <div className="text-[10px] text-slate-500">{client.securities_account ? `TK: ${client.securities_account}` : 'Chưa nhập TK'}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${client.status === 'Active' ? 'bg-[#c4a67a]/20 text-[#c4a67a]' : 'bg-slate-800 text-slate-400'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button 
                        onClick={() => handleSelectClient(client.user_id, client.profiles?.email)}
                        className="text-xs font-semibold px-3 py-1.5 bg-[#1e2535] hover:bg-emerald-600 hover:text-white rounded-md transition"
                      >
                        Tiến trình
                      </button>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 italic">No SIP Clients mapped yet.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PORTFOLIO VIEWER */}
      <div id="portfolio-view" className="pt-4">
        {selectedUser && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1 border-l-4 border-emerald-500 pl-3">
              SIP Report: {selectedUser}
            </h3>
            <p className="text-sm text-slate-400 pl-4 mb-4">Mô phỏng 100% màn hình hiển thị của khách hàng này để Advisor hỗ trợ/gọi điện.</p>
            
            {loadingProfile ? (
              <div className="h-64 flex items-center justify-center bg-[#111827] rounded-xl border border-[#1e2535]">
                <Loader2 className="animate-spin text-emerald-500 w-8 h-8"/>
              </div>
            ) : selectedProfileData ? (
              <div className="bg-[#111827] rounded-2xl border border-[#1e2535] p-2 md:p-6 shadow-2xl">
                 <SipPortfolioClient 
                    plans={selectedProfileData.plans} 
                    performanceData={selectedProfileData.performanceData} 
                    insights={selectedProfileData.insights} 
                 />
              </div>
            ) : null}
          </div>
        )}
      </div>

    </div>
  );
}
