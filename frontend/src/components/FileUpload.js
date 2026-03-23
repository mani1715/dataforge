import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect, loading }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-zone" onClick={handleClick} data-testid="upload-zone">
      <div className="upload-icon">📊</div>
      <h3>Drag & Drop Your Dataset</h3>
      <p>Supports CSV and Excel files (up to 16MB)</p>
      
      <input 
        type="file" 
        ref={inputRef} 
        style={{ display: 'none' }} 
        onChange={handleChange} 
        accept=".csv, .xlsx"
        data-testid="file-input"
      />

      <button 
        className="btn btn-primary" 
        disabled={loading}
        data-testid="upload-button"
      >
        {loading ? '⏳ Uploading...' : '📁 Select File'}
      </button>
    </div>
  );
};

export default FileUpload;
