import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
// const { addTaskToDB} = require("./TaskServices"); 
const getCurrentDateTime = () => {
  const now = new Date();
  console.log(now.toISOString);
  return now.toISOString().slice(0, 16);  
};
const initialTasks = [
  { id: "1", title: "The Best Coding Channel", description: "I have to create my channel...", status: "incomplete", important: false,dueDate:getCurrentDateTime(), },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);

  
    

  const filteredTasks =
    filterType === "all"
      ? tasks
      : tasks.filter((task) =>
          filterType === "important" ? task.important : task.status === filterType
        );

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
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

 
  const addTaskToDB = async (id, title,description) => {
    try {
      const response = await fetch("http://localhost:3016/addTask", {  // Port 3015!
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title,description}),
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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
        });

        const data = await response.json();
        console.log("✅ Task updated response:", data);
    } catch (error) {
        console.error("❌ Error updating task:", error);
    }
};

  

  const addTask = (title, description) => {

    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, description, status: "incomplete", important: false },
    ]);
    addTaskToDB(String(Date.now()),title,description);
  };
  const editTask = (id, newTitle,newDescription) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle,description:newDescription } : task))
    );
    editTaskInDB(id,newTitle,newDescription)
  };

  const filterTasks = (type) => {
    setFilterType(type); 
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        <TaskList
          tasks={filteredTasks}
          toggleStatus={toggleStatus}
          deleteTask={deleteTask}
          toggleStar={toggleStar}
          editTask={editTask}
          openAddTaskModal={() => setShowModal(true)}
        />
      </div>
      {showModal && <AddTaskModal addTask={addTask} closeModal={() => setShowModal(false)} />}
 </div>
);
}