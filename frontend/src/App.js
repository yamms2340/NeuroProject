import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";

const API_URL = "http://localhost:3016/tasks"; 

const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 16);
};

export default function App() {
  const [tasks, setTasks] = useState([]); 
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const formattedTasks = data.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status || "incomplete",
          important: task.important || false,
          dueDate: task.dueDate || getCurrentDateTime(),
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); 
      }
    };

    fetchTasks();
  }, []);

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
  const deleteTaskFromDB = async (id) => {
    try {
      const response = await fetch(`http://localhost:3016/deleteTask/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete task");
  
      console.log(`✅ Task ${id} deleted successfully`);
  
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("❌ Error deleting task:", error.message);
    }
  };
  

  const deleteTask = (id) => {
   deleteTaskFromDB(id);
  };

  const addTaskToDB = async (id, title, description) => {
    try {
      const response = await fetch("http://localhost:3016/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description }),
      });

      const data = await response.json();
      console.log("✅ Task added:", data);

    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  const editTaskInDB = async (id, title, description) => {
    try {
      const updatedTask = { title, description };
      console.log("🔄 Sending update request:", updatedTask);

      const response = await fetch(`http://localhost:3016/editTask/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      const data = await response.json();
      console.log("✅ Task updated:", data);

      // Update the task in state
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, title, description } : task))
      );
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const addTask = (title, description) => {
    const newTask = { 
      id: String(Date.now()), 
      title, 
      description, 
      status: "incomplete", 
      important: false 
    };
  
    addTaskToDB(newTask.id, title, description);
  
    setTasks((prev) => [...prev, newTask]);
  };
  

  const editTask = (id, newTitle, newDescription) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle, description: newDescription } : task))
    );
    editTaskInDB(id, newTitle, newDescription);
  };

  const filterTasks = (type) => {
    setFilterType(type);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        {tasks.length >= 0 ? (
          <TaskList
            tasks={filteredTasks}
            toggleStatus={toggleStatus}
            deleteTask={deleteTask}
            toggleStar={toggleStar}
            editTask={editTask}
            openAddTaskModal={() => setShowModal(true)}
          />
        ) : (
          <p className="text-white text-center">No tasks available</p> 
        )}
      </div>
      {showModal && <AddTaskModal addTask={addTask} closeModal={() => setShowModal(false)} />}
    </div>
  );
}
