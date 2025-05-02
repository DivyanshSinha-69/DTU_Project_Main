import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function FacultyDevelopmentPopUp({
  programName,
  type,
  startDate,
  endDate,
  organizingInstitute,
  document,
  closeModal,
  handleAddFDP,
}) {
  const [formData, setFormData] = useState({
    programName: programName || "",
    type: type || "Conducted",
    startDate: startDate || "",
    endDate: endDate || "",
    organizingInstitute: organizingInstitute || "",
    documentFile: null,
  });

  const [fileName, setFileName] = useState(document ? "Uploaded" : "");

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
      setFormData((prev) => ({ ...prev, documentFile: file }));
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, documentFile: null }));
    setFileName("");
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const {
      programName,
      type,
      startDate,
      endDate,
      organizingInstitute,
      documentFile,
    } = formData;

    if (
      !programName ||
      !type ||
      !startDate ||
      !endDate ||
      !organizingInstitute ||
      !documentFile
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddFDP) {
      handleAddFDP({
        programName,
        type,
        startDate,
        endDate,
        organizingInstitute,
        document: documentFile,
      });
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
          {/* Program Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="programName" className="block text-sm">
              Title of Faculty Development/Training Activities{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="programName"
              id="programName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.programName}
              required
            />
          </div>

          {/* Type Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="type" className="block text-sm">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              id="type"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.type}
              required
            >
              <option value="Conducted">Conducted</option>
              <option value="Participated">Participated</option>
            </select>
          </div>

          {/* Organizing Institute */}
          <div className="relative z-0 w-full group">
            <label htmlFor="organizingInstitute" className="block text-sm">
              Organizing Institute <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="organizingInstitute"
              id="organizingInstitute"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.organizingInstitute}
              required
            />
          </div>

          {/* Start Date */}
          <div className="relative z-0 w-full group">
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
          <div className="relative z-0 w-full group">
            <label htmlFor="endDate" className="block text-sm">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.endDate}
              required
            />
          </div>

          {/* Proof Document */}
          <div className="relative z-0 w-full group">
            <label htmlFor="document" className="block text-sm">
              Proof Document <span className="text-red-500">*</span>
            </label>
            {fileName ? (
              <div className="flex items-center justify-between bg-gray-800 border border-gray-300 rounded-lg p-3">
                <span className="text-sm truncate">{fileName}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-400 ml-2 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                name="document"
                id="document"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
                required
              />
            )}
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
              {programName ? "Update Program" : "Add Program"}
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
