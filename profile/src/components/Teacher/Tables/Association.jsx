import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import AssociationPopUp from "../PopUp/AssociationPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import { store } from "../../../redux/Store";
import CustomTable from "../../DynamicComponents/CustomTable";
const Association = ({ setBlurActive }) => {
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [associationDetails, setAssociationDetails] = useState({
    highestDesignation: "",
    highestDesignationDate: "",
    associateProfessorStartDate: "",
    associateProfessorEndDate: "",
    assistantProfessorStartDate: "",
    assistantProfessorEndDate: "",
  });
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  // Load data from localStorage on mount or set dummy data

  useEffect(() => {
    if (!facultyId) return; // Prevent API call if facultyId is null

    const fetchAssociationDetails = async () => {
      const url = `/ece/faculty/facultyassociation/${facultyId}`;

      try {
        const response = await API.get(url);
        const data = response.data;

        if (data.success) {
          setAssociationDetails({
            highestDesignation:
              data.association.designation === 1
                ? "Professor"
                : data.association.designation === 2
                  ? "Associate Professor"
                  : "Assistant Professor",
            highestDesignationDate:
              formatDateForInput(data.association.date_asg_prof) ||
              formatDateForInput(data.association.date_asg_asoprof) ||
              formatDateForInput(data.association.date_asg_astprof) ||
              "",
            associateProfessorStartDate:
              formatDateForInput(data.association.date_asg_asoprof) || "",
            associateProfessorEndDate:
              formatDateForInput(data.association.date_end_asoprof) || "",
            assistantProfessorStartDate:
              formatDateForInput(data.association.date_asg_astprof) || "",
            assistantProfessorEndDate:
              formatDateForInput(data.association.date_end_astprof) || "",
          });
        }
      } catch (error) {
        console.error("Error fetching faculty association details:", error);
      }
    };

    fetchAssociationDetails();
  }, [facultyId]); // Added facultyId as a dependency

  // Function to open popup
  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true);
  };

  // Function to close popup
  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  // Function to update data and save to localStorage

  const updateAssociationDetails = async (data) => {
    try {
      const payload = {
        faculty_id: facultyId,
        designation:
          data.highestDesignation === "Professor"
            ? 1
            : data.highestDesignation === "Associate Professor"
              ? 2
              : 3, // Assistant Professor

        date_asg_prof:
          data.highestDesignation === "Professor"
            ? data.highestDesignationDate
            : null,

        date_asg_asoprof:
          data.highestDesignation === "Associate Professor"
            ? data.highestDesignationDate
            : data.associateProfessorStartDate || null,

        date_end_asoprof:
          data.highestDesignation === "Associate Professor"
            ? data.associateProfessorEndDate
            : null,

        date_asg_astprof:
          data.highestDesignation === "Assistant Professor"
            ? data.highestDesignationDate
            : data.assistantProfessorStartDate || null,

        date_end_astprof:
          data.highestDesignation === "Assistant Professor"
            ? null
            : data.assistantProfessorEndDate || null,

        date_end_prof: null, // Keep this as is
      };

      console.log("Payload sent to API:", payload);

      const url = `${process.env.REACT_APP_BACKEND_URL}/ece/faculty/facultyassociation/${facultyId}`;
      const response = await API.put(url, payload);

      if (response.data.success) {
        setAssociationDetails(data);
        closePopup();
      } else {
        console.error("⚠️ Update Failed:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Error in update request:", error);
    }
  };

  // Prepare table data based on designation logic
  const TABLE_HEAD = [
    "Designation",
    "Date Attained",
    "Start Date",
    "Last Date",
  ];
  const TABLE_ROWS = [];

  const {
    highestDesignation,
    highestDesignationDate,
    associateProfessorStartDate,
    associateProfessorEndDate,
    assistantProfessorStartDate,
    assistantProfessorEndDate,
  } = associationDetails;

  if (highestDesignation === "Professor") {
    TABLE_ROWS.push(
      { designation: "Professor", date: highestDesignationDate },
      {
        designation: "Associate Professor",
        startDate: associateProfessorStartDate,
        endDate: associateProfessorEndDate,
      },
      {
        designation: "Assistant Professor",
        startDate: assistantProfessorStartDate,
        endDate: assistantProfessorEndDate,
      }
    );
  } else if (highestDesignation === "Associate Professor") {
    TABLE_ROWS.push(
      { designation: "Associate Professor", date: highestDesignationDate },
      {
        designation: "Assistant Professor",
        startDate: assistantProfessorStartDate,
        endDate: assistantProfessorEndDate,
      }
    );
  } else if (highestDesignation === "Assistant Professor") {
    TABLE_ROWS.push({
      designation: "Assistant Professor",
      date: highestDesignationDate,
    });
  }
  const formatDateForPopUP = (date) => {
    const [date1, time] = date?.split("T");

    const [day, month, year] = date1.split("-");
    return `${day}-${month}-${year}`; // yyyy-MM-dd
  };
  return (
    <>
      <CustomTable
        title="Designation Details"
        subtitle="(As per official records)"
        columns={[
          { key: "designation", label: "Designation" },
          { key: "date", label: "Date Attained" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "Last Date" },
        ]}
        data={TABLE_ROWS || []}
        actions={{
          edit: openPopup,
        }}
        onAdd={openPopup}
      />

      <Popup open={isPopupOpen} onClose={closePopup} closeOnDocumentClick>
        <AssociationPopUp
          currentDetails={associationDetails}
          onUpdate={updateAssociationDetails}
          closeModal={closePopup}
        />
      </Popup>
    </>
  );
};

export default Association;
