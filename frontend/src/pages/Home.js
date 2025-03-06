import Sidebar from "../Sidebar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import '../index.css'
const Home = ({ filterTasks, filterType, tasks, filteredTasks, toggleStatus, deleteTask, toggleStar, editTask, showModal, setShowModal, addTask }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar filterTasks={filterTasks} filterType={filterType} />
      <div className="w-3/4 p-5">
        {tasks.length > 0 ? (
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
