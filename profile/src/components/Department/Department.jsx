import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../DynamicComponents/SideBar.jsx";
import { useThemeContext } from "../../context/ThemeContext.jsx";
import { FaSun, FaMoon } from "react-icons/fa";
import CircularsNotices from "./Tables/Notices.jsx";
import Duties from "./Tables/Duties.jsx";
import HeroSection from "../DynamicComponents/HeroSection.jsx"; // Import the HeroSection component

const Department = () => {
  const { darkMode, setDarkMode } = useThemeContext();
  const [selectedSection, setSelectedSection] = useState("circulars"); // Default selected section
  const [loader, setLoader] = useState(false); // Loader state

  // Sidebar menu items
  const sidebarItems = [
    { id: "circulars", label: "Circulars/Notices" },
    { id: "duties", label: "Duties" },
  ];

  // Handle sidebar selection
  const handleSidebarSelect = (id) => {
    setSelectedSection(id);
  };

  return (
    <div>
      {loader ? (
        <div>Loading...</div> // Replace with your Loader component
      ) : (
        <>
          {/* Dark Mode Toggle (Optional) */}
          <motion.div
            className="fixed top-5 right-5 flex items-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`relative flex w-24 h-12 rounded-full p-1 cursor-pointer transition-colors duration-500 ${
                darkMode ? "bg-gray-900" : "bg-gray-300"
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <motion.div
                className={`absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                  darkMode ? "translate-x-12" : "translate-x-0"
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

          {/* Main Layout */}
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="flex-shrink-0 sticky top-0 h-screen">
              <Sidebar
                menuItems={sidebarItems}
                selectedItem={selectedSection}
                onSelect={handleSidebarSelect}
                role="hod" // Set role as HOD
              />
            </div>

            {/* Main Content */}
            <div
              className="flex-1 overflow-y-auto pt-2 px-4"
              style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
            >
              <div
                style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
                className="pt-2"
              >
                {/* Hero Section */}
                <HeroSection
                  title={
                    selectedSection === "circulars"
                      ? "Circulars/Notices"
                      : "Duties"
                  }
                  subtitle={
                    selectedSection === "circulars"
                      ? "Stay updated with the latest announcements"
                      : "Assign and manage duties for faculty members"
                  }
                  darkMode={darkMode}
                />

                {/* Render the selected section */}
                {selectedSection === "circulars" ? (
                  <CircularsNotices />
                ) : (
                  <Duties />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Department;
