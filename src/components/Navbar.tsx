import React, { useState } from 'react';
import './CSS/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="/" className="logo-text">
            User Management System
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-icon">
          <button onClick={toggleMenu} className="menu-toggle-btn">
            {isOpen ? (
              // Close icon (X)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
                <path d="M19.14 4.86L16.28 7.72 12 3.44 7.72 7.72 4.86 4.86 3.44 7.28 7.72 12 3.44 16.28 4.86 19.14 7.72 16.28 12 19.56 16.28 16.28 19.14 19.14 16.28 19.14z"/>
              </svg>
            ) : (
              // Hamburger icon (bars)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="mobile-nav">
          <a href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Home</a>
          <a href="/about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>About</a>
          <a href="/contact" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
