import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">🔨 DataForge</h3>
          <p className="footer-description">
            Professional AI-powered data cleaning and quality analysis platform.
            Transform your messy data into actionable insights.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
            <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
            <a href="#" className="social-link" aria-label="GitHub">💻</a>
            <a href="#" className="social-link" aria-label="Email">📧</a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Product</h4>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#documentation">Documentation</a></li>
            <li><a href="#changelog">Changelog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Company</h4>
          <ul className="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#compliance">Compliance</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2025 DataForge. All rights reserved.
        </p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy</a>
          <span className="separator">•</span>
          <a href="#terms">Terms</a>
          <span className="separator">•</span>
          <a href="#cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
