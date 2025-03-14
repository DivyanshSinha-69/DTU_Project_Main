import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PhDsAwardedPopUp({
  menteeName,
  rollNo,
  degree,
  passingMonth,
  passingYear,
  PHD_id,
  closeModal,
  handleAddPhD,
}) {
  const [formData, setFormData] = useState({
    menteeName: menteeName || "",
    rollNo: rollNo || "",
    passingYear: passingYear || "",
    degree: degree || "PhD", // Default to PhD
    PHD_id: PHD_id || "",
    passingMonth: passingMonth || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    const { menteeName, degree, rollNo, passingMonth, passingYear, PHD_id } =
      formData;

    if (!menteeName || !rollNo || !passingYear || !passingMonth || !degree) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddPhD) {
      handleAddPhD(formData);
    }
    closeModal();
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
      years.push(year);
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };
  const generateMonthOptions = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.map((month, index) => (
      <option key={month} value={month}>
        {month}
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
          {/* Mentee Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="menteeName" className="block text-sm">
              Mentee Name
            </label>
            <input
              type="text"
              name="menteeName"
              id="menteeName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.menteeName}
              required
            />
          </div>

          {/* Roll No */}
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
          {/* Degree Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="degree" className="block text-sm">
              Degree
            </label>
            <select
              name="degree"
              id="degree"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.degree}
              required
            >
              <option value="PhD">PhD</option>
              <option value="M.Tech">M.Tech</option>
            </select>
          </div>
          {/* Passing Month Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="passingMonth" className="block text-sm">
              Passing Month
            </label>
            <select
              name="passingMonth"
              id="passingMonth"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.passingMonth}
              required
            >
              <option value="">Select Month</option>
              {generateMonthOptions()}
            </select>
          </div>

          {/* Passing Year Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="passingYear" className="block text-sm">
              Passing Year
            </label>
            <select
              name="passingYear"
              id="passingYear"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.passingYear}
              required
            >
              <option value="">Select Year</option>
              {generateYearOptions()}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {menteeName ? "Update Record" : "Add Record"}
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
