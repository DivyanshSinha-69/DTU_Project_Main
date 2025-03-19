import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PhDPopUp from "../PopUp/GuidancePopUp";
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
      const response = await API.get(`/ece/faculty/guidance/${facultyId}`);
      if (Array.isArray(response.data)) {
        setPhdDetails(
          response.data.map((record) => ({
            Guidance_id: record.Guidance_id,
            menteeName: record.mentee_name,
            rollNo: record.mentee_rn,
            passingYear: record.passing_year,
            passingMonth: record.passing_month,
            degree: record.degree, // Added this field
            document: record.document,
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
      const formData = new FormData();
      formData.append("faculty_id", facultyId);
      formData.append("mentee_name", newPhD.menteeName);
      formData.append("mentee_rn", newPhD.rollNo);
      formData.append("passing_year", newPhD.passingYear);
      formData.append("passing_month", newPhD.passingMonth);
      formData.append("degree", newPhD.degree);
      if (newPhD.document) {
        formData.append("document", newPhD.document);
      }

      await API.post("ece/faculty/guidance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        degree: updatedPhD.degree, // Added this field
        document: updatePhD.document,
      };
      await API.put(`ece/faculty/guidance/${updatedPhD.Guidance_id}`, payload);
      fetchPhDs();
    } catch (error) {
      console.error("Error updating PhD record:", error);
    }
  };

  // Delete a PhD record
  const deletePhD = async (Guidance_id) => {
    console.log("Deleting PhD record with ID:", Guidance_id);
    try {
      await API.delete(`ece/faculty/guidance/${Guidance_id}`);
      fetchPhDs();
    } catch (error) {
      console.error("Error deleting PhD record:", error);
    }
  };

  const openPopup = (phd) => {
    setSelectedPhD(phd);
    console.log("Selected PhD:", phd);
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
    const { Guidance_id } = phdDetails[indexToDelete];
    try {
      await deletePhD(Guidance_id);
    } catch (error) {
      console.error("Error deleting PhD record:", error);
    }
  };
  const TABLE_HEAD = [
    "Name of the Student",
    "Degree",
    "Roll No",
    "Year PhD was Awarded",
    "Month PhD was Awarded", // 👈 Add this
    "Document",
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
          { key: "degree", label: "Degree" }, // 👈 Add this
          { key: "rollNo", label: "Roll Number" },
          { key: "passingMonth", label: "Passing Month" },
          { key: "passingYear", label: "Passing Year" },
          { key: "document", label: "Document" },
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
            console.log("Deleting PhD record:", phd);
            handleDeletePhD(phd.Guidance_id);
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
              degree=""
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
                degree={selectedPhD?.degree || ""}
                rollNo={selectedPhD?.rollNo || ""}
                passingYear={selectedPhD?.passingYear || ""}
                passingMonth={selectedPhD?.passingMonth || ""}
                Guidance_id={selectedPhD?.Guidance_id || ""}
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
