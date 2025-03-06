import React, { useState } from "react";

export default function AddTaskModal({ addTask, closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-900 p-5 rounded-lg w-96">
        <h2 className="text-white text-xl mb-3">Add New Task</h2>
        
        {/* Title Input */}
        <input
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* Description Input */}
        <textarea
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Date Input */}
        <label htmlFor="dueDate" className="text-white block mb-1">
          Due Date:
        </label>
        <input
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-red-500 px-3 py-2 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              addTask(title, description, dueDate);
              closeModal();
            }}
            className="bg-green-500 px-3 py-2 rounded text-white"
          >
            Add
          </button>
        </div>
      </div>
 </div>
);
}