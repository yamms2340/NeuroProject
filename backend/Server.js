const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3016;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  email:String,
  _id: String,
  title: { type: String, required: true },
  description:{type:String},
  dueDate:{type:String}
});

const Task = mongoose.model("Task", taskSchema);
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});
app.post("/addTask", async (req, res) => {
  try {
    const { id, title,description,dueDate,email } = req.body;
    const newTask = new Task({ email,_id: String(id), title,description,dueDate});
    await newTask.save();
    console.log("neww",newTask,"time",dueDate)
    res.json({ message: "Task added successfully", task: newTask,time:dueDate });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
});
app.put("/editTask/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description ,dueDate} = req.body;
  
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description,dueDate },
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
  console.log("🚀 Backend running..");
});