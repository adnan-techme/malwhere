import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScanHistoryComponent.css';

function ScanHistoryComponent() {
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    // Fetch the scan history from the backend
    axios.get('http://localhost:5000/scan-history')
      .then(response => {
        setScanHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching scan history:', error);
      });
  }, []);

  return (
    <div className="scan-history-container">
      <h2>File Scan History</h2>
      {scanHistory.length > 0 ? (
        <table className="scan-history-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Date Scanned</th>
              <th>Malware Type</th>
              <th>Scan Result</th>
            </tr>
          </thead>
          <tbody>
            {scanHistory.map((scan, index) => (
              <tr key={index}>
                <td>{scan.fileName}</td>
                <td>{new Date(scan.dateScanned).toLocaleString()}</td>
                <td>{scan.malwareType}</td>
                <td>{scan.scanResult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p">No scan history available.</p>
      )}
    </div>
  );
}

export default ScanHistoryComponent;