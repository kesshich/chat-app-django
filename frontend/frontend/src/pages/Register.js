import React, { useState } from "react";
import ('../App.css')
function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState(""); // state для помилки

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // обнуляємо помилку при новій спробі
    try {
      const res = await fetch("http://localhost:8000/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: firstName }),
      });

      const data = await res.json();

      if (res.ok) {
        switchToLogin();
      } else {
        setError(data.error || 'Please enter valid credentials!');
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {error && <p className="error-box">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
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
        <button className="btn" type="submit">Register</button>
      </form>

      {/* Тут показуємо помилку, якщо вона є */}
      

      <p className="switch-text">
        Already have an account? <span className="link" onClick={switchToLogin}>Login here</span>.
      </p>
    </div>
  );
}

export default Register;
