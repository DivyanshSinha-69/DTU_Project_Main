import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function DepartmentOfficeOrdersPopUp({
  order,
  closeModal,
  handleAddOrUpdateOrder,
  facultyMapping,
}) {
  const user = useSelector((state) => state.auth.user) || {};
  const { department_id } = user || {};

  const [formData, setFormData] = useState({
    order_number: order?.order_number || "",
    order_name: order?.order_name || "",
    department_id: department_id || "",
    subject: order?.subject || "",
    faculties: order?.faculty_ids || [],
    undersigned: order?.undersigned || "",
    order_date: order?.order_date?.split("T")[0] || "",
    start_date: order?.start_date?.split("T")[0] || "",
    end_date: order?.end_date?.split("T")[0],
    document: order?.document || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_date" || name === "end_date") {
      const newFormData = {
        ...formData,
        [name]: value,
      };

      // Check if both dates are set and start_date is after end_date
      if (
        newFormData.start_date &&
        newFormData?.end_date &&
        new Date(newFormData.start_date) > new Date(newFormData?.end_date)
      ) {
        toast.error("Start date must be before end date");
        return; // Don't update the state if validation fails
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        document: file,
      }));
    }
  };

  const handleFacultySelection = (facultyId) => {
    setFormData((prevData) => {
      const updatedFaculties = prevData.faculties.includes(facultyId)
        ? prevData.faculties.filter((id) => id !== facultyId)
        : [...prevData.faculties, facultyId];
      return {
        ...prevData,
        faculties: updatedFaculties,
      };
    });
  };

  const handleSelectAllFaculties = (e) => {
    if (e.target.checked) {
      setFormData((prevData) => ({
        ...prevData,
        faculties: Object.keys(facultyMapping),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        faculties: [],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.order_number ||
      !formData.order_name ||
      !formData.department_id ||
      !formData.subject ||
      !formData.undersigned ||
      !formData.order_date ||
      !formData.start_date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if end_date exists and if start_date is before end_date
    if (
      formData.end_date &&
      new Date(formData.start_date) > new Date(formData.end_date)
    ) {
      toast.error("Start date must be before end date");
      return;
    }

    // Prepare the data to be sent
    const dataToSend = {
      ...formData,
      faculty_ids: formData.faculties,
    };

    // Remove end_date if it's empty
    if (!formData.end_date) {
      delete dataToSend.end_date;
    }

    if (handleAddOrUpdateOrder) {
      handleAddOrUpdateOrder(dataToSend);
      console.log("form data", dataToSend);
    }

    closeModal();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 p-4">
      <Card
        color="transparent"
        shadow={false}
        className="w-full max-w-[700px] h-[90vh] overflow-y-auto p-8 bg-gray-900 rounded-[20px]"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Order Number */}
          <div className="relative z-0 w-full group">
            <label htmlFor="order_number" className="block text-sm">
              Order Number
            </label>
            <input
              type="text"
              name="order_number"
              id="order_number"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.order_number}
              required
            />
          </div>

          {/* Order Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="subject" className="block text-sm">
              Order Name
            </label>
            <input
              type="text"
              name="order_name"
              id="order_name"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.order_name}
              required
            />
          </div>
          {/* Subject */}
          <div className="relative z-0 w-full group">
            <label htmlFor="subject" className="block text-sm">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.subject}
              required
            />
          </div>

          {/* Faculties Selection */}
          <div className="relative z-0 w-full group">
            <label htmlFor="faculties" className="block text-sm">
              Select Faculties
            </label>
            <div className="mt-2">
              {/* Select All Checkbox */}
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={
                    formData.faculties.length ===
                    Object.keys(facultyMapping).length
                  }
                  onChange={handleSelectAllFaculties}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>Select All</span>
              </label>

              {/* Scrollable Faculties List */}
              <div className="h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-800">
                {Object.entries(facultyMapping).map(
                  ([facultyId, facultyName]) => (
                    <label
                      key={facultyId}
                      className="flex items-center space-x-2 p-1 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={formData.faculties.includes(facultyId)}
                        onChange={() => handleFacultySelection(facultyId)}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span className="text-sm">{facultyName}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Undersigned */}
          <div className="relative z-0 w-full group">
            <label htmlFor="undersigned" className="block text-sm">
              Undersigned
            </label>
            <input
              type="text"
              name="undersigned"
              id="undersigned"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.undersigned}
              required
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="order_date" className="block text-sm">
                Order Date
              </label>
              <input
                type="date"
                name="order_date"
                id="order_date"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.order_date}
                required
              />
            </div>

            {/* Start Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="start_date" className="block text-sm">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.start_date}
                required
              />
            </div>

            {/* End Date */}
            <div className="relative z-0 w-full group">
              <label htmlFor="end_date" className="block text-sm">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.end_date}
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="relative z-0 w-full group">
            <label htmlFor="document" className="block text-sm">
              Upload Document
            </label>
            <input
              type="file"
              name="document"
              id="document"
              accept=".pdf"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {order ? "Update Order" : "Add Order"}
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
