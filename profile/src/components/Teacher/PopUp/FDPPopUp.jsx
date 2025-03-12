import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function FacultyDevelopmentPopUp({
  programName,
  year,
  month,
  days,
  type,
  closeModal,
  handleAddFDP,
}) {
  const [formData, setFormData] = useState({
    programName: programName || "",
    year: year || "",
    month: month || "",
    days: days || "",
    type: type || "Conducted", // Default to "Conducted"
  });

  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const { programName, year, month, days, type } = formData;

    if (!programName || !year || !month || !days || !type) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddFDP) {
      handleAddFDP(formData);
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
          {/* Program Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="programName" className="block text-sm">
              Title of Faculty development/training activities
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
          {/* Type Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="type" className="block text-sm">
              Type
            </label>
            <select
              name="type"
              id="type"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.type}
              required
            >
              <option value="Conducted">Conducted</option>
              <option value="Participated">Participated</option>
            </select>
          </div>
          {/* Year Conducted Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="year" className="block text-sm">
              Year
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
              Month
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
              {months.map((month) => (
                <option key={month.value} value={month.name}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          {/* Days Contributed */}
          <div className="relative z-0 w-full group">
            <label htmlFor="days" className="block text-sm">
              Duration (in days)
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
    </div>
  );
}
