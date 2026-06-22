'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, HelpCircle, CheckCircle, AlertTriangle, Star, ShieldAlert, Volume2 } from 'lucide-react';
import { Lesson, QuizQuestion, tessaDb, Achievement } from '@/lib/tessaDb';
import confetti from 'canvas-confetti';
import { playCorrectSound, playIncorrectSound } from '@/lib/soundEffects';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: (results?: {
    xpEarned: number;
    unlockedAchievements: Achievement[];
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  }) => void;
}

export default function LessonPlayer({ lesson, onClose }: LessonPlayerProps) {
  const [mode, setMode] = useState<'slides' | 'quiz' | 'celebration'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  
  // Quiz states
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  // Result summary
  const [summaryResults, setSummaryResults] = useState<{
    xpEarned: number;
    unlockedAchievements: Achievement[];
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  } | null>(null);

  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);

  // Stop speaking when slide, mode, or question index changes, or on unmount
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slideIndex, mode, questionIndex]);

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser version.");
      return;
    }
    if (speechActiveId === id) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      return;
    }
    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
      .replace(/[*#_`~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const femaleEnglishVoice = voices.find(v => v.lang.startsWith('en') && /female/i.test(v.name));
    const EnglishVoice = femaleEnglishVoice || voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB'));
    if (EnglishVoice) {
      utterance.voice = EnglishVoice;
    }
    utterance.onend = () => setSpeechActiveId(null);
    utterance.onerror = () => setSpeechActiveId(null);
    setSpeechActiveId(id);
    window.speechSynthesis.speak(utterance);
  };

  const SpeakButton = ({ text, id }: { text: string; id: string }) => {
    const isSpeaking = speechActiveId === id;
    return (
      <button
        onClick={() => handleSpeak(text, id)}
        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg border transition-all cursor-pointer ${
          isSpeaking
            ? 'bg-tessa-purple border-tessa-purple-dark text-white animate-pulse'
            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-tessa-purple hover:border-tessa-purple/30'
        }`}
        title="Listen"
      >
        <Volume2 size={11} />
        {isSpeaking ? 'Speaking' : 'Listen'}
      </button>
    );
  };

  const activeSlide = lesson.slides[slideIndex];
  const activeQuestion: QuizQuestion | undefined = lesson.quiz[questionIndex];

  const handleNextSlide = () => {
    if (slideIndex < lesson.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      if (lesson.quiz && lesson.quiz.length > 0) {
        setMode('quiz');
      } else {
        handleCompleteLesson(false);
      }
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(optionIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isAnswered || !activeQuestion) return;

    const correct = selectedOptionIndex === activeQuestion.correctAnswerIndex;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      playCorrectSound();
      // Small trigger on correct
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    } else {
      playIncorrectSound();
      // Shake animation trigger
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setIsAnswered(false);

    if (questionIndex < lesson.quiz.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      handleCompleteLesson(true);
    }
  };

  const handleCompleteLesson = (completedQuiz: boolean) => {
    // Save to DB
    const results = tessaDb.saveProgress(lesson.id, completedQuiz);
    setSummaryResults(results);
    setMode('celebration');

    // Mega Confetti Blast!
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Progress calculations
  const totalSteps = lesson.slides.length + (lesson.quiz ? lesson.quiz.length : 0);
  const currentStep = mode === 'slides' 
    ? slideIndex + 1 
    : mode === 'quiz' 
    ? lesson.slides.length + questionIndex + 1
    : totalSteps;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-full overflow-hidden">
      
      {/* Header bar */}
      <div className="px-4 py-4 border-b-2 border-slate-100 flex items-center gap-4 flex-shrink-0">
        <button 
          onClick={() => onClose()}
          className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Progress Tracker */}
        {mode !== 'celebration' && (
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden relative">
              <motion.div 
                className="h-full bg-tessa-green rounded-full border-r-2 border-tessa-green-dark"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-black text-slate-400">
              {currentStep}/{totalSteps}
            </span>
          </div>
        )}
      </div>

      {/* Main player area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12 flex flex-col justify-between max-w-xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {mode === 'slides' && (
            <motion.div
              key={`slide-${slideIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-tessa-blue-light text-tessa-blue border-2 border-tessa-blue-dark/20 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                    Mission Concept
                  </span>
                  <SpeakButton id={`slide-title-${slideIndex}`} text={`${activeSlide.title}. ${activeSlide.content}`} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                  {activeSlide.title}
                </h2>
              </div>

              {activeSlide.illustration && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex items-center justify-center text-4xl shadow-inner min-h-[140px]">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    {activeSlide.illustration}
                  </motion.div>
                </div>
              )}

              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line">
                {activeSlide.content}
              </p>

              {/* Action buttons in slide view */}
              <div className="flex gap-4 pt-4 mt-auto">
                <button
                  onClick={handlePrevSlide}
                  disabled={slideIndex === 0}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 ${
                    slideIndex > 0 ? 'btn-3d-gray' : 'opacity-40 cursor-not-allowed border-2 rounded-2xl py-3.5 bg-slate-50 text-slate-300 font-bold'
                  }`}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={handleNextSlide}
                  className="flex-[2] py-4 flex items-center justify-center gap-2 btn-3d-blue text-lg"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'quiz' && activeQuestion && (
            <motion.div
              key={`quiz-${questionIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-tessa-purple-light text-tessa-purple border-2 border-tessa-purple-dark/20 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                    Quiz Challenge
                  </span>
                  <SpeakButton id={`quiz-q-${questionIndex}`} text={`${activeQuestion.question}. Options are: ${activeQuestion.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`).join('. ')}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Multiple choice options */}
              <motion.div 
                className="space-y-3"
                animate={shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 active:border-slate-400';
                  
                  if (isSelected) {
                    cardStyle = 'border-tessa-blue bg-sky-50 shadow-[0_4px_0_0_rgba(28,176,246,0.3)]';
                  }

                  if (isAnswered) {
                    if (idx === activeQuestion.correctAnswerIndex) {
                      cardStyle = 'border-tessa-green bg-green-50 shadow-[0_4px_0_0_rgba(88,204,2,0.3)] text-tessa-green-dark';
                    } else if (isSelected) {
                      cardStyle = 'border-tessa-rose bg-rose-50 shadow-[0_4px_0_0_rgba(255,75,75,0.3)] text-tessa-rose-dark';
                    } else {
                      cardStyle = 'border-slate-100 bg-slate-50 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-4 border-2 rounded-2xl text-left transition-all font-bold text-slate-700 flex items-center justify-between shadow-[0_3px_0_0_rgba(226,232,240,1)] ${cardStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </span>
                      {isAnswered && idx === activeQuestion.correctAnswerIndex && (
                        <CheckCircle size={20} className="text-tessa-green" />
                      )}
                    </button>
                  );
                })}
              </motion.div>

              {/* Action buttons inside Quiz */}
              {!isAnswered ? (
                <div className="pt-4 mt-auto">
                  <button
                    disabled={selectedOptionIndex === null}
                    onClick={handleCheckAnswer}
                    className={`w-full py-4 text-center ${
                      selectedOptionIndex !== null ? 'btn-3d-green text-lg' : 'btn-3d-gray opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-auto">
                  {/* Feedback card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-3xl border-2 mb-4 flex gap-4 ${
                      isCorrect 
                        ? 'bg-green-50 border-tessa-green/30 text-green-800' 
                        : 'bg-rose-50 border-tessa-rose/30 text-rose-800'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle className="text-tessa-green flex-shrink-0" size={24} />
                      ) : (
                        <AlertTriangle className="text-tessa-rose flex-shrink-0" size={24} />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="font-extrabold text-base flex justify-between items-center gap-2">
                        <span>{isCorrect ? 'Awesome Job! That is Correct!' : 'Almost there! Give it another try next time.'}</span>
                        <SpeakButton id={`quiz-feedback-${questionIndex}`} text={isCorrect ? `Correct! ${activeQuestion.explanation}` : `Almost there! Hint: ${activeQuestion.hint}`} />
                      </div>
                      <p className="text-sm font-semibold opacity-90 leading-relaxed">
                        {isCorrect ? activeQuestion.explanation : `Hint: ${activeQuestion.hint}`}
                      </p>
                    </div>
                  </motion.div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 text-center btn-3d-blue text-lg"
                  >
                    {questionIndex < lesson.quiz.length - 1 ? 'Next Question' : 'Complete Mission!'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {mode === 'celebration' && summaryResults && (
            <motion.div
              key="celebration"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 flex-1 flex flex-col justify-center items-center py-6"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-full bg-tessa-yellow-light border-4 border-tessa-yellow flex items-center justify-center text-4xl animate-bounce mx-auto">
                  🏆
                </div>
                <h2 className="text-3xl font-black text-slate-800 leading-tight">
                  Mission Complete!
                </h2>
                <p className="text-slate-500 font-bold max-w-sm">
                  Congratulations! You conquered: <span className="text-tessa-blue font-extrabold">{lesson.title}</span>
                </p>
              </div>

              {/* Stat card */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs pt-4">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center shadow-[0_3px_0_0_rgba(253,230,138,1)]">
                  <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                    <Star fill="currentColor" size={20} />
                    +{summaryResults.xpEarned}
                  </div>
                  <div className="text-xs font-black text-amber-600 uppercase mt-0.5">XP Earned</div>
                </div>

                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center shadow-[0_3px_0_0_rgba(FECACA,1)]">
                  <div className="text-2xl font-black text-tessa-rose flex items-center justify-center gap-1">
                    🔥 +1
                  </div>
                  <div className="text-xs font-black text-rose-600 uppercase mt-0.5">Streak Day</div>
                </div>
              </div>

              {/* Achievements Unlocked section */}
              {summaryResults.unlockedAchievements.length > 0 && (
                <div className="w-full max-w-sm bg-purple-50 border-2 border-purple-200 rounded-3xl p-5 text-left space-y-3 shadow-[0_3px_0_0_rgba(233,213,255,1)]">
                  <h4 className="text-xs font-black text-purple-600 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert size={14} /> New Badges Unlocked!
                  </h4>
                  <div className="space-y-3.5">
                    {summaryResults.unlockedAchievements.map((ach) => (
                      <div key={ach.id} className="flex gap-3 items-center">
                        <div className="w-11 h-11 bg-white border-2 border-purple-200 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                          {ach.icon}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800 text-sm">{ach.title}</div>
                          <div className="text-slate-500 font-semibold text-xs">{ach.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Level Up Banner */}
              {summaryResults.levelUp && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-tessa-green text-white border-b-4 border-tessa-green-dark rounded-3xl px-6 py-4 font-black text-lg shadow-md animate-pulse"
                >
                  🎉 LEVEL UP! You reached Level {summaryResults.newLevel}! 🎉
                </motion.div>
              )}

              <button
                onClick={() => onClose(summaryResults)}
                className="w-full max-w-xs py-4 text-center btn-3d-green text-lg mt-6"
              >
                Continue Adventure
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
