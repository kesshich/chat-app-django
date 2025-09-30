import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserList from "./pages/UserList";
import ChatRoom from "./pages/ChatRoom";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("email"));
  const [selectedParticipants, setSelectedParticipants] = useState(null); // масив рядків

  const handleLogin = (jwt, email) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("email", email);
    setToken(jwt);
    setUserEmail(email);
    setPage("users");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setUserEmail(null);
    setSelectedParticipants(null);
    setPage("login");
  };

  return (
    <div className="app-container">
      {token ? (
        page === "chat" ? (
          <ChatRoom
            participantsEmails={selectedParticipants} // масив email
            token={token}
            onBack={() => setPage("users")}
          />
        ) : (
          <UserList
            token={token}
            currentUserEmail={userEmail}
            onLogout={handleLogout}
            onSelectUser={(user) => {
              setSelectedParticipants([userEmail, user.email]); // масив рядків
              setPage("chat");
            }}
          />
        )
      ) : page === "login" ? (
        <Login onLogin={handleLogin} switchToRegister={() => setPage("register")} />
      ) : (
        <Register switchToLogin={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;
