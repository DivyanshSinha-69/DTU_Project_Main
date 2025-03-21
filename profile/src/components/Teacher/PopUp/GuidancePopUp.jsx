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
    document: null, // Add document field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.includes("pdf") && !file.type.includes("docx")) {
        toast.error("Only PDF and DOCX files are allowed");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        document: file,
      }));
    }
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    const { menteeName, degree, rollNo, passingMonth, passingYear, document } =
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
              Student Name <span className="text-red-500">*</span>
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
              Roll No <span className="text-red-500">*</span>
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
              Degree <span className="text-red-500">*</span>
            </label>
            <select
              name="degree"
              id="degree"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.degree}
              required
            >
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Passing Month Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="passingMonth" className="block text-sm">
              Passing Month <span className="text-red-500">*</span>
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
              Passing Year <span className="text-red-500">*</span>
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

          {/* Document Upload */}
          <div className="relative z-0 w-full group">
            <label htmlFor="document" className="block text-sm">
              Upload Document (PDF or image of relevant office order/ front page
              of thesis/ etc.)
            </label>
            <input
              type="file"
              name="document"
              id="document"
              accept=".pdf,.jpeg"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />
          </div>

          {/* Red Star Explanation */}
          <p className="text-sm text-gray-400">
            <span className="text-red-500">*</span> compulsory fields
          </p>

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
