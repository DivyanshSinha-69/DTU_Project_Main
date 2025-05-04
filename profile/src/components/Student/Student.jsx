import React, { useEffect, useState, useRef } from "react";
import studentImg from "../../assets/teacherImg.png";
import "../../styles/popup.css";
import { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import UploadIcon from "../../assets/uploadImage.svg";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Sidebar from "../DynamicComponents/SideBar.jsx";
import { useThemeContext } from "../../context/ThemeContext.jsx";
import dtuImg from "../../assets/dtufullimage.jpg";
import StudentHeader from "./StudentHeader.jsx";
import StudentPersonalDetails from "./Tables/PersonalDetails.jsx";
import StudentPlacementDetails from "./Tables/CurrPlacement.jsx";
import StudentPreviousPlacements from "./Tables/PrevPlacement.jsx";
import HigherEducationDetails from "./Tables/HigherEducationDetails.jsx";
import EntrepreneurshipDetails from "./Tables/EntrepreneurshipDetails.jsx";

const Student = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);
  const [selectedSection, setSelectedSection] = useState("personal-details");
  const { darkMode } = useThemeContext();
  const { department_name, role_assigned, roll_no, student_name } =
    useSelector((state) => state.auth.user) || {};
  // Create refs for all sections
  const sectionRefs = {
    "personal-details": useRef(null),
    "current-placements": useRef(null),
    "previous-placements": useRef(null),
    "higher-education": useRef(null),
    "entrepreneurship-details": useRef(null),
    projects: useRef(null),
    internships: useRef(null),
    extracurricular: useRef(null),
  };

  const sidebarItems = [
    { id: "personal-details", label: "Personal Details" },
    { id: "current-placements", label: "Current Placement Details" },
    { id: "previous-placements", label: "Previous Placements" },
    { id: "higher-education", label: "Higher Education Details" },
    { id: "entrepreneurship-details", label: "Entrepreneuship Details" },
    { id: "projects", label: "Projects" },
    { id: "internships", label: "Internships" },
    { id: "extracurricular", label: "Extracurricular" },
  ];

  const handleSidebarSelect = (sectionId) => {
    setSelectedSection(sectionId);
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "personal-details";

      Object.keys(sectionRefs).forEach((key) => {
        const section = sectionRefs[key]?.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = key;
          }
        }
      });

      setSelectedSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statsData = [
    { value: 12, label: "Courses Completed" },
    { value: 3, label: "Projects" },
    { value: 2, label: "Internships" },
    { value: 1, label: "Research Papers" },
  ];

  useEffect(() => {
    // Mocking loader delay
    setTimeout(() => setLoader(false), 1000);
  }, []);

  const handleImageUploadOrUpdate = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setOperationInProgress(true);
    const file = event.target.files[0];

    // Simulate API call
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        toast.success("Image uploaded successfully!");
        setOperationInProgress(false);
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  return (
    <div
      className="pb-4"
      style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
    >
      {loader ? (
        <Loader />
      ) : (
        <>
          <StudentHeader />
          <div className="flex mt-4 min-h-screen">
            {/* Sidebar with enhanced functionality */}
            <div className="flex-shrink-0 sticky top-0 h-screen">
              <Sidebar
                menuItems={sidebarItems}
                selectedItem={selectedSection}
                onSelect={handleSidebarSelect}
                role="student"
                student_id={roll_no}
              />
            </div>

            {/* Main Content */}
            <div
              className="flex-1 overflow-y-auto px-4 mb-10 pb-10"
              style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
            >
              <div
                style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
              >
                <div
                  className="rounded-2xl shadow-xl w-full"
                  style={{
                    backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                    padding: "1px",
                    border: darkMode
                      ? "1px solid #22232B"
                      : "1px solid #D1D5DB",
                    boxShadow: darkMode
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Hero Section with Profile */}
                  <div className="relative w-full shadow-md">
                    {/* Background Cover Image */}
                    <div
                      className="relative w-full h-[25vh] md:h-[30vh] lg:h-[37vh] rounded-t-2xl"
                      style={{
                        backgroundImage: `url(${dtuImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center 60%",
                        backgroundColor: darkMode ? "#2B2C3A" : "#E0E0E0",
                      }}
                    >
                      {/* Profile Image */}
                      <div className="absolute bottom-0 left-4 md:left-8 transform translate-y-1/3">
                        <img
                          className="rounded-full h-24 w-24 md:h-36 md:w-36 border-4 border-white dark:border-gray-800 object-cover"
                          src={selectedImage ? selectedImage : studentImg}
                          alt="Student Profile"
                        />
                        {/* Upload Image Icon */}
                        <label
                          htmlFor="imageUpload"
                          className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer transition-all ${
                            darkMode
                              ? "bg-gray-600 hover:bg-gray-700"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        >
                          <img
                            src={UploadIcon}
                            alt="Upload"
                            className="w-5 h-5"
                          />
                          <input
                            type="file"
                            id="imageUpload"
                            className="hidden"
                            accept=".jpg,.jpeg"
                            onChange={handleImageUploadOrUpdate}
                            disabled={isOperationInProgress}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Grid Layout for Student Details and Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 mt-16 px-4 md:px-6 mb-6 pb-4">
                    {/* Student Details */}
                    <div
                      className="rounded-xl p-5 md:p-6 text-center md:text-left flex flex-col"
                      style={{
                        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                        border: darkMode
                          ? "2px solid #22232B"
                          : "2px solid #D1D5DB",
                      }}
                    >
                      {/* Student Name */}
                      <h1
                        className="text-xl md:text-3xl font-semibold"
                        style={{ color: darkMode ? "#EAEAEA" : "#1F252E" }}
                      >
                        {student_name}
                      </h1>

                      {/* Divider */}
                      <div
                        className="w-full"
                        style={{
                          height: "1.2px",
                          backgroundColor: darkMode ? "#2B2C3A" : "#D1D5DB",
                          marginTop: "3px",
                        }}
                      />

                      {/* Program and Batch */}
                      <h2
                        className="text-sm md:text-base italic font-medium mt-1"
                        style={{ color: darkMode ? "#B0B3B8" : "#4A5568" }}
                      >
                        {role_assigned}
                      </h2>

                      {/* Additional Details */}
                      <div className="flex flex-col gap-1 text-sm md:text-base font-medium mt-2">
                        <div className="flex justify-between md:justify-start gap-2">
                          <span
                            style={{ color: darkMode ? "#B0B3B8" : "#6B7280" }}
                          >
                            Roll No:
                          </span>
                          <span
                            style={{ color: darkMode ? "#EAEAEA" : "#1F252E" }}
                          >
                            {roll_no}
                          </span>
                        </div>
                        <div className="flex justify-between md:justify-start gap-2">
                          <span
                            style={{ color: darkMode ? "#B0B3B8" : "#6B7280" }}
                          >
                            Department:
                          </span>
                          <span
                            style={{ color: darkMode ? "#EAEAEA" : "#1F252E" }}
                          >
                            {department_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Box */}
                    <div
                      className="rounded-xl p-4 md:p-6"
                      style={{
                        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                        border: darkMode
                          ? "2px solid #22232B"
                          : "2px solid #D1D5DB",
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {statsData.map((stat, index) => (
                          <div key={index} className="text-center p-2">
                            <h3
                              className="text-2xl font-medium"
                              style={{
                                color: darkMode ? "#EAEAEA" : "#1F252E",
                              }}
                            >
                              {stat.value}
                            </h3>
                            <p
                              className="text-sm font-medium"
                              style={{
                                color: darkMode ? "#B0B3B8" : "#6B7280",
                              }}
                            >
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Sections with refs */}
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["personal-details"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <StudentPersonalDetails setBlurActive={setBlurActive} />
                </div>

                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["current-placements"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <StudentPlacementDetails setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["previous-placements"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <StudentPreviousPlacements setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["higher-education"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <HigherEducationDetails setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["entrepreneurship-details"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <EntrepreneurshipDetails setBlurActive={setBlurActive} />
                </div>

                <Toaster
                  toastOptions={{
                    duration: 1000,
                    style: {
                      background: darkMode ? "#161722" : "#FFFFFF",
                      color: darkMode ? "#F8F9FA" : "#1F252E",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Student;
