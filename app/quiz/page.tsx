'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, Home, Car, Umbrella, GraduationCap,
  Wallet, Clock, Shield, AlertTriangle, Zap,
  ChevronRight, Sparkles
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { calculateFiniqScore } from '@/lib/utils';

const QUESTIONS = [
  {
    id: 1,
    question: "What's your monthly income?",
    type: 'options',
    options: [
      { label: 'Under ₹25k', value: 'under25k' },
      { label: '₹25k - ₹50k', value: '25to50k' },
      { label: '₹50k - ₹1L', value: '50kto1L' },
      { label: 'Above ₹1L', value: 'above1L' },
    ],
  },
  {
    id: 2,
    question: 'How much can you invest monthly?',
    type: 'slider',
    min: 500,
    max: 50000,
    step: 500,
  },
  {
    id: 3,
    question: "What's your goal?",
    type: 'cards',
    options: [
      { label: 'Wealth', icon: TrendingUp, color: '#00ffaa' },
      { label: 'House', icon: Home, color: '#60a5fa' },
      { label: 'Car', icon: Car, color: '#f472b6' },
      { label: 'Retirement', icon: Umbrella, color: '#fbbf24' },
      { label: 'Education', icon: GraduationCap, color: '#a78bfa' },
    ],
  },
  {
    id: 4,
    question: 'Time horizon?',
    type: 'pills',
    options: ['1yr', '3yr', '5yr', '10yr+'],
  },
  {
    id: 5,
    question: 'Risk appetite?',
    type: 'risk',
    options: [
      { label: 'Safe', desc: 'Capital protection priority. 6-8% returns.', level: 1 },
      { label: 'Moderate', desc: 'Balanced risk-reward. 10-14% returns.', level: 2 },
      { label: 'Aggressive', desc: 'High risk for high reward. 15-20% returns.', level: 3 },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sliderValue, setSliderValue] = useState(5000);
  const [isCalculating, setIsCalculating] = useState(false);
  const [direction, setDirection] = useState(1);

  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  const handleAnswer = (answer: any) => {
    const q = QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCalculating(true);
      const profile = {
        income: newAnswers[1],
        monthlyInvestment: newAnswers[2],
        goal: newAnswers[3],
        timeHorizon: newAnswers[4],
        riskAppetite: newAnswers[5],
        finiqScore: calculateFiniqScore(newAnswers),
      };
      storage.setProfile(profile);
      storage.setInstallDate();
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    }
  };

  const renderQuestion = () => {
    const q = QUESTIONS[currentQuestion];

    switch (q.type) {
      case 'options':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(0,255,170,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(opt.value)}
                className="glass p-6 rounded-2xl text-left hover:border-accent/50 transition-all"
              >
                <span className="text-lg font-semibold text-white">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <span className="text-5xl font-heading font-bold text-accent">
                ₹{sliderValue.toLocaleString('en-IN')}
              </span>
              <p className="text-gray-400 mt-2">per month</p>
            </motion.div>
            <div className="px-4">
              <input
                type="range"
                min={q.min}
                max={q.max}
                step={q.step}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹{q.min}</span>
                <span>₹{(q.max / 1000).toFixed(0)}k</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(sliderValue)}
              className="w-full py-4 bg-accent text-dark font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,170,0.3)] transition-all"
            >
              Continue <ChevronRight className="inline w-5 h-5 ml-1" />
            </motion.button>
          </div>
        );

      case 'cards':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {q.options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt.label)}
                  className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-accent/50 transition-all"
                >
                  <Icon className="w-8 h-8" style={{ color: opt.color }} />
                  <span className="text-sm font-semibold text-white">{opt.label}</span>
                </motion.button>
              );
            })}
          </div>
        );

      case 'pills':
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {q.options.map((opt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                className="glass px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent/20 hover:border-accent transition-all"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-4">
            {q.options.map((opt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(opt.label)}
                className="w-full glass p-6 rounded-2xl text-left hover:border-accent/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((bar) => (
                      <div
                        key={bar}
                        className={`w-2 h-6 rounded-full ${
                          bar <= opt.level ? 'bg-accent' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-accent">{opt.label}</span>
                </div>
                <p className="text-gray-400 text-sm ml-10">{opt.desc}</p>
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-accent/30 border-t-accent rounded-full mx-auto mb-8"
          />
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Calculating your Finiq Score...
          </h2>
          <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-10">
              {QUESTIONS[currentQuestion].question}
            </h1>
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
