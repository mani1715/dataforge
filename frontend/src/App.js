import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatsCard from './components/StatsCard';
import DataTable from './components/DataTable';
import Visualization from './components/Visualization';
import api from './services/api';
import './App.css';

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ rows: 0, columns: 0, missing: 0 });
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [cleanStrategy, setCleanStrategy] = useState('ai');
  const [suggestion, setSuggestion] = useState('');

  const handleFileSelect = (file) => handleUpload(file);

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setMessage('Uploading...');
    
    try {
      const res = await api.post('/upload', formData);
      setScore(res.data.quality_score);
      setStats({
        rows: res.data.summary.rows,
        columns: res.data.summary.columns,
        missing: res.data.summary.missing_values
      });
      setTableData(res.data.preview);
      setChartData(res.data.chart_data);
      setIsUploaded(true);
      setMessage('✅ Data uploaded successfully.');
      generateSuggestion(res.data.summary);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestion = (stats) => {
    if (stats.missing_values === 0) {
      setSuggestion('No missing values found. Data is clean!');
      return;
    }
    const missingPercent = (stats.missing_values / (stats.rows * stats.columns)) * 100;
    if (missingPercent > 40) {
      setSuggestion('High missing data detected. Recommendation: Drop Rows or Fill with 0.');
    } else if (missingPercent > 10) {
      setSuggestion('Moderate missing data. Recommendation: Use Median or AI Prediction.');
    } else {
      setSuggestion('Low missing data. Recommendation: Mean or Mode is safe.');
    }
  };

  const handleAction = async (actionType) => {
    setLoading(true);
    setMessage('⏳ Processing...');
    try {
      const res = await api.post('/action', { 
        action: actionType, 
        strategy: cleanStrategy, 
        fill_value: cleanStrategy === 'constant' ? 0 : null 
      });
      setScore(res.data.new_score);
      setTableData(res.data.preview);
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error performing action.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('http://localhost:5000/api/download', '_blank');
  };

  return (
    <div className='App'>
      <Header />
      
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
            <div className="spinner"></div> {/* We will add CSS for this */}
            <p>AI Processing...</p>
          </div>
        </div>
      )}

      {!isUploaded ? (
        <div className='hero-container'>
          <h1 className='hero-title'>Shape Your Data Into Clarity</h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>Automated, AI-powered data cleaning.</p>
          <FileUpload onFileSelect={handleFileSelect} />
          {loading && <p style={{color: 'white'}}>{message}</p>}
        </div>
      ) : (
        <div className='dashboard-layout'>
          <div className='sidebar'>
            <StatsCard score={score} stats={stats} />
            <div className='card'>
              <h3 style={{ marginTop: '0' }}>⚙️ Cleaning Tools</h3>
              
              {/* Numeric Cleaning */}
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', display:'block' }}>
                Numeric Strategy:
              </label>
              <select value={cleanStrategy} onChange={(e) => setCleanStrategy(e.target.value)} className='select-dropdown'>
                <option value='ai'>🤖 AI Prediction</option>
                <option value='mean'>📊 Mean</option>
                <option value='median'>📈 Median</option>
                <option value='mode'>🔢 Mode</option>
                <option value='constant'>➕ Fill with 0</option>
                <option value='drop_rows'>❌ Drop Rows</option>
              </select>

              <button className='btn-primary' style={{width:'100%', marginTop:'10px'}} onClick={() => handleAction('fill_missing')} disabled={loading}>
                🛠️ Clean Numeric Data
              </button>

              {/* Text Cleaning - NEW */}
              <button className='btn-action' style={{width:'100%', marginTop:'10px', background:'#EEF2FF', color:'#4F46E5', border:'1px solid #4F46E5'}} onClick={() => handleAction('clean_text')} disabled={loading}>
                🔤 Clean Text Data (Fill "Unknown")
              </button>

              <div style={{ background: '#EEF2FF', padding: '10px', borderRadius: '8px', margin: '15px 0', fontSize: '12px', color: '#4F46E5' }}>
                <strong>💡 Tip:</strong> {suggestion}
              </div>

              <button className='btn-action' style={{width:'100%', marginTop:'10px'}} onClick={() => handleAction('remove_duplicates')} disabled={loading}>
                🗑️ Remove Duplicates
              </button>
              <button className='btn-action' style={{width:'100%', marginTop:'10px'}} onClick={() => handleAction('remove_outliers')} disabled={loading}>
                📉 Remove Outliers
              </button>
              
              <hr style={{margin: '20px 0', border: '1px solid var(--border-color)'}}/>
              
              <button className='btn-primary' style={{width:'100%', background:'var(--status-success)'}} onClick={handleDownload}>
                ⬇️ Download Clean Data
              </button>
            </div>
          </div>
          <div className='main-content'>
            {message && (
                <div className='card' style={{padding:'10px', marginBottom:'10px', background:'#EEF2FF', color:'#4F46E5', fontSize: '14px'}}>
                    {message}
                </div>
            )}
            
            <Visualization data={chartData} />

            <DataTable data={tableData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;