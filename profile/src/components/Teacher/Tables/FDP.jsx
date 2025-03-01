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
  useEffect(() => {
    const fetchFDPDetails = async () => {
      try {
        const response = await API.get(`/ece/faculty/fdp-records/${facultyId}`);
        console.log(response.data.data)
        if (Array.isArray(response.data.data)) {
          setFdpDetails(
            response.data.data.map((fdp) => ({
              FDP_id: fdp.FDP_id,
              FDP_name: fdp.FDP_name,
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
    const { programName, year, month, days } = newFDP;

    const payload = {
      faculty_id: facultyId,
      FDP_name: programName,
      year_conducted: year,
      month_conducted: month,
      days_contributed: days,
    };

    try {
      let response;
      if (isAddFDP) {
        response = await API.post("/ece/faculty/fdp-records", payload);
      } else {
        response = await API.put(
          `/ece/faculty/fdp-records/${selectedFDP.FDP_id}`,
          payload,
        );
      }

      console.log("API Response:", response.data); // Debugging

      if (response && response.data) {
        toast.success("FDP record successfully saved");

        // Ensure the new data matches the expected format
        const newFDPRecord = {
          FDP_id: response.data.data.id || selectedFDP.FDP_id, // Ensure ID exists
          FDP_name: response.data.FDP_name || programName,
          year_conducted: response.data.year_conducted || year,
          month_conducted: response.data.month_conducted || month,
          days_contributed: response.data.days_contributed || days,
        };

        if (isAddFDP) {
          setFdpDetails((prev) => [...prev, newFDPRecord]);
        } else {
          setFdpDetails((prev) =>
            prev.map((fdp) =>
              fdp.FDP_id === selectedFDP.FDP_id ? newFDPRecord : fdp,
            ),
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save FDP record.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

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

  const TABLE_HEAD = [
    "Title of Faculty development/training activities/STTP",
    "Year of Participation",
    "Month of Participation",
    "Duration of Participation(in days)",
    "Actions",
  ];


  return (
    <>
      {/* Header Section */}
      
  
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Participation in Faculty Development/Training Activities/STTP"
        subtitle="(Details of FDPs conducted or attended)"
        columns={[
          { key: "FDP_name", label: "Program Name" },
          { key: "year_conducted", label: "Year" },
          { key: "month_conducted", label: "Month" },
          { key: "days_contributed", label: "Days" },
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
