import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsersComponent.css';

const ManageUsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddUser = () => {
    axios.post('http://localhost:5000/users', newUser)
      .then(() => {
        setUsers([...users, newUser]);
        setNewUser({ username: '', password: '', role: 'user' });
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const handleDeleteUser = (username) => {
    axios.delete(`http://localhost:5000/users/${username}`)
      .then(() => setUsers(users.filter(user => user.username !== username)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <div className="add-user-section">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div className="user-list-section">
        <h3>Current Users</h3>
        <ul>
          {users.map(user => (
            <li key={user.username}>
              {user.username} ({user.role})
              <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsersComponent;
