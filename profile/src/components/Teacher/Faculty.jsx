import React, { useEffect, useState } from "react";
import axios from "axios";
import teacherImg from "../../assets/teacherImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import ResearchProjects from "./Tables/ResearchProjects";
import BookRecordsPublished from "./Tables/BookRecords.jsx";
import Association from "./Tables/Association";
import Interaction from "./Tables/Interaction.jsx";
import FacultyDevelopmentProgram from "./Tables/FDP";
import Guidance from "./Tables/Guidance";
import SponsoredResearch from "./Tables/SponsoredResearch";
import "../../styles/popup.css";
import { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import ConsultancyDetails from "./Tables/Consultancy";
import UploadIcon from "../../assets/uploadImage.svg";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { store } from "../../redux/Store.jsx";
import PatentRecords from "./Tables/Patent.jsx";
import { useSelector } from "react-redux";
import { useRef } from "react";
import API from "../../utils/API.js";
import { motion } from "framer-motion";
import Sidebar from "../DynamicComponents/SideBar.jsx";
import Footer from "../Website/Footer.jsx";
import { useThemeContext } from "../../context/ThemeContext.jsx";

import dtuImg from "../../assets/dtufullimage.jpg";
import { PieChart, Pie, Cell } from "recharts";
import { FaSun, FaMoon } from "react-icons/fa";
import Qualification from "./Tables/Qualification.jsx";
import Header from "./FacultyHeader.jsx";
import FacultyHeader from "./FacultyHeader.jsx";

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);

  const {
    faculty_id,
    faculty_name,
    faculty_designation,
    researchCount,
    sponsorCount,
    patentCount,
    bookCount,
  } = useSelector((state) => state.auth.user) || {};
  const { role } = useSelector((state) => state.user);
  const facultyId = faculty_id;

  const fetchFacultyImage = async () => {
    if (isOperationInProgress) return;

    try {
      const response = await API.get(`/ece/faculty/facultyimage/${facultyId}`);

      if (response.data && response.data.faculty_image) {
        const imagePath = `${process.env.REACT_APP_BACKEND_URL}/${response.data.faculty_image}`; // Ensure correct path
        setSelectedImage(imagePath);
      } else {
        setSelectedImage(null);
      }
    } catch (error) {
      if (error.response && error.response.status >= 500) {
        console.error("❌ Server error fetching faculty image:", error);
        toast.error("⚠️ Failed to fetch faculty image due to a server error.");
      } else {
        console.error("❌ Error fetching faculty image:", error);
        // Do not show toast error for non-server errors (e.g., 404)
      }
    }
  };

  useEffect(() => {
    fetchFacultyImage(); // Fetch image on mount
  }, [facultyId]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUploadOrUpdate = async (event) => {
    // Early return if no file is selected
    if (!event.target.files || event.target.files.length === 0) {
      return; // Exit without showing any error
    }

    setOperationInProgress(true);
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg"];

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Only JPG or JPEG images are allowed.");
      setOperationInProgress(false);
      return;
    }

    const formData = new FormData();
    formData.append("faculty_image", file);

    setIsUploadingImage(true);

    try {
      const response = await API.put(
        `/ece/faculty/facultyimage/${facultyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.message?.includes("successfully")) {
        setTimeout(fetchFacultyImage, 2000); // Fetch updated image after delay
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload or update image.");
      }
    } catch (error) {
      console.error("Error uploading/updating image:", error);
      toast.error("Failed to upload or update image.");
    } finally {
      setIsUploadingImage(false);
      setOperationInProgress(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!facultyId) return;

    setOperationInProgress(true);
    try {
      const response = await API.delete(
        `/ece/faculty/facultyimage/${facultyId}`
      );

      if (response.data?.message?.includes("deleted successfully")) {
        setSelectedImage(null);
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    } finally {
      setOperationInProgress(false);
    }
  };

  const sectionRefs = {
    "personal-details": useRef(null),
    association: useRef(null),
    qualification: useRef(null),
    "research-papers": useRef(null),
    "book-records": useRef(null),
    "patent-records": useRef(null),
    interaction: useRef(null),
    fdp: useRef(null),
    phds: useRef(null),
    "sponsored-research": useRef(null),
    consultancy: useRef(null),
  };
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

  useEffect(() => {
    // Mocking loader delay for demo purposes
    setTimeout(() => setLoader(false), 1000);
  }, []);

  const [selectedSection, setSelectedSection] = useState("personal-details");
  const sidebarItems = [
    { id: "personal-details", label: "Personal Details" },
    { id: "association", label: "Designation Details" },
    { id: "qualification", label: "Qualifications" },
    { id: "research-papers", label: "Research Papers Published" },
    { id: "book-records", label: "Book Records Published" },
    { id: "patent-records", label: "Patent Records" },
    {
      id: "interaction",
      label: "Interaction with the Outside World",
    },
    {
      id: "fdp",
      label: "FDP/Short Term Training Program",
    },
    { id: "phds", label: "PhD Guidance Details" },
    { id: "sponsored-research", label: "Sponsored Research" },
    { id: "consultancy", label: "Consultancy Details" },
  ];
  const { darkMode, setDarkMode } = useThemeContext();

  const profileCompletion = 75; // Example completion percentage
  const data = [
    { value: profileCompletion },
    { value: 100 - profileCompletion },
  ];
  const COLORS = ["#5DB9EE", "#2C2F36"]; // Adjust colors to fit modern design
  return (
    <div
      className="pb-4"
      style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }} // Adjusted dark mode background
    >
      {loader ? (
        <Loader />
      ) : (
        <>
          <FacultyHeader /> {/* Add the Header here */}
          <div className="flex mt-4  min-h-screen">
            {/* Sidebar */}
            <div className="flex-shrink-0 sticky top-0 h-screen">
              <Sidebar
                menuItems={sidebarItems}
                selectedItem={selectedSection}
                onSelect={handleSidebarSelect}
                role={role}
                faculty_id={facultyId}
              />
            </div>

            {/* Main Content */}
            <div
              className="flex-1 overflow-y-auto px-4 mb-10 pb-10"
              style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }} // Adjusted dark mode background
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
                      : "1px solid #D1D5DB", // Subtle border

                    boxShadow: darkMode
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                  }}
                >
                  {/* Hero Section with Profile */}
                  <div className="relative w-full shadow-md">
                    {/* Background Cover Image */}
                    <div
                      className="relative w-full h-[25vh] md:h-[30vh] lg:h-[37vh] rounded-t-2xl  "
                      style={{
                        backgroundImage: `url(${dtuImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center 60%",

                        backgroundColor: darkMode ? "#2B2C3A" : "#E0E0E0", // Adjusted background color
                      }}
                    >
                      {/* Profile Image */}
                      <div className="absolute bottom-0 left-4 md:left-8 transform translate-y-1/3 ">
                        <img
                          className="rounded-full h-24 w-24 md:h-36 md:w-36 border-4 border-white dark:border-gray-800 object-cover"
                          src={selectedImage ? selectedImage : teacherImg}
                          alt="Faculty Profile"
                        />
                        {/* Upload Image Icon */}
                        <label
                          htmlFor="imageUpload"
                          className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer transition-all ${
                            darkMode
                              ? "bg-gray-600 hover:bg-gray-700" // Adjusted hover color
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
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Grid Layout for Faculty Details and Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 mt-16 px-4 md:px-6 mb-6 pb-4">
                    {/* Faculty Details */}
                    <div
                      className="rounded-xl  p-5 md:p-6 text-center md:text-left flex flex-col"
                      style={{
                        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                        border: darkMode
                          ? "2px solid #22232B"
                          : "2px solid #D1D5DB",
                      }}
                    >
                      {/* Faculty Name */}
                      <h1
                        className="text-xl md:text-3xl font-semibold"
                        style={{ color: darkMode ? "#EAEAEA" : "#1F252E" }}
                      >
                        {faculty_name}
                      </h1>

                      {/* Divider - Softer & closer to the name */}
                      <div
                        className="w-full"
                        style={{
                          height: "1.2px",
                          backgroundColor: darkMode ? "#2B2C3A" : "#D1D5DB",
                          marginTop: "3px",
                        }}
                      />

                      {/* Designation */}
                      <h2
                        className="text-sm md:text-base italic font-medium mt-1"
                        style={{ color: darkMode ? "#B0B3B8" : "#4A5568" }}
                      >
                        {faculty_designation === 1
                          ? "Professor"
                          : faculty_designation === 2
                            ? "Associate Professor"
                            : faculty_designation === 3
                              ? "Assistant Professor"
                              : "Unknown"}
                      </h2>

                      {/* Additional Details - Softer, more uniform */}
                      <div className="flex flex-col gap-1 text-sm md:text-base font-medium mt-2">
                        <div className="flex justify-between md:justify-start gap-2">
                          <span
                            style={{ color: darkMode ? "#B0B3B8" : "#6B7280" }}
                          >
                            Faculty ID:
                          </span>
                          <span
                            style={{ color: darkMode ? "#EAEAEA" : "#1F252E" }}
                          >
                            {facultyId}
                          </span>
                        </div>
                        <div className="flex justify-between md:justify-start gap-2">
                          <span
                            style={{ color: darkMode ? "#B0B3B8" : "#6B7280" }}
                          >
                            Department:
                          </span>
                          <span
                            className="font-medium"
                            style={{
                              color: darkMode ? "#EAEAEA" : "#1F252E",
                              fontSize: "1rem",
                            }}
                          >
                            ECE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Box with Circular Progress Bar */}
                    <div
                      className="rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6"
                      style={{
                        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                        border: darkMode
                          ? "2px solid #22232B"
                          : "2px solid #D1D5DB",
                      }}
                    >
                      {/* Stats Grid - Softer, more balanced layout */}
                      <div className="grid grid-cols-2 gap-4 flex-grow min-w-0 w-full md:w-auto">
                        {[
                          { value: researchCount, label: "Research Papers" },
                          {
                            value: patentCount,
                            label: "Patents Filed/Awarded",
                          },
                          { value: bookCount, label: "Book Records" },
                          { value: sponsorCount, label: "Sponsorships" },
                        ].map((stat, index) => (
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

                      {/* Circular Progress Bar - Softer text */}
                      {/* <div className="flex justify-center items-center w-full md:w-auto">
                        <PieChart width={110} height={110}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={45}
                            fill={darkMode ? "#569CD6" : "#007BFF"}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                        <span
                          className="text-s font-medium ml-2"
                          style={{ color: darkMode ? "#569CD6" : "#007BFF" }}
                        >
                          {profileCompletion}% Profile Completed
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Sections */}

                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["personal-details"]}
                  className={`pt-6 pb-3 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <PersonalDetails setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{
                    color: darkMode ? "#F8F9FA" : "#1F252E",
                  }}
                  ref={sectionRefs["association"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Association setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["qualification"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Qualification setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["research-papers"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <ResearchProjects setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["book-records"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <BookRecordsPublished setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["patent-records"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <PatentRecords setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#F8F9FA" : "#1F252E" }}
                  ref={sectionRefs["interaction"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Interaction setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["fdp"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <FacultyDevelopmentProgram setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["phds"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Guidance setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["sponsored-research"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <SponsoredResearch setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["consultancy"]}
                  className={`pt-3 pb-3   ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <ConsultancyDetails setBlurActive={setBlurActive} />
                </div>

                {/* Other content will go here */}

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

export default Faculty;
