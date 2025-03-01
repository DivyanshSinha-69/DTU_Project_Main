import React, { useEffect, useState } from "react";
import axios from "axios";
import teacherImg from "../../assets/teacherImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import ResearchProjects from "./Tables/ResearchProjects";
import BookRecordsPublished from "./Tables/BookRecords.jsx";
import Association from "./Tables/Association";
import Visits from "./Tables/Visits";
import FacultyDevelopmentProgram from "./Tables/FDP";
import PhDsAwarded from "./Tables/PhDsAwarded";
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
import { IconButton } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import dtuImg from "../../assets/dtufullimage.jpg";
import { PieChart, Pie, Cell } from "recharts";

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { role } = useSelector((state) => state.user);
  const { faculty_id, faculty_name, faculty_designation } = user;
  const facultyId = faculty_id;

  const fetchFacultyImage = async () => {
    if (isOperationInProgress) return;

    try {
      const response = await API.get(`/ece/faculty/facultyimage/${facultyId}`);

      if (response.data && response.data.faculty_image) {
        const imagePath = `${process.env.REACT_APP_BACKEND_URL}/public/${response.data.faculty_image}`; // Ensure correct path
        setSelectedImage(imagePath);
      } else {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("❌ Error fetching faculty image:", error);
      toast.error("⚠️ Failed to fetch faculty image.");
    }
  };

  useEffect(() => {
    fetchFacultyImage(); // Fetch image on mount
  }, [facultyId]);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUploadOrUpdate = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setOperationInProgress(true);
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg"];

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

  // Dummy data for the teacher (replace with actual data later)
  const sectionRefs = {
    "personal-details": useRef(null),
    association: useRef(null),
    "research-projects": useRef(null),
    "book-records": useRef(null),
    "patent-records": useRef(null),
    visits: useRef(null),
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
    { id: "research-projects", label: "Research Papers Published" },
    { id: "book-records", label: "Books Records Published" },
    { id: "patent-records", label: "Patent Records" },
    {
      id: "visits",
      label: "Interaction with the Outside World as Guest Faculty",
    },
    {
      id: "fdp",
      label: "Participation in Faculty development/Training activities/STTP",
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
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <IconButton
            onClick={() => setDarkMode((prev) => !prev)}
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: darkMode ? "#222831" : "#F4F5F7",
              color: darkMode ? "#FFFFFF" : "#222831",
              "&:hover": { backgroundColor: darkMode ? "#393E46" : "#DDE1E7" },
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <div className="flex min-h-screen">
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
              className="flex-1 overflow-y-auto pt-2 px-4"
              style={{ backgroundColor: darkMode ? "#161722" : "#FAFAFA" }}
            >
              <div
                style={{ backgroundColor: darkMode ? "#161722" : "#FAFAFA" }}
                className="pt-2"
              >
                <div
                  className="rounded-2xl shadow-2xl w-full "
                  style={{
                    backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                    padding: "1px",
                  }}
                >
                  {/* Hero Section with Profile */}
                  <div className="relative w-full">
                    {/* Background Cover Image */}
                    <div
                      className="h-32 md:h-40 lg:h-48 w-full relative rounded-t-2xl"
                      style={{
                        backgroundImage: `url(${dtuImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: darkMode ? "#1f1f1f" : "#e3e3e3",
                      }}
                    >
                      {/* Profile Image */}
                      <div className="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2">
                        {/* Profile Image */}
                        <img
                          className="rounded-full h-30 w-30 md:h-36 md:w-36 border-4 border-white dark:border-gray-800 shadow-lg"
                          src={selectedImage ? selectedImage : teacherImg}
                          alt="Faculty Profile"
                        />

                        {/* Upload Image Icon (Clickable) */}
                        <label
                          htmlFor="imageUpload"
                          className="absolute bottom-0 right-0 bg-gray-400 p-1 rounded-full cursor-pointer hover:bg-gray-700 transition-all"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 px-4 md:px-6 mb-6 pb-4">
                    {/* Faculty Details */}
                    <div
                      className="rounded-xl shadow-lg p-4 md:p-6"
                      style={{
                        backgroundColor: darkMode ? "#161B22" : "#F4F5F7",
                      }}
                    >
                      <h1
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                      >
                        {faculty_name}
                      </h1>
                      <h2
                        className="text-md italic font-medium"
                        style={{ color: darkMode ? "#DDE1E7" : "#555" }}
                      >
                        {faculty_designation === 1
                          ? "Professor"
                          : faculty_designation === 2
                            ? "Associate Professor"
                            : faculty_designation === 3
                              ? "Assistant Professor"
                              : "Unknown"}
                      </h2>
                      <h2 className="text-sm md:text-md font-medium">
                        <span style={{ color: darkMode ? "#B0B3B8" : "#555" }}>
                          Faculty ID:
                        </span>{" "}
                        <span
                          style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                        >
                          {facultyId}
                        </span>
                      </h2>
                      <h2 className="text-sm md:text-md font-medium">
                        <span style={{ color: darkMode ? "#B0B3B8" : "#555" }}>
                          Department:
                        </span>{" "}
                        <span
                          style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                        >
                          ECE
                        </span>
                      </h2>
                    </div>

                    {/* Stats Box with Circular Progress Bar */}
                    <div
                      className="rounded-xl shadow-lg p-4 md:p-6 flex flex-row justify-between items-center"
                      style={{
                        backgroundColor: darkMode ? "#161B22" : "#F4F5F7",
                      }}
                    >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <h3
                            className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                          >
                            7
                          </h3>
                          <p className="text-sm text-gray-400">
                            Research Papers
                          </p>
                        </div>
                        <div className="text-center">
                          <h3
                            className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                          >
                            3
                          </h3>
                          <p className="text-sm text-gray-400">
                            Profile Completed
                          </p>
                        </div>
                        <div className="text-center">
                          <h3
                            className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                          >
                            2
                          </h3>
                          <p className="text-sm text-gray-400">Sponsorships</p>
                        </div>
                        <div className="text-center">
                          <h3
                            className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                          >
                            0
                          </h3>
                          <p className="text-sm text-gray-400">Patents/Books</p>
                        </div>
                      </div>

                      {/* Circular Progress Bar */}
                      <div className="flex justify-center items-center ml-6">
                        <PieChart width={80} height={80}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={35}
                            fill="#8884d8"
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
                          className={`text-lg font-bold ml-2 ${darkMode ? "text-white" : "text-black"}`}
                        >
                          {profileCompletion}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections */}

                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["personal-details"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <PersonalDetails setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["association"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Association setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["research-projects"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <ResearchProjects setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["book-records"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <BookRecordsPublished setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["patent-records"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <PatentRecords setBlurActive={setBlurActive} />
                </div>
                <div
                  style={{ color: darkMode ? "#FFFFFF" : "#222831" }}
                  ref={sectionRefs["visits"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <Visits setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["fdp"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <FacultyDevelopmentProgram setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["phds"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <PhDsAwarded setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["sponsored-research"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <SponsoredResearch setBlurActive={setBlurActive} />
                </div>
                <div
                  ref={sectionRefs["consultancy"]}
                  className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}
                >
                  <ConsultancyDetails setBlurActive={setBlurActive} />
                </div>

                {/* Other content will go here */}

                <Toaster
                  toastOptions={{
                    duration: 1000,
                    style: {
                      background: darkMode ? "#333" : "#F4F5F7",
                      color: darkMode ? "#FFFFFF" : "#222831",
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
