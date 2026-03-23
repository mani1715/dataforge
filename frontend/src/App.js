import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatsCard from './components/StatsCard';
import DataTable from './components/DataTable';
import CleaningControls from './components/CleaningControls';
import Visualization from './components/Visualization';
import api from './services/api';
import './App.css';

function App() {
  // State Management
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  const [datasetName, setDatasetName] = useState('');
  
  // Data State
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ 
    rows: 0, 
    columns: 0, 
    missing: 0, 
    duplicates: 0 
  });
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  
  // Cleaning State
  const [cleanStrategy, setCleanStrategy] = useState('ai');
  const [aiMessage, setAiMessage] = useState('');

  // Handle File Upload
  const handleFileSelect = async (file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setMessage('📤 Uploading and analyzing your dataset...');
    setMessageType('info');
    setDatasetName(file.name);
    
    try {
      const res = await api.post('/upload', formData);
      
      // Update all state
      setScore(res.data.quality_score);
      setStats({
        rows: res.data.summary.rows,
        columns: res.data.summary.columns,
        missing: res.data.summary.missing_values,
        duplicates: res.data.summary.duplicates || 0
      });
      setTableData(res.data.preview);
      setChartData(res.data.chart_data);
      setIsUploaded(true);
      
      setMessage('✅ Dataset uploaded successfully!');
      setMessageType('success');
      
      // Generate AI suggestion
      generateSuggestion(res.data.summary);
      
    } catch (err) {
      console.error('Upload error:', err);
      setMessage(`❌ Error uploading file: ${err.response?.data?.error || err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Generate AI Suggestions
  const generateSuggestion = (summary) => {
    if (summary.missing_values === 0 && summary.duplicates === 0) {
      setAiMessage('✨ Your dataset is clean! No missing values or duplicates detected.');
      return;
    }
    
    const missingPercent = (summary.missing_values / (summary.rows * summary.columns)) * 100;
    
    let suggestion = '';
    if (missingPercent > 40) {
      suggestion = '⚠️ High missing data detected (>40%). Recommendation: Use "Drop Rows" or "Fill with 0" strategy.';
    } else if (missingPercent > 10) {
      suggestion = '💡 Moderate missing data (10-40%). Recommendation: Use "Median" or "AI Prediction" for best results.';
    } else if (missingPercent > 0) {
      suggestion = '✓ Low missing data (<10%). Recommendation: "Mean" or "Mode" strategies are safe choices.';
    }
    
    if (summary.duplicates > 0) {
      suggestion += ` Found ${summary.duplicates} duplicate rows - consider removing them.`;
    }
    
    setAiMessage(suggestion);
  };

  // Handle Cleaning Actions
  const handleAction = async (actionType) => {
    setLoading(true);
    setMessage('⏳ Processing your request...');
    setMessageType('info');
    
    try {
      const res = await api.post('/action', { 
        action: actionType, 
        strategy: cleanStrategy,
        fill_value: cleanStrategy === 'constant' ? 0 : null 
      });
      
      // Update state with cleaned data
      setScore(res.data.new_score);
      setTableData(res.data.preview);
      setMessage(`✅ ${res.data.message}`);
      setMessageType('success');
      setAiMessage(res.data.message);
      
      // Update stats (missing values should decrease)
      const newMissing = res.data.preview.reduce((count, row) => {
        return count + Object.values(row).filter(val => val === null || val === 'NaN').length;
      }, 0);
      
      setStats(prev => ({ ...prev, missing: newMissing }));
      
    } catch (err) {
      console.error('Action error:', err);
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Download
  const handleDownload = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
    window.open(`${backendUrl.replace('/api', '')}/api/download`, '_blank');
  };

  // Handle Reset
  const handleReset = () => {
    // Reset all state
    setIsUploaded(false);
    setDatasetName('');
    setScore(0);
    setStats({ rows: 0, columns: 0, missing: 0, duplicates: 0 });
    setTableData([]);
    setChartData(null);
    setMessage('');
    setAiMessage('');
    setCleanStrategy('ai');
  };

  return (
    <div className="App">
      {/* Header */}
      <Header 
        datasetName={datasetName}
        onReset={handleReset}
        onDownload={handleDownload}
        showActions={isUploaded}
      />
      
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner" data-testid="loading-spinner"></div>
            <div className="loading-text">🤖 AI Processing...</div>
          </div>
        </div>
      )}

      {/* Upload Page */}
      {!isUploaded ? (
        <div className="upload-page" data-testid="upload-page">
          <div className="upload-header">
            <h1>Shape Your Data Into Clarity</h1>
            <p>Automated, AI-powered data cleaning and profiling</p>
          </div>
          
          <FileUpload onFileSelect={handleFileSelect} loading={loading} />
          
          {message && (
            <div 
              className={`message-banner message-${messageType}`} 
              style={{ marginTop: '24px', maxWidth: '600px' }}
              data-testid="upload-message"
            >
              {message}
            </div>
          )}
        </div>
      ) : (
        /* Dashboard Layout */
        <div className="dashboard-layout" data-testid="dashboard-page">
          {/* LEFT PANEL: Stats */}
          <aside>
            <StatsCard score={score} stats={stats} />
          </aside>

          {/* CENTER PANEL: Data Table + Controls */}
          <main className="main-content">
            {message && (
              <div className={`message-banner message-${messageType}`} data-testid="dashboard-message">
                {message}
              </div>
            )}
            
            <DataTable data={tableData} />
            
            <CleaningControls 
              strategy={cleanStrategy}
              setStrategy={setCleanStrategy}
              onAction={handleAction}
              loading={loading}
              aiMessage={aiMessage}
            />
          </main>

          {/* RIGHT PANEL: Visualization */}
          <aside>
            <Visualization data={chartData} />
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
