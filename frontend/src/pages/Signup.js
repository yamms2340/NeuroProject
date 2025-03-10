import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import "./SignUpPage.css"; // Updated file name for consistency

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    isParent: false,
    childEmail: "",
    childPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, isParent, childEmail, childPassword } = signupInfo;
    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }
    if (isParent && (!childEmail || !childPassword)) {
      return handleError("Please enter your child's email and password");
    }
    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      if (result.message === "already") {
        alert("You can log in directly");
      }
      if (result.message === "in") {
        alert("Only Parents can Sign Up");
      }

      if (response.ok) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Signup error:", err);
      handleError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        
        {/* Input Fields */}
        <div className="signup-input-container">
          <input type="text" name="name" placeholder="Name" value={signupInfo.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={signupInfo.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={signupInfo.password} onChange={handleChange} required />
        </div>

        {/* Checkbox */}
        <div className="signup-checkbox-container">
          <input type="checkbox" name="isParent" checked={signupInfo.isParent} onChange={handleChange} />
          <label>Are you a parent?</label>
        </div>

        {/* Child Fields */}
        {signupInfo.isParent && (
          <div className="signup-input-container">
            <input type="email" name="childEmail" placeholder="Child's Email" value={signupInfo.childEmail} onChange={handleChange} required />
            <input type="password" name="childPassword" placeholder="Child's Password" value={signupInfo.childPassword} onChange={handleChange} required />
          </div>
        )}

        {/* Signup Button */}
        <button type="submit" className="signup-button">Sign Up</button>

        {/* Login Redirect */}
        <span className="signup-switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}
