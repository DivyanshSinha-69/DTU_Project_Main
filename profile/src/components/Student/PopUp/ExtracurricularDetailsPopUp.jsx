import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function ExtracurricularActivityPopUp({
  closeModal,
  handleAddActivity,
  organizer,
  event_name,
  event_type,
  event,
  event_date,
  position,
  description,
  document,
}) {
  const [formData, setFormData] = useState({
    organizer: organizer || "",
    event_name: event_name || "",
    event_type: event_type || "",
    event: event || "",
    event_date: event_date || "",
    position: position || "",
    description: description || "",
    document: document || "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.organizer ||
      !formData.event_name ||
      !formData.event_type ||
      !formData.event ||
      !formData.event_date ||
      !formData.position ||
      (!file && !document)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    handleAddActivity(formData, file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] max-h-[90vh] bg-gray-900 rounded-[20px] overflow-hidden flex flex-col"
      >
        <div className="overflow-y-auto flex-1 p-6">
          <form
            onSubmit={handleSubmit}
            className="text-white flex flex-col space-y-6"
          >
            {/* Organizer */}
            <div className="relative z-0 w-full group">
              <label htmlFor="organizer" className="block text-sm">
                Organizer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organizer"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.organizer}
              />
            </div>

            {/* Event Name */}
            <div className="relative z-0 w-full group">
              <label htmlFor="event_name" className="block text-sm">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="event_name"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.event_name}
              />
            </div>

            {/* Event Type */}
            <div className="relative z-0 w-full group">
              <label htmlFor="event_type" className="block text-sm">
                Event Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="event_type"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.event_type}
              />
            </div>

            {/* Event Scope */}
            <div className="relative z-0 w-full group">
              <label htmlFor="event" className="block text-sm">
                Event Scope <span className="text-red-500">*</span>
              </label>
              <select
                name="event"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.event}
              >
                <option value="">Select Scope</option>
                <option value="Inter">Inter</option>
                <option value="Intra">Intra</option>
              </select>
            </div>

            {/* Event Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="event_date" className="block text-sm">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="event_date"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.event_date}
              />
            </div>

            {/* Position */}
            <div className="relative z-0 w-full group">
              <label htmlFor="position" className="block text-sm">
                Position <span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.position}
              >
                <option value="">Select Position</option>
                <option value="1st Position">1st Position</option>
                <option value="2nd Position">2nd Position</option>
                <option value="3rd Position">3rd Position</option>
                <option value="Participated">Participated</option>
              </select>
            </div>

            {/* Description */}
            <div className="relative z-0 w-full group">
              <label htmlFor="description" className="block text-sm">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            {/* Document Upload */}
            <div className="relative z-0 w-full group">
              <label htmlFor="document" className="block text-sm">
                Upload Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="document"
                accept=".pdf"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!document}
                onChange={handleFileChange}
              />
              {document && !file && (
                <a
                  href={document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 underline mt-1 block"
                >
                  Current file: {document.split("/").pop()}
                </a>
              )}
            </div>

            <p className="text-sm text-gray-400">
              <span className="text-red-500">*</span> compulsory fields
            </p>

            <div className="flex items-center justify-between mt-5 space-x-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
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
        </div>
      </Card>
    </div>
  );
}
