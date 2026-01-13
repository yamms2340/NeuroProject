import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [childEmail, setChildEmail] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputStyle = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "10px",
  color: "white",
  outline: "none"
};
const navigate = useNavigate();

const logout = async () => {
  try {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    });

    localStorage.clear();
    navigate("/login");
  } catch (err) {
    alert("Logout failed");
  }
};


  const fetchChildren = async () => {
    const res = await fetch("http://localhost:8080/my-children", {
      credentials: "include"
    });
    const data = await res.json();
    setChildren(data.children || []);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const addChild = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/add-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ childEmail, childPassword })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Child added");
      setChildEmail("");
      setChildPassword("");
      fetchChildren();
    } else {
      alert(data.message);
    }
  };

  return (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    padding: "40px",
    color: "white",
    fontFamily: "Inter, sans-serif"
  }}>
    <div style={{
      maxWidth: "900px",
      margin: "0 auto"
    }}>
    <button
  onClick={logout}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 18px",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(239,68,68,.6)"
  }}
>
  Logout
</button>


      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Parent Dashboard
      </h1>

      {/* Add Child Card */}
      <div style={{
        background: "#020617",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "30px",
        boxShadow: "0 0 30px rgba(0,0,0,.6)"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Add Child</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "12px"
        }}>
          <input
            value={childEmail}
            onChange={e => setChildEmail(e.target.value)}
            placeholder="Child Email"
            style={inputStyle}
          />

          <input
            type="password"
            value={childPassword}
            onChange={e => setChildPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
          />

          <button
            onClick={addChild}
            disabled={loading}
            style={{
              background: "#3b82f6",
              padding: "0 20px",
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Children List */}
      <h2 style={{ marginBottom: "12px" }}>Your Children</h2>

      {children.length === 0 && (
        <p style={{ opacity: .6 }}>No children added yet</p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {children.map(child => (
          <div key={child._id} style={{
            background: "#020617",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 0 20px rgba(0,0,0,.5)"
          }}>
            <div style={{ fontSize: "14px", opacity: .7 }}>
              {child.email}
            </div>

            <div style={{
              fontSize: "32px",
              fontWeight: "700",
              marginTop: "10px",
              color: "#3b82f6"
            }}>
              {child.IQScore}
            </div>

            <div style={{ opacity: .6 }}>
              IQ Score
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);




  
}
