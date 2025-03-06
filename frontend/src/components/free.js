export const addTaskToDB = async (id, title, description, time) => {
    try {
      const response = await fetch("http://localhost:3016/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description, time }),
      });
      const data = await response.json();
      console.log("✅ Task added:", data);
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  export const deleteTaskFromDB = async (id) => {
    try {
      const response = await fetch(`http://localhost:3016/deleteTask/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      console.log(`✅ Task ${id} deleted successfully`);

    } catch (error) {
      console.error("❌ Error deleting task:", error.message);
    }
  };

  export  const editTaskInDB = async (id, title, description, time) => {
    try {
      const updatedTask = { title, description, time };
      console.log("🔄 Sending update request:", updatedTask);
      const response = await fetch(`http://localhost:3016/editTask/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      console.log("✅ Task updated:", data);

      // Update the task in state
    
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };