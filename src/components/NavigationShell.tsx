'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Bot, Award, User, 
  Flame, Star, ChevronRight, CheckCircle, School,
  Sparkles, LogOut, ArrowRight, Shield, X, Book, Lock, HelpCircle,
  CreditCard, Zap
} from 'lucide-react';
import { 
  tessaDb, StudentProfile, StudentProgress, LevelInfo, JourneyItem, LEVELS, ACHIEVEMENTS, Achievement,
  getLessonsForChapter 
} from '@/lib/tessaDb';
import LessonPlayer from './LessonPlayer';
import TessaTutor from './TessaTutor';
import ComicReader from './ComicReader';
import TessaSecretCodeMission from './TessaSecretCodeMission';
import { playCorrectSound, playIncorrectSound } from '@/lib/soundEffects';

interface NavigationShellProps {
  onLogout: () => void;
}

interface ParticleData {
  id: number;
  width: string;
  height: string;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function NavigationShell({ onLogout }: NavigationShellProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'tutor' | 'achievements' | 'profile'>('home');
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeComic, setActiveComic] = useState<{ classNumber: number; chapterNumber: number } | null>(null);
  const [customMissionOpen, setCustomMissionOpen] = useState(false);
  
  // Premium paywall states
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyPlan, setBuyPlan] = useState<'monthly' | 'annual'>('annual');
  const [activationCode, setActivationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [homeSubView, setHomeSubView] = useState<'map' | 'level-detail'>('map');
  const [viewedLevelNum, setViewedLevelNum] = useState<number>(1);
  const [expandedPanels, setExpandedPanels] = useState<number[]>([]);
  const [expandedLevelNum, setExpandedLevelNum] = useState<number | null>(null);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const mainContentRef = React.useRef<HTMLElement>(null);

  const currentLevel = profile?.current_level || 1;
  const currentLevelInfo = LEVELS.find(l => l.number === currentLevel) || LEVELS[0];
  const isTutorLocked = currentLevel < 4;

  // Load and refresh state
  const refreshData = () => {
    const prof = tessaDb.getProfile();
    setProfile(prof);
    setProgress(tessaDb.getProgress());
  };

  useEffect(() => {
    refreshData();

    // Generate random particles for the starfield
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      const list: ParticleData[] = [];
      const trackHeight = 1800; // approx height for the map spine
      for (let i = 0; i < 26; i++) {
        const size = 2 + Math.random() * 2.5;
        list.push({
          id: i,
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * trackHeight}px`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 3}s`,
        });
      }
      setParticles(list);
    }
  }, []);

  const jumpTo = (stage: string) => {
    const el = document.getElementById('stage-' + stage);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When profile.current_level changes (e.g. from graduation), auto-align viewedLevelNum
  useEffect(() => {
    if (profile?.current_level) {
      setViewedLevelNum(profile.current_level);
    }
  }, [profile?.current_level]);

  // Safety tab redirect if tutor is locked
  useEffect(() => {
    if (activeTab === 'tutor' && profile && (profile.current_level || 1) < 4) {
      setActiveTab('home');
    }
  }, [activeTab, profile]);

  // Auto-scroll map container to top on load/sub-view transition is handled naturally by mounting at top.

  const handleLessonClose = (results?: any) => {
    setActiveLesson(null);
    refreshData();
    if (results && results.xpEarned > 0) {
      triggerNotification(`🎉 Mission Complete! +${results.xpEarned} XP awarded!`);
    }
  };

  const handleCustomMissionClose = (results?: any) => {
    setCustomMissionOpen(false);
    refreshData();
    if (results && results.xpEarned > 0) {
      triggerNotification(`🎉 "TESSA's Secret Code" Complete! +${results.xpEarned} XP awarded!`);
      if (results.levelUp) {
        triggerNotification(`🎓 LEVEL UP! You reached Level ${results.newLevel}! 🎉`);
      }
    }
  };

  const resetBuyModal = () => {
    setShowBuyModal(false);
    setActivationCode('');
    setCodeError('');
    setCodeSuccess('');
    setIsProcessingPayment(false);
    setPaymentSuccess(false);
  };

  const handleVerifyCode = () => {
    setCodeError('');
    setCodeSuccess('');
    const cleanCode = activationCode.trim().toUpperCase();
    if (['TESSA100', 'SCHOOL2026', 'TEACHER50', 'PREMIUM', 'FREEACCESS'].includes(cleanCode)) {
      setCodeSuccess('Your request is accepted. You will be contacted soon.');
      setPaymentSuccess(true);
      playCorrectSound();
    } else {
      setCodeError('❌ Invalid code. Please check and try again.');
      playIncorrectSound();
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      playCorrectSound();
    }, 1500);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  if (!profile || !progress) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  // Check if a journey item is completed
  const isItemCompleted = (item: JourneyItem): boolean => {
    if (item.type === 'comic') {
      return (progress.completed_comics || []).includes(item.id);
    } else if (item.type === 'mission') {
      return (progress.completed_lessons || []).includes(item.id);
    } else if (item.type === 'challenge') {
      return (progress.completed_challenges || []).includes(item.id);
    }
    return false;
  };

  // Determine if a journey item is unlocked (strict sequential check)
  const isItemUnlocked = (lvlItems: JourneyItem[], index: number): boolean => {
    if (index === 0) return true;
    const prevItem = lvlItems[index - 1];
    return isItemCompleted(prevItem);
  };

  // Calculate percentage of current level items completed
  const currentLvlItems = currentLevelInfo.items;
  const completedCount = currentLvlItems.filter(isItemCompleted).length;
  const currentLevelProgressPercent = Math.round((completedCount / currentLvlItems.length) * 100);

  const togglePanel = (lvlNum: number) => {
    if (expandedPanels.includes(lvlNum)) {
      setExpandedPanels(expandedPanels.filter(n => n !== lvlNum));
    } else {
      setExpandedPanels([...expandedPanels, lvlNum]);
    }
  };



  // Helper to replace robot emoji with custom SVG in text rendering
  const renderTextWithEmojiReplacement = (text: string) => {
    if (!text || !text.includes('🤖')) return text;
    const parts = text.split('🤖');
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <img src="/icons.svg" className="w-4 h-4 inline-block align-middle mx-0.5 object-contain" alt="robot" />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row pb-20 md:pb-0 h-screen overflow-hidden text-white">
      
      {/* starfield bg overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(0,102,204,0.18)_0%,_transparent_55%),_radial-gradient(ellipse_at_80%_100%,_rgba(0,204,255,0.08)_0%,_transparent_50%)] pointer-events-none z-0" />

      {/* Top Header stats bar (Mobile only) */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 py-3.5 px-4 flex justify-between items-center flex-shrink-0 shadow-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
            {profile.avatar_id === 'avatar_robot' && <img src="/icons.svg" className="w-6 h-6 object-contain" alt="robot" />}
            {profile.avatar_id === 'avatar_fox' && '🦊'}
            {profile.avatar_id === 'avatar_owl' && '🦉'}
            {profile.avatar_id === 'avatar_panda' && '🐼'}
            {profile.avatar_id === 'avatar_astro' && '🚀'}
            {profile.avatar_id === 'avatar_unicorn' && '🦄'}
          </div>
          <div>
            <div className="text-xs font-black text-slate-100 leading-none">{profile.name}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Lvl {currentLevel} · {currentLevelInfo.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full text-xs font-black text-cyan-400">
            <Star fill="currentColor" size={12} />
            {profile.xp}
          </div>
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-black text-rose-400">
            <Flame fill="currentColor" size={12} className="animate-pulse" />
            {profile.streak_days}d
          </div>
        </div>
      </div>

      {/* Sidebar Navigation (Desktop only) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-850 p-5 flex-shrink-0 justify-between z-10 relative">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-10 h-10 bg-cyan-500 border-b-4 border-cyan-700 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              T
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              TESSA<span className="text-cyan-400">Focus</span>
            </span>
          </div>

          {/* User statistics card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                {profile.avatar_id === 'avatar_robot' && <img src="/icons.svg" className="w-7 h-7 object-contain" alt="robot" />}
                {profile.avatar_id === 'avatar_fox' && '🦊'}
                {profile.avatar_id === 'avatar_owl' && '🦉'}
                {profile.avatar_id === 'avatar_panda' && '🐼'}
                {profile.avatar_id === 'avatar_astro' && '🚀'}
                {profile.avatar_id === 'avatar_unicorn' && '🦄'}
              </div>
              <div className="truncate flex-1">
                <div className="font-extrabold text-sm text-slate-100 truncate">{profile.name}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase">Level {currentLevel} Student</div>
              </div>
            </div>

            {/* Level item completion progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-wider">
                <span>LVL {currentLevel} Items</span>
                <span>{completedCount}/{currentLvlItems.length} Done</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full border border-slate-850 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all" style={{ width: `${currentLevelProgressPercent}%` }} />
              </div>
            </div>

            {/* XP & Streaks */}
            <div className="flex gap-2">
              <div className="flex-1 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-1.5 text-center">
                <div className="text-xs font-black text-cyan-400 flex items-center justify-center gap-0.5">
                  <Star fill="currentColor" size={10} />
                  {profile.xp}
                </div>
                <div className="text-[8px] font-black text-cyan-600 uppercase tracking-wider mt-0.5">Total XP</div>
              </div>
              <div className="flex-1 bg-rose-950/20 border border-rose-500/20 rounded-xl p-1.5 text-center">
                <div className="text-xs font-black text-rose-400 flex items-center justify-center gap-0.5">
                  <Flame fill="currentColor" size={10} />
                  {profile.streak_days}d
                </div>
                <div className="text-[8px] font-black text-rose-600 uppercase tracking-wider mt-0.5">Streak</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Learning Journey', icon: Home, isLocked: false },
              { id: 'tutor', label: 'AI Tutor TESSA', icon: Bot, isLocked: isTutorLocked },
              { id: 'achievements', label: 'Achievements', icon: Award, isLocked: false },
              { id: 'profile', label: 'Student Profile', icon: User, isLocked: false },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const locked = tab.isLocked;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (locked) {
                      triggerNotification(`🔒 TESSA AI Tutor unlocks at Level 4 (Data Scout)!`);
                    } else {
                      setActiveTab(tab.id as any);
                    }
                  }}
                  className={`w-full py-3 px-4 font-extrabold text-sm rounded-2xl transition-all flex items-center gap-3.5 border-2 ${
                    locked
                      ? 'border-transparent text-slate-500 opacity-55 cursor-not-allowed hover:bg-transparent'
                      : isActive
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={18} className={locked ? 'text-slate-600' : ''} />
                  <span className={locked ? 'text-slate-500' : ''}>{tab.label}</span>
                  {locked && <Lock size={12} className="ml-auto text-slate-600" />}
                </button>
              );
            })}
          </nav>


        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="py-3 px-4 flex items-center gap-3 border-2 border-transparent text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all text-xs font-extrabold"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto h-full flex flex-col z-10 relative">
        
        {/* Floating notification banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 16 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700/50 text-white font-black text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 max-w-sm text-center"
            >
              <Sparkles size={16} className="text-cyan-400 flex-shrink-0 animate-spin" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* HOME VIEW: Level-based journey system */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* STAGE QUICK-NAV / LEGEND */}
                <div className="stage-nav">
                  <div className="stage-chip explore" onClick={() => jumpTo('explore')} role="button" tabIndex={0}>
                    <span className="dot" />Explore · L1–3
                  </div>
                  <div className="stage-chip navigate" onClick={() => jumpTo('navigate')} role="button" tabIndex={0}>
                    <span className="dot" />Navigate · L4–6
                  </div>
                  <div className="stage-chip build" onClick={() => jumpTo('build')} role="button" tabIndex={0}>
                    <span className="dot" />Build · L7–10
                  </div>
                </div>

                {/* TESSA QUOTE - Student */}
                <div className="tessa-quote">
                  <div className="quote-avatar">🤖</div>
                  <div className="quote-text">
                    <strong>Each level is not just a level you cross.</strong> It's a way of thinking you earn. By the time you reach Level 10, you won't just use technology — you'll understand it well enough to build what comes next. <strong>Let's think about this together!</strong>
                  </div>
                </div>

                {/* STATS STRIP */}
                <div className="stats-strip">
                  <div className="stat-box">
                    <div className="stat-num">10</div>
                    <div className="stat-label">Levels · Age 9+</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">140</div>
                    <div className="stat-label">Chapters across all levels</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">25<span className="text-sm font-black">min</span></div>
                    <div className="stat-label">Daily · 5 days a week</div>
                  </div>
                </div>

                {/* REDESIGNED MAP TRACK */}
                <div className="map-track select-none bg-slate-950/20 border border-slate-900/60 shadow-2xl">
                  {/* Ambient washes */}
                  <div className="stage-wash wash-explore" />
                  <div className="stage-wash wash-navigate" />
                  <div className="stage-wash wash-build" />

                  {/* Particle Starfield */}
                  <div className="particles" id="particles">
                    {particles.map((p) => (
                      <span
                        key={p.id}
                        className="particle"
                        style={{
                          width: p.width,
                          height: p.height,
                          left: p.left,
                          top: p.top,
                          animationDelay: p.animationDelay,
                          animationDuration: p.animationDuration,
                        }}
                      />
                    ))}
                  </div>

                  {/* Central Spine */}
                  <div className="spine-wrap">
                    <div className="spine" />
                    <div className="spine-pulse" />
                  </div>

                  {/* Mile markers */}
                  {[8, 24, 40, 56, 72, 88].map((pct, idx) => (
                    <div
                      key={idx}
                      className="mile"
                      style={{
                        top: `${pct}%`,
                        animationDelay: `${idx * 0.6}s`,
                      }}
                    >
                      ✦
                    </div>
                  ))}

                  {/* Host of Rows & Dividers */}
                  <div className="relative z-10 py-4">
                    {/* EXPLORE banner above Level 1 */}
                    <div className="section-divider" id="stage-explore">
                      <span>EXPLORE Stage · Levels 1-3 · You are an EXPLORER</span>
                    </div>

                    {LEVELS.map((lvl, idx) => {
                      const accentVar = lvl.accentColor;
                      const isCompleted = lvl.number < currentLevel;
                      const isCurrent = lvl.number === currentLevel;
                      const isLocked = lvl.number > currentLevel;
                      const isExpanded = expandedLevelNum === lvl.number;
                      const lvlCompletedCount = lvl.items.filter(isItemCompleted).length;

                      return (
                        <React.Fragment key={lvl.number}>
                          <div
                            className={`level-row ${lvl.number === 10 ? 'capstone' : ''} ${isCurrent ? 'is-current' : ''}`}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isExpanded}
                            onClick={() => {
                              setExpandedLevelNum(prev => prev === lvl.number ? null : lvl.number);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setExpandedLevelNum(prev => prev === lvl.number ? null : lvl.number);
                              }
                            }}
                          >
                            <div className="node-wrap">
                              {isCurrent && <div className="you-are-here">YOU ARE HERE</div>}
                              <div
                                className={`level-node ${isCurrent ? 'is-active' : isLocked ? 'is-locked' : ''}`}
                                style={{ borderColor: accentVar, color: accentVar }}
                              >
                                <span className="node-num">L{lvl.number}</span>
                                {lvl.icon === '🤖' ? (
                                  <img src="/icons.svg" className="w-5 h-5 object-contain" alt="robot" />
                                ) : (
                                  <span className="node-icon">{lvl.icon}</span>
                                )}
                              </div>
                              {isCompleted && (
                                <div className="absolute -bottom-1 -right-1 z-10 bg-green-500 border border-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white shadow-md">
                                  ✓
                                </div>
                              )}
                              {isCurrent && (
                                <div className="absolute -bottom-1 -right-1 z-10 bg-cyan-400 border border-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-950 font-extrabold animate-bounce shadow-md">
                                  ★
                                </div>
                              )}
                              {isLocked && <div className="lock-badge">🔒</div>}
                            </div>

                            <div className="level-card-body">
                              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: accentVar, borderRadius: '3px 0 0 3px' }} />
                              <div className="card-top">
                                <span className="class-tag" style={{ color: accentVar }}>Level {lvl.number}</span>
                                <span className="skill-tag" style={{ background: lvl.bgColor, color: lvl.dkColor }}>{lvl.skillTag}</span>
                              </div>
                              <div className="body-student">
                                <div className="name-student" style={{ color: accentVar }}>
                                  {lvl.name}
                                  <span className="sub-tagline">{lvl.subTagline}</span>
                                </div>
                                <p className="card-desc">{lvl.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Inline Detail panel with integrated checklist for unlocked levels */}
                          <div className={`detail-panel ${isExpanded ? 'open' : ''}`} id={`detail-${lvl.number}`}>
                            <div className="dp-title">{isCurrent ? "What you're doing right now" : 'What this level covers'}</div>
                            <div className="text-slate-300 font-medium mb-3">{lvl.description}</div>
                            
                            <div className="font-extrabold text-[11px] text-white mt-3 mb-1.5">Key Skills & Outcomes:</div>
                            <div className="dp-chips">
                              {lvl.outcomes.map((outcome, oIdx) => (
                                <span key={oIdx} className="dp-chip">{outcome}</span>
                              ))}
                            </div>

                            {/* Checklist progression block */}
                            {!isLocked ? (
                              <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">Required Progression Flow</h4>
                                  <span className="text-[9px] font-black text-cyan-400 tracking-wider uppercase">
                                    {lvl.number < currentLevel ? 'Replay Mode' : 'Strict Sequence'}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {lvl.items.map((item, idx) => {
                                    const completed = isItemCompleted(item);
                                    const unlocked = lvl.number < currentLevel || isItemUnlocked(lvl.items, idx);
                                    const premiumLocked = !completed && (profile.subscription_status !== 'premium') && (item.id !== 'l1_c1' && item.id !== 'tessa_secret_code');
                                    
                                    let typeLabel = '📖 Comic Book';
                                    if (item.type === 'mission') typeLabel = '🚀 Learning Mission';
                                    if (item.type === 'challenge') typeLabel = '🏆 Graduation Challenge';
                                    if (premiumLocked) typeLabel += ' · 💎 Premium';

                                    return (
                                      <div
                                        key={item.id}
                                        className={`p-3 border rounded-xl flex items-center justify-between gap-3 transition-all ${
                                          completed
                                            ? 'bg-green-950/10 border-green-500/20'
                                            : premiumLocked
                                            ? 'bg-indigo-950/10 border-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.02)]'
                                            : unlocked
                                            ? 'bg-slate-900 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.02)]'
                                            : 'bg-slate-950/10 border-slate-900/50 opacity-40 select-none'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                            completed
                                              ? 'bg-green-500/10 border-green-500 text-green-400 shadow-inner'
                                              : premiumLocked
                                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                              : unlocked
                                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                              : 'bg-slate-900 border-slate-800 text-slate-500'
                                          }`}>
                                            {completed ? (
                                              <CheckCircle size={14} />
                                            ) : premiumLocked ? (
                                              <span className="text-[10px] font-extrabold text-indigo-400">💎</span>
                                            ) : unlocked ? (
                                              idx + 1
                                            ) : (
                                              <Lock size={12} />
                                            )}
                                          </div>
                                          
                                          <div className="truncate">
                                            <div className="text-[8px] font-bold text-slate-500 uppercase leading-none">{typeLabel}</div>
                                            <h5 className="font-extrabold text-slate-100 text-xs leading-tight truncate mt-0.5">{item.title}</h5>
                                            {item.subtitle && <p className="text-slate-400 text-[10px] leading-none mt-0.5 truncate">{item.subtitle}</p>}
                                          </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                          {completed ? (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.type === 'comic') {
                                                  setActiveComic({ classNumber: item.comicClass || 3, chapterNumber: item.comicNumber || 1 });
                                                } else if (item.id === 'tessa_secret_code') {
                                                  setCustomMissionOpen(true);
                                                } else {
                                                  const lessons = getLessonsForChapter(item.refId || item.id);
                                                  if (lessons.length > 0) setActiveLesson(lessons[0]);
                                                }
                                              }}
                                              className="py-1 px-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 font-bold rounded-lg text-[10px] text-slate-300 transition-all cursor-pointer"
                                            >
                                              Review
                                            </button>
                                          ) : premiumLocked ? (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setShowBuyModal(true);
                                              }}
                                              className="py-1 px-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 active:scale-95 text-white font-black rounded-lg text-[10px] transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] cursor-pointer"
                                            >
                                              Unlock 💎
                                            </button>
                                          ) : unlocked ? (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.type === 'comic') {
                                                  tessaDb.completeJourneyItem(item.id, 'comic', item.xpReward);
                                                  setActiveComic({ classNumber: item.comicClass || 3, chapterNumber: item.comicNumber || 1 });
                                                  refreshData();
                                                } else if (item.id === 'tessa_secret_code') {
                                                  setCustomMissionOpen(true);
                                                } else {
                                                  const lessons = getLessonsForChapter(item.refId || item.id);
                                                  if (lessons.length > 0) setActiveLesson(lessons[0]);
                                                  else triggerNotification(`⚠️ Lesson content under construction!`);
                                                }
                                              }}
                                              className="py-1 px-3 bg-cyan-500 hover:scale-105 active:scale-95 text-slate-950 font-black rounded-lg text-[10px] transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                                            >
                                              Start
                                            </button>
                                          ) : (
                                            <span className="text-[9px] font-black text-slate-650 uppercase flex items-center gap-0.5">
                                              <Lock size={9} /> Locked
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="dp-flag">Not yet built — complete previous levels to unlock! Shown so your progress path is clear.</div>
                            )}
                          </div>

                          {/* NAVIGATE divider after L3 */}
                          {lvl.number === 3 && (
                            <div className="section-divider" id="stage-navigate">
                              <span>NAVIGATE Stage · Levels 4–6 · You are a NAVIGATOR</span>
                            </div>
                          )}

                          {/* BUILD divider after L6 */}
                          {lvl.number === 6 && (
                            <div className="section-divider" id="stage-build">
                              <span>BUILD Stage · Levels 7-10 · You are a BUILDER</span>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* FOOTER STATS */}
                  <div className="foot-stats">
                    <div className="fs-row">
                      <div className="fs-item">
                        <div className="fs-num">{currentLevel}<span style={{ fontSize: '.8rem', color: 'var(--ink-faint)' }}>/10</span></div>
                        <div className="fs-label">Levels Unlocked</div>
                      </div>
                      <div className="fs-item">
                        <div className="fs-num">{progress.completed_lessons.length}<span style={{ fontSize: '.8rem', color: 'var(--ink-faint)' }}>/{LEVELS.reduce((acc, l) => acc + l.items.length, 0)}</span></div>
                        <div className="fs-label">Missions Done</div>
                      </div>
                      <div className="fs-item">
                        <div className="fs-num">{profile.xp}</div>
                        <div className="fs-label">Stars Earned</div>
                      </div>
                    </div>
                    <div className="fs-note">
                      "Live" = chapters you can open today. Everything past Level 1 is on the roadmap, not built yet — shown here on purpose, so progress always feels real.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI TUTOR VIEW */}
            {activeTab === 'tutor' && !isTutorLocked && (
              <motion.div
                key="tutor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <TessaTutor 
                  profile={profile} 
                  onXpEarned={(xp) => {
                    refreshData();
                    triggerNotification(`🎉 AI Tutor achievement unlocked! +${xp} XP!`);
                  }} 
                />
              </motion.div>
            )}

            {/* ACHIEVEMENTS VIEW */}
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                    Earned Badges
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-100">
                    Achievements Lobby
                  </h2>
                  <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto">
                    Complete challenges, explore concepts, and unlock rewards to earn XP!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = progress.unlocked_achievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 transition-all ${
                          isUnlocked
                            ? 'border-slate-800 shadow-lg'
                            : 'opacity-50 border-slate-950 shadow-none'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-3xl flex-shrink-0 shadow-inner ${
                          isUnlocked
                            ? 'bg-amber-500/10 border-amber-500'
                            : 'bg-slate-800 border-slate-700'
                        }`}>
                          {isUnlocked ? ach.icon : '🔒'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-extrabold text-slate-100 text-sm md:text-base leading-tight truncate">
                              {ach.title}
                            </h4>
                            <span className="bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 px-2 py-0.5 rounded flex-shrink-0">
                              +{ach.xp_reward} XP
                            </span>
                          </div>
                          
                          <p className="text-slate-400 font-semibold text-xs mt-0.5 leading-snug">
                            {ach.description}
                          </p>
                          
                          {isUnlocked ? (
                            <div className="text-[9px] text-green-400 font-black uppercase mt-1 flex items-center gap-1">
                              <CheckCircle size={10} /> Completed
                            </div>
                          ) : (
                            <div className="text-[9px] text-slate-500 font-black uppercase mt-1">
                              Locked
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STUDENT PROFILE VIEW */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 pb-12"
              >
                {/* Visual Avatar Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 shadow-lg">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-400 flex items-center justify-center text-5xl bg-slate-950 shadow-inner">
                      {profile.avatar_id === 'avatar_robot' && <img src="/icons.svg" className="w-14 h-14 object-contain" alt="robot" />}
                      {profile.avatar_id === 'avatar_fox' && '🦊'}
                      {profile.avatar_id === 'avatar_owl' && '🦉'}
                      {profile.avatar_id === 'avatar_panda' && '🐼'}
                      {profile.avatar_id === 'avatar_astro' && '🚀'}
                      {profile.avatar_id === 'avatar_unicorn' && '🦄'}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black text-xs">
                      {currentLevel}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-100 leading-none">
                      {profile.name}
                    </h2>
                  </div>
                </div>

                {/* Profile Stats list */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-cyan-500/5 border-2 border-cyan-500/20 rounded-2xl p-3.5 text-center shadow-md">
                    <Star fill="currentColor" className="text-cyan-400 mx-auto" size={18} />
                    <div className="text-lg font-black text-cyan-300 mt-1">{profile.xp}</div>
                    <div className="text-[8px] font-black text-cyan-500 uppercase tracking-wider">XP Score</div>
                  </div>

                  <div className="bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl p-3.5 text-center shadow-md">
                    <Flame fill="currentColor" className="text-rose-400 mx-auto" size={18} />
                    <div className="text-lg font-black text-rose-300 mt-1">{profile.streak_days} Days</div>
                    <div className="text-[8px] font-black text-rose-500 uppercase tracking-wider">Streak</div>
                  </div>

                  <div className="bg-green-500/5 border-2 border-green-500/20 rounded-2xl p-3.5 text-center shadow-md">
                    <BookOpen className="text-green-400 mx-auto" size={18} />
                    <div className="text-lg font-black text-green-300 mt-1">
                      {progress.completed_lessons.length}
                    </div>
                    <div className="text-[8px] font-black text-green-500 uppercase tracking-wider">Missions</div>
                  </div>
                </div>

                {/* Premium segment */}
                <div className="bg-gradient-to-r from-indigo-900 to-purple-955 border border-indigo-500/20 rounded-3xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1 text-center md:text-left">
                    <div className={`text-[9px] font-black border border-white/20 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider ${
                      profile.subscription_status === 'premium'
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-indigo-500/30 text-indigo-300'
                    }`}>
                      {profile.subscription_status === 'premium' ? 'Premium Active' : 'Premium Plan'}
                    </div>
                    <h3 className="font-black text-base">
                      {profile.subscription_status === 'premium' ? 'TESSA Focus Unlimited 💎' : 'TESSA Focus Premium'}
                    </h3>
                    <p className="text-slate-300 font-bold text-xs leading-relaxed max-w-sm">
                      {profile.subscription_status === 'premium'
                        ? 'Thank you for your subscription! You have full access to all 10 Levels, AI Tutor, and printable worksheets.'
                        : 'Unlock unlimited quiz challenges, advanced AI Tutor, graduation certificates, and worksheets!'}
                    </p>
                  </div>
                  {profile.subscription_status !== 'premium' && (
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="py-2.5 px-4 bg-white text-indigo-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
                    >
                      Upgrade <Shield size={14} />
                    </button>
                  )}
                </div>

                {/* Logout button */}
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="w-full py-4 flex items-center justify-center gap-2.5 border-2 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-slate-950 text-rose-400 rounded-2xl font-black text-sm transition-all group cursor-pointer"
                >
                  <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                  Log Out of TESSA Focus
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-3 px-4 flex justify-between items-center z-40 shadow-2xl">
        {[
          { id: 'home', label: 'Journey', icon: Home, isLocked: false },
          { id: 'tutor', label: 'TESSA AI', icon: Bot, isLocked: isTutorLocked },
          { id: 'achievements', label: 'Badges', icon: Award, isLocked: false },
          { id: 'profile', label: 'Profile', icon: User, isLocked: false },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const locked = tab.isLocked;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (locked) {
                  triggerNotification(`🔒 TESSA AI Tutor unlocks at Level 4 (Data Scout)!`);
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className="flex flex-col items-center justify-center flex-1 cursor-pointer"
            >
              <div className={`p-1.5 rounded-full transition-all relative ${
                isActive ? 'text-cyan-400' : locked ? 'text-slate-700' : 'text-slate-500'
              }`}>
                <Icon size={20} className={isActive ? 'stroke-[2.5px]' : ''} />
                {locked && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-500">
                    <Lock size={8} />
                  </div>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wide ${
                isActive ? 'text-cyan-400' : locked ? 'text-slate-600' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Fullscreen Lesson player */}
      <AnimatePresence>
        {activeLesson && (
          <LessonPlayer 
            lesson={activeLesson} 
            onClose={handleLessonClose} 
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Custom Mission (Day 1-5 TESSA's Secret Code) */}
      <AnimatePresence>
        {customMissionOpen && (
          <TessaSecretCodeMission 
            onClose={handleCustomMissionClose} 
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Comic Reader overlay */}
      <AnimatePresence>
        {activeComic && (
          <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col h-full overflow-hidden text-white">
            {/* Header bar */}
            <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Comic Book
                </span>
                <span className="font-extrabold text-sm md:text-base text-slate-200">
                  Level {currentLevel} Comic
                </span>
              </div>
              <button 
                onClick={() => setActiveComic(null)}
                className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            {/* Reader Container */}
            <div className="flex-1 overflow-hidden p-2 md:p-4 flex items-center justify-center bg-slate-950">
              <ComicReader 
                classNumber={activeComic.classNumber} 
                chapterNumber={activeComic.chapterNumber} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Reusable Buy Premium Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-white text-lg">T</div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base leading-none">TESSA <span className="text-cyan-400">Focus Premium</span></h3>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Upgrade Plan</p>
                  </div>
                </div>
                <button 
                  onClick={resetBuyModal}
                  className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {paymentSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">Request Accepted!</h3>
                      <p className="text-slate-350 text-sm max-w-md mx-auto font-semibold">
                        {codeSuccess || "Your request is accepted. You will be contacted soon."}
                      </p>
                    </div>

                    <button
                      onClick={resetBuyModal}
                      className="py-3 px-6 bg-green-500 text-slate-950 font-black rounded-xl text-xs hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                      Close <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Intro */}
                    <div className="text-center space-y-1">
                      <h4 className="text-xl font-black text-white">Unlock TESSA Focus Unlimited 🚀</h4>
                      <p className="text-slate-450 text-[11px] font-semibold max-w-md mx-auto leading-relaxed">
                        Upgrade to access all 10 Levels (140+ chapters), official graduation certificates, CBSE homework aids, and unlimited AI Tutor help.
                      </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      {[
                        { icon: '🎓', title: 'Levels 2-10 Unlocked', desc: 'Full sequential coding logic & AI models.' },
                        { icon: '🤖', title: 'TESSA AI Tutor Chat', desc: '24/7 personal tutor for all school subjects.' },
                        { icon: '🏆', title: 'CBSE Certifications', desc: 'Showcase logic graduation certificates.' },
                        { icon: '🧩', title: '100+ Print Worksheets', desc: 'Fun computational puzzles for offline study.' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <h5 className="font-extrabold text-white text-[11px] leading-tight">{item.title}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug font-semibold">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing options & code split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <h5 className="font-black text-xs text-slate-300">Choose Membership:</h5>
                        
                        <div 
                          onClick={() => setBuyPlan('monthly')}
                          className={`p-3 border rounded-2xl cursor-pointer transition-all flex justify-between items-center ${
                            buyPlan === 'monthly'
                              ? 'border-indigo-500 bg-indigo-500/5'
                              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${buyPlan === 'monthly' ? 'border-indigo-500' : 'border-slate-650'}`}>
                                {buyPlan === 'monthly' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                              </span>
                              Explorer Monthly
                            </div>
                            <p className="text-[9px] text-slate-500 font-semibold pl-4">₹499 / mo ($5.99 USD)</p>
                          </div>
                        </div>

                        <div 
                          onClick={() => setBuyPlan('annual')}
                          className={`p-3 border rounded-2xl cursor-pointer transition-all flex justify-between items-center relative ${
                            buyPlan === 'annual'
                              ? 'border-indigo-500 bg-indigo-500/5'
                              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                          }`}
                        >
                          <div className="absolute -top-2 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-[7px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Save 33%
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${buyPlan === 'annual' ? 'border-indigo-500' : 'border-slate-650'}`}>
                                {buyPlan === 'annual' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                              </span>
                              Elite Architect (Annual)
                            </div>
                            <p className="text-[9px] text-slate-500 font-semibold pl-4">₹3,999 / yr ($47.99 USD)</p>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulatePayment}
                          disabled={isProcessingPayment}
                          className="w-full py-3 bg-indigo-500 text-white font-black rounded-xl text-xs hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                              Processing Secure Payment...
                            </>
                          ) : (
                            <>
                              Pay & Unlock <CreditCard size={12} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Right panel: Code input */}
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 self-start">
                        <h5 className="font-black text-xs text-slate-300 flex items-center gap-1">
                          <Zap size={12} className="text-amber-400" /> Have School Code?
                        </h5>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                          Enter your school license voucher key below to activate access.
                        </p>

                        <div className="space-y-1">
                          <input
                            type="text"
                            value={activationCode}
                            onChange={(e) => {
                              setActivationCode(e.target.value.toUpperCase());
                              setCodeError('');
                            }}
                            placeholder="VOUCHER CODE"
                            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-xs font-black font-mono tracking-widest outline-none text-white uppercase text-center"
                          />
                          {codeError && <p className="text-[9px] text-rose-400 font-bold">{codeError}</p>}
                        </div>

                        <button
                          onClick={handleVerifyCode}
                          disabled={!activationCode.trim()}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold rounded-lg text-[10px] transition-colors border border-slate-800 cursor-pointer disabled:opacity-30"
                        >
                          Verify Code
                        </button>

                        <div className="text-[8px] text-slate-500 font-bold text-center">
                          Demo keys: <code className="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded">SCHOOL2026</code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
