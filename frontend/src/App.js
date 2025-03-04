import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
const getCurrentDateTime = () => {
  const now = new Date();
  console.log(now.toISOString);
  return now.toISOString().slice(0, 16);  
};
const initialTasks = [
  { id: 1, title: "The Best Coding Channel", description: "I have to create my channel...", status: "incomplete", important: false,dueDate:getCurrentDateTime(), },
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

  const editTask = (id, newTitle,newDescription,newDueTime) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle,description:newDescription,dueDate:newDueTime } : task))
    );
  };

  const addTask = (title, description) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, description, status: "incomplete", important: false },
    ]);
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