import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PersonalDetailPopup from "../PopUp/PersonalDetailPopup";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import { useThemeContext } from "../../../context/ThemeContext";

const PersonalDetails = ({ setBlurActive }) => {
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;
  const { darkMode } = useThemeContext();
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    highestDegree: "",
    degreeYear: "",
    email: "",
    contactNo: "",
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

  const fetchFacultyDetails = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/faculty-details/${facultyId}`
      );
      if (response.data) {
        const faculty = response.data.data[0];
        setPersonalDetails({
          name: faculty.faculty_name || "",
          highestDegree: faculty.degree || "",
          degreeYear: faculty.year_of_attaining_highest_degree || "", // Assuming same as qualification year

          email: faculty.email_id || "",
          contactNo: faculty.mobile_number || "",
        });
      }
    } catch (error) {
      console.error("Error fetching faculty details:", error);
    }
  };

  const updatePersonalDetails = async (updatedData) => {
    try {
      const response = await API.put(
        `/ece/faculty/faculty-details/${facultyId}`,
        {
          faculty_name: updatedData.name,
          degree: updatedData.highestDegree,
          university: "", // Add if needed
          year_of_attaining_highest_degree: updatedData.degreeYear,
          email_id: updatedData.email,
          mobile_number: updatedData.contactNo,
        }
      );

      if (response.status === 200) {
        setPersonalDetails(updatedData);
      }
    } catch (error) {
      console.error("Error updating faculty details:", error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/specializations/${facultyId}`
      );
      if (Array.isArray(response.data.data)) {
        setSpecializations(response.data.data);
      } else {
        setSpecializations([]);
      }
    } catch (error) {
      console.error("Error fetching specializations:", error);
      setSpecializations([]);
    }
  };

  useEffect(() => {
    fetchFacultyDetails();
    fetchSpecializations();
  }, [facultyId]);

  // Add a new specialization using API.post
  const addSpecialization = async () => {
    if (!newSpecialization.trim()) return;

    try {
      const response = await API.post("/ece/faculty/specializations", {
        faculty_id: facultyId,
        specialization: newSpecialization,
      });
      if (response.data) {
        setSpecializations([
          ...specializations,
          {
            specialization_id: response.data.id, // Assuming the API returns the generated ID as `id`
            specialization: newSpecialization,
          },
        ]);
        setNewSpecialization(""); // Clear input
      }
    } catch (error) {
      console.error("Error adding specialization:", error);
    }
  };

  // Delete a specialization using API.delete
  const deleteSpecialization = async (specialization_id) => {
    try {
      await API.delete(`/ece/faculty/specializations/${specialization_id}`);
      setSpecializations(
        specializations.filter(
          (spec) => spec.specialization_id !== specialization_id
        )
      );
    } catch (error) {
      console.error("Error deleting specialization:", error);
    }
  };

  const TABLE_HEAD = [
    "Name",
    "Highest Degree",
    "Year of Attaining Highest Degree",
    "Official Email ID",
    "Contact No.",
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
  const title = "Teacher Personal Details";
  const subtitle = "(As per official records)";
  return (
    <div>
      <div className="h-auto ">
        <Popup
          trigger={null}
          open={isPopupOpen}
          onClose={closePopup}
          className="mx-auto my-auto p-2"
          closeOnDocumentClick
        >
          <div>
            <PersonalDetailPopup
              closeModal={closePopup}
              name={personalDetails.name}
              highestDegree={personalDetails.highestDegree}
              email={personalDetails.email}
              contactNo={personalDetails.contactNo}
              degreeYear={personalDetails.degreeYear}
              updatePersonalDetails={updatePersonalDetails}
            />
          </div>
        </Popup>

        <div>
          <Card
            className="shadow-2xl rounded-2xl p-6 w-full mx-auto"
            style={{
              backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
              color: darkMode ? "#E4E6EB" : "#1C1E21",
            }}
          >
            {/* Table Header Section */}
            <div className="flex flex-row justify-between items-center mb-5">
              {/* Title & Subtitle */}
              <div>
                <Typography
                  variant="h5"
                  className="font-poppins font-semibold text-xl"
                  style={{ color: darkMode ? "#E4E6EB" : "#1C1E21" }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {subtitle}
                  </Typography>
                )}
              </div>

              {/* edit Button (Aligned to Right) */}
              <button
                onClick={openPopup}
                className="p-2 rounded-full transition-transform hover:scale-105"
                style={{
                  backgroundColor: darkMode ? "#238636" : "#2D9C4A",
                  color: "#FFFFFF",
                }}
              >
                <img src={editImg} alt="add" className="h-5 w-5" />
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              <table
                className="w-full table-auto text-left"
                style={{
                  backgroundColor: "transparent",
                  color: darkMode ? "#E4E6EB" : "#1C1E21",
                }}
              >
                {/* Table Head */}
                <thead>
                  <tr
                    style={{
                      backgroundColor: darkMode ? "#161B22" : "#F0F2F5",
                      color: darkMode ? "#8B949E" : "#65676B",
                    }}
                  >
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b p-4"
                        style={{
                          borderBottom: darkMode
                            ? "1px solid #21262D"
                            : "1px solid #DADDE1",
                        }}
                      >
                        <Typography
                          variant="small"
                          className="font-poppins font-medium leading-none"
                          style={{ opacity: 0.8 }}
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  <tr>
                    {Object.values(personalDetails).map((value, idx) => (
                      <td key={idx} className="p-4">
                        <Typography
                          variant="small"
                          className="font-poppins font-normal"
                          style={{ color: darkMode ? "#E4E6EB" : "#1C1E21" }}
                        >
                          {value ? value : "-"}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Specializations Sub-Table */}
            <div className="mt-5">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Specializations
              </Typography>
              <hr className="my-2" /> {/* Line below the heading */}
              <table className="w-full table-auto border-collapse">
                <tbody>
                  <tr
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {" "}
                        {/* Reduced spacing */}
                        {specializations.map((spec) => (
                          <div
                            key={spec.specialization_id}
                            className="flex items-center bg-gray-100 text-black px-4 py-2 rounded-lg"
                          >
                            <Typography
                              variant="small"
                              className="font-poppins font-normal"
                              style={{
                                color: darkMode ? "#E4E6EB" : "#1C1E21",
                              }}
                            >
                              {spec.specialization}
                            </Typography>
                            <button
                              onClick={() =>
                                deleteSpecialization(spec.specialization_id)
                              }
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
                          {specializationOptions.map(
                            (specialization, index) => (
                              <option key={index} value={specialization}>
                                {specialization}
                              </option>
                            )
                          )}
                        </select>
                        <button
                          onClick={addSpecialization}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-transform hover:scale-105"
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
