import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    isLogin: false, 
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
      console.log(result)
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
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={signupInfo.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupInfo.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupInfo.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            name="isParent"
            checked={signupInfo.isParent} // ✅ Boolean value
            onChange={handleChange}
            className="mr-2"
          />
          <label>Are you a parent?</label>
        </div>
        {signupInfo.isParent && (
          <>
            <input
              type="email"
              name="childEmail"
              placeholder="Enter your child's email"
              value={signupInfo.childEmail}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
              required
            />

            <input
              type="password"
              name="childPassword"
              placeholder="Enter your child's password"
              value={signupInfo.childPassword}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
              required
            />
          </>
        )}

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 rounded hover:bg-blue-600">
          Sign Up
        </button>

        <span className="block text-center mt-2">
          Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
        </span>
      </form>
    </div>
  );
}
