import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  darkMode,
  onJoinClass,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= ICON SYSTEM ================= */
  const createIcon = (svgContent) => {
    return ({ color }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {svgContent}
      </svg>
    );
  };

  const icons = {
    tasks: createIcon(
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
    games: createIcon(
      <>
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <rect x="2" y="6" width="20" height="12" rx="2" />
      </>
    ),
    calendar: createIcon(
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    progress: createIcon(
      <>
        <path d="M3 12l3 3 3-3" />
        <path d="M6 15V3" />
        <path d="M13 6l3 3 3-3" />
        <path d="M16 9V3" />
      </>
    ),
    class: createIcon(
      <>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
    logout: createIcon(
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { label: "Tasks", path: "/task", icon: icons.tasks },
    { label: "Games", path: "/mathGame", icon: icons.games },
    { label: "Calendar", path: "/calender", icon: icons.calendar },
    { label: "Progress", path: "/view", icon: icons.progress },
    { label: "Study Rooms", path: "/study-rooms", icon: icons.class },
  ];

  const IconWrapper = ({ children }) => (
    <span className="w-5 h-5 mr-3 flex items-center justify-center">
      {children}
    </span>
  );

  return (
    <div
      className={`
        fixed md:relative z-50 h-full w-64 shadow-lg transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${darkMode ? "bg-gray-800 text-white" : "bg-white"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={`p-5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h1 className="text-xl font-bold text-indigo-700">
            Neuro Diversity
          </h1>
          <p className="text-sm text-gray-500">
            Professional Learning Platform
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center w-full px-4 py-3 rounded-lg transition
                      ${
                        isActive
                          ? "bg-indigo-100 font-medium"
                          : ""
                      }
                      ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-indigo-50"
                      }
                    `}
                  >
                    <IconWrapper>
                      {item.icon({
                        color: darkMode ? "white" : "currentColor",
                      })}
                    </IconWrapper>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t space-y-3 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onJoinClass}
            className="flex items-center w-full px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <IconWrapper>
              {icons.class({ color: "white" })}
            </IconWrapper>
            Join Class
          </button>

          <button
            onClick={onLogout}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition
              ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }
            `}
          >
            <IconWrapper>
              {icons.logout({
                color: darkMode ? "white" : "currentColor",
              })}
            </IconWrapper>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
