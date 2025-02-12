import React, { useState } from "react";
import Modal from "../Modal"; // Assuming you have a modal component
import { useDispatch } from "react-redux";
import { setTeacherDetails } from "../../redux/reducers/TeacherDetailsSlice";

const TeacherDetails = ({ setBlurActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    degree: "",
    designation: "",
    dateOfJoining: "",
  });
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setTeacherDetails(details));
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setBlurActive(true);
        }}
      >
        Add/Edit Details
      </button>
      {isOpen && (
        <Modal
          closeModal={() => {
            setIsOpen(false);
            setBlurActive(false);
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Form fields for name, degree, designation, dateOfJoining */}
          </form>
        </Modal>
      )}
    </>
  );
};

export default TeacherDetails;
