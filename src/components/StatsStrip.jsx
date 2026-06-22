import React from 'react';

const StatsStrip = () => {
  return (
    <section className="stats-strip-section reveal">
      <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <div className="hero-badge" style={{ marginBottom: '24px' }}>
          <span className="dot"></span>
          Official CT & AI Curriculum 2026-27
        </div>

        <div className="hero-belief" style={{ marginBottom: '48px' }}>
          "AI should make children sharper. Not more dependent."
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">Classes<br/><span>3–8</span></div>
            <div className="hero-stat-label">Standard Aligned<br/>Curriculum</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">6</div>
            <div className="hero-stat-label">CT Pillars<br/>Covered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">2σ</div>
            <div className="hero-stat-label">Bloom's Tutoring<br/>Effect</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">₹0</div>
            <div className="hero-stat-label">To Start<br/>Today</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
