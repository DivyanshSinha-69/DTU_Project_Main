import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

const AssociationPopUp = ({ currentDetails, onUpdate, closeModal }) => {
  const [formData, setFormData] = useState(currentDetails);

  useEffect(() => {
    setFormData(currentDetails);
  }, [currentDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedData = { ...formData };

    // Ensure only relevant fields are included
    if (updatedData.highestDesignation !== "Professor") {
      updatedData.associateProfessorStartDate = null;
      updatedData.associateProfessorEndDate = null;
    }

    if (
      updatedData.highestDesignation !== "Professor" &&
      updatedData.highestDesignation !== "Associate Professor"
    ) {
      updatedData.assistantProfessorStartDate = null;
      updatedData.assistantProfessorEndDate = null;
    }

    console.log("🚀 Cleaned Payload Before Sending:", updatedData);

    if (
      !updatedData.highestDesignation ||
      !updatedData.highestDesignationDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onUpdate(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto p-8 bg-gray-900 rounded-[20px]"
      >
        <form
          className="text-white flex flex-col space-y-6 "
          onSubmit={handleSubmit}
        >
          <div className="relative z-0 w-full group">
            <label htmlFor="highestDesignation" className="block text-sm">
              Highest Designation
            </label>
            <select
              name="highestDesignation"
              id="highestDesignation"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.highestDesignation}
              required
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="highestDesignationDate" className="block text-sm">
              Date Attained
            </label>
            <input
              type="date"
              name="highestDesignationDate"
              id="highestDesignationDate"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.highestDesignationDate}
              required
            />
          </div>

          {formData.highestDesignation === "Professor" && (
            <>
              <div className="relative z-0 w-full group">
                <label
                  htmlFor="associateProfessorStartDate"
                  className="block text-sm"
                >
                  Start Date of Associate Professor
                </label>
                <input
                  type="date"
                  name="associateProfessorStartDate"
                  id="associateProfessorStartDate"
                  className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.associateProfessorStartDate}
                  required
                />
              </div>

              <div className="relative z-0 w-full group">
                <label
                  htmlFor="associateProfessorEndDate"
                  className="block text-sm"
                >
                  End Date of Associate Professor
                </label>
                <input
                  type="date"
                  name="associateProfessorEndDate"
                  id="associateProfessorEndDate"
                  className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.associateProfessorEndDate}
                  required
                />
              </div>
            </>
          )}

          {(formData.highestDesignation === "Professor" ||
            formData.highestDesignation === "Associate Professor") && (
            <>
              <div className="relative z-0 w-full group">
                <label
                  htmlFor="assistantProfessorStartDate"
                  className="block text-sm"
                >
                  Start Date of Assistant Professor
                </label>
                <input
                  type="date"
                  name="assistantProfessorStartDate"
                  id="assistantProfessorStartDate"
                  className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.assistantProfessorStartDate}
                  required
                />
              </div>

              <div className="relative z-0 w-full group">
                <label
                  htmlFor="assistantProfessorEndDate"
                  className="block text-sm"
                >
                  End Date of Assistant Professor
                </label>
                <input
                  type="date"
                  name="assistantProfessorEndDate"
                  id="assistantProfessorEndDate"
                  className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.assistantProfessorEndDate}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4"
          >
            Cancel
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AssociationPopUp;
