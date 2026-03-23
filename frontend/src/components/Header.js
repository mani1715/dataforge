import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">DATAFORGE</div>
      <nav>
        <span style={{ marginLeft: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          About
        </span>
      </nav>
    </header>
  );
};

export default Header;