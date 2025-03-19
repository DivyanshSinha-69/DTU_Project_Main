import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PersonalDetailPopup({
  closeModal,
  name,
  highestDegree,
  email,
  contactNo,
  degreeYear,
  updatePersonalDetails,
}) {
  const [formData, setFormData] = useState({
    name: name || "",
    highestDegree: highestDegree || "",
    email: email || "",
    contactNo: contactNo || "",
    degreeYear: degreeYear || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.highestDegree ||
      !formData.email ||
      !formData.contactNo ||
      !formData.degreeYear
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    updatePersonalDetails(formData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 overflow-y-auto p-4">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto max-h-[90vh] p-8 bg-gray-900 rounded-[20px] overflow-y-auto"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Name Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="name" className="block text-sm">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>

          {/* Highest Degree Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="highestDegree" className="block text-sm">
              Highest Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="highestDegree"
              id="highestDegree"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.highestDegree}
              required
            />
          </div>

          {/* Year of Degree Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="degreeYear" className="block text-sm">
              Year of Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="degreeYear"
              id="degreeYear"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.degreeYear}
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="email" className="block text-sm">
              Official Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* Contact No. Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="contactNo" className="block text-sm">
              Contact No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactNo"
              id="contactNo"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.contactNo}
              required
            />
          </div>
          {/* Red Star Explanation */}
          <p className="text-sm text-gray-400 mt-4">
            <span className="text-red-500">*</span> compulsory fields
          </p>
          {/* Update Button */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>

            {/* Cancel Button */}
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
    </div>
  );
}
