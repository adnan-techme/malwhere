import React from 'react';
import './Reports.css';
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

// Sample data for charts (IMPORTANT: NEED TO CHANGE)
const breakdownData = [
  { name: 'Trojan', value: 25 },
  { name: 'Virus', value: 28 },
  { name: 'Spyware', value: 16 },
  { name: 'Ransomware', value: 9 },
  { name: 'Keylogger', value: 22 },
];

const sourcesData = [
  { name: 'Email Attachments', value: 40 },
  { name: 'Infected Websites', value: 30 },
  { name: 'Downloaded Software', value: 30 },
];

const COLORS = ['#FFB347', '#FF6347', '#008080', '#FF69B4', '#4CAF50']; 

const behavioralData = [
  { name: 'Mon', risk: 110 },
  { name: 'Tue', risk: 150 },
  { name: 'Wed', risk: 120 },
  { name: 'Thu', risk: 160 },
  { name: 'Fri', risk: 220 },
  { name: 'Sat', risk: 300 },
];

const Reports = () => {
  return (
    <div className="reports-container">
      {/* Quick Summary */}
      <div className="summary-section">
        <h3 className="section-heading">Quick Summary</h3>
        <div className="summary-details">
          <div className="pseudo-button">Malware Detected</div>
          <div className="pseudo-button">Type: Trojan</div>
          <div className="pseudo-button">Confidence: 86%</div>
          <div className="pseudo-button">Model Used: CNN-LSTM</div>
        </div>
      </div>

      {/* Scan History */}
      <div className="scan-history-section">
        <h3 className="section-heading">Scan History</h3>
        <ul className="scan-history-list">
          <li>contacts.csv <span className="status success">✔</span></li>
          <li>taskA.csv <span className="status error">✖</span></li>
          <li>taskB.csv <span className="status success">✔</span></li>
          <li>taskC.csv <span className="status error">✖</span></li>
        </ul>
      </div>

      {/* Breakdown & Sources */}
      <div className="breakdown-sources-section">
        {/* Breakdown Chart */}
        <div className="chart-section breakdown-chart">
          <h3 className="section-heading">Breakdown</h3>
          <PieChart width={200} height={200}>
            <Pie data={breakdownData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
              {breakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Sources Chart */}
        <div className="chart-section sources-chart">
          <h3 className="section-heading">Sources</h3>
          <PieChart width={200} height={200}>
            <Pie data={sourcesData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
              {sourcesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      {/* Behavioral Analysis */}
      <div className="behavioral-analysis-section">
        <h3 className="section-heading">Behavioral Analysis</h3>
        <LineChart width={500} height={250} data={behavioralData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#ffffff" />  
        <YAxis stroke="#ffffff" />  
        <Tooltip />
        <Line type="monotone" dataKey="risk" stroke="#00C49F" /> 
        </LineChart>

      </div>
    </div>
  );
};

export default Reports;
