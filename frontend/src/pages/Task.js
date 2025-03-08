import Sidebar from "../Sidebar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import { useNavigate } from "react-router-dom";
import '../index.css';

const Home = ({ filterTasks, filterType, tasks, filteredTasks, toggleStatus, deleteTask, toggleStar, editTask, showModal, setShowModal, addTask }) => {
  const navigate = useNavigate();
  

  
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Task Manager</h1>
         
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
