import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";

export default function StudyRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // ✅ DEFINE BOTH
  const userEmail = localStorage.getItem("userEmail"); // unique
    const userName = userEmail.split("@")[0]; // abc


  /* ================= LOAD + SOCKET ================= */
  useEffect(() => {
    let active = true;

    async function loadMessages() {
      const res = await axios.get(
        `http://localhost:3016/api/rooms/${id}/messages`
      );
      if (active) setMessages(res.data);
    }

    loadMessages();

    socket.emit("join-room", { roomId: id });

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleReceive);

    return () => {
      active = false;
      socket.emit("leave-room", id);
      socket.off("receive-message", handleReceive);
    };
  }, [id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      roomId: id,
      senderId: userEmail,
      senderName: userName,
      message: text,
    });

    setText("");
  };

  /* ================= LEAVE ROOM ================= */
  const leaveRoom = () => {
    socket.emit("leave-room", id);
    navigate("/study-rooms");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-white shadow flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Study Room</h2>
        <button
          onClick={leaveRoom}
          className="px-4 py-1.5 text-sm bg-red-500 text-white rounded"
        >
          Leave
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => {
          const mine = m.senderId === userEmail;

          return (
            <div
              key={i}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
                mine
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-white text-gray-900 shadow"
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  mine ? "text-indigo-200 text-right" : "text-gray-400"
                }`}
              >
                {mine ? "You" : m.senderName}
              </div>

              <div>{m.message}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          className="
            flex-1 border border-gray-400 rounded-lg
            px-4 py-2 text-sm
            bg-white text-black placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
