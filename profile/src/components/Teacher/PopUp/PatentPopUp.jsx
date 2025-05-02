import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PatentPopUp({
  closeModal,
  handleAddPatent,
  patentName = "",
  patentNumber = "",
  patentPublish = "",
  inventorsName = "",
  patentAwardDate = "",
  patentAwardingAgency = "",
  document = null,
  patent_id = "",
}) {
  const [formData, setFormData] = useState({
    patentName: "",
    patentNumber: "",
    patentPublish: "",
    inventorsName: "",
    patentAwardDate: "",
    patentAwardingAgency: "",
    document: null,
  });

  // Pre-fill form with existing data if editing
  useEffect(() => {
    setFormData({
      patentName: patentName || "",
      patentNumber: patentNumber || "",
      patentPublish: patentPublish || "",
      inventorsName: inventorsName || "",
      patentAwardDate: patentAwardDate || "",
      patentAwardingAgency: patentAwardingAgency || "",
      document: document || null,
    });
  }, [
    patentName,
    patentNumber,
    patentPublish,
    inventorsName,
    patentAwardDate,
    patentAwardingAgency,
    document,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, document: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patentName ||
      !formData.patentNumber ||
      !formData.patentPublish ||
      !formData.inventorsName ||
      !formData.patentAwardingAgency ||
      !formData.document
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const patentData = {
      patentName: formData.patentName,
      patentNumber: formData.patentNumber,
      patentPublish: formData.patentPublish,
      inventorsName: formData.inventorsName,
      patentAwardingAgency: formData.patentAwardingAgency,
      document: formData.document,
      patent_id: patent_id || null,
    };

    // Only add patentAwardDate if it has a value
    if (formData.patentAwardDate) {
      patentData.patentAwardDate = formData.patentAwardDate;
    }
    handleAddPatent(patentData);
    closeModal();
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
            {/* Patent Number */}
            <div className="relative z-0 w-full group">
              <label htmlFor="patentNumber" className="block text-sm">
                Patent Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patentNumber"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.patentNumber}
              />
            </div>

            {/* Patent Name */}
            <div className="relative z-0 w-full group">
              <label htmlFor="patentName" className="block text-sm">
                Patent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patentName"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.patentName}
              />
            </div>

            {/* Inventors/Co-Inventors */}
            <div className="relative z-0 w-full group">
              <label htmlFor="inventorsName" className="block text-sm">
                Inventors/Co-Inventors <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="inventorsName"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.inventorsName}
              />
            </div>

            {/* Publish Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="patentPublish" className="block text-sm">
                Published Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="patentPublish"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.patentPublish}
              />
            </div>

            {/* Award Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="patentAwardDate" className="block text-sm">
                Award Date (Optional)
              </label>
              <input
                type="date"
                name="patentAwardDate"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.patentAwardDate}
              />
            </div>

            {/* Awarding Agency */}
            <div className="relative z-0 w-full group">
              <label htmlFor="patentAwardingAgency" className="block text-sm">
                Awarding Agency <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="patentAwardingAgency"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.patentAwardingAgency}
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
                required
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
              />
            </div>

            <p className="text-sm text-gray-400">
              <span className="text-red-500">*</span> compulsory fields
            </p>

            <div className="flex items-center justify-between mt-5 space-x-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {patent_id ? "Update Patent" : "Add Patent"}
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
