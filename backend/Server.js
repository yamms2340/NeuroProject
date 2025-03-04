const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3016;

// Middleware
app.use(express.json());
app.use(cors());  // ✅ Allow frontend (port 3000) to access backend

// MongoDB Connection
mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, required: true },
  description:{type:String},
  time:{type:String}
});

const Task = mongoose.model("Task", taskSchema);

// API to add a task
app.post("/addTask", async (req, res) => {
  try {
    const { id, title,description } = req.body;
    const newTask = new Task({ _id: String(id), title,description});
    await newTask.save();
    res.json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
});
app.put("/editTask/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      res.json({ message: "✅ Task updated successfully", task: updatedTask });
    } catch (error) {
      console.error("❌ Error updating task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
app.delete("/deleteTask/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json({ message: "✅ Task deleted successfully", task: deletedTask });
    } catch (error) {
      res.status(500).json({ message: "❌ Error deleting task", error: error.message });
    }
  });
  
// Start the server
app.listen(3016, () => {
  console.log(`🚀 Backend running ...}`);
});
