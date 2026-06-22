'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, School, ArrowRight, Check, Languages } from 'lucide-react';
import { tessaDb } from '@/lib/tessaDb';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const AVATARS = [
  { id: 'avatar_robot', emoji: '🤖', name: 'Robo-Tess', color: 'bg-purple-100 border-purple-300 text-purple-600' },
  { id: 'avatar_fox', emoji: '🦊', name: 'Clever Fox', color: 'bg-orange-100 border-orange-300 text-orange-600' },
  { id: 'avatar_owl', emoji: '🦉', name: 'Wise Owl', color: 'bg-blue-100 border-blue-300 text-blue-600' },
  { id: 'avatar_panda', emoji: '🐼', name: 'Panda Coder', color: 'bg-emerald-100 border-emerald-300 text-emerald-600' },
  { id: 'avatar_astro', emoji: '🚀', name: 'Astro Kid', color: 'bg-sky-100 border-sky-300 text-sky-600' },
  { id: 'avatar_unicorn', emoji: '🦄', name: 'AI Unicorn', color: 'bg-pink-100 border-pink-300 text-pink-600' },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<'english' | 'hinglish'>('english');
  const [avatarId, setAvatarId] = useState('');

  const nextStep = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !avatarId) return;
    
    if (step === 2) {
      // Save data & play celebration before exit
      const session = tessaDb.auth.getSession();
      tessaDb.registerStudent({
        email: session?.email ?? `${name.toLowerCase().replace(/\s+/g, '')}@tessafocus.com`,
        name,
        schoolName: '',
        preferredLanguage: language,
        avatarId
      });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    
    setStep(step + 1);
  };

  const handleFinish = () => {
    onComplete();
  };

  // Animation variants
  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_rgba(226,232,240,1)] p-6 md:p-8 relative overflow-hidden">
        
        {/* Progress Dots */}
        {step <= 2 && (
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step {step} of 2
            </span>
            <div className="flex gap-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-tessa-blue'
                      : s < step
                      ? 'w-2.5 bg-tessa-green'
                      : 'w-2.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-sky-50 text-tessa-blue border-2 border-sky-100">
                  <Sparkles size={28} className="animate-pulse" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to TESSA Focus!
                </h1>
                <p className="text-slate-500 text-sm">
                  Let&apos;s start your personalized Computational Thinking & AI adventure!
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User size={16} className="text-slate-400" />
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-tessa-blue focus:bg-white transition-colors outline-none font-medium text-slate-800"
                  />
                </div>
              </div>

              <button
                disabled={!name.trim()}
                onClick={nextStep}
                className={`w-full py-4 text-center ${
                  name.trim() ? 'btn-3d-blue' : 'btn-3d-gray opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  Continue <ArrowRight size={18} />
                </span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Customize Your Experience
                </h2>
                <p className="text-slate-500 text-sm">
                  Pick your avatar and preferred speaking language.
                </p>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {AVATARS.map((av) => {
                  const isSelected = avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => setAvatarId(av.id)}
                      className={`p-2.5 border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-tessa-blue bg-sky-50 shadow-[0_4px_0_0_rgba(28,176,246,0.3)] -translate-y-0.5'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-[0_3px_0_0_rgba(226,232,240,1)]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl ${av.color}`}>
                        {av.emoji === '🤖' ? (
                          <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                        ) : (
                          av.emoji
                        )}
                      </div>
                      <span className="text-slate-600 text-[10px] font-black mt-1.5 truncate max-w-full">
                        {av.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Language Selection */}
              <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-start gap-3">
                <Languages className="text-tessa-blue flex-shrink-0 mt-0.5" size={18} />
                <div className="space-y-1.5 w-full">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Preferred speaking language</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('english')}
                      className={`flex-1 py-1.5 px-3 text-xs font-black border-2 rounded-xl transition-all ${
                        language === 'english'
                          ? 'border-tessa-blue bg-sky-50 text-tessa-blue'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('hinglish')}
                      className={`flex-1 py-1.5 px-3 text-xs font-black border-2 rounded-xl transition-all ${
                        language === 'hinglish'
                          ? 'border-tessa-blue bg-sky-50 text-tessa-blue'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      Hinglish
                    </button>
                  </div>
                </div>
              </div>

              <button
                disabled={!avatarId}
                onClick={nextStep}
                className={`w-full py-4 text-center ${
                  avatarId ? 'btn-3d-blue' : 'btn-3d-gray opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  Finish Setup <Check size={18} />
                </span>
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center space-y-6 py-4"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-tessa-green-light border-4 border-tessa-green flex items-center justify-center text-4xl animate-bounce">
                  ✨
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-tessa-green">
                    You are Ready!
                  </h2>
                  <p className="text-slate-600 font-bold text-sm">
                    Awesome job, {name}! Your TESSA Focus account is active.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 max-w-xs mx-auto">
                <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                  +50 XP
                </div>
                <div className="text-xs font-black text-amber-700 uppercase tracking-wide">
                  Welcome Bonus Earned!
                </div>
                <div className="text-xs text-amber-600 font-semibold mt-1">
                  You start at Level 1 (Curious Spark)
                </div>
              </div>

              <button onClick={handleFinish} className="w-full py-4 text-center btn-3d-green">
                <span className="text-md">Start Learning Journey</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
