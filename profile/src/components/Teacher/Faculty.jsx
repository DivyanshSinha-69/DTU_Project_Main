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

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOperationInProgress, setOperationInProgress] = useState(false);

  const fetchFacultyImage = async () => {
    if (isOperationInProgress) return;

    try {
      // Get the access token from Redux store
      const accessToken = store.getState().auth.accessToken;

      const response = await axios.get(
        `http://localhost:3001/ece/faculty/facultyimage/FAC001`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 🔹 Include JWT token here
          },
        },
      );

      console.log("API called for faculty image");

      if (response.data && response.data.faculty_image) {
        // Assuming the API returns the relative path to the image
        const imagePath = `http://localhost:3001/public/${response.data.faculty_image}`;
        console.log("Fetched image path:", imagePath);
        setSelectedImage(imagePath);
        console.log("Selected image state after setting:", imagePath);
      } else {
        console.log(response);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("❌ Error fetching faculty image:", error);
      toast.error("⚠️ Failed to fetch faculty image.");
    }
  };

  useEffect(() => {
    fetchFacultyImage(); // Fetch image on mount
  }, []);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUploadOrUpdate = async (event) => {
    setOperationInProgress(true);
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg"];

    // Validate file type
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Only JPG or JPEG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("faculty_image", file);
    formData.append("faculty_id", "FAC001");

    setIsUploadingImage(true); // Show uploading indicator
    setTimeout(async () => {
      try {
        let response;
        if (selectedImage) {
          // Update the image if it already exists
          response = await axios.put(
            `http://localhost:3001/ece/faculty/facultyimage/FAC001`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        } else {
          // Upload the image for the first time
          response = await axios.post(
            `http://localhost:3001/ece/faculty/facultyimage/FAC001`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        }

        if (
          response.data &&
          (response.data.message === "Faculty image added successfully" ||
            response.data.message === "Faculty image updated successfully")
        ) {
          setSelectedImage(URL.createObjectURL(file)); // Update UI with the new image preview
          toast.success(
            selectedImage
              ? "Image updated successfully!"
              : "Image uploaded successfully!",
          );
          setTimeout(() => {
            fetchFacultyImage(); // Fetch the latest data after delay
          }, 3000);
        } else {
          toast.error("Failed to upload or update image.");
        }
      } catch (error) {
        console.error("Error uploading/updating image:", error);
        toast.error("Failed to upload or update image.");
      } finally {
        setIsUploadingImage(false); // Hide uploading indicator
      }
    }, 2000); // 2-second delay before making the API call
    setOperationInProgress(false);
  };

  const handleDeleteImage = async () => {
    setOperationInProgress(true);
    try {
      const response = await axios.delete(
        `http://localhost:3001/ece/faculty/facultyimage/FAC001`,
      );

      if (
        response.data &&
        response.data.message ===
          "Faculty image and record deleted successfully"
      ) {
        setSelectedImage(null); // Clear the image from UI
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
    setOperationInProgress(false);
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

            {/* <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PersonalDetails setBlurActive={setBlurActive} />
            </div> */}

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <Association setBlurActive={setBlurActive} />
            </div>

            {/* <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <ResearchProjects setBlurActive={setBlurActive} />
            </div>*/}

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <BookRecordsPublished setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PatentRecords setBlurActive={setBlurActive} />
            </div>

            {/*<div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
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
            </div> */}

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
