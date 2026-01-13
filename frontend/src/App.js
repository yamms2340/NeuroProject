import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
import Calender from "./pages/Calender";
import Homepage from "./pages/HomePage";
import { addTaskToDB, deleteTaskFromDB, editTaskInDB } from "./components/free";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Task";
import View from "./pages/View";
import MLGame from "./components/MLGame";
import ParentDashboard from "./pages/ParentDashboard";

const API_URL = "http://localhost:5174/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [alertedTasks, setAlertedTasks] = useState(new Set());
  const [isloggedin, setisloggedin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Theme and coin state
  const [user, setUser] = useState({
    coins: 100, // Mock; fetch from backend
    ownedThemes: ["zen"],
    currentTheme: "zen",
  });

  const [events, setEvents] = useState(() =>
    JSON.parse(localStorage.getItem("events")) || {}
  );

 

  // Fetch tasks and user data
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const currentDate = new Date().toISOString().split("T")[0];
        const storedEmail = localStorage.getItem("userEmail");
        const Mapped = localStorage.getItem("mailMapped");
        const ispar = localStorage.getItem("isParent");

        const formattedTasks = data
          .filter((task) => task.email === Mapped)
          .map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status || "incomplete",
            important: task.important || false,
            dueDate: task.dueDate || currentDate,
          }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5174/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser({
          coins: data.coins || 100,
          ownedThemes: data.ownedThemes || ["zen"],
          currentTheme: data.currentTheme || "zen",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTasks();
    fetchUserData();

    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle task alerts and calendar events
  useEffect(() => {
    tasks.forEach((task) => {
      const { dueDate, title } = task;
      if (!dueDate) return;

      const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
      if (!storedEvents[dueDate]) {
        storedEvents[dueDate] = [];
      }
      if (!storedEvents[dueDate].includes(title)) {
        storedEvents[dueDate].push(title);
      }
      localStorage.setItem("events", JSON.stringify(storedEvents));

      const currentDate = new Date().toISOString().split("T")[0];
      if (dueDate === currentDate && !alertedTasks.has(task.id)) {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
          alert(`Complete the task "${task.title}"`);
          setAlertedTasks((prev) => new Set([...prev, task.id]));
        }
      }
    });
  }, [tasks]);

  // Apply theme
  const applyTheme = async (themeId) => {
    setUser((prev) => ({ ...prev, currentTheme: themeId }));
    try {
      await fetch("http://localhost:5174/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentTheme: themeId }),
      });
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const filteredTasks =
    tasks.length > 0
      ? filterType === "all"
        ? tasks
        : tasks.filter((task) =>
            filterType === "important" ? task.important : task.status === filterType
          )
      : [];

  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "completed" ? "incomplete" : "completed" }
          : task
      )
    );
    // Award coins for completing tasks
    if (tasks.find((task) => task.id === id)?.status === "incomplete") {
      setUser((prev) => ({ ...prev, coins: prev.coins + 5 }));
      // TODO: Update backend with new coin count
    }
  };

  const toggleStar = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, important: !task.important } : task))
    );
  };

  const deleteTask = (id) => {
    const ispar = localStorage.getItem("isParent");
    if (ispar === "false") {
      alert("Only Parents Can Delete..");
    } else {
      deleteTaskFromDB(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const addTask = (title, description, time) => {
    const ispar = localStorage.getItem("isParent");
    if (ispar === "false") {
      alert("Only Parents Can Add..");
    } else {
      const newTask = {
        id: String(Date.now()),
        title,
        description,
        status: "incomplete",
        important: false,
        dueDate: time,
      };
      const storedEmail = localStorage.getItem("userEmail");
      addTaskToDB(newTask.id, title, description, time, storedEmail);
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const editTask = (id, newTitle, newDescription, time) => {
    const ispar = localStorage.getItem("isParent");
    if (ispar === "false") {
      alert("Only Parents Can Edit..");
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, title: newTitle, description: newDescription, dueDate: time }
            : task
        )
      );
      editTaskInDB(id, newTitle, newDescription, time);
    }
  };

  const filterTasks = (type) => {
    setFilterType(type);
  };

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/view" element={<View />} />
        <Route path="/mathGame" element={<MLGame />} />
        <Route path="/parent" element={<ParentDashboard />} />

        <Route
          path="/task"
          element={
            <Home
              filterTasks={filterTasks}
              filterType={filterType}
              tasks={tasks}
              filteredTasks={filteredTasks}
              toggleStatus={toggleStatus}
              deleteTask={deleteTask}
              toggleStar={toggleStar}
              editTask={editTask}
              showModal={showModal}
              setShowModal={setShowModal}
              addTask={addTask}
              isloggedin={isloggedin}
              setisloggedin={setisloggedin}
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
            />
          }
        />
      </Routes>
  );
}





