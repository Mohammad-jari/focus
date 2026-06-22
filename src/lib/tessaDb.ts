import { createClient } from '@supabase/supabase-js';

// Types
export interface StudentProfile {
  id: string;
  name: string;
  current_level: number; // 1 to 10
  school_name: string;
  preferred_language: 'english' | 'hinglish';
  avatar_id: string;
  xp: number;
  streak_days: number;
  last_active_date: string | null;
  created_at: string;
  subscription_status: 'free' | 'premium';
  // Keep class_number for backward compatibility
  class_number?: number;
  contact_number?: string;
}

export interface JourneyItem {
  id: string;
  type: 'comic' | 'mission' | 'challenge';
  title: string;
  subtitle?: string;
  description?: string;
  xpReward: number;
  refId?: string; // Links to lesson ID
  comicNumber?: number; // Order index for comic pages resolution
  comicClass?: number; // Maps to curriculum folder (e.g. 3 for class 3)
}

export interface LevelInfo {
  number: number;
  name: string;
  skillTag: string;
  subTagline: string;
  description: string;
  schoolDescription: string;
  accentColor: string; // CSS variable or hex
  bgColor: string;
  dkColor: string;
  icon: string;
  outcomes: string[];
  items: JourneyItem[];
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  type: 'explanation' | 'puzzle' | 'logic';
  xp_reward: number;
  order_index: number;
  slides: {
    title: string;
    content: string;
    illustration?: string;
  }[];
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  hint: string;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  requirement_type: 'lessons' | 'quizzes' | 'streak' | 'ai_chats' | 'first_login';
  requirement_value: number;
}

export interface StudentProgress {
  student_id: string;
  completed_lessons: string[]; // mission ids
  completed_quizzes: string[]; // challenge/quiz ids
  completed_comics: string[]; // comic ids
  completed_challenges: string[]; // challenge/boss challenges completed
  unlocked_achievements: string[];
  active_streak: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  message: string;
  timestamp: string;
}

