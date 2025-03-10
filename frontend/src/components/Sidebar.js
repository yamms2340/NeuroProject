import React from 'react';
import './TaskStyles.css';
import './Sidebar.css'

const Sidebar = ({ filterTasks, filterType }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          </svg>
          <h1>Task Manager</h1>
        </div>
        <p className="sidebar-subtitle">Manage your tasks now..</p>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${filterType === 'all' ? 'active' : ''}`} 
          onClick={() => filterTasks('all')}
        >
          <span className="nav-icon">📋</span>
          All Tasks
        </button>
        
        <button 
          className={`nav-item ${filterType === 'important' ? 'active' : ''}`} 
          onClick={() => filterTasks('important')}
        >
          <span className="nav-icon">⭐</span>
          Important Tasks
        </button>
        
        <button 
          className={`nav-item ${filterType === 'completed' ? 'active' : ''}`} 
          onClick={() => filterTasks('completed')}
        >
          <span className="nav-icon">✅</span>
          Completed Tasks
        </button>
        
        <button 
          className={`nav-item ${filterType === 'incomplete' ? 'active' : ''}`} 
          onClick={() => filterTasks('incomplete')}
        >
          <span className="nav-icon">❌</span>
          Incomplete Tasks
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;