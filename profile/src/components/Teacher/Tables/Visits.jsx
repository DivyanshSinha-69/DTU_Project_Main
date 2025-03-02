import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import VisitsPopUp from "../PopUp/VisitsPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import CustomTable from "../../DynamicComponents/CustomTable";

// Dummy data for testing

const Visits = ({ setBlurActive }) => {
  const visitTypeMap = { Visiting: 1, Adjunct: 2, Emeritus: 3 };
  const visitTypeReverseMap = { 1: "Visiting", 2: "Adjunct", 3: "Emeritus" };

  const [visitDetails, setVisitDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isAddVisit, setIsAddVisit] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const FACULTY_ID = faculty_id;
  // Replace with dynamic faculty ID if necessary

  // Fetch visit records from the API using the centralized API instance
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await API.get(`ece/faculty/vae`, {
          params: { faculty_id: FACULTY_ID },
        });
        // Assuming the API returns an object with a "data" property
        setVisitDetails(response.data.data || []);
        console.log(visitDetails);
      } catch (error) {
        console.error("Error fetching visit details:", error);
      }
    };

    fetchVisits();
  }, [FACULTY_ID]);

  // Open the popup for editing or adding a visit record
  const openPopup = (visit) => {
    setSelectedVisit(visit);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddVisit(false);
    setBlurActive(false);
  };

  // Handle adding or updating a visit record
  const handleAddOrUpdateVisit = async (visitData) => {
    // Format the visit payload before sending it to the API
    const formattedVisit = {
      faculty_id: FACULTY_ID, // Static for now
      visit_type: visitData.visitType, // Convert string to number
      institution: visitData.institutionName,
      course_taught: visitData.courses,
      year_of_visit: visitData.year_of_visit,
      month_of_visit: visitData.month_of_visit, // Convert month name to number
      hours_taught: visitData.hours_taught,
    };

    try {
      if (isAddVisit) {
        // ADD new visit record
        const response = await API.post("ece/faculty/vae", formattedVisit);
        // Assuming the new record's id is returned as response.data.data.id
        setVisitDetails((prev) => [
          ...prev,
          { ...formattedVisit, visit_id: response.data.data.id },
        ]);
      } else {
        // UPDATE existing visit record
        await API.put(
          `ece/faculty/vae/${selectedVisit.visit_id}`,
          formattedVisit
        );
        setVisitDetails((prev) =>
          prev.map((visit) =>
            visit.visit_id === selectedVisit.visit_id
              ? { ...visit, ...formattedVisit }
              : visit
          )
        );
      }
      closePopup();
    } catch (error) {
      console.error("Error saving visit details:", error);
    }
  };

  // Delete a visit record
  const handleDeleteVisit = async (visitId) => {
    try {
      await API.delete(`ece/faculty/vae/${visitId}`);
      setVisitDetails((prev) =>
        prev.filter((visit) => visit.visit_id !== visitId)
      );
    } catch (error) {
      console.error("Error deleting visit:", error);
    }
  };

  const TABLE_HEAD = [
    "Visit Type",
    "Institution Name",
    "Names of Courses Taught",
    "Month of Visit",
    "Year of Visit",
    "Hours Taught",
    "Actions",
  ];

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Interaction with the Outside World as Guest Faculty"
        subtitle="(Details of academic visits)"
        columns={[
          { key: "visit_type", label: "Visit Type" },
          { key: "institution", label: "Institution Name" },
          { key: "course_taught", label: "Courses Taught" },
          { key: "month_of_visit", label: "Month of Visit" },
          { key: "year_of_visit", label: "Year of Visit" },
          { key: "hours_taught", label: "Hours Taught" },
          { key: "actions", label: "Actions" },
        ]}
        data={visitDetails}
        actions={{
          edit: (visit) => {
            setIsAddVisit(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedVisit(visit);
          },
          delete: (visit) => {
            if (visit?.visit_id) {
              handleDeleteVisit(visit.visit_id);
            } else {
              console.error("Visit ID is missing or undefined", visit);
            }
          },
        }}
        onAdd={() => {
          setIsAddVisit(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedVisit(null);
        }}
      />

      {/* Popup for Adding/Editing Visit */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddVisit ? (
            <VisitsPopUp
              visitType=""
              institutionName=""
              courses=""
              year_of_visit=""
              month_of_visit=""
              hours_taught=""
              closeModal={closePopup}
              handleAddVisit={handleAddOrUpdateVisit}
            />
          ) : (
            selectedVisit && (
              <VisitsPopUp
                visitType={selectedVisit?.visitType || ""}
                institutionName={selectedVisit?.institutionName || ""}
                courses={selectedVisit?.courses || ""}
                year_of_visit={selectedVisit?.year_of_visit || ""}
                month_of_visit={selectedVisit?.month_of_visit || ""}
                hours_taught={selectedVisit?.hours_taught || ""}
                closeModal={closePopup}
                handleAddVisit={handleAddOrUpdateVisit}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};
export default Visits;
