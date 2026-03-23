import React from 'react';

const Header = ({ datasetName, onReset, onDownload, showActions }) => {
  return (
    <header className="header">
      <div className="logo" data-testid="app-logo">
        <span className="logo-icon">🔨</span>
        <span>DataForge</span>
      </div>
      
      {showActions && (
        <div className="header-actions">
          {datasetName && (
            <span className="dataset-name" data-testid="dataset-name">
              📄 {datasetName}
            </span>
          )}
          
          <button 
            className="btn btn-success"
            onClick={onDownload}
            data-testid="download-button"
          >
            ⬇️ Download Clean Data
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={onReset}
            data-testid="reset-button"
          >
            🔄 Reset Dataset
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
