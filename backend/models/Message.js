import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  sender: String,
  message: String,
  senderId: String,
senderName: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", messageSchema);
