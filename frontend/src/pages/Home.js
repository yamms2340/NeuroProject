import Sidebar from "../Sidebar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import { useNavigate } from "react-router-dom";
import '../index.css';

const Home = ({ filterTasks, filterType, tasks, filteredTasks, toggleStatus, deleteTask, toggleStar, editTask, showModal, setShowModal, addTask }) => {
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      window.location.href = "/signup"; 
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email"); 
      localStorage.setItem("userEmail", null); 


      const response = await fetch("http://localhost:8080/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send user email to logout
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token only on success
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Task Manager</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
        {tasks.length >= 0 ? (
          <TaskList
            tasks={filteredTasks}
            toggleStatus={toggleStatus}
            deleteTask={deleteTask}
            toggleStar={toggleStar}
            editTask={editTask}
            openAddTaskModal={() => setShowModal(true)}
          />
        ) : (
          <p className="text-white text-center">No tasks available</p>
        )}
      </div>
      {showModal && <AddTaskModal addTask={addTask} closeModal={() => setShowModal(false)} />}
    </div>

  );
};

export default Home;
