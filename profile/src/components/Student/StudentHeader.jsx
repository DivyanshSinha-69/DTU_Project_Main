import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSun, FaMoon } from "react-icons/fa";
import { useThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/AuthSlice";
import { setRole } from "../../redux/reducers/UserSlice";
import { LogOut } from "lucide-react";
import axios from "axios";

const StudentHeader = () => {
  const { darkMode, setDarkMode } = useThemeContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { student_id } = useSelector((state) => state.auth.user) || {};
  const { role } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  // Navigation links - only Student Details for now
  const navLinks = [
    { name: "Student Details", path: "/student", icon: <FaUser /> },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      console.log("Logging out student:", student_id);

      // Make actual logout request to backend
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ece/student/logout`,
        {}, // empty body
        { withCredentials: true }
      );

      // Clear frontend auth state
      dispatch(logout());
      dispatch(setRole(null));

      // Redirect to login or landing page
      navigate("/");
    } catch (error) {
      console.error(
        "Logout error:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <header
      className={`top-0 z-50 w-full ${
        darkMode ? "bg-[#0D1117] text-white" : "bg-[#FFFFFF] text-[#1F252E]"
      } border-b transition-colors duration-300`}
      style={{
        borderBottom: darkMode ? "2px solid #2E2E3E" : "2px solid #E5E7EB",
      }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            to="/student"
            className="text-xl font-semibold flex items-center space-x-2"
          >
            <motion.span
              className="font-semibold"
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              Student Portal
            </motion.span>
          </Link>

          {/* Dark Mode Toggle */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`relative flex w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-700 ${
                darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
              onClick={handleToggle}
            >
              <motion.div
                className="absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                animate={{ x: darkMode ? 24 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 1.2,
                }}
              >
                {darkMode ? (
                  <FaMoon className="text-gray-800" />
                ) : (
                  <FaSun className="text-yellow-500" />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Links and Actions */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`relative flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                } ${
                  location.pathname === link.path
                    ? darkMode
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : ""
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <motion.button
            className={`p-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border ${
              darkMode
                ? "border-gray-600 hover:border-red-500 hover:bg-red-500/10 text-gray-300 hover:text-red-500"
                : "border-gray-300 hover:border-red-500 hover:bg-red-500/10 text-gray-700 hover:text-red-500"
            }`}
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`md:hidden ${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
            } border-t ${
              darkMode ? "border-gray-800" : "border-gray-200"
            } transition-colors duration-300`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-2 flex flex-col space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`p-2 rounded-lg transition-colors flex items-center ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  } ${
                    location.pathname === link.path
                      ? darkMode
                        ? "bg-gray-800"
                        : "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="text-sm font-medium ml-2">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default StudentHeader;
