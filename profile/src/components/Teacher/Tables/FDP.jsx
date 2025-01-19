import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import FDPPopUp from "../PopUp/FDPPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { toast } from 'react-hot-toast';




const FacultyDevelopmentProgram = ({ setBlurActive }) => {
  const [fdpDetails, setFdpDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFDP, setSelectedFDP] = useState(null);
  const [isAddFDP, setIsAddFDP] = useState(false);
  const faculty_id = "FAC001"; // Placeholder faculty ID
  useEffect(() => {
    const fetchFDPDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/ece/faculty/fdp?faculty_id=${faculty_id}`);
        const result = await response.json();
        if (response.ok && Array.isArray(result.data)) {
          setFdpDetails(result.data); // Only set if the response is an array
        } else {
          toast.error(result.message || "Failed to fetch FDP details");
        }
      } catch (err) {
        console.error("Error fetching FDP details:", err);
        toast.error("Error while fetching FDP details");
      }
    };
  
    fetchFDPDetails();
  }, []);
  
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
    const faculty_id = "FAC001"; // Placeholder faculty ID
  
    try {
      const response = isAddFDP
        ? await fetch('http://localhost:3001/ece/faculty/fdp', {
            method: "POST", // For adding a new FDP
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              faculty_id,
              FDP_name: programName,
              year_conducted: year,
              month_conducted: month,
              days_contributed: days,
            }),
          })
        : await fetch('http://localhost:3001/ece/faculty/fdp', {
            method: "PUT", // For updating the FDP
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              faculty_id,
              FDP_name: selectedFDP.FDP_name, // The FDP name to identify the record to update
              year_conducted: year,
              month_conducted: month,
              days_contributed: days,
            }),
          });
  
      const data = await response.json();
      if (response.ok) {
        console.log("FDP record successfully added/updated", data);
        
        setFdpDetails((prevDetails) =>
          isAddFDP
            ? [...prevDetails, { ...newFDP, FDP_name: programName, year_conducted: year, month_conducted: month, days_contributed: days }]
            : prevDetails.map((fdp) =>
                fdp.FDP_name === selectedFDP.FDP_name
                  ? { ...newFDP, FDP_name: programName, year_conducted: year, month_conducted: month, days_contributed: days }
                  : fdp
              )
        );
        
        closePopup();
      } else {
        console.error("Error:", data.message);
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Request failed", err);
      toast.error("Error while adding/updating FDP");
    }
  };
  
  

  const handleDeleteFDP = async (programNameToDelete) => {
    const faculty_id = "FAC001"; // Placeholder faculty ID
    
    try {
      const response = await fetch('http://localhost:3001/ece/faculty/fdp', {
        method: "DELETE", // For deleting an FDP
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id,
          FDP_name: programNameToDelete, // Pass the program name to delete the record
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("FDP record deleted successfully", data);
        // Remove the FDP record based on programName
        setFdpDetails(fdpDetails.filter(fdp => fdp.FDP_name !== programNameToDelete));
      } else {
        console.error("Error:", data.message);
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Request failed", err);
      toast.error("Error while deleting FDP");
    }
  };
  
  
  const TABLE_HEAD = ["Program Name", "Year Conducted", "Month Conducted", "Days Contributed", "Actions"];
  
  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Faculty Development Program <br /><span className="text-lg text-red-600">(Details of FDPs conducted or attended)</span>
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
                  days_contributed: days 
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
                          {days}
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
                              console.log(selectedFDP)
                            }
                              
                            }
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFDP(programName)}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={deleteImg} alt="delete" className="h-5 w-5 filter brightness-0 invert" />
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
        <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
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
