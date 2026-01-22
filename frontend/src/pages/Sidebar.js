import { useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const navItems = [
    { id: "tasks", label: "Tasks", path: "/task" },
    { id: "games", label: "Games", path: "/mathGame" },
    { id: "calendar", label: "Calendar", path: "/calender" },
    { id: "progress", label: "Progress", path: "/view" },
    { id: "study-rooms", label: "Study Rooms", path: "/study-rooms" },
  ];

  return (
    <aside
      className={`fixed md:relative z-40 w-64 h-full bg-white border-r
      transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      transition-transform duration-300`}
    >
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold text-indigo-700">Neuro Diversity</h1>
        <p className="text-sm text-gray-500">Learning Platform</p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
