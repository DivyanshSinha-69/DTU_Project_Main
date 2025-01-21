import React, { useState,useEffect } from "react";
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
  const [phdDetails, setPhdDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPhD, setSelectedPhD] = useState(null);
  const [isAddPhD, setIsAddPhD] = useState(false);
  useEffect(() => {
    fetchPhDs();
  }, []);
  
  const API_BASE_URL = "http://localhost:3001/ece/faculty";

  const fetchPhDs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/phd/FAC001`);
      if (!response.ok) {
        // If the response is not OK (e.g., 404), handle it gracefully
        if (response.status === 404) {
          setPhdDetails([]); // No data found, set to an empty array
          return;
        }
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
      setPhdDetails(
        data.map((record) => ({
          menteeName: record.mentee_name,
          rollNo: record.mentee_rn,
          passingYear: record.passing_year,
        }))
      );
    } catch (error) {
      console.error("Error fetching PhD awarded records:", error);
      setPhdDetails([]); // Fallback to an empty array in case of errors
    }
  };
  

const addPhD = async (newPhD) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        faculty_id: "FAC001", // Hardcoded for now
        mentee_name: newPhD.menteeName,
        mentee_rn: newPhD.rollNo,
        passing_year: newPhD.passingYear,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add new record");
    }
    fetchPhDs();
  } catch (error) {
    console.error("Error adding new PhD record:", error);
  }
};

const updatePhD = async (updatedPhD) => {
  try {
    console.log(updatedPhD.rollNo);
    const response = await fetch(
      `${API_BASE_URL}/phd/${updatedPhD.rollNo}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentee_name: updatedPhD.menteeName,
          passing_year: updatedPhD.passingYear,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update the record");
    }
    fetchPhDs();
  } catch (error) {
    console.error("Error updating PhD record:", error);
  }
};

const deletePhD = async (rollNo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phd/${rollNo}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete record");
    }
    fetchPhDs();
  } catch (error) {
    console.error("Error deleting PhD record:", error);
  }
};


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

  const handleAddPhD = async (newPhD) => {
    if (isAddPhD) {
      // Update existing record
      console.log(newPhD);
      await addPhD(newPhD);
      
    } else {
      // Add new record
      console.log(newPhD)
      await updatePhD(newPhD);
    }
    closePopup();
  };
  

  const handleDeletePhD = async (indexToDelete) => {
    const { rollNo } = phdDetails[indexToDelete];
    try {
      const response = await deletePhD(rollNo); // Call the delete API
      if (response.ok) {
        // Update the state to remove the deleted row
        setPhdDetails((prevDetails) =>
          prevDetails.filter((_, index) => index !== indexToDelete)
        );
      } else {
        console.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting PhD record:", error);
    }
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
