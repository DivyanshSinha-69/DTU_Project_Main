import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function QualificationPopUp({
  degreeLevel,
  institute,
  degreeName,
  yearOfPassing,
  specialization,
  closeModal,
  handleAddQualification,
}) {
  const [formData, setFormData] = useState({
    degreeLevel: degreeLevel || "",
    institute: institute || "",
    degreeName: degreeName || "",
    yearOfPassing: yearOfPassing || "",
    specialization: specialization || "",
  });

  const degreeLevels = ["Bachelors", "Masters", "PhD"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const {
      degreeLevel,
      institute,
      degreeName,
      yearOfPassing,
      specialization,
    } = formData;

    if (
      !degreeLevel ||
      !institute ||
      !degreeName ||
      !yearOfPassing ||
      !specialization
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddQualification) {
      handleAddQualification(formData);
    }
    closeModal();
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear; year++) {
      years.push(year);
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto p-8 bg-gray-900 rounded-[20px]"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handlePopupSubmit}
        >
          {/* Degree Level Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="degreeLevel" className="block text-sm">
              Degree Level
            </label>
            <select
              name="degreeLevel"
              id="degreeLevel"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.degreeLevel}
              required
            >
              <option value="">Select Degree Level</option>
              {degreeLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Institute */}
          <div className="relative z-0 w-full group">
            <label htmlFor="institute" className="block text-sm">
              Institute
            </label>
            <input
              type="text"
              name="institute"
              id="institute"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.institute}
              required
            />
          </div>

          {/* Degree Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="degreeName" className="block text-sm">
              Degree Name
            </label>
            <input
              type="text"
              name="degreeName"
              id="degreeName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.degreeName}
              required
            />
          </div>

          {/* Year of Passing Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="yearOfPassing" className="block text-sm">
              Year of Passing
            </label>
            <select
              name="yearOfPassing"
              id="yearOfPassing"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.yearOfPassing}
              required
            >
              <option value="">Select Year</option>
              {generateYearOptions()}
            </select>
          </div>

          {/* Specialization */}
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

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {degreeLevel ? "Update Qualification" : "Add Qualification"}
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
    </div>
  );
}
