import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function PatentPopUp({
  patentName = "",
  patentPublish = "",
  inventorsName = "",
  patentAwardDate = null,
  patent_id = "",
  closeModal,
  handleAddPatent,
}) {
  const [formData, setFormData] = useState({
    patentName: patentName || "",
    patentPublish: patentPublish || "",
    inventorsName: inventorsName || "",
    patentAwardDate: patentAwardDate || "",
    patent_id: patent_id || "",
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
    const { patentName, patentPublish, inventorsName, patentAwardDate } =
      formData;

    // Validate required fields
    if (!patentName || !patentPublish || !inventorsName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddPatent) {
      handleAddPatent(formData);
    }
    closeModal();
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
          onSubmit={handlePopupSubmit}
        >
          {/* Patent Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="patentName" className="block text-sm">
              Patent Name
            </label>
            <input
              type="text"
              name="patentName"
              id="patentName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.patentName}
              required
            />
          </div>

          {/* Inventors/Co-Inventors */}
          <div className="relative z-0 w-full group">
            <label htmlFor="inventorsName" className="block text-sm">
              Inventors/Co-Inventors
            </label>
            <input
              type="text"
              name="inventorsName"
              id="inventorsName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.inventorsName}
              required
            />
          </div>

          {/* Publish Date */}
          <div className="relative z-0 w-full group">
            <label htmlFor="patentPublish" className="block text-sm">
              Published Date
            </label>
            <input
              type="date"
              name="patentPublish"
              id="patentPublish"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.patentPublish}
              required
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
              id="patentAwardDate"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.patentAwardDate}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {patent_id ? "Update Record" : "Add Record"}
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
