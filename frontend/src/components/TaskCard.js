import React, { useState } from "react";
import './TaskStyles.css';

export default function TaskCard({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDueTime, setDueDate] = useState(task.dueTime);
  const [newDescription, setDescription] = useState(task.description);
  const [taskState, setTaskState] = useState(task);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const toggleStatus = () => {
    setTaskState(prev => ({
      ...prev,
      completed: !prev.completed
    }));
  };

  const deleteTask = () => {
    console.log(`Task with id ${task.id} deleted`);
  };

  const toggleStar = () => {
    setTaskState(prev => ({
      ...prev,
      starred: !prev.starred
    }));
  };

  const editTask = () => {
    setTaskState(prev => ({
      ...prev,
      title: newTitle,
      description: newDescription,
      dueTime: newDueTime
    }));
    setIsEditing(false);
  };

  return (
    <div className={`TaskCard ${taskState.completed ? "completed-task" : ""}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            className="AddTaskModal-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="AddTaskModal-input"
            value={newDescription}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <label htmlFor="dueDate" className="edit-label">
            Due Date:
          </label>
          <input
            className="AddTaskModal-input"
            type="date"
            id="dueDate"
            value={newDueTime}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="edit-actions">
            <button
              onClick={() => setIsEditing(false)}
              className="AddTaskModal-button AddTaskModal-button-cancel"
            >
              Cancel
            </button>
            <button
              onClick={editTask}
              className="AddTaskModal-button AddTaskModal-button-add"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3 className="TaskCard-header">{taskState.title}</h3>
            <p className="TaskCard-description">{taskState.description}</p>
            {taskState.dueTime && (
              <div className="task-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{formatDate(taskState.dueTime)}</span>
              </div>
            )}
          </div>

          <div className="TaskCard-actions">
            <button
              onClick={toggleStatus}
              className={`TaskCard-action-button ${taskState.completed ? "TaskCard-action-button-status" : ""}`}
            >
              {taskState.completed ? "✓ Done" : "Pending"}
            </button>

            <div className="action-buttons">
              <button onClick={toggleStar} className="TaskCard-action-button-star">
                {taskState.starred ? "⭐" : "☆"}
              </button>
              <button onClick={() => setIsEditing(true)} className="TaskCard-action-button edit-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button onClick={deleteTask} className="TaskCard-action-button-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
