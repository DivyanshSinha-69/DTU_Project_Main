import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function SponsoredResearchPopUp({
  title,
  agency,
  amount,
  stat,
  startDate,
  endDate,
  closeModal,
  handleAddResearch,
}) {
  const [formData, setFormData] = useState({
    title: title || "",
    agency: agency || "",
    amount: amount || "",
    startDate: startDate || "",
    endDate: endDate || "",
    document: null,
    stat: stat || "Ongoing", // Default to "Ongoing"
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
    const { title, agency, amount, duration, startDate, document, stat } =
      formData;

    if (!title || !agency || !amount || !startDate || !document || !stat) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddResearch) {
      handleAddResearch(formData);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 overflow-y-auto p-4">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto max-h-[90vh] p-8 bg-gray-900 rounded-[20px] overflow-y-auto"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handlePopupSubmit}
        >
          {/* Title */}
          <div className="relative z-0 w-full group">
            <label htmlFor="title" className="block text-sm">
              Research Title <span className="text-red-500">*</span>
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
              Funding Agency <span className="text-red-500">*</span>
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
              Amount Sponsored <span className="text-red-500">*</span>
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
          <div className="relative z-0 w-full group">
            <label htmlFor="stat" className="block text-sm">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="stat"
              id="stat"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.stat}
              required
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Start Date & End Date */}
          <div className="flex space-x-4">
            {/* Start Date */}
            <div className="relative z-0 w-1/2 group">
              <label htmlFor="startDate" className="block text-sm">
                Start Date <span className="text-red-500">*</span>
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

            {/* End Date */}
            <div className="relative z-0 w-1/2 group">
              <label htmlFor="endDate" className="block text-sm">
                End Date (optional)
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.endDate}
              />
            </div>
            <div className="relative z-0 w-full group">
              <label htmlFor="document" className="block text-sm">
                Upload Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="document"
                id="document"
                accept=".pdf,.docx"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData((prevData) => ({
                    ...prevData,
                    document: file,
                  }));
                }}
                required
              />
            </div>
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
    </div>
  );
}
