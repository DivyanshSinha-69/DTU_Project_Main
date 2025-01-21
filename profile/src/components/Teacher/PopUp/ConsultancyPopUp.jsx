import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function ConsultancyDetailsPopUp({
  title,
  client,
  amount,
  duration,
  startDate,
  closeModal,
  handleAddConsultancy,
}) {
  const [formData, setFormData] = useState({
    title: title || "",
    client: client || "",
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

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    const { title, client, amount, duration, startDate } = formData;

    if (!title || !client || !amount || !duration || !startDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddConsultancy) {
      handleAddConsultancy(formData);
    }
    closeModal();
  };

  return (
    <Card color="transparent" shadow={false} className="w-[90%] max-w-[700px] h-auto p-8 rounded-[20px]">
      <form className="text-white flex flex-col space-y-6" onSubmit={handlePopupSubmit}>
        {/* Consultancy Title */}
        <div className="relative z-0 w-full group">
          <label htmlFor="title" className="block text-sm">
            Consultancy Title
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
            Client Name
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
            Amount Charged (in INR)
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

        {/* Consultancy Duration */}
        <div className="relative z-0 w-full group">
          <label htmlFor="duration" className="block text-sm">
            Consultancy Duration (Years)
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
  );
}
