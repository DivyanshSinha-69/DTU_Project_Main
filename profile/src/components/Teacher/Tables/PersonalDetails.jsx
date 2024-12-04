import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PersonalDetailPopup from "../PopUp/PersonalDetailPopup";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";

const PersonalDetails = ({ setBlurActive }) => {
  const [personalDetails, setPersonalDetails] = useState({
    name: "John Doe",
    highestDegree: "PhD",
    email: "johndoe@example.com",
    contactNo: "1234567890",
    qualificationYear: "2010",
    degreeYear: "2008", // New property for the year of attaining the highest degree
  });
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true); // Activate blur when opening the popup
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false); // Deactivate blur when closing the popup
  };

  const updatePersonalDetails = (updatedData) => {
    setPersonalDetails(updatedData);
  };

  const TABLE_HEAD = [
    "Name",
    "Highest Degree",
    "Year of Degree",
    "Official Email ID",
    "Contact No.",
    "Qualification Year",
  ];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Teacher Personal Details <br />
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
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <PersonalDetailPopup
                closeModal={closePopup}
                name={personalDetails.name}
                highestDegree={personalDetails.highestDegree}
                email={personalDetails.email}
                contactNo={personalDetails.contactNo}
                qualificationYear={personalDetails.qualificationYear}
                degreeYear={personalDetails.degreeYear}
                updatePersonalDetails={updatePersonalDetails}
              />
            </div>
          </Popup>
        </div>
        <hr className="mb-7"></hr>

        <div>
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
                <tr key={personalDetails.name}>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.highestDegree}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.degreeYear}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.email}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.contactNo}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {personalDetails.qualificationYear}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
