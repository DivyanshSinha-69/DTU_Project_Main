import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import HigherEducationPopUp from "../PopUp/HigherEducationDetailsPopUp";
const StudentHigherEducation = ({ setBlurActive }) => {
  const [educationDetails, setEducationDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isAddEducation, setIsAddEducation] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();

  useEffect(() => {
    if (!roll_no) return;

    const fetchEducationDetails = async () => {
      try {
        const response = await API.get(
          `ece/student/higher-education?roll_no=${roll_no}`
        );
        const educationData = response?.data;

        if (educationData && educationData.length > 0) {
          setEducationDetails(educationData);
        } else {
          toast.error("No higher education details available");
        }
      } catch (error) {
        console.error("Error fetching higher education details:", error);
        toast.error("Error while fetching higher education details");
      }
    };

    fetchEducationDetails();
  }, [roll_no]);

  const openPopup = (education) => {
    setSelectedEducation(education);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddEducation(false);
    setBlurActive(false);
  };

  const handleAddEducationDetails = async (newEducationDetails, file) => {
    const { exam_name, institute_name } = newEducationDetails;

    const formData = new FormData();
    formData.append("exam_name", exam_name);
    formData.append("institute_name", institute_name);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddEducation) {
        response = await API.post(
          `ece/student/higher-education?roll_no=${roll_no}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await API.put(
          `ece/student/higher-education/${selectedEducation.education_id}?roll_no=${roll_no}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Higher education details successfully saved");

        const newEducationRecord = {
          education_id:
            response.data.education_id || selectedEducation.education_id,
          exam_name: response.data.exam_name || exam_name,
          institute_name: response.data.institute_name || institute_name,
          document: response.data.document || selectedEducation?.document,
        };

        if (isAddEducation) {
          setEducationDetails((prev) => [...prev, newEducationRecord]);
        } else {
          setEducationDetails((prev) =>
            prev.map((education) =>
              education.education_id === selectedEducation.education_id
                ? newEducationRecord
                : education
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save higher education details.");
      }
    } catch (error) {
      console.error("Error saving higher education details:", error);
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeleteEducationDetails = async (educationId) => {
    try {
      const response = await API.delete(
        `ece/student/higher-education/${educationId}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Higher education details deleted successfully");
        setEducationDetails((prev) =>
          prev.filter((education) => education.education_id !== educationId)
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting higher education details:", err);
      toast.error("Error while deleting higher education details");
    }
  };

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Higher Education Details"
        subtitle="(Student's Higher Education Information)"
        columns={[
          { key: "exam_name", label: "Exam Name" },
          { key: "institute_name", label: "Institute Name" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={educationDetails}
        actions={{
          edit: (education) => {
            setIsAddEducation(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedEducation(education);
          },
          delete: (education) => {
            if (education?.education_id) {
              handleDeleteEducationDetails(education.education_id);
            } else {
              console.error("Education ID is missing or undefined", education);
              toast.error("Education ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddEducation(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedEducation(null);
        }}
      />

      {/* Popup for Adding/Editing Higher Education Details */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddEducation ? (
            <HigherEducationPopUp
              exam_name=""
              institute_name=""
              document=""
              closeModal={closePopup}
              handleAddEducationDetails={handleAddEducationDetails}
            />
          ) : (
            selectedEducation && (
              <HigherEducationPopUp
                exam_name={selectedEducation.exam_name}
                institute_name={selectedEducation.institute_name}
                document={selectedEducation.document}
                closeModal={closePopup}
                handleAddEducationDetails={handleAddEducationDetails}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentHigherEducation;
