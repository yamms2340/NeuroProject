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
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const [otpEmail, setOtpEmail] = useState("");

const sendOtp = async () => {
  try {
    if (!signupInfo.email) return handleError("Enter email first");

    const res = await fetch("http://localhost:8080/send-parent-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupInfo.email })
    });

    const data = await res.json();

    console.log("OTP response:", data);

    if (!res.ok) {
      throw new Error(data.message || "OTP failed");
    }

    handleSuccess(data.message);
    setOtpSent(true);
    setOtpEmail(signupInfo.email);

  } catch (err) {
    console.error("Send OTP error:", err);
    handleError(err.message);
  }
};


const verifyOtp = async () => {
  const res = await fetch("http://localhost:8080/verify-parent-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: otpEmail, otp })
  });

  const data = await res.json();

  if (data.message === "verified") {
    handleSuccess("Email verified");
    setOtpVerified(true);
  } else {
    handleError(data.message);
  }
};


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
   if (signupInfo.isParent && signupInfo.email !== otpEmail) {
  return handleError("Email changed after OTP verification");
}


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
          <input
  type="email"
  name="email"
  placeholder="Email"
  value={signupInfo.email}
  onChange={handleChange}
  disabled={otpSent}
/>

          <input type="password" name="password" placeholder="Password" value={signupInfo.password} onChange={handleChange} required />
        </div>

        {/* Checkbox */}
        <div className="signup-checkbox-container">
          <input type="checkbox" name="isParent" checked={signupInfo.isParent} onChange={handleChange} />
          <label>Are you a parent?</label>
        </div>

        {/* Child Fields */}
      {/* Parent OTP + Child Fields */}
{signupInfo.isParent && (
  <>
    {!otpSent && (
      <button type="button" onClick={sendOtp} className="otp-btn">
        Send OTP
      </button>
    )}

    {otpSent && !otpVerified && (
      <>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
        />
        <button type="button" onClick={verifyOtp} className="otp-btn">
          Verify OTP
        </button>
      </>
    )}

    {otpVerified && (
      <div className="verified-text">
        ✓ Email verified
      </div>
    )}

    {otpVerified && (
      <>
        <input
          type="email"
          name="childEmail"
          placeholder="Enter your child's email"
          value={signupInfo.childEmail}
          onChange={handleChange}
          className="child-input"
          required
        />

        <input
          type="password"
          name="childPassword"
          placeholder="Enter your child's password"
          value={signupInfo.childPassword}
          onChange={handleChange}
          className="child-input"
          required
        />
      </>
    )}
  </>
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
