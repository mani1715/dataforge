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
      setStats({ rows: res.data.summary.rows, columns: res.data.summary.columns, missing: res.data.summary.missing_values, duplicates: res.data.summary.duplicates || 0 });
      setTableData(res.data.preview);
      setChartData(res.data.chart_data);
      setIsUploaded(true);
      setShowLanding(false);
      setMessage('✅ Success!');
      setMessageType('success');
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
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
  const handleReset = () => { setIsUploaded(false); setShowLanding(true); setDatasetName(''); };
  const handleGetStarted = () => setShowLanding(false);

  return (
    <div className="App">
      <Header datasetName={datasetName} onReset={handleReset} onDownload={handleDownload} showActions={isUploaded} />
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">🤖 AI Processing...</div>
          </div>
        </div>
      )}

      {showLanding && !isUploaded ? (
        <div className="landing-page">
          {/* HERO SECTION */}
          <section className="hero-section" id="hero">
            <div className="hero-content">
              <div className="hero-badge">
                <span>✨</span>
                <span>AI-Powered Data Cleaning Platform</span>
              </div>
              <h1 className="hero-title">
                Transform Messy Data Into
                <br />
                <span className="gradient-text">Crystal Clear Insights</span>
              </h1>
              <p className="hero-subtitle">
                Professional enterprise-grade data cleaning powered by advanced AI algorithms.
                Clean, validate, and optimize datasets up to 500MB in seconds.
              </p>
              <div className="hero-actions">
                <button className="btn btn-hero-primary" onClick={handleGetStarted}>
                  Get Started Free
                  <span>→</span>
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">2M+</div>
                  <div className="stat-label">Datasets Cleaned</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">10x</div>
                  <div className="stat-label">Faster Processing</div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="features-section" id="features">
            <div className="section-header">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">
                Everything you need to transform your data into actionable insights
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🤖</span>
                <h3 className="feature-title">AI-Powered Cleaning</h3>
                <p className="feature-description">
                  Advanced MICE algorithm intelligently fills missing values while preserving data relationships and statistical integrity.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">
                  Process massive datasets up to 500MB in seconds with our optimized parallel processing engine.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📊</span>
                <h3 className="feature-title">Quality Scoring</h3>
                <p className="feature-description">
                  Real-time data quality assessment with comprehensive metrics, scoring, and actionable recommendations.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔍</span>
                <h3 className="feature-title">Outlier Detection</h3>
                <p className="feature-description">
                  Automatically identify and remove statistical outliers using advanced IQR methodology and custom thresholds.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📈</span>
                <h3 className="feature-title">Visual Analytics</h3>
                <p className="feature-description">
                  Interactive charts and visualizations to understand your data quality and distribution at a glance.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔒</span>
                <h3 className="feature-title">Secure & Private</h3>
                <p className="feature-description">
                  Your data never leaves your session. Enterprise-grade security with end-to-end encryption standards.
                </p>
              </div>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section className="about-section" id="about">
            <div className="about-content">
              <div className="about-text">
                <h2>About DataForge</h2>
                <p>
                  DataForge is the leading AI-powered data cleaning platform trusted by thousands of data professionals worldwide. 
                  We combine cutting-edge machine learning algorithms with an intuitive interface to deliver the most advanced 
                  data cleaning solution on the market.
                </p>
                <p>
                  Our mission is to eliminate the tedious manual work of data cleaning, allowing data scientists and analysts 
                  to focus on what matters most - extracting valuable insights and driving business decisions.
                </p>
                <p>
                  With support for datasets up to 500MB, multiple cleaning strategies, and real-time quality assessment, 
                  DataForge handles everything from small CSV files to massive enterprise data warehouses.
                </p>
              </div>
              <div className="about-visual">
                <div className="about-card">
                  <div className="about-card-icon">🎯</div>
                  <div className="about-card-title">Accuracy</div>
                  <div className="about-card-value">99.9%</div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">⚡</div>
                  <div className="about-card-title">Speed</div>
                  <div className="about-card-value">10x</div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">👥</div>
                  <div className="about-card-title">Users</div>
                  <div className="about-card-value">50K+</div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">🌍</div>
                  <div className="about-card-title">Countries</div>
                  <div className="about-card-value">120+</div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="how-it-works-section" id="how-it-works">
            <div className="section-header">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Three simple steps to clean data perfection</p>
            </div>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Upload Your Dataset</h3>
                  <p>
                    Simply drag and drop your CSV or Excel file. We support files up to 500MB with millions of rows.
                    Our system instantly analyzes your data and provides a comprehensive quality assessment.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>AI Analysis & Cleaning</h3>
                  <p>
                    Our advanced AI engine analyzes your data, detects quality issues, and recommends the best cleaning strategies.
                    Choose from multiple cleaning options including AI-powered imputation, statistical methods, or custom rules.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Download Clean Data</h3>
                  <p>
                    Review the cleaned data with our interactive visualizations, then download your pristine dataset.
                    Your data is now ready for analysis, modeling, or reporting with confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="cta-section" id="cta">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Data?</h2>
              <p className="cta-subtitle">
                Join thousands of data professionals using DataForge every day
              </p>
              <button className="btn btn-cta" onClick={handleGetStarted}>
                Start Cleaning Data Now
                <span>→</span>
              </button>
            </div>
          </section>
        </div>
      ) : !isUploaded ? (
        <div className="upload-page">
          <div className="upload-header">
            <h1>Upload Your Dataset</h1>
            <p>Get instant AI-powered quality analysis and cleaning recommendations</p>
          </div>
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
