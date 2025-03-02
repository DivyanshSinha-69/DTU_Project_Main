import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import QualificationPopUp from "../PopUp/QualificationPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";

const Qualification = ({ setBlurActive }) => {
  const [qualificationDetails, setQualificationDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [isAddQualification, setIsAddQualification] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const { darkMode } = useThemeContext();
  const facultyId = faculty_id;

  useEffect(() => {
    const fetchQualificationDetails = async () => {
      try {
        const response = await API.get(
          `ece/faculty/qualification/${facultyId}`
        );
        console.log(response.data);

        if (Array.isArray(response.data)) {
          setQualificationDetails(
            response.data.map((qualification) => ({
              education_id: qualification.education_id,
              degree_level: qualification.degree_level,
              institute: qualification.institute,
              degree_name: qualification.degree_name,
              year_of_passing: qualification.year_of_passing,
              specialization: qualification.specialization,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching qualification details:", error);
        toast.error("Error while fetching qualification details");
      }
    };

    fetchQualificationDetails();
  }, [facultyId]);

  const openPopup = (qualification) => {
    setSelectedQualification(qualification);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddQualification(false);
    setBlurActive(false);
  };

  const handleAddQualification = async (newQualification) => {
    const {
      degreeLevel,
      institute,
      degreeName,
      yearOfPassing,
      specialization,
    } = newQualification;

    const payload = {
      faculty_id: facultyId,
      degree_level: degreeLevel,
      institute: institute,
      degree_name: degreeName,
      year_of_passing: yearOfPassing,
      specialization: specialization,
    };

    try {
      let response;
      if (isAddQualification) {
        response = await API.post("ece/faculty/qualification", payload);
      } else {
        response = await API.put(
          `ece/faculty/qualification/${selectedQualification.education_id}`,
          payload
        );
      }

      console.log("API Response:", response.data); // Debugging

      if (response && response.data) {
        toast.success("Qualification record successfully saved");

        const newQualificationRecord = {
          education_id:
            response.data.education_id || selectedQualification.education_id,
          degree_level: response.data.degree_level || degreeLevel,
          institute: response.data.institute || institute,
          degree_name: response.data.degree_name || degreeName,
          year_of_passing: response.data.year_of_passing || yearOfPassing,
          specialization: response.data.specialization || specialization,
        };

        if (isAddQualification) {
          setQualificationDetails((prev) => [...prev, newQualificationRecord]);
        } else {
          setQualificationDetails((prev) =>
            prev.map((qualification) =>
              qualification.education_id === selectedQualification.education_id
                ? newQualificationRecord
                : qualification
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save qualification record.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeleteQualification = async (educationId) => {
    try {
      const response = await API.delete(
        `ece/faculty/qualification/${educationId}`
      );
      if (response && response.data) {
        toast.success("Qualification record deleted successfully");
        setQualificationDetails((prev) =>
          prev.filter(
            (qualification) => qualification.education_id !== educationId
          )
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting qualification record:", err);
      toast.error("Error while deleting qualification");
    }
  };

  const TABLE_HEAD = [
    "Degree Level",
    "Institute",
    "Degree Name",
    "Year of Passing",
    "Specialization",
    "Actions",
  ];

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Qualifications"
        subtitle="(Details of Academic Qualifications)"
        columns={[
          { key: "degree_level", label: "Degree Level" },
          { key: "institute", label: "Institute" },
          { key: "degree_name", label: "Degree Name" },
          { key: "year_of_passing", label: "Year of Passing" },
          { key: "specialization", label: "Specialization" },
          { key: "actions", label: "Actions" },
        ]}
        data={qualificationDetails} // Qualification data array
        actions={{
          edit: (qualification) => {
            setIsAddQualification(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedQualification(qualification);
          },
          delete: (qualification) => {
            if (qualification?.education_id) {
              handleDeleteQualification(qualification.education_id);
            } else {
              console.error(
                "Qualification ID is missing or undefined",
                qualification
              );
              toast.error("Qualification ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddQualification(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedQualification(null);
        }}
      />

      {/* Popup for Adding/Editing Qualification */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddQualification ? (
            <QualificationPopUp
              degreeLevel=""
              institute=""
              degreeName=""
              yearOfPassing=""
              specialization=""
              closeModal={closePopup}
              handleAddQualification={handleAddQualification}
            />
          ) : (
            selectedQualification && (
              <QualificationPopUp
                degreeLevel={selectedQualification.degree_level}
                institute={selectedQualification.institute}
                degreeName={selectedQualification.degree_name}
                yearOfPassing={selectedQualification.year_of_passing}
                specialization={selectedQualification.specialization}
                closeModal={closePopup}
                handleAddQualification={handleAddQualification}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};
export default Qualification;
