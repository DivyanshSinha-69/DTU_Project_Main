import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PhDPopUp from "../PopUp/PhDsAwardedPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import CustomTable from "../../DynamicComponents/CustomTable";

// Dummy data for testing
const dummyPhDDetails = [
  { menteeName: "John Doe", rollNo: "123456", passingYear: 2020 },
  { menteeName: "Jane Smith", rollNo: "789012", passingYear: 2021 },
  { menteeName: "Alice Johnson", rollNo: "345678", passingYear: 2022 },
];

const Guidance = ({ setBlurActive }) => {
  const [phdDetails, setPhdDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPhD, setSelectedPhD] = useState(null);
  const [isAddPhD, setIsAddPhD] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  useEffect(() => {
    fetchPhDs();
  }, [facultyId]);
  const API_BASE_URL = "/ece/faculty";
  const fetchPhDs = async () => {
    try {
      const response = await API.get(`/ece/faculty/phd-awarded/${facultyId}`);
      // If the API returns an array, map the data; otherwise, clear the state.
      if (Array.isArray(response.data)) {
        setPhdDetails(
          response.data.map((record) => ({
            PHD_id: record.PHD_id,
            menteeName: record.mentee_name,
            rollNo: record.mentee_rn,
            passingYear: record.passing_year,
            passingMonth: record.passing_month, // Added this field
          }))
        );
      } else {
        setPhdDetails([]);
      }
    } catch (error) {
      console.error("Error fetching PhD awarded records:", error);
      setPhdDetails([]);
    }
  };

  useEffect(() => {
    fetchPhDs();
  }, []);

  // Add a new PhD record
  const addPhD = async (newPhD) => {
    try {
      const payload = {
        faculty_id: facultyId,
        mentee_name: newPhD.menteeName,
        mentee_rn: newPhD.rollNo,
        passing_year: newPhD.passingYear,
        passing_month: newPhD.passingMonth, // Added this field
      };
      await API.post("ece/faculty/phd-awarded", payload);
      fetchPhDs();
    } catch (error) {
      console.error("Error adding new PhD record:", error);
    }
  };

  // Update an existing PhD record
  const updatePhD = async (updatedPhD) => {
    try {
      const payload = {
        mentee_name: updatedPhD.menteeName,
        mentee_rn: updatedPhD.rollNo,
        passing_year: updatedPhD.passingYear,
        passing_month: updatedPhD.passingMonth, // Added this field
      };
      await API.put(`ece/faculty/phd-awarded/${updatedPhD.PHD_id}`, payload);
      fetchPhDs();
    } catch (error) {
      console.error("Error updating PhD record:", error);
    }
  };

  // Delete a PhD record
  const deletePhD = async (PHD_id) => {
    try {
      await API.delete(`ece/faculty/phd-awarded/${PHD_id}`);
      fetchPhDs();
    } catch (error) {
      console.error("Error deleting PhD record:", error);
    }
  };

  const openPopup = (phd) => {
    setSelectedPhD(phd);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPhD(true);
    setBlurActive(false);
  };

  // Depending on whether you're adding a new record or updating an existing one,
  // call the appropriate API function.
  const handleAddPhD = async (phd) => {
    if (isAddPhD) {
      await addPhD(phd);
    } else {
      await updatePhD(phd);
    }
    closePopup();
  };

  const handleDeletePhD = async (indexToDelete) => {
    const { PHD_id } = phdDetails[indexToDelete];
    try {
      await deletePhD(PHD_id);
    } catch (error) {
      console.error("Error deleting PhD record:", error);
    }
  };
  const TABLE_HEAD = [
    "Name of the Student",
    "Roll No",
    "Year PhD was Awarded",
    "Month PhD was Awarded", // 👈 Add this
    "Actions",
  ];

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="PhD/M.Tech Guidance Details"
        subtitle="(Mention your students who have completed their PhD)"
        columns={[
          { key: "menteeName", label: "Mentee Name" },
          { key: "rollNo", label: "Roll Number" },
          { key: "passingMonth", label: "Passing Month" },
          { key: "passingYear", label: "Passing Year" },
          { key: "actions", label: "Actions" },
        ]}
        data={phdDetails}
        actions={{
          edit: (phd) => {
            setIsAddPhD(false);
            setSelectedPhD(phd);
            openPopup(phd);
          },
          delete: (phd) => {
            handleDeletePhD(phd.PHD_id);
          },
        }}
        onAdd={() => {
          setIsAddPhD(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedPhD(null);
        }}
      />

      {/* Popup for Adding/Editing PhD Details */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPhD ? (
            <PhDPopUp
              menteeName=""
              rollNo=""
              passingYear=""
              passingMonth=""
              closeModal={closePopup}
              handleAddPhD={handleAddPhD}
            />
          ) : (
            selectedPhD && (
              <PhDPopUp
                menteeName={selectedPhD?.menteeName || ""}
                rollNo={selectedPhD?.rollNo || ""}
                passingYear={selectedPhD?.passingYear || ""}
                passingMonth={selectedPhD?.passingMonth || ""}
                PHD_id={selectedPhD?.PHD_id || ""}
                closeModal={closePopup}
                handleAddPhD={handleAddPhD}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default Guidance;
