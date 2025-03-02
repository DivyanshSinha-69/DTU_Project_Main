import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import SponsoredResearchPopUp from "../PopUp/SponsoredResearchPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import CustomTable from "../../DynamicComponents/CustomTable";

// Dummy data for testing

const SponsoredResearch = ({ setBlurActive }) => {
  const [researchDetails, setResearchDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isAddResearch, setIsAddResearch] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  // Fetch Sponsored Research records
  const fetchResearchDetails = async () => {
    try {
      const response = await API.get(
        `ece/faculty/sponsored-research/${facultyId}`
      );
      // If the API returns an array, map it; otherwise, set an empty array.
      if (Array.isArray(response.data)) {
        setResearchDetails(
          response.data.map((record) => ({
            project_title: record.project_title,
            funding_agency: record.funding_agency,
            amount_sponsored: record.amount_sponsored,
            research_duration: record.research_duration,
            start_date: formatDateForInput(record.start_date),
            end_date: formatDateForInput(record.end_date),
            sponsorship_id: record.sponsorship_id,
          }))
        );
        console.log(researchDetails);
      } else {
        setResearchDetails([]);
      }
    } catch (error) {
      console.error("Error fetching sponsored research records:", error);
      setResearchDetails([]);
    }
  };

  useEffect(() => {
    fetchResearchDetails();
  }, [facultyId]);

  // Open the popup and format the start date for display
  const openPopup = (research) => {
    const formattedStartDate = research.startDate
      ? new Date(research.startDate).toLocaleDateString("en-GB")
      : "";
    setSelectedResearch({
      ...research,
      start_date: formattedStartDate, // update start_date with formatted value
    });
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddResearch(false);
    setBlurActive(false);
  };

  // Add or update a sponsored research record
  const handleAddResearch = async (newResearch) => {
    // Build the payload to send to the API
    const requestPayload = {
      faculty_id: facultyId,
      project_title: newResearch.title,
      funding_agency: newResearch.agency,
      amount_sponsored: newResearch.amount,
      research_duration: newResearch.duration,
      start_date: newResearch.startDate,
      end_date: newResearch.endDate || null,
    };

    try {
      if (isAddResearch) {
        // Add new research record
        const response = await API.post(
          "ece/faculty/sponsored-research",
          requestPayload
        );
        setResearchDetails((prev) => [
          ...prev,
          { ...newResearch, sponsorship_id: response.data.sponsorship_id },
        ]);
      } else {
        // Update existing research record
        await API.put(
          `ece/faculty/sponsored-research/${selectedResearch.sponsorship_id}`,
          requestPayload
        );
        setResearchDetails((prev) =>
          prev.map((research) =>
            research.sponsorship_id === selectedResearch.sponsorship_id
              ? { ...newResearch }
              : research
          )
        );
      }
      closePopup();
    } catch (error) {
      console.error(
        isAddResearch
          ? "Error adding sponsored research:"
          : "Error updating sponsored research:",
        error
      );
    }
  };

  // Delete a research record
  const handleDeleteResearch = async (sponsorshipId) => {
    try {
      await API.delete(`ece/faculty/sponsored-research/${sponsorshipId}`);
      setResearchDetails((prev) =>
        prev.filter((research) => research.sponsorship_id !== sponsorshipId)
      );
    } catch (error) {
      console.error("Error deleting sponsored research:", error);
    }
  };

  // Table headers for displaying research details
  const TABLE_HEAD = [
    "Project Title",
    "Funding Agency",
    "Amount Sponsored",
    "Duration (Years)",
    "Start Date",
    "End Date",
    "Actions",
  ];

  // Optional: Format a date string for input fields if needed
  const formatDateForInputPopup = (date) => {
    const [day, month, year] = date?.split("/");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };
  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Sponsored Research"
        subtitle="(Details of sponsored research projects)"
        columns={[
          { key: "project_title", label: "Project Title" },
          { key: "funding_agency", label: "Funding Agency" },
          {
            key: "amount_sponsored",
            label: "Amount Sponsored",
          },
          { key: "research_duration", label: "Duration" },
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
        data={researchDetails}
        actions={{
          edit: (research) => {
            openPopup(research);
            setIsAddResearch(false);
            setSelectedResearch({
              project_title: research.project_title,
              funding_agency: research.funding_agency,
              amount_sponsored: research.amount_sponsored,
              research_duration: research.research_duration,
              start_date: research.start_date,
              end_date: research.end_date,
            });
          },
          delete: (research) => handleDeleteResearch(research.sponsorship_id),
        }}
        onAdd={() => {
          setIsAddResearch(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedResearch(null);
        }}
      />

      {/* Popup for Adding/Editing Sponsored Research */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddResearch ? (
            <SponsoredResearchPopUp
              title=""
              agency=""
              amount=""
              duration=""
              startDate=""
              endDate=""
              closeModal={closePopup}
              handleAddResearch={handleAddResearch}
            />
          ) : (
            selectedResearch && (
              <SponsoredResearchPopUp
                title={selectedResearch?.project_title || ""}
                agency={selectedResearch?.funding_agency || ""}
                amount={selectedResearch?.amount_sponsored || ""}
                duration={selectedResearch?.research_duration || ""}
                startDate={formatDateForInputPopup(
                  selectedResearch?.start_date
                )}
                endDate={
                  selectedResearch?.end_date
                    ? formatDateForInputPopup(selectedResearch?.end_date)
                    : ""
                }
                closeModal={closePopup}
                handleAddResearch={handleAddResearch}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default SponsoredResearch;
