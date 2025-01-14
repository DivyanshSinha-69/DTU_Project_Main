import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PhdGuidancePopup from "../PopUp/PhdGuidancePopup"; // Create this popup component if needed
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import deleteImg from "../../../assets/delete.svg";

const PhdGuidance = ({ setBlurActive }) => {
  const [mentees, setMentees] = useState([
    {
      rollNo: "PHD001",
      name: "Alice Smith",
      status: "Ongoing",
      specialization: "Machine Learning",
    },
    {
      rollNo: "PHD002",
      name: "Bob Johnson",
      status: "Done",
      specialization: "Data Science",
    },
  ]);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openPopup = (index = null) => {
    setEditIndex(index);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  const handleDeleteVisit = (index) => {
    const updatedMentees = mentees.filter((_, i) => i !== index);
    setMentees(updatedMentees);
  };

  const TABLE_HEAD = [
    "Mentee Roll No",
    "Mentee Name",
    "PhD Status",
    "Specialization",
    "Actions",
  ];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            PhD Guidance Details
          </p>

          <button
            onClick={() => openPopup()}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={editImg} alt="Add" className="h-5 w-5" />
          </button>

          <Popup
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <PhdGuidancePopup
                closeModal={closePopup}
                mentees={mentees}
                setMentees={setMentees}
                editIndex={editIndex}
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
                          className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${head === "Actions" ? "text-right" : ""
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
                {mentees.map((mentee, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {mentee.rollNo}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {mentee.name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {mentee.status}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {mentee.specialization}
                      </Typography>
                    </td>
                    {/* Actions column */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openPopup(index)}
                          className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                        >
                          <img src={editImg} alt="edit" className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisit(index)}
                          className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                        >
                          <img src={deleteImg} alt="delete" className="h-5 w-5 filter brightness-0 invert" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhdGuidance;
