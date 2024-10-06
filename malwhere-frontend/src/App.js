import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUploadComponent from './FileUploadComponent';
import Reports from './Reports';
import LoginComponent from './LoginComponent';
import './App.css';
import logo from './logo.png';

function App() {
  const [userRole, setUserRole] = useState(null); 
  const [malwareCount, setMalwareCount] = useState({});
  const [mostCommonType, setMostCommonType] = useState('');
  const [mostCommonCount, setMostCommonCount] = useState(0);  // Track count of most common malware

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
                  mostCommonCount={mostCommonCount} 
                />
              ) : (
                <LoginComponent setUserRole={setUserRole} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
