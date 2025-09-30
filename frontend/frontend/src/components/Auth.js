import React, { useState } from "react";
import { register, login } from "../api";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        const res = await register(email, password, firstName);
        if (res.id || res.email) {
          alert("Registered! Now login.");
          setMode("login");
        } else {
          alert("Registration failed");
        }
      } else {
        const res = await login(email, password);
        if (res.token) {
          onLogin(res.token);
        } else {
          alert("Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className="card">
      <h2>{mode === "register" ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {mode === "register" && (
          <input
            className="input"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        )}
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>
      <p className="switch-text">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <span className="link" onClick={() => setMode("register")}>
              Register now
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span className="link" onClick={() => setMode("login")}>
              Login here
            </span>
          </>
        )}
      </p>
    </div>
  );
}