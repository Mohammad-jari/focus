import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isMobileMenuOpen, toggleMenu }) => {
  return (
    <>
      <nav className="navbar">
        <a className="nav-logo" href="#">
          <div className="nav-logo-text">
            <span className="tessa">TESSA</span><span className="focus">Focus</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#curriculum">Curriculum</a></li>
          <li><a href="#about">About</a></li>
        </ul>

        <div className="nav-right">
          <Link className="btn-ghost" to="/login">Login</Link>
          <Link className="btn-cta" to="/login">Sign Up →</Link>

          <button
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
