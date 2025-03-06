import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const getFormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

const API_URL = "http://localhost:3016/tasks"; 

export default function App() {
  const [tasks, setTasks] = useState([]); 
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [alertedTasks, setAlertedTasks] = useState(new Set()); // Track alerted task IDs

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
          dueDate: task.dueDate || getFormattedDate(),
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
      console.log("Task Due Date:", formatDate(task.dueDate), getFormattedDate());
      if (formatDate(task.dueDate) === getFormattedDate() && !alertedTasks.has(task.id)) {
        alert(task.title);
        setAlertedTasks((prev) => new Set([...prev, task.id])); // ✅ Correct state update
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

  const addTaskToDB = async (id, title, description, time) => {
    try {
      const response = await fetch("http://localhost:3016/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description, time }),
      });
      const data = await response.json();
      console.log("✅ Task added:", data);
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  const editTaskInDB = async (id, title, description, time) => {
    try {
      const updatedTask = { title, description, time };
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
        prev.map((task) => (task.id === id ? { ...task, title, description, time } : task))
      );
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
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

    addTaskToDB(newTask.id, title, description, time);

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
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        {tasks.length > 0 ? (
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
