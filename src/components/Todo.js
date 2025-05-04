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
} from "lucide-react";
import task from "../assets/task.png";

const TodoApp = () => {
  // State for tasks and other UI elements
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [completionPosition, setCompletionPosition] = useState({ x: 0, y: 0 });
  const [animateIn, setAnimateIn] = useState(true);
  const [showStarEffect, setShowStarEffect] = useState(false);
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });

  // Initialize animation after component mount
  useEffect(() => {
    setTimeout(() => setAnimateIn(false), 500);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    if (filter === "important") return task.important;
    return true;
  });

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
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, text: editText } : task
      )
    );
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

  // Get task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  // Gojo-inspired styles
  const getTaskCardStyle = (task) => {
    let baseStyle =
      "p-4 rounded-lg shadow-md border transition-all duration-300";

    // Base background and border colors - Gojo inspired
    if (darkMode) {
      baseStyle += " bg-gray-900 bg-opacity-80";
      baseStyle += task.important ? " border-blue-400" : " border-blue-900";
    } else {
      baseStyle += " bg-white bg-opacity-90";
      baseStyle += task.important ? " border-blue-500" : " border-blue-200";
    }

    // Animation states
    if (task.isNew) {
      baseStyle += " transform scale-105 animate-pulse";
    }

    if (task.deleting) {
      baseStyle += " opacity-0 transform scale-95";
    } else {
      baseStyle +=
        " hover:shadow-lg hover:shadow-blue-400/20 transform hover:-translate-y-1";
    }

    return baseStyle;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-800"
      }`}
      style={{
        backgroundImage: `url('data:image/jpeg;base64,YOUR_IMAGE_BASE64_HERE')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Anime-style Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {darkMode ? (
          <>
            {/* Dark mode animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-500 blur-3xl animate-pulse"></div>
              <div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-600 blur-3xl opacity-20 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-blue-400 blur-3xl opacity-15 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </>
        ) : (
          <>
            {/* Light mode animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-300 blur-3xl animate-pulse"></div>
              <div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-300 blur-3xl opacity-30 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-blue-200 blur-3xl opacity-25 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Completion Effect - Gojo's blue energy */}
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
              <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-70"></div>
              <Sparkles size={40} className="text-blue-300" />
            </div>
          </div>
        </div>
      )}

      {/* Star Effect - Anime style sparkle */}
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
              <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-70"></div>
              <Star size={30} className="text-yellow-300" fill="currentColor" />
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
            darkMode ? "bg-blue-900" : "bg-blue-500 text-white"
          } backdrop-blur-md bg-opacity-80 sticky top-0 z-30`}
        >
          <h1 className="text-xl font-bold flex items-center">
            <img src={task} alt="Logo" className="w-10 h-10 mr-2" />
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
              ? "bg-gray-900 bg-opacity-80 backdrop-blur-md border-r border-blue-900"
              : "bg-white bg-opacity-80 backdrop-blur-md text-gray-800 border-r border-blue-200"
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
                <img src={task} alt="Logo" className="w-10 h-10 mr-2" />
                <span className="tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  TaskSage
                </span>
              </h1>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  darkMode
                    ? "hover:bg-gray-800 text-blue-400"
                    : "hover:bg-blue-100 text-blue-500"
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
                        ? "bg-blue-900 bg-opacity-40 shadow-md shadow-blue-500/20 transform translate-x-2"
                        : "bg-blue-100 shadow-md shadow-blue-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-blue-50"
                  }`}
              >
                <List
                  size={20}
                  className={filter === "all" ? "text-blue-400" : ""}
                />
                <span>All Tasks</span>
              </button>

              <button
                onClick={() => setFilter("active")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "active"
                      ? darkMode
                        ? "bg-blue-900 bg-opacity-40 shadow-md shadow-blue-500/20 transform translate-x-2"
                        : "bg-blue-100 shadow-md shadow-blue-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-blue-50"
                  }`}
              >
                <CalendarDays
                  size={20}
                  className={filter === "active" ? "text-blue-400" : ""}
                />
                <span>Active</span>
              </button>

              <button
                onClick={() => setFilter("completed")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "completed"
                      ? darkMode
                        ? "bg-blue-900 bg-opacity-40 shadow-md shadow-blue-500/20 transform translate-x-2"
                        : "bg-blue-100 shadow-md shadow-blue-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-blue-50"
                  }`}
              >
                <Check
                  size={20}
                  className={filter === "completed" ? "text-blue-400" : ""}
                />
                <span>Completed</span>
              </button>

              <button
                onClick={() => setFilter("important")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
                  ${
                    filter === "important"
                      ? darkMode
                        ? "bg-blue-900 bg-opacity-40 shadow-md shadow-blue-500/20 transform translate-x-2"
                        : "bg-blue-100 shadow-md shadow-blue-300/20 transform translate-x-2"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-blue-50"
                  }`}
              >
                <Star
                  size={20}
                  className={filter === "important" ? "text-blue-400" : ""}
                />
                <span>Important</span>
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 space-y-4">
              <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Task Stats
              </h2>

              <div
                className={`p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 
                ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-80 border border-blue-900"
                    : "bg-white bg-opacity-80 border border-blue-200"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Tasks
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                >
                  {totalTasks}
                </p>
              </div>

              <div className="flex space-x-2">
                <div
                  className={`p-4 rounded-lg flex-1 shadow-lg transition-all duration-300 hover:scale-105
                  ${
                    darkMode
                      ? "bg-gray-800 bg-opacity-80 border border-blue-900"
                      : "bg-white bg-opacity-80 border border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Active
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  >
                    {activeTasks}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg flex-1 shadow-lg transition-all duration-300 hover:scale-105
                  ${
                    darkMode
                      ? "bg-gray-800 bg-opacity-80 border border-blue-900"
                      : "bg-white bg-opacity-80 border border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Completed
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  >
                    {completedTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold mt-44 mx-7 opacity-50">
            developed by Blessing Chinokopota
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1
                className={`text-2xl lg:text-3xl font-bold ${
                  animateIn
                    ? "opacity-0"
                    : "opacity-100 transition-opacity duration-500"
                } bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400`}
              >
                {filter === "all" && "All Tasks"}
                {filter === "active" && "Active Tasks"}
                {filter === "completed" && "Completed Tasks"}
                {filter === "important" && "Important Tasks"}
              </h1>

              <div className="hidden lg:block">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    darkMode
                      ? "hover:bg-gray-800 text-blue-400"
                      : "hover:bg-blue-100 text-blue-500"
                  }`}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>

            {/* Add Task Input */}
            <div className="mb-8">
              <div
                className={`flex items-center p-3 rounded-lg shadow-md ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-80 border border-blue-900"
                    : "bg-white bg-opacity-80 border border-blue-200"
                } transition-all duration-300 focus-within:shadow-lg focus-within:shadow-blue-400/20 ${
                  darkMode
                    ? "focus-within:border-blue-600"
                    : "focus-within:border-blue-400"
                }`}
              >
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`flex-1 bg-transparent outline-none ${
                    darkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                  }`}
                />
                <button
                  onClick={addTask}
                  className={`ml-2 transition-all duration-300 ${
                    darkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-500 hover:text-blue-600"
                  } focus:outline-none transform hover:scale-110`}
                >
                  <PlusCircle size={24} />
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div
                  className={`text-center py-12 transition-opacity duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Eye size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No tasks found</p>
                  <p className="text-sm mt-2">
                    {filter === "all"
                      ? "Add a new task to get started"
                      : `No ${filter} tasks available`}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={getTaskCardStyle(task)}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {editingId === task.id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={handleEditKeyPress}
                          className={`flex-1 bg-transparent outline-none border-b ${
                            darkMode ? "border-blue-600" : "border-blue-300"
                          } py-1 transition-colors duration-300`}
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="ml-2 p-1 text-green-500 hover:text-green-400 transition-colors duration-300 transform hover:scale-110"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="ml-2 p-1 text-red-500 hover:text-red-400 transition-colors duration-300 transform hover:scale-110"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={(e) => toggleComplete(task.id, e)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                              task.completed
                                ? `${
                                    darkMode ? "bg-blue-500" : "bg-blue-400"
                                  } border-transparent`
                                : darkMode
                                ? "border-blue-500 hover:border-blue-400"
                                : "border-blue-400 hover:border-blue-300"
                            } flex items-center justify-center ${
                              task.completed ? "shadow-sm shadow-blue-400" : ""
                            }`}
                          >
                            {task.completed && (
                              <Check size={14} className="text-white" />
                            )}
                          </button>

                          <span
                            onDoubleClick={() => startEdit(task)}
                            className={`${
                              task.completed ? "line-through opacity-50" : ""
                            } cursor-text transition-all duration-300`}
                          >
                            {task.text}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {task.date}
                          </span>

                          <button
                            onClick={(e) => toggleImportant(task.id, e)}
                            className={`p-1 transition-all duration-300 transform hover:scale-110 ${
                              task.important
                                ? "text-yellow-300"
                                : darkMode
                                ? "text-gray-500 hover:text-yellow-400"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                          >
                            <Star
                              size={16}
                              fill={task.important ? "currentColor" : "none"}
                              className={task.important ? "animate-pulse" : ""}
                            />
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className={`p-1 transition-all duration-300 transform hover:scale-110 ${
                              darkMode
                                ? "text-gray-500 hover:text-red-400"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
