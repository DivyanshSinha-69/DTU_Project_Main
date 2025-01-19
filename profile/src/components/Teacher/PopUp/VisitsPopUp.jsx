import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function VisitsPopUp({
  visitType,
  institutionName,
  courses,
  closeModal,
  handleAddVisit,
  year_of_visit,
  hours_taught,
}) {
  const [formData, setFormData] = useState({
    visitType: visitType || "",
    institutionName: institutionName || "",
    courses: courses || "",
    year_of_visit: year_of_visit || "",
    month_of_visit: "", // Add this
    hours_taught: hours_taught || "",
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async (e) => {
    e.preventDefault();
    const { visitType, institutionName, courses, year_of_visit,month_of_visit, hours_taught } = formData;
    if (!visitType || !institutionName || !courses || !year_of_visit ||!month_of_visit|| !hours_taught) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddVisit) {
      handleAddVisit(formData);
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
    <Card color="transparent" shadow={false} className="w-[90%] max-w-[700px] h-auto p-8 rounded-[20px]">
  <form className="text-white flex flex-col space-y-6" onSubmit={handlepopup}>
    {/* Visit Type Dropdown */}
    <div className="relative z-0 w-full group">
      <label htmlFor="visitType" className="block text-sm">
        Visit Type
      </label>
      <select
        name="visitType"
        id="visitType"
        className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={formData.visitType}
        required
      >
        <option value="">Select Visit Type</option>
        <option value="Visiting">Visiting</option>
        <option value="Adjunct">Adjunct</option>
        <option value="Emeritus">Emeritus</option>
      </select>
    </div>

    {/* Institution Name */}
    <div className="relative z-0 w-full group">
      <label htmlFor="institutionName" className="block text-sm">
        Institution Name
      </label>
      <input
        type="text"
        name="institutionName"
        id="institutionName"
        className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={formData.institutionName}
        required
      />
    </div>

    {/* Courses */}
    <div className="relative z-0 w-full group">
      <label htmlFor="courses" className="block text-sm">
        Courses
      </label>
      <input
        type="text"
        name="courses"
        id="courses"
        className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={formData.courses}
        required
      />
    </div>

    {/* Year and Month of Visit */}
    <div className="flex space-x-4 w-full">
      {/* Year of Visit Dropdown */}
      <div className="relative z-0 w-[48%] group">
        <label htmlFor="year_of_visit" className="block text-sm">
          Year of Visit
        </label>
        <select
          name="year_of_visit"
          id="year_of_visit"
          className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={formData.year_of_visit}
          required
        >
          <option value="">Select Year</option>
          {generateYearOptions()}
        </select>
      </div>

      {/* Month of Visit Dropdown */}
      <div className="relative z-0 w-[48%] group">
        <label htmlFor="month_of_visit" className="block text-sm">
          Month of Visit
        </label>
        <select
          name="month_of_visit"
          id="month_of_visit"
          className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={formData.month_of_visit}
          required
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
    </div>

    {/* Hours Taught */}
    <div className="relative z-0 w-full group">
      <label htmlFor="hours_taught" className="block text-sm">
        Hours Taught
      </label>
      <input
        type="number"
        name="hours_taught"
        id="hours_taught"
        className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={formData.hours_taught}
        required
        min="0"
      />
    </div>

    {/* Buttons */}
    <div className="flex items-center justify-between mt-5 space-x-4">
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {visitType ? "Update Visit" : "Add Visit"}
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
