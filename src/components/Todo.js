import { useState, useEffect } from "react";
import {
  PlusCircle,
  Check,
  Trash2,
  X,
  Moon,
  Sun,
  Menu,
  List,
  CalendarDays,
  Star,
  Sparkles,
  Eye,
  Info,
  Clock,
  Code,
  BellRing,
  Terminal,
  GitBranch,
  Github,
  Cpu,
  Brackets,
  LineChart,
  PieChart,
  BarChart,
  Calendar,
  X as XIcon,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import logo from "../assets/task.png";

const TodoApp = () => {
  // State for tasks and other UI elements
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            text: "Debug API authentication issue",
            completed: false,
            important: true,
            date: new Date().toLocaleDateString(),
            isNew: false,
            details:
              "Issue with JWT token validation in the authorization middleware",
            category: "backend",
            reminder: {
              date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
              time: "14:00",
            },
          },
          {
            id: 2,
            text: "Refactor Redux store structure",
            completed: true,
            important: false,
            date: new Date().toLocaleDateString(),
            isNew: false,
            details: "Implement slice pattern and normalize state",
            category: "frontend",
            reminder: null,
          },
          {
            id: 3,
            text: "Setup CI/CD pipeline",
            completed: false,
            important: true,
            date: new Date().toLocaleDateString(),
            isNew: false,
            details: "Configure GitHub Actions for testing and deployment",
            category: "devops",
            reminder: {
              date: new Date(Date.now() + 172800000)
                .toISOString()
                .split("T")[0],
              time: "10:00",
            },
          },
        ];
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editCategory, setEditCategory] = useState("frontend");
  const [editReminder, setEditReminder] = useState({ date: "", time: "" });
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [completionPosition, setCompletionPosition] = useState({ x: 0, y: 0 });
  const [animateIn, setAnimateIn] = useState(true);
  const [showStarEffect, setShowStarEffect] = useState(false);
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statsView, setStatsView] = useState("pie");
  const [showReminders, setShowReminders] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Category options
  const categories = [
    { id: "frontend", name: "Frontend", icon: <Brackets size={16} /> },
    { id: "backend", name: "Backend", icon: <Terminal size={16} /> },
    { id: "devops", name: "DevOps", icon: <GitBranch size={16} /> },
    { id: "design", name: "Design", icon: <Code size={16} /> },
    { id: "database", name: "Database", icon: <Cpu size={16} /> },
  ];

  // Historical data for line chart (mock data)
  const [historicalData] = useState([
    { day: "Mon", completed: 2, active: 5 },
    { day: "Tue", completed: 4, active: 4 },
    { day: "Wed", completed: 5, active: 3 },
    { day: "Thu", completed: 3, active: 6 },
    { day: "Fri", completed: 6, active: 2 },
    { day: "Sat", completed: 2, active: 1 },
    { day: "Sun", completed: 1, active: 3 },
  ]);

  // Initialize animation after component mount
  useEffect(() => {
    setTimeout(() => setAnimateIn(false), 500);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Check for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      tasks.forEach((task) => {
        if (
          task.reminder &&
          !task.completed &&
          task.reminder.date === currentDate &&
          task.reminder.time === currentTime
        ) {
          // In a real app, you'd show a notification here
          alert(`Reminder: ${task.text}`);
        }
      });

      setTimeElapsed((prev) => prev + 1);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks, timeElapsed]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    if (filter === "important") return task.important;
    if (filter.startsWith("category-")) {
      const categoryFilter = filter.replace("category-", "");
      return task.category === categoryFilter;
    }
    return true;
  });

  // Get upcoming reminders
  const upcomingReminders = tasks
    .filter((task) => task.reminder && !task.completed)
    .sort((a, b) => {
      const dateA = new Date(`${a.reminder.date}T${a.reminder.time}`);
      const dateB = new Date(`${b.reminder.date}T${b.reminder.time}`);
      return dateA - dateB;
    })
    .slice(0, 3);

  // Task handlers
  const addTask = () => {
    if (newTask.trim() === "") return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        important: false,
        date: new Date().toLocaleDateString(),
        isNew: true,
        details: "",
        category: "frontend", // Default category
        reminder: null,
      },
    ]);
    setNewTask("");

    // Remove the isNew flag after animation
    setTimeout(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) => ({ ...task, isNew: false }))
      );
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleComplete = (id, event) => {
    // Get element position for the sparkle animation
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setCompletionPosition({
        x: rect.x,
        y: rect.y,
      });
    }

    const taskBeingCompleted = tasks.find((task) => task.id === id);
    const isCompleting = !taskBeingCompleted?.completed;

    if (isCompleting) {
      setShowCompletionEffect(true);
      setTimeout(() => setShowCompletionEffect(false), 1000);
    }

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleImportant = (id, event) => {
    // Get element position for the star animation
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setStarPosition({
        x: rect.x,
        y: rect.y,
      });
    }

    const taskBeingStarred = tasks.find((task) => task.id === id);
    const isStarring = !taskBeingStarred?.important;

    if (isStarring) {
      setShowStarEffect(true);
      setTimeout(() => setShowStarEffect(false), 800);
    }

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, important: !task.important } : task
      )
    );
  };

  const deleteTask = (id) => {
    // Close details panel if the deleted task was selected
    if (selectedTask && selectedTask.id === id) {
      setDetailsOpen(false);
      setSelectedTask(null);
    }

    // Mark the task for deletion first (for animation)
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, deleting: true } : task))
    );

    // Actually remove after animation completes
    setTimeout(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }, 300);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDetails(task.details || "");
    setEditCategory(task.category || "frontend");
    setEditReminder(
      task.reminder ? { ...task.reminder } : { date: "", time: "" }
    );
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              text: editText,
              details: editDetails,
              category: editCategory,
              reminder:
                editReminder.date && editReminder.time ? editReminder : null,
            }
          : task
      )
    );

    // Update selected task if it was edited
    if (selectedTask && selectedTask.id === editingId) {
      const updatedTask = {
        ...selectedTask,
        text: editText,
        details: editDetails,
        category: editCategory,
        reminder: editReminder.date && editReminder.time ? editReminder : null,
      };
      setSelectedTask(updatedTask);
    }

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  // Get task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const importantTasks = tasks.filter((task) => task.important).length;

  // Category statistics
  const categoryCounts = {};
  categories.forEach((cat) => {
    categoryCounts[cat.id] = tasks.filter(
      (task) => task.category === cat.id
    ).length;
  });

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: categoryCounts[cat.id] || 0,
  }));

  const statusData = [
    { name: "Completed", value: completedTasks },
    { name: "Active", value: activeTasks },
  ];

  const categoryColors = [
    "#6366f1",
    "#3b82f6",
    "#38bdf8",
    "#a855f7",
    "#ec4899",
  ];
  const statusColors = ["#22c55e", "#3b82f6"];

  // Gojo-inspired styles with developer theme
  const getTaskCardStyle = (task) => {
    let baseStyle =
      "p-4 rounded-lg shadow-md border transition-all duration-300";

    // Base background and border colors - Developer-themed
    if (darkMode) {
      baseStyle += " bg-gray-900 bg-opacity-80";
      baseStyle += task.important ? " border-indigo-400" : " border-blue-900";
    } else {
      baseStyle += " bg-white bg-opacity-90";
      baseStyle += task.important ? " border-indigo-500" : " border-blue-200";
    }

    // Animation states
    if (task.isNew) {
      baseStyle += " transform scale-105 animate-pulse";
    }

    if (task.deleting) {
      baseStyle += " opacity-0 transform scale-95";
    } else {
      baseStyle +=
        " hover:shadow-lg hover:shadow-indigo-400/20 transform hover:-translate-y-1";
    }

    // Add category styling
    if (task.category === "frontend") {
      baseStyle += darkMode
        ? " border-l-4 border-l-indigo-500"
        : " border-l-4 border-l-indigo-400";
    } else if (task.category === "backend") {
      baseStyle += darkMode
        ? " border-l-4 border-l-blue-500"
        : " border-l-4 border-l-blue-400";
    } else if (task.category === "devops") {
      baseStyle += darkMode
        ? " border-l-4 border-l-green-500"
        : " border-l-4 border-l-green-400";
    } else if (task.category === "design") {
      baseStyle += darkMode
        ? " border-l-4 border-l-purple-500"
        : " border-l-4 border-l-purple-400";
    } else if (task.category === "database") {
      baseStyle += darkMode
        ? " border-l-4 border-l-cyan-500"
        : " border-l-4 border-l-cyan-400";
    }

    return baseStyle;
  };

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.icon : <Code size={16} />;
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Other";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-100 text-gray-800"
      }`}
    >
      {/* Code-like Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {darkMode ? (
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-indigo-500 blur-3xl animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-400 blur-3xl opacity-15 animate-pulse"></div>

            {/* Matrix-like code rain (stylized) */}
            <div className="grid grid-cols-12 gap-8 w-full h-full opacity-5">
              {Array(12)
                .fill()
                .map((_, i) => (
                  <div key={i} className="flex flex-col items-center text-xs">
                    {Array(30)
                      .fill()
                      .map((_, j) => (
                        <div
                          key={j}
                          className="font-mono text-green-500"
                          style={{
                            animationDelay: `${(i + j) * 0.1}s`,
                            opacity: Math.random() * 0.9 + 0.1,
                          }}
                        >
                          {String.fromCharCode(
                            Math.floor(Math.random() * 93) + 33
                          )}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-indigo-300 blur-3xl animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-300 blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-200 blur-3xl opacity-25 animate-pulse"></div>

            {/* Blueprint grid pattern */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Completion Effect - Developer themed */}
      {showCompletionEffect && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${completionPosition.x - 20}px`,
            top: `${completionPosition.y - 20}px`,
          }}
        >
          <div className="absolute">
            <div className="animate-ping relative">
              <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-70"></div>
              <Sparkles size={40} className="text-indigo-300" />
            </div>
          </div>
        </div>
      )}

      {/* Star Effect - Developer themed */}
      {showStarEffect && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${starPosition.x - 10}px`,
            top: `${starPosition.y - 10}px`,
          }}
        >
          <div className="absolute">
            <div className="animate-pulse relative">
              <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-70"></div>
              <Star size={30} className="text-amber-300" fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar - Mobile Toggle */}
        <div
          className={`lg:hidden flex justify-between items-center p-4 shadow-lg ${
            darkMode ? "bg-indigo-900" : "bg-indigo-600 text-white"
          } backdrop-blur-md bg-opacity-80 sticky top-0 z-30`}
        >
          <h1 className="text-xl font-bold flex items-center">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            TaskSage
          </h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          fixed lg:static inset-y-0 left-0 w-64 
          ${
            darkMode
              ? "bg-gray-900 bg-opacity-80 backdrop-blur-md border-r border-indigo-900"
              : "bg-white bg-opacity-80 backdrop-blur-md text-gray-800 border-r border-indigo-200"
          }
          transform transition-all duration-500 ease-in-out z-50
          overflow-y-auto
          shadow-xl
        `}
        >
          <div
            className={`p-5 ${
              animateIn
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-500"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold flex items-center">
                <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
                <span className="tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                  TaskSage
                </span>
              </h1>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  darkMode
                    ? "hover:bg-gray-800 text-indigo-400"
                    : "hover:bg-indigo-100 text-indigo-500"
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="space-y-4 mt-8">
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "all"
                      ? darkMode
                        ? "bg-indigo-900 bg-opacity-40 shadow-md shadow-indigo-500/20 transform translate-x-2"
                        : "bg-indigo-100 shadow-md shadow-indigo-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-indigo-50"
                  }`}
              >
                <List
                  size={20}
                  className={filter === "all" ? "text-indigo-400" : ""}
                />
                <span>All Tasks</span>
              </button>

              <button
                onClick={() => setFilter("active")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "active"
                      ? darkMode
                        ? "bg-indigo-900 bg-opacity-40 shadow-md shadow-indigo-500/20 transform translate-x-2"
                        : "bg-indigo-100 shadow-md shadow-indigo-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-indigo-50"
                  }`}
              >
                <CalendarDays
                  size={20}
                  className={filter === "active" ? "text-indigo-400" : ""}
                />
                <span>Active</span>
              </button>

              <button
                onClick={() => setFilter("completed")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "completed"
                      ? darkMode
                        ? "bg-indigo-900 bg-opacity-40 shadow-md shadow-indigo-500/20 transform translate-x-2"
                        : "bg-indigo-100 shadow-md shadow-indigo-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-indigo-50"
                  }`}
              >
                <Check
                  size={20}
                  className={filter === "completed" ? "text-indigo-400" : ""}
                />
                <span>Completed</span>
              </button>

              <button
                onClick={() => setFilter("important")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "important"
                      ? darkMode
                        ? "bg-indigo-900 bg-opacity-40 shadow-md shadow-indigo-500/20 transform translate-x-2"
                        : "bg-indigo-100 shadow-md shadow-indigo-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-indigo-50"
                  }`}
              >
                <Star
                  size={20}
                  className={filter === "important" ? "text-indigo-400" : ""}
                />
                <span>Important</span>
              </button>

              <div className="mt-6 mb-2 px-2">
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Categories
                </h3>
              </div>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(`category-${category.id}`)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                    ${
                      filter === `category-${category.id}`
                        ? darkMode
                          ? "bg-indigo-900 bg-opacity-40 shadow-md shadow-indigo-500/20 transform translate-x-2"
                          : "bg-indigo-100 shadow-md shadow-indigo-300/20 transform translate-x-2"
                        : darkMode
                        ? "hover:bg-gray-800"
                        : "hover:bg-indigo-50"
                    }`}
                >
                  <span
                    className={
                      filter === `category-${category.id}`
                        ? "text-indigo-400"
                        : ""
                    }
                  >
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                  Task Stats
                </h2>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setStatsView("pie")}
                    className={`p-1 rounded ${
                      statsView === "pie" ? "bg-indigo-500 bg-opacity-20" : ""
                    }`}
                  >
                    <PieChart
                      size={16}
                      className={statsView === "pie" ? "text-indigo-400" : ""}
                    />
                  </button>
                  <button
                    onClick={() => setStatsView("bar")}
                    className={`p-1 rounded ${
                      statsView === "bar" ? "bg-indigo-500 bg-opacity-20" : ""
                    }`}
                  >
                    <BarChart
                      size={16}
                      className={statsView === "bar" ? "text-indigo-400" : ""}
                    />
                  </button>
                  <button
                    onClick={() => setStatsView("line")}
                    className={`p-1 rounded ${
                      statsView === "line" ? "bg-indigo-500 bg-opacity-20" : ""
                    }`}
                  >
                    <LineChart
                      size={16}
                      className={statsView === "line" ? "text-indigo-400" : ""}
                    />
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-400/20 
                ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-80 border border-indigo-900"
                    : "bg-white bg-opacity-90 border border-indigo-200"
                }`}
              >
                {/* Different chart types */}
                {statsView === "pie" && (
                  <div className="h-48">
                    <h3
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Tasks by Category
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          label={(entry) => entry.name}
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                categoryColors[index % categoryColors.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {statsView === "bar" && (
                  <div className="h-48">
                    <h3
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Tasks by Status
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={statusData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={statusColors[index % statusColors.length]}
                            />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {statsView === "line" && (
                  <div className="h-48">
                    <h3
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Weekly Progress
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={historicalData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? "#374151" : "#e5e7eb"}
                        />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="#22c55e"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="active"
                          stroke="#3b82f6"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Reminders Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                  Reminders
                </h2>
                <button
                  onClick={() => setShowReminders(!showReminders)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {showReminders ? <Eye size={16} /> : <BellRing size={16} />}
                </button>
              </div>

              {showReminders && (
                <div
                  className={`p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-400/20 
                ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-80 border border-indigo-900"
                    : "bg-white bg-opacity-90 border border-indigo-200"
                }`}
                >
                  {upcomingReminders.length > 0 ? (
                    <ul className="space-y-2">
                      {upcomingReminders.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <Clock size={14} className="text-indigo-400" />
                          <div>
                            <p className="font-medium truncate w-40">
                              {task.text}
                            </p>
                            <p
                              className={
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              {task.reminder.date} • {task.reminder.time}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center italic">
                      No upcoming reminders
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Task Input */}
          <div
            className={`mb-8 ${
              animateIn
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-500"
            }`}
          >
            <div
              className={`flex items-center space-x-2 p-4 rounded-lg shadow-lg transition-all duration-300
              ${
                darkMode
                  ? "bg-gray-800 bg-opacity-80 border border-indigo-900"
                  : "bg-white bg-opacity-90 border border-indigo-200"
              }`}
            >
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new development task..."
                className={`flex-1 p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2
                ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                    : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                }`}
              />
              <button
                onClick={addTask}
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-300"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>

          {/* Task List */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4
          ${
            animateIn
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-700 delay-300"
          }`}
          >
            {filteredTasks.map((task) => (
              <div key={task.id} className={getTaskCardStyle(task)}>
                {editingId === task.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      className={`w-full p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2
                      ${
                        darkMode
                          ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                          : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                      }`}
                      autoFocus
                    />

                    <textarea
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      placeholder="Add details (optional)"
                      className={`w-full p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2 text-sm
                      ${
                        darkMode
                          ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                          : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                      }`}
                      rows={2}
                    />

                    <div className="flex flex-col space-y-2">
                      <label
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Category:
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className={`p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2
                        ${
                          darkMode
                            ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                            : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Set Reminder:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          value={editReminder.date}
                          onChange={(e) =>
                            setEditReminder({
                              ...editReminder,
                              date: e.target.value,
                            })
                          }
                          className={`flex-1 p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2
                          ${
                            darkMode
                              ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                              : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                          }`}
                        />
                        <input
                          type="time"
                          value={editReminder.time}
                          onChange={(e) =>
                            setEditReminder({
                              ...editReminder,
                              time: e.target.value,
                            })
                          }
                          className={`p-2 rounded-md transition-colors duration-300 outline-none focus:ring-2
                          ${
                            darkMode
                              ? "bg-gray-700 border border-gray-600 focus:ring-indigo-500"
                              : "bg-slate-50 border border-slate-200 focus:ring-indigo-400"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEdit}
                        className={`p-2 rounded-md transition-colors duration-300
                        ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={saveEdit}
                        className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-300"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => toggleComplete(task.id, e)}
                          className={`p-2 rounded-full transition-colors duration-300
                            ${
                              task.completed
                                ? "bg-green-500 text-white"
                                : darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                            }`}
                        >
                          <Check size={16} />
                        </button>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-md
                          ${getCategoryIcon(task.category)} ${
                            darkMode
                              ? "bg-gray-800 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="flex items-center space-x-1">
                            {getCategoryIcon(task.category)}
                            <span className="ml-1">
                              {getCategoryName(task.category)}
                            </span>
                          </span>
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {task.reminder && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded flex items-center
                            ${
                              darkMode
                                ? "bg-blue-900 bg-opacity-40 text-blue-300"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <Clock size={12} className="mr-1" />
                            {new Date(task.reminder.date).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-medium mb-2 ${
                        task.completed ? "line-through opacity-70" : ""
                      }`}
                      onClick={() => viewTaskDetails(task)}
                    >
                      {task.text}
                    </h3>

                    {task.details && (
                      <p
                        className={`text-sm mb-4 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } ${task.completed ? "line-through opacity-70" : ""}`}
                      >
                        {task.details.length > 100
                          ? task.details.substring(0, 100) + "..."
                          : task.details}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {task.date}
                      </span>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(task)}
                          className={`p-2 rounded-full transition-colors duration-300 
                          ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                          }`}
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={(e) => toggleImportant(task.id, e)}
                          className={`p-2 rounded-full transition-colors duration-300 
                          ${
                            task.important
                              ? "bg-amber-500 text-white"
                              : darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                          }`}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className={`p-2 rounded-full transition-colors duration-300 
                          ${
                            darkMode
                              ? "bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-white"
                              : "bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div
                className={`col-span-full p-8 rounded-lg text-center transition-all duration-300
                ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-80 border border-indigo-900"
                    : "bg-white bg-opacity-90 border border-indigo-200"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Github size={40} className="text-indigo-500 opacity-50" />
                  <h3 className="text-xl font-medium">No tasks found</h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Create a new task or switch filters to see more
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Details Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-80 transform transition-transform duration-500 ease-in-out z-40
          ${detailsOpen ? "translate-x-0" : "translate-x-full"}
          ${
            darkMode
              ? "bg-gray-900 bg-opacity-80 backdrop-blur-md border-l border-indigo-900"
              : "bg-white bg-opacity-80 backdrop-blur-md text-gray-800 border-l border-indigo-200"
          }
          overflow-y-auto
          shadow-xl
        `}
        >
          {selectedTask && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                  Task Details
                </h2>
                <button
                  onClick={() => setDetailsOpen(false)}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    darkMode
                      ? "hover:bg-gray-800 text-indigo-400"
                      : "hover:bg-indigo-100 text-indigo-500"
                  }`}
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Task
                  </label>
                  <h3
                    className={`text-lg font-medium ${
                      selectedTask.completed ? "line-through opacity-70" : ""
                    }`}
                  >
                    {selectedTask.text}
                  </h3>
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </label>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${
                        selectedTask.completed
                          ? darkMode
                            ? "bg-green-900 bg-opacity-40 text-green-400"
                            : "bg-green-100 text-green-700"
                          : darkMode
                          ? "bg-blue-900 bg-opacity-40 text-blue-400"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedTask.completed ? "Completed" : "Active"}
                    </span>
                    {selectedTask.important && (
                      <span
                        className={`px-2 py-1 rounded-md text-sm font-medium ${
                          darkMode
                            ? "bg-amber-900 bg-opacity-40 text-amber-400"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        Important
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Category
                  </label>
                  <div className="flex items-center space-x-2">
                    <span>{getCategoryIcon(selectedTask.category)}</span>
                    <span>{getCategoryName(selectedTask.category)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Details
                  </label>
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } ${
                      selectedTask.completed ? "line-through opacity-70" : ""
                    }`}
                  >
                    {selectedTask.details || "No details provided"}
                  </p>
                </div>

                {selectedTask.reminder && (
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Reminder
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-indigo-400" />
                      <span>{selectedTask.reminder.date}</span>
                      <Clock size={16} className="text-indigo-400 ml-2" />
                      <span>{selectedTask.reminder.time}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Created
                  </label>
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {selectedTask.date}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-700 flex space-x-2">
                  <button
                    onClick={() => startEdit(selectedTask)}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors duration-300 
                    ${
                      darkMode
                        ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                        : "bg-indigo-500 hover:bg-indigo-400 text-white"
                    }`}
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => deleteTask(selectedTask.id)}
                    className={`py-2 px-4 rounded-md transition-colors duration-300 
                    ${
                      darkMode
                        ? "bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-white"
                        : "bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
