import React, { useState } from 'react';
import './TaskStyles.css';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ filterTasks, filterType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("tasks");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const Icon = ({ children, size = 20, color }) => (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
      }}
    >
      {children}
    </div>
  );

  // Create a function to generate icons with dynamic stroke color
  const createIcon = (svgContent) => {
    return ({ color }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color} // Dynamically set the stroke color
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {svgContent}
      </svg>
    );
  };

  // Simple SVG icons
  const icons = {
    menu: createIcon(
      <>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </>
    ),
    x: createIcon(
      <>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </>
    ),
    home: createIcon(
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </>
    ),
    tasks: createIcon(
      <>
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
      </>
    ),
    games: createIcon(
      <>
        <line x1="6" y1="12" x2="10" y2="12"></line>
        <line x1="8" y1="10" x2="8" y2="14"></line>
        <line x1="15" y1="13" x2="15" y2="13"></line>
        <line x1="17" y1="11" x2="17" y2="11"></line>
        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      </>
    ),
    calendar: createIcon(
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </>
    ),
    progress: createIcon(
      <>
        <path d="M3 12l3 3 3-3M6 15V3M13 6l3 3 3-3M16 9V3M10 21h4"></path>
      </>
    ),
    class: createIcon(
      <>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </>
    ),
    logout: createIcon(
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </>
    ),
    important: createIcon(
      <>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </>
    ),
    completed: createIcon(
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </>
    ),
    incomplete: createIcon(
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </>
    ),
    all: createIcon(
      <>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </>
    ),
  };

  const navItems = [
    { id: "all", label: "All Tasks", icon: icons.all, filter: 'all' },
    { id: "important", label: "Important Tasks", icon: icons.important, filter: 'important' },
    { id: "completed", label: "Completed Tasks", icon: icons.completed, filter: 'completed' },
    { id: "incomplete", label: "Incomplete Tasks", icon: icons.incomplete, filter: 'incomplete' },
  ];

  const mainNavItems = [
    { id: "home", label: "Home", icon: icons.home },
    { id: "tasks", label: "Tasks", icon: icons.tasks },
    { id: "games", label: "Games", icon: icons.games },
    { id: "calendar", label: "Calendar", icon: icons.calendar },
    { id: "progress", label: "Progress", icon: icons.progress },
  ];

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    
    // Navigation based on ID for main nav
    switch (navId) {
      case "home":
        navigate("/homepage");
        break;
      case "tasks":
        navigate("/task");
        break;
      case "calendar":
        navigate("/calender");
        break;
      case "progress":
        navigate("/view");
        break;
      case 'games':
        navigate('/mathGame');
        break;
      default:
        // For task filters
        if (filterTasks) {
          filterTasks(navId);
        }
        break;
    }
  };

  const handleLogout = async () => {
    try {
      // Replace with your actual logout logic
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  return (
    <div
      className={`
        fixed md:relative z-50 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${
          darkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white border-gray-200"
        }
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Brand */}
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

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-4">
              Main Navigation
            </h3>
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex items-center w-full px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors
                      ${
                        activeNav === item.id ? "bg-indigo-100 font-medium" : ""
                      }
                      ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700"
                      }
                    `}
                  >
                    <span className="w-5 h-5 mr-3">
                      <Icon color={darkMode ? "white" : "currentColor"}>
                        {item.icon({
                          color: darkMode ? "white" : "currentColor",
                        })}
                      </Icon>
                    </span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Task Filters */}
          {filterTasks && (
            <div className="px-3">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-4">
                Task Filters
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.filter)}
                      className={`
                        flex items-center w-full px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors
                        ${
                          filterType === item.filter ? "bg-indigo-100 font-medium" : ""
                        }
                        ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700"
                        }
                      `}
                    >
                      <span className="w-5 h-5 mr-3">
                        <Icon color={darkMode ? "white" : "currentColor"}>
                          {item.icon({
                            color: darkMode ? "white" : "currentColor",
                          })}
                        </Icon>
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div
          className={`p-4 border-t space-y-3 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${
              darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"
            }`}
          >
            <span className="w-5 h-5 mr-3">
              <Icon color={darkMode ? "white" : "currentColor"}>
                {icons.logout({ color: darkMode ? "white" : "currentColor" })}
              </Icon>
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;