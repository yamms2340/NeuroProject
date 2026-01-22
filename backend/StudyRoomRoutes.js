import express from "express";
import mongoose from "mongoose";
import Message from "./models/Message.js";

const router = express.Router();

/* ================= STUDY ROOM MODEL ================= */
const studyRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  membersCount: { type: Number, default: 0 },
});

const StudyRoom = mongoose.model("StudyRoom", studyRoomSchema);

/* ================= ROUTES ================= */

// GET all rooms
router.get("/rooms", async (_, res) => {
  const rooms = await StudyRoom.find();
  res.json(rooms);
});

// CREATE room
router.post("/rooms", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Room name required" });

  const room = await StudyRoom.create({
    name,
    description,
    membersCount: 0,
  });

  res.status(201).json(room);
});

// ✅ GET messages for room (ONLY HERE)
router.get("/rooms/:roomId/messages", async (req, res) => {
  console.log("FETCH MESSAGES FOR:", req.params.roomId);

  const messages = await Message.find({
    roomId: req.params.roomId,
  }).sort({ createdAt: 1 });

  console.log("FOUND:", messages.length);
  res.json(messages);
});


export default router;
