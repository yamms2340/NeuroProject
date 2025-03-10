import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import { useNavigate } from "react-router-dom";
import './Task.css'; // Import the CSS file

const Task = ({ filterTasks, filterType, tasks, filteredTasks, toggleStatus, deleteTask, toggleStar, editTask, showModal, setShowModal, addTask }) => {
  const navigate = useNavigate();

  return (
    <div className="Task-container">
      <Sidebar className="Task-sidebar" filterTasks={filterTasks} filterType={filterType} />
      <div className="Task-main">
       
        {tasks.length >= 0 ? (
          <div className="Task-list-container">
            <TaskList
              tasks={filteredTasks}
              toggleStatus={toggleStatus}
              deleteTask={deleteTask}
              toggleStar={toggleStar}
              editTask={editTask}
              openAddTaskModal={() => setShowModal(true)}
            />
          </div>
        ) : (
          <p className="Task-no-tasks">No tasks available</p>
        )}
       
      </div>
      {showModal && (
        <div className="Modal-container">
          <AddTaskModal
            className="Modal-content"
            addTask={addTask}
            closeModal={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Task;