// ----------------------------------------------------
// JOURNEY LEVELS DEFINITIONS (10 Levels)
// ----------------------------------------------------
export const LEVELS: LevelInfo[] = [
  {
    number: 1,
    name: 'Curious Spark',
    skillTag: 'CT Foundations',
    subTagline: 'Code Cadet — you just switched on.',
    description: "Your adventure begins. You'll crack secret codes, spot hidden patterns, and write your first step-by-step instructions. TESSA guides every session.",
    schoolDescription: 'Introduces the four pillars of Computational Thinking through unplugged, activity-based learning aligned with CBSE Classes 3 curriculum. No devices required for core activities. 14 chapters · 25 min/day · 5 days/week.',
    accentColor: 'var(--l1)',
    bgColor: 'var(--l1-bg)',
    dkColor: 'var(--l1-dk)',
    icon: '🔍',
    outcomes: [
      '🔐 Caesar Cipher & Algorithms',
      '🔄 Pattern Recognition basics',
      '🧩 Decomposition — breaking problems',
      '🗺️ Abstract Thinking — hidden shapes',
      '🤖 Meet TESSA — your AI buddy',
      '📊 Data from everyday life'
    ],
    items: [
      { id: 'l1_c1', type: 'comic', title: 'Meet TESSA', subtitle: 'TESSA Arrives', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'tessa_secret_code', type: 'mission', title: "TESSA's Secret Code", subtitle: 'The Secret Message Mystery', xpReward: 100, refId: 'tessa_secret_code' },
      { id: 'l1_c2', type: 'comic', title: 'The Pattern Puzzle', subtitle: 'Hiding Rules', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l1_m2', type: 'mission', title: 'Visual Logic & Patterns', subtitle: 'Grouping Shapes & Rules', xpReward: 50, refId: 'c35_l1' },
      { id: 'l1_challenge', type: 'challenge', title: 'Level 1 Graduation Challenge', subtitle: 'Prove your CT Foundations', xpReward: 80, refId: 'l1_challenge' }
    ]
  },
  {
    number: 2,
    name: 'Pattern Finder',
    skillTag: 'Pattern Recognition',
    subTagline: 'Code Cadet — you see what others miss.',
    description: "You'll find the rules hiding inside numbers, shapes, and stories. Every problem has a pattern underneath — your job is to find it before anyone else.",
    schoolDescription: 'Deepens pattern recognition across Mathematics and The World Around Us. Students generalise rules from examples and apply them to new contexts. Builds predictive reasoning foundational to data literacy.',
    accentColor: 'var(--l2)',
    bgColor: 'var(--l2-bg)',
    dkColor: 'var(--l2-dk)',
    icon: '👁️',
    outcomes: [
      '🔢 Number patterns & sequences',
      '📐 Shape & symmetry patterns',
      '🌿 Patterns in nature & EVS',
      '🔮 Predict & generalise rules',
      '📖 Grammar patterns in language',
      '🎯 Find the exception — anomaly detection'
    ],
    items: [
      { id: 'l2_c1', type: 'comic', title: 'Decomposition Day', subtitle: 'Breaking Down Big Tasks', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l2_m1', type: 'mission', title: 'Decomposition (Break it Down)', subtitle: 'The Pizza Game & Steps', xpReward: 50, refId: 'c35_l3' },
      { id: 'l2_c2', type: 'comic', title: 'Repeating Patterns', subtitle: 'Grid Sequences', xpReward: 20, comicClass: 3, comicNumber: 2 }, // Re-using visual assets safely
      { id: 'l2_m2', type: 'mission', title: 'Repeating Patterns', subtitle: 'Grid Structures', xpReward: 50, refId: 'c35_l2' },
      { id: 'l2_challenge', type: 'challenge', title: 'Level 2 Graduation Challenge', subtitle: 'Pattern Generalization Quiz', xpReward: 80, refId: 'l2_challenge' }
    ]
  },
  {
    number: 3,
    name: 'Logic Architect',
    skillTag: 'Algorithmic Thinking',
    subTagline: 'Logic Scout — you build ideas that hold.',
    description: "You'll write instructions precise enough for a robot to follow without any mistakes. One wrong step and everything breaks — so every word matters.",
    schoolDescription: 'Students design complete, unambiguous step-by-step procedures and test them against edge cases. Builds the precision habit essential for future programming and AI evaluation.',
    accentColor: 'var(--l3)',
    bgColor: 'var(--l3-bg)',
    dkColor: 'var(--l3-dk)',
    icon: '🏗️',
    outcomes: [
      '📋 Write algorithms that actually work',
      '🐛 Debug — find and fix broken steps',
      '🔁 Loops & repetition in instructions',
      '❓ Conditional logic — if this, then that',
      '🧮 Maths as an algorithm system',
      '🗺️ Map reading as algorithmic navigation'
    ],
    items: [
      { id: 'l3_c1', type: 'comic', title: 'Robots Run Amok', subtitle: 'Direction Directives', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l3_m1', type: 'mission', title: 'Coding Robots (Algorithms)', subtitle: 'Labyrinths & Directions', xpReward: 50, refId: 'l3_m1' },
      { id: 'l3_c2', type: 'comic', title: 'Loop Loop Loop', subtitle: 'Repeating Instructions', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l3_m2', type: 'mission', title: 'Logic Loops & Repetition', subtitle: 'Iterative Directions', xpReward: 50, refId: 'l3_m2' },
      { id: 'l3_challenge', type: 'challenge', title: 'Level 3 Graduation Challenge', subtitle: 'Robot Debugging Challenge', xpReward: 80, refId: 'l3_challenge' }
    ]
  },
  {
    number: 4,
    name: 'Data Scout',
    skillTag: 'Data Literacy',
    subTagline: 'Data Ranger — numbers tell you stories.',
    description: "Data is everywhere — in cricket scores, election results, weather reports, and your school timetable. You'll learn to read data the way detectives read clues.",
    schoolDescription: 'Introduces data collection, organisation, representation, and interpretation across subjects. Students understand how AI systems use data — and why the quality of data determines the quality of AI decisions.',
    accentColor: 'var(--l4)',
    bgColor: 'var(--l4-bg)',
    dkColor: 'var(--l4-dk)',
    icon: '📊',
    outcomes: [
      '📈 Tables, charts, bar graphs',
      '🔍 Mean, median, mode — real use',
      '⚠️ Spotting outliers & bad data',
      '🤔 Correlation vs. causation',
      '🗄️ How AI learns from data',
      '🌏 Indian data — census, weather, maps'
    ],
    items: [
      { id: 'l4_c1', type: 'comic', title: 'Timetable Troubles', subtitle: 'Clues in Schedules', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l4_m1', type: 'mission', title: 'Data Literacy Basics', subtitle: 'Detecting Clues in Numbers', xpReward: 50, refId: 'l4_m1' },
      { id: 'l4_c2', type: 'comic', title: 'Chart Checkers', subtitle: 'Graph Plotters', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l4_m2', type: 'mission', title: 'Tables & Graphs', subtitle: 'Visualizing Local Data', xpReward: 50, refId: 'l4_m2' },
      { id: 'l4_challenge', type: 'challenge', title: 'Level 4 Graduation Challenge', subtitle: 'Cricket Statistics Analysis', xpReward: 80, refId: 'l4_challenge' }
    ]
  },
  {
    number: 5,
    name: 'Algorithm Crafter',
    skillTag: 'Applied Algorithms',
    subTagline: 'Algorithm Knight — you write the rules machines follow.',
    description: "From sorting algorithms to search strategies — you'll build the engines that power apps, maps, and recommendation systems. No coding required. Just sharp thinking.",
    schoolDescription: 'Students design and evaluate algorithms for real-world problems: sorting, searching, optimisation. Connects directly to CBSE Class 7 Mathematics and Science experimental design. Transfer across subjects is the key learning outcome.',
    accentColor: 'var(--l5)',
    bgColor: 'var(--l5-bg)',
    dkColor: 'var(--l5-dk)',
    icon: '⚙️',
    outcomes: [
      '🔀 Sorting algorithms — how they differ',
      '🔎 Search strategies & efficiency',
      '📦 Optimisation — best vs. good enough',
      '🧪 Scientific method as algorithm',
      '🗺️ How GPS & maps use algorithms',
      '🤖 How recommendation engines work'
    ],
    items: [
      { id: 'l5_c1', type: 'comic', title: 'Sorting Out Sorted', subtitle: 'Organizer Battle', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l5_m1', type: 'mission', title: 'Applied Algorithms', subtitle: 'Sorting & Searching Games', xpReward: 50, refId: 'l5_m1' },
      { id: 'l5_c2', type: 'comic', title: 'Search Party', subtitle: 'Path Optimizers', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l5_m2', type: 'mission', title: 'GPS & Maps Algorithms', subtitle: 'Finding the Shortest Route', xpReward: 50, refId: 'l5_m2' },
      { id: 'l5_challenge', type: 'challenge', title: 'Level 5 Graduation Challenge', subtitle: 'Efficiency Metrics challenge', xpReward: 80, refId: 'l5_challenge' }
    ]
  },
  {
    number: 6,
    name: 'Model Builder',
    skillTag: 'AI Concepts',
    subTagline: 'AI Guardian — you shape how AI learns.',
    description: "You'll understand how AI actually works — not magic, just maths and patterns. You'll also discover where AI goes wrong, and why your judgment will always matter more than the machine.",
    schoolDescription: 'Builds conceptual understanding of machine learning, bias, and AI evaluation without requiring programming. Students apply critical evaluation to AI outputs — the most essential skill for responsible AI use. Aligned to CBSE TRG-02 Sub-themes 5–7.',
    accentColor: 'var(--l6)',
    bgColor: 'var(--l6-bg)',
    dkColor: 'var(--l6-dk)',
    icon: '🤖',
    outcomes: [
      '🧠 How AI learns from examples',
      '⚖️ AI bias — what it is and why it matters',
      '🔍 Evaluate AI outputs critically',
      '🌐 AI in Indian workplaces today',
      '🛡️ Data privacy — your rights',
      '✅ Responsible AI use in school'
    ],
    items: [
      { id: 'l6_c1', type: 'comic', title: 'Machine Minds', subtitle: 'Biological vs Machine', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l6_m1', type: 'mission', title: 'What is Artificial Intelligence?', subtitle: 'AI vs Human Smartness', xpReward: 50, refId: 'c68_l1' },
      { id: 'l6_c2', type: 'comic', title: 'Labeling Life', subtitle: 'Supervising AI', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l6_m2', type: 'mission', title: 'Supervised Learning & Data', subtitle: 'Teaching with Labels', xpReward: 50, refId: 'c68_l2' },
      { id: 'l6_challenge', type: 'challenge', title: 'Level 6 Graduation Challenge', subtitle: 'Machine Learning Audit Challenge', xpReward: 80, refId: 'l6_challenge' }
    ]
  },
  {
    number: 7,
    name: 'Systems Thinker',
    skillTag: 'Systems & Networks',
    subTagline: 'You see the whole, not just the parts.',
    description: "How do cities work? How does the internet move data? How do diseases spread? You'll learn to think in systems — and understand why small changes can create big results.",
    schoolDescription: 'Students develop systems-level reasoning: network effects, feedback loops, emergent behaviour, and interdependencies. Prepares students for board-level analysis questions and real-world problem-solving across Economics, Geography, and Science.',
    accentColor: 'var(--l7)',
    bgColor: 'var(--l7-bg)',
    dkColor: 'var(--l7-dk)',
    icon: '🌐',
    outcomes: [
      '🕸️ How networks and systems behave',
      '♻️ Feedback loops — cause and effect chains',
      '💡 Emergent behaviour in complex systems',
      '📡 How the internet actually works',
      '🏙️ Smart cities and infrastructure AI',
      '🌱 Systems thinking in climate & biology'
    ],
    items: [
      { id: 'l7_c1', type: 'comic', title: 'Network Knots', subtitle: 'Emergence', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l7_m1', type: 'mission', title: 'Systems & Networks', subtitle: 'Feedback Loops & Behavior', xpReward: 50, refId: 'l7_m1' },
      { id: 'l7_c2', type: 'comic', title: 'Feedback Loop Folly', subtitle: 'Emergent Swarms', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l7_m2', type: 'mission', title: 'Smart Cities & Infrastructure', subtitle: 'Emergent Systems in Local Governance', xpReward: 50, refId: 'l7_m2' },
      { id: 'l7_challenge', type: 'challenge', title: 'Level 7 Graduation Challenge', subtitle: 'Feedback Loop Modeling', xpReward: 80, refId: 'l7_challenge' }
    ]
  },
  {
    number: 8,
    name: 'Prompt Engineer',
    skillTag: 'Applied AI',
    subTagline: 'You speak the language of AI.',
    description: "AI is only as smart as the questions you ask it. You'll learn to communicate with AI precisely — and more importantly, know exactly when to trust it and when not to.",
    schoolDescription: 'Practical, critical AI use: structured prompting, output evaluation, AI-assisted research with source verification, and academic integrity. Students develop the professional judgment to use AI tools effectively without surrendering their own thinking.',
    accentColor: 'var(--l8)',
    bgColor: 'var(--l8-bg)',
    dkColor: 'var(--l8-dk)',
    icon: '💬',
    outcomes: [
      '✍️ Structure prompts that work reliably',
      '🔎 Evaluate AI output for accuracy',
      '📚 AI-assisted research with integrity',
      '🚫 Know when AI is confidently wrong',
      '🏫 AI in board exam preparation',
      '💼 AI tools used in Indian careers today'
    ],
    items: [
      { id: 'l8_c1', type: 'comic', title: 'Structured Speak', subtitle: 'Talking with Models', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l8_m1', type: 'mission', title: 'Prompt Engineering Basics', subtitle: 'Structured Prompt Frameworks', xpReward: 50, refId: 'l8_m1' },
      { id: 'l8_c2', type: 'comic', title: 'Verifying Voices', subtitle: 'Spotting AI Hallucinations', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l8_m2', type: 'mission', title: 'Applied AI in Careers', subtitle: 'Leveraging AI in Indian Workplaces', xpReward: 50, refId: 'l8_m2' },
      { id: 'l8_challenge', type: 'challenge', title: 'Level 8 Graduation Challenge', subtitle: 'Academic Integrity Audit', xpReward: 80, refId: 'l8_challenge' }
    ]
  },
  {
    number: 9,
    name: 'AI Strategist',
    skillTag: 'Ethics & Strategy',
    subTagline: 'You decide where AI goes to work.',
    description: "You'll think like a leader: Which problems should AI solve? Which should it never touch? You'll make arguments, weigh tradeoffs, and develop your own informed position on the technology reshaping the world.",
    schoolDescription: 'Develops strategic and ethical reasoning about AI deployment across sectors. Students analyse real case studies from Indian industry, healthcare, agriculture, and governance. Prepares for competitive examination analytical sections and university-level discourse.',
    accentColor: 'var(--l9)',
    bgColor: 'var(--l9-bg)',
    dkColor: 'var(--l9-dk)',
    icon: '🧭',
    outcomes: [
      '⚖️ AI ethics frameworks — Indian context',
      '🏥 AI in healthcare: what goes right/wrong',
      '🌾 AgriTech AI and rural India',
      '🏛️ AI in governance — accountability',
      '📝 Build a structured AI policy argument',
      '🎓 Prepare for AI-adjacent entrance exams'
    ],
    items: [
      { id: 'l9_c1', type: 'comic', title: 'Ethics Board', subtitle: 'The Machine Bias Dilemma', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l9_m1', type: 'mission', title: 'AI Ethics & Strategy', subtitle: 'Analyzing Bias & Guardrails', xpReward: 50, refId: 'c68_l3' },
      { id: 'l9_c2', type: 'comic', title: 'Rural Tech Revolution', subtitle: 'AgriTech and Local Solutions', xpReward: 20, comicClass: 3, comicNumber: 2 },
      { id: 'l9_m2', type: 'mission', title: 'Governance & Accountability', subtitle: 'Who is Responsible?', xpReward: 50, refId: 'l9_m2' },
      { id: 'l9_challenge', type: 'challenge', title: 'Level 9 Graduation Challenge', subtitle: 'Ethics Policy Argumentation', xpReward: 80, refId: 'l9_challenge' }
    ]
  },
  {
    number: 10,
    name: 'Future Architect',
    skillTag: 'TESSA Elite',
    subTagline: 'TESSA Legend — you build what comes next.',
    description: "The final level. You'll build a real capstone project — an original proposal for how AI can solve a problem you care about. TESSA doesn't guide this one. You lead it.",
    schoolDescription: 'Students complete an independent capstone project proposing an original AI application in a domain of their choice, with ethical analysis and stakeholder consideration. Serves as evidence for CBSE portfolio requirements and strengthens university application materials.',
    accentColor: 'var(--cyan)',
    bgColor: 'rgba(0,204,255,0.06)',
    dkColor: 'var(--cyan)',
    icon: '🏛️',
    outcomes: [
      '🏗️ Design an original AI application',
      '📄 Write a structured project proposal',
      '🔍 Conduct an ethical impact analysis',
      '🎤 Present & defend your work',
      '🎓 University application portfolio piece',
      '🤖 TESSA Legend badge — permanent record'
    ],
    items: [
      { id: 'l10_c1', type: 'comic', title: 'Building Tomorrow', subtitle: 'Designing the Future', xpReward: 20, comicClass: 3, comicNumber: 3 },
      { id: 'l10_m1', type: 'mission', title: 'Future Architect Capstone Planning', subtitle: 'Decomposing a Large-Scale Solution', xpReward: 50, refId: 'l10_m1' },
      { id: 'l10_c2', type: 'comic', title: 'Presenting to the World', subtitle: 'Communicating Technology Projects', xpReward: 20, comicClass: 3, comicNumber: 1 },
      { id: 'l10_m2', type: 'mission', title: 'Independent Project Work', subtitle: 'Drafting your Project Portfolio', xpReward: 50, refId: 'l10_m2' },
      { id: 'l10_challenge', type: 'challenge', title: 'Level 10 Final Graduation', subtitle: 'TESSA Legend Capstone Defense', xpReward: 100, refId: 'l10_challenge' }
    ]
  }
];

// ----------------------------------------------------
// ACHIEVEMENTS DATA SET
// ----------------------------------------------------
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'welcome',
    title: 'First Step!',
    description: 'Create your avatar and begin your journey.',
    icon: '✨',
    xp_reward: 50,
    requirement_type: 'first_login',
    requirement_value: 1,
  },
  {
    id: 'first_lesson',
    title: 'Smart Mind',
    description: 'Complete your first learning mission.',
    icon: '🚀',
    xp_reward: 100,
    requirement_type: 'lessons',
    requirement_value: 1,
  },
  {
    id: 'three_lessons',
    title: 'Curious Cub',
    description: 'Complete 3 learning missions.',
    icon: '📚',
    xp_reward: 150,
    requirement_type: 'lessons',
    requirement_value: 3,
  },
  {
    id: 'first_quiz',
    title: 'Quiz Conqueror',
    description: 'Score 100% on a level graduation challenge.',
    icon: '🏆',
    xp_reward: 100,
    requirement_type: 'quizzes',
    requirement_value: 1,
  },
  {
    id: 'ai_friend',
    title: 'AI Companion',
    description: 'Have a conversation with TESSA AI tutor.',
    icon: '🤖',
    xp_reward: 100,
    requirement_type: 'ai_chats',
    requirement_value: 3,
  },
  {
    id: 'streak_3',
    title: 'Unstoppable',
    description: 'Reach a 3-day active learning streak!',
    icon: '🔥',
    xp_reward: 200,
    requirement_type: 'streak',
    requirement_value: 3,
  }
];

// ----------------------------------------------------
// CORE MISSIONS AND LESSON DATA
// ----------------------------------------------------
export const LESSONS: Lesson[] = [
  // LEVEL 1
  {
    id: 'c35_l1',
    chapter_id: 'l1_m2',
    title: 'Spotting Visual Logic',
    description: 'Find similarities and anomalies in various visual groupings.',
    type: 'logic',
    xp_reward: 20,
    order_index: 1,
    slides: [
      {
        title: 'Spotting Patterns',
        content: 'Computers are amazing at finding patterns! A pattern is something that repeats over and over again, like: Red-Blue-Red-Blue-Red... what comes next? Yes, Blue!',
        illustration: '🟥 🟦 🟥 🟦 🟥 ❓'
      },
      {
        title: 'Visual Logic',
        content: 'Logical thinking means finding the rule. For example, if you see a banana, apple, orange, and a toy car... which one does not fit? The toy car! Because it is not a fruit. This is visual classification.',
        illustration: '🍎 🍌 🍊 🚗'
      },
      {
        title: 'Why do we need this?',
        content: 'By sorting things into categories, we teach our brains to think like software developers. Programmers teach machines to group similar photos, detect anomalies, and solve puzzles using this exact rule!',
        illustration: '💻 🤖 💡'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Look at the sequence: 🔺 🟢 🔺 🟢 🔺. What shape comes next?',
        options: ['🔺 (Triangle)', '🟢 (Circle)', '⭐ (Star)', '🟦 (Square)'],
        correctAnswerIndex: 1,
        hint: 'Observe what always follows a Triangle in the pattern.',
        explanation: 'The pattern alternates between Triangle and Circle. Therefore, a Circle follows the Triangle.'
      },
      {
        id: 'q2',
        question: 'Which of the following items is the "ODD ONE OUT" in this group: 🐘 🦁 🐵 🍕?',
        options: ['🐘 (Elephant)', '🦁 (Lion)', '🐵 (Monkey)', '🍕 (Pizza)'],
        correctAnswerIndex: 3,
        hint: 'Three of these are animals. One is something you eat!',
        explanation: 'Elephant, Lion, and Monkey are animals. Pizza is food, so it is the odd one out.'
      }
    ]
  },
  {
    id: 'l1_challenge',
    chapter_id: 'l1_challenge',
    title: 'Level 1 Graduation Challenge',
    description: 'Submit your report card to TESSA to unlock Level 2!',
    type: 'logic',
    xp_reward: 80,
    order_index: 1,
    slides: [
      {
        title: 'Computational Thinking Recap',
        content: 'Awesome job! You are ready to graduation to Level 2. Let us verify your logic skills first.\nRemember Caesar Cipher keys, pattern matching, and algorithm steps!',
        illustration: '🎓 🔍 🔐'
      }
    ],
    quiz: [
      {
        id: 'q1_1',
        question: 'What is an Algorithm?',
        options: ['A special robot code language', 'A step-by-step clear instruction set that always produces the same result', 'A password you type', 'A type of laptop battery'],
        correctAnswerIndex: 1,
        hint: 'It gives clear, confusion-free instructions.',
        explanation: 'An algorithm is defined as a series of precise, unambiguous steps to solve a problem.'
      },
      {
        id: 'q1_2',
        question: 'If you shift the word "ACT" forward by 1 step in the Caesar Cipher, what word do you get?',
        options: ['BDU', 'ZBS', 'ACT', 'CAT'],
        correctAnswerIndex: 0,
        hint: 'A+1=B, C+1=D, T+1=U.',
        explanation: 'A shifts to B, C shifts to D, T shifts to U. This yields BDU.'
      }
    ]
  },

  // LEVEL 2
  {
    id: 'c35_l3',
    chapter_id: 'l2_m1',
    title: 'Decomposition: The Pizza Game',
    description: 'Learn how to split major tasks into tiny manageable recipes.',
    type: 'puzzle',
    xp_reward: 20,
    order_index: 1,
    slides: [
      {
        title: 'What is Decomposition?',
        content: 'Decomposition is a big word that means "breaking a big problem into smaller, bite-sized pieces." It makes difficult tasks super easy!',
        illustration: '🍕 = 🥖 + 🍅 + 🧀'
      },
      {
        title: 'Making a Pizza!',
        content: 'Imagine making a whole pizza from scratch. That sounds huge! But let us decompose it:\n1. Roll the dough\n2. Spread the tomato sauce\n3. Sprinkle the cheese\n4. Bake it in the oven!\nSuddenly, it is simple!',
        illustration: '👩‍🍳 🍕 🔥'
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'If you want to design a computer game, what is the best first decomposed step?',
        options: ['Write 1000 lines of complex code immediately', 'Draw all characters and buy computers', 'Break the game down into: Story, Characters, and Rules', 'Just press buttons'],
        correctAnswerIndex: 2,
        hint: 'Decomposition means breaking the big idea into smaller categories first.',
        explanation: 'Decomposing a game into smaller sections (Story, Characters, Rules) makes it organized and achievable.'
      }
    ]
  },
  {
    id: 'c35_l2',
    chapter_id: 'l2_m2',
    title: 'Repeating Patterns',
    description: 'Master grid sequences and complete complex repeating structures.',
    type: 'logic',
    xp_reward: 25,
    order_index: 2,
    slides: [
      {
        title: 'Grid Patterns',
        content: 'Patterns can also move in different directions! Grid patterns can go left-to-right or top-to-bottom. Spotting rows and columns is how spreadsheets and gaming screens work.',
        illustration: '🏁 🔢 🎮'
      },
      {
        title: 'Mirror Symmetry',
        content: 'Symmetry is another awesome pattern. If you draw a line down the middle of a butterfly, both halves look identical. That is bilateral symmetry, a pattern computers love to detect!',
        illustration: '🦋'
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'If a pattern is A-B-B, A-B-B, A-B... what are the next two letters?',
        options: ['A, B', 'B, A', 'B, B', 'A, A'],
        correctAnswerIndex: 1,
        hint: 'The pattern repeats the unit A-B-B.',
        explanation: 'After A-B, the next letter to finish the unit is B, and the next unit starts with A. So it is B, A.'
      }
    ]
  },
  {
    id: 'l2_challenge',
    chapter_id: 'l2_challenge',
    title: 'Level 2 Graduation Challenge',
    description: 'Show TESSA you mastered decomposition and pattern finder logic!',
    type: 'logic',
    xp_reward: 80,
    order_index: 1,
    slides: [
      {
        title: 'Level 2 Recap',
        content: 'Ready to ascend to Level 3? Complete these logic checks on decomposition.',
        illustration: '🎓 🧩 📐'
      }
    ],
    quiz: [
      {
        id: 'q2_1',
        question: 'What is decomposition?',
        options: ['Rotting of organic garbage', 'Breaking down a complex task into smaller, solvable sub-problems', 'Writing a code line twice', 'Deleting files'],
        correctAnswerIndex: 1,
        hint: 'Bite-sized pieces.',
        explanation: 'Decomposition refers to breaking down larger problems into digestible chunks.'
      }
    ]
  },

  // LEVEL 3
  {
    id: 'l3_m1',
    chapter_id: 'l3_m1',
    title: 'Coding Robots (Algorithms)',
    description: 'Help little robots navigate labyrinths using step-by-step directions.',
    type: 'puzzle',
    xp_reward: 30,
    order_index: 1,
    slides: [
      {
        title: 'Robot Directions',
        content: 'Robots do not understand human advice. They need direct instructions: "MOVE_FORWARD 2 STEPS", "TURN_LEFT", "PICKUP_OBJECT". If you skip a step, they crash!',
        illustration: '🤖 🕹️ 🗺️'
      }
    ],
    quiz: [
      {
        id: 'q3_1_1',
        question: 'A robot starts at square 1. It is instructed: MOVE_RIGHT 2, MOVE_UP 1. Where does it end?',
        options: ['Square 3', 'Depends on standard grids', 'Coordinates (3, 2) if starting at (1, 1)', 'Square 4'],
        correctAnswerIndex: 2,
        hint: 'Add moves to starting coordinate (1, 1).',
        explanation: 'Moving right 2 increases X from 1 to 3. Moving up 1 increases Y from 1 to 2. It lands on (3, 2).'
      }
    ]
  },
  {
    id: 'l3_m2',
    chapter_id: 'l3_m2',
    title: 'Logic Loops & Repetition',
    description: 'Simplify code by grouping repetitive instruction sequences into Loops.',
    type: 'logic',
    xp_reward: 30,
    order_index: 2,
    slides: [
      {
        title: 'What is a Loop?',
        content: 'If you want a robot to walk 10 steps, writing "MOVE_FORWARD" 10 times is tiring! Instead, we write:\nREPEAT 10 TIMES {\n  MOVE_FORWARD\n}\nThis repeating block is called a Loop!',
        illustration: '🔁 🤖 👟'
      }
    ],
    quiz: [
      {
        id: 'q3_2_1',
        question: 'Which of the following describes a Loop?',
        options: ['A circle path you draw', 'A set of instructions that repeats a specified number of times or until a condition is met', 'A bug that ruins your program', 'A type of speaker cable'],
        correctAnswerIndex: 1,
        hint: 'It repeats instructions.',
        explanation: 'Loops are repeat blocks utilized in algorithms to execute sequences multiple times.'
      }
    ]
  },
  {
    id: 'l3_challenge',
    chapter_id: 'l3_challenge',
    title: 'Level 3 Graduation Challenge',
    description: 'Test your algorithmic directions and loop optimization!',
    type: 'logic',
    xp_reward: 80,
    order_index: 1,
    slides: [
      {
        title: 'Level 3 Review',
        content: 'Show TESSA you know robot loop controls.',
        illustration: '🎓 🔁 🤖'
      }
    ],
    quiz: [
      {
        id: 'q3_c1',
        question: 'How do loops help algorithms?',
        options: ['They make them run slower', 'They shorten the code length by repeating actions automatically', 'They prevent errors from happening', 'They are only for complex websites'],
        correctAnswerIndex: 1,
        hint: 'Avoid writing instructions multiple times.',
        explanation: 'Loops compress long sequences of code by wrapping repeated steps inside a loop block.'
      }
    ]
  },

  // LEVEL 6
  {
    id: 'c68_l1',
    chapter_id: 'l6_m1',
    title: 'What is Artificial Intelligence?',
    description: 'Unravel the difference between human smarts and computer smarts.',
    type: 'explanation',
    xp_reward: 20,
    order_index: 1,
    slides: [
      {
        title: 'Human vs. Machine',
        content: 'Humans learn from experiences and senses. Computers, normally, only do exactly what we tell them to do. But Artificial Intelligence (AI) allows computers to "learn" from historical data and make their own smart decisions!',
        illustration: '🧠 vs 🤖'
      },
      {
        title: 'How does AI think?',
        content: 'AI does not have feelings or a biological brain. Instead, it uses math algorithms to spot patterns in massive amounts of training data (pictures, audio, text) and guesses the correct outcomes.',
        illustration: '📊 ➡️ 🦾'
      },
      {
        title: 'AI in daily actions',
        content: 'You see AI every day! Self-driving cars, voice assistants (Siri, Alexa), face unlock on mobile phones, and filters that swap your face with animal ears all run on AI networks!',
        illustration: '📱 🚗 🗣️'
      }
    ],
    quiz: [
      {
        id: 'q5',
        question: 'What is the core ingredient that makes an AI computer system "smart"?',
        options: ['A biological brain', 'Massive amounts of training data and smart pattern-matching math', 'Magical robotic powers', 'Fast keyboard keys'],
        correctAnswerIndex: 1,
        hint: 'AI learns by processing patterns in information.',
        explanation: 'AI systems learn and make decisions by identifying complex patterns within huge volumes of training data.'
      },
      {
        id: 'q6',
        question: 'Which of the following is NOT powered by AI?',
        options: ['YouTube video recommendations', 'Siri understanding your voice commands', 'A standard simple desk lamp switching on when pushed', 'A self-driving Tesla car'],
        correctAnswerIndex: 2,
        hint: 'Think about which device is just a simple electrical switch with no logic.',
        explanation: 'A desk lamp operates on a simple electrical switch. The others require advanced data analysis, computer vision, and speech recognition.'
      }
    ]
  },
  {
    id: 'c68_l2',
    chapter_id: 'l6_m2',
    title: 'Supervised Learning',
    description: 'Explore how we train AI algorithms with labeled data.',
    type: 'logic',
    xp_reward: 25,
    order_index: 1,
    slides: [
      {
        title: 'Labeled Data',
        content: 'Imagine showing a baby 100 pictures of apples and saying "Apple!", and 100 pictures of oranges saying "Orange!". That is Supervised Learning! We give the computer the data AND the labels (answers) so it learns the rule.',
        illustration: '🍎 = "Apple" | 🍊 = "Orange"'
      },
      {
        title: 'Features & Training',
        content: 'The computer extracts "features". For an apple, the features are "Red", "Round", "Stem". For an orange, they are "Orange color", "Rough skin". AI learns to map these features to labels!',
        illustration: '🔍 🔴 🍊'
      }
    ],
    quiz: [
      {
        id: 'q7',
        question: 'In Supervised Learning, what does the word "Supervised" refer to?',
        options: ['A teacher standing behind the computer monitoring the student', 'Training the AI using inputs that already have correct "labels" (answers)', 'Checking if the computer screen is clean', 'Restricting internet connection'],
        correctAnswerIndex: 1,
        hint: 'Supervision means providing the correct answers during training.',
        explanation: 'Supervised learning is called so because the process of an algorithm learning from the training dataset is like a teacher supervising learning: we know the correct answers, and the algorithm iteratively makes predictions.'
      }
    ]
  },
  {
    id: 'l6_challenge',
    chapter_id: 'l6_challenge',
    title: 'Level 6 Graduation Challenge',
    description: 'Test your understanding of AI features and learning types!',
    type: 'logic',
    xp_reward: 80,
    order_index: 1,
    slides: [
      {
        title: 'Level 6 Review',
        content: 'Show TESSA you know Supervised AI concepts.',
        illustration: '🎓 🧠 🦾'
      }
    ],
    quiz: [
      {
        id: 'q6_c1',
        question: 'What is training data in Machine Learning?',
        options: ['Exercises the computer does to stay cold', 'A dataset of examples used to teach an AI algorithm patterns', 'The instructions manual for the user', 'A code loop'],
        correctAnswerIndex: 1,
        hint: 'It teaches the model.',
        explanation: 'Training data contains labeled or unlabeled examples used by the machine learning algorithm to learn patterns.'
      }
    ]
  },

  // LEVEL 9
  {
    id: 'c68_l3',
    chapter_id: 'l9_m1',
    title: 'AI Ethics & Bias',
    description: 'Understand the ethical responsibilities of building AI systems.',
    type: 'explanation',
    xp_reward: 30,
    order_index: 1,
    slides: [
      {
        title: 'What is Bias?',
        content: 'AI is only as good as the data we give it. If we train an AI to recognize dogs, but only show it white dogs, it will think a black dog is NOT a dog! This is called "Machine Bias" (unfairness).',
        illustration: '🦮 (Train) ➡️ 🐕‍🦺 (Fail)'
      },
      {
        title: 'Building Fair AI',
        content: 'AI ethics means building systems that are safe, respect privacy, and treat everyone fairly regardless of color, gender, or age. It is the most important field in computer science today!',
        illustration: '⚖️ 🤝 🛡️'
      }
    ],
    quiz: [
      {
        id: 'q8',
        question: 'Why does an AI sometimes make biased or unfair decisions?',
        options: ['Because it wants to play pranks', 'Because it was trained on incomplete, biased, or narrow historical data', 'Because robots do not like humans', 'Because the computer got too hot'],
        correctAnswerIndex: 1,
        hint: 'The AI mimics whatever data it was fed.',
        explanation: 'If the training data is narrow or reflects human prejudices, the AI will learn those biases and duplicate them in its predictions.'
      }
    ]
  }
];

// Fallback logic for dynamic mock lessons not specified above
const makeMockLesson = (id: string, title: string, subtitle: string): Lesson => {
  return {
    id,
    chapter_id: id,
    title,
    description: `Learn all about ${title} (${subtitle}).`,
    type: 'logic',
    xp_reward: 30,
    order_index: 1,
    slides: [
      {
        title,
        content: `Welcome to the lesson on ${title}! In this module, we will explore key concepts of Computational Thinking and Artificial Intelligence.\nTESSA will guide you through active thinking exercises.`,
        illustration: '📚 🤖 ✨'
      },
      {
        title: 'Core Concept',
        content: `The big idea is to write clear instructions, understand patterns, check the reliability of information, and build system-level models.`,
        illustration: '🔍 🗺️ 🚀'
      }
    ],
    quiz: [
      {
        id: 'mock_q1',
        question: `Which of the following is true about ${title}?`,
        options: ['It is a random method', 'It represents a structured approach to solving problems', 'It requires typing code immediately', 'It was invented yesterday'],
        correctAnswerIndex: 1,
        hint: 'It is structured.',
        explanation: 'A structured approach ensures that actions are predictable, repeatable, and scalable.'
      }
    ]
  };
};

export const getLessonsForChapter = (chapterId: string): Lesson[] => {
  // If it's a dynamic mock lesson, return it
  const match = LESSONS.find(l => l.id === chapterId || l.chapter_id === chapterId);
  if (match) return [match];

  // Try finding in levels items
  for (const lvl of LEVELS) {
    const item = lvl.items.find(i => i.id === chapterId && i.type !== 'comic');
    if (item) {
      return [makeMockLesson(item.id, item.title, item.subtitle || '')];
    }
  }
  return [];
};

// Map levels to class chapters for backward compatibility
export const getChaptersForClass = (classNum: number): any[] => {
  // Translate class queries to Level 1, 2, or 6
  let lvlNum = 1;
  if (classNum === 3) lvlNum = 1;
  else if (classNum === 4) lvlNum = 2;
  else if (classNum === 5) lvlNum = 3;
  else if (classNum === 6) lvlNum = 6;
  else if (classNum === 7) lvlNum = 7;
  else if (classNum === 8) lvlNum = 8;

  const lvl = LEVELS.find(l => l.number === lvlNum) || LEVELS[0];
  return lvl.items.filter(i => i.type === 'mission').map((item, idx) => ({
    id: item.id,
    class_number: classNum,
    title: item.title,
    description: item.subtitle || '',
    icon_name: 'BookOpen',
    order_index: idx + 1
  }));
};

// DATABASE ACCESS LAYER (SUPABASE + LOCAL STORAGE)
const MOCK_PROFILE_KEY = 'tessa_student_profile';
const MOCK_PROGRESS_KEY = 'tessa_student_progress';
const MOCK_CHATS_KEY = 'tessa_student_chats';
const MOCK_USERS_KEY = 'tessa_registered_users';
const MOCK_SESSION_KEY = 'tessa_session';

const getMockData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setMockData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const getSupabaseConfig = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL as string) || 
              (typeof window !== 'undefined' ? localStorage.getItem('tessa_supabase_url') || '' : '');
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 
              (typeof window !== 'undefined' ? localStorage.getItem('tessa_supabase_anon_key') || '' : '');
  return { url, key };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();
export const isSupabaseConfigured = () => supabaseUrl !== '' && supabaseAnonKey !== '';
export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const tessaDb = {
  init: (userId?: string) => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setMockData(MOCK_SESSION_KEY, { email: session.user.email || '', userId: session.user.id });
          tessaDb.syncFromSupabase(session.user.id).catch(err => 
            console.error("Sync error in init:", err)
          );
        }
      });
    }
  },

  syncFromSupabase: async (userId: string): Promise<void> => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (profData) setMockData(MOCK_PROFILE_KEY, profData);

      const { data: progData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userId)
        .maybeSingle();
      if (progData) {
        setMockData(MOCK_PROGRESS_KEY, progData);
      } else {
        // Initialize default progress for this user in Supabase & LocalStorage
        const defaultProg: StudentProgress = {
          student_id: userId,
          completed_lessons: [],
          completed_quizzes: [],
          completed_comics: [],
          completed_challenges: [],
          unlocked_achievements: ['welcome'],
          active_streak: 1
        };
        setMockData(MOCK_PROGRESS_KEY, defaultProg);
        await supabase.from('student_progress').upsert(defaultProg);
      }

      const { data: chatData } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('student_id', userId)
        .order('timestamp', { ascending: true });
      if (chatData && chatData.length > 0) {
        setMockData(MOCK_CHATS_KEY, chatData.map(c => ({
          id: c.id,
          sender: c.sender,
          message: c.message,
          timestamp: c.timestamp
        })));
      }
    } catch (e) {
      console.error("Failed to sync from Supabase:", e);
    }
  },

  registerStudent: async (params: {
    email: string;
    name: string;
    classNum?: number; // Kept for compatibility, ignored in levels
    schoolName: string;
    preferredLanguage: 'english' | 'hinglish';
    avatarId: string;
  }): Promise<{ profile: StudentProfile; error: any }> => {
    const mockId = 'student-' + Math.random().toString(36).substring(2, 9);
    let studentId = mockId;

    let contactNum: string | undefined = undefined;
    if (isSupabaseConfigured() && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        studentId = user.id;
        contactNum = user.user_metadata?.contact_number;
      }
    } else {
      const users = getMockData<any[]>(MOCK_USERS_KEY, []);
      const userMatch = users.find(u => u.email.toLowerCase() === params.email.toLowerCase());
      contactNum = userMatch ? userMatch.contact_number : undefined;
    }

    const newProfile: StudentProfile = {
      id: studentId,
      name: params.name,
      current_level: 1, // Starts at Level 1
      school_name: params.schoolName,
      preferred_language: params.preferredLanguage,
      avatar_id: params.avatarId,
      xp: 50, // Welcome bonus
      streak_days: 1,
      last_active_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      subscription_status: 'free',
      class_number: 3, // Legacy compatibility field
      contact_number: contactNum
    };

    const newProgress: StudentProgress = {
      student_id: studentId,
      completed_lessons: [],
      completed_quizzes: [],
      completed_comics: [],
      completed_challenges: [],
      unlocked_achievements: ['welcome'],
      active_streak: 1
    };

    setMockData(MOCK_PROFILE_KEY, newProfile);
    setMockData(MOCK_PROGRESS_KEY, newProgress);

    const emailKey = params.email.toLowerCase();
    const mockProfiles = getMockData<Record<string, StudentProfile>>('tessa_mock_profiles', {});
    mockProfiles[emailKey] = newProfile;
    setMockData('tessa_mock_profiles', mockProfiles);

    const mockProgress = getMockData<Record<string, StudentProgress>>('tessa_mock_progress', {});
    mockProgress[emailKey] = newProgress;
    setMockData('tessa_mock_progress', mockProgress);

    const defaultChats: ChatMessage[] = [
      {
        id: 'msg_welcome',
        sender: 'tutor',
        message: `Hi ${params.name}! I am TESSA, your AI tutor. I am super excited to help you explore the amazing world of Level 1 (Curious Spark)! How can I help you today?`,
        timestamp: new Date().toISOString()
      }
    ];
    setMockData(MOCK_CHATS_KEY, defaultChats);

    const mockChats = getMockData<Record<string, ChatMessage[]>>('tessa_mock_chats', {});
    mockChats[emailKey] = defaultChats;
    setMockData('tessa_mock_chats', mockChats);

    if (isSupabaseConfigured() && supabase && studentId !== mockId) {
      try {
        await supabase.from('profiles').upsert(newProfile);
        await supabase.from('student_progress').upsert(newProgress);
        await supabase.from('chat_messages').upsert({
          id: defaultChats[0].id,
          student_id: studentId,
          sender: defaultChats[0].sender,
          message: defaultChats[0].message,
          timestamp: defaultChats[0].timestamp
        });
      } catch (e) {
        console.error("Supabase registration sync failed:", e);
      }
    }

    return { profile: newProfile, error: null };
  },

  getProfile: (): StudentProfile => {
    if (typeof window === 'undefined') {
      return {
        id: 'offline',
        name: 'Guest Student',
        current_level: 1,
        school_name: 'Tessa Academy',
        preferred_language: 'english',
        avatar_id: 'avatar_boy',
        xp: 0,
        streak_days: 0,
        last_active_date: null,
        created_at: new Date().toISOString(),
        subscription_status: 'free',
        class_number: 3
      };
    }
    const prof = getMockData<StudentProfile>(MOCK_PROFILE_KEY, {} as StudentProfile);
    const session = tessaDb.auth.getSession();
    if (prof && (prof.id === 'offline' || !prof.id) && session?.userId) {
      prof.id = session.userId;
      setMockData(MOCK_PROFILE_KEY, prof);
    }
    // Backward compatibility patching
    if (prof && !prof.current_level) {
      prof.current_level = 1;
    }
    return prof;
  },

  updateProfile: (updates: Partial<StudentProfile>): StudentProfile => {
    const current = tessaDb.getProfile();
    const updated = { ...current, ...updates };
    setMockData(MOCK_PROFILE_KEY, updated);

    const session = tessaDb.auth.getSession();
    if (session?.email) {
      const emailKey = session.email.toLowerCase();
      const mockProfiles = getMockData<Record<string, StudentProfile>>('tessa_mock_profiles', {});
      mockProfiles[emailKey] = updated;
      setMockData('tessa_mock_profiles', mockProfiles);
    }

    if (isSupabaseConfigured() && supabase && updated.id !== 'offline') {
      supabase.from('profiles').upsert(updated).then(({ error }) => {
        if (error) console.error("Error updating profile in Supabase:", error);
      });
    }

    return updated;
  },

  changeLevel: (levelNum: number): StudentProfile => {
    return tessaDb.updateProfile({ current_level: levelNum });
  },

  changeClass: (classNum: number): StudentProfile => {
    // Legacy support: map class number to level
    let mappedLevel = 1;
    if (classNum === 3) mappedLevel = 1;
    else if (classNum === 4) mappedLevel = 2;
    else if (classNum === 5) mappedLevel = 3;
    else if (classNum === 6) mappedLevel = 6;
    else if (classNum === 7) mappedLevel = 7;
    else if (classNum === 8) mappedLevel = 8;
    return tessaDb.updateProfile({ current_level: mappedLevel, class_number: classNum });
  },

  getProgress: (): StudentProgress => {
    const session = tessaDb.auth.getSession();
    const defaultStudentId = session?.userId || 'demo-student-id';
    const prog = getMockData<StudentProgress>(MOCK_PROGRESS_KEY, {
      student_id: defaultStudentId,
      completed_lessons: [],
      completed_quizzes: [],
      completed_comics: [],
      completed_challenges: [],
      unlocked_achievements: ['welcome'],
      active_streak: 1
    });

    if (prog.student_id === 'demo-student-id' && session?.userId) {
      prog.student_id = session.userId;
      setMockData(MOCK_PROGRESS_KEY, prog);
    }

    // Check missing level arrays
    if (!prog.completed_comics) prog.completed_comics = [];
    if (!prog.completed_challenges) prog.completed_challenges = [];
    return prog;
  },

  completeJourneyItem: (itemId: string, type: 'comic' | 'mission' | 'challenge', xpReward: number): {
    xpEarned: number;
    streakUpdated: boolean;
    unlockedAchievements: Achievement[];
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  } => {
    const profile = tessaDb.getProfile();
    const progress = tessaDb.getProgress();

    let isAlreadyCompleted = false;
    if (type === 'comic') {
      isAlreadyCompleted = (progress.completed_comics || []).includes(itemId);
    } else if (type === 'mission') {
      isAlreadyCompleted = (progress.completed_lessons || []).includes(itemId);
    } else if (type === 'challenge') {
      isAlreadyCompleted = (progress.completed_challenges || []).includes(itemId);
    }

    const xpAward = isAlreadyCompleted ? 0 : xpReward;
    const newXp = profile.xp + xpAward;

    let completed_comics = [...(progress.completed_comics || [])];
    let completed_lessons = [...(progress.completed_lessons || [])];
    let completed_challenges = [...(progress.completed_challenges || [])];

    if (!isAlreadyCompleted) {
      if (type === 'comic') completed_comics.push(itemId);
      else if (type === 'mission') completed_lessons.push(itemId);
      else if (type === 'challenge') completed_challenges.push(itemId);
    }

    // Check daily streak
    let streakUpdated = false;
    let newStreak = profile.streak_days;
    const todayStr = new Date().toISOString().split('T')[0];

    if (profile.last_active_date !== todayStr) {
      if (profile.last_active_date) {
        const lastDate = new Date(profile.last_active_date);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
          streakUpdated = true;
        } else if (diffDays > 1) {
          newStreak = 1;
          streakUpdated = true;
        }
      } else {
        newStreak = 1;
        streakUpdated = true;
      }
    }

    // Check achievements
    const newlyUnlocked: Achievement[] = [];
    ACHIEVEMENTS.forEach(ach => {
      if (progress.unlocked_achievements.includes(ach.id)) return;

      let meetsRequirement = false;
      if (ach.requirement_type === 'lessons') {
        meetsRequirement = completed_lessons.length >= ach.requirement_value;
      } else if (ach.requirement_type === 'quizzes') {
        meetsRequirement = completed_challenges.length >= ach.requirement_value;
      } else if (ach.requirement_type === 'streak') {
        meetsRequirement = newStreak >= ach.requirement_value;
      } else if (ach.requirement_type === 'ai_chats') {
        const chats = tessaDb.getChats();
        const userChatsCount = chats.filter(c => c.sender === 'user').length;
        meetsRequirement = userChatsCount >= ach.requirement_value;
      }

      if (meetsRequirement) {
        newlyUnlocked.push(ach);
      }
    });

    const updatedUnlockedAchievements = [
      ...progress.unlocked_achievements,
      ...newlyUnlocked.map(a => a.id)
    ];

    const achievementXpBonus = newlyUnlocked.reduce((sum, ach) => sum + ach.xp_reward, 0);

    const updatedProgress = {
      ...progress,
      completed_lessons,
      completed_comics,
      completed_challenges,
      unlocked_achievements: updatedUnlockedAchievements,
      active_streak: newStreak
    };

    setMockData(MOCK_PROGRESS_KEY, updatedProgress);

    const session = tessaDb.auth.getSession();
    if (session?.email) {
      const emailKey = session.email.toLowerCase();
      const mockProgress = getMockData<Record<string, StudentProgress>>('tessa_mock_progress', {});
      mockProgress[emailKey] = updatedProgress;
      setMockData('tessa_mock_progress', mockProgress);
    }

    // Strict content-based level up logic
    const oldLevel = profile.current_level || 1;
    let newLevel = oldLevel;

    const currentLevelInfo = LEVELS.find(l => l.number === oldLevel);
    if (currentLevelInfo) {
      const allRequiredCompleted = currentLevelInfo.items.every(item => {
        if (item.type === 'comic') {
          return completed_comics.includes(item.id);
        } else if (item.type === 'mission') {
          return completed_lessons.includes(item.id);
        } else if (item.type === 'challenge') {
          return completed_challenges.includes(item.id);
        }
        return false;
      });

      if (allRequiredCompleted && oldLevel < 10) {
        newLevel = oldLevel + 1;
      }
    }

    const levelUp = newLevel > oldLevel;

    tessaDb.updateProfile({
      xp: newXp + achievementXpBonus,
      streak_days: newStreak,
      last_active_date: todayStr,
      current_level: newLevel
    });

    if (isSupabaseConfigured() && supabase && updatedProgress.student_id !== 'demo-student-id') {
      supabase.from('student_progress').upsert(updatedProgress).then(({ error }) => {
        if (error) console.error("Error updating progress in Supabase:", error);
      });
    }

    return {
      xpEarned: xpAward + achievementXpBonus,
      streakUpdated,
      unlockedAchievements: newlyUnlocked,
      levelUp,
      oldLevel,
      newLevel
    };
  },

  saveProgress: (lessonId: string, isQuiz: boolean = false): {
    xpEarned: number;
    streakUpdated: boolean;
    unlockedAchievements: Achievement[];
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  } => {
    const lesson = LESSONS.find(l => l.id === lessonId);
    const xpReward = lesson ? (isQuiz ? lesson.xp_reward * 1.5 : lesson.xp_reward) : 50;
    const type = lessonId.endsWith('_challenge') ? 'challenge' : 'mission';

    return tessaDb.completeJourneyItem(lessonId, type, xpReward);
  },

  getChats: (): ChatMessage[] => getMockData<ChatMessage[]>(MOCK_CHATS_KEY, []),

  saveChat: (message: string, sender: 'user' | 'tutor'): ChatMessage => {
    const chats = tessaDb.getChats();
    const newChat: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      sender,
      message,
      timestamp: new Date().toISOString()
    };

    const updatedChats = [...chats, newChat];
    setMockData(MOCK_CHATS_KEY, updatedChats);

    const session = tessaDb.auth.getSession();
    if (session?.email) {
      const emailKey = session.email.toLowerCase();
      const mockChats = getMockData<Record<string, ChatMessage[]>>('tessa_mock_chats', {});
      mockChats[emailKey] = updatedChats;
      setMockData('tessa_mock_chats', mockChats);
    }

    if (isSupabaseConfigured() && supabase) {
      const profile = tessaDb.getProfile();
      if (profile && profile.id !== 'offline') {
        supabase.from('chat_messages').insert({
          id: newChat.id,
          student_id: profile.id,
          sender: newChat.sender,
          message: newChat.message,
          timestamp: newChat.timestamp
        }).then(({ error }) => {
          if (error) console.error("Error inserting chat into Supabase:", error);
        });
      }
    }

    if (sender === 'user') {
      const progress = tessaDb.getProgress();
      const userChatsCount = updatedChats.filter(c => c.sender === 'user').length;

      const newlyUnlocked: Achievement[] = [];
      ACHIEVEMENTS.forEach(ach => {
        if (progress.unlocked_achievements.includes(ach.id)) return;
        if (ach.requirement_type === 'ai_chats' && userChatsCount >= ach.requirement_value) {
          newlyUnlocked.push(ach);
        }
      });

      if (newlyUnlocked.length > 0) {
        const updatedProgress = {
          ...progress,
          unlocked_achievements: [...progress.unlocked_achievements, ...newlyUnlocked.map(a => a.id)]
        };
        setMockData(MOCK_PROGRESS_KEY, updatedProgress);

        const session = tessaDb.auth.getSession();
        if (session?.email) {
          const emailKey = session.email.toLowerCase();
          const mockProgress = getMockData<Record<string, StudentProgress>>('tessa_mock_progress', {});
          mockProgress[emailKey] = updatedProgress;
          setMockData('tessa_mock_progress', mockProgress);
        }

        const profile = tessaDb.getProfile();
        const achievementXpBonus = newlyUnlocked.reduce((sum, ach) => sum + ach.xp_reward, 0);
        tessaDb.updateProfile({ xp: profile.xp + achievementXpBonus });
      }
    }

    return newChat;
  },

  clearChat: (): void => {
    const profile = tessaDb.getProfile();
    const defaultChats: ChatMessage[] = [
      {
        id: 'msg_welcome',
        sender: 'tutor',
        message: `Hi ${profile.name}! Chat history cleared. Ask me any question about Computational Thinking or Artificial Intelligence, and let's explore together!`,
        timestamp: new Date().toISOString()
      }
    ];
    setMockData(MOCK_CHATS_KEY, defaultChats);

    const session = tessaDb.auth.getSession();
    if (session?.email) {
      const emailKey = session.email.toLowerCase();
      const mockChats = getMockData<Record<string, ChatMessage[]>>('tessa_mock_chats', {});
      mockChats[emailKey] = defaultChats;
      setMockData('tessa_mock_chats', mockChats);
    }

    if (isSupabaseConfigured() && supabase && profile.id !== 'offline') {
      supabase.from('chat_messages').delete().eq('student_id', profile.id).then(({ error }) => {
        if (!error) {
          supabase.from('chat_messages').insert({
            id: defaultChats[0].id,
            student_id: profile.id,
            sender: defaultChats[0].sender,
            message: defaultChats[0].message,
            timestamp: defaultChats[0].timestamp
          });
        }
      });
    }
  },

  auth: {
    signUp: async (email: string, password: string, contactNumber?: string): Promise<{ error: string | null }> => {
      if (isSupabaseConfigured() && supabase) {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              contact_number: contactNumber
            }
          }
        });
        if (!error && data?.user) {
          setMockData(MOCK_SESSION_KEY, { email, userId: data.user.id });
        }
        return { error: error?.message || null };
      }
      const users: any[] = getMockData<any[]>(MOCK_USERS_KEY, []);
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: 'An account with this email already exists.' };
      }
      users.push({ email: email.toLowerCase(), password, contact_number: contactNumber });
      setMockData(MOCK_USERS_KEY, users);
      setMockData(MOCK_SESSION_KEY, { email: email.toLowerCase() });

      // Clean active mock keys for the new user session
      localStorage.removeItem(MOCK_PROFILE_KEY);
      localStorage.removeItem(MOCK_PROGRESS_KEY);
      localStorage.removeItem(MOCK_CHATS_KEY);

      return { error: null };
    },

    signIn: async (email: string, password: string): Promise<{ error: string | null }> => {
      if (isSupabaseConfigured() && supabase) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        setMockData(MOCK_SESSION_KEY, { email, userId: data?.user?.id });
        if (data?.user) await tessaDb.syncFromSupabase(data.user.id);
        return { error: null };
      }
      const users: any[] = getMockData<any[]>(MOCK_USERS_KEY, []);
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!match) return { error: 'Incorrect email or password.' };
      setMockData(MOCK_SESSION_KEY, { email: email.toLowerCase() });

      // Load specific profile, progress, and chats if they exist
      const emailKey = email.toLowerCase();
      const mockProfiles = getMockData<Record<string, StudentProfile>>('tessa_mock_profiles', {});
      const mockProgress = getMockData<Record<string, StudentProgress>>('tessa_mock_progress', {});
      const mockChats = getMockData<Record<string, ChatMessage[]>>('tessa_mock_chats', {});

      if (mockProfiles[emailKey]) {
        setMockData(MOCK_PROFILE_KEY, mockProfiles[emailKey]);
      } else {
        localStorage.removeItem(MOCK_PROFILE_KEY);
      }

      if (mockProgress[emailKey]) {
        setMockData(MOCK_PROGRESS_KEY, mockProgress[emailKey]);
      } else {
        localStorage.removeItem(MOCK_PROGRESS_KEY);
      }

      if (mockChats[emailKey]) {
        setMockData(MOCK_CHATS_KEY, mockChats[emailKey]);
      } else {
        localStorage.removeItem(MOCK_CHATS_KEY);
      }

      return { error: null };
    },

    signOut: (): void => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(MOCK_SESSION_KEY);
      localStorage.removeItem(MOCK_PROFILE_KEY);
      localStorage.removeItem(MOCK_PROGRESS_KEY);
      localStorage.removeItem(MOCK_CHATS_KEY);
      if (isSupabaseConfigured() && supabase) {
        supabase.auth.signOut();
      }
    },

    getSession: (): { email: string; userId?: string } | null => getMockData<{ email: string; userId?: string } | null>(MOCK_SESSION_KEY, null),

    hasProfile: (): boolean => {
      if (typeof window === 'undefined') return false;
      const raw = localStorage.getItem(MOCK_PROFILE_KEY);
      if (!raw) return false;
      try {
        const p = JSON.parse(raw);
        return !!(p && p.name);
      } catch {
        return false;
      }
    }
  }
};
