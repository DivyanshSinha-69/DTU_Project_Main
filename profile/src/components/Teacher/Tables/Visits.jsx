import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import VisitsPopUp from "../PopUp/VisitsPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import API from "../../../utils/API";
import { useSelector } from "react-redux";



// Dummy data for testing

const Visits = ({ setBlurActive }) => {
  const visitTypeMap = { Visiting: 1, Adjunct: 2, Emeritus: 3 };
  const visitTypeReverseMap = { 1: "Visiting", 2: "Adjunct", 3: "Emeritus" };
  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const [visitDetails, setVisitDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isAddVisit, setIsAddVisit] = useState(false);

  const user = useSelector(state => state.auth.user) || {};
    const { faculty_id } = user;
    const FACULTY_ID = faculty_id;
  // Replace with dynamic faculty ID if necessary

  // Fetch visit records from the API using the centralized API instance
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await API.get(`ece/faculty/vae`, {
          params: { faculty_id: FACULTY_ID },
        });
        // Assuming the API returns an object with a "data" property
        setVisitDetails(response.data.data || []);
      } catch (error) {
        console.error("Error fetching visit details:", error);
      }
    };

    fetchVisits();
  }, [FACULTY_ID]);

  // Open the popup for editing or adding a visit record
  const openPopup = (visit) => {
    setSelectedVisit(visit);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddVisit(false);
    setBlurActive(false);
  };

  // Handle adding or updating a visit record
  const handleAddOrUpdateVisit = async (visitData) => {
    // Format the visit payload before sending it to the API
    const formattedVisit = {
      faculty_id: FACULTY_ID, // Static for now
      visit_type: visitTypeMap[visitData.visitType], // Convert string to number
      institution: visitData.institutionName,
      course_taught: visitData.courses,
      year_of_visit: visitData.year_of_visit,
      month_of_visit: monthMap[visitData.month_of_visit], // Convert month name to number
      hours_taught: visitData.hours_taught,
    };

    try {
      if (isAddVisit) {
        // ADD new visit record
        const response = await API.post("ece/faculty/vae", formattedVisit);
        // Assuming the new record's id is returned as response.data.data.id
        setVisitDetails((prev) => [
          ...prev,
          { ...formattedVisit, visit_id: response.data.data.id },
        ]);
      } else {
        // UPDATE existing visit record
        await API.put(`ece/faculty/vae/${selectedVisit.visit_id}`, formattedVisit);
        setVisitDetails((prev) =>
          prev.map((visit) =>
            visit.visit_id === selectedVisit.visit_id
              ? { ...visit, ...formattedVisit }
              : visit
          )
        );
      }
      closePopup();
    } catch (error) {
      console.error("Error saving visit details:", error);
    }
  };

  // Delete a visit record
  const handleDeleteVisit = async (visitId) => {
    try {
      await API.delete(`ece/faculty/vae/${visitId}`);
      setVisitDetails((prev) =>
        prev.filter((visit) => visit.visit_id !== visitId)
      );
    } catch (error) {
      console.error("Error deleting visit:", error);
    }
  };

  const TABLE_HEAD = [
    "Visit Type",
    "Institution Name",
    "Names of Courses Taught",
    "Month of Visit",
    "Year of Visit",
    "Hours Taught",
    "Actions",
  ];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Interaction with the Outside World as Guest Faculty
            <br />
            <span className="text-lg text-red-600">
              (Details of academic visits)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddVisit(true);
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
                  {TABLE_HEAD.map((head) => (
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
                {visitDetails.map((visit, index) => {
                  const {
                    visitType,
                    institutionName,
                    courses,
                    year_of_visit,
                    hours_taught,
                  } = visit;
                  const isLast = index === visitDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${visitType}-${institutionName}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {visitTypeReverseMap[visit.visit_type]}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {visit.institution}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {visit.course_taught}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {visit.month_of_visit
                            ? Object.keys(monthMap).find(
                                (key) => monthMap[key] === visit.month_of_visit,
                              )
                            : ""}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {year_of_visit}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {hours_taught}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(visit)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVisit(visit.visit_id)}
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
          {isAddVisit ? (
            <VisitsPopUp
              visitType=""
              institutionName=""
              courses=""
              year_of_visit=""
              hours_taught=""
              month_of_visit=""
              closeModal={closePopup}
              handleAddVisit={handleAddOrUpdateVisit}
            />
          ) : (
            selectedVisit && (
              <VisitsPopUp
                visitType={visitTypeReverseMap[selectedVisit?.visit_type] || ""}
                institutionName={selectedVisit?.institution || ""}
                courses={selectedVisit?.course_taught || ""}
                year_of_visit={selectedVisit?.year_of_visit || ""}
                month_of_visit={
                  selectedVisit.month_of_visit
                    ? Object.keys(monthMap).find(
                        (key) => monthMap[key] === selectedVisit.month_of_visit,
                      )
                    : "" || ""
                }
                hours_taught={selectedVisit?.hours_taught || ""}
                closeModal={closePopup}
                handleAddVisit={handleAddOrUpdateVisit}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default Visits;
