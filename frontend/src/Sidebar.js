import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Sidebar({ filterTasks }) {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="w-1/4 bg-gray-800 p-5 text-white min-h-screen">
      <h2 className="text-xl font-bold">heyy</h2>
      <p className="text-gray-400">Manage your Tasks now..</p>
      <ul className="mt-5 space-y-2">
        <li onClick={() => filterTasks("all")} className="cursor-pointer hover:text-gray-300">
          📋 All Tasks
        </li>
        <li onClick={() => filterTasks("important")} className="cursor-pointer hover:text-gray-300">
          ⭐ Important Tasks
        </li>
        <li onClick={() => filterTasks("completed")} className="cursor-pointer hover:text-gray-300">
          ✅ Completed Tasks
        </li>
        <li onClick={() => filterTasks("incomplete")} className="cursor-pointer hover:text-gray-300">
          ❌ Incomplete Tasks
        </li>
      </ul>

      {/* Calendar View Button */}
      <button 
        onClick={() => navigate("/calender")} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-5"
      >
        📅 Calendar View
      </button>
    </div>
  );
}
