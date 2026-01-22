import React, { useState } from "react";
import "./TaskStyles.css";

export default function TaskCard({
  task,
  toggleStatus,
  toggleStar,
  deleteTask,
  editTask
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const saveEdit = () => {
    editTask(task.id, title, description, dueDate);
    setIsEditing(false);
  };

  return (
    <div className={`TaskCard ${task.completed ? "completed-task" : ""}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            className="AddTaskModal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="AddTaskModal-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="AddTaskModal-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="edit-actions">
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            <button onClick={saveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <button
            className="TaskCard-action-button"
            onClick={() => toggleStatus(task.id)}
          >
            {task.completed ? "✓ Done" : "Pending"}
          </button>

          <div className="action-buttons">
            <button
              className="TaskCard-action-button-star"
              onClick={() => toggleStar(task.id)}
            >
              {task.starred ? "⭐" : "☆"}
            </button>

            <button onClick={() => setIsEditing(true)}>Edit</button>

            <button
              className="TaskCard-action-button-delete"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
