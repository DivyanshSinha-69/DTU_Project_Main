import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function VisitsPopUp({ visitType, institutionName, courses, closeModal, handleAddVisit }) {
  const [formData, setFormData] = useState({
    visitType: visitType || "",
    institutionName: institutionName || "",
    courses: courses || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async (e) => {
    e.preventDefault();
    if (!formData.visitType || !formData.institutionName || !formData.courses) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // If there's an `handleAddVisit` function passed in, call it to add the visit
    if (handleAddVisit) {
      handleAddVisit(formData); // Pass the form data to handle adding the visit
    }

    // Close the modal after adding the visit
    closeModal();
  };

  return (
    <Card color="transparent" shadow={false}>
      <form className="max-w-md mx-auto text-white">
        {/* Visit Type Dropdown */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="visitType" className="block text-sm">
            Visit Type
          </label>
          <select
            name="visitType"
            id="visitType"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.visitType}
            required
          >
            <option value="">Select Visit Type</option>
            <option value="Visiting">Visiting</option>
            <option value="Adjunct">Adjunct</option>
            <option value="Emeritus">Emeritus</option>
          </select>
        </div>

        {/* Institution Name */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="institutionName" className="block text-sm">
            Institution Name
          </label>
          <input
            type="text"
            name="institutionName"
            id="institutionName"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.institutionName}
            required
          />
        </div>

        {/* Courses */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="courses" className="block text-sm">
            Courses
          </label>
          <input
            type="text"
            name="courses"
            id="courses"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.courses}
            required
          />
        </div>

        {/* Update/Add Button */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
            onClick={handlepopup}
          >
            {visitType ? "Update Visit" : "Add Visit"}
          </button>
        </div>
      </form>
    </Card>
  );
}
