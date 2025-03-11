import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./LoginPage.css"; // Import the CSS file

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
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
        credentials: "include",  // ✅ Ensure cookies are included
      });

      console.log("Response Headers:", response.headers.get("set-cookie")); // Debugging
      
      const result = await response.json();
      console.log(result);
      if (result.message === "success") {
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("isParent", result.user.isParent);
        localStorage.setItem("mailMapped", result.user.mailMapped);
        console.log("Redirecting to home...");
        window.location.href = "/homepage";
      } else {
        alert("Invalid credentials..");
      }
    } catch (err) {
      alert("Invalid credentials..");
      console.error("Login error:", err);
      handleError(err.message);
    }
  };

  return (
    <div className="LoginPage-login-container">
      <form onSubmit={handleLogin} className="LoginPage-login-form">
        <h2 className="LoginPage-title">Login</h2>
          <div className="LoginPagebutton-login-container">
            <input type="email" name="email" placeholder="Email" value={loginInfo.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={loginInfo.password} onChange={handleChange} required />
            <button type="submit">Login</button>
          </div>

          <span className="LoginPage-switch-auth">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </span>
      </form>
    </div>
  );
}
