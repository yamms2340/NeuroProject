import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudyRooms() {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await axios.get("http://localhost:3016/api/rooms");
    setRooms(res.data);
  };

  /* ================= CREATE ROOM ================= */
  const submitCreateRoom = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:3016/api/rooms", {
        name,
        description,
      });

      setOpen(false);
      setName("");
      setDescription("");

      await loadRooms(); // refresh list only
    } catch (err) {
      console.error("Create room failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">Study Rooms</h1>
            <p className="text-gray-400 mt-2">
              Join a room and study together
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            + Create Room
          </button>
        </div>

        {/* Rooms List */}
        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            No study rooms available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {room.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {room.description || "No description provided"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full">
                    {room.membersCount} members
                  </span>

                 <button
  onClick={() => navigate(`/study-room/${room._id}`)}
  className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
>
  Join →
</button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-2xl w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
              Create Study Room
            </h2>

            <input
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-4 resize-none"
              rows={3}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={submitCreateRoom}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
