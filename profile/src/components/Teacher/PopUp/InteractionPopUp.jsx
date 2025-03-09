import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function InteractionPopUp({
  interactionType,
  institutionName,
  description,
  closeModal,
  handleAddVisit,
  year_of_visit,
  month_of_visit,
  duration_in_days,
}) {
  const [formData, setFormData] = useState({
    interactionType: interactionType || "",
    institutionName: institutionName || "",
    description: description || "",
    year_of_visit: year_of_visit || "",
    month_of_visit: month_of_visit || "",
    duration_in_days: duration_in_days || "",
    customInteractionType: "", // For custom interaction types
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopup = async (e) => {
    e.preventDefault();
    const {
      interactionType,
      institutionName,
      description,
      year_of_visit,
      month_of_visit,
      duration_in_days,
      customInteractionType,
    } = formData;

    // Use customInteractionType if "Other" is selected
    const selectedInteractionType =
      interactionType === "Other" ? customInteractionType : interactionType;

    if (
      !selectedInteractionType ||
      !institutionName ||
      !description ||
      !year_of_visit ||
      !month_of_visit
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddVisit) {
      handleAddVisit({
        ...formData,
        interactionType: selectedInteractionType, // Override with custom type if applicable
      });
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
          onSubmit={handlePopup}
        >
          {/* Interaction Type Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="interactionType" className="block text-sm">
              Interaction Type
            </label>
            <select
              name="interactionType"
              id="interactionType"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.interactionType}
              required
            >
              <option value="">Select Interaction Type</option>
              <option value="Lecture/Talk">Lecture/Talk</option>
              <option value="Expert member of any committee">
                Expert member of any committee
              </option>
              <option value="Guest/Chairperson of any event">
                Guest/Chairperson of any event
              </option>
              <option value="Conduction of examination">
                Conduction of examination
              </option>
              <option value="BOS Member">BOS Member</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom Interaction Type Input (Conditional) */}
          {formData.interactionType === "Other" && (
            <div className="relative z-0 w-full group">
              <label htmlFor="customInteractionType" className="block text-sm">
                Specify Interaction Type
              </label>
              <input
                type="text"
                name="customInteractionType"
                id="customInteractionType"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.customInteractionType}
                required={formData.interactionType === "Other"}
              />
            </div>
          )}

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

          {/* Description */}
          <div className="relative z-0 w-full group">
            <label htmlFor="description" className="block text-sm">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.description}
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

          {/* Duration in Days */}
          <div className="relative z-0 w-full group">
            <label htmlFor="duration_in_days" className="block text-sm">
              Duration in Days
            </label>
            <input
              type="number"
              name="duration_in_days"
              id="duration_in_days"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.duration_in_days}
              min="0"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {interactionType ? "Update Interaction" : "Add Interaction"}
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
