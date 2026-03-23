import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Visualization = ({ data }) => {
  if (!data) return null;

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="visualization-panel">
      {/* Bar Chart: Missing Values */}
      <div className="chart-container" data-testid="missing-chart">
        <div className="chart-title">📉 Missing Values per Column</div>
        {data.missing_data && data.missing_data.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.missing_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Bar dataKey="missing" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: '#10B981',
            fontWeight: 600,
            fontSize: '15px'
          }}>
            ✓ No Missing Values Found!
          </div>
        )}
      </div>

      {/* Pie Chart: Data Types */}
      <div className="chart-container" data-testid="type-chart">
        <div className="chart-title">🧩 Data Type Distribution</div>
        {data.type_data && data.type_data.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.type_data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.type_data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">No data type information available</div>
        )}
      </div>
    </div>
  );
};

export default Visualization;
