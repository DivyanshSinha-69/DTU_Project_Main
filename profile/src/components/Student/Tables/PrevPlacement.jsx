import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import PreviousPlacementPopUp from "../PopUp/PrevPlacementPopUp";

const StudentPreviousPlacements = ({ setBlurActive }) => {
  const [placements, setPlacements] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [isAddPlacement, setIsAddPlacement] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();
  const fetchPlacements = async () => {
    try {
      const response = await API.get(
        `ece/student/preplacement?roll_no=${roll_no}`
      );
      const placementsData = response?.data || [];

      if (placementsData.length > 0) {
        setPlacements(placementsData);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };
  useEffect(() => {
    if (!roll_no) return;

    fetchPlacements();
  }, [roll_no]);

  const openPopup = (placement) => {
    setSelectedPlacement(placement);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPlacement(false);
    setBlurActive(false);
  };

  const handleAddPlacement = async (newPlacement) => {
    const { placement_category, placement_type, company_name, role_name } =
      newPlacement;

    const payload = {
      placement_category,
      placement_type,
      company_name,
      role_name,
    };

    try {
      let response;
      if (isAddPlacement) {
        response = await API.post("ece/student/preplacement", payload, {
          params: {
            roll_no: roll_no,
          },
        });
      } else {
        response = await API.put(
          `ece/student/preplacement/${selectedPlacement.placement_id}`,
          payload,
          {
            params: {
              roll_no: roll_no,
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Placement data successfully saved");

        const newPlacementRecord = {
          placement_id:
            response.data.placement_id || selectedPlacement.placement_id,
          roll_no: roll_no,
          placement_category:
            response.data.placement_category || placement_category,
          placement_type: response.data.placement_type || placement_type,
          company_name: response.data.company_name || company_name,
          role_name: response.data.role_name || role_name,
        };

        fetchPlacements(); // Refresh the placements list

        closePopup();
      } else {
        toast.error("Failed to save placement data.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  const handleDeletePlacement = async (placementId) => {
    try {
      const response = await API.delete(
        `ece/student/preplacement/${placementId}`,
        {
          params: {
            roll_no: roll_no,
          },
        }
      );
      if (response && response.data) {
        toast.success("Placement data deleted successfully");
        setPlacements((prev) =>
          prev.filter((placement) => placement.placement_id !== placementId)
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
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Previous Placements"
        subtitle="(Student's Previous Placement/Internship Information)"
        columns={[
          { key: "placement_category", label: "Category" },
          { key: "placement_type", label: "Type" },
          { key: "company_name", label: "Company Name" },
          { key: "role_name", label: "Role" },
          { key: "actions", label: "Actions" },
        ]}
        data={placements}
        actions={{
          edit: (placement) => {
            setIsAddPlacement(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedPlacement(placement);
          },
          delete: (placement) => {
            if (placement?.placement_id) {
              handleDeletePlacement(placement.placement_id);
            } else {
              console.error("Placement ID is missing or undefined", placement);
              toast.error("Placement ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddPlacement(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedPlacement(null);
        }}
      />

      {/* Popup for Adding/Editing Placement Data */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPlacement ? (
            <PreviousPlacementPopUp
              placement_category=""
              placement_type=""
              company_name=""
              role_name=""
              closeModal={closePopup}
              handleAddPlacement={handleAddPlacement}
            />
          ) : (
            selectedPlacement && (
              <PreviousPlacementPopUp
                placement_category={selectedPlacement.placement_category}
                placement_type={selectedPlacement.placement_type}
                company_name={selectedPlacement.company_name}
                role_name={selectedPlacement.role_name}
                closeModal={closePopup}
                handleAddPlacement={handleAddPlacement}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentPreviousPlacements;
