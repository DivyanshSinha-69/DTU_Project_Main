import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { useThemeContext } from "../../../context/ThemeContext";
import StudentDetailsPopUp from "../PopUp/PersonalDetailsPopUp";

const StudentPersonalDetails = ({ setBlurActive }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddStudent, setIsAddStudent] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const { darkMode } = useThemeContext();

  useEffect(() => {
    if (!roll_no) return;

    const fetchStudentDetails = async () => {
      try {
        const response = await API.get(
          `ece/student/details?roll_no=${roll_no}`
        );
        const student = response?.data?.data?.[0]; // <- Correct mapping here

        if (student) {
          setStudentDetails([
            {
              roll_no: student.roll_no,
              full_name: student.student_name,
              father_name: student.father_name,
              mother_name: student.mother_name,
              personal_contact: student.personal_contact,
              parent_contact: student.parent_contact,
              personal_email: student.personal_email,
              dtu_email: student.dtu_email,
              original_city: student.original_city,
              original_country: student.original_country,
            },
          ]);
        } else {
          toast.error("No student details available");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Error while fetching student details");
      }
    };

    fetchStudentDetails();
  }, [roll_no]);

  const openPopup = (student) => {
    setSelectedStudent(student);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddStudent(false);
    setBlurActive(false);
  };

  const handleAddStudentDetails = async (newStudentDetails) => {
    const {
      fullName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      address,
      bloodGroup,
    } = newStudentDetails;

    const payload = {
      roll_no: roll_no,
      full_name: fullName,
      date_of_birth: dateOfBirth,
      gender: gender,
      email: email,
      phone_number: phoneNumber,
      address: address,
      blood_group: bloodGroup,
    };

    try {
      let response;
      if (isAddStudent) {
        response = await API.post("ece/student/details", payload);
      } else {
        response = await API.put(
          `student/details/${selectedStudent.roll_no}`,
          payload
        );
      }

      if (response && response.data) {
        toast.success("Student details successfully saved");

        const newStudentRecord = {
          roll_no: response.data.roll_no || selectedStudent.roll_no,
          full_name: response.data.full_name || fullName,
          date_of_birth: response.data.date_of_birth || dateOfBirth,
          gender: response.data.gender || gender,
          email: response.data.email || email,
          phone_number: response.data.phone_number || phoneNumber,
          address: response.data.address || address,
          blood_group: response.data.blood_group || bloodGroup,
        };

        if (isAddStudent) {
          setStudentDetails((prev) => [...prev, newStudentRecord]);
        } else {
          setStudentDetails((prev) =>
            prev.map((student) =>
              student.roll_no === selectedStudent.roll_no
                ? newStudentRecord
                : student
            )
          );
        }

        closePopup();
      } else {
        toast.error("Failed to save student details.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  const handleDeleteStudentDetails = async (rollNo) => {
    try {
      const response = await API.delete(`ece/student/details/${rollNo}`);
      if (response && response.data) {
        toast.success("Student details deleted successfully");
        setStudentDetails((prev) =>
          prev.filter((student) => student.roll_no !== rollNo)
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting student details:", err);
      toast.error("Error while deleting student details");
    }
  };

  return (
    <>
      {/* Reusable Custom Table Component */}
      <CustomTable
        title="Personal Details"
        subtitle="(Student's Personal Information)"
        columns={[
          { key: "full_name", label: "Full Name" },
          { key: "father_name", label: "Father's Name" },
          { key: "mother_name", label: "Mother's Name" },
          { key: "personal_contact", label: "Personal Contact" },
          { key: "parent_contact", label: "Parent Contact" },
          { key: "personal_email", label: "Personal Email" },
          { key: "dtu_email", label: "DTU Email" },
          { key: "original_city", label: "City" },
          { key: "original_country", label: "Country" },
          { key: "actions", label: "Actions" },
        ]}
        data={studentDetails}
        actions={{
          edit: (student) => {
            setIsAddStudent(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedStudent(student);
          },
          delete: (student) => {
            if (student?.roll_no) {
              handleDeleteStudentDetails(student.roll_no);
            } else {
              console.error(
                "Student roll number is missing or undefined",
                student
              );
              toast.error("Student roll number not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddStudent(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedStudent(null);
        }}
      />

      {/* Popup for Adding/Editing Student Details */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddStudent ? (
            <StudentDetailsPopUp
              fullName=""
              dateOfBirth=""
              gender=""
              email=""
              phoneNumber=""
              address=""
              bloodGroup=""
              closeModal={closePopup}
              handleAddStudentDetails={handleAddStudentDetails}
            />
          ) : (
            selectedStudent && (
              <StudentDetailsPopUp
                fullName={selectedStudent.full_name}
                dateOfBirth={selectedStudent.date_of_birth}
                gender={selectedStudent.gender}
                email={selectedStudent.email}
                phoneNumber={selectedStudent.phone_number}
                address={selectedStudent.address}
                bloodGroup={selectedStudent.blood_group}
                closeModal={closePopup}
                handleAddStudentDetails={handleAddStudentDetails}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentPersonalDetails;
