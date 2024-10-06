import React from 'react';
import './Reports.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const Reports = ({ malwareCount, mostCommonType }) => {
  const breakdownData = malwareCount
    ? Object.entries(malwareCount).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  const COLORS = ['#B8860B', '#FF4500', '#4682B4', '#D2691E', '#228B22', '#8A2BE2', '#4682B4', '#DC143C', '#8B0000'];

  const totalMalwareDetected = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="reports-container">
      <h1 className="main-title">Scan Reports</h1>

      <div className="summary-and-breakdown-container">
        {/* Quick Summary */}
        <div className="summary-section">
          <h3 className="section-heading">Quick Summary</h3>
          <div className="summary-details">
            <div className="pseudo-button">Total Files Scanned: {totalMalwareDetected}</div>
            <div className="pseudo-button">Most Common Malware Type: {mostCommonType || "Unknown"}</div>
            <div className="pseudo-button">Occurrences of Common Type: {malwareCount[mostCommonType] || "N/A"}</div>
            <div className="pseudo-button">Model Used: CNN-LSTM</div>
          </div>
        </div>

        {/* Moved Breakdown text outside the light green container */}
        <h3 className="section-heading centered-heading">Breakdown</h3>

        {/* Breakdown Section */}
        <div className="breakdown-section">
          {breakdownData.length > 0 ? (
            <PieChart width={500} height={400}>
              <Pie
                data={breakdownData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p>No malware detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
