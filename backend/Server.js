import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import studyRoomRoutes from "./StudyRoomRoutes.js";
import Message from "./models/Message.js";

/* ================= HTTP SERVER ================= */
const app = express();
const HTTP_PORT = 3016;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

mongoose.connect(
  "mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.once("open", () =>
  console.log("✅ MongoDB connected")
);

app.use("/api", studyRoomRoutes);

app.get("/api/test", (_, res) => res.json({ ok: true }));

app.listen(HTTP_PORT, () =>
  console.log(`🚀 HTTP server running on ${HTTP_PORT}`)
);

/* ================= SOCKET SERVER ================= */
const socketServer = createServer();
const io = new Server(socketServer, {
  cors: { origin: "http://localhost:3000" },
});

const SOCKET_PORT = 9000;

io.on("connection", socket => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });
  

  
 socket.on("send-message", async ({ roomId, senderId, senderName, message }) => {
  const saved = await Message.create({
    roomId,
    senderId,
    senderName,
    message,
  });

  io.to(roomId).emit("receive-message", saved);
});


  socket.on("leave-room", roomId => socket.leave(roomId));
});

socketServer.listen(SOCKET_PORT, () =>
  console.log(`📡 Socket.IO running on ${SOCKET_PORT}`)
);
