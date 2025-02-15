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

const ConsultancyDetails = ({ setBlurActive }) => {
  const [consultancyDetails, setConsultancyDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [isAddConsultancy, setIsAddConsultancy] = useState(false);
  const facultyId = useSelector((state) => state.user.facultyId);

  const fetchConsultancyDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/ece/faculty/consultancy/${facultyId}`,
      ); 

      if (!response.ok) {
        // Handle 404 response (no records found)
        if (response.status === 404) {
          setConsultancyDetails([]); // Set an empty array if no records are found
          return;
        }
        throw new Error("Failed to fetch consultancy data");
      }

      const data = await response.json();

      setConsultancyDetails(
        data.map((record) => ({
          project_title: record.project_title,
          funding_agency: record.funding_agency, // Renaming to client for consistency with frontend
          amount_sponsored: record.amount_sponsored,
          research_duration: record.research_duration,
          start_date: record.start_date,
          end_date: record.end_date,
          consultancy_id: record.consultancy_id,
        })),
      );
    } catch (error) {
      console.error("Error fetching consultancy records:", error);
      setConsultancyDetails([]); // Fallback to an empty array in case of errors
    }
  };

  useEffect(() => {
    fetchConsultancyDetails();
  }, []);

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
    try {
      if (isAddConsultancy) {
        // Add new consultancy
        await axios.post("http://localhost:3001/ece/faculty/consultancy", {
          faculty_id: facultyId, // Hardcoded for now
          project_title: newConsultancy.title,
          funding_agency: newConsultancy.client || null, // Optional field
          amount_sponsored: newConsultancy.amount || 0, // Default to 0 if not provided
          research_duration: newConsultancy.duration || null, // Optional field
          start_date: newConsultancy.startDate, // Required field
          end_date: newConsultancy.endDate || null,
        });
      } else {
        // Update existing consultancy
        await axios.put(
          `http://localhost:3001/ece/faculty/consultancy/${selectedConsultancy.consultancy_id}`,
          {
            faculty_id: facultyId, // Hardcoded for now
            project_title: newConsultancy.title,
            funding_agency: newConsultancy.client,
            amount_sponsored: newConsultancy.amount,
            research_duration: newConsultancy.duration,
            start_date: newConsultancy.startDate,
            end_date: newConsultancy.endDate || null,
          },
        );
      }

      // Refresh consultancy details after adding/updating
      fetchConsultancyDetails();
      closePopup();
    } catch (error) {
      console.error("Error adding/updating consultancy:", error);
    }
  };

  const handleDeleteConsultancy = async (indexToDelete) => {
    const consultancyToDelete = consultancyDetails[indexToDelete];
    try {
      await axios.delete(
        `http://localhost:3001/ece/faculty/consultancy/${consultancyToDelete.consultancy_id}`,
      );
      // Refresh consultancy details after deleting
      fetchConsultancyDetails();
    } catch (error) {
      console.error("Error deleting consultancy:", error);
    }
  };

  const TABLE_HEAD = [
    "Consultancy Title",
    "Agency Name",
    "Funding Amount",
    "Duration (Years)",
    "Start Date",
    "End Date",
    "Actions",
  ];
  const formatDateForInput = (date) => {
    const [date1, time] = date?.split("T");

    const [day, month, year] = date1.split("-");
    return `${day}-${month}-${year}`; // yyyy-MM-dd
  };
  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Consultancy Details <br />
            <span className="text-lg text-red-600">
              (Details of consultancy projects)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddConsultancy(true);
              setPopupOpen(true);
              setBlurActive(true);
            }}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
        </div>
        <hr className="mb-7"></hr>

        <div className="">
          <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
            <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${
                        head === "Actions" ? "text-right" : ""
                      }`}
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
                {consultancyDetails.map((consultancy, index) => {
                  const {
                    consultancy_id,
                    project_title,
                    funding_agency,
                    amount_sponsored,
                    research_duration,
                    start_date,
                    end_date,
                  } = consultancy;
                  const isLast = index === consultancyDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${project_title}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {project_title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {funding_agency}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          ₹{amount_sponsored?.toLocaleString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {research_duration} years
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(start_date)?.toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {end_date
                            ? new Date(end_date)?.toLocaleDateString("en-GB")
                            : "-"}
                        </Typography>
                      </td>

                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(consultancy)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteConsultancy(index)}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img
                              src={deleteImg}
                              alt="delete"
                              className="h-5 w-5 filter brightness-0 invert"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Popup */}
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
              duration=""
              startDate=""
              endDate=""
              closeModal={closePopup}
              handleAddConsultancy={handleAddConsultancy}
            />
          ) : (
            selectedConsultancy && (
              <ConsultancyDetailsPopUp
                title={selectedConsultancy.project_title}
                client={selectedConsultancy.funding_agency}
                amount={selectedConsultancy.amount_sponsored}
                duration={selectedConsultancy.research_duration}
                startDate={formatDateForInput(selectedConsultancy.start_date)}
                endDate={
                  selectedConsultancy.end_date
                    ? formatDateForInput(selectedConsultancy?.end_date)
                    : ""
                }
                closeModal={closePopup}
                handleAddConsultancy={handleAddConsultancy}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default ConsultancyDetails;
