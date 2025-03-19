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
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customSpecialization, setCustomSpecialization] = useState("");

  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
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
          degreeYear: faculty.year_of_attaining_highest_degree || "",
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
          university: "",
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
        `/ece/faculty/specializations?faculty_id=${facultyId}`
      );
      if (Array.isArray(response.data)) {
        // Filter out entries where specialization_name is null
        const validSpecializations = response.data.filter(
          (spec) => spec.specialization_name !== null
        );
        setSpecializations(validSpecializations);
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

  const addSpecialization = async () => {
    let specializationToAdd = newSpecialization;

    if (newSpecialization === "Other") {
      if (!customSpecialization.trim()) return;
      specializationToAdd = customSpecialization;
    } else if (!newSpecialization.trim()) {
      return;
    }

    try {
      const response = await API.post("/ece/faculty/specializations", {
        faculty_id: facultyId,
        specialization_name: specializationToAdd,
      });
      if (response.data) {
        fetchSpecializations();
        setNewSpecialization("");
        setCustomSpecialization("");
        setIsOtherSelected(false);
      }
    } catch (error) {
      console.error("Error adding specialization:", error);
    }
  };

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
    "Other", // Add "Other" option
  ];
  const title = "Personal Details";
  const subtitle = "(As per official records)";

  return (
    <div>
      <div className="h-auto">
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

        <Card
          className=" rounded-2xl p-6 w-full mx-auto"
          style={{
            backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
            color: darkMode ? "#C9CCD1" : "#2D3A4A",
            border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
          }}
        >
          <div className="flex flex-row justify-between items-center mb-5">
            <div>
              <Typography
                variant="h5"
                className="font-poppins font-semibold text-xl"
                style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="small"
                  className="text-red-500 mt-1 font-poppins font-medium"
                >
                  {subtitle}
                </Typography>
              )}
            </div>

            <button
              onClick={openPopup}
              className="p-2 rounded-full transition-transform hover:scale-105"
              style={{
                backgroundColor: darkMode ? "#238636" : "#2D9C4A",
                color: "#FFFFFF",
              }}
            >
              <img src={editImg} alt="edit" className="h-5 w-5" />
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table
              className="w-full table-auto text-left"
              style={{
                backgroundColor: "transparent",
                color: darkMode ? "#C9CCD1" : "#2D3A4A",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: darkMode ? "#161B22" : "#F0F2F5",
                    color: darkMode ? "#A0A4A8" : "#6B7280",
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
                        style={{ opacity: 0.8, letterSpacing: "0.5px" }}
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {Object.values(personalDetails).map((value, idx) => (
                    <td key={idx} className="p-4">
                      <Typography
                        variant="small"
                        className="font-poppins font-normal"
                        style={{
                          color: darkMode ? "#C9CCD1" : "#2D3A4A",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {value ? value : "-"}
                      </Typography>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <Typography
              variant="small"
              className="font-poppins font-medium"
              style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
            >
              Specializations
            </Typography>
            <hr
              className="my-2"
              style={{ borderColor: darkMode ? "#21262D" : "#DADDE1" }}
            />
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr style={{ backgroundColor: "transparent" }}>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec) => (
                        <div
                          key={spec.specialization_id}
                          className="flex items-center px-4 py-2 rounded-lg transition-all"
                          style={{
                            backgroundColor: darkMode ? "#2B2C3A" : "#F0F2F5",
                            color: darkMode ? "#C9CCD1" : "#2D3A4A",
                          }}
                        >
                          <Typography
                            variant="small"
                            className="font-poppins font-normal"
                          >
                            {spec.specialization_name}
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

                <tr>
                  <td className="p-4">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <select
                        value={newSpecialization}
                        onChange={(e) => {
                          setNewSpecialization(e.target.value);
                          setIsOtherSelected(e.target.value === "Other");
                        }}
                        className="border rounded px-2 py-1 transition-all w-full md:w-auto"
                        style={{
                          backgroundColor: darkMode ? "#161B22" : "#FFFFFF",
                          color: darkMode ? "#C9CCD1" : "#2D3A4A",
                          borderColor: darkMode ? "#21262D" : "#DADDE1",
                        }}
                      >
                        <option value="">Select Specialization</option>
                        {specializationOptions.map((specialization, index) => (
                          <option key={index} value={specialization}>
                            {specialization}
                          </option>
                        ))}
                      </select>

                      {isOtherSelected && (
                        <input
                          type="text"
                          value={customSpecialization}
                          onChange={(e) =>
                            setCustomSpecialization(e.target.value)
                          }
                          placeholder="Specify your specialization"
                          className="border rounded px-2 py-1 transition-all w-full md:w-auto"
                          style={{
                            backgroundColor: darkMode ? "#161B22" : "#FFFFFF",
                            color: darkMode ? "#C9CCD1" : "#2D3A4A",
                            borderColor: darkMode ? "#21262D" : "#DADDE1",
                          }}
                        />
                      )}

                      <button
                        onClick={addSpecialization}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-transform hover:scale-105 w-full md:w-auto"
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
  );
};

export default PersonalDetails;
