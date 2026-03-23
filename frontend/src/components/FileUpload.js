import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect }) => {
  // Create a reference to the hidden file input
  const inputRef = useRef(null);

  // Function to trigger the file input click
  const handleClick = () => {
    inputRef.current.click();
  };

  // Function to handle when a file is selected
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-zone">
      <h3>Drag & Drop Files Here</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Supports CSV, Excel</p>
      
      {/* The Hidden Input */}
      <input 
        type="file" 
        ref={inputRef} 
        style={{ display: 'none' }} 
        onChange={handleChange} 
        accept=".csv, .xlsx"
      />

      {/* The Visible Button */}
      <button 
        className="btn-primary" 
        style={{ marginTop: '20px' }} 
        onClick={handleClick}
      >
        Select File
      </button>
    </div>
  );
};

export default FileUpload;