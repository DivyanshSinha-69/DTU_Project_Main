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
    degreeYear: degreeYear || "", // New state field for degreeYear
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
    <Card color="transparent" shadow={false}>
      <form className="max-w-md mx-auto text-white">
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
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="degreeYear" className="block text-sm">
            Year of Degree
          </label>
          <input
            type="number"
            name="degreeYear"
            id="degreeYear"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
            onChange={handleChange}
            value={formData.degreeYear}
            required
          />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="email" className="block text-sm">
            Official Email ID
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
        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
          onClick={handleSubmit}
        >
          Update
        </button>
      </form>
    </Card>
  );
}
