import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function BookPopUp({
  isbn = "",
  book_title = "",
  chapter_title = "",
  publication_name = "",
  published_date = "",
  affiliated = "No", // Default to "No"
  link_doi = "",
  book_chapter = "book",
  Book_id = "",
  closeModal,
  handleAddBook,
}) {
  const [formData, setFormData] = useState({
    isbn,
    book_title,
    chapter_title,
    publication_name,
    published_date,
    affiliated,
    link_doi,
    book_chapter,
    Book_id,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Yes" : "No") : value,
    }));
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    const { isbn, book_title, publication_name, published_date, book_chapter } =
      formData;

    // Validate required fields based on book/chapter type
    if (!isbn || !publication_name || !published_date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (handleAddBook) {
      console.log("Form Data:", formData);
      handleAddBook(formData);
    }
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
          {/* Book/Chapter Type */}
          <div className="relative z-0 w-full group">
            <label className="block text-sm mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="book_chapter"
                  value="book"
                  checked={formData.book_chapter === "book"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Book</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="book_chapter"
                  value="chapter"
                  checked={formData.book_chapter === "chapter"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Chapter</span>
              </label>
            </div>
          </div>

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
            <label htmlFor="book_title" className="block text-sm">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="book_title"
              id="book_title"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.book_title}
              required
            />
          </div>

          {/* Chapter Title (conditionally shown) */}
          {formData.book_chapter === "chapter" && (
            <div className="relative z-0 w-full group">
              <label htmlFor="chapter_title" className="block text-sm">
                Chapter Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="chapter_title"
                id="chapter_title"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.chapter_title}
                required={formData.book_chapter === "chapter"}
              />
            </div>
          )}

          {/* Publication Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="publication_name" className="block text-sm">
              Publication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="publication_name"
              id="publication_name"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.publication_name}
              required
            />
          </div>

          {/* Published Date */}
          <div className="relative z-0 w-full group">
            <label htmlFor="published_date" className="block text-sm">
              Published Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="published_date"
              id="published_date"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.published_date}
              required
            />
          </div>

          {/* Affiliated to DTU */}
          <div className="relative z-0 w-full group">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="affiliated"
                checked={formData.affiliated === "Yes"} // Check based on "Yes"/"No"
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Affiliated to DTU when published</span>
            </label>
          </div>

          {/* Link/DOI */}
          <div className="relative z-0 w-full group">
            <label htmlFor="link_doi" className="block text-sm">
              Link/DOI
            </label>
            <input
              type="url"
              name="link_doi"
              id="link_doi"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.link_doi}
              placeholder="https://example.com or DOI number"
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
              {Book_id ? "Update Record" : "Add Record"}
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
