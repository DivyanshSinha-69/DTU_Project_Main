import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import PatentPopUp from "../PopUp/PatentPopUp";
import CustomTable from "../../DynamicComponents/CustomTable";

const PatentRecords = ({ setBlurActive }) => {
  const [patentDetails, setPatentDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isAddPatent, setIsAddPatent] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };

  // Fetch patent records
  const fetchPatentRecords = async () => {
    try {
      const response = await API.get(`/ece/faculty/patent`, {
        params: { faculty_id: facultyId },
      });

      if (response.data.length === 0) {
        setPatentDetails([]);
      } else {
        setPatentDetails(
          response.data?.data?.map((patent) => ({
            patent_id: patent.patent_id,
            patent_number: patent.patent_number,
            patent_name: patent.patent_name,
            patent_publish: formatDateForInput(patent.patent_publish),
            inventors_name: patent.inventors_name,
            patent_award_date: formatDateForInput(patent.patent_award_date),
            patent_awarding_agency: patent.patent_awarding_agency,
            document: patent.document,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching patent records:", error);
      setPatentDetails([]);
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchPatentRecords();
  }, [facultyId]);

  // Handle add/update patent
  const handleAddPatent = async (newPatent) => {
    const formData = new FormData();
    formData.append("patent_name", newPatent.patentName);
    formData.append("patent_number", newPatent.patentNumber);
    formData.append("faculty_id", facultyId);
    formData.append("inventors_name", newPatent.inventorsName);
    formData.append("patent_publish", newPatent.patentPublish);
    formData.append("patent_award_date", newPatent.patentAwardDate || null);
    formData.append("patent_awarding_agency", newPatent.patentAwardingAgency);

    if (newPatent.document) {
      formData.append("document", newPatent.document);
    }

    try {
      if (isAddPatent) {
        await API.post("ece/faculty/patent", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.put(
          `ece/faculty/patent/${selectedPatent.patent_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      fetchPatentRecords();
      closePopup();
    } catch (error) {
      console.error("Error handling patent record:", error);
    }
  };

  // Handle delete patent
  const handleDeletePatent = async (patentId) => {
    try {
      await API.delete(`ece/faculty/patent/${patentId}`);
      setPatentDetails(
        patentDetails.filter((patent) => patent.patent_id !== patentId)
      );
    } catch (error) {
      console.error("Error deleting patent:", error);
    }
  };

  const openPopup = (patent) => {
    setSelectedPatent(patent);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPatent(false);
    setBlurActive(false);
  };

  const formatDateForInputPopup = (date) => {
    if (!date) return "";
    const [day, month, year] = date?.split("/");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };

  return (
    <>
      <CustomTable
        title="Patent Records"
        subtitle="(Details of patent records)"
        columns={[
          { key: "patent_number", label: "Patent Number" },
          { key: "patent_name", label: "Patent Name" },
          { key: "inventors_name", label: "Inventors/Co-inventors" },
          { key: "patent_publish", label: "Published Date" },
          { key: "patent_award_date", label: "Award Date" },
          { key: "patent_awarding_agency", label: "Awarding Agency" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={patentDetails}
        actions={{
          edit: (patent) => {
            setIsAddPatent(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedPatent({
              patentName: patent.patent_name,
              patentNumber: patent.patent_number,
              patentPublish: formatDateForInputPopup(patent.patent_publish),
              inventorsName: patent.inventors_name,
              patentAwardDate: formatDateForInputPopup(
                patent.patent_award_date
              ),
              patentAwardingAgency: patent.patent_awarding_agency,
              document: patent.document,
              patent_id: patent.patent_id,
            });
          },
          delete: (patent) => {
            if (patent?.patent_id) {
              handleDeletePatent(patent.patent_id);
            } else {
              console.error("Patent ID is missing or undefined", patent);
            }
          },
        }}
        onAdd={() => {
          setIsAddPatent(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedPatent(null);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPatent ? (
            <PatentPopUp
              closeModal={closePopup}
              handleAddPatent={handleAddPatent}
            />
          ) : (
            selectedPatent && (
              <PatentPopUp
                patentName={selectedPatent.patentName}
                patentNumber={selectedPatent.patentNumber}
                patentPublish={selectedPatent.patentPublish}
                inventorsName={selectedPatent.inventorsName}
                patentAwardDate={selectedPatent.patentAwardDate}
                patentAwardingAgency={selectedPatent.patentAwardingAgency}
                document={selectedPatent.document}
                patent_id={selectedPatent.patent_id}
                closeModal={closePopup}
                handleAddPatent={handleAddPatent}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default PatentRecords;
