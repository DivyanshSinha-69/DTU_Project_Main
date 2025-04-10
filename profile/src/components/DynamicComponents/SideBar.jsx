import { useState, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeProfessionalSkills } from "../../redux/reducers/student/UserProfessionalSkills";
import { removePersonalDetails } from "../../redux/reducers/student/UserPersonalDetails";
import { removeUserImage } from "../../redux/reducers/student/UserImage";
import { removePlacement } from "../../redux/reducers/student/UserPlacementDetail";
import { removeMtechEducation } from "../../redux/reducers/student/UserMtechEducationalDetails";
import { removeEntrepreneurDetails } from "../../redux/reducers/student//UserEntrepreneurDetails";
import { removeHigherEducationDetails } from "../../redux/reducers/student/UserHigherEducationDetails";
import { removeInterInstitute } from "../../redux/reducers/student/UserInterInstituteDetails";
import { removeBtechEducation } from "../../redux/reducers/student/UserBtechEducationalDetails";
import { logout } from "../../redux/reducers/AuthSlice";
import { setRole } from "../../redux/reducers/UserSlice";
import dtuLogo from "../../assets/dtuLogo.jpg";
import { useThemeContext } from "../../context/ThemeContext";

const Sidebar = ({ menuItems, selectedItem, onSelect, role, faculty_id }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Check if the screen is mobile
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();

  // Handle window resize to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      let logoutUrl = `${process.env.REACT_APP_BACKEND_URL}/logout`;
      const logoutData = {};
      if (role === "faculty" && faculty_id) {
        logoutUrl = `${process.env.REACT_APP_BACKEND_URL}/ece/facultyauth/logout`;
        logoutData.faculty_id = faculty_id;
      }
      let response;
      if (role === "student") {
        response = await axios.get(logoutUrl, { withCredentials: true });
      } else {
        response = await axios.post(logoutUrl, logoutData, {
          withCredentials: true,
        });
      }
      if (response.status === 200) {
        console.log("✅ Logged out successfully");
        dispatch(logout());
        dispatch(setRole(null));
        dispatch(removeProfessionalSkills());
        dispatch(removePersonalDetails());
        dispatch(removeUserImage());
        dispatch(removePlacement());
        dispatch(removeMtechEducation());
        dispatch(removeEntrepreneurDetails());
        dispatch(removeHigherEducationDetails());
        dispatch(removeInterInstitute());
        dispatch(removeBtechEducation());
        navigate("/");
      } else {
        console.error("⚠️ Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute top-3 left-2 z-50 p-2 rounded-md  transition-all duration-300"
        style={{
          backgroundColor: darkMode ? "#2B2C3A" : "#FFFFFF",
          color: darkMode ? "#EAEAEA" : "#1F252E",
          border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB", // Subtle border
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>
      <motion.div
        initial={{ width: isMobile ? "100%" : 60 }} // Start with full width on mobile
        animate={{ width: isOpen ? (isMobile ? "100%" : 250) : 60 }} // Animate to open or closed state
        transition={{
          type: "spring", // Use spring animation for smoother motion
          stiffness: 100, // Adjust stiffness for smoother feel
          damping: 15, // Adjust damping for smoother feel
          duration: 0.3, // Add a duration for smoother transitions
        }}
        className={`h-screen flex flex-col shadow-lg rounded-r-2xl
          ${darkMode ? "bg-[#0D1117] text-white" : "bg-[#FFFFFF] text-[#1F252E]"}`}
        style={{
          borderTop: darkMode ? "1px solid #2E2E3E" : "1px solid #E5E7EB", // Complementary border colors
          borderBottom: darkMode ? "1px solid #2E2E3E" : "1px solid #E5E7EB", // Complementary border colors
        }}
      >
        {isOpen && (
          <div className="flex items-center justify-center mt-6 mb-4">
            <img src={dtuLogo} alt="DTU Logo" className="w-24 h-24" />
          </div>
        )}
        {/* Menu items are hidden when sidebar is closed */}
        {isOpen && (
          <div className="w-full space-y-1">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`cursor-pointer w-full py-2 px-4 transition-all duration-300 flex items-center 
                  ${
                    selectedItem === item.id
                      ? darkMode
                        ? "bg-[#1E1E2E] text-white relative"
                        : "bg-[#E0E0E0] text-[#1F252E] relative"
                      : darkMode
                        ? "hover:bg-[#2B2C3A]"
                        : "hover:bg-[#DDE1E7]"
                  }`}
              >
                {selectedItem === item.id && (
                  <div
                    className="absolute top-0 left-0 h-full w-1 rounded-l-full"
                    // style={{
                    //   backgroundColor: darkMode ? "#569CD6" : "#007BFF", // Accent color for selected item
                    // }}
                  ></div>
                )}
                <motion.span
                  className="block text-sm ml-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
