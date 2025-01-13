import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PhDPopUp from "../PopUp/PhDsAwardedPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyPhDDetails = [
  { menteeName: "John Doe", rollNo: "123456", passingYear: 2020 },
  { menteeName: "Jane Smith", rollNo: "789012", passingYear: 2021 },
  { menteeName: "Alice Johnson", rollNo: "345678", passingYear: 2022 },
];

const PhDsAwarded = ({ setBlurActive }) => {
  const [phdDetails, setPhdDetails] = useState(dummyPhDDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPhD, setSelectedPhD] = useState(null);
  const [isAddPhD, setIsAddPhD] = useState(false);

  const openPopup = (phd) => {
    setSelectedPhD(phd);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPhD(false);
    setBlurActive(false);
  };

  const handleAddPhD = (newPhD) => {
    if (selectedPhD) {
      // Update existing PhD
      setPhdDetails((prevDetails) =>
        prevDetails.map((phd) => (phd === selectedPhD ? { ...newPhD } : phd))
      );
    } else {
      // Add new PhD
      setPhdDetails([...phdDetails, newPhD]);
    }
    closePopup();
  };

  const handleDeletePhD = (indexToDelete) => {
    setPhdDetails(phdDetails.filter((_, index) => index !== indexToDelete));
  };

  const TABLE_HEAD = ["Mentee Name", "Roll No", "Passing Year", "Actions"];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            PhDs Awarded <br />
            <span className="text-lg text-red-600">
              (Details of PhDs awarded)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddPhD(true);
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
                {phdDetails.map((phd, index) => {
                  const { menteeName, rollNo, passingYear } = phd;
                  const isLast = index === phdDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${menteeName}-${rollNo}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {menteeName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {rollNo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {passingYear}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(phd)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img
                              src={editImg}
                              alt="edit"
                              className="h-5 w-5"
                            />
                          </button>
                          <button
                            onClick={() => handleDeletePhD(index)}
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
        <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
          {isAddPhD ? (
            <PhDPopUp
              menteeName=""
              rollNo=""
              passingYear=""
              closeModal={closePopup}
              handleAddPhD={handleAddPhD}
            />
          ) : (
            selectedPhD && (
              <PhDPopUp
                menteeName={selectedPhD.menteeName}
                rollNo={selectedPhD.rollNo}
                passingYear={selectedPhD.passingYear}
                closeModal={closePopup}
                handleAddPhD={handleAddPhD}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default PhDsAwarded;
