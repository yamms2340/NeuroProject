import React, { useState, useMemo, useEffect } from "react";
import TaskCard from "./TaskCard";
import './TaskStyles.css'; 

export default function TaskList({ 
  tasks, 
  toggleStatus, 
  deleteTask, 
  toggleStar, 
  editTask, 
  openAddTaskModal 
}) {
  // Add sorting and filtering functionality
  const [sortBy, setSortBy] = useState("date"); // date, priority, status
  const [filterBy, setFilterBy] = useState("all"); // all, completed, active, starred
  
  // Calculate task statistics more explicitly
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const starredTasks = tasks.filter(task => task.starred).length;
  
  // Log statistics for debugging
  useEffect(() => {
    console.log("Tasks in TaskList:", tasks);
    console.log("Total tasks:", totalTasks);
    console.log("Completed tasks:", completedTasks);
    console.log("Active tasks:", activeTasks);
  }, [tasks, totalTasks, completedTasks, activeTasks]);
  
  // Memoize the filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    // First filter the tasks
    let result = [...tasks];
    
    if (filterBy === "completed") {
      result = result.filter(task => task.completed);
    } else if (filterBy === "active") {
      result = result.filter(task => !task.completed);
    } else if (filterBy === "starred") {
      result = result.filter(task => task.starred);
    }
    
    // Then sort the tasks
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "priority") {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      } else if (sortBy === "status") {
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      }
      return 0;
    });
    
    return result;
  }, [tasks, sortBy, filterBy]);
  
  // Custom status toggle wrapper with logging
  const handleToggleStatus = (taskId) => {
    console.log("TaskList: Toggling status for task:", taskId);
    toggleStatus(taskId);
  };
  
  return (
    <div className="main-content">
      {/* Dashboard header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Dashboard</h1>
        <p className="dashboard-subtitle">Manage your tasks efficiently</p>
      </div>
      
      {/* Stats in a single row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{activeTasks}</div>
          <div className="stat-label">Active</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{starredTasks}</div>
          <div className="stat-label">Starred</div>
        </div>
      </div>
      
      {/* Task controls section */}
      <div className="task-controls">
        <div className="controls-header">
          <div className="controls-title">Your Tasks</div>
          <button className="add-task-button" onClick={openAddTaskModal}>
            + Add Task
          </button>
        </div>
        
        <div className="filter-controls">
          <select 
            className="filter-select"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="starred">Starred Tasks</option>
          </select>
          
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>
      
      {/* Task grid */}
      <div className="task-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              toggleStatus={handleToggleStatus} 
              deleteTask={deleteTask} 
              toggleStar={toggleStar} 
              editTask={editTask} 
            />
          ))
        ) : (
          <div className="empty-state">
            <p className="empty-message">
              {totalTasks === 0 
                ? "You don't have any tasks yet." 
                : "No tasks match your current filters."}
            </p>
            {totalTasks === 0 && (
              <button className="empty-action" onClick={openAddTaskModal}>
                Create your first task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}