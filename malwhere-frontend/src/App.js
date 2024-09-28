import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUploadComponent from './FileUploadComponent';
import Reports from './Reports'; 
import './App.css';
import logo from './logo.png';
function App() {
  return (
    <Router>
      <div className="main-container">
        {/* Navbar */}
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="MalWhere Logo" className="logo-image" />
          </Link>
          <div className="menu">
            <Link to="/">
              <button>Upload</button>
            </Link>
            <Link to="/reports">
              <button>Reports</button>
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<FileUploadComponent />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
