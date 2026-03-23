import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Visualization = ({ data }) => {
  if (!data) return null;

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3 style={{ marginTop: '0', marginBottom: '20px' }}>📊 Data Insights</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Chart 1: Missing Values */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Missing Values per Column</h4>
          {data.missing_data && data.missing_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.missing_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="missing" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>✅ No Missing Values!</p>
          )}
        </div>

        {/* Chart 2: Data Types */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Data Types</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.type_data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.type_data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Visualization;