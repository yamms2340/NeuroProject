import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import "./SignUpPage.css";

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    isParent: true
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setSignupInfo(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!signupInfo.email) return handleError("Enter email first");

    try {
      const res = await fetch("http://localhost:8080/send-parent-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupInfo.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess("OTP sent to email");
      setOtpSent(true);
      setOtpEmail(signupInfo.email);
    } catch (err) {
      handleError(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8080/verify-parent-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess("Email verified");
      setOtpVerified(true);
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    if (!otpVerified) return handleError("Verify your email first");

    try {
      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupInfo)
      });

const data = await res.json();

if (!res.ok) {
  alert(data.message || "Signup failed");
  return;
}  


      handleSuccess("Account created");

      setTimeout(() => {
        navigate("/parent");
      }, 800);

    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>Parent Sign Up</h2>

        <input
          name="name"
          placeholder="Name"
          value={signupInfo.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={signupInfo.email}
          onChange={handleChange}
          disabled={otpSent}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={signupInfo.password}
          onChange={handleChange}
          required
        />

        {!otpSent && (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {otpVerified && <p className="verified">✓ Email verified</p>}

        <button type="submit">Create Account</button>

        <span className="signup-switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}
