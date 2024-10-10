import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUploadComponent from './FileUploadComponent';
import Reports from './Reports';
import LoginComponent from './LoginComponent';
import ManageUsersComponent from './ManageUsersComponent'; // Make sure this file exists
import ScanHistoryComponent from './ScanHistoryComponent'; // New Component for File Scan History
import './App.css';
import logo from './logo.png';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [malwareCount, setMalwareCount] = useState({});
  const [mostCommonType, setMostCommonType] = useState('');
  const [mostCommonCount, setMostCommonCount] = useState(0);

  return (
    <Router>
      <div className="main-container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="MalWhere Logo" className="logo-image" />
          </Link>
          {userRole ? (
            <div className="menu">
              {userRole === 'admin' && (
                <Link to="/">
                  <button>Upload</button>
                </Link>
              )}
              <Link to="/reports">
                <button>Reports</button>
              </Link>
              <Link to="/scan-history">
                <button>Scan History</button>
              </Link>
              {userRole === 'admin' && (
                <Link to="/manage">
                  <button>Manage Users</button>
                </Link>
              )}
              <button onClick={() => setUserRole(null)}>Logout</button>
            </div>
          ) : null}
        </nav>

        <Routes>
          <Route path="/login" element={<LoginComponent setUserRole={setUserRole} />} />
          <Route
            path="/"
            element={
              userRole === 'admin' ? (
                <FileUploadComponent 
                  setMalwareCount={setMalwareCount} 
                  setMostCommonType={setMostCommonType} 
                  setMostCommonCount={setMostCommonCount}
                />
              ) : (
                <LoginComponent setUserRole={setUserRole} />
              )
            }
          />
          <Route
            path="/reports"
            element={
              userRole ? (
                <Reports 
                  malwareCount={malwareCount} 
                  mostCommonType={mostCommonType} 
                  setMostCommonCount={setMostCommonCount} 
                />
              ) : (
                <LoginComponent setUserRole={setUserRole} />
              )
            }
          />
          <Route
            path="/manage"
            element={
              userRole === 'admin' ? (
                <ManageUsersComponent />
              ) : (
                <LoginComponent setUserRole={setUserRole} />
              )
            }
          />
          <Route
            path="/scan-history"
            element={
              userRole === 'admin' || userRole === 'user' ? (
                <ScanHistoryComponent />
              ) : (
                <LoginComponent setUserRole={setUserRole} />
              )
            }
          />
        </Routes>
        <footer className="footer-bar">
          <p>© 2024 MalWhere. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
