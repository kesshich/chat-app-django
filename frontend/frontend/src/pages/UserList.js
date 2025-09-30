import React, { useEffect, useState } from "react";

function UserList({ token, currentUserEmail, onLogout, onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/user/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.filter(u => u.email !== currentUserEmail)); // виключаємо поточного юзера
      })
      .catch(err => console.error(err));
  }, [token, currentUserEmail]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Users</h2>
        <button className="btn logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <ul className="user-list">
        {users.map(u => (
          <li key={u.id} className="user-item">
            <span>{u.email}</span>
            <button className="btn" onClick={() => onSelectUser(u)}>Start chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
