import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import FDPPopUp from "../PopUp/FDPPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyFDPDetails = [
  { programName: "Teaching Excellence", year: 2022, month: "March", days: 5 },
  { programName: "Research Methodology", year: 2023, month: "July", days: 3 },
  { programName: "Advanced Pedagogy", year: 2021, month: "December", days: 7 }
];

const FacultyDevelopmentProgram = ({ setBlurActive }) => {
  const [fdpDetails, setFdpDetails] = useState(dummyFDPDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFDP, setSelectedFDP] = useState(null);
  const [isAddFDP, setIsAddFDP] = useState(false);

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

  const handleAddFDP = (newFDP) => {
    if (selectedFDP) {
        // Update existing FDP
        setFdpDetails((prevDetails) =>
          prevDetails.map((fdp) =>
            fdp === selectedFDP ? { ...newFDP } : fdp
          )
        );
      } else {
        // Add new FDP
        setFdpDetails([...fdpDetails, newFDP]);
      }
      closePopup(); 
  };

  const handleDeleteFDP = (indexToDelete) => {
    setFdpDetails(fdpDetails.filter((_, index) => index !== indexToDelete));
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
                {fdpDetails.map((fdp, index) => {
                  const { programName, year, month, days } = fdp;
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
                            onClick={() => openPopup(fdp)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFDP(index)}
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
                programName={selectedFDP.programName}
                year={selectedFDP.year}
                month={selectedFDP.month}
                days={selectedFDP.days}
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
