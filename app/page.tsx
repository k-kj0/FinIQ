'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { TrendingUp, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';
import { STATS } from '@/lib/data';
import { storage } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handleStart = () => {
    storage.setInstallDate();
    router.push('/quiz');
  };

  const particlesOptions = {
    fullScreen: { enable: false },
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: '#00ffaa' },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: { enable: true, minimumValue: 1 } },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none' as const,
        random: true,
        straight: false,
        outModes: { default: 'out' as const },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#00ffaa',
        opacity: 0.1,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' as const },
        onClick: { enable: true, mode: 'push' as const },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.3 } },
        push: { quantity: 4 },
      },
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden animated-gradient">
      {/* Particle Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="glass px-5 py-2.5 rounded-full flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-gray-300">AI-Powered for Indian Investors</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-center text-white mb-6 text-glow"
        >
          Stop guessing.
          <br />
          <span className="text-accent">Start growing.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-12 leading-relaxed"
        >
          India&apos;s first AI that builds your personal investment roadmap in 60 seconds
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="group relative px-10 py-5 bg-accent text-dark font-heading font-bold text-lg rounded-2xl 
                     shadow-[0_0_60px_rgba(0,255,170,0.3)] hover:shadow-[0_0_80px_rgba(0,255,170,0.5)]
                     transition-all duration-300 flex items-center gap-3"
        >
          Get My Free Plan
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-xs text-gray-600 text-center max-w-md"
        >
          Past performance is not a guarantee of future returns. Investments are subject to market risks.
        </motion.p>
      </div>
    </main>
  );
}
