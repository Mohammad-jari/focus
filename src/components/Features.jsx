import React from 'react';

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="section-inner">
        <div className="features-header reveal">
          <div className="section-kicker">What Makes TESSA Different</div>
          <div className="section-title">Built on learning science,<br/>not just <em>technology.</em></div>
          <p className="section-desc" style={{ margin: '0 auto 48px' }}>
            Every feature maps to a specific cognitive science finding — Bloom, Dweck, Roediger, Ebbinghaus, Bandura. Nothing is decorative.
          </p>
        </div>

        <div className="features-grid reveal">
          <div className="feat-card feat-blue">
            <div className="feat-glow"></div>
            <span className="feat-emoji">🧠</span>
            <div className="feat-title">Socratic Mode</div>
            <p className="feat-desc">TESSA never gives an answer before the student attempts. Every session starts with a probe question that activates prior knowledge and prepares the brain to learn.</p>
            <span className="feat-badge">Metacognition</span>
          </div>

          <div className="feat-card feat-purple">
            <div className="feat-glow"></div>
            <span className="feat-emoji">📈</span>
            <div className="feat-title">Bloom Level Tracking</div>
            <p className="feat-desc">Every question is tagged Level 1–6. TESSA tracks where each student is stuck — not just whether they got it right, but how deeply they understand it.</p>
            <span className="feat-badge">Bloom's Taxonomy</span>
          </div>

          <div className="feat-card feat-green">
            <div className="feat-glow"></div>
            <span className="feat-emoji">🎮</span>
            <div className="feat-title">Gamified Missions</div>
            <p className="feat-desc">XP, levels, streaks, badges, and a mission-based learning path. Students earn real rewards for genuine understanding — not just clicking through content.</p>
            <span className="feat-badge">Engagement</span>
          </div>

          <div className="feat-card feat-yellow">
            <div className="feat-glow"></div>
            <span className="feat-emoji">🌐</span>
            <div className="feat-title">Hindi + English</div>
            <p className="feat-desc">TESSA detects your language automatically. Respond in Hindi, Hinglish, or English — TESSA switches with you. No language barrier, ever.</p>
            <span className="feat-badge">Accessibility</span>
          </div>

          <div className="feat-card feat-blue">
            <div className="feat-glow"></div>
            <span className="feat-emoji">📋</span>
            <div className="feat-title">Teacher Reports</div>
            <p className="feat-desc">Every evening at 6 PM, the teacher receives an auto-generated class report: which concept most students struggled with and one 5-minute classroom activity to fix it tomorrow.</p>
            <span className="feat-badge">For Teachers</span>
          </div>

          <div className="feat-card feat-orange">
            <div className="feat-glow"></div>
            <span className="feat-emoji">🔒</span>
            <div className="feat-title">Safe for Children</div>
            <p className="feat-desc">Curriculum-specific only. Off-topic requests are redirected. Wellbeing alerts go to the teacher immediately. Every conversation is transparent to the school.</p>
            <span className="feat-badge">Child Safety</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
