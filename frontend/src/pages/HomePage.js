import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfessionalHomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // 0: normal, 1: larger, 2: largest

  const Icon = ({ children, size = 20 }) => (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );

  // Simple SVG icons
  const icons = {
    menu: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    x: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
    tasks: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>,
    games: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15" y2="13"></line><line x1="17" y1="11" x2="17" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    progress: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l3 3 3-3M6 15V3M13 6l3 3 3-3M16 9V3M10 21h4"></path></svg>,
    rewards: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
    resources: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    class: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>,
    accessibility: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>,
    running: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16M17 4v16M21 4v16M9 4v16M5 4v16M1 4v16"></path></svg>,
    gamepad: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15" y2="13"></line><line x1="17" y1="11" x2="17" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>,
    task: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>,
    graduation: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>,
    adjust: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="5"></circle></svg>,
    type: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>

  };

  const navItems = [
    { id: "tasks", label: "Tasks", icon: icons.tasks },
    { id: "games", label: "Games", icon: icons.games },
    { id: "calendar", label: "Calendar", icon: icons.calendar },
    { id: "progress", label: "Progress", icon: icons.progress },
  ];


  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Navigation based on ID
    switch (navId) {
      case 'tasks':
        navigate('/task');
        break;
      case 'calendar':
        navigate('/calender');
        break;
      case 'progress':
        navigate('/view');
        break;
      case 'games':
        navigate('/mathGame');
        break;
      default:
        // Stay on dashboard/homepage
        break;
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toggleContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const cycleFontSize = () => {
    setFontSizeLevel((fontSizeLevel + 1) % 3);
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleJoinClass = () => {
    const roomNumber = prompt("Enter the Room Number:");
    if (roomNumber) {
      window.location.href = 'http://localhost:9000';
    }
  };
  const cardData = [
    {
      id: "tasks",
      title: "Tasks",
      icon: <Icon>{icons.task}</Icon>,
      content: "You have 3 tasks due today. Complete them to earn points!",
      badge: "3 pending",
      action: "View All"
    },
    {
      id: "progress",
      title: "Progress",
      icon: <Icon>{icons.progress}</Icon>,
      content: "Track your learning journey.",
      badge: "Detailed Insights",
      action: "View"
    },
    {
      id: "games",
      title: "Games",
      icon: <Icon>{icons.gamepad}</Icon>,
      content: "Try out new memory games to boost your cognitive skills!",
      badge: "5 new",
      action: "Play Now"
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: <Icon>{icons.calendar}</Icon>,
      content: "View your upcoming events and deadlines for the week.",
      badge: "Weekly View",
      action: "Open"
    }
  ];


  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div
        className={`
        fixed md:relative z-50 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className="text-xl font-bold text-indigo-700">Neuro Diversity</h1>
            <p className="text-sm text-gray-500">Professional Learning Platform</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors
                      ${activeNav === item.id ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}
                      ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}
                    `}
                  >
                    <span className="w-5 h-5 mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className={`p-4 border-t space-y-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button onClick={handleJoinClass} className="flex items-center w-full px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <span className="w-5 h-5 mr-3">{icons.class}</span>
              <span>Join Class</span>
            </button>

            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}">
              <span className="w-5 h-5 mr-3">{icons.logout}</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`shadow-sm z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex items-center justify-between h-16 px-6">
            <button className="md:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span className="w-6 h-6">{sidebarOpen ? icons.x : icons.menu}</span>
            </button>

            <div className="flex-1 md:ml-8">
            </div>

            <div className="flex items-center">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2" aria-label="Dark Mode">
                <span className="w-6 h-6">{icons.adjust}</span>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2" aria-label="Settings" onClick={toggleContrast}>
                <span className="w-6 h-6">{icons.settings}</span>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2" aria-label="Accessibility Options" onClick={toggleMotion}>
                <span className="w-6 h-6">{icons.running}</span>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Font Size" onClick={cycleFontSize}>
                <span className="w-6 h-6">{icons.type}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome to Neuro Diversity</h2>
            <p className="opacity-90 mb-4">Your personalized learning journey continues today!</p>
            <div className="flex items-center text-white bg-white bg-opacity-20 p-3 rounded-lg">
              <div className="flex-shrink-0 p-3 bg-white bg-opacity-30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm opacity-80">Last session</div>
                <div className="font-medium">Yesterday at 3:42 PM</div>
              </div>
            </div>
          </div>
          <div className="pt-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {cardData.map((card) => (
              <div
                key={card.id}
                onClick={() => handleNavClick(card.id)}
                className={`
                 p-5 rounded-xl shadow-md cursor-pointer
                ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}
                ${highContrast ? 'border-2 border-yellow-500' : ''}
                ${reducedMotion ? '' : 'transition-all duration-300'}
                hover:shadow-lg
              `}
              >
                <div className="flex items-center mb-4">
                  <div className={`
                  p-2 rounded-lg mr-3
                  ${highContrast ? 'bg-yellow-500' : 'bg-indigo-100'}
                `}>
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                </div>

                <p className={`mb-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'} ${darkMode ? 'text-gray-400' : ''}`}>
                  {card.content}
                </p>

                <div className="flex justify-between items-center">
                  <span className={`
                  px-3 py-1 rounded-full text-xs
                  ${highContrast ? 'bg-cyan-500 text-black' : 'bg-orange-500 text-white'}
                `}>
                    {card.badge}
                  </span>
                  <button className={`
                  ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}
                  font-medium
                `}>
                    <button
                      onClick={() => {
                        if (card.id == "tasks") {
                          navigate("/task");
                        } else if (card.id == "calendar") {
                          navigate("/calender");
                        }
                      }}
                    >
                      {card.action}
                    </button>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalHomePage;
