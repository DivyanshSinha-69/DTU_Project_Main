import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import FDPPopUp from "../PopUp/FDPPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";

const FacultyDevelopmentProgram = ({ setBlurActive }) => {
  const [fdpDetails, setFdpDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFDP, setSelectedFDP] = useState([]);
  const [isAddFDP, setIsAddFDP] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const { darkMode } = useThemeContext();
  const facultyId = faculty_id;
  const fetchFDPDetails = async () => {
    try {
      const response = await API.get(`/ece/faculty/fdp-records/${facultyId}`);

      if (Array.isArray(response.data.data)) {
        setFdpDetails(
          response.data.data.map((fdp) => ({
            FDP_id: fdp.FDP_id,
            FDP_name: fdp.FDP_name,
            FDP_progress: fdp.FDP_progress,
            year_conducted: fdp.year_conducted,
            month_conducted: fdp.month_conducted,
            days_contributed: fdp.days_contributed,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching FDP details:", error);
      toast.error("Error while fetching FDP details");
    }
  };
  useEffect(() => {
    fetchFDPDetails();
  }, []);

  const openPopup = (fdp) => {
    setSelectedFDP(fdp);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddFDP(false);
    setBlurActive(false);
  };

  const handleAddFDP = async (newFDP) => {
    const { programName, year, month, days, type } = newFDP;

    const payload = {
      faculty_id: facultyId,
      FDP_name: programName,
      year_conducted: year,
      month_conducted: month,
      days_contributed: days,
      FDP_progress: type,
    };
    try {
      let response;
      if (isAddFDP) {
        response = await API.post("/ece/faculty/fdp-records", payload);
      } else {
        response = await API.put(
          `/ece/faculty/fdp-records/${selectedFDP.FDP_id}`,
          payload
        );
      }

      if (response && response.data) {
        toast.success("FDP record successfully saved");

        closePopup();
        fetchFDPDetails();
      } else {
        toast.error("Failed to save FDP record.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
      console.log("Error saving FDP record:", error);
    }
  };

  const TABLE_HEAD = [
    "FDP/Short Term Training Program",
    "Type", // Add the Type column

    "Year of Participation",
    "Month of Participation",
    "Duration(in days)",
    "Actions",
  ];

  const handleDeleteFDP = async (fdpId) => {
    try {
      const response = await API.delete(`/ece/faculty/fdp-records/${fdpId}`);
      if (response && response.data) {
        toast.success("FDP record deleted successfully");
        setFdpDetails((prev) => prev.filter((fdp) => fdp.FDP_id !== fdpId));
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting FDP record:", err);
      toast.error("Error while deleting FDP");
    }
  };

  return (
    <>
      {/* Header Section */}

      {/* Reusable Custom Table Component */}
      <CustomTable
        title="FDP/Short Term Training Program"
        subtitle="(Details of FDP/Short Term Training Program)"
        columns={[
          { key: "FDP_name", label: "Program Name" },
          { key: "FDP_progress", label: "Type" },
          { key: "year_conducted", label: "Year" },
          { key: "month_conducted", label: "Month" },
          { key: "days_contributed", label: "Duration(in days)" },
          // Add the Type column
          { key: "actions", label: "Actions" },
        ]}
        data={fdpDetails} // FDP data array
        actions={{
          edit: (fdp) => {
            setIsAddFDP(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedFDP(fdp);
          },
          delete: (fdp) => {
            if (fdp?.FDP_id) {
              handleDeleteFDP(fdp.FDP_id);
            } else {
              console.error("FDP ID is missing or undefined", fdp);
              toast.error("FDP ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddFDP(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedFDP(null);
        }}
      />

      {/* Popup for Adding/Editing FDP */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddFDP ? (
            <FDPPopUp
              programName=""
              year=""
              month=""
              days=""
              type=""
              closeModal={closePopup}
              handleAddFDP={handleAddFDP}
            />
          ) : (
            selectedFDP && (
              <FDPPopUp
                programName={selectedFDP.FDP_name}
                year={selectedFDP.year_conducted}
                month={selectedFDP.month_conducted}
                days={selectedFDP.days_contributed}
                type={selectedFDP.FDP_progress}
                closeModal={closePopup}
                handleAddFDP={handleAddFDP}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};
export default FacultyDevelopmentProgram;
