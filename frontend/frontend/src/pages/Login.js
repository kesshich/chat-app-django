import React, { useState } from "react";
import ("../App.css");

function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // state для помилки

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // обнуляємо помилку при новій спробі

    try {
      const res = await fetch("http://localhost:8000/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data.token, data.email);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {error && <p className="error-box">{error}</p>} {/* відображення помилки */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="submit">Login</button>
      </form>

      <p className="switch-text">
        Don’t have an account? <span className="link" onClick={switchToRegister}>Register now</span>.
      </p>
    </div>
  );
}

export default Login;