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

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);

  const facultyId = useSelector((state) => state.user.facultyId);

const fetchFacultyImage = async () => {
  if (isOperationInProgress || !facultyId) return;

  try {
    const response = await API.get(`/ece/faculty/facultyimage/${facultyId}`);

    console.log("API called for faculty image");

    if (response.data && response.data.faculty_image) {
      const imagePath = `http://localhost:3001/public/${response.data.faculty_image}`;
      console.log("Fetched image path:", imagePath);
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
    if (!event.target.files || event.target.files.length === 0 || !facultyId)
      return;
  
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
    formData.append("faculty_id", facultyId);
  
    setIsUploadingImage(true);
  
    setTimeout(async () => {
      try {
        const response = selectedImage
          ? await API.put(`/ece/faculty/facultyimage/${facultyId}`, formData)
          : await API.post(`/ece/faculty/facultyimage/${facultyId}`, formData);
  
        if (response.data?.message?.includes("successfully")) {
          setSelectedImage(URL.createObjectURL(file));
          toast.success(
            selectedImage ? "Image updated successfully!" : "Image uploaded successfully!"
          );
          setTimeout(fetchFacultyImage, 3000);
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
    }, 2000);
  };
  
  const handleDeleteImage = async () => {
    if (!facultyId) return;
  
    setOperationInProgress(true);
    try {
      const response = await API.delete(`/ece/faculty/facultyimage/${facultyId}`);
  
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
  const teacherData = {
    name: "Dr. John Does",
    employeeId: "FAC001",
    department: "ECE",
    designation: "Professor",
  };

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
              <div className="img-container m-2 relative">
                <img
                  className={`rounded-xl h-[175px] w-[175px] ${isUploadingImage ? "opacity-50" : ""}`}
                  src={selectedImage ? selectedImage : teacherImg} // Display fetched image if available
                  alt="Teacher profile"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                    <div className="loader border-t-transparent border-4 border-white rounded-full w-8 h-8 animate-spin"></div>
                  </div>
                )}

                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-2 right-2 cursor-pointer bg-gray-800 text-white p-2 rounded-full flex items-center justify-center"
                >
                  <img src={UploadIcon} alt="Upload Icon" className="w-6 h-6" />
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUploadOrUpdate}
                />
              </div>

              <div className="details-container m-2">
                <h1 className="font-extrabold text-3xl">{teacherData.name}</h1>
                <h2 className="font-bold text-1xl">
                  ID: {teacherData.employeeId}
                </h2>
                <h2 className="text-lg">{teacherData.designation}</h2>
                <h2>Department: {teacherData.department}</h2>
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
