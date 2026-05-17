'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  LayoutDashboard, Clock, User, Sparkles, Shield, AlertTriangle, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { storage } from '@/lib/storage';
import { FUNDS, NIFTY, MARKET_SUMMARY } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{display}</span>;
}

function CircularScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
        <circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
        />
        <motion.circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke="#00ffaa"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,170,0.5))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl font-heading font-bold text-accent"
        >
          <AnimatedNumber value={score} />
        </motion.span>
        <span className="text-gray-400 text-sm mt-1">/ 100</span>
      </div>
    </div>
  );
}

function FundCard({ fund, index }: { fund: typeof FUNDS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sparkData = [
    { val: fund.returns['1y'] * 0.7 },
    { val: fund.returns['1y'] * 0.9 },
    { val: fund.returns['3y'] * 0.8 },
    { val: fund.returns['3y'] },
    { val: fund.returns['5y'] * 0.9 },
    { val: fund.returns['5y'] },
    { val: fund.returns['5y'] * 1.1 },
  ];

  const riskColors: Record<string, string> = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const riskIcons: Record<string, React.ReactNode> = {
    Low: <Shield className="w-3 h-3" />,
    Medium: <Zap className="w-3 h-3" />,
    High: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 hover:border-accent/30 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{fund.name}</h3>
          <p className="text-sm text-gray-400">{fund.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${riskColors[fund.risk]}`}>
          {riskIcons[fund.risk]}
          {fund.risk} Risk
        </span>
      </div>

      {/* Returns */}
      <div className="flex gap-4 mb-4">
        {Object.entries(fund.returns).map(([period, value]) => (
          <div key={period} className="bg-dark/50 rounded-lg px-3 py-2 text-center">
            <div className="text-xs text-gray-500 uppercase">{period}</div>
            <div className="text-lg font-bold text-accent">{value}%</div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <Area
              type="monotone"
              dataKey="val"
              stroke="#00ffaa"
              fill="rgba(0,255,170,0.1)"
              strokeWidth={2}
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Why This */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-accent hover:text-white transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Why this for you?
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-400 mt-3 pl-6">{fund.whyThis}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-600 mt-4 italic">
        Past performance does not guarantee future returns.
      </p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const p = storage.getProfile();
    if (!p) {
      router.push('/');
      return;
    }
    setProfile(p);

    const expired = storage.isTrialExpired();
    const subscribed = storage.isSubscribed();
    if (expired && !subscribed) {
      setShowPaywall(true);
    }
  }, [router]);

  if (!profile) return null;

  const isPositive = NIFTY.change >= 0;

  return (
    <div className="min-h-screen animated-gradient pb-24">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},
            </p>
            <h1 className="text-xl font-heading font-bold text-white">Investor 👋</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/time-machine')}
            className="glass p-3 rounded-xl hover:border-accent/50"
          >
            <Clock className="w-5 h-5 text-accent" />
          </motion.button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Finiq Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 text-center glow-accent"
        >
          <h2 className="text-lg text-gray-400 mb-4">Your Finiq Score</h2>
          <CircularScore score={profile.finiqScore || 78} />
          <p className="text-gray-400 mt-4">
            {profile.finiqScore >= 80 ? 'Excellent financial health!' : 
             profile.finiqScore >= 60 ? 'Good progress, keep investing!' : 'Room for improvement'}
          </p>
        </motion.div>

        {/* Market Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Market Pulse
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {NIFTY.current.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}{NIFTY.change}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs text-accent font-semibold">AI Summary</span>
          </div>
          <p className="text-sm text-gray-400">{MARKET_SUMMARY}</p>
        </motion.div>

        {/* Recommendations */}
        <div>
          <h2 className="text-xl font-heading font-bold text-white mb-4">Your Picks</h2>
          <div className="space-y-4">
            {FUNDS.slice(0, 3).map((fund, i) => (
              <FundCard key={fund.id} fund={fund} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-4">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 text-accent">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button 
            onClick={() => router.push('/time-machine')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs">Time Machine</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Paywall Overlay */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => router.push('/paywall')}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass rounded-2xl p-8 text-center max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">Free Trial Ended</h3>
              <p className="text-gray-400 mb-4">Upgrade to continue accessing premium features</p>
              <button
                onClick={() => router.push('/paywall')}
                className="w-full py-3 bg-accent text-dark font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,170,0.3)] transition-all"
              >
                Upgrade Now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
