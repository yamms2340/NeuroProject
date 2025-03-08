import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar({ filterTasks }) {
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleJoinClass = () => {
    const roomNumber = prompt("Enter the Room Number:");
    if (roomNumber) {
      toast.success(`Joining room ${roomNumber}...`);
      console.log(`Navigating to room: ${roomNumber}`);
      navigate(`/join/${roomNumber}`);
    } else {
      toast.error("Room number is required to join.");
    }
  };
=======
  
>>>>>>> 7bb114f8cbd3341345b71bf3528b819be1ccff18

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
      
      

      {/* Join Class Button */}
    
    </div>
  );
}
