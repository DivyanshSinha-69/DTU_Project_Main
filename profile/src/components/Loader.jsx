import React from "react";
import { useThemeContext } from "../context/ThemeContext";

const Loader = () => {
  const { darkMode } = useThemeContext();

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center gap-4 transition-all duration-300 ${
        darkMode ? "bg-[#0D1117] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Simple Clean Loader */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

      {/* Cool Minimal Loading Text */}
      <p className="text-lg font-medium tracking-wide opacity-80 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
