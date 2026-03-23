import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-simple">
        <div className="footer-brand">
          <h3 className="footer-logo">🔨 DataForge</h3>
          <p className="footer-tagline">
            Transform messy data into crystal clear insights
          </p>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 DataForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
