import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import SocietyDetailsPopUp from "../PopUp/SocietyDetailsPopUp";

const StudentSocietyDetails = ({ setBlurActive }) => {
  const [societies, setSocieties] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [isAddSociety, setIsAddSociety] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();
  const fetchSocieties = async () => {
    try {
      const response = await API.get(`ece/student/society?roll_no=${roll_no}`);
      console.log("Societies response:", response);
      const societiesData = response?.data || [];

      if (societiesData.length > 0) {
        setSocieties(societiesData);
      }
      console.log("Societies data:", societiesData);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };
  useEffect(() => {
    if (!roll_no) return;

    fetchSocieties();
  }, [roll_no]);

  const openPopup = (society) => {
    setSelectedSociety(society);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddSociety(false);
    setBlurActive(false);
  };

  const handleAddSociety = async (newSociety, file) => {
    const formData = new FormData();
    formData.append("roll_no", roll_no);
    formData.append("type", newSociety.type);
    formData.append("society_name", newSociety.name);
    formData.append("role", newSociety.role);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddSociety) {
        response = await API.post("ece/student/society", formData, {
          params: {
            roll_no: roll_no,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `ece/student/society/${selectedSociety.id}`,
          formData,
          {
            params: {
              roll_no: roll_no,
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Society details saved successfully");
        const newSocietyRecord = response.data.data;
        fetchSocieties(); // Refresh the list of societies
        closePopup();
      } else {
        toast.error("Failed to save society details");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  const handleDeleteSociety = async (societyId) => {
    try {
      const response = await API.delete(
        `ece/student/society/${societyId}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Society details deleted successfully");
        setSocieties((prev) =>
          prev.filter((society) => society?.id !== societyId)
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  return (
    <>
      <CustomTable
        title="Society Memberships"
        subtitle="(Student's Participation in Professional and College Societies)"
        columns={[
          { key: "type", label: "Type" },
          { key: "society_name", label: "Society Name" },
          { key: "role", label: "Role" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={societies}
        actions={{
          edit: (society) => {
            setIsAddSociety(false);
            openPopup(society);
          },
          delete: (society) => {
            if (society?.id) {
              handleDeleteSociety(society.id);
            } else {
              console.error("Society ID is missing", society);
              toast.error("Society ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddSociety(true);
          openPopup(null);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddSociety ? (
            <SocietyDetailsPopUp
              closeModal={closePopup}
              handleAddSociety={handleAddSociety}
            />
          ) : (
            selectedSociety && (
              <SocietyDetailsPopUp
                name={selectedSociety.society_name}
                type={selectedSociety.type}
                role={selectedSociety.role}
                document={selectedSociety.document}
                closeModal={closePopup}
                handleAddSociety={handleAddSociety}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentSocietyDetails;
