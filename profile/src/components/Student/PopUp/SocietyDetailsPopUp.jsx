import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function SocietyDetailsPopUp({
  closeModal,
  handleAddSociety,
  type,
  name,
  role,
  document,
}) {
  const [formData, setFormData] = useState({
    type: type || "",
    name: name || "",
    role: role || "",
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
      !formData.type ||
      !formData.name ||
      !formData.role ||
      (!file && !document)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    handleAddSociety(formData, file);
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
            {/* Society Type */}
            <div className="relative z-0 w-full group">
              <label htmlFor="type" className="block text-sm">
                Society Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.type}
              >
                <option value="">Select Type</option>
                <option value="Professional">Professional</option>
                <option value="Intra-College">Intra-College</option>
              </select>
            </div>

            {/* Society Name */}
            <div className="relative z-0 w-full group">
              <label htmlFor="name" className="block text-sm">
                Society Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            {/* Role */}
            <div className="relative z-0 w-full group">
              <label htmlFor="role" className="block text-sm">
                Your Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.role}
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
                <p className="text-xs text-gray-400 mt-1">
                  Current file: {document.split("/").pop()}
                </p>
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
