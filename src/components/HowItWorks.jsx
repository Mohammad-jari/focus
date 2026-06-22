import React from 'react';

const HowItWorks = () => {
  return (
    <section className="how-section" id="how">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-kicker" style={{ justifyContent: 'center' }}>How It Works</div>
          <div className="section-title" style={{ textAlign: 'center' }}>Learning that <em>actually sticks</em></div>
          <p className="section-desc" style={{ margin: '0 auto 48px', textAlign: 'center' }}>
            TESSA uses Bloom's Taxonomy to push every student from remembering facts to genuinely understanding them — one level at a time.
          </p>
        </div>

        <div className="how-grid reveal">
          <div className="how-card s1">
            <div className="how-num">1</div>
            <span className="how-icon">🤔</span>
            <div className="how-title">TESSA asks first</div>
            <p className="how-desc">Before explaining anything, TESSA asks a probe question from your daily life. Your brain prepares to learn.</p>
          </div>

          <div className="how-card s2">
            <div className="how-num">2</div>
            <span className="how-icon">💡</span>
            <div className="how-title">Concept unlocks</div>
            <p className="how-desc">The explanation is anchored to YOUR answer — not a generic textbook definition. It sticks because it's personal.</p>
          </div>

          <div className="how-card s3">
            <div className="how-num">3</div>
            <span className="how-icon">⚡</span>
            <div className="how-title">Apply and analyze</div>
            <p className="how-desc">Three questions at escalating Bloom levels push you from understanding to applying to analyzing. No skipping.</p>
          </div>

          <div className="how-card s4">
            <div className="how-num">4</div>
            <span className="how-icon">🏆</span>
            <div className="how-title">Teach it back</div>
            <p className="how-desc">Explain the concept to an imaginary younger student. You cannot fake this. Real understanding only.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
