import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PersonalDetailPopup({
  closeModal,
  name,
  highestDegree,
  email,
  contactNo,
  qualificationYear,
  degreeYear,
  updatePersonalDetails,
}) {
  const [formData, setFormData] = useState({
    name: name || "",
    highestDegree: highestDegree || "",
    email: email || "",
    contactNo: contactNo || "",
    qualificationYear: qualificationYear || "",
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto p-8 bg-gray-900 rounded-[20px]"
      >
        <form className="text-white flex flex-col space-y-6" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full group">
            <label htmlFor="name" className="block text-sm">
              Name
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

          <div className="relative z-0 w-full group">
            <label htmlFor="highestDegree" className="block text-sm">
              Highest Degree
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

          <div className="relative z-0 w-full group">
            <label htmlFor="degreeYear" className="block text-sm">
              Year of Degree
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

          <div className="relative z-0 w-full group">
            <label htmlFor="email" className="block text-sm">
              Official Email ID
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

          <div className="relative z-0 w-full group">
            <label htmlFor="contactNo" className="block text-sm">
              Contact No.
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

          <div className="relative z-0 w-full group">
            <label htmlFor="qualificationYear" className="block text-sm">
              Qualification Year
            </label>
            <input
              type="number"
              name="qualificationYear"
              id="qualificationYear"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.qualificationYear}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4"
          >
            Cancel
          </button>
        </form>
      </Card>
    </div>
  );
}
