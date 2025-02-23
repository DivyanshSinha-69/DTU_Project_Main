import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import FDPPopUp from "../PopUp/FDPPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";


const FacultyDevelopmentProgram = ({ setBlurActive }) => {
  const [fdpDetails, setFdpDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFDP, setSelectedFDP] = useState([]);
  const [isAddFDP, setIsAddFDP] = useState(false);
  const user = useSelector(state => state.auth.user) || {};
    const { faculty_id } = user;
    const facultyId = faculty_id;
  useEffect(() => {
    const fetchFDPDetails = async () => {
      try {
        const response = await API.get(`/ece/faculty/fdp-records/${facultyId}`);
        // Assuming response.data holds the FDP records in an array
        if (Array.isArray(response.data.data)) {
          setFdpDetails(
            response.data.data.map((fdp) => ({
              FDP_id: fdp.FDP_id, // Include FDP_id
              FDP_name: fdp.FDP_name,
              year_conducted: fdp.year_conducted,
              month_conducted: fdp.month_conducted,
              days_contributed: fdp.days_contributed,
            }))
          );
        } else {
          toast.error(response.data.message || "Failed to fetch FDP details");
        }
      } catch (error) {
        console.error("Error fetching FDP details:", error);
        toast.error("Error while fetching FDP details");
      }
    };

    fetchFDPDetails();
  }, [facultyId]);

  const openPopup = (fdp) => {
    setSelectedFDP(fdp);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddFDP(false);
    setBlurActive(false);
  };

  const handleAddFDP = async (newFDP) => {
    const { programName, year, month, days } = newFDP;
    // Build the payload
    const payload = {
      facultyId,
      FDP_name: programName,
      year_conducted: year,
      month_conducted: month,
      days_contributed: days,
    };

    try {
      let response;
      if (isAddFDP) {
        // Add new FDP record
        response = await API.post("/ece/faculty/fdp-records", payload);
      } else {
        // Update existing FDP record
        response = await API.put(
          `/ece/faculty/fdp-records/${selectedFDP.FDP_id}`,
          payload
        );
      }

      if (response && response.data) {
        toast.success("FDP record successfully saved");
        // For adding a new record, append it to the list
        if (isAddFDP) {
          // Assuming the response returns the new FDP record including its generated FDP_id
          setFdpDetails((prev) => [...prev, response.data]);
        } else {
          // For updates, refresh the FDP details list
          setFdpDetails((prev) =>
            prev.map((fdp) =>
              fdp.FDP_id === selectedFDP.FDP_id ? response.data : fdp
            )
          );
        }
        closePopup();
      } else {
        toast.error("Failed to save FDP record.");
      }
    } catch (error) {
      console.error("Error saving FDP record:", error);
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeleteFDP = async (fdpId) => {
    try {
      const response = await API.delete(`/ece/faculty/fdp-records/${fdpId}`);
      if (response && response.data) {
        toast.success("FDP record deleted successfully");
        setFdpDetails((prev) => prev.filter((fdp) => fdp.FDP_id !== fdpId));
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting FDP record:", err);
      toast.error("Error while deleting FDP");
    }
  };

  const TABLE_HEAD = [
    "Title of Faculty development/training activities/STTP",
    "Year of Participation",
    "Month of Participation",
    "Duration of Participation(in days)",
    "Actions",
  ];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Participation in Faculty development/Training activities/STTP <br />
            <span className="text-lg text-red-600">
              (Details of FDPs conducted or attended)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddFDP(true);
              setPopupOpen(true);
              setBlurActive(true);
              setSelectedFDP(null);
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
                  {TABLE_HEAD?.map((head, index) => (
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
                {fdpDetails?.map((fdp, index) => {
                  const {
                    FDP_name: programName,
                    year_conducted: year,
                    month_conducted: month,
                    days_contributed: days,
                  } = fdp;
                  const isLast = index === fdpDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${programName}-${year}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {programName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {year}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {month}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {days} days
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsAddFDP(false); // This indicates it's an edit operation
                              setPopupOpen(true);
                              setBlurActive(true);
                              setSelectedFDP(fdp);
                              console.log(selectedFDP);
                            }}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFDP(fdp.FDP_id)}
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
          {isAddFDP ? (
            <FDPPopUp
              programName=""
              year=""
              month=""
              days=""
              closeModal={closePopup}
              handleAddFDP={handleAddFDP}
            />
          ) : (
            selectedFDP && (
              <FDPPopUp
                programName={selectedFDP.FDP_name}
                year={selectedFDP.year_conducted}
                month={selectedFDP.month_conducted}
                days={selectedFDP.days_contributed}
                closeModal={closePopup}
                handleAddFDP={handleAddFDP}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default FacultyDevelopmentProgram;
