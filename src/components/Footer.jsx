import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="clean-footer">
      <div className="footer-content">
        <div className="footer-brand-center">
          <div className="nav-logo-text">
            <span className="tessa">TESSA</span><span className="focus">Focus</span>
          </div>
        </div>

        <ul className="footer-links-center">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><Link to="/login">Login</Link></li>
        </ul>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Teachstant.AI. All rights reserved.</p>
          <div className="footer-contact">contact@teachstant.online</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
