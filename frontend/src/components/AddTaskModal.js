import React, { useState } from "react";
import './TaskStyles.css'; // Import the CSS file

export default function AddTaskModal({ addTask, closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div className="AddTaskModal-overlay">
      <div className="AddTaskModal-content">
        <h2 className="text-white text-xl mb-3">Add New Task</h2>
        
        {/* Title Input */}
        <input
          className="AddTaskModal-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* Description Input */}
        <textarea
          className="AddTaskModal-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Date Input */}
        <label htmlFor="dueDate" className="text-white block mb-1">
          Due Date:
        </label>
        <input
          className="AddTaskModal-input"
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="AddTaskModal-button AddTaskModal-button-cancel"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              addTask(title, description, dueDate);
              closeModal();
            }}
            className="AddTaskModal-button AddTaskModal-button-add"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
