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
      <Card color="transparent" shadow={false} className="w-[90%] max-w-[700px] h-auto p-8  rounded-[20px]">
        <form className="text-white flex flex-col space-y-6" onSubmit={handlepopup}>
          {/* Visit Type Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="visitType" className="block text-sm">
              Visit Type
            </label>
            <select
              name="visitType"
              id="visitType"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="relative z-0 w-full group">
            <label htmlFor="institutionName" className="block text-sm">
              Institution Name
            </label>
            <input
              type="text"
              name="institutionName"
              id="institutionName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.institutionName}
              required
            />
          </div>

          {/* Courses */}
          <div className="relative z-0 w-full group">
            <label htmlFor="courses" className="block text-sm">
              Courses
            </label>
            <input
              type="text"
              name="courses"
              id="courses"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.courses}
              required
            />
          </div>

          {/* Update/Add Button */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {visitType ? "Update Visit" : "Add Visit"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
  );
}
