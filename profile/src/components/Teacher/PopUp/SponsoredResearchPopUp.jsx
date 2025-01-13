import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function SponsoredResearchPopUp({
  title,
  agency,
  amount,
  duration,
  startDate,
  closeModal,
  handleAddResearch,
}) {
  const [formData, setFormData] = useState({
    title: title || "",
    agency: agency || "",
    amount: amount || "",
    duration: duration || "",
    startDate: startDate || "",
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
    const { title, agency, amount, duration, startDate } = formData;

    if (!title || !agency || !amount || !duration || !startDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddResearch) {
      handleAddResearch(formData);
    }
    closeModal();
  };

  return (
    <Card
      color="transparent"
      shadow={false}
      className="w-[90%] max-w-[700px] h-auto p-8 rounded-[20px]"
    >
      <form
        className="text-white flex flex-col space-y-6"
        onSubmit={handlePopupSubmit}
      >
        {/* Project Title */}
        <div className="relative z-0 w-full group">
          <label htmlFor="title" className="block text-sm">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.title}
            required
          />
        </div>

        {/* Funding Agency */}
        <div className="relative z-0 w-full group">
          <label htmlFor="agency" className="block text-sm">
            Funding Agency
          </label>
          <input
            type="text"
            name="agency"
            id="agency"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.agency}
            required
          />
        </div>

        {/* Amount Sponsored */}
        <div className="relative z-0 w-full group">
          <label htmlFor="amount" className="block text-sm">
            Amount Sponsored
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.amount}
            required
            min="0"
          />
        </div>

        {/* Research Duration */}
        <div className="relative z-0 w-full group">
          <label htmlFor="duration" className="block text-sm">
            Research Duration (Years)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.duration}
            required
            min="1"
          />
        </div>

        {/* Start Date */}
        <div className="relative z-0 w-full group">
          <label htmlFor="startDate" className="block text-sm">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.startDate}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-5 space-x-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {title ? "Update Research" : "Add Research"}
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