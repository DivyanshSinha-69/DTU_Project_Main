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
        `ece/faculty/sponsored-research?faculty_id=${facultyId}`
      );
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setResearchDetails([]);
        } else {
          setResearchDetails(
            response.data.map((record) => ({
              project_title: record.project_title,
              funding_agency: record.funding_agency,
              amount_sponsored: record.amount_sponsored,
              stat: record.status, // Include the status field
              start_date: formatDateForInput(record.start_date),
              end_date: formatDateForInput(record.end_date),
              sponsorship_id: record.sponsorship_id,
              document: record.document, // Include the document path
            }))
          );
        }
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
    const formData = new FormData();
    formData.append("faculty_id", facultyId);
    formData.append("project_title", newResearch.title);
    formData.append("funding_agency", newResearch.agency);
    formData.append("amount_sponsored", newResearch.amount);
    formData.append("status", newResearch.stat); // Include status
    formData.append("start_date", newResearch.startDate);
    formData.append("end_date", newResearch.endDate || null);

    if (newResearch.document) {
      formData.append("document", newResearch.document);
    }

    try {
      if (isAddResearch) {
        // Add new research record
        const response = await API.post(
          "ece/faculty/sponsored-research",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        fetchResearchDetails();
      } else {
        // Update existing research record
        await API.put(
          `ece/faculty/sponsored-research/${selectedResearch.sponsorship_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        fetchResearchDetails();
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
        subtitle="(Details of sponsored research)"
        columns={[
          { key: "project_title", label: "Research Title" },
          { key: "funding_agency", label: "Funding Agency" },
          {
            key: "amount_sponsored",
            label: "Amount Sponsored",
          },
          { key: "stat", label: "Status" },
          {
            key: "start_date",
            label: "Start Date",
          },
          {
            key: "end_date",
            label: "End Date",
          },
          { key: "document", label: "Document" },
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
              start_date: research.start_date,
              end_date: research.end_date,
              stat: research.stat,
              sponsorship_id: research.sponsorship_id,
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
              startDate=""
              endDate=""
              stat=""
              closeModal={closePopup}
              handleAddResearch={handleAddResearch}
            />
          ) : (
            selectedResearch && (
              <SponsoredResearchPopUp
                title={selectedResearch?.project_title || ""}
                agency={selectedResearch?.funding_agency || ""}
                amount={selectedResearch?.amount_sponsored || ""}
                stat={selectedResearch?.stat}
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
