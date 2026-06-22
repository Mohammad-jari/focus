import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, AlertCircle, HelpCircle, 
  Play, RotateCcw, ArrowRight, ArrowLeft,
  Star, Trophy, ChevronRight, Award, Sparkles, Printer, Info,
  Volume2, Lock, Shield, Zap, CreditCard
} from 'lucide-react';
import { tessaDb } from '@/lib/tessaDb';
import confetti from 'canvas-confetti';
import { playCorrectSound, playIncorrectSound } from '@/lib/soundEffects';

interface TessaSecretCodeMissionProps {
  onClose: (results?: {
    xpEarned: number;
    unlockedAchievements: any[];
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  }) => void;
}

export default function TessaSecretCodeMission({ onClose }: TessaSecretCodeMissionProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  
  // Premium paywall states
  const [showBuyScreen, setShowBuyScreen] = useState(false);
  const [buyPlan, setBuyPlan] = useState<'monthly' | 'annual'>('annual');
  const [activationCode, setActivationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Stop speaking when switching days or closing component
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeDay]);

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
            ? 'bg-cyan-500 border-cyan-600 text-slate-950 animate-pulse'
            : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
        }`}
        title="Listen to this section"
      >
        <Volume2 size={11} />
        {isSpeaking ? 'Speaking' : 'Listen'}
      </button>
    );
  };
  
  // Day 1 states
  const [d1q1Answer, setD1q1Answer] = useState<string | null>(null);
  const [d1q1Feedback, setD1q1Feedback] = useState<string | null>(null);
  const [d1q1ShowHint, setD1q1ShowHint] = useState(false);
  const [d1q2Answer, setD1q2Answer] = useState<string | null>(null);
  const [d1q2Feedback, setD1q2Feedback] = useState<string | null>(null);

  // Day 2 states
  const [shiftKey, setShiftKey] = useState(3);
  const [nameInput, setNameInput] = useState('');
  const [encodedName, setEncodedName] = useState('');
  const [d2q1Answer, setD2q1Answer] = useState<string | null>(null);
  const [d2q1Feedback, setD2q1Feedback] = useState<string | null>(null);

  // Day 3 states
  const [d3q1Answer, setD3q1Answer] = useState<string | null>(null);
  const [d3q1Feedback, setD3q1Feedback] = useState<string | null>(null);
  const [d3q1ShowHint, setD3q1ShowHint] = useState(false);
  const [d3q2Answer, setD3q2Answer] = useState<string | null>(null);
  const [d3q2Feedback, setD3q2Feedback] = useState<string | null>(null);
  const [d3q2ShowHint, setD3q2ShowHint] = useState(false);
  const [d3q3Answer, setD3q3Answer] = useState<string | null>(null);
  const [d3q3Feedback, setD3q3Feedback] = useState<string | null>(null);
  const [d3q3ShowHint, setD3q3ShowHint] = useState(false);
  const [d3q4Answer, setD3q4Answer] = useState<string | null>(null);
  const [d3q4Feedback, setD3q4Feedback] = useState<string | null>(null);

  // Day 4 states
  // Game 1: Code Maker
  const g1Words = [
    { word: 'CAT', shift: 3, ans: 'FDW' },
    { word: 'INDIA', shift: 2, ans: 'KPFKC' },
    { word: 'HAPPY', shift: 4, ans: 'LEWWC' },
    { word: 'SUN', shift: 5, ans: 'XZS' },
  ];
  const [g1Idx, setG1Idx] = useState(0);
  const [g1Input, setG1Input] = useState('');
  const [g1Score, setG1Score] = useState(0);
  const [g1Feedback, setG1Feedback] = useState<string | null>(null);
  const [g1FeedbackType, setG1FeedbackType] = useState<'success' | 'error' | null>(null);

  // Game 2: Code Breaker
  const [g2Score, setG2Score] = useState(0);
  const [g2Answer, setG2Answer] = useState<string | null>(null);
  const [g2Feedback, setG2Feedback] = useState<string | null>(null);

  // Spot the mistake
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
  const [mistakeFeedback, setMistakeFeedback] = useState<string | null>(null);

  // Day 5 states (Report questions)
  const assessQuestions = [
    {
      id: 'a1',
      question: 'Which of these is a correct Caesar Cipher encoding of the word DOG with shift 2?',
      options: ['EPH', 'FQI', 'GRJ', 'BME'],
      correctIdx: 1,
      explanation: 'D+2=F, O+2=Q, G+2=I. So it translates to FQI.',
      hint: 'Shift forward by 2 steps: D -> E -> F.'
    },
    {
      id: 'a2',
      question: 'A Caesar Cipher uses shift 5. Which letter does the letter A encode to?',
      options: ['D', 'F', 'E', 'G'],
      correctIdx: 1,
      explanation: 'A is 1st. 1 + 5 = 6th letter, which is F.',
      hint: 'Count 5 letters forward from A.'
    },
    {
      id: 'a3',
      question: 'Arjun says: "The Caesar Cipher with shift 26 is different from shift 0 — they give different encoded letters." Is Arjun right?',
      options: ['Yes, Arjun is correct', 'No, Arjun is wrong — shift 26 = shift 0'],
      correctIdx: 1,
      explanation: 'A shift of 26 rotates the alphabet completely back to itself. Thus, it does nothing and is identical to shift 0.',
      hint: 'There are 26 letters in the alphabet.'
    },
    {
      id: 'a4',
      question: 'TESSA wrote these algorithm steps to encode the letter Z with shift 2. Which step has the mistake?\nStep 1: Z is the 26th letter.\nStep 2: 26+2=28.\nStep 3: The 28th letter is B.\nStep 4: Z encodes to B.',
      options: ['Step 1 is wrong', 'Step 2 is wrong', 'Step 3 explanation is incomplete (wrapping not mentioned)', 'Step 4 is wrong'],
      correctIdx: 2,
      explanation: 'Step 3 states Z is B because of 28, but fails to note that the alphabet wraps around at 26 (28 - 26 = 2, which is B).',
      hint: 'What happens when you go past the end of the alphabet?'
    },
    {
      id: 'a5',
      question: 'The sequence below uses a Caesar Cipher with shift 3. Each word is the encoded version of a number. What comes next?\nRQH (ONE), WZR (TWO), WKUHH (THREE), ___?___',
      options: ['IRXU', 'ILYH', 'GROS', 'HQSW'],
      correctIdx: 0,
      explanation: 'The next number is FOUR. F+3=I, O+3=R, U+3=X, R+3=U. Thus, IRXU.',
      hint: 'Find the encoded word for FOUR using shift 3.'
    },
    {
      id: 'a6',
      question: 'Priya receives a coded message with a key she doesn\'t know. She knows the first word of the real message is SCHOOL. The coded version of SCHOOL is VFKRRO. What is the shift key?',
      options: ['Shift 2', 'Shift 3', 'Shift 4', 'Shift 5'],
      correctIdx: 1,
      explanation: 'S -> V is 3 steps. C -> F is 3 steps. The key is 3.',
      hint: 'Count the steps between S and V in the alphabet.'
    },
    {
      id: 'a7',
      question: 'Aisha wants to send a secret note to her friend using Caesar Cipher. She writes the real message first and then encodes it with shift 13. Her friend receives the code and wants to decode it. What shift should the friend use to decode?',
      options: ['Shift 13 again', 'Shift 13 backward (or equivalently shift 13 forward)', 'Shift 26', 'Any shift — just try them all'],
      correctIdx: 1,
      explanation: 'To undo a shift of 13 forward, you count 13 backward. Conveniently, in a 26-letter alphabet, 13 backward is the same as 13 forward.',
      hint: 'How do you undo a shift of 13 forward?'
    },
    {
      id: 'a8',
      question: 'Rajan encodes his message twice — first with shift 4, then with shift 7. His friend wants to decode the message. In how many steps, and with what shifts, can the friend decode it?',
      options: ['One step: shift forward 11', 'Two steps: shift 7 backward, then shift 4 backward', 'One step: shift 4 backward only', 'Try all 25 possible keys — there\'s no other way'],
      correctIdx: 1,
      explanation: 'To decode, the friend must undo the operations in reverse order: first shift 7 backward, then shift 4 backward (or shift 11 backward in one step).',
      hint: 'Think about how you peel layers back. You must undo the last thing first.'
    }
  ];

  const [assessAnswers, setAssessAnswers] = useState<Record<string, number>>({});
  const [assessFeedback, setAssessFeedback] = useState<Record<string, { correct: boolean; msg: string }>>({});
  const [submittedReport, setSubmittedReport] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Alphabet utility
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const shiftLetter = (letter: string, shift: number): string => {
    const idx = alphabet.indexOf(letter.toUpperCase());
    if (idx === -1) return letter;
    return alphabet[((idx + shift) % 26 + 26) % 26];
  };

  const encodeString = (str: string, shift: number): string => {
    return str.toUpperCase().split('').map(char => shiftLetter(char, shift)).join('');
  };

  // Run name encoder whenever shift or name changes
  useEffect(() => {
    if (!nameInput.trim()) {
      setEncodedName('— TYPE YOUR NAME ABOVE —');
    } else {
      setEncodedName(encodeString(nameInput, shiftKey));
    }
  }, [nameInput, shiftKey]);

  // Handle Day 1 Answers
  const checkD1q1 = (option: string) => {
    setD1q1Answer(option);
    if (option === 'B') {
      setD1q1Feedback('✅ Correct! The letters look like they follow a rule — each one might be shifted from a real letter.');
      playCorrectSound();
    } else {
      setD1q1Feedback('❌ Try again! Look closer. The letters are grouped into words, which suggests a regular rule is being applied.');
      playIncorrectSound();
    }
  };

  const checkD1q2 = (option: string) => {
    setD1q2Answer(option);
    if (option === 'B') {
      setD1q2Feedback('✅ Perfect! KHOOR shifted back 3 = HELLO, ZRUOG shifted back 3 = WORLD. The message is HELLO WORLD!');
      playCorrectSound();
    } else {
      setD1q2Feedback('❌ Incorrect. Remember to shift each letter in KHOOR ZRUOG backward by exactly 3 steps.');
      playIncorrectSound();
    }
  };

  // Handle Day 2 Answers
  const checkD2q1 = (option: string) => {
    setD2q1Answer(option);
    if (option === 'B') {
      setD2q1Feedback('✅ Excellent! Shift 3 backward: W->T, K->H, H->E = THE. M->J, H->E, Z->W, H->E, O->L = JEWEL. The Jewel is Hidden!');
      playCorrectSound();
    } else {
      setD2q1Feedback('❌ Try again! Shift the letters of WKH MHZHO LV KLGGHQ backward in the alphabet. Use the shift tool above to help.');
      playIncorrectSound();
    }
  };

  // Handle Day 3 Answers
  const checkD3q1 = (option: string) => {
    setD3q1Answer(option);
    if (option === 'B') {
      setD3q1Feedback('✅ Correct! M+4=Q, A+4=E, N+4=R, G+4=K, O+4=S → QERKS!');
      playCorrectSound();
    } else {
      setD3q1Feedback('❌ Incorrect. Let us start with M and go 4 letters forward: M -> N -> O -> P -> Q.');
      playIncorrectSound();
    }
  };

  const checkD3q2 = (option: string) => {
    setD3q2Answer(option);
    if (option === 'A') {
      setD3q2Feedback('✅ Correct! F-3=C, D-3=A, H-3=E, V-3=S, D-3=A, U-3=R → CAESAR! The name of the inventor!');
      playCorrectSound();
    } else {
      setD3q2Feedback('❌ Incorrect. Since it was encoded with a shift of 3, go 3 steps backward from each letter: F -> E -> D -> C.');
      playIncorrectSound();
    }
  };

  const checkD3q3 = (option: string) => {
    setD3q3Answer(option);
    if (option === 'C') {
      setD3q3Feedback('✅ Correct! Shift 11 backward decodes to: THIS MESSAGE IS HIDDEN. E shifted back 11 is T, S shifted back 11 is H, etc.');
      playCorrectSound();
    } else {
      setD3q3Feedback('❌ Incorrect. Try shift 11 backward to see if it decodes "ESTD" to "THIS".');
      playIncorrectSound();
    }
  };

  const checkD3q4 = (option: string) => {
    setD3q4Answer(option);
    if (option === 'B') {
      setD3q4Feedback('✅ Perfect! Only 25 keys exist since shift 26 does not change letters. Spies can crack it quickly, but it is great for learning algorithms!');
      playCorrectSound();
    } else {
      setD3q4Feedback('❌ Incorrect. In an alphabet of 26 letters, what happens if you shift by 26? It returns to the exact same letter!');
      playIncorrectSound();
    }
  };

  // Handle Day 4 Game 1
  const submitG1 = () => {
    const q = g1Words[g1Idx % g1Words.length];
    const correct = encodeString(q.word, q.shift);
    if (g1Input.trim().toUpperCase() === correct) {
      setG1Score(g1Score + 1);
      setG1Feedback(`✅ Correct! ${q.word} shifted by ${q.shift} is ${correct}!`);
      setG1FeedbackType('success');
      playCorrectSound();
      setTimeout(() => {
        setG1Idx(g1Idx + 1);
        setG1Input('');
        setG1Feedback(null);
        setG1FeedbackType(null);
      }, 1500);
    } else {
      setG1Feedback(`❌ Try again! Hint: ${q.word[0]} shifted by ${q.shift} is ${shiftLetter(q.word[0], q.shift)}.`);
      setG1FeedbackType('error');
      playIncorrectSound();
    }
  };

  const skipG1 = () => {
    setG1Idx(g1Idx + 1);
    setG1Input('');
    setG1Feedback(null);
    setG1FeedbackType(null);
  };

  // Handle Day 4 Game 2
  const checkG2 = (option: string) => {
    setG2Answer(option);
    if (option === 'B') {
      setG2Score(g2Score + 1);
      setG2Feedback('✅ Correct! G-3=D, R-3=O, J-3=G, V-3=S → DOGS! Woof!');
      playCorrectSound();
    } else {
      setG2Feedback('❌ Wrong! Count 3 back from G: G -> F -> E -> D. The word starts with D!');
      playIncorrectSound();
    }
  };

  const checkMistake = (stepNum: number) => {
    setMistakeAnswer(stepNum);
    if (stepNum === 2) {
      setMistakeFeedback('✅ Correct! U is the 21st letter. 21 + 2 = 23, which is W, not X! TESSA counted incorrectly.');
      playCorrectSound();
    } else {
      setMistakeFeedback('❌ Incorrect. That step is mathematically sound. Look at step 2 where Z/X letters are shifted.');
      playIncorrectSound();
    }
  };

  // Day 5 Assessment
  const handleSelectAssess = (qId: string, optIdx: number, correctIdx: number, expl: string) => {
    if (assessAnswers[qId] !== undefined) return; // Answered
    const isCorrect = optIdx === correctIdx;
    
    setAssessAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setAssessFeedback(prev => ({
      ...prev,
      [qId]: {
        correct: isCorrect,
        msg: isCorrect ? `✅ Correct! ${expl}` : '❌ Try to remember the Caesar cipher rules for next time!'
      }
    }));
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const submitReport = () => {
    let score = 0;
    assessQuestions.forEach(q => {
      if (assessAnswers[q.id] === q.correctIdx) {
        score++;
      }
    });

    setFinalScore(score);
    setSubmittedReport(true);

    if (score >= 5) {
      // Complete in database!
      tessaDb.completeJourneyItem('tessa_secret_code', 'mission', 100);
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 }
      });
    }
  };

  // Navigation handlers
  const handleNextDay = () => {
    if (!completedDays.includes(activeDay)) {
      setCompletedDays([...completedDays, activeDay]);
    }
    setActiveDay(activeDay + 1);
  };

  // Premium paywall handlers
  const handleVerifyCode = () => {
    setCodeError('');
    setCodeSuccess('');
    const cleanCode = activationCode.trim().toUpperCase();
    if (['TESSA100', 'SCHOOL2026', 'TEACHER50', 'PREMIUM', 'FREEACCESS'].includes(cleanCode)) {
      setCodeSuccess('Your request is accepted. You will be contacted soon.');
      setPaymentSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
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
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 }
      });
      playCorrectSound();
    }, 1500);
  };

  if (showBuyScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col h-full overflow-hidden">
        {/* Buy Screen Header */}
        <header className="px-4 py-4.5 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-white text-lg">T</div>
            <div>
              <h1 className="font-extrabold text-sm md:text-base leading-none">TESSA <span className="text-cyan-400">Focus</span></h1>
              <div className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Premium Access</div>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowBuyScreen(false);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12)_0%,_transparent_60%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-8 pb-16 relative z-10">
            {paymentSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                  ✓
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white">Request Accepted!</h2>
                  <p className="text-slate-300 text-sm max-w-md mx-auto font-semibold">
                    {codeSuccess || "Your request is accepted. You will be contacted soon."}
                  </p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm mx-auto flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 flex-shrink-0 text-xl">💎</div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">Unlock Levels 2 to 10</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">Access sorting algorithms, logic loops, networks, AI bias, and AI Tutor.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowBuyScreen(false);
                    onClose({
                      xpEarned: 100,
                      unlockedAchievements: [],
                      levelUp: false,
                      oldLevel: 1,
                      newLevel: 1
                    });
                  }}
                  className="py-4 px-8 bg-green-500 text-slate-950 font-black rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                  Return to Dashboard <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Header title */}
                <div className="text-center space-y-2">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full inline-block">
                    Level 1 Complete!
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                    Unlock TESSA Focus Unlimited 🚀
                  </h2>
                  <p className="text-slate-400 text-xs font-bold max-w-md mx-auto leading-relaxed">
                    You've successfully cracked TESSA's Secret Code. Continue the adventure to master computational thinking and lead the AI future.
                  </p>
                </div>

                {/* Features block */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
                  <h3 className="font-black text-sm text-slate-200">What's included in Tessa Focus Unlimited:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: '🎓', title: 'Levels 2 to 10 Unlocked', desc: 'Sorting, logic loops, networks, AI bias, and capstone proposal.' },
                      { icon: '🤖', title: 'TESSA AI Tutor Chat', desc: '24/7 personalized chat guidance to solve CBSE assignments and learn.' },
                      { icon: '🏆', title: 'Verified CBSE Certificates', desc: 'Download official progress certifications on every level graduation.' },
                      { icon: '📊', title: 'Parent Analytics Dashboard', desc: 'Track speed, logic accuracy scores, and daily streak logs.' },
                      { icon: '🧩', title: '100+ Interactive Worksheets', desc: 'Printable CT puzzles, network mapping sheets, and offline exercises.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="text-xl flex-shrink-0 mt-0.5">{item.icon}</div>
                        <div>
                          <h4 className="font-extrabold text-white text-xs leading-none">{item.title}</h4>
                          <p className="text-[10.5px] text-slate-400 mt-1 font-semibold leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing / Checkout split columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Plans */}
                  <div className="space-y-4">
                    <h3 className="font-black text-sm text-slate-300">Choose your membership:</h3>
                    
                    {/* Monthly plan */}
                    <div 
                      onClick={() => setBuyPlan('monthly')}
                      className={`p-4 border rounded-3xl cursor-pointer transition-all flex justify-between items-center ${
                        buyPlan === 'monthly'
                          ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10'
                          : 'border-slate-805 bg-slate-905/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${buyPlan === 'monthly' ? 'border-indigo-500' : 'border-slate-600'}`}>
                            {buyPlan === 'monthly' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                          </span>
                          Explorer Monthly
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold pl-5">Cancel anytime, simple billing.</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-white">₹499 <span className="text-[10px] text-slate-500 font-extrabold">/mo</span></div>
                        <div className="text-[9px] text-slate-500 font-bold">$5.99 USD</div>
                      </div>
                    </div>

                    {/* Annual plan */}
                    <div 
                      onClick={() => setBuyPlan('annual')}
                      className={`p-4 border rounded-3xl cursor-pointer transition-all flex justify-between items-center relative ${
                        buyPlan === 'annual'
                          ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10'
                          : 'border-slate-805 bg-slate-905/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Best Value (Save 33%)
                      </div>
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${buyPlan === 'annual' ? 'border-indigo-500' : 'border-slate-600'}`}>
                            {buyPlan === 'annual' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                          </span>
                          Elite Architect (Annual)
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold pl-5">Expert review + Legend badge.</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-white">₹3,999 <span className="text-[10px] text-slate-500 font-extrabold">/yr</span></div>
                        <div className="text-[9px] text-slate-500 font-bold">$47.99 USD</div>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 bg-indigo-500 text-white font-black rounded-2xl text-xs hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Processing Secure Payment...
                        </>
                      ) : (
                        <>
                          Pay & Unlock Unlimited <CreditCard size={14} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Column: Promo Code activation */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 self-start shadow-md">
                    <h3 className="font-black text-sm text-slate-300 flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-400" /> Have a School License Code?
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      If your school is enrolled or your teacher provided a registration voucher key, enter it below to activate premium instantly.
                    </p>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={activationCode}
                        onChange={(e) => {
                          setActivationCode(e.target.value.toUpperCase());
                          setCodeError('');
                        }}
                        placeholder="ENTER ACTIVATION CODE"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs font-black font-mono tracking-widest outline-none text-white uppercase"
                      />
                      {codeError && <p className="text-[10px] text-rose-400 font-bold">{codeError}</p>}
                    </div>

                    <button
                      onClick={handleVerifyCode}
                      disabled={!activationCode.trim()}
                      className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-extrabold rounded-xl text-xs transition-colors border border-slate-800 cursor-pointer disabled:opacity-30"
                    >
                      Verify & Activate Code
                    </button>

                    <div className="text-[9px] text-slate-500 leading-snug font-semibold text-center border-t border-slate-800 pt-3">
                      Try demo keys: <code className="text-indigo-400 bg-slate-950 px-1 py-0.5 rounded">SCHOOL2026</code> or <code className="text-indigo-400 bg-slate-950 px-1 py-0.5 rounded">TESSA100</code>
                    </div>
                  </div>
                </div>

                {/* Cancel option */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setShowBuyScreen(false);
                      onClose();
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-400 font-black uppercase tracking-wider underline cursor-pointer"
                  >
                    Maybe Later (Return to Dashboard)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col h-full overflow-hidden">
      
      {/* Site Header */}
      <header className="px-4 py-4.5 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-white text-lg">T</div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base leading-none">TESSA <span className="text-cyan-400">Focus</span></h1>
            <div className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Level 1 - Curious Spark · Mission 1</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (submittedReport && finalScore >= 5) {
                onClose({
                  xpEarned: 100,
                  unlockedAchievements: [],
                  levelUp: false,
                  oldLevel: 1,
                  newLevel: 1
                });
              } else {
                onClose();
              }
            }}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Chapter Title Banner */}
      <div className="bg-gradient-to-r from-slate-950 to-indigo-950 px-4 py-4 md:py-5 flex-shrink-0 border-b border-slate-900">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Mission Page
            </span>
            <h2 className="text-lg md:text-2xl font-black mt-1">TESSA's Secret Code</h2>
            <p className="text-xs text-slate-400 mt-0.5">Learn to think in steps — like a real code-breaker!</p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {['🕵️ Mystery', '🔑 Rules', '25 Min'].map((tag, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Day Progress Navigation */}
      <nav className="bg-slate-950 border-b border-slate-800 flex gap-1 p-2 overflow-x-auto flex-shrink-0 select-none">
        {[
          { day: 1, label: 'Mystery', icon: '🔍' },
          { day: 2, label: 'Discovery', icon: '💡' },
          { day: 3, label: 'Challenge', icon: '⚔️' },
          { day: 4, label: 'Game', icon: '🎮' },
          { day: 5, label: 'Proof', icon: '🏆' },
        ].map((item) => {
          const isActive = activeDay === item.day;
          const isDone = completedDays.includes(item.day) || (submittedReport && item.day === 5);
          const isUnlocked = item.day === 1 || completedDays.includes(item.day - 1);
          return (
            <button
              key={item.day}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && setActiveDay(item.day)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950'
                  : isUnlocked
                    ? 'bg-slate-900 text-slate-400 hover:text-white cursor-pointer'
                    : 'bg-slate-950 text-slate-650 opacity-40 cursor-not-allowed border border-slate-900/50'
              }`}
            >
              <span>{isUnlocked ? item.icon : '🔒'}</span>
              <span>Day {item.day} — {item.label}</span>
              {isDone && <Check size={10} className={isActive ? 'text-slate-950' : 'text-green-500'} />}
            </button>
          );
        })}
      </nav>

      {/* Dynamic Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/60 starfield-bg relative">
        <div className="max-w-2xl mx-auto space-y-6 pb-24">
          
          <AnimatePresence mode="wait">
            
            {/* DAY 1 Mystery */}
            {activeDay === 1 && (
              <motion.div
                key="day1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2 text-cyan-400">
                    <span>🔍</span> Day 1 — Mystery
                  </h3>
                  <span className="text-xs font-bold text-slate-500">25 min limit</span>
                </div>

                {/* TESSA speech bubble */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span>TESSA says:</span>
                      <SpeakButton id="d1-tessa-says" text="Hi! I'm TESSA — your Thinking Buddy! I have a big problem and I need your help. This morning I received a very strange message. It looks like total nonsense — but I think it's a secret message in disguise! Can you help me figure out what it says? Let's think about this together!" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                      Hi! I'm TESSA — your Thinking Buddy! I have a <em className="text-cyan-400 not-italic">big problem</em> and I need your help.<br/><br/>
                      This morning I received a very strange message. It looks like total nonsense — but I think it's a <em className="text-cyan-400 not-italic">secret message</em> in disguise! Can you help me figure out what it says?
                    </p>
                    <div className="text-xs font-black text-cyan-400 font-cursive italic mt-2">"Let's think about this together! 🔍"</div>
                  </div>
                </div>

                {/* Secret Message Widget */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">📨</span>
                      <h4 className="font-extrabold text-sm text-slate-200">TESSA's Strange Message</h4>
                    </div>
                    <SpeakButton id="d1-strange-msg" text="TESSA's Strange Message: K H O O R   Z R U O G. What could this mean? It uses English letters... but it's not an English word!" />
                  </div>
                  <div className="p-6 text-center space-y-4">
                    <div className="bg-indigo-950/50 border-2 border-cyan-500/30 text-cyan-300 rounded-2xl py-5 px-6 font-black text-3xl tracking-widest shadow-inner inline-block min-w-[240px]">
                      KHOOR ZRUOG
                    </div>
                    <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                      What could this mean? It uses English letters... but it's not an English word!
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3 mt-4">
                      <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between gap-2">
                        <span>🔎 Your Turn — What do you notice?</span>
                        <SpeakButton id="d1-your-turn" text="Look at the message. Which of these is true? Pick the best answer: A, The letters are totally random — it's just nonsense. B, The letters seem to follow some kind of rule or pattern. C, It must be a number code — letters replaced by numbers. D, Only a computer can figure this out." />
                      </div>
                      <p className="text-xs font-bold text-slate-300">Look at the message. Which of these is true? Pick the best answer:</p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: 'A', text: "The letters are totally random — it's just nonsense" },
                          { key: 'B', text: "The letters seem to follow some kind of rule or pattern" },
                          { key: 'C', text: "It must be a number code — letters replaced by numbers" },
                          { key: 'D', text: "Only a computer can figure this out" }
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => checkD1q1(opt.key)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              d1q1Answer === opt.key
                                ? opt.key === 'B'
                                  ? 'bg-green-500/10 border-green-500 text-green-400'
                                  : 'bg-red-500/10 border-red-500 text-red-400'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {d1q1Feedback && (
                        <div className={`p-3 rounded-xl text-xs font-bold ${d1q1Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {d1q1Feedback}
                        </div>
                      )}

                      {/* Hint section */}
                      <div className="border border-slate-800 rounded-xl overflow-hidden mt-2">
                        <button 
                          onClick={() => setD1q1ShowHint(!d1q1ShowHint)}
                          className="w-full bg-slate-950 px-3 py-2 text-[10px] font-black text-amber-500 flex items-center justify-between"
                        >
                          <span>💡 Need a hint?</span>
                          <ChevronRight size={12} className={`transition-transform ${d1q1ShowHint ? 'rotate-90' : ''}`} />
                        </button>
                        {d1q1ShowHint && (
                          <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                            Count the letters in "KHOOR". How many letters does "HELLO" have? Could one word be a shifted version of the other?
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Manual Shifting Practice */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">🔬</span>
                      <h4 className="font-extrabold text-sm text-slate-200">Explore — Try Shifting Letters</h4>
                    </div>
                    <SpeakButton id="d1-explore-shifting" text="Explore — Try Shifting Letters. What if each letter in the message has been moved forward in the alphabet by a few steps? Let's try it! The alphabet is printed below — count forward from each letter in the message." />
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      What if each letter in the message has been <strong>moved forward</strong> in the alphabet by a few steps? Let's try it! The alphabet is printed below — count forward from each letter in the message.
                    </p>

                    <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl text-center">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">The Alphabet — your decoding tool</div>
                      <div className="font-black text-base text-cyan-400 tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none py-1">
                        A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                      <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                        <span>🔎 Try counting 3 steps back from K</span>
                        <SpeakButton id="d1-shifting-practice" text="Try counting 3 steps back from K. K, one step back, J. One more, I. One more, H. So if K is shifted 3 forward from H, then the message starts with H! What do you think the full message says if every letter is shifted back 3? Option A, GHOOR YQUOG. Option B, HELLO WORLD. Option C, JILOO XQTOE. Option D, LIPPS ASVPH." />
                      </div>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                        K → one step back → J → one more → I → one more → <strong>H</strong><br/>
                        So if K is shifted 3 forward from H, then the message starts with H!<br/><br/>
                        What do you think the full message says if every letter is shifted back 3?
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: 'A', text: "GHOOR YQUOG (shifted back 4)" },
                          { key: 'B', text: "HELLO WORLD (shifted back 3)" },
                          { key: 'C', text: "JILOO XQTOE (shifted back 2)" },
                          { key: 'D', text: "LIPPS ASVPH (shifted forward 3)" }
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => checkD1q2(opt.key)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              d1q2Answer === opt.key
                                ? opt.key === 'B'
                                  ? 'bg-green-500/10 border-green-500 text-green-400'
                                  : 'bg-red-500/10 border-red-500 text-red-400'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {d1q2Feedback && (
                        <div className={`p-3 rounded-xl text-xs font-bold ${d1q2Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {d1q2Feedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day 1 Finish Call to Action */}
                {d1q1Answer === 'B' && d1q2Answer === 'B' && (
                  <div className="bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border-2 border-cyan-500/40 rounded-3xl p-6 text-center space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-black text-base text-white">🎉 Day 1 Complete! You cracked the message!</h4>
                      <SpeakButton id="d1-complete-cta" text="Day 1 Complete! You cracked the message! But wait — TESSA just received another secret message. This one uses a completely different shift key. Think about this code: WKH MHZHO LV KLGGHQ. What shift key was used? We will discover the algorithm tomorrow!" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      But wait — TESSA just received <em>another</em> secret message. This one uses a completely different shift key. Think about this code:
                    </p>
                    <div className="bg-slate-950 border border-slate-800 text-amber-400 rounded-2xl py-3 px-6 font-black text-xl tracking-widest inline-block select-all">
                      WKH MHZHO LV KLGGHQ
                    </div>
                    <p className="text-xs text-slate-400">What shift key was used? We will discover the algorithm tomorrow!</p>
                    <div className="pt-2">
                      <button
                        onClick={handleNextDay}
                        className="py-3 px-6 bg-cyan-500 text-slate-950 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        Continue to Day 2 <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* DAY 2 Discovery */}
            {activeDay === 2 && (
              <motion.div
                key="day2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2 text-cyan-400">
                    <span>💡</span> Day 2 — Discovery
                  </h3>
                  <span className="text-xs font-bold text-slate-500 font-black">25 min limit</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span>TESSA says:</span>
                      <SpeakButton id="d2-tessa-says" text="Yesterday you discovered something amazing — the secret message used a rule! Every letter was shifted the same number of steps forward in the alphabet. Today I'll show you what that kind of thinking is called — and show you the tool spies and computer scientists use. It's called an Algorithm!" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                      Yesterday you discovered something amazing — the secret message used a <em className="text-cyan-400 not-italic">rule</em>! Every letter was shifted the same number of steps forward in the alphabet.<br/><br/>
                      Today I'll show you what that kind of thinking is called — and show you the tool spies and computer scientists use. It's called an <em className="text-cyan-400 not-italic">Algorithm</em>!
                    </p>
                  </div>
                </div>

                {/* Big Idea box */}
                <div className="bg-gradient-to-r from-blue-950/40 to-slate-950/40 border border-blue-500/20 rounded-3xl p-5">
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Award size={12} />
                      <span>The Big Idea</span>
                    </div>
                    <SpeakButton id="d2-big-idea" text="The Big Idea: What is an Algorithm? An Algorithm is a set of clear, step-by-step instructions that always produces the same result when followed. The Caesar Cipher is a perfect algorithm! Its steps are: 1, Choose a shift number, the key. 2, For each letter in the message, move it forward that many steps in the alphabet. 3, Write down the new letter. 4, Repeat for every letter. Julius Caesar — a Roman leader who lived 2,000 years ago — used this exact algorithm. Today, we use complex algorithms to protect bank accounts and game profiles!" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">What is an Algorithm?</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-semibold">
                    An <strong>Algorithm</strong> is a set of <strong>clear, step-by-step instructions</strong> that always produces the same result when followed.<br/><br/>
                    The Caesar Cipher is a perfect algorithm! Its steps are:<br/>
                    1. Choose a shift number (the <strong>key</strong>)<br/>
                    2. For each letter in the message, move it forward that many steps in the alphabet<br/>
                    3. Write down the new letter<br/>
                    4. Repeat for every letter
                  </p>
                  <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-semibold">
                    Julius Caesar — a Roman leader who lived 2,000 years ago — used this exact algorithm. Today, we use complex algorithms to protect bank accounts and game profiles!
                  </p>
                </div>

                {/* Interactive Cipher Shifter */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                      <span>⚙️</span> The Caesar Cipher Wheel
                    </h4>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d2-cipher-wheel" text="The Caesar Cipher Wheel. Change the shift key and watch the alphabet transform below! This is the algorithm in action." />
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Shift Key:</span>
                        <span className="text-xs font-black text-cyan-400">{shiftKey}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-5 text-center">
                    <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                      Change the shift key and watch the alphabet transform below! This is the algorithm in action.
                    </p>

                    {/* Shifter button control */}
                    <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-full p-1.5 gap-3">
                      <button
                        onClick={() => setShiftKey(Math.max(-25, shiftKey - 1))}
                        disabled={shiftKey <= -25}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-black hover:bg-slate-800 active:scale-95 disabled:opacity-20 cursor-pointer text-cyan-400"
                      >
                        -
                      </button>
                      <span className="font-black text-xl text-white min-w-[32px]">{shiftKey}</span>
                      <button
                        onClick={() => setShiftKey(Math.min(25, shiftKey + 1))}
                        disabled={shiftKey >= 25}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-black hover:bg-slate-800 active:scale-95 disabled:opacity-20 cursor-pointer text-cyan-400"
                      >
                        +
                      </button>
                    </div>

                    {/* Cipher Table display */}
                    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 text-left text-xs font-black font-mono">
                      <div className="px-4 py-2 border-b border-slate-900 flex items-center justify-between gap-4">
                        <span className="text-slate-500 uppercase text-[9px] flex-shrink-0">Original:</span>
                        <div className="overflow-x-auto whitespace-nowrap scrollbar-none tracking-widest text-slate-300 pr-1">
                          {alphabet.split('').join(' ')}
                        </div>
                      </div>
                      <div className="px-4 py-2 flex items-center justify-between gap-4 bg-indigo-950/20">
                        <span className="text-cyan-500 uppercase text-[9px] flex-shrink-0">Encoded:</span>
                        <div className="overflow-x-auto whitespace-nowrap scrollbar-none tracking-widest text-cyan-400 pr-1">
                          {encodeString(alphabet, shiftKey).split('').join(' ')}
                        </div>
                      </div>
                    </div>

                    {/* Live Name Encoder Widget */}
                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-left space-y-3">
                      <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                        <span>✏️ Encode Your Name!</span>
                        <SpeakButton id="d2-name-encoder" text="Encode Your Name! Type your name below. TESSA will encode it live using the current shift key." />
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">
                        Type your name below. TESSA will encode it live using the current shift key.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                          placeholder="ENTER NAME"
                          maxLength={20}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-black font-mono tracking-widest focus:border-cyan-500 outline-none text-white uppercase"
                        />
                        <div className="bg-indigo-950/30 border border-cyan-500/20 rounded-xl p-3 text-cyan-300 font-black font-mono tracking-widest text-sm flex items-center justify-center min-h-[46px] select-all">
                          {encodedName}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yesterday's cliffhanger decryption task */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">🔓</span>
                      <h4 className="font-extrabold text-sm text-slate-200">Yesterday's Mystery message</h4>
                    </div>
                    <SpeakButton id="d2-mystery-mcq" text="Yesterday's Mystery message. Remember from Day 1: W K H   M H Z H O   L V   K L G G H Q. Use the cipher tool above. Try different shift keys going backward until the message makes sense, then answer below: Option A, The candy is hidden. Option B, The jewel is hidden. Option C, The jewels are hidden. Option D, She keeps it secret." />
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Remember from Day 1: <strong className="text-cyan-400 select-all font-mono tracking-widest">WKH MHZHO LV KLGGHQ</strong><br/><br/>
                      Use the cipher tool above. Try different shift keys (going backward) until the message makes sense, then answer below:
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: "THE CANDY IS HIDDEN (shift 2 backward)" },
                        { key: 'B', text: "THE JEWEL IS HIDDEN (shift 3 backward)" },
                        { key: 'C', text: "THE JEWELS ARE HIDDEN (shift 4 backward)" },
                        { key: 'D', text: "SHE KEEPS IT SECRET (shift 3 backward)" }
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => checkD2q1(opt.key)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            d2q1Answer === opt.key
                              ? opt.key === 'B'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                  : 'bg-red-500/10 border-red-500 text-red-400'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>

                    {d2q1Feedback && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${d2q1Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {d2q1Feedback}
                      </div>
                    )}
                  </div>
                </div>

                {/* Day 2 Notebook summary */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between gap-2 mb-1">
                    <span>📓 TESSA's Notebook — Today's Big Ideas</span>
                    <SpeakButton id="d2-notebook" text="TESSA's Notebook — Today's Big Ideas. One: An algorithm is a step-by-step set of instructions that always works. Two: The Caesar Cipher shifts letters by a fixed number called the key. Three: Without the key, you cannot read the message — making it secure! Four: A good algorithm leaves no room for confusion." />
                  </div>
                  <ul className="text-xs text-slate-300 leading-relaxed list-disc list-inside space-y-1.5 font-semibold">
                    <li>An <strong>algorithm</strong> is a step-by-step set of instructions that always works.</li>
                    <li>The <strong>Caesar Cipher</strong> shifts letters by a fixed number called the <strong>key</strong>.</li>
                    <li>Without the key, you cannot read the message — making it secure!</li>
                    <li>A good algorithm leaves <strong>no room for confusion</strong>.</li>
                  </ul>
                </div>

                {d2q1Answer === 'B' && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleNextDay}
                      className="py-3 px-6 bg-cyan-500 text-slate-950 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      On to the Challenge! <ArrowRight size={14} />
                    </button>
                  </div>
                )}

              </motion.div>
            )}

            {/* DAY 3 Challenge */}
            {activeDay === 3 && (
              <motion.div
                key="day3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2 text-cyan-400">
                    <span>⚔️</span> Day 3 — Challenge Tasks
                  </h3>
                  <span className="text-xs font-bold text-slate-500">25 min limit</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span>TESSA says:</span>
                      <SpeakButton id="d3-tessa-says" text="You know the algorithm. Now let's push it! Today has three Mission Tasks — each one a bit harder than the last. If you get stuck, I've hidden hints for you. But try on your own first — that's where the real thinking happens!" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                      You know the algorithm. Now let's push it! Today has three Mission Tasks — each one a bit harder than the last.<br/><br/>
                      If you get stuck, I've hidden hints for you. But try on your own first — <em>that's where the real thinking happens!</em> 🧠
                    </p>
                  </div>
                </div>

                {/* TASK 1 */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                      <span className="text-green-400">⭐</span> Mission Task 1 — Follow the Algorithm
                    </h4>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d3-task1" text="Mission Task 1. Priya wants to send a secret message to her friend. She uses the Caesar Cipher with a shift of 4. She wants to encode the word MANGO. What is the encoded word? Option A: P D Q J R, shifted 3. Option B: Q E R K S, shifted 4. Option C: R F S L G, shifted 5. Option D: I W J C K, shifted 4 backward." />
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded">Easy</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Priya wants to send a secret message to her friend. She uses the Caesar Cipher with a shift of <strong>4</strong>. She wants to encode the word <strong>MANGO</strong>. What is the encoded word?
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { key: 'A', text: "PDQJR (shift 3)" },
                        { key: 'B', text: "QERKS (shift 4)" },
                        { key: 'C', text: "RFSLG (shift 5)" },
                        { key: 'D', text: "IWJCK (shift 4 backward)" }
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => checkD3q1(opt.key)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            d3q1Answer === opt.key
                              ? opt.key === 'B'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>

                    {d3q1Feedback && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${d3q1Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {d3q1Feedback}
                      </div>
                    )}

                    <div className="border border-slate-800 rounded-xl overflow-hidden mt-2">
                      <button 
                        onClick={() => setD3q1ShowHint(!d3q1ShowHint)}
                        className="w-full bg-slate-950 px-3 py-2 text-[10px] font-black text-amber-500 flex items-center justify-between"
                      >
                        <span>💡 Need a hint?</span>
                        <ChevronRight size={12} className={`transition-transform ${d3q1ShowHint ? 'rotate-90' : ''}`} />
                      </button>
                      {d3q1ShowHint && (
                        <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                          M is the 13th letter. Shift 4 forward: 13 + 4 = 17. What is the 17th letter? Count: A=1, B=2... or just set the Day 2 cipher tool shift key to 4!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                      <span className="text-orange-400">⭐⭐</span> Mission Task 2 — Reverse the Algorithm
                    </h4>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d3-task2" text="Mission Task 2. Rajan received a coded message: F D H V D U. He knows it was encoded with a shift of 3. What is the original word? Option A, CAESAR. Option B, BEAUTY. Option C, CIPHER. Option D, DECODE." />
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded">Medium</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Rajan received a coded message: <strong className="text-cyan-400 font-mono tracking-widest">FDHVDU</strong>. He knows it was encoded with a shift of <strong>3</strong>. What is the original word?
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { key: 'A', text: "CAESAR" },
                        { key: 'B', text: "BEAUTY" },
                        { key: 'C', text: "CIPHER" },
                        { key: 'D', text: "DECODE" }
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => checkD3q2(opt.key)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            d3q2Answer === opt.key
                              ? opt.key === 'A'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>

                    {d3q2Feedback && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${d3q2Answer === 'A' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {d3q2Feedback}
                      </div>
                    )}

                    <div className="border border-slate-800 rounded-xl overflow-hidden mt-2">
                      <button 
                        onClick={() => setD3q2ShowHint(!d3q2ShowHint)}
                        className="w-full bg-slate-950 px-3 py-2 text-[10px] font-black text-amber-500 flex items-center justify-between"
                      >
                        <span>💡 Need a hint?</span>
                        <ChevronRight size={12} className={`transition-transform ${d3q2ShowHint ? 'rotate-90' : ''}`} />
                      </button>
                      {d3q2ShowHint && (
                        <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                          To decode, count 3 steps backward in the alphabet. F → E → D → C. So F decodes to C. Now do the same for D, H, V, D, U.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                      <span className="text-purple-400">⭐⭐⭐</span> Mission Task 3 — Find the Key
                    </h4>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d3-task3" text="Mission Task 3. Meena received this coded message: E S T D   X P D D L R P   T D   S T O O P Y. She does NOT know the shift number. She has to figure out the key herself! She knows the real message starts with the word THIS. Option A, Shift 5 forward — message is ZHIS. Option B, Shift 11 backward — lands on U. Option C, Shift 11 backward — message is THIS MESSAGE IS HIDDEN. Option D, Shift 17 backward." />
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded">Hard</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Meena received this coded message: <strong className="text-cyan-400 font-mono tracking-widest">ESTD XPDDLRP TD STOOPY</strong><br/>
                      She does NOT know the shift number. She has to figure out the key herself! She knows the real message starts with the word <strong>THIS</strong>.
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: "Shift 5 forward — message is ZHIS..." },
                        { key: 'B', text: "Shift 11 backward — lands on U" },
                        { key: 'C', text: "Shift 11 backward — message is THIS MESSAGE IS HIDDEN" },
                        { key: 'D', text: "Shift 17 backward" }
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => checkD3q3(opt.key)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            d3q3Answer === opt.key
                              ? opt.key === 'C'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>

                    {d3q3Feedback && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${d3q3Answer === 'C' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {d3q3Feedback}
                      </div>
                    )}

                    <div className="border border-slate-800 rounded-xl overflow-hidden mt-2">
                      <button 
                        onClick={() => setD3q3ShowHint(!d3q3ShowHint)}
                        className="w-full bg-slate-950 px-3 py-2 text-[10px] font-black text-amber-500 flex items-center justify-between"
                      >
                        <span>💡 Need a hint?</span>
                        <ChevronRight size={12} className={`transition-transform ${d3q3ShowHint ? 'rotate-90' : ''}`} />
                      </button>
                      {d3q3ShowHint && (
                        <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                          We know E decodes to T. Count backward from E to T. Remember: after A, you wrap around to Z. E → D (1) → C (2) → B (3) → A (4) → Z (5) → Y (6)...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BONUS task */}
                <div className="bg-slate-950/40 border border-purple-500/20 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950/60 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                      <span className="text-purple-400">🌟</span> Bonus Challenge — Optional!
                    </h4>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d3-bonus" text="Bonus Challenge. Optional. How many different keys can a Caesar Cipher have? Why can it never be perfectly unbreakable? Option A, 26 different keys — very hard to crack. Option B, Only 25 meaningful keys — easy to crack by trying all! Option C, 100 different keys. Option D, Infinite keys." />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">Analytical</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      How many different keys can a Caesar Cipher have? Why can it never be perfectly unbreakable?
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: "26 different keys — very hard to crack" },
                        { key: 'B', text: "Only 25 meaningful keys — easy to crack by trying all!" },
                        { key: 'C', text: "100 different keys — nearly impossible" },
                        { key: 'D', text: "Infinite keys — can never be cracked" }
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => checkD3q4(opt.key)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            d3q4Answer === opt.key
                              ? opt.key === 'B'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>

                    {d3q4Feedback && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${d3q4Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {d3q4Feedback}
                      </div>
                    )}
                  </div>
                </div>

                {d3q1Answer === 'B' && d3q2Answer === 'A' && d3q3Answer === 'C' && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleNextDay}
                      className="py-3 px-6 bg-cyan-500 text-slate-950 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      Time for the Games! <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* DAY 4 Games */}
            {activeDay === 4 && (
              <motion.div
                key="day4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2 text-cyan-400">
                    <span>🎮</span> Day 4 — Game Time
                  </h3>
                  <span className="text-xs font-bold text-slate-500">25 min limit</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span>TESSA says:</span>
                      <SpeakButton id="d4-tessa-says" text="No new concepts today — just play! First, try being a Code-Maker. Then, be a Code-Breaker. And finally, see if you can spot my mistake! 😄" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                      No new concepts today — just play! First, try being a Code-Maker. Then, be a Code-Breaker. And finally, see if you can spot my mistake! 😄
                    </p>
                  </div>
                </div>

                {/* GAME 1: Code Maker */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-extrabold text-sm text-slate-200">🔐 Game 1 — Code Maker</span>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d4-game1" text={`Game 1. Code Maker. Encode the word: ${g1Words[g1Idx % g1Words.length]?.word || 'CAT'}. Shift key is: ${g1Words[g1Idx % g1Words.length]?.shift || 3}. Enter your answer below.`} />
                      <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-2 py-0.5 rounded">Score: {g1Score}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold">
                      TESSA will show a word. Encode it using the shift key shown. Enter your answer:
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="bg-indigo-950/50 border border-cyan-500/20 text-cyan-300 rounded-xl px-4 py-2 text-xl font-black font-mono tracking-widest flex-1 text-center">
                          {g1Words[g1Idx % g1Words.length].word}
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-black font-mono text-center">
                          Shift: <span className="text-amber-400">{g1Words[g1Idx % g1Words.length].shift}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={g1Input}
                          onChange={(e) => setG1Input(e.target.value.toUpperCase())}
                          placeholder="TYPE ENCODED WORD"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-black font-mono tracking-widest focus:border-cyan-500 outline-none text-white uppercase"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={submitG1}
                          disabled={!g1Input.trim()}
                          className="py-2.5 px-4 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs hover:scale-102 active:scale-98 transition-all flex-1 cursor-pointer disabled:opacity-30"
                        >
                          Submit Answer
                        </button>
                        <button
                          onClick={skipG1}
                          className="py-2.5 px-3 bg-slate-950 border border-slate-850 hover:bg-slate-800 font-bold rounded-xl text-xs text-slate-400 transition-all cursor-pointer"
                        >
                          Skip
                        </button>
                      </div>

                      {g1Feedback && (
                        <div className={`p-3 rounded-xl text-xs font-black ${g1FeedbackType === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {g1Feedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* GAME 2: Code Breaker */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-extrabold text-sm text-slate-200">🔓 Game 2 — Code Breaker</span>
                    <div className="flex items-center gap-2">
                      <SpeakButton id="d4-game2" text="Game 2. Code Breaker. A coded message appears: G R J V. The shift key is 3 backward. Pick the correct decoded word: Option A, GROT. Option B, DOGS. Option C, CATS. Option D, FROG." />
                      <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-2 py-0.5 rounded">Score: {g2Score}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold">
                      A coded message appears. The shift key is 3 backward. Pick the correct decoded word:
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                      <div className="bg-indigo-950/50 border border-cyan-500/20 text-cyan-300 rounded-xl py-3 px-6 text-xl font-black font-mono tracking-widest text-center select-none">
                        GRJV (shift 3 backward)
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          { key: 'A', text: "GROT" },
                          { key: 'B', text: "DOGS" },
                          { key: 'C', text: "CATS" },
                          { key: 'D', text: "FROG" }
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => checkG2(opt.key)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              g2Answer === opt.key
                                ? opt.key === 'B'
                                  ? 'bg-green-500/10 border-green-500 text-green-400'
                                  : 'bg-red-500/10 border-red-500 text-red-400'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="inline-block bg-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">{opt.key}</span>
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {g2Feedback && (
                        <div className={`p-3 rounded-xl text-xs font-black ${g2Answer === 'B' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {g2Feedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Spot TESSA's mistake */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <span className="text-orange-400 mr-2">🐛</span>
                      <h4 className="font-extrabold text-sm text-slate-200">Spot TESSA's Mistake!</h4>
                    </div>
                    <SpeakButton id="d4-mistake" text="Spot TESSA's Mistake! TESSA tried to encode the word SUN using shift 2. TESSA wrote out the steps below — but made one mistake. Select which step is wrong: Step 1, S is the 19th letter, add 2 is 21, which is U. Step 2, U is the 21st letter, add 2 is 24, which is X. Step 3, N is the 14th letter, add 2 is 16, which is P. Step 4, So the encoded word is U X P." />
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      TESSA tried to encode the word <strong>SUN</strong> using shift <strong>2</strong>. TESSA wrote out the steps below — but made <strong>one mistake</strong>. Select which step is wrong:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { step: 1, text: "Step 1: S is the 19th letter. Add 2: 19+2=21. The 21st letter is U. So S encodes to U. ✓" },
                        { step: 2, text: "Step 2: U is the 21st letter. Add 2: 21+2=24. The 24th letter is X. So U encodes to X. ✗" },
                        { step: 3, text: "Step 3: N is the 14th letter. Add 2: 14+2=16. The 16th letter is P. So N encodes to P. ✓" },
                        { step: 4, text: "Step 4: So the encoded word is U-X-P → UXP." }
                      ].map((item) => (
                        <button
                          key={item.step}
                          onClick={() => checkMistake(item.step)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            mistakeAnswer === item.step
                              ? item.step === 2
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>

                    {mistakeFeedback && (
                      <div className={`p-3 rounded-xl text-xs font-black ${mistakeAnswer === 2 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {mistakeFeedback}
                      </div>
                    )}
                  </div>
                </div>

                {g1Score >= 2 && g2Answer === 'B' && mistakeAnswer === 2 && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleNextDay}
                      className="py-3 px-6 bg-cyan-500 text-slate-950 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      Graduation Exam: Day 5! <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* DAY 5 Proof (Assessment) */}
            {activeDay === 5 && (
              <motion.div
                key="day5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2 text-cyan-400">
                    <span>🏆</span> Day 5 — Mission Proof (Graduation)
                  </h3>
                  <span className="text-xs font-bold text-slate-500">25 min limit</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex gap-4 items-start shadow-md">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <img src="/icons.svg" className="w-8 h-8 object-contain" alt="robot" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span>TESSA says:</span>
                      <SpeakButton id="d5-tessa-says" text="You've done amazing work this week! Today we write our Mission Report card. Answer the 8 questions to prove your mastery and graduation to Level 2! 🌟" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                      You've done amazing work this week! Today we write our Mission Report card. Answer the 8 questions to prove your mastery and graduation to Level 2! 🌟
                    </p>
                  </div>
                </div>

                {/* Questions Grid */}
                {!submittedReport ? (
                  <div className="space-y-4">
                    {assessQuestions.map((q, qIdx) => {
                      const isAnswered = assessAnswers[q.id] !== undefined;
                      const userSelection = assessAnswers[q.id];

                      return (
                        <div key={q.id} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-800/50 pb-2 flex-wrap gap-2">
                            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-wider">Question {qIdx + 1} of 8</span>
                            <div className="flex items-center gap-2">
                              <SpeakButton id={`d5-q-${q.id}`} text={`${q.question}. Options are: ${q.options.map((opt, oIdx) => `${String.fromCharCode(65 + oIdx)}: ${opt}`).join('. ')}`} />
                              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">CT Core</span>
                            </div>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-200 whitespace-pre-line leading-relaxed">{q.question}</p>

                          <div className="grid grid-cols-1 gap-2 pt-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userSelection === optIdx;
                              let btnStyle = 'bg-slate-950/50 border-slate-850 hover:border-slate-700 text-slate-300';
                              
                              if (isAnswered) {
                                  if (optIdx === q.correctIdx) {
                                    btnStyle = 'bg-green-500/10 border-green-500 text-green-400';
                                  } else if (isSelected) {
                                    btnStyle = 'bg-red-500/10 border-red-500 text-red-400';
                                  } else {
                                    btnStyle = 'bg-slate-950/20 border-slate-900 opacity-40';
                                  }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isAnswered}
                                  onClick={() => handleSelectAssess(q.id, optIdx, q.correctIdx, q.explanation)}
                                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${btnStyle}`}
                                >
                                  <span className="inline-block bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded mr-2 font-black">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {assessFeedback[q.id] && (
                            <div className={`p-3 rounded-xl text-xs font-semibold ${assessFeedback[q.id].correct ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {assessFeedback[q.id].msg}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-4 text-center">
                      <button
                        onClick={submitReport}
                        disabled={Object.keys(assessAnswers).length < 8}
                        className={`w-full py-4 rounded-2xl font-black text-md shadow-md cursor-pointer transition-all ${
                          Object.keys(assessAnswers).length === 8
                            ? 'bg-green-500 hover:scale-[1.02] active:scale-[0.98] text-slate-950'
                            : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Submit Graduation Report Card
                      </button>
                    </div>
                  </div>
                ) : (
                  // Graduated results display
                  <div className="space-y-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-lg">
                      <div className="flex justify-end pr-2">
                        <SpeakButton id="d5-results" text={finalScore >= 5 
                          ? `Graduation Report Complete! Your score is ${finalScore} out of 8. ${finalScore >= 7 
                            ? 'You are a true Code-Breaker! You understood algorithms deeply — and even cracked the hardest questions. TESSA is very proud!' 
                            : 'Excellent work — you understand the core ideas really well! Review the questions you missed and you\'ll be ready for Chapter 2.'}`
                          : `Try one more time! Your score is ${finalScore} out of 8. You\'re getting it! TESSA suggests going back and review Day 2 to try the cipher tool with different shifts — then try the report card again!`
                        } />
                      </div>
                      <div className="text-5xl">{finalScore >= 5 ? '🎉' : '💪'}</div>
                      <h4 className="font-black text-xl">
                        {finalScore >= 5 ? 'Graduation Report Complete!' : 'Try one more time!'}
                      </h4>
                      
                      <div className="inline-block bg-slate-900 border border-slate-850 px-6 py-4 rounded-3xl">
                        <div className="text-4xl font-black tracking-wider text-cyan-400">{finalScore} / 8</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Questions Correct</div>
                      </div>

                      <div className="flex gap-2 justify-center py-2">
                        {[1, 2, 3].map((starIdx) => {
                          const isLit = finalScore >= 5 && (
                            (starIdx === 1) || 
                            (starIdx === 2 && finalScore >= 7) || 
                            (starIdx === 3 && finalScore === 8)
                          );
                          return (
                            <Star 
                              key={starIdx} 
                              size={28} 
                              fill={isLit ? 'currentColor' : 'none'} 
                              className={isLit ? 'text-amber-400 animate-bounce' : 'text-slate-700'} 
                            />
                          );
                        })}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-md mx-auto">
                        {finalScore >= 7
                          ? 'You are a true Code-Breaker! You understood algorithms deeply — and even cracked the hardest questions. TESSA is very proud!'
                          : finalScore >= 5
                          ? 'Excellent work — you understand the core ideas really well! Review the questions you missed and you\'ll be ready for Chapter 2.'
                          : 'You\'re getting it! TESSA suggests going back and review Day 2 to try the cipher tool with different shifts — then try the report card again!'}
                      </p>
                    </div>

                    {finalScore >= 5 ? (
                      <div className="space-y-6">
                        {/* Concept summary */}
                        <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-2">
                          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between gap-2 mb-1">
                            <span>🔑 What You Learned This Week</span>
                            <SpeakButton id="d5-learned" text="What You Learned This Week. An Algorithm is a set of clear, ordered steps that produces the same result every time. You used algorithmic thinking to encode and decode messages — exactly like computers do when they protect passwords and private messages online. In Chapter 2, TESSA will use the same kind of step-by-step thinking — but instead of shifting letters, we'll be sorting and grouping objects. The algorithm will look completely different... but the idea underneath is the same." />
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            An <strong>Algorithm</strong> is a set of clear, ordered steps that produces the same result every time.<br/><br/>
                            You used algorithmic thinking to encode and decode messages — exactly like computers do when they protect passwords and private messages online.
                          </p>
                          <p className="text-[10px] text-slate-500 mt-2 font-semibold">
                            In Chapter 2 (Level 2), TESSA will use the same kind of step-by-step thinking — but instead of shifting letters, we'll be <em>sorting and grouping objects</em>. The algorithm will look completely different... but the idea underneath is the same.
                          </p>
                        </div>

                        {/* Next teaser */}
                        <div className="bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/20 rounded-3xl p-5 text-center space-y-2 relative">
                          <div className="absolute top-3 right-3">
                            <SpeakButton id="d5-coming-soon" text="Coming in Level 2... TESSA's toy room is a complete mess! There are 50 toys everywhere and she cannot find anything. We'll write rules to sort them. Level 2: Pattern Finder begins!" />
                          </div>
                          <h5 className="font-extrabold text-sm text-cyan-400">🔭 Coming in Level 2...</h5>
                          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                            TESSA's toy room is a complete mess! There are 50 toys everywhere and she cannot find anything. We'll write rules to sort them.
                            <br/><br/>
                            <strong className="text-cyan-400">Level 2: Pattern Finder begins!</strong>
                          </p>
                        </div>

                        <div className="pt-2 text-center">
                          <button
                            onClick={() => {
                              const prof = tessaDb.getProfile();
                              if (prof.subscription_status === 'premium') {
                                onClose({
                                  xpEarned: 100,
                                  unlockedAchievements: [],
                                  levelUp: true,
                                  oldLevel: 1,
                                  newLevel: 2
                                });
                              } else {
                                setShowBuyScreen(true);
                              }
                            }}
                            className="py-4 px-8 bg-green-500 text-slate-950 font-black rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            Proceed to Level 2 Journey <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 text-center">
                        <button
                          onClick={() => {
                            setAssessAnswers({});
                            setAssessFeedback({});
                            setSubmittedReport(false);
                          }}
                          className="py-3 px-6 bg-cyan-500 text-slate-950 font-black rounded-2xl text-xs hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          Retry Assessment <RotateCcw size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
