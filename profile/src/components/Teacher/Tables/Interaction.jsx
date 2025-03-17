import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import InteractionPopUp from "../PopUp/InteractionPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import CustomTable from "../../DynamicComponents/CustomTable";

const Interaction = ({ setBlurActive }) => {
  const [interactionDetails, setInteractionDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [isAddInteraction, setIsAddInteraction] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const FACULTY_ID = faculty_id;

  const fetchInteractions = async () => {
    try {
      const response = await API.get(`ece/faculty/interaction/${FACULTY_ID}`);
      setInteractionDetails(response.data.data || []);
      console.log("Interaction Details:", response.data.data);
    } catch (error) {
      console.error("Error fetching interaction details:", error);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [FACULTY_ID]);

  const openPopup = (interaction) => {
    setSelectedInteraction(interaction);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddInteraction(false);
    setBlurActive(false);
  };

  const handleAddOrUpdateInteraction = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isAddInteraction) {
        // ADD new interaction record
        const response = await API.post(
          "ece/faculty/interaction",
          formData,
          config
        );
        setInteractionDetails((prev) => [
          ...prev,
          {
            ...response.data.data,
          },
        ]);
      } else {
        // UPDATE existing interaction record
        await API.put(
          `ece/faculty/interaction/${selectedInteraction.interact_id}`,
          formData,
          config
        );
        setInteractionDetails((prev) =>
          prev.map((interaction) =>
            interaction.interact_id === selectedInteraction.interact_id
              ? { ...interaction, ...formData }
              : interaction
          )
        );
      }
      closePopup();
      fetchInteractions();
    } catch (error) {
      console.error("Error saving interaction details:", error);
    }
  };

  const handleDeleteInteraction = async (interactId) => {
    try {
      await API.delete(`ece/faculty/interaction/${interactId}`);
      setInteractionDetails((prev) =>
        prev.filter((interaction) => interaction.interact_id !== interactId)
      );
    } catch (error) {
      console.error("Error deleting interaction:", error);
    }
  };

  return (
    <>
      <CustomTable
        title="Interaction with the Outside World"
        subtitle="(Details of Interactions)"
        columns={[
          { key: "interaction_type", label: "Interaction Type" },
          { key: "institution", label: "Institution Name" },
          { key: "description", label: "Description" },
          { key: "month_of_visit", label: "Month of Visit" },
          { key: "year_of_visit", label: "Year of Visit" },
          { key: "duration_in_days", label: "Duration (Days)" },
          { key: "document", label: "Document" }, // New column for document
          { key: "actions", label: "Actions" },
        ]}
        data={interactionDetails}
        actions={{
          edit: (interaction) => {
            setIsAddInteraction(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedInteraction(interaction);
            console.log(interaction);
          },
          delete: (interaction) => {
            if (interaction?.interact_id) {
              handleDeleteInteraction(interaction.interact_id);
            } else {
              console.error(
                "Interaction ID is missing or undefined",
                interaction
              );
            }
          },
        }}
        onAdd={() => {
          setIsAddInteraction(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedInteraction(null);
        }}
      />

      {/* Popup for Adding/Editing Interaction */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddInteraction ? (
            <InteractionPopUp
              interactionType=""
              institutionName=""
              description=""
              year_of_visit=""
              month_of_visit=""
              duration_in_days=""
              document={null}
              closeModal={closePopup}
              handleAddVisit={handleAddOrUpdateInteraction}
            />
          ) : (
            selectedInteraction && (
              <InteractionPopUp
                interactionType={selectedInteraction?.interaction_type || ""}
                institutionName={selectedInteraction?.institution || ""}
                description={selectedInteraction?.description || ""}
                year_of_visit={selectedInteraction?.year_of_visit || ""}
                month_of_visit={selectedInteraction?.month_of_visit || ""}
                duration_in_days={selectedInteraction?.duration_in_days || ""}
                document={selectedInteraction?.document || null}
                closeModal={closePopup}
                handleAddVisit={handleAddOrUpdateInteraction}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default Interaction;
