import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PreviousEducationPopUp({
  closeModal,
  handleAddEducationDetails,
  course,
  specialization,
  institution,
  percent_obtained,
  passout_year,
}) {
  const [formData, setFormData] = useState({
    course: course || "",
    specialization: specialization || "",
    institution: institution || "",
    percent_obtained: percent_obtained || "",
    passout_year: passout_year || "",
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

    // Validation
    if (
      !formData.course ||
      !formData.institution ||
      !formData.percent_obtained ||
      !formData.passout_year
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    await handleAddEducationDetails(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] max-h-[90vh] bg-gray-900 rounded-[20px] overflow-hidden flex flex-col"
      >
        <div className="overflow-y-auto flex-1 p-6">
          <form
            onSubmit={handleSubmit}
            className="text-white flex flex-col space-y-6"
          >
            {/* Course */}
            <div className="relative z-0 w-full group">
              <label htmlFor="course" className="block text-sm">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="course"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.course}
              />
            </div>

            {/* Specialization */}
            <div className="relative z-0 w-full group">
              <label htmlFor="specialization" className="block text-sm">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.specialization}
              />
            </div>

            {/* Institution */}
            <div className="relative z-0 w-full group">
              <label htmlFor="institution" className="block text-sm">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.institution}
              />
            </div>

            {/* Percentage Obtained */}
            <div className="relative z-0 w-full group">
              <label htmlFor="percent_obtained" className="block text-sm">
                Percentage Obtained <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="percent_obtained"
                min="0"
                max="100"
                step="0.01"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.percent_obtained}
              />
            </div>

            {/* Passout Year */}
            <div className="relative z-0 w-full group">
              <label htmlFor="passout_year" className="block text-sm">
                Passout Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="passout_year"
                min="1900"
                max={new Date().getFullYear()}
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.passout_year}
              />
            </div>

            <p className="text-sm text-gray-400">
              <span className="text-red-500">*</span> compulsory fields
            </p>

            <div className="flex items-center justify-between mt-5 space-x-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
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
        </div>
      </Card>
    </div>
  );
}
