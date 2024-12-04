import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import VisitsPopUp from "../PopUp/VisitsPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyVisitDetails = [
  { visitType: "Visiting", institutionName: "University of Oxford", courses: "AI and Machine Learning" },
  { visitType: "Adjunct", institutionName: "Stanford University", courses: "Advanced Algorithms" },
  { visitType: "Emeritus", institutionName: "MIT", courses: "Quantum Computing" }
];

const Visits = ({ setBlurActive }) => {
  const [visitDetails, setVisitDetails] = useState(dummyVisitDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isAddVisit, setIsAddVisit] = useState(false);

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

  const handleAddVisit = (newVisit) => {
    setVisitDetails([...visitDetails, newVisit]);
    closePopup();
  };

  const handleDeleteVisit = (indexToDelete) => {
    setVisitDetails(visitDetails.filter((_, index) => index !== indexToDelete));
  };

  const TABLE_HEAD = ["Visit Type", "Institution Name", "Courses", "Actions"];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Teacher Visit Details <br /><span className="text-lg text-red-600">(Details of academic visits)</span>
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
                {visitDetails.map((visit, index) => {
                  const { visitType, institutionName, courses } = visit;
                  const isLast = index === visitDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${visitType}-${institutionName}-${index}`}>
                      {/* Other columns */}
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {visitType}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {institutionName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {courses}
                        </Typography>
                      </td>
                      {/* Actions column */}
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(visit)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVisit(index)}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={deleteImg} alt="delete" className="h-5 w-5" />
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
          {isAddVisit ? (
            <VisitsPopUp
              visitType=""
              institutionName=""
              courses=""
              closeModal={closePopup}
              handleAddVisit={handleAddVisit}
            />
          ) : (
            selectedVisit && (
              <VisitsPopUp
                visitType={selectedVisit.visitType}
                institutionName={selectedVisit.institutionName}
                courses={selectedVisit.courses}
                closeModal={closePopup}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default Visits;
