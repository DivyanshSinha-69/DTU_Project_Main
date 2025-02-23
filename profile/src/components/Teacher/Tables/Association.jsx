import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import AssociationPopUp from "../PopUp/AssociationPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import { store } from "../../../redux/Store";
const Association = ({ setBlurActive }) => {
  const user = useSelector(state => state.auth.user) || {};
    const { faculty_id } = user;
    const facultyId = faculty_id;
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [associationDetails, setAssociationDetails] = useState({
    highestDesignation: "",
    highestDesignationDate: "",
    associateProfessorStartDate: "",
    associateProfessorEndDate: "",
    assistantProfessorStartDate: "",
    assistantProfessorEndDate: "",
  });
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  // Load data from localStorage on mount or set dummy data

  useEffect(() => {
    if (!facultyId) return; // Prevent API call if facultyId is null

    const fetchAssociationDetails = async () => {
      const url = `/ece/faculty/facultyassociation/${facultyId}`;

      try {
        const response = await API.get(url);
        const data = response.data;

        if (data.success) {
          setAssociationDetails({
            highestDesignation:
              data.association.designation === 1
                ? "Professor"
                : data.association.designation === 2
                  ? "Associate Professor"
                  : "Assistant Professor",
            highestDesignationDate:
              formatDateForInput(data.association.date_asg_prof) ||
              formatDateForInput(data.association.date_asg_asoprof) ||
              formatDateForInput(data.association.date_asg_astprof) ||
              "",
            associateProfessorStartDate:
              formatDateForInput(data.association.date_asg_asoprof) || "",
            associateProfessorEndDate:
              formatDateForInput(data.association.date_end_asoprof) || "",
            assistantProfessorStartDate:
              formatDateForInput(data.association.date_asg_astprof) || "",
            assistantProfessorEndDate:
              formatDateForInput(data.association.date_end_astprof) || "",
          });
        }
      } catch (error) {
        console.error("Error fetching faculty association details:", error);
      }
    };

    fetchAssociationDetails();
  }, [facultyId]); // Added facultyId as a dependency

  // Function to open popup
  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true);
  };

  // Function to close popup
  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  // Function to update data and save to localStorage

  const updateAssociationDetails = async (data) => {
    try {
      const payload = {
        faculty_id: facultyId,
        designation:
          data.highestDesignation === "Professor"
            ? 1
            : data.highestDesignation === "Associate Professor"
              ? 2
              : 3,
        date_asg_prof:
          data.highestDesignation === "Professor"
            ? data.highestDesignationDate
            : null,
        date_asg_asoprof:
          data.highestDesignation === "Associate Professor"
            ? data.highestDesignationDate
            : data.associateProfessorStartDate,
        date_end_asoprof: data.associateProfessorEndDate,
        date_asg_astprof: data.assistantProfessorStartDate,
        date_end_astprof: data.assistantProfessorEndDate,
      };

      

      const url = `http://localhost:3001/ece/faculty/facultyassociation/${facultyId}`;

      const response = await API.put(url, payload); // 🔹 Use API (Axios instance)


      if (response.data.success) {
        setAssociationDetails(data); // Update UI with new data
        closePopup();
      } else {
        console.error("⚠️ Update Failed:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Error in update request:", error);

      if (error.response) {
        console.error("🔴 Server Response:", error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
          console.warn("🔄 Token might be expired. Trying refresh...");
        }
      }
    }
  };

  // Prepare table data based on designation logic
  const TABLE_HEAD = [
    "Designation",
    "Date Attained",
    "Start Date",
    "Last Date",
  ];
  const TABLE_ROWS = [];

  const {
    highestDesignation,
    highestDesignationDate,
    associateProfessorStartDate,
    associateProfessorEndDate,
    assistantProfessorStartDate,
    assistantProfessorEndDate,
  } = associationDetails;

  if (highestDesignation === "Professor") {
    TABLE_ROWS.push(
      { designation: "Professor", date: highestDesignationDate },
      {
        designation: "Associate Professor",
        startDate: associateProfessorStartDate,
        endDate: associateProfessorEndDate,
      },
      {
        designation: "Assistant Professor",
        startDate: assistantProfessorStartDate,
        endDate: assistantProfessorEndDate,
      },
    );
  } else if (highestDesignation === "Associate Professor") {
    TABLE_ROWS.push(
      { designation: "Associate Professor", date: highestDesignationDate },
      {
        designation: "Assistant Professor",
        startDate: assistantProfessorStartDate,
        endDate: assistantProfessorEndDate,
      },
    );
  } else if (highestDesignation === "Assistant Professor") {
    TABLE_ROWS.push({
      designation: "Assistant Professor",
      date: highestDesignationDate,
    });
  }

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Teacher Designation Details <br />
            <span className="text-lg text-red-600">
              (As per official records)
            </span>
          </p>

          <button
            onClick={openPopup}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={editImg} alt="Edit" className="h-5 w-5" />
          </button>

          <Popup
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div>
              <AssociationPopUp
                currentDetails={associationDetails}
                onUpdate={updateAssociationDetails}
                closeModal={closePopup}
              />
            </div>
          </Popup>
        </div>
        <hr className="mb-7"></hr>

        {/* Table */}
        <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
          <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(
                ({ designation, date, startDate, endDate }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={designation}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {designation}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {startDate || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {endDate || "-"}
                        </Typography>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Association;
