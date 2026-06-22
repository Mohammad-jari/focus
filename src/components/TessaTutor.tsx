'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, Sparkles, RefreshCw, Trash2, HelpCircle, Check, Languages, MessageSquare } from 'lucide-react';
import { tessaDb, ChatMessage, StudentProfile } from '@/lib/tessaDb';

const MOCK_ANSWERS_ENGLISH = [
  "Wow, that's an awesome question! 🚀 Computational Thinking is all about thinking like a detective to solve puzzles. It has four superpowers: Decomposition (breaking things down), Pattern Recognition (spotting repeats), Abstraction (focusing on the important stuff), and Algorithm Design (writing step-by-step instructions)!",
  "Great question! 🤖 Artificial Intelligence is when we teach computers to make smart decisions or spot patterns, just like human brains do! For example, when YouTube knows what video you want to watch next, that's AI working in the background!",
  "An algorithm is just like a recipe for baking a cake! 🍰 It is a step-by-step set of instructions that tells a computer EXACTLY what to do. If you miss a step, the cake might taste funny or the computer might get confused!",
  "Hey! Supervised Learning is like a teacher showing a baby cards of animals: 'This is a Cat', 'This is a Dog'. The baby sees the features (whiskers, ears) and learns the labels. Once trained, the baby can identify a new cat on its own! 🐱",
  "Hmm! I can only help you with Computational Thinking and Artificial Intelligence! Let's get back to our exciting learning adventure. Would you like to learn about patterns, robots, or how machines learn? 🤖💡"
];

const MOCK_ANSWERS_HINGLISH = [
  "Wah, kya badhiya question pucha hai! 🚀 Computational Thinking ka matlab hai problems ko ek puzzle ki tarah solve karna. Iske paas 4 superpowers hoti hain: Decomposition (chote pieces mein todna), Pattern Recognition (repeats ko pehchanna), Abstraction (fazi chizo ko ignore karna), aur Algorithm Design (step-by-step steps banana)!",
  "Superb question! 🤖 Artificial Intelligence (AI) ka matlab hai jab hum computers ko smart decisions lena sikhate hain, bilkul hamare brain ki tarah! Jaise jab phone aapka face dekh kar unlock ho jata hai, wo AI hai! 📱",
  "Algorithm matlab ek recipe ki tarah hai! 🍰 Step-by-step instructions jo computer ko batati hain ki exactly kya karna hai. Agar ek bhi step miss hua, toh computer confuse ho jayega!",
  "Hey! Supervised Learning ka matlab hai jab hum computer ko 'labels' ke sath sikhate hain. Jaise teacher ne baby ko bataya: 'Yeh Apple hai' aur 'Yeh Orange hai'. Computer is data se features seekh jata hai aur naye apple ko pehchan leta hai! 🍎",
  "Arey! Main sirf Computational Thinking aur AI ke related questions ka answer de sakti hoon. Chalo hum apne exciting computer science topics par wapas aate hain! Kya aap algorithm ya patterns ke baare mein seekhna chahoge? 🤖💡"
];

interface TessaTutorProps {
  profile: StudentProfile;
  onXpEarned: (xp: number) => void;
}

