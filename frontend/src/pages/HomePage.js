import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Replace lucide-react imports with simple elements to avoid dependency issues
const Icon = ({ children, size = 20 }) => (
  <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);

// Main App Component

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('tasks');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // 0: normal, 1: larger, 2: largest

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

  // Progress data
  const progressData = [
    { name: "Tasks", value: 75 },
    { name: "Classes", value: 60 },
    { name: "Games", value: 90 },
    { name: "Weekly Goals", value: 45 }
  ];

  // Simple SVG icons instead of Lucide
  const icons = {
    menu: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    x: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    task: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>,
    graduation: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>,
    gamepad: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15" y2="13"></line><line x1="17" y1="11" x2="17" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    award: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
    adjust: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="5"></circle></svg>,
    running: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16M17 4v16M21 4v16M9 4v16M5 4v16M1 4v16"></path></svg>,
    type: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
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
      id: "classes",
      title: "Classes",
      icon: <Icon>{icons.graduation}</Icon>,
      content: "Your next class is Math at 2:00 PM. Don't forget to prepare!",
      badge: "1 today",
      action: "View All"
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

  // Navigation items
  const navItems = [
    { id: "tasks", label: "Tasks", icon: <Icon>{icons.task}</Icon> },
    { id: "classes", label: "Classes", icon: <Icon>{icons.graduation}</Icon> },
    { id: "games", label: "Games", icon: <Icon>{icons.gamepad}</Icon> },
    { id: "calendar", label: "Calendar", icon: <Icon>{icons.calendar}</Icon> },
    { id: "rewards", label: "Rewards", icon: <Icon>{icons.award}</Icon> }
  ];

  // Dynamic classes based on state
  const containerClasses = `
    flex min-h-screen w-full
    ${highContrast ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}
    ${fontSizeLevel === 1 ? 'text-lg' : fontSizeLevel === 2 ? 'text-xl' : 'text-base'}
    ${reducedMotion ? 'transition-none' : ''}
  `;

  const sidebarClasses = `
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    ${highContrast ? 'bg-gray-800' : 'bg-gray-100'} 
    fixed md:relative h-screen w-60 z-40 
    ${reducedMotion ? '' : 'transition-transform duration-300 ease-in-out'}
    shadow-md
  `;

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      window.location.href = "/signup"; 
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email"); 
      localStorage.setItem("userEmail", null); 


      const response = await fetch("http://localhost:8080/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send user email to logout
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token only on success
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleNavClick = (navItem) => {
   
    setActiveNav(navItem);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    console.log(navItem)
    console.log(navItem.id)

    if (navItem=='tasks') {
        navigate("/task");
      } else if (navItem=="calendar") {
        navigate("/calender");
      } else if (navItem===3) {
        navigate("/task3");
      } else {
        navigate("/default-task"); // Default route if no condition matches
      }
  };
  const handleJoinClass = () => {
    const roomNumber = prompt("Enter the Room Number:");
    if (roomNumber) {
      window.location.href = 'http://localhost:9000';

    }
  };


  return (

    <div className={containerClasses}>
      {/* Mobile menu toggle */}
      
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-indigo-500 text-white"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <Icon>{icons.x}</Icon> : <Icon>{icons.menu}</Icon>}
      </button>
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-5 text-center">
          <h2 className={`text-xl font-bold ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}`}>
            Learning Hub
          </h2>
          <p className="mt-2">Welcome back!</p>
        </div>
        
        {/* Navigation items */}
        <ul className="mt-6">
          {navItems.map((item) => (
            <li key={item.id} className="px-3 py-1">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center w-full px-4 py-3 rounded-lg
                  ${activeNav === item.id 
                    ? highContrast 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-indigo-100 text-indigo-700' 
                    : ''}
                  ${reducedMotion ? '' : 'transition-colors duration-200'}
                  hover:${highContrast ? 'bg-yellow-400' : 'bg-indigo-50'}
                `}
              >
                <span className="mr-3">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-4 w-full px-4">
          <button 
            onClick={handleLogout} 
            className="w-2/5 px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 mx-auto block text-center ml-0"
            >
            Logout
          </button>
        </div>
        <div>
        <button 
        onClick={handleJoinClass} 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-3 w-2/3 ml-2"
      >
        🎯 Join Class
      </button>
      </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 md:ml-0">
        {/* Progress section */}
        <section className={`
          p-6 rounded-xl mb-8
          ${highContrast ? 'bg-gray-900' : 'bg-white'} 
          shadow-md
        `}>
          <h2 className={`text-2xl font-bold mb-6 ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}`}>
            Your Progress
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {progressData.map((item) => (
              <div 
                key={item.name} 
                className="flex flex-col items-center"
              >
                <div 
                  className={`
                    relative w-24 h-24 rounded-full mb-2
                    ${reducedMotion ? '' : 'transition-transform duration-300'}
                    hover:scale-105
                  `}
                  style={{
                    background: `conic-gradient(
                      ${highContrast ? '#FFFF00' : '#6366F1'} ${item.value}%, 
                      ${highContrast ? '#555555' : '#E0E0E0'} 0
                    )`
                  }}
                >
                  <div className="absolute inset-2 rounded-full flex items-center justify-center bg-inherit">
                    <span className={`font-bold ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card) => (
            <div 
              key={card.id}
              onClick={() => handleNavClick(card.id)}
              className={`
                p-5 rounded-xl shadow-md cursor-pointer
                ${highContrast ? 'bg-gray-900' : 'bg-white'}
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
              
              <p className={`mb-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
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
    } else if (card.id === 3) {
      navigate("/task3");
    } else {
      navigate("/default-task"); // Default route if no condition matches
    }
  }} 
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-5 w-full"
>
  {card.id}
</button>

                 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Accessibility controls */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button 
          onClick={toggleContrast}
          className="p-3 rounded-full bg-gray-200 shadow-md hover:bg-gray-300"
          aria-label="Toggle high contrast mode"
        >
          <Icon>{icons.adjust}</Icon>
        </button>
        
        <button 
          onClick={toggleMotion}
          className="p-3 rounded-full bg-gray-200 shadow-md hover:bg-gray-300"
          aria-label="Toggle reduced motion"
        >
          <Icon>{icons.running}</Icon>
        </button>

        
        <button 
          onClick={cycleFontSize}
          className="p-3 rounded-full bg-gray-200 shadow-md hover:bg-gray-300"
          aria-label="Change font size"
        >
          <Icon>{icons.type}</Icon>
        </button>
      </div>
    
    </div>
  );
};

export default HomePage;