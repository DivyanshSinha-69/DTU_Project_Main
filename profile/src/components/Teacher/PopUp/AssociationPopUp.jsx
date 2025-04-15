import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

const AssociationPopUp = ({
  highestDesignation,
  highestDesignationDate,
  associateProfessorStartDate,
  associateProfessorEndDate,
  assistantProfessorStartDate,
  assistantProfessorEndDate,
  onUpdate,
  closeModal,
}) => {
  const [formData, setFormData] = useState({
    highestDesignation: highestDesignation || "",
    highestDesignationDate: highestDesignationDate || "",
    associateProfessorStartDate: associateProfessorStartDate || "",
    associateProfessorEndDate: associateProfessorEndDate || "",
    assistantProfessorStartDate: assistantProfessorStartDate || "",
    assistantProfessorEndDate: assistantProfessorEndDate || "",
  });

  useEffect(() => {
    setFormData({
      highestDesignation: highestDesignation || "",
      highestDesignationDate: highestDesignationDate || "",
      associateProfessorStartDate: associateProfessorStartDate || "",
      associateProfessorEndDate: associateProfessorEndDate || "",
      assistantProfessorStartDate: assistantProfessorStartDate || "",
      assistantProfessorEndDate: assistantProfessorEndDate || "",
    });
  }, [
    highestDesignation,
    highestDesignationDate,
    associateProfessorStartDate,
    associateProfessorEndDate,
    assistantProfessorStartDate,
    assistantProfessorEndDate,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    console.log("formData", formData);
    e.preventDefault();
    let updatedData = { ...formData };

    if (updatedData.highestDesignation === "Assistant Professor") {
      updatedData.associateProfessorStartDate = "";
      updatedData.associateProfessorEndDate = "";
      updatedData.assistantProfessorEndDate = "";
    }

    if (
      updatedData.highestDesignation !== "Professor" &&
      updatedData.highestDesignation !== "Associate Professor"
    ) {
      updatedData.assistantProfessorEndDate = "";
    }

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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 overflow-y-auto p-4">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto max-h-[90vh] p-8 bg-gray-900 rounded-[20px] overflow-y-auto"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Highest Designation Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="highestDesignation" className="block text-sm">
              Highest Designation <span className="text-red-500">*</span>
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

          {/* Date Attained Field */}
          <div className="relative z-0 w-full group">
            <label htmlFor="highestDesignationDate" className="block text-sm">
              Date Attained <span className="text-red-500">*</span>
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

          {/* Conditional Fields for Professor */}
          {formData.highestDesignation === "Professor" && (
            <>
              <div className="relative z-0 w-full group">
                <label
                  htmlFor="associateProfessorStartDate"
                  className="block text-sm"
                >
                  Start Date of Associate Professor{" "}
                  <span className="text-red-500">*</span>
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
                  End Date of Associate Professor{" "}
                  <span className="text-red-500">*</span>
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

          {/* Conditional Fields for Professor or Associate Professor */}
          {(formData.highestDesignation === "Professor" ||
            formData.highestDesignation === "Associate Professor") && (
            <>
              <div className="relative z-0 w-full group">
                <label
                  htmlFor="assistantProfessorStartDate"
                  className="block text-sm"
                >
                  Start Date of Assistant Professor{" "}
                  <span className="text-red-500">*</span>
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
                  End Date of Assistant Professor{" "}
                  <span className="text-red-500">*</span>
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
          {/* Red Star Explanation */}
          <p className="text-sm text-gray-400 mt-4">
            <span className="text-red-500">*</span> compulsory fields
          </p>
          {/* Update Button */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>

            {/* Cancel Button */}
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
};

export default AssociationPopUp;
