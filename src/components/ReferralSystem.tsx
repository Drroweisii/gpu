import React, { useState } from 'react';
import { useTelegramUser } from '../hooks/useTelegramUser';
import { Users, Copy, Share2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  earnings: number;
}

export function ReferralSystem() {
  const user = useTelegramUser();
  const [stats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    earnings: 0
  });

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      WebApp.showPopup({
        title: 'Success',
        message: 'Referral code copied to clipboard!',
        buttons: [{ type: 'ok' }]
      });
    }
  };

  const handleShare = () => {
    if (user?.referralCode) {
      const message = `🚀 Free USDT Mining - Join now!\n\nhttps://t.me/BekatchoBot?start=${user.referralCode}`;
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-purple-500/20 rounded-2xl p-3 border border-purple-500/30">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Referral Program</h2>
            <p className="text-purple-300">Invite friends and earn rewards</p>
          </div>
        </div>

        {user ? (
          <>
            <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <code className="text-xl font-mono text-white">{user.referralCode}</code>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 
                             border border-purple-500/30 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 
                             border border-blue-500/30 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total Referrals"
                value={stats.totalReferrals}
                color="purple"
              />
              <StatCard
                label="Active Referrals"
                value={stats.activeReferrals}
                color="blue"
              />
              <StatCard
                label="Total Earnings"
                value={stats.earnings}
                suffix="EMSX"
                color="green"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Please open this app in Telegram to use the referral system
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  color: string;
}

function StatCard({ label, value, suffix, color }: StatCardProps) {
  return (
    <div className={`bg-${color}-500/10 rounded-xl p-4 border border-${color}-500/20`}>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">
        {value}
        {suffix && <span className="text-sm ml-1 text-gray-400">{suffix}</span>}
      </p>
    </div>
  );
}