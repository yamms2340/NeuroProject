import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
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
    console.log("eamil..i found",email);
    localStorage.setItem("userEmail", email); // Store email in local storage


    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "PUT", // Changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log(result);
      if (result.message === "success") {
        console.log("Redirecting to home...");
        window.location.href = "/home"; // Redirects to the home page
      } else {
      alert("Invalid credentials..")
      }
    } catch (err) {
        alert("Invalid credentials..")
      console.error("Login error:", err);
      handleError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginInfo.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginInfo.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 rounded hover:bg-blue-600">
          Login
        </button>

        <span className="block text-center mt-2">
          Don't have an account? <Link to="/signup" className="text-blue-400">Sign Up</Link>
        </span>
      </form>
    </div>
  );
}
