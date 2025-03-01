import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeProfessionalSkills } from "../../redux/reducers/UserProfessionalSkills";
import { removePersonalDetails } from "../../redux/reducers/UserPersonalDetails";
import { removeUserImage } from "../../redux/reducers/UserImage";
import { removePlacement } from "../../redux/reducers/UserPlacementDetail";
import { removeMtechEducation } from "../../redux/reducers/UserMtechEducationalDetails";
import { removeEntrepreneurDetails } from "../../redux/reducers/UserEntrepreneurDetails";
import { removeHigherEducationDetails } from "../../redux/reducers/UserHigherEducationDetails";
import { removeInterInstitute } from "../../redux/reducers/UserInterInstituteDetails";
import { removeBtechEducation } from "../../redux/reducers/UserBtechEducationalDetails";
import { logout } from "../../redux/reducers/AuthSlice";
import { setRole } from "../../redux/reducers/UserSlice";
import dtuLogo from "../../assets/dtuLogo.jpg";
import { useThemeContext } from "../../context/ThemeContext";

const Sidebar = ({ menuItems, selectedItem, onSelect, role, faculty_id }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();

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
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} className="text-gray-700" />
      </button>
      <motion.div
        initial={{ width: isOpen ? 250 : 60 }}
        animate={{ width: isOpen ? 250 : 60 }}
        transition={{ duration: 0.3 }}
        className={`h-screen transition-all duration-300 flex flex-col shadow-lg 
          ${darkMode ? "bg-[#0B1B39] text-white" : "bg-[#F4F5F7] text-[#2D3A4A]"}`}
      >
        {isOpen && (
          <div className="flex items-center justify-center mt-6 mb-4">
            <img src={dtuLogo} alt="DTU Logo" className="w-16 h-16" />
          </div>
        )}
        <div className="w-full space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => isOpen && onSelect(item.id)}
              className={`cursor-pointer w-full py-2 px-4 transition-all duration-300 flex items-center 
                ${
                  selectedItem === item.id && isOpen
                    ? darkMode
                      ? "bg-[#222755] text-white relative"
                      : "bg-[#E0E0E0] text-[#2D3A4A] relative"
                    : darkMode
                      ? "hover:bg-[#2B2C3A]"
                      : "hover:bg-gray-300"
                }`}
            >
              {selectedItem === item.id && (
                <div className="absolute top-0 left-0 h-full w-2  rounded-l-full"></div>
              )}
              {isOpen && (
                <span className="block text-sm ml-2">{item.label}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-auto mb-4 flex justify-center">
          <button
            className="p-2 rounded-md text-white bg-[#000000] hover:bg-[#D43F3F] transition-all duration-300 flex items-center"
            onClick={handleLogout}
          >
            {isOpen ? (
              <span className="text-sm">Logout</span>
            ) : (
              <LogOut size={20} />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
