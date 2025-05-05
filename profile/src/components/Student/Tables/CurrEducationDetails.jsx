import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import CurrentEducationPopUp from "../PopUp/CurrEducationDetailsPopUp";

const StudentCurrentEducationDetails = ({ setBlurActive }) => {
  const [educationDetails, setEducationDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isAddEducation, setIsAddEducation] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;

  useEffect(() => {
    if (!roll_no) return;

    const fetchEducationDetails = async () => {
      try {
        const response = await API.get(
          `ece/student/current-education?roll_no=${roll_no}`
        );
        const details = response?.data;

        if (details && details.length > 0) {
          setEducationDetails(
            details.map((item) => ({
              id: item.id,
              course: item.course_name || item.course_id,
              admitted_through: item.admitted_through,
              AIR: item.AIR,
              document: item.document,
            }))
          );
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.error || "Error communicating with server"
        );
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

  const handleAddEducationDetails = async (newDetails, file) => {
    const { course, admitted_through, AIR } = newDetails;

    const formData = new FormData();
    formData.append("roll_no", roll_no);
    formData.append("course_name", course);
    formData.append("admitted_through", admitted_through);
    formData.append("AIR", AIR);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddEducation) {
        response = await API.post("ece/student/current-education", formData, {
          params: { roll_no },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `ece/student/current-education/${selectedEducation.id}`,
          formData,
          {
            params: { roll_no },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Education details successfully saved");

        const newRecord = {
          id: response.data.id || selectedEducation.id,
          course: response.data.course_name || course,
          admitted_through: response.data.admitted_through || admitted_through,
          AIR: response.data.AIR || AIR,
          document: response.data.document || selectedEducation?.document,
        };

        if (isAddEducation) {
          setEducationDetails((prev) => [...prev, newRecord]);
        } else {
          setEducationDetails((prev) =>
            prev.map((item) =>
              item.id === selectedEducation.id ? newRecord : item
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save education details.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  const handleDeleteEducationDetails = async (id) => {
    try {
      const response = await API.delete(
        `ece/student/current-education/${id}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Education details deleted successfully");
        setEducationDetails((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  return (
    <>
      <CustomTable
        title="Current Education Details"
        subtitle="(Student's Current Academic Information)"
        columns={[
          { key: "course", label: "Course" },
          { key: "admitted_through", label: "Admitted Through" },
          { key: "AIR", label: "AIR" },
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
            if (education?.id) {
              handleDeleteEducationDetails(education.id);
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

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddEducation ? (
            <CurrentEducationPopUp
              course=""
              admitted_through=""
              AIR=""
              document=""
              closeModal={closePopup}
              handleAddEducationDetails={handleAddEducationDetails}
            />
          ) : (
            selectedEducation && (
              <CurrentEducationPopUp
                course={selectedEducation.course}
                admitted_through={selectedEducation.admitted_through}
                AIR={selectedEducation.AIR}
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

export default StudentCurrentEducationDetails;