export default function TessaTutor({ profile, onXpEarned }: TessaTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tutorLang, setTutorLang] = useState<'english' | 'hinglish'>(profile.preferred_language);
  const [speechActive, setSpeechActive] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial chat history from our DB
    setMessages(tessaDb.getChats());
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Text-To-Speech using native Web Speech API (FREE & FAST!)
  const handleSpeak = (text: string, msgId: string) => {
    if (typeof window === 'undefined') return;
    
    if ('speechSynthesis' in window) {
      if (speechActive === msgId) {
        // Toggle off if clicking the currently speaking message
        window.speechSynthesis.cancel();
        setSpeechActive(null);
        return;
      }

      window.speechSynthesis.cancel(); // Stop any current speech
      
      // Clean up text from emojis and Markdown formatting for clean TTS
      const cleanText = text
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '') // Emojis
        .replace(/[*#_`~]/g, ''); // Markdown formatting

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Attempt to set a friendly English voice
      const voices = window.speechSynthesis.getVoices();
      // Prefer a female English voice if available; otherwise fall back to any English voice
      const femaleEnglishVoice = voices.find(v => v.lang.startsWith('en') && /female/i.test(v.name));
      const EnglishVoice = femaleEnglishVoice || voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB'));
      if (EnglishVoice) {
        utterance.voice = EnglishVoice;
      }
      
      utterance.onend = () => setSpeechActive(null);
      utterance.onerror = () => setSpeechActive(null);
      
      setSpeechActive(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser version.");
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // 1. Save user message to Local Db and UI state
    const userMsg = tessaDb.saveChat(text, 'user');
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const currentLevel = profile.current_level || 1;
      const currentLang = tutorLang;
      const isPrimary = currentLevel <= 5;

      // Check client-side OpenRouter keys (env or localStorage override)
      const clientApiKey = (import.meta.env.VITE_OPENROUTER_API_KEY as string) || 
                            localStorage.getItem('tessa_openrouter_api_key') || 
                            '';

      if (!clientApiKey) {
        console.log('OpenRouter API Key not found. Falling back to local browser explanation engine.');
        let responseText = "";
        const lowerMsg = text.toLowerCase();

        if (lowerMsg.includes('computational') || lowerMsg.includes('ct') || lowerMsg.includes('think')) {
          responseText = currentLang === 'english' ? MOCK_ANSWERS_ENGLISH[0] : MOCK_ANSWERS_HINGLISH[0];
        } else if (lowerMsg.includes('ai') || lowerMsg.includes('intelligence') || lowerMsg.includes('artificial')) {
          responseText = currentLang === 'english' ? MOCK_ANSWERS_ENGLISH[1] : MOCK_ANSWERS_HINGLISH[1];
        } else if (lowerMsg.includes('algorithm') || lowerMsg.includes('step') || lowerMsg.includes('recipe')) {
          responseText = currentLang === 'english' ? MOCK_ANSWERS_ENGLISH[2] : MOCK_ANSWERS_HINGLISH[2];
        } else if (lowerMsg.includes('supervised') || lowerMsg.includes('learn') || lowerMsg.includes('train')) {
          responseText = currentLang === 'english' ? MOCK_ANSWERS_ENGLISH[3] : MOCK_ANSWERS_HINGLISH[3];
        } else {
          responseText = currentLang === 'english' ? MOCK_ANSWERS_ENGLISH[4] : MOCK_ANSWERS_HINGLISH[4];
        }

        // Simulate a friendly delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const aiMsg = tessaDb.saveChat(responseText, 'tutor');
        setMessages(prev => [...prev, aiMsg]);
        return;
      }

      // If API key is available, execute a direct client-side fetch (100% static!)
      const systemPrompt = `
You are "TESSA", an expert, super friendly, warm, and playful AI Tutor for school students in Classes 3–8 learning Computational Thinking (CT) and Artificial Intelligence (AI).

Follow these STRICT boundaries and pedagogy guidelines:
1. CURRICULUM BOUNDARY:
- ONLY answer questions related to Computational Thinking (algorithms, patterns, decomposition, abstraction, logic) and Artificial Intelligence (Machine Learning, supervised/unsupervised learning, data, neural nets, AI ethics, future AI).
- If the student asks about unrelated topics (e.g. historical facts, math homework not related to computational logic, coding in Java/C++ beyond basics, essays, sports, gaming, jokes, writing code for web applications, or dangerous topics), politely decline in a friendly way. Example: "I'd love to talk about that, but my AI circuits are set to focus only on Computational Thinking and AI! Let's explore algorithms or pattern sorting instead!"

2. LEVEL ADAPTATION:
- Student Level: Level ${currentLevel}.
${isPrimary 
  ? `- The student is in early journey levels (Level 1 to 5). You MUST explain concepts in extremely simple words, using playful analogies (e.g., Lego blocks, cartoon robots, baking cookies, school bag sorting). Use emojis on every sentence. Keep paragraphs short (1-2 sentences maximum). Make it feel like an interactive game!` 
  : `- The student is in advanced journey levels (Level 6 to 10). You should explain concepts clearly with appropriate definitions (e.g., supervised learning, features, machine bias, AI ethics, systems). Keep the explanation engaging, practical, and relate it to daily tech (like YouTube recommendations, Snapchat/Instagram filters, self-driving cars).`
}

3. LANGUAGE & TONE:
- Preferred language mode: ${currentLang}.
${currentLang === 'hinglish' 
  ? `- You MUST respond in Hinglish (Hindi words written in Latin script, mixed with English).
  - Example style: "Hey there! Kya aap ready ho machine learning seekhne ke liye? 🤖 Aao main aapko ek simple example se samjhati hoon..."
  - Ensure it reads naturally, warm, and encouraging. Use Indian context examples where possible.`
  : `- Respond in clear, friendly, and motivational English.`
}

4. RESPONSE STYLE:
- Never provide huge blocks of dry text. Keep it well-spaced with bullet points and friendly formatting.
- Encourage active participation: end your explanation with a quick question, a riddle, or a little puzzle challenge!
- Be supportive: celebrate their curiosity!
`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...(messages.slice(-8) || []).map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.message
        })),
        { role: 'user', content: text }
      ];

      const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://tessafocus.com',
          'X-Title': 'TESSA Focus AI Tutor'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 450
        })
      });

      if (!openrouterResponse.ok) {
        throw new Error(`OpenRouter Direct API failed: ${openrouterResponse.status}`);
      }

      const data = await openrouterResponse.json();
      const botReply = data.choices[0]?.message?.content || "Oops! My AI neurons got tangled. Let us try that again!";

      // Save AI message to Db and UI state
      const aiMsg = tessaDb.saveChat(botReply, 'tutor');
      setMessages(prev => [...prev, aiMsg]);

      // Check if user unlocked the AI achievement
      const profileAfter = tessaDb.getProfile();
      if (profileAfter.xp > profile.xp) {
        onXpEarned(profileAfter.xp - profile.xp);
      }

    } catch (err) {
      console.error(err);
      const errorMsg = tessaDb.saveChat(
        "Oops! My logic circuits experienced a minor glitch. Could you try asking that again?",
        'tutor'
      );
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear our chat history?")) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      tessaDb.clearChat();
      setMessages(tessaDb.getChats());
      setSpeechActive(null);
    }
  };

  // Level adapted suggested questions
  const getSuggestions = () => {
    const currentLevel = profile.current_level || 1;
    if (currentLevel <= 5) {
      return [
        "What is Computational Thinking?",
        "What is an algorithm?",
        "Tell me a puzzle riddle!",
        "Explain Decomposition"
      ];
    } else {
      return [
        "What is Artificial Intelligence?",
        "Explain Supervised vs Unsupervised Learning",
        "What is Machine Bias?",
        "How do recommender systems work?"
      ];
    }
  };

  const renderMessageText = (text: string) => {
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
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-slate-50 overflow-hidden relative">
      
      {/* Tutor Banner */}
      <div className="bg-white border-b-2 border-slate-100 py-3.5 px-4 flex justify-between items-center flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-tessa-purple-light border-2 border-tessa-purple rounded-full flex items-center justify-center shadow-sm">
            <img src="/icons.svg" className="w-7 h-7 object-contain" alt="robot" />
          </div>
          <div>
            <div className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
              TESSA AI Tutor
              <span className="text-[10px] bg-tessa-purple text-white px-2 py-0.5 rounded-full font-black uppercase">
                Active
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold">
              Level {profile.current_level || 1} Tutor
            </p>
          </div>
        </div>

        {/* Toggles and controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-0.5 flex gap-0.5">
            <button
              onClick={() => setTutorLang('english')}
              className={`px-2 py-1 text-xs font-black rounded-lg transition-all ${
                tutorLang === 'english'
                  ? 'bg-white text-tessa-purple shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setTutorLang('hinglish')}
              className={`px-2 py-1 text-xs font-black rounded-lg transition-all ${
                tutorLang === 'hinglish'
                  ? 'bg-white text-tessa-purple shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              हिं/HI
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-tessa-rose border border-slate-200 hover:border-tessa-rose/20 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile Avatar bubble */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-sm border ${
                isUser 
                  ? 'bg-sky-100 border-sky-300' 
                  : 'bg-purple-100 border-purple-300'
              }`}>
                {isUser ? '🎒' : <img src="/icons.svg" className="w-5.5 h-5.5 object-contain" alt="robot" />}
              </div>

              {/* Message contents */}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm font-bold border-2 leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-tessa-blue border-tessa-blue-dark text-white rounded-tr-none'
                    : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{renderMessageText(msg.message)}</p>

                  {/* Play audio button (Speech synthesis) for AI replies */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleSpeak(msg.message, msg.id)}
                        className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg border transition-all ${
                          speechActive === msg.id
                            ? 'bg-tessa-purple border-tessa-purple-dark text-white animate-pulse'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-tessa-purple hover:border-tessa-purple/30'
                        }`}
                      >
                        <Volume2 size={12} />
                        {speechActive === msg.id ? 'Speaking' : 'Speak'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bouncing Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <img src="/icons.svg" className="w-5.5 h-5.5 object-contain" alt="robot" />
            </div>
            <div className="p-4 rounded-3xl border-2 border-slate-200 bg-white rounded-tl-none flex items-center gap-1">
              <span className="w-2 h-2 bg-tessa-purple rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-tessa-purple rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-tessa-purple rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions & Quick Actions Footer */}
      <div className="bg-white border-t-2 border-slate-100 p-4 flex-shrink-0 space-y-3.5">
        
        {/* Quick action chips */}
        {messages.length > 1 && !isTyping && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleSendMessage("Can you explain that even simpler, like I am 5 years old? 🧠")}
              className="flex-shrink-0 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 hover:border-indigo-300 text-xs font-black rounded-full flex items-center gap-1.5 transition-all active:scale-95"
            >
              ✨ Explain Simpler
            </button>
            <button
              onClick={() => handleSendMessage("Can you give me a real-world example of this concept? 🌍")}
              className="flex-shrink-0 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-amber-200 hover:border-amber-300 text-xs font-black rounded-full flex items-center gap-1.5 transition-all active:scale-95"
            >
              💡 Give Example
            </button>
            <button
              onClick={() => handleSendMessage("Create a simple 1-question quiz for me to check my understanding! 🏆")}
              className="flex-shrink-0 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-tessa-purple border-2 border-purple-200 hover:border-purple-300 text-xs font-black rounded-full flex items-center gap-1.5 transition-all active:scale-95"
            >
              ❓ Create Quiz
            </button>
          </div>
        )}

        {/* Suggested questions deck */}
        {messages.length <= 1 && !isTyping && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare size={10} /> Suggested Questions to Ask
            </div>
            <div className="grid grid-cols-2 gap-2">
              {getSuggestions().map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="p-2.5 text-left bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-extrabold text-slate-600 leading-snug transition-all active:scale-98"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Send Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            disabled={isTyping}
            placeholder={isTyping ? "TESSA is thinking..." : "Ask TESSA a question..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-tessa-purple rounded-2xl outline-none font-extrabold text-slate-800 text-sm transition-all"
          />
          <button
            disabled={!inputValue.trim() || isTyping}
            onClick={() => handleSendMessage(inputValue)}
            className={`p-3 rounded-2xl border-b-4 flex items-center justify-center transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-tessa-purple border-tessa-purple-dark text-white active:translate-y-0.5 active:border-b-0'
                : 'bg-slate-100 border-slate-300 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
