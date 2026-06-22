import React from 'react';

const MissionVision = () => {
  return (
    <section className="mvv-band" id="about">
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
          <div className="section-kicker" style={{ justifyContent: 'center' }}>
            <span style={{ width: '24px', height: '2px', background: 'var(--cyan)', display: 'inline-block' }}></span>
            Our Purpose
          </div>
          <div className="section-title" style={{ textAlign: 'center' }}>Why we built <em>TESSA</em></div>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            India has been a technology consumer for too long. The shift from user to creator starts in school. TESSA is where that shift begins.
          </p>
        </div>

        <div className="mvv-grid reveal">
          <div className="mvv-item">
            <div className="mvv-icon mission">🎯</div>
            <div className="mvv-label">Mission</div>
            <p className="mvv-text">
              To raise India's first generation of AI creators by building the one thing most EdTech destroys —
              <strong>the ability to think.</strong>
            </p>
          </div>

          <div className="mvv-divider"></div>

          <div className="mvv-item">
            <div className="mvv-icon vision">🔭</div>
            <div className="mvv-label">Vision</div>
            <p className="mvv-text">
              A future where every Indian child <strong>thinks with AI, builds with AI, and leads with AI</strong> —
              in a world that still knows the difference between a mind and a machine.
            </p>
          </div>

          <div className="mvv-divider"></div>

          <div className="mvv-item">
            <div className="mvv-icon motto">⚡</div>
            <div className="mvv-label">Motto</div>
            <div className="mvv-motto-text">From user<br/>to creator.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
