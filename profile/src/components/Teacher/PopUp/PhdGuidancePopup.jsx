import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

const PhdGuidancePopup = ({ closeModal, mentees, setMentees }) => {
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    status: "ongoing", // Default value
    specialization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.rollNo || !formData.name || !formData.status || !formData.specialization) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setMentees((prevMentees) => [...prevMentees, formData]);
    toast.success("Mentee added successfully!");
    closeModal();
  };

  return (
    <Card
      color="transparent"
      shadow={false}
      className="w-[90%] max-w-[700px] h-auto p-8 bg-gray-800 rounded-[20px]"
    >
      <form className="text-white flex flex-col space-y-6" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full group">
          <label htmlFor="rollNo" className="block text-sm">
            Roll No
          </label>
          <input
            type="text"
            name="rollNo"
            id="rollNo"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.rollNo}
            required
          />
        </div>

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
          <label htmlFor="status" className="block text-sm">
            PhD Status
          </label>
          <select
            name="status"
            id="status"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.status}
            required
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="relative z-0 w-full group">
          <label htmlFor="specialization" className="block text-sm">
            Specialization
          </label>
          <input
            type="text"
            name="specialization"
            id="specialization"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.specialization}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Mentee
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
  );
};

export default PhdGuidancePopup;
