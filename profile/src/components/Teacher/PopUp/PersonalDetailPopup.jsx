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
  updatePersonalDetails,
}) {
  const [formData, setFormData] = useState({
    name: name || "",
    highestDegree: highestDegree || "",
    email: email || "",
    contactNo: contactNo || "",
    qualificationYear: qualificationYear || "",
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
    if (!formData.name || !formData.highestDegree || !formData.email || !formData.contactNo) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Call the function passed from the parent to update the state
    updatePersonalDetails(formData);

    closeModal(); // Close the popup after update
  };

  return (
    <Card color="transparent" shadow={false}>
      <form className="max-w-md mx-auto text-white">
        {/* Name Field */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="name" className="block text-sm">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        {/* Highest Degree Field */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="highestDegree" className="block text-sm">
            Highest Degree
          </label>
          <input
            type="text"
            name="highestDegree"
            id="highestDegree"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.highestDegree}
            required
          />
        </div>

        {/* Email Field */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        {/* Contact No Field */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="contactNo" className="block text-sm">
            Contact No.
          </label>
          <input
            type="text"
            name="contactNo"
            id="contactNo"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.contactNo}
            required
          />
        </div>

        {/* Qualification Year Field */}
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="qualificationYear" className="block text-sm">
            Qualification Year
          </label>
          <input
            type="number"
            name="qualificationYear"
            id="qualificationYear"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.qualificationYear}
            required
          />
        </div>

        {/* Update Button */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </form>
    </Card>
  );
}
