import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import VisitsPopUp from "../PopUp/VisitsPopUp"; // Updated to use VisitsPopUp
import '../../../styles/popup.css';
import { useSelector, useDispatch } from "react-redux";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg"; // Add an icon for adding a visit

// Dummy data for testing
const dummyVisitDetails = [
  { visitType: "Visiting", institutionName: "University of Oxford", courses: "AI and Machine Learning" },
  { visitType: "Adjunct", institutionName: "Stanford University", courses: "Advanced Algorithms" },
  { visitType: "Emeritus", institutionName: "MIT", courses: "Quantum Computing" }
];

const Visits = ({ setBlurActive }) => {
  const dispatch = useDispatch();
  const [visitDetails, setVisitDetails] = useState(dummyVisitDetails); // Using dummy data as initial state
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isAddVisit, setIsAddVisit] = useState(false); // New state to handle adding a visit

  const openPopup = (visit) => {
    setSelectedVisit(visit); // Set the visit details for the popup
    setPopupOpen(true);
    setBlurActive(true); // Activate blur when opening the popup
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddVisit(false); // Reset Add visit state when closing the popup
    setBlurActive(false); // Deactivate blur when closing the popup
  };

  const handleAddVisit = (newVisit) => {
    // Adds a new visit to the visitDetails array
    setVisitDetails([...visitDetails, newVisit]);
    closePopup();
  };

  const TABLE_HEAD = ["Visit Type", "Institution Name", "Courses"];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Teacher Visit Details <br /><span className="text-lg text-red-600">(Details of academic visits)</span>
          </p>

          {/* Add button to open popup for adding new visit */}
          <button onClick={() => { setIsAddVisit(true); setPopupOpen(true); setBlurActive(true); }} className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in">
            <img src={addImg} alt="hello" className="h-5 w-5"/>
          </button>
        </div>
        <hr className="mb-7"></hr>

        {/* Table */}
        <div className="">
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
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Actions
                    </Typography>
                  </th>
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
                      <td className={classes}>
                        <button onClick={() => openPopup(visit)} className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in">
                          <img src={editImg} alt="edit" className="h-5 w-5"/>
                        </button>
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
              handleAddVisit={handleAddVisit} // Pass the function to handle adding a visit
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
