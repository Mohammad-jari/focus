import React from 'react';
import brainSvg from '../assets/new_brain_nobg.png';
import './BrainSVG.css';

const BrainSVG = () => {
  return (
    <div className="brain-parallax-container">
      <img src={brainSvg} alt="Neon AI Brain" className="brain-svg-anim" />
    </div>
  );
};

export default BrainSVG;
