import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import PreviousEducationPopUp from "../PopUp/PrevEducationDetailsPopUp";

const StudentPreviousEducationDetails = ({ setBlurActive }) => {
  const [educationDetails, setEducationDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isAddEducation, setIsAddEducation] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const fetchEducationDetails = async () => {
    try {
      const response = await API.get(
        `ece/student/previous-education?roll_no=${roll_no}`
      );
      const details = response?.data;

      if (details && details.length > 0) {
        setEducationDetails(
          details.map((item) => ({
            id: item.id,
            course: item.course_name || item.course,
            specialization: item.specialization,
            institution: item.institution,
            percent_obtained: item.percent_obtained,
            passout_year: item.passout_year,
          }))
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };
  useEffect(() => {
    if (!roll_no) return;

    fetchEducationDetails();
  }, [roll_no]);

  const openPopup = (education) => {
    setSelectedEducation(education);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    console.log("Closing popup"); // Debugging line
    setPopupOpen(false);
    setIsAddEducation(false);
    setBlurActive(false);
  };

  const handleAddEducationDetails = async (newDetails) => {
    const {
      course,
      specialization,
      institution,
      percent_obtained,
      passout_year,
    } = newDetails;

    if (!course || !institution || !percent_obtained || !passout_year) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      course_name: course,
      specialization: specialization || "",
      institution,
      percent_obtained,
      passout_year,
    };

    try {
      let response;
      if (isAddEducation) {
        // POST for new entries
        response = await API.post("ece/student/previous-education", payload, {
          params: { roll_no },
        });
      } else {
        // PUT for updates - note the URL structure matches your backend
        response = await API.put(
          `ece/student/previous-education/${selectedEducation.id}`,
          payload,
          {
            params: { roll_no }, // roll_no as query parameter
          }
        );
      }

      if (response?.data) {
        toast.success("Education details successfully saved");

        const newRecord = {
          id: response.data.id || selectedEducation?.id,
          course: response.data.course_name || course,
          specialization: response.data.specialization || specialization || "",
          institution: response.data.institution || institution,
          percent_obtained: response.data.percent_obtained || percent_obtained,
          passout_year: response.data.passout_year || passout_year,
        };
        fetchEducationDetails(); // Refresh the list after adding/updating
        closePopup();
      } else {
        toast.error("Failed to save education details.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Error connecting to the server. Please try again."
      );
    }
  };
  const handleDeleteEducationDetails = async (id) => {
    try {
      if (!roll_no) {
        toast.error("Roll number is required");
        return;
      }

      const response = await API.delete(
        `ece/student/previous-education/${id}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Education details deleted successfully");
        setEducationDetails((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting education details:", err);
      toast.error(
        err?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  return (
    <>
      <CustomTable
        title="Previous Education Details"
        subtitle="(Student's Academic History)"
        columns={[
          { key: "course", label: "Course" },
          { key: "specialization", label: "Specialization" },
          { key: "institution", label: "Institution" },
          { key: "percent_obtained", label: "Percentage" },
          { key: "passout_year", label: "Passout Year" },
          { key: "actions", label: "Actions" },
        ]}
        data={educationDetails || []}
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
            <PreviousEducationPopUp
              course=""
              specialization=""
              institution=""
              percent_obtained=""
              passout_year=""
              closeModal={closePopup}
              handleAddEducationDetails={handleAddEducationDetails}
            />
          ) : (
            selectedEducation && (
              <PreviousEducationPopUp
                course={selectedEducation.course}
                specialization={selectedEducation.specialization}
                institution={selectedEducation.institution}
                percent_obtained={selectedEducation.percent_obtained}
                passout_year={selectedEducation.passout_year}
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

export default StudentPreviousEducationDetails;
