import React, { useState } from "react";

export default function Signup() {
  const [isParent, setIsParent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isParent: false,
    child: { name: "", email: "", password: "" },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsParent(checked);
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      child: { ...prev.child, [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 focus:outline-none"
          required
        />

        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            name="isParent"
            checked={isParent}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Are you a Parent?</label>
        </div>

        {isParent && (
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Child's Credentials</h3>
            <input
              type="text"
              name="name"
              placeholder="Child's Name"
              value={formData.child.name}
              onChange={handleChildChange}
              className="w-full p-2 mb-2 rounded bg-gray-600 focus:outline-none"
              required={isParent}
            />
            <input
              type="email"
              name="email"
              placeholder="Child's Email"
              value={formData.child.email}
              onChange={handleChildChange}
              className="w-full p-2 mb-2 rounded bg-gray-600 focus:outline-none"
              required={isParent}
            />
            <input
              type="password"
              name="password"
              placeholder="Child's Password"
              value={formData.child.password}
              onChange={handleChildChange}
              className="w-full p-2 mb-2 rounded bg-gray-600 focus:outline-none"
              required={isParent}
            />
          </div>
        )}

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}
