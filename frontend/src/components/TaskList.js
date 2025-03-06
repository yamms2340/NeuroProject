import TaskCard from "./TaskCard";

export default function TaskList({ tasks, toggleStatus, deleteTask, toggleStar, editTask, openAddTaskModal }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Render tasks if available */}
      {tasks.length >=0 ? (
        tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            toggleStatus={toggleStatus} 
            deleteTask={deleteTask} 
            toggleStar={toggleStar} 
            editTask={editTask} 
          />
        ))
      ) : (
        <p className="text-gray-500 col-span-2 text-center">No tasks available.</p>
      )}

      {/* Always show Add Task button */}
      <div 
        onClick={openAddTaskModal} 
        className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-center items-center text-white cursor-pointer col-span-2"
      >
        <span className="text-2xl">➕ Add Task</span>
      </div>
    </div>
  );
}
