import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const cardData = [
    {
      id: "tasks",
      title: "Tasks",
      content: "You have tasks to complete today.",
      badge: "Pending",
      action: "View",
      route: "/task",
    },
    {
      id: "progress",
      title: "Progress",
      content: "Track your learning journey.",
      badge: "Insights",
      action: "View",
      route: "/view",
    },
    {
      id: "games",
      title: "Games",
      content: "Play games to improve focus.",
      badge: "New",
      action: "Play",
      route: "/mathGame",
    },
    {
      id: "calendar",
      title: "Calendar",
      content: "Check upcoming events.",
      badge: "This Week",
      action: "Open",
      route: "/calender",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to Neuro Diversity
        </h2>
        <p className="opacity-90">
          Your personalized learning journey continues today.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              {card.title}
            </h3>
            <p className="text-gray-500 mb-4">{card.content}</p>

            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full text-xs bg-indigo-600 text-white">
                {card.badge}
              </span>
              <span className="text-indigo-600 font-medium">
                {card.action} →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
