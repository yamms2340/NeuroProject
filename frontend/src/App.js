import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Task";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./pages/DashBoardLayout";
import StudyRooms from "./pages/StudyRooms";
import StudyRoom from "./pages/StudyRoom";
import Calender from "./pages/Calender";
import View from "./pages/View";
import MLGame from "./components/MLGame";
import ParentDashboard from "./pages/ParentDashboard";

const API = "http://localhost:3016";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const res = await fetch(`${API}/getTasks/${email}`);
    const data = await res.json();

    setTasks(
      data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        completed: t.completed,
        starred: t.starred,
      }))
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= ADD ================= */
  const addTask = async (title, description, dueDate) => {
    const email = localStorage.getItem("userEmail");

    const res = await fetch(`${API}/addTask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
        email,
      }),
    });

    const saved = await res.json();
    setTasks(prev => [saved, ...prev]);
  };

  /* ================= TOGGLE COMPLETE ================= */
  const toggleStatus = async (id) => {
    await fetch(`${API}/toggleTaskStatus/${id}`, { method: "PUT" });
    fetchTasks();
  };

  /* ================= TOGGLE STAR ================= */
  const toggleStar = async (id) => {
    await fetch(`${API}/toggleTaskStar/${id}`, { method: "PUT" });
    fetchTasks();
  };

  /* ================= EDIT ================= */
  const editTask = async (id, title, description, dueDate) => {
    await fetch(`${API}/editTask/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate }),
    });
    fetchTasks();
  };

  /* ================= DELETE ================= */
  const deleteTask = async (id) => {
    await fetch(`${API}/deleteTask/${id}`, { method: "DELETE" });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<DashboardLayout />}>
        <Route path="/homepage" element={<Homepage />} />
        <Route
          path="/task"
          element={
            <Home
              tasks={tasks}
              addTask={addTask}
              toggleStatus={toggleStatus}
              toggleStar={toggleStar}
              deleteTask={deleteTask}
              editTask={editTask}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          }
        />
        <Route path="/study-rooms" element={<StudyRooms />} />
        <Route path="/study-room/:id" element={<StudyRoom />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/view" element={<View />} />
        <Route path="/mathGame" element={<MLGame />} />
      </Route>

      <Route path="/parent" element={<ParentDashboard />} />
    </Routes>
  );
}
