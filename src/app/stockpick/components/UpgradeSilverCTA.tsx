import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

interface UpgradeSilverCTAProps {
  user: {
    id: string;
    name: string;
    email: string;
    tier: 'FREE' | 'BRONZE' | 'SILVER';
    credits?: number;
    role: string;
  };
  onUpgradeSuccess: (updatedUser: any) => void;
}

export default function UpgradeSilverCTA({ user, onUpgradeSuccess }: UpgradeSilverCTAProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const handleUpgrade = async () => {
    setLoading(true);
    setStep(1);
    
    // Simulate KBSV connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const res = await fetch('/api/stockpick/upgrade-silver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        // Wait briefly to show success state before hiding CTA
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const updatedUser = { ...user, tier: 'SILVER' as const, credits: data.credits };
        onUpgradeSuccess(updatedUser);
      } else {
        alert(data.error || 'Upgrade failed');
        setStep(0);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while upgrading');
      setStep(0);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden relative mt-6"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08), rgba(6,11,20,0.8))',
        border: '1px solid rgba(245,158,11,0.25)',
        boxShadow: '0 8px 32px rgba(245,158,11,0.08)',
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-[40px]"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Nâng cấp lên SILVER</p>
            <p className="text-xs" style={{ color: 'rgba(245,158,11,0.8)' }}>
              Nhận 200 credits ngay
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Unlock advanced market insights, priority support, và khả năng kết nối KBSV.
        </p>
        <motion.button
          onClick={handleUpgrade}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mt-4"
          style={{
            background: loading ? 'rgba(245,158,11,0.4)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {step === 0 && (
            <>
              Nâng lên SILVER
              <ArrowRight className="w-4 h-4" />
            </>
          )}
          {step === 1 && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang kết nối máy chủ KBSV...
            </>
          )}
          {step === 2 && (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              Liên kết thành công!
            </>
          )}
        </motion.button>
        <p className="text-center text-[10px] mt-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Bảo mật &amp; tự động đồng bộ với KBSV
        </p>
      </div>
    </motion.section>
    </div>
  );
}
