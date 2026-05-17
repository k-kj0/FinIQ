'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { FUNDS } from '@/lib/data';
import { formatCurrency, calculateSIP, generateChartData } from '@/lib/utils';

const YEARS = [1, 3, 5, 10];

export default function TimeMachinePage() {
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [selectedYears, setSelectedYears] = useState(5);
  const [selectedFund, setSelectedFund] = useState(FUNDS[2]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ invested: 0, worth: 0 });

  useEffect(() => {
    const data = generateChartData(monthlyAmount, selectedYears, selectedFund.returns['5y']);
    setChartData(data);
    const result = calculateSIP(monthlyAmount, selectedYears, selectedFund.returns['5y']);
    setTotals(result);
  }, [monthlyAmount, selectedYears, selectedFund]);

  return (
    <div className="min-h-screen animated-gradient px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/dashboard')}
            className="glass p-3 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-2xl font-heading font-bold text-white">Time Machine</h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-8"
        >
          What if you started earlier?
        </motion.p>

        {/* Monthly Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <label className="text-sm text-gray-400 mb-2 block">Monthly Investment</label>
          <div className="text-4xl font-heading font-bold text-accent mb-4">
            ₹{monthlyAmount.toLocaleString('en-IN')}
          </div>
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₹500</span>
            <span>₹50,000</span>
          </div>
        </motion.div>

        {/* Year Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <label className="text-sm text-gray-400 mb-3 block">Time Horizon</label>
          <div className="flex gap-3">
            {YEARS.map((year) => (
              <motion.button
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedYears(year)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  selectedYears === year
                    ? 'bg-accent text-dark'
                    : 'glass text-white hover:border-accent/50'
                }`}
              >
                {year} Year{year > 1 ? 's' : ''}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Fund Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <label className="text-sm text-gray-400 mb-3 block">Select Fund</label>
          <div className="space-y-2">
            {FUNDS.map((fund) => (
              <motion.button
                key={fund.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFund(fund)}
                className={`w-full p-4 rounded-xl text-left flex justify-between items-center transition-all ${
                  selectedFund.id === fund.id
                    ? 'bg-accent/20 border border-accent/50'
                    : 'glass hover:border-accent/30'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">{fund.name}</div>
                  <div className="text-sm text-gray-400">{fund.type}</div>
                </div>
                <div className="text-accent font-bold">{fund.returns['5y']}%</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Portfolio Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffaa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ffaa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => formatCurrency(val)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area
                  type="monotone"
                  dataKey="worth"
                  stroke="#00ffaa"
                  fillOpacity={1}
                  fill="url(#colorWorth)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Totals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">You would have invested</p>
            <p className="text-3xl font-heading font-bold text-white">
              {formatCurrency(totals.invested)}
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center glow-accent">
            <p className="text-sm text-gray-400 mb-2">Worth today</p>
            <p className="text-3xl font-heading font-bold text-accent">
              {formatCurrency(totals.worth)}
            </p>
          </div>
        </motion.div>

        {/* Gain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-accent mb-8"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">
            Potential gain: {formatCurrency(totals.worth - totals.invested)} 
            ({((totals.worth / totals.invested - 1) * 100).toFixed(1)}%)
          </span>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-accent text-dark font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(0,255,170,0.3)] transition-all"
        >
          Start This SIP Today
        </motion.button>
      </div>
    </div>
  );
}
