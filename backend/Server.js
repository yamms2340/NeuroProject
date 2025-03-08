import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: true
});

const PORT = 3016;
const SOCKET_PORT = 9000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  email: String,
  _id: String,
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: String }
});

const Task = mongoose.model("Task", taskSchema);

// ----------------------- Express Routes -----------------------
app.get("/", (req, res) => {
  console.log("GET Request /");
  res.sendFile(join(__dirname + "/app/index.html"));
});

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
    const { id, title, description, dueDate, email } = req.body;
    const newTask = new Task({ email, _id: String(id), title, description, dueDate });
    await newTask.save();
    console.log("New Task:", newTask, "Time:", dueDate);
    res.json({ message: "Task added successfully", task: newTask, time: dueDate });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
});

app.put("/editTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate },
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

// ----------------------- Socket.IO -----------------------
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
const allUsers = {};

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);


  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("join-user", (username) => {
    console.log(`${username} joined socket connection`);

    allUsers[username] = { username, id: socket.id };
    io.emit("joined", allUsers);
  });

  socket.on("offer", ({ from, to, offer }) => {
    console.log({ from, to, offer });
    io.to(allUsers[to].id).emit("offer", { from, to, offer });
  });

  socket.on("answer", ({ from, to, answer }) => {
    io.to(allUsers[from].id).emit("answer", { from, to, answer });
  });

  socket.on("end-call", ({ from, to }) => {
    io.to(allUsers[to].id).emit("end-call", { from, to });
  });

  socket.on("call-ended", (caller) => {
    const [from, to] = caller;
    io.to(allUsers[from].id).emit("call-ended", caller);
    io.to(allUsers[to].id).emit("call-ended", caller);
  });

  socket.on("icecandidate", (candidate) => {
    console.log({ candidate });
    socket.broadcast.emit("icecandidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    const email = socketIdToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketIdToEmailMap.delete(socket.id);
    }

    for (const user in allUsers) {
      if (allUsers[user].id === socket.id) {
        delete allUsers[user];
        io.emit("joined", allUsers);
        break;
      }
    }
  });
});

// ----------------------- Start Servers -----------------------
app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running on port ${PORT}`);

});

server.listen(SOCKET_PORT, () => {
console.log(`📡 Socket.IO Server running on port ${SOCKET_PORT}`);

});