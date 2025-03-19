import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function BookPopUp({
  isbn,
  title,
  publication,
  publishedDate,
  Book_id,
  closeModal,
  handleAddBook,
}) {
  const [formData, setFormData] = useState({
    isbn: isbn || "",
    title: title || "",
    publication: publication || "",
    publishedDate: publishedDate || "",
    Book_id: Book_id || "",
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
    const { isbn, title, publication, publishedDate } = formData;

    if (!isbn || !title || !publication || !publishedDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddBook) {
      handleAddBook(formData);
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
          {/* ISBN No */}
          <div className="relative z-0 w-full group">
            <label htmlFor="isbn" className="block text-sm">
              ISBN No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="isbn"
              id="isbn"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.isbn}
              required
            />
          </div>

          {/* Book Title */}
          <div className="relative z-0 w-full group">
            <label htmlFor="title" className="block text-sm">
              Book Title <span className="text-red-500">*</span>
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

          {/* Publication Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="publication" className="block text-sm">
              Publication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="publication"
              id="publication"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.publication}
              required
            />
          </div>

          {/* Published Date */}
          <div className="relative z-0 w-full group">
            <label htmlFor="publishedDate" className="block text-sm">
              Published Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="publishedDate"
              id="publishedDate"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.publishedDate}
              required
            />
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
              {isbn ? "Update Record" : "Add Record"}
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
