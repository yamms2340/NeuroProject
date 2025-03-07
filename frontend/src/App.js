import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
import { Navigate, Route, Routes } from 'react-router-dom';

import { addTaskToDB,deleteTaskFromDB,editTaskInDB } from "./components/free";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
const API_URL = "http://localhost:3016/tasks"; 
export default function App() {
  const [tasks, setTasks] = useState([]); 
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [alertedTasks, setAlertedTasks] = useState(new Set()); 
  const [isloggedin,setisloggedin]=useState(false)
  const [isSignUp,setIsSignUp]=useState(false)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const currentDate = new Date().toISOString().split('T')[0]; // This gives the format "YYYY-MM-DD"
        const storedEmail = localStorage.getItem("userEmail");
       const formattedTasks = data
        .filter((task) => task.email === storedEmail) // Only get tasks belonging to the logged-in user
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

    fetchTasks(); // Run once immediately

    const interval = setInterval(() => {
      fetchTasks();
    }, 60000); // Run every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    tasks.forEach((task) => {
      const currentDate = new Date().toISOString().split('T')[0]; 
      console.log(currentDate,task.dueDate)
     
      if ((task.dueDate) ===(currentDate)&& !alertedTasks.has(task.id)) {
        const storedEmail = localStorage.getItem("userEmail");
        console.log(storedEmail)
        if(storedEmail!=null) {
          alert(`Complete the task "${task.title}"`);
        setAlertedTasks((prev) => new Set([...prev, task.id])); // ✅ Correct state update
        }
      }
    });
  }, [tasks]); // Runs whenever tasks update


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
  };
  const toggleStar = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, important: !task.important } : task))
    );
  };
  const deleteTask = (id) => {
    deleteTaskFromDB(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));

  };
  const addTask = (title, description, time) => {
    const newTask = { 
      id: String(Date.now()), 
      title, 
      description, 
      status: "incomplete", 
      important: false,
      dueDate: time,
    };
    const storedEmail = localStorage.getItem("userEmail");
    console.log("Due date",time)

    addTaskToDB(newTask.id, title, description, time,storedEmail);
    setTasks((prev) => [...prev, newTask]);
  };
  const editTask = (id, newTitle, newDescription, time) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle, description: newDescription, dueDate: time } : task))
    );
    editTaskInDB(id, newTitle, newDescription, time);
  };
  const filterTasks = (type) => {
    setFilterType(type);
  };
  return (
<div className="min-h-screen bg-gray-900">
<Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login'element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home  filterTasks={filterTasks}
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
        
      />}/>
      

      </Routes>

    </div>
    
  );
}