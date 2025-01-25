import React, { useState,useEffect } from "react";
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
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState("");

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
  const fetchSpecializations = async () => {
    try {
      const response = await fetch(`http://localhost:3001/ece/faculty/specializations/FAC001`);
      const data = await response.json();
      setSpecializations(data.data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };
  
  useEffect(() => {
    fetchSpecializations();
  }, []);
  const addSpecialization = async () => {
    if (!newSpecialization.trim()) return;
  
    try {
      const response = await fetch("http://localhost:3001/ece/faculty/specializations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: "FAC001",
          specialization: newSpecialization,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setSpecializations([...specializations, { 
          specialization_id: result.id, 
          specialization: newSpecialization 
        }]);
        setNewSpecialization(""); // Clear input
      }
    } catch (error) {
      console.error("Error adding specialization:", error);
    }
  };
  

  const deleteSpecialization = async (specialization_id) => {
    try {
      const response = await fetch(`http://localhost:3001/ece/faculty/specializations/${specialization_id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setSpecializations(specializations.filter(spec => spec.specialization_id !== specialization_id));
      }
    } catch (error) {
      console.error("Error deleting specialization:", error);
    }
  };
  
  

  const TABLE_HEAD = [
    "Name",
    "Highest Degree",
    "Year of Degree",
    "Official Email ID",
    "Contact No.",
    "Qualification Year",
  ];
  const specializationOptions = [
    "Image processing",
    "Signal processing",
    "Soft computing",
    "Artificial intelligence",
    "Computer vision",
    "Wireless Technology",
    "Analog electronics",
    "Microelectronics",
    "Digital electronics",
    "VLSI design",
    "Applied electronics",
    "Machine learning",
    "Embedded systems",
    "Robotics",
    "Analog design",
    "Digital design",
    "Analog integrated circuits",
    "Microwave Engineering",
    "Digital signal processing",
    "Organic electronics",
    "Device modeling",
    "Electronics & Communication",
    "Digital communication",
    "Nanophotonics/Plasmonics",
    "Optical communication",
    "Sensors",
    "Spintronics",
    "Semiconductor devices",
    "Reinforcement learning",
    "Block chain/Distributed systems",
    "Deep learning",
    "Nanotechnology",
    "Biomedical Image & Signal processing",
    "Automation/Control Systems",
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
            <div >
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
                       {/* Specializations Sub-Table */}
<div className="mt-5">
  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
    Specializations
  </Typography>
  <hr className="my-2" /> {/* Line below the heading */}

  <table className="w-full table-auto border-collapse">
    <tbody>
      <tr>
        <td className="p-4">
          <div className="flex flex-wrap gap-2"> {/* Reduced spacing */}
            {specializations.map((spec) => (
              <div
                key={spec.specialization_id}
                className="flex items-center bg-gray-100 text-black px-4 py-2 rounded-lg"
              >
                 <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal text-sm" // 👈 Smaller font size
                >{spec.specialization}
                  </Typography>
                <button
                  onClick={() => deleteSpecialization(spec.specialization_id)}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </td>
      </tr>

      {/* Add New Specialization */}
      <tr>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <select
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select Specialization</option>
              {specializationOptions.map((specialization, index) => (
                <option key={index} value={specialization}>{specialization}</option>
              ))}
            </select>
            <button
              onClick={addSpecialization}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
