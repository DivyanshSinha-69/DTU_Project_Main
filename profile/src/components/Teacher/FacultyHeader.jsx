import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBook,
  FaEnvelope,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useThemeContext } from "../../context/ThemeContext.jsx";
import { motion } from "framer-motion";

const Header = () => {
  const { darkMode, setDarkMode } = useThemeContext();

  // Navigation links
  const navLinks = [
    { name: "Faculty Details", path: "/faculty", icon: <FaUser /> },
    { name: "Office Orders", path: "office-orders", icon: <FaBook /> },
    {
      name: "Circulars/Notices",
      path: "circular-notices",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <header
      className={` top-0 z-50 w-full  ${darkMode ? "bg-[#0D1117] text-white" : "bg-[#FFFFFF] text-[#1F252E]"}`}
      style={{
        borderBottom: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB", // Subtle border
      }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/faculty"
          className="text-2xl font-bold flex items-center space-x-2"
        >
          <span
            className={`font-semibold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            Faculty
          </span>
          <span className="font-light">Portal</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center space-x-2 hover:text-blue-500 transition-colors ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {link.icon}
              <span className="text-md font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`relative flex w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-500 ${
              darkMode ? "bg-gray-900" : "bg-gray-300"
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {/* Toggle Button */}
            <motion.div
              className={`absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                darkMode ? "translate-x-10" : "translate-x-0"
              }`}
              layout
              transition={{ type: "spring", stiffness: 700, damping: 20 }}
            >
              {darkMode ? (
                <FaMoon className="text-gray-700" />
              ) : (
                <FaSun className="text-yellow-500" />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Menu (Hamburger) */}
        <div className="md:hidden">
          <button
            className={`p-2 focus:outline-none ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
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

      {/* Mobile Navigation (Dropdown) */}
      <div
        className={`md:hidden ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="px-4 py-2 flex flex-col space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`hover:text-blue-500 transition-colors ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
