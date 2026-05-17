'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, X, Sparkles, Lock } from 'lucide-react';
import { FEATURES } from '@/lib/data';
import { storage } from '@/lib/storage';

export default function PaywallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const plans = {
    monthly: { price: 299, period: 'month', savings: 0 },
    yearly: { price: 199, period: 'month', savings: 33, total: 2388 },
  };

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate Razorpay
    await new Promise(resolve => setTimeout(resolve, 1500));
    storage.setSubscribed(true);
    setLoading(false);
    router.push('/dashboard');
  };

  const handleLimitedAccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen animated-gradient px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Close */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLimitedAccess}
            className="glass p-2 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Lock className="w-10 h-10 text-accent" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-heading font-bold text-white text-center mb-3"
        >
          Unlock Full Power
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-center mb-8"
        >
          Your free trial has ended. Upgrade to continue.
        </motion.p>

        {/* Plan Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-1 flex mb-8"
        >
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-accent text-dark'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all relative ${
              selectedPlan === 'yearly'
                ? 'bg-accent text-dark'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              -33%
            </span>
          </button>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <span className="text-5xl font-heading font-bold text-accent">
            ₹{plans[selectedPlan].price}
          </span>
          <span className="text-gray-400">/{plans[selectedPlan].period}</span>
          {selectedPlan === 'yearly' && (
            <p className="text-sm text-gray-500 mt-1">
              ₹{plans.yearly.total} billed annually
            </p>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 mb-4 last:mb-0"
            >
              <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-accent" />
              </div>
              <span className="text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 bg-accent text-dark font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(0,255,170,0.3)] transition-all disabled:opacity-50 mb-4"
        >
          {loading ? 'Processing...' : 'Subscribe with Razorpay'}
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleLimitedAccess}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
        >
          Continue with limited access
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs text-gray-600 text-center mt-6"
        >
          Cancel anytime. No hidden fees. Secure payment via Razorpay.
        </motion.p>
      </div>
    </div>
  );
}
