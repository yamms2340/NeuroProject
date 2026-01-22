import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import studyRoomRoutes from "./StudyRoomRoutes.js";
import Message from "./models/Message.js";

/* ================= APP SETUP ================= */
const app = express();
const HTTP_PORT = 3016;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
  })
);

/* ================= DB CONNECTION ================= */
mongoose.connect(
  "mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", err => {
  console.error("❌ MongoDB connection error:", err);
});

/* ================= TASK SCHEMA ================= */
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  dueDate: String,
  email: { type: String, required: true },
  completed: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  priority: { type: String, default: "medium" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

/* ================= ROUTES ================= */

/* ---- TEST ROUTE ---- */
app.get("/health", (_, res) => {
  res.json({ ok: true });
});

/* ---- GET TASKS ---- */
app.get("/getTasks/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log("📥 Fetch tasks for:", email);

    const tasks = await Task.find({ email }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Fetch tasks failed:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/* ---- ADD TASK (DEBUGGED) ---- */
app.post("/addTask", async (req, res) => {
  console.log("📥 Incoming addTask payload:", req.body);

  try {
    const { id, title, description, dueDate, email } = req.body;

    /* 🔴 VALIDATION (MOST COMMON FAILURE) */
    if (!id || !title || !email) {
      console.error("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        received: { id, title, email }
      });
    }

    /* 🔴 CHECK DUPLICATE ID */
    const existing = await Task.findOne({ id });
    if (existing) {
      console.error("❌ Duplicate task id:", id);
      return res.status(409).json({
        error: "Duplicate task id"
      });
    }

    const newTask = new Task({
      id,
      title,
      description,
      dueDate,
      email
    });

    const savedTask = await newTask.save();

    console.log("✅ Task saved to DB:", savedTask);
    res.status(201).json(savedTask);

  } catch (err) {
    console.error("❌ Add task crashed:", err);
    res.status(500).json({
      error: "Task insert failed",
      message: err.message
    });
  }
});

/* ---- DELETE TASK ---- */
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑 Delete task:", id);

    const deleted = await Task.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

app.put("/toggleTaskStatus/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("❌ Toggle status failed:", err);
    res.status(500).json({ error: "Toggle status failed" });
  }
});
app.put("/toggleTaskStar/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.starred = !task.starred;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("❌ Toggle star failed:", err);
    res.status(500).json({ error: "Toggle star failed" });
  }
});
app.put("/editTask/:id", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const updated = await Task.findOneAndUpdate(
      { id: req.params.id },
      { title, description, dueDate },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Edit failed:", err);
    res.status(500).json({ error: "Edit failed" });
  }
});

/* ================= STUDY ROOMS ================= */
app.use("/api", studyRoomRoutes);

app.listen(HTTP_PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${HTTP_PORT}`);
});

/* ================= SOCKET SERVER ================= */
const socketServer = createServer();
const io = new Server(socketServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
  }
});

io.on("connection", socket => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("send-message", async data => {
    const saved = await Message.create(data);
    io.emit("receive-message", saved);
  });
});

socketServer.listen(9000, () => {
  console.log("📡 Socket server running on 9000");
});
