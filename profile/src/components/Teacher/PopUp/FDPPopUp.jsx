import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function FacultyDevelopmentPopUp({
  programName,
  year,
  month,
  days,
  closeModal,
  handleAddFDP,
}) {
  const [formData, setFormData] = useState({
    programName: programName || "",
    year: year|| "",
    month: month || "",
    days: days || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const { programName, year, month, days } = formData;

    if (!programName || !year || !month || !days) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddFDP) {
    handleAddFDP(formData);  // Corrected typo here
  }
    closeModal();
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  const months = [
    "January", "February", "March", "April", "May", 
    "June", "July", "August", "September", "October", 
    "November", "December"
  ];

  return (
    <Card color="transparent" shadow={false} className="w-[90%] max-w-[700px] h-auto p-8 rounded-[20px]">
      <form className="text-white flex flex-col space-y-6" onSubmit={handlePopupSubmit}>
        {/* Program Name */}
        <div className="relative z-0 w-full group">
          <label htmlFor="programName" className="block text-sm">
            Program Name
          </label>
          <input
            type="text"
            name="programName"
            id="programName"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.programName}
            required
          />
        </div>

        {/* Year Conducted Dropdown */}
        <div className="relative z-0 w-full group">
          <label htmlFor="year" className="block text-sm">
            Year Conducted
          </label>
          <select
            name="year"
            id="year"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.year}
            required
          >
            <option value="">Select Year</option>
            {generateYearOptions()}
          </select>
        </div>

        {/* Month Conducted Dropdown */}
        <div className="relative z-0 w-full group">
          <label htmlFor="month" className="block text-sm">
            Month Conducted
          </label>
          <select
            name="month"
            id="month"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.month}
            required
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Days Contributed */}
        <div className="relative z-0 w-full group">
          <label htmlFor="days" className="block text-sm">
            Days Contributed
          </label>
          <input
            type="number"
            name="days"
            id="days"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.days}
            required
            min="1"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-5 space-x-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {programName ? "Update Program" : "Add Program"}
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
