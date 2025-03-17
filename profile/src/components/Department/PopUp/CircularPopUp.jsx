import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

const CircularPopup = ({ closeModal, saveCircular, circular }) => {
  const [formData, setFormData] = useState({
    circular_number: "",
    circular_name: "",
    subject: "",
    circular_date: "",
    circular_file: null,
  });

  // Pre-fill form with existing data if editing
  useEffect(() => {
    if (circular) {
      setFormData({
        circular_number: circular.circular_number || "",
        circular_name: circular.circular_name || "",
        subject: circular.subject || "",
        circular_date: circular.circular_date || "",
        circular_file: circular.circular_file || null,
      });
    }
  }, [circular]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      circular_file: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure all fields are filled
    if (
      !formData.circular_number ||
      !formData.circular_name ||
      !formData.subject ||
      !formData.circular_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create circular data object
    const newCircular = {
      circular_number: formData.circular_number,
      circular_name: formData.circular_name,
      subject: formData.subject,
      circular_date: formData.circular_date,
      circular_file: formData.circular_file,
    };

    // Call the function to save the circular (either add or edit)
    saveCircular(newCircular);

    // Success toast and close modal
    toast.success("Circular saved successfully!");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] p-8 bg-gray-900 rounded-[20px]"
      >
        <form
          onSubmit={handleSubmit}
          className="text-white flex flex-col space-y-6"
        >
          <div className="relative z-0 w-full group">
            <label htmlFor="circular_number" className="block text-sm">
              Circular Number
            </label>
            <input
              type="text"
              name="circular_number"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.circular_number}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="circular_name" className="block text-sm">
              Title
            </label>
            <input
              type="text"
              name="circular_name"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.circular_name}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="subject" className="block text-sm">
              Description
            </label>
            <input
              type="text"
              name="subject"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.subject}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="circular_date" className="block text-sm">
              Date
            </label>
            <input
              type="date"
              name="circular_date"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.circular_date}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="circular_file" className="block text-sm">
              Upload Document
            </label>
            <input
              type="file"
              name="circular_file"
              accept=".pdf"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center justify-between mt-5">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Circular
            </button>
          </div>
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

export default CircularPopup;
