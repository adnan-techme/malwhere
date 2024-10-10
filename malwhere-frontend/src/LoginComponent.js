import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css';
import axios from 'axios';

const LoginComponent = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', {
      username: username,
      password: password
    })
    .then(response => {
      setUserRole(response.data.role);
      if (response.data.role === 'admin') {
        navigate('/');
      } else {
        navigate('/reports');
      }
    })
    .catch(error => {
      setErrorMessage('Invalid credentials. Please try again.');
    });
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
