import React from 'react';
import { Link } from 'react-router-dom';
import BrainSVG from './BrainSVG';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-glow"></div>

      {/* Floating ambient cards */}
      <div className="floating-cards">
        <div className="float-card c1">🏆 XP & Levels</div>
        <div className="float-card c2">🔥 Daily Streaks</div>
        <div className="float-card c3 flex items-center gap-1.5">
          <img src="/icons.svg" className="w-4.5 h-4.5 object-contain inline-block" alt="robot" />
          <span>TESSA AI Buddy</span>
        </div>
        <div className="float-card c4">🌐 Hindi + English</div>
        <div className="float-card c5">🎯 Daily Missions</div>
        <div className="float-card c6">📊 Teacher Reports</div>
      </div>

      <BrainSVG />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '40px' }}>


        <h1 className="hero-title">
          <span className="line1">The AI that makes</span>
          <span className="line2">you think — not <br /> think for you.</span>
        </h1>

        <p className="hero-subtitle">
          TESSA is your personal <strong>AI Thinking Buddy</strong> — built for Indian students. Not a homework shortcut. A brain-builder that makes you sharper, smarter, and ready for the world.
        </p>



        <div className="hero-ctas">
          <Link
            to="/login"
            className="btn-hero-primary"
          >
            🚀 Try It Now
          </Link>
          <a href="http://minab168.teachstant.online/" className="btn-hero-secondary" target="_blank" rel="noopener noreferrer">
            Minab 168 scholarship
          </a>
        </div>
      </div>

    </section>
  );
};

export default Hero;
