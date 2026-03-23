import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatsCard from './components/StatsCard';
import DataTable from './components/DataTable';
import CleaningControls from './components/CleaningControls';
import Visualization from './components/Visualization';
import Footer from './components/Footer';
import api from './services/api';
import './App.css';

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [datasetName, setDatasetName] = useState('');
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ rows: 0, columns: 0, missing: 0, duplicates: 0 });
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [cleanStrategy, setCleanStrategy] = useState('ai');
  const [aiMessage, setAiMessage] = useState('');

  const handleFileSelect = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setMessage('📤 Uploading...');
    setMessageType('info');
    setDatasetName(file.name);
    
    try {
      const res = await api.post('/upload', formData);
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
      setShowLanding(false);
      setMessage('✅ Uploaded!');
      setMessageType('success');
      generateSuggestion(res.data.summary);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestion = (summary) => {
    if (summary.missing_values === 0 && summary.duplicates === 0) {
      setAiMessage('✨ Clean dataset!');
      return;
    }
    const missingPercent = (summary.missing_values / (summary.rows * summary.columns)) * 100;
    let suggestion = '';
    if (missingPercent > 40) suggestion = '⚠️ High missing data.';
    else if (missingPercent > 10) suggestion = '💡 Moderate missing data.';
    else if (missingPercent > 0) suggestion = '✓ Low missing data.';
    setAiMessage(suggestion);
  };

  const handleAction = async (actionType) => {
    setLoading(true);
    try {
      const res = await api.post('/action', { action: actionType, strategy: cleanStrategy });
      setScore(res.data.new_score);
      setTableData(res.data.preview);
      setMessage(`✅ ${res.data.message}`);
      setAiMessage(res.data.message);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => window.open('/api/download', '_blank');
  const handleReset = () => {
    setIsUploaded(false);
    setShowLanding(true);
    setDatasetName('');
  };
  const handleGetStarted = () => setShowLanding(false);

  return (
    <div className="App">
      <Header datasetName={datasetName} onReset={handleReset} onDownload={handleDownload} showActions={isUploaded} />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">🤖 Processing...</div>
          </div>
        </div>
      )}

      {showLanding && !isUploaded ? (
        <div className="landing-page">
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-badge"><span>✨</span> AI-Powered Data Cleaning</div>
              <h1 className="hero-title">Transform Messy Data Into<span className="gradient-text"> Crystal Clear Insights</span></h1>
              <p className="hero-subtitle">Professional data cleaning platform powered by advanced AI. Clean, validate, and optimize your datasets in seconds.</p>
              <div className="hero-actions">
                <button className="btn btn-hero-primary" onClick={handleGetStarted}>Get Started Free <span>→</span></button>
                <button className="btn btn-hero-secondary">Watch Demo <span>▶</span></button>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><div className="stat-number">2M+</div><div className="stat-label">Datasets Cleaned</div></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><div className="stat-number">99.9%</div><div className="stat-label">Accuracy</div></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><div className="stat-number">10x</div><div className="stat-label">Faster</div></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="visual-card"><div className="card-icon">📊</div><div className="card-metric">95%</div><div className="card-label">Quality</div></div>
              <div className="visual-card"><div className="card-icon">🤖</div><div className="card-status">Active</div><div className="card-label">AI Engine</div></div>
              <div className="visual-card"><div className="card-icon">⚡</div><div className="card-metric">2.4s</div><div className="card-label">Processing</div></div>
            </div>
          </section>

          <section className="features-section">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need to clean and optimize your data</p>
            <div className="features-grid">
              <div className="feature-card"><div className="feature-icon">🤖</div><h3>AI-Powered</h3><p>Advanced algorithms for intelligent data cleaning</p></div>
              <div className="feature-card"><div className="feature-icon">⚡</div><h3>Lightning Fast</h3><p>Process up to 200MB in seconds</p></div>
              <div className="feature-card"><div className="feature-icon">📊</div><h3>Quality Scoring</h3><p>Real-time assessment and metrics</p></div>
              <div className="feature-card"><div className="feature-icon">🔍</div><h3>Outlier Detection</h3><p>Automatic statistical outlier removal</p></div>
              <div className="feature-card"><div className="feature-icon">📈</div><h3>Visual Analytics</h3><p>Interactive charts and insights</p></div>
              <div className="feature-card"><div className="feature-icon">🔒</div><h3>Secure</h3><p>Enterprise-grade security</p></div>
            </div>
          </section>

          <section className="cta-section">
            <h2 className="cta-title">Ready to Transform Your Data?</h2>
            <p className="cta-subtitle">Join thousands of data professionals</p>
            <button className="btn btn-cta" onClick={handleGetStarted}>Start Now <span>→</span></button>
          </section>
        </div>
      ) : !isUploaded ? (
        <div className="upload-page">
          <div className="upload-header"><h1>Upload Your Dataset</h1><p>Get instant AI-powered analysis</p></div>
          <FileUpload onFileSelect={handleFileSelect} loading={loading} />
          {message && <div className={`message-banner message-${messageType}`}>{message}</div>}
        </div>
      ) : (
        <div className="dashboard-layout">
          <aside><StatsCard score={score} stats={stats} /></aside>
          <main className="main-content">
            {message && <div className={`message-banner message-${messageType}`}>{message}</div>}
            <DataTable data={tableData} />
            <CleaningControls strategy={cleanStrategy} setStrategy={setCleanStrategy} onAction={handleAction} loading={loading} aiMessage={aiMessage} />
          </main>
          <aside><Visualization data={chartData} /></aside>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
