import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import PlacementDetailsPopUp from "../PopUp/CurrPlacementPopUp";

const StudentPlacementDetails = ({ setBlurActive }) => {
  const [placementDetails, setPlacementDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [isAddPlacement, setIsAddPlacement] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();

  useEffect(() => {
    if (!roll_no) return;

    const fetchPlacementDetails = async () => {
      try {
        const response = await API.get(
          `ece/student/placement?roll_no=${roll_no}`
        );
        const placements = response?.data;

        if (placements && placements.length > 0) {
          setPlacementDetails(
            placements.map((placement) => ({
              placement_id: placement.placement_id,
              company_name: placement.company_name,
              placement_category: placement.placement_category,
              placement_type: placement.placement_type,
              role_name: placement.role_name,
              document: placement.document,
            }))
          );
        } else {
          toast.error("No placement details available");
        }
      } catch (error) {
        console.error("Error fetching placement details:", error);
        toast.error("Error while fetching placement details");
      }
    };

    fetchPlacementDetails();
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

  const handleAddPlacementDetails = async (newPlacementDetails, file) => {
    const { company_name, placement_type, placement_category, role_name } =
      newPlacementDetails;

    const formData = new FormData();
    formData.append("company_name", company_name);
    formData.append("placement_type", placement_type);
    formData.append("placement_category", placement_category);
    formData.append("role_name", role_name);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddPlacement) {
        response = await API.post(
          `ece/student/placement?roll_no=${roll_no}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await API.put(
          `ece/student/placement/${selectedPlacement.placement_id}?roll_no=${roll_no}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Placement details successfully saved");

        const newPlacementRecord = {
          placement_id:
            response.data.placement_id || selectedPlacement.placement_id,
          company_name: response.data.company_name || company_name,
          placement_type: response.data.placement_type || placement_type,
          placement_category:
            response.data.placement_category || placement_category,
          role_name: response.data.role_name || role_name,
          document: response.data.document || selectedPlacement?.document,
        };

        if (isAddPlacement) {
          setPlacementDetails((prev) => [...prev, newPlacementRecord]);
        } else {
          setPlacementDetails((prev) =>
            prev.map((placement) =>
              placement.placement_id === selectedPlacement.placement_id
                ? newPlacementRecord
                : placement
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save placement details.");
      }
    } catch (error) {
      console.error("Error saving placement details:", error);
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeletePlacementDetails = async (placementId) => {
    try {
      const response = await API.delete(
        `ece/student/placement/${placementId}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Placement details deleted successfully");
        setPlacementDetails((prev) =>
          prev.filter((placement) => placement.placement_id !== placementId)
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting placement details:", err);
      toast.error("Error while deleting placement details");
    }
  };

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Placement Details"
        subtitle="(Student's Placement Information)"
        columns={[
          { key: "role_name", label: "Role" },

          { key: "company_name", label: "Company Name" },
          { key: "placement_category", label: "Category" },
          { key: "placement_type", label: "Type" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={placementDetails}
        actions={{
          edit: (placement) => {
            setIsAddPlacement(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedPlacement(placement);
          },
          delete: (placement) => {
            if (placement?.placement_id) {
              handleDeletePlacementDetails(placement.placement_id);
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

      {/* Popup for Adding/Editing Placement Details */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPlacement ? (
            <PlacementDetailsPopUp
              company_name=""
              placement_type=""
              placement_category=""
              role_name=""
              document=""
              closeModal={closePopup}
              handleAddPlacementDetails={handleAddPlacementDetails}
            />
          ) : (
            selectedPlacement && (
              <PlacementDetailsPopUp
                company_name={selectedPlacement.company_name}
                placement_type={selectedPlacement.placement_type}
                placement_category={selectedPlacement.placement_category}
                role_name={selectedPlacement.role_name}
                document={selectedPlacement.document}
                closeModal={closePopup}
                handleAddPlacementDetails={handleAddPlacementDetails}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentPlacementDetails;
