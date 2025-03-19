import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function ConsultancyDetailsPopUp({
  title,
  client,
  amount,
  startDate,
  endDate,
  closeModal,
  handleAddConsultancy,
}) {
  const [formData, setFormData] = useState({
    title: title || "",
    client: client || "",
    amount: amount || "",
    startDate: startDate || "",
    endDate: endDate || "",
    document: null, // Added document field
    status: "Ongoing", // Added status field with default value
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
    const { title, client, amount, startDate, document, status } = formData;

    if (!title || !client || !amount || !startDate || !document || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddConsultancy) {
      handleAddConsultancy(formData);
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
          {/* Consultancy Title */}
          <div className="relative z-0 w-full group">
            <label htmlFor="title" className="block text-sm">
              Consultancy Title <span className="text-red-500">*</span>
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

          {/* Client Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="client" className="block text-sm">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client"
              id="client"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.client}
              required
            />
          </div>

          {/* Amount Charged */}
          <div className="relative z-0 w-full group">
            <label htmlFor="amount" className="block text-sm">
              Amount Charged (in INR) <span className="text-red-500">*</span>
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

          {/* Status */}
          <div className="relative z-0 w-full group">
            <label htmlFor="status" className="block text-sm">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              id="status"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.status}
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
          </div>

          {/* Document Upload */}
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
              {title ? "Update Consultancy" : "Add Consultancy"}
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
