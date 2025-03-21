import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import ConsultancyDetailsPopUp from "../PopUp/ConsultancyPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";

const ConsultancyDetails = ({ setBlurActive }) => {
  const [consultancyDetails, setConsultancyDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [isAddConsultancy, setIsAddConsultancy] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const fetchConsultancyDetails = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/consultancy?faculty_id=${facultyId}`
      );
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setConsultancyDetails([]);
        } else {
          setConsultancyDetails(
            response.data.map((record) => ({
              project_title: record.project_title,
              funding_agency: record.funding_agency,
              amount_sponsored: record.amount_sponsored,
              start_date: formatDateForInput(record.start_date),
              end_date: formatDateForInput(record.end_date),
              status: record.status, // Added status
              document: record.document, // Added document
              consultancy_id: record.consultancy_id,
            }))
          );
        }
      } else {
        setConsultancyDetails([]);
      }
    } catch (error) {
      console.error("Error fetching consultancy records:", error);
      setConsultancyDetails([]);
    }
  };

  useEffect(() => {
    fetchConsultancyDetails();
  }, [facultyId]);

  const openPopup = (consultancy) => {
    setSelectedConsultancy(consultancy);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddConsultancy(false);
    setBlurActive(false);
  };

  const handleAddConsultancy = async (newConsultancy) => {
    const formData = new FormData();
    formData.append("faculty_id", facultyId);
    formData.append("project_title", newConsultancy.title);
    formData.append("funding_agency", newConsultancy.client);
    formData.append("amount_sponsored", newConsultancy.amount);
    formData.append("status", newConsultancy.status); // Added status
    formData.append("start_date", newConsultancy.startDate);
    formData.append("end_date", newConsultancy.endDate || null);

    if (newConsultancy.document) {
      formData.append("document", newConsultancy.document);
    }

    try {
      if (isAddConsultancy) {
        await API.post("/ece/faculty/consultancy", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.put(
          `/ece/faculty/consultancy/${selectedConsultancy.consultancy_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      fetchConsultancyDetails();
      closePopup();
    } catch (error) {
      console.error("Error adding/updating consultancy:", error);
    }
  };

  const handleDeleteConsultancy = async (consultancyId) => {
    try {
      await API.delete(`/ece/faculty/consultancy/${consultancyId}`);
      fetchConsultancyDetails();
    } catch (error) {
      console.error("Error deleting consultancy:", error);
    }
  };

  const formatDateForInputPopup = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <CustomTable
        title="Consultancy Details"
        subtitle="(Details of consultancy projects)"
        columns={[
          { key: "project_title", label: "Consultancy Title" },
          { key: "funding_agency", label: "Funding Agency" },
          {
            key: "amount_sponsored",
            label: "Amount Sponsored",
            format: (value) => `₹${value?.toLocaleString()}`,
          },
          { key: "status", label: "Status" }, // Added status
          { key: "start_date", label: "Start Date" },
          { key: "end_date", label: "End Date" },
          { key: "document", label: "Document" }, // Added document
          { key: "actions", label: "Actions" },
        ]}
        data={consultancyDetails}
        actions={{
          edit: (consultancy) => {
            setIsAddConsultancy(false);
            setSelectedConsultancy(consultancy);
            openPopup(consultancy);
          },
          delete: (consultancy) => {
            handleDeleteConsultancy(consultancy.consultancy_id);
          },
        }}
        onAdd={() => {
          setIsAddConsultancy(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedConsultancy(null);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddConsultancy ? (
            <ConsultancyDetailsPopUp
              title=""
              client=""
              amount=""
              startDate=""
              endDate=""
              closeModal={closePopup}
              handleAddConsultancy={handleAddConsultancy}
            />
          ) : (
            selectedConsultancy && (
              <ConsultancyDetailsPopUp
                title={selectedConsultancy?.project_title || ""}
                client={selectedConsultancy?.funding_agency || ""}
                amount={selectedConsultancy?.amount_sponsored || ""}
                startDate={
                  formatDateForInputPopup(selectedConsultancy?.start_date) || ""
                }
                endDate={
                  selectedConsultancy?.end_date
                    ? formatDateForInputPopup(selectedConsultancy?.end_date)
                    : ""
                }
                closeModal={closePopup}
                handleAddConsultancy={handleAddConsultancy}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default ConsultancyDetails;
