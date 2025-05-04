import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import EntrepreneurshipDetailsPopUp from "../PopUp/EntrepreneurshipDetailsPopUp";

const StudentEntrepreneurshipDetails = ({ setBlurActive }) => {
  const [entrepreneurshipDetails, setEntrepreneurshipDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEntrepreneurship, setSelectedEntrepreneurship] =
    useState(null);
  const [isAddEntrepreneurship, setIsAddEntrepreneurship] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();

  useEffect(() => {
    if (!roll_no) return;

    const fetchEntrepreneurshipDetails = async () => {
      try {
        const response = await API.get(
          `ece/student/entrepreneurship?roll_no=${roll_no}`
        );
        const details = response?.data?.data || [];

        if (details.length > 0) {
          setEntrepreneurshipDetails(details);
        } else {
          toast.error("No entrepreneurship details available");
        }
      } catch (error) {
        console.error("Error fetching entrepreneurship details:", error);
        toast.error("Error while fetching entrepreneurship details");
      }
    };

    fetchEntrepreneurshipDetails();
  }, [roll_no]);

  const openPopup = (entrepreneurship) => {
    setSelectedEntrepreneurship(entrepreneurship);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddEntrepreneurship(false);
    setBlurActive(false);
  };

  const handleAddEntrepreneurshipDetails = async (newDetails, documentFile) => {
    const { company_name, affiliated_number, website_link } = newDetails;

    const formData = new FormData();
    formData.append("roll_no", roll_no);
    formData.append("company_name", company_name);
    formData.append("affiliated_number", affiliated_number);
    formData.append("website_link", website_link || "");
    if (documentFile) {
      formData.append("document", documentFile);
    }

    try {
      let response;
      if (isAddEntrepreneurship) {
        response = await API.post("ece/student/entrepreneurship", formData, {
          params: { roll_no },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `ece/student/entrepreneurship/${selectedEntrepreneurship.entrepreneurship_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Entrepreneurship details successfully saved");

        const newRecord = {
          entrepreneurship_id:
            response.data.entrepreneurship_id ||
            selectedEntrepreneurship.entrepreneurship_id,
          roll_no: roll_no,
          company_name: response.data.company_name || company_name,
          affiliated_number:
            response.data.affiliated_number || affiliated_number,
          website_link: response.data.website_link || website_link,
          document:
            response.data.document || selectedEntrepreneurship?.document,
        };

        if (isAddEntrepreneurship) {
          setEntrepreneurshipDetails((prev) => [...prev, newRecord]);
        } else {
          setEntrepreneurshipDetails((prev) =>
            prev.map((item) =>
              item.entrepreneurship_id ===
              selectedEntrepreneurship.entrepreneurship_id
                ? newRecord
                : item
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save entrepreneurship details.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeleteEntrepreneurshipDetails = async (entrepreneurshipId) => {
    try {
      const response = await API.delete(
        `ece/student/entrepreneurship/${entrepreneurshipId}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Entrepreneurship details deleted successfully");
        setEntrepreneurshipDetails((prev) =>
          prev.filter((item) => item.entrepreneurship_id !== entrepreneurshipId)
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting entrepreneurship details:", err);
      toast.error("Error while deleting entrepreneurship details");
    }
  };

  return (
    <>
      <CustomTable
        title="Entrepreneurship Details"
        subtitle="(Student's Business Ventures)"
        columns={[
          { key: "company_name", label: "Company Name" },
          { key: "affiliated_number", label: "Affiliated Number" },
          {
            key: "website_link",
            label: "Website",
            render: (link) => (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {link}
              </a>
            ),
          },
          {
            key: "document",
            label: "Document",
            render: (doc) =>
              doc ? (
                <a
                  href={`${API.defaults.baseURL}/${doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Document
                </a>
              ) : (
                "No document"
              ),
          },
          { key: "actions", label: "Actions" },
        ]}
        data={entrepreneurshipDetails}
        actions={{
          edit: (entrepreneurship) => {
            setIsAddEntrepreneurship(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedEntrepreneurship(entrepreneurship);
          },
          delete: (entrepreneurship) => {
            if (entrepreneurship?.entrepreneurship_id) {
              handleDeleteEntrepreneurshipDetails(
                entrepreneurship.entrepreneurship_id
              );
            } else {
              console.error(
                "Entrepreneurship ID is missing or undefined",
                entrepreneurship
              );
              toast.error("Entrepreneurship ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddEntrepreneurship(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedEntrepreneurship(null);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddEntrepreneurship ? (
            <EntrepreneurshipDetailsPopUp
              company_name=""
              affiliated_number=""
              website_link=""
              document={null}
              closeModal={closePopup}
              handleAddEntrepreneurshipDetails={
                handleAddEntrepreneurshipDetails
              }
            />
          ) : (
            selectedEntrepreneurship && (
              <EntrepreneurshipDetailsPopUp
                company_name={selectedEntrepreneurship.company_name}
                affiliated_number={selectedEntrepreneurship.affiliated_number}
                website_link={selectedEntrepreneurship.website_link}
                document={selectedEntrepreneurship.document}
                closeModal={closePopup}
                handleAddEntrepreneurshipDetails={
                  handleAddEntrepreneurshipDetails
                }
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentEntrepreneurshipDetails;
