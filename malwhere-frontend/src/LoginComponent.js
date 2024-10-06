import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css';

const LoginComponent = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'tipadmin1') {
      setUserRole('admin');
      navigate('/'); // Admin goes to upload page
    } else if (username === 'user' && password === 'tipuser1') {
      setUserRole('user');
      navigate('/reports'); // User goes to reports page
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginComponent;
