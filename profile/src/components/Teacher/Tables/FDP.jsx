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

  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };

  const fetchFDPDetails = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/fdp-records?faculty_id=${facultyId}`
      );
      if (Array.isArray(response.data.data)) {
        if (response.data.data.length === 0) {
          setFdpDetails([]);
        } else {
          setFdpDetails(
            response.data.data.map((fdp) => ({
              FDP_id: fdp.FDP_id,
              FDP_name: fdp.FDP_name,
              FDP_progress: fdp.FDP_progress,
              start_date: formatDate(fdp?.start_date),
              end_date: formatDate(fdp?.end_date),
              days_contributed: fdp.days_contributed,
              organizing_institute: fdp.organizing_institute || "-",
              document: fdp.document || null,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching FDP details:", error);
      toast.error("Error fetching FDP details");
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
    const {
      programName,
      type,
      startDate,
      endDate,
      organizingInstitute,
      document,
    } = newFDP;

    const formData = new FormData();
    formData.append("faculty_id", facultyId);
    formData.append("FDP_name", programName);
    formData.append("FDP_progress", type);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("organizing_institute", organizingInstitute || "");

    if (document) {
      formData.append("document", document);
    }

    try {
      let response;
      if (isAddFDP) {
        response = await API.post("/ece/faculty/fdp-records", formData, {
          params: { faculty_id: facultyId },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `/ece/faculty/fdp-records/${selectedFDP.FDP_id}`,

          formData,
          {
            params: { faculty_id: facultyId },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
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
    "Type",
    "Organizing Institute",
    "Start Date",
    "End Date",
    "Duration (in days)",
    "Proof",
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

  const formatDateForInputPopup = (date) => {
    if (!date) return ""; // Handle null/undefined cases
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };

  return (
    <>
      <CustomTable
        title="FDP/Short Term Training Program"
        subtitle="(Details of FDP/Short Term Training Program)"
        columns={[
          { key: "FDP_name", label: "Program Name" },
          { key: "FDP_progress", label: "Type" },
          { key: "organizing_institute", label: "Organizing Institute" },
          { key: "start_date", label: "Start Date" },
          { key: "end_date", label: "End Date" },
          { key: "days_contributed", label: "Duration (in days)" },
          {
            key: "document",
            label: "Proof",
            render: (document) =>
              document ? (
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/${document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              ) : (
                <span className="text-gray-500">Not uploaded</span>
              ),
          },
          { key: "actions", label: "Actions" },
        ]}
        data={fdpDetails}
        actions={{
          edit: (fdp) => {
            setIsAddFDP(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedFDP({
              ...fdp,
              startDate: formatDateForInputPopup(fdp.start_date),
              endDate: formatDateForInputPopup(fdp.end_date),
            });
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
              type=""
              startDate=""
              endDate=""
              organizingInstitute=""
              document={null}
              closeModal={closePopup}
              handleAddFDP={handleAddFDP}
            />
          ) : (
            selectedFDP && (
              <FDPPopUp
                programName={selectedFDP.FDP_name}
                type={selectedFDP.FDP_progress}
                startDate={selectedFDP.startDate}
                endDate={selectedFDP.endDate}
                organizingInstitute={selectedFDP.organizing_institute}
                document={selectedFDP.document}
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
