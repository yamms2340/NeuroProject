import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import "./LoginPage.css";

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const result = await response.json();

      if (result.message !== "success") {
        return handleError(result.message || "Invalid credentials");
      }

      const { user } = result;

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("role", user.role);

      handleSuccess("Login successful");

      if (user.role === "parent") {
        navigate("/parent");
      } else {
        navigate("/homepage");
      }

    } catch (err) {
      console.error("Login error:", err);
      handleError("Login failed");
    }
  };

  return (
    <div className="LoginPage-hero">
      <div className="LoginPage-doodles">
        <div className="doodle doodle-1">✏️</div>
        <div className="doodle doodle-2">🌟</div>
        <div className="doodle doodle-3">📚</div>
        <div className="doodle doodle-4">🧮</div>
      </div>
      
      <div className="LoginPage-container">
        <div className="LoginPage-left">
          <h1 className="LoginPage-welcome">NeuroStudent Portal</h1>
          <p className="LoginPage-subtitle">Fun neuroscience learning for young minds</p>
          <div className="LoginPage-student-animation">
            <div className="student-figure">
              <div className="student-head">👦</div>
              <div className="student-body">
                <div className="student-torso"></div>
                <div className="student-arms">
                  <div className="arm-left"></div>
                  <div className="arm-right holding-book"></div>
                </div>
                <div className="student-table">
                  <div className="book">📖</div>
                  <div className="pencil">✏️</div>
                </div>
              </div>
              <div className="thought-bubble">
                <span>🧠✨</span>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleLogin} className="LoginPage-form">
          <div className="LoginPage-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue learning</p>
          </div>
          <div className="LoginPage-input-group">
            <div className="LoginPage-input-wrapper">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="LoginPage-input-wrapper">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="LoginPage-submit">
            Sign In
          </button>
          <span className="LoginPage-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
