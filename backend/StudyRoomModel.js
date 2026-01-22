import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  membersCount: { type: Number, default: 0 }
});

export default mongoose.model("StudyRoom", studyRoomSchema);
