import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatsCard = ({ score, stats }) => {
  const scoreClass = score >= 80 ? 'health-good' : score >= 50 ? 'health-warning' : 'health-bad';
  const statusText = score >= 80 ? '✓ Excellent' : score >= 50 ? '⚠ Needs Attention' : '✗ Poor Quality';

  // Prepare data for circular progress (pie chart)
  const progressData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  const COLORS = [
    score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444',
    '#E5E7EB'
  ];

  return (
    <div className="card stats-card" data-testid="stats-card">
      <div className="score-container">
        <div className="score-label">Data Quality Score</div>
        <div className="score-circle">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={55}
                outerRadius={75}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={`score-value ${scoreClass}`} data-testid="quality-score" style={{ background: 'transparent', border: 'none' }}>
            {score}%
          </div>
        </div>
        <div className={`score-status ${scoreClass}`} data-testid="quality-status">
          {statusText}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
        <h3>Dataset Summary</h3>
        <ul className="summary-list">
          <li className="summary-item">
            <span className="summary-label">Total Rows</span>
            <span className="summary-value" data-testid="total-rows">{stats.rows.toLocaleString()}</span>
          </li>
          <li className="summary-item">
            <span className="summary-label">Total Columns</span>
            <span className="summary-value" data-testid="total-columns">{stats.columns}</span>
          </li>
          <li className="summary-item">
            <span className="summary-label">Missing Values</span>
            <span className="summary-value" style={{ color: stats.missing > 0 ? 'var(--error-500)' : 'var(--success-500)' }} data-testid="missing-values">
              {stats.missing.toLocaleString()}
            </span>
          </li>
          <li className="summary-item">
            <span className="summary-label">Duplicate Rows</span>
            <span className="summary-value" data-testid="duplicate-rows">{stats.duplicates || 0}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StatsCard;
