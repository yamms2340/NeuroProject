import React, { useState } from "react";

export default function TaskCard({ task, toggleStatus, deleteTask, toggleStar, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDueTime, setDueDate] = useState(task.dueTime);
  const [newDescription, setDescription] = useState(task.description);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full relative">
      {isEditing ? (
        <>
          <input
            className="bg-gray-700 p-1 rounded w-full mb-2"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="bg-gray-700 p-1 rounded w-full mb-2"
            value={newDescription}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="bg-gray-700 p-1 rounded w-full mb-2"
            type="datetime-local"
            value={newDueTime}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </>
      ) : (
        <>
          <h3 className="text-white font-bold">{task.title}</h3>
          <p className="text-gray-400 text-sm">{task.description}</p>
        </>
      )}

      <div className="flex justify-between mt-2">
        <button
          onClick={() => toggleStatus(task.id)}
          className={`px-3 py-1 rounded ${task.status === "completed" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {task.status === "completed" ? "Completed" : "Incomplete"}
        </button>

        <div className="space-x-2">
          <button onClick={() => toggleStar(task.id)} className="text-yellow-400 text-xl">
            {task.important ? "⭐" : "☆"}
          </button>
          {isEditing ? (
            <button
              onClick={() => {
                editTask(task.id, newTitle, newDescription, newDueTime);
                setIsEditing(false);
              }}
              className="bg-green-500 px-2 py-1 rounded text-white"
            >
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-gray-600 px-2 py-1 rounded text-white">
              ✏
            </button>
          )}
          <button onClick={() => deleteTask(task.id)} className="bg-red-500 px-2 py-1 rounded text-white">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
