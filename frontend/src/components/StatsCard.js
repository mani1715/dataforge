import React from 'react';

const StatsCard = ({ score, stats }) => {
  const scoreClass = score > 80 ? 'health-good' : score > 50 ? 'health-warning' : 'health-bad';

  return (
    <div className="card">
      <h3 style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '10px' }}>Health Score</h3>
      <div className={`health-score ${scoreClass}`}>
        {score}%
      </div>
      <div style={{ marginTop: '20px' }}>
        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Rows:</span> <strong>{stats.rows}</strong>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Columns:</span> <strong>{stats.columns}</strong>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Missing Values:</span> <strong style={{color: 'var(--status-error)'}}>{stats.missing}</strong>
        </p>
      </div>
    </div>
  );
};

export default StatsCard;