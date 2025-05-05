import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import ExtracurricularActivityPopUp from "../PopUp/ExtracurricularDetailsPopUp";

const StudentExtracurricularActivities = ({ setBlurActive }) => {
  const [activities, setActivities] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddActivity, setIsAddActivity] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();

  const fetchActivities = async () => {
    try {
      const response = await API.get(
        `ece/student/extracurricular?roll_no=${roll_no}`
      );
      const activitiesData = response?.data || [];

      if (activitiesData.length > 0) {
        setActivities(activitiesData);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };
  useEffect(() => {
    if (!roll_no) return;

    fetchActivities();
  }, [roll_no]);

  const openPopup = (activity) => {
    setSelectedActivity(activity);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddActivity(false);
    setBlurActive(false);
  };

  const handleAddActivity = async (newActivity, file) => {
    const formData = new FormData();
    formData.append("roll_no", roll_no);
    formData.append("organizer", newActivity.organizer);
    formData.append("event_name", newActivity.event_name);
    formData.append("extracurricular_name", newActivity.event_type);
    formData.append("event", newActivity.event);
    formData.append("event_date", newActivity.event_date);
    formData.append("position", newActivity.position);
    formData.append("description", newActivity.description);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddActivity) {
        response = await API.post("ece/student/extracurricular", formData, {
          params: {
            roll_no: roll_no,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `ece/student/extracurricular/${selectedActivity.activity_id}`,
          formData,
          {
            params: { roll_no: roll_no },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Activity saved successfully");
        const newActivityRecord = response.data.data;

        fetchActivities();

        closePopup();
      } else {
        toast.error("Failed to save activity");
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await API.delete(
        `ece/student/extracurricular/${activityId}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Activity deleted successfully");
        setActivities((prev) =>
          prev.filter((activity) => activity.activity_id !== activityId)
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
        title="Extracurricular Activities"
        subtitle="(Student's Participation in Events and Activities)"
        columns={[
          { key: "organizer", label: "Organizer" },
          { key: "event_name", label: "Event Name" },
          { key: "extracurricular_name", label: "Event Type" },
          { key: "event", label: "Event Scope" },
          { key: "event_date", label: "Event Date" },
          { key: "position", label: "Position" },
          { key: "description", label: "Description" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={activities}
        actions={{
          edit: (activity) => {
            setIsAddActivity(false);
            openPopup(activity);
          },
          delete: (activity) => {
            if (activity?.activity_id) {
              handleDeleteActivity(activity.activity_id);
            } else {
              console.error("Activity ID is missing", activity);
              toast.error("Activity ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddActivity(true);
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
          {isAddActivity ? (
            <ExtracurricularActivityPopUp
              closeModal={closePopup}
              handleAddActivity={handleAddActivity}
            />
          ) : (
            selectedActivity && (
              <ExtracurricularActivityPopUp
                organizer={selectedActivity.organizer}
                event_name={selectedActivity.event_name}
                event_type={selectedActivity.extracurricular_name}
                event={selectedActivity.event}
                event_date={selectedActivity.event_date}
                position={selectedActivity.position}
                description={selectedActivity.description}
                document={selectedActivity.document}
                activity={selectedActivity}
                closeModal={closePopup}
                handleAddActivity={handleAddActivity}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentExtracurricularActivities;
