import React, { useState } from 'react';
import './Curriculum.css';

/* ── Inline skill-tag style helper (dark-theme translucent) ── */
const skillTag = (color, alpha = 0.18) => ({
  background: color.replace(')', `, ${alpha})`).replace('rgb(', 'rgba(').replace(/^#([0-9a-f]{6})$/i, (_, h) => {
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }),
  color: color,
  border: `1px solid ${color.replace(')', `, 0.35)`).replace('rgb(', 'rgba(').replace(/^#([0-9a-f]{6})$/i, (_, h) => {
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},0.35)`;
  })}`,
});

/* Level accent colors — bright, readable on dark backgrounds */
const C = {
  l1:  '#5BA8F5',
  l2:  '#5DC95D',
  l3:  '#9D8FE0',
  l4:  '#F0A050',
  l5:  '#3DC9A0',
  l6:  '#F07055',
  l7:  '#E0508A',
  l8:  '#72C44A',
  l9:  '#8A80F0',
  l10: '#00C6FF',
};

const Curriculum = () => {
  const [openPanels, setOpenPanels] = useState({});
  const toggle = (id) => setOpenPanels(prev => ({ ...prev, [id]: !prev[id] }));

  const renderTextWithEmoji = (text) => {
    if (typeof text !== 'string' || !text.includes('🤖')) return text;
    const parts = text.split('🤖');
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <img src="/icons.svg" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle', margin: '0 2px' }} alt="robot" />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  /* Reusable card renderer */
  const LevelCard = ({ id, color, nodeLabel, nodeIcon, levelLabel, skillLabel, title, tagline, desc, outcomes, outcomeTitle, capstone }) => (
    <>
      <div className={`level-row${capstone ? ' capstone' : ''}`} onClick={() => toggle(id)}>
        <div className="level-node" style={{ borderColor: color, color }}>
          <span className="node-num">{nodeLabel}</span>
          <span className="node-icon">
            {nodeIcon === '🤖' ? (
              <img src="/icons.svg" style={{ width: '24px', height: '24px', objectFit: 'contain' }} alt="robot" />
            ) : (
              nodeIcon
            )}
          </span>
        </div>
        <div className={`level-card-body${capstone ? ' capstone-body' : ''}`}>
          {/* Left accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
            background: color, borderRadius: '3px 0 0 3px',
            ...(capstone ? { boxShadow: `0 0 10px ${color}` } : {})
          }} />
          <div className="card-top">
            <span className="class-tag" style={{ color }}>{levelLabel}</span>
            <span className="skill-tag" style={skillTag(color)}>{skillLabel}</span>
          </div>
          <div className="name-student" style={{ color }}>
            {title}
            <span className="sub-tagline">{tagline}</span>
          </div>
          <p className="card-desc">{desc}</p>
        </div>
      </div>

      <div className={`outcomes-panel${openPanels[id] ? ' open' : ''}`}>
        <div className="panel-label">{outcomeTitle}</div>
        <div className="outcomes-grid">
          {outcomes.map((o, i) => (
            <div className="outcome-chip" key={i}>{renderTextWithEmoji(o)}</div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <section className="curriculum-section" id="curriculum">
      <div className="section-inner">

        {/* ── HEADER ── */}
        <div className="curriculum-header reveal">
          <div className="journey-eyebrow">Start Learning From Age 9 · Finish 10 Levels</div>
          <h2 className="journey-title">
            Your <span className="highlight">Learning Journey</span><br />starts here.
          </h2>
          <p className="journey-sub">
            Every level you climb, you think sharper, see further, and build bigger.
            This is not a school timetable — it's a path to becoming a future-ready thinker.
          </p>
        </div>

        {/* ── JOURNEY MAP ── */}
        <div className="journey-wrap reveal">
          <div className="spine" />

          {/* TESSA QUOTE */}
          <div className="tessa-quote">
            <div className="quote-avatar">
              <img src="/icons.svg" style={{ width: '28px', height: '28px', objectFit: 'contain' }} alt="robot" />
            </div>
            <div className="quote-text">
              <strong>Each level is not just a class you pass.</strong> It's a way of thinking you earn.
              By the time you reach Level 10, you won't just use technology — you'll understand it well
              enough to build what comes next. <strong>Let's think about this together!</strong>
            </div>
          </div>

          {/* STATS */}
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
              <div className="stat-num">25<span style={{ fontSize: '1rem' }}>min</span></div>
              <div className="stat-label">Daily · 5 days a week</div>
            </div>
          </div>

          {/* ── PREPARATORY STAGE ── */}
          <div className="section-divider"><span>Preparatory Stage · Levels 1–3</span></div>

          <LevelCard id="p1" color={C.l1}
            nodeLabel="L1" nodeIcon="🔍"
            levelLabel="Level 1" skillLabel="CT Foundations"
            title="Curious Spark" tagline="Code Cadet — you just switched on."
            desc="Your adventure begins. You'll crack secret codes, spot hidden patterns, and write your first step-by-step instructions. TESSA guides every session."
            outcomeTitle="What you'll learn at Level 1"
            outcomes={['🔐 Caesar Cipher & Algorithms','🔄 Pattern Recognition basics','🧩 Decomposition — breaking problems','🗺️ Abstract Thinking — hidden shapes','🤖 Meet TESSA — your AI buddy','📊 Data from everyday life']}
          />

          <LevelCard id="p2" color={C.l2}
            nodeLabel="L2" nodeIcon="👁️"
            levelLabel="Level 2" skillLabel="Pattern Recognition"
            title="Pattern Finder" tagline="Code Cadet — you see what others miss."
            desc="You'll find the rules hiding inside numbers, shapes, and stories. Every problem has a pattern underneath — your job is to find it before anyone else."
            outcomeTitle="What you'll learn at Level 2"
            outcomes={['🔢 Number patterns & sequences','📐 Shape & symmetry patterns','🌿 Patterns in nature & EVS','🔮 Predict & generalise rules','📖 Grammar patterns in language','🎯 Find the exception — anomaly detection']}
          />

          <LevelCard id="p3" color={C.l3}
            nodeLabel="L3" nodeIcon="🏗️"
            levelLabel="Level 3" skillLabel="Algorithmic Thinking"
            title="Logic Architect" tagline="Logic Scout — you build ideas that hold."
            desc="You'll write instructions precise enough for a robot to follow without any mistakes. One wrong step and everything breaks — so every word matters."
            outcomeTitle="What you'll learn at Level 3"
            outcomes={['📋 Write algorithms that actually work','🐛 Debug — find and fix broken steps','🔁 Loops & repetition in instructions','❓ Conditional logic — if this, then that','🧮 Maths as an algorithm system','🗺️ Map reading as algorithmic navigation']}
          />

          {/* ── MIDDLE STAGE ── */}
          <div className="section-divider"><span>Middle Stage · Levels 4–6</span></div>

          <LevelCard id="p4" color={C.l4}
            nodeLabel="L4" nodeIcon="📊"
            levelLabel="Level 4" skillLabel="Data Literacy"
            title="Data Scout" tagline="Data Ranger — numbers tell you stories."
            desc="Data is everywhere — in cricket scores, election results, weather reports, and your school timetable. You'll learn to read data the way detectives read clues."
            outcomeTitle="What you'll learn at Level 4"
            outcomes={['📈 Tables, charts, bar graphs','🔍 Mean, median, mode — real use','⚠️ Spotting outliers & bad data','🤔 Correlation vs. causation','🗄️ How AI learns from data','🌏 Indian data — census, weather, maps']}
          />

          <LevelCard id="p5" color={C.l5}
            nodeLabel="L5" nodeIcon="⚙️"
            levelLabel="Level 5" skillLabel="Applied Algorithms"
            title="Algorithm Crafter" tagline="Algorithm Knight — you write the rules machines follow."
            desc="From sorting algorithms to search strategies — you'll build the engines that power apps, maps, and recommendation systems. No coding required. Just sharp thinking."
            outcomeTitle="What you'll learn at Level 5"
            outcomes={['🔀 Sorting algorithms — how they differ','🔎 Search strategies & efficiency','📦 Optimisation — best vs. good enough','🧪 Scientific method as algorithm','🗺️ How GPS & maps use algorithms','🤖 How recommendation engines work']}
          />

          <LevelCard id="p6" color={C.l6}
            nodeLabel="L6" nodeIcon="🤖"
            levelLabel="Level 6" skillLabel="AI Concepts"
            title="Model Builder" tagline="AI Guardian — you shape how AI learns."
            desc="You'll understand how AI actually works — not magic, just maths and patterns. You'll also discover where AI goes wrong, and why your judgment will always matter more than the machine."
            outcomeTitle="What you'll learn at Level 6"
            outcomes={['🧠 How AI learns from examples','⚖️ AI bias — what it is and why it matters','🔍 Evaluate AI outputs critically','🌐 AI in Indian workplaces today','🛡️ Data privacy — your rights','✅ Responsible AI use in school']}
          />

          {/* ── SECONDARY STAGE ── */}
          <div className="section-divider"><span>Secondary Stage · Levels 7–9</span></div>

          <LevelCard id="p7" color={C.l7}
            nodeLabel="L7" nodeIcon="🌐"
            levelLabel="Level 7" skillLabel="Systems & Networks"
            title="Systems Thinker" tagline="You see the whole, not just the parts."
            desc="How do cities work? How does the internet move data? How do diseases spread? You'll learn to think in systems — and understand why small changes can create big results."
            outcomeTitle="What you'll learn at Level 7"
            outcomes={['🕸️ How networks and systems behave','♻️ Feedback loops — cause and effect chains','💡 Emergent behaviour in complex systems','📡 How the internet actually works','🏙️ Smart cities and infrastructure AI','🌱 Systems thinking in climate & biology']}
          />

          <LevelCard id="p8" color={C.l8}
            nodeLabel="L8" nodeIcon="💬"
            levelLabel="Level 8" skillLabel="Applied AI"
            title="Prompt Engineer" tagline="You speak the language of AI."
            desc="AI is only as smart as the questions you ask it. You'll learn to communicate with AI precisely — and more importantly, know exactly when to trust it and when not to."
            outcomeTitle="What you'll learn at Level 8"
            outcomes={['✍️ Structure prompts that work reliably','🔎 Evaluate AI output for accuracy','📚 AI-assisted research with integrity','🚫 Know when AI is confidently wrong','🏫 AI in board exam preparation','💼 AI tools used in Indian careers today']}
          />

          {/* ── ADVANCED STAGE ── */}
          <div className="section-divider"><span>Advanced Stage · Levels 9 & 10</span></div>

          <LevelCard id="p9" color={C.l9}
            nodeLabel="L9" nodeIcon="🧭"
            levelLabel="Level 9" skillLabel="Ethics & Strategy"
            title="AI Strategist" tagline="You decide where AI goes to work."
            desc="You'll think like a leader: Which problems should AI solve? Which should it never touch? You'll make arguments, weigh tradeoffs, and develop your own informed position on the technology reshaping the world."
            outcomeTitle="What you'll learn at Level 9"
            outcomes={['⚖️ AI ethics frameworks — Indian context','🏥 AI in healthcare: what goes right/wrong','🌾 AgriTech AI and rural India','🏛️ AI in governance — accountability','📝 Build a structured AI policy argument','🎓 Prepare for AI-adjacent entrance exams']}
          />

          <LevelCard id="p10" color={C.l10}
            nodeLabel="L10" nodeIcon="🏛️"
            levelLabel="Level 10 · Capstone" skillLabel="TESSA Elite"
            title="Future Architect" tagline="TESSA Legend — you build what comes next."
            desc="The final level. You'll build a real capstone project — an original proposal for how AI can solve a problem you care about. TESSA doesn't guide this one. You lead it."
            outcomeTitle="What you'll achieve at Level 10"
            outcomes={['🏗️ Design an original AI application','📄 Write a structured project proposal','🔍 Conduct an ethical impact analysis','🎤 Present & defend your work','🎓 University application portfolio piece','🤖 TESSA Legend badge — permanent record']}
            capstone
          />

        </div>{/* end journey-wrap */}
      </div>{/* end section-inner */}
    </section>
  );
};

export default Curriculum;
