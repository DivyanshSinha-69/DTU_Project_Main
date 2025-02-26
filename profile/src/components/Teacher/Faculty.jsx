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
import API from "../../utils/API.js";
import { motion } from "framer-motion";

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
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
        { headers: { "Content-Type": "multipart/form-data" } },
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
        `/ece/faculty/facultyimage/${facultyId}`,
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

  useEffect(() => {
    // Mocking loader delay for demo purposes
    setTimeout(() => setLoader(false), 1000);
  }, []);

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="bg-[#FAFAFA] pt-10">
            <div className="h-auto w-full flex flex-wrap justify-center mx-auto">
              <div className="img-container relative m-4">
                {/* Profile Image with Hover Effect (No Shadow) */}
                <img
                  className={`rounded-xl h-[175px] w-[175px]`}
                  src={selectedImage ? selectedImage : teacherImg}
                  alt="Teacher profile"
                  style={{ boxShadow: "none" }} // Ensures no unwanted shadow
                />

                {/* Loading Overlay */}
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                    <div className="loader border-t-transparent border-4 border-white rounded-full w-8 h-8 animate-spin"></div>
                  </div>
                )}

                {/* Upload Button */}
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-2 right-2 cursor-pointer bg-white text-white p-1.5 rounded-full flex items-center justify-center transition-transform duration-500 hover:rotate-[360deg]"
                >
                  <img
                    src={UploadIcon}
                    alt="Upload Icon"
                    className="w-4 h-4 "
                  />
                </label>

                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUploadOrUpdate}
                />
              </div>

              {/* Faculty Details */}
              <div className="details-container mt-4 max-w-lg">
                <h1 className="text-4xl font-bold text-gray-800">
                  {faculty_name}
                </h1>
                <h2 className="text-base italic font-medium text-gray-600">
                  {faculty_designation === 1
                    ? "Professor"
                    : faculty_designation === 2
                      ? "Associate Professor"
                      : faculty_designation === 3
                        ? "Assistant Professor"
                        : "Unknown"}
                </h2>
                <h2 className="text-md font-medium text-gray-600">
                  <span className="text-gray-500">ID:</span> {facultyId}
                </h2>
                <h2 className="text-md font-medium text-gray-600">
                  <span className="text-gray-500">Department:</span> ECE
                </h2>
              </div>
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PersonalDetails setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <Association setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <ResearchProjects setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <BookRecordsPublished setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PatentRecords setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <Visits setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <FacultyDevelopmentProgram setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PhDsAwarded setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <SponsoredResearch setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <ConsultancyDetails setBlurActive={setBlurActive} />
            </div>

            <Toaster
              toastOptions={{
                className: "",
                duration: 1000,
                style: {
                  background: "#1f2937",
                  color: "#fff",
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Faculty;
