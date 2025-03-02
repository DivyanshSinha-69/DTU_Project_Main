import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import ConsultancyDetailsPopUp from "../PopUp/ConsultancyPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";

const ConsultancyDetails = ({ setBlurActive }) => {
  const [consultancyDetails, setConsultancyDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [isAddConsultancy, setIsAddConsultancy] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  const fetchConsultancyDetails = async () => {
    try {
      const response = await API.get(`/ece/faculty/consultancy/${facultyId}`);
      if (Array.isArray(response.data)) {
        setConsultancyDetails(
          response.data.map((record) => ({
            project_title: record.project_title,
            funding_agency: record.funding_agency,
            amount_sponsored: record.amount_sponsored,
            research_duration: record.research_duration,
            start_date: formatDateForInput(record.start_date),
            end_date: formatDateForInput(record.end_date),
            consultancy_id: record.consultancy_id,
          }))
        );
      } else {
        setConsultancyDetails([]); // Set an empty array if no records are found
      }
    } catch (error) {
      console.error("Error fetching consultancy records:", error);
      setConsultancyDetails([]); // Fallback to an empty array in case of errors
    }
  };

  useEffect(() => {
    fetchConsultancyDetails();
  }, [facultyId]);
  const openPopup = (consultancy) => {
    setSelectedConsultancy(consultancy);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddConsultancy(false);
    setBlurActive(false);
  };

  const handleAddConsultancy = async (newConsultancy) => {
    try {
      const payload = {
        faculty_id: facultyId,
        project_title: newConsultancy.title,
        funding_agency: newConsultancy.client || null,
        amount_sponsored: newConsultancy.amount || 0,
        research_duration: newConsultancy.duration || null,
        start_date: newConsultancy.startDate,
        end_date: newConsultancy.endDate || null,
      };

      if (isAddConsultancy) {
        // Add new consultancy
        await API.post("/ece/faculty/consultancy", payload);
      } else {
        // Update existing consultancy
        await API.put(
          `/ece/faculty/consultancy/${selectedConsultancy.consultancy_id}`,
          payload
        );
      }

      // Refresh consultancy details after adding/updating
      fetchConsultancyDetails();
      closePopup();
    } catch (error) {
      console.error("Error adding/updating consultancy:", error);
    }
  };

  const handleDeleteConsultancy = async (indexToDelete) => {
    const consultancyToDelete = consultancyDetails[indexToDelete];
    try {
      await API.delete(
        `/ece/faculty/consultancy/${consultancyToDelete.consultancy_id}`
      );
      // Refresh consultancy details after deleting
      fetchConsultancyDetails();
    } catch (error) {
      console.error("Error deleting consultancy:", error);
    }
  };

  const TABLE_HEAD = [
    "Consultancy Title",
    "Agency Name",
    "Funding Amount",
    "Duration (Years)",
    "Start Date",
    "End Date",
    "Actions",
  ];
  const formatDateForInputPopup = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };
  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Consultancy Details"
        subtitle="(Details of consultancy projects)"
        columns={[
          { key: "project_title", label: "Project Title" },
          { key: "funding_agency", label: "Funding Agency" },
          {
            key: "amount_sponsored",
            label: "Amount Sponsored",
            format: (value) => `₹${value?.toLocaleString()}`,
          },
          {
            key: "research_duration",
            label: "Research Duration",
            format: (value) => `${value} years`,
          },
          {
            key: "start_date",
            label: "Start Date",
          },
          {
            key: "end_date",
            label: "End Date",
          },
          { key: "actions", label: "Actions" },
        ]}
        data={consultancyDetails}
        actions={{
          edit: (consultancy) => {
            setIsAddConsultancy(false);
            setSelectedConsultancy(consultancy);
            openPopup(consultancy);
          },
          delete: (consultancy) => {
            handleDeleteConsultancy(consultancy.consultancy_id);
          },
        }}
        onAdd={() => {
          setIsAddConsultancy(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedConsultancy(null);
        }}
      />

      {/* Popup for Adding/Editing Consultancy Details */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddConsultancy ? (
            <ConsultancyDetailsPopUp
              title=""
              client=""
              amount=""
              duration=""
              startDate=""
              endDate=""
              closeModal={closePopup}
              handleAddConsultancy={handleAddConsultancy}
            />
          ) : (
            selectedConsultancy && (
              <ConsultancyDetailsPopUp
                title={selectedConsultancy?.project_title || ""}
                client={selectedConsultancy?.funding_agency || ""}
                amount={selectedConsultancy?.amount_sponsored || ""}
                duration={selectedConsultancy?.research_duration || ""}
                startDate={
                  formatDateForInputPopup(selectedConsultancy?.start_date) || ""
                }
                endDate={
                  selectedConsultancy?.end_date
                    ? formatDateForInputPopup(selectedConsultancy?.end_date)
                    : ""
                }
                closeModal={closePopup}
                handleAddConsultancy={handleAddConsultancy}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default ConsultancyDetails;
