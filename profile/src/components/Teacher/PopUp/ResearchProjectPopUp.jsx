import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function ResearchProjectPopup({
  closeModal,
  saveProject,
  project,
}) {
  const [formData, setFormData] = useState({
    title: "",
    typeOfPaper: "Conference",
    domain: "AI",
    publicationName: "",
    publishedDate: "",
    document: null,
    citation: "", // Add this line
  });

  const domainOptions = [
    "Signal Processing",
    "Artificial Intelligence",
    "Optical, Wireless and Mobile Communication",
    "Machine Learning",
    "Radio Frequency and Microwave",
    "Cybersecurity",
    "Blockchain",
    "IoT",
  ];

  const formatDateForInput = (date) => {
    const [date1, time] = date?.split("T");

    const [day, month, year] = date1.split("-");
    return `${day}-${month}-${year}`; // yyyy-MM-dd
  };
  // Pre-fill form with existing data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.Title || "",
        typeOfPaper: project.TypeOfPaper || "Conference",
        domain: project.Domain || "AI",
        publicationName: project.PublicationName || "",
        publishedDate: formatDateForInput(project.PublishedDate) || "",
        document: project.Document || null,
        citation: project.Citation || "", // Add this line
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure all fields are filled
    if (
      !formData.title ||
      !formData.typeOfPaper ||
      !formData.domain ||
      !formData.publicationName ||
      !formData.publishedDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create project data object
    const newProject = {
      Title: formData.title,
      TypeOfPaper: formData.typeOfPaper,
      Domain: formData.domain,
      PublicationName: formData.publicationName,
      PublishedDate: formData.publishedDate,
      Document: formData.document,
      Citation: formData.citation, // Add this line
    };

    // Call the function to save the project (either add or edit)
    saveProject(newProject);

    // Success toast and close modal
    toast.success("Research project saved successfully!");
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
            <label htmlFor="title" className="block text-sm">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="typeOfPaper" className="block text-sm">
              Type of Paper
            </label>
            <select
              name="typeOfPaper"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.typeOfPaper}
            >
              <option value="Conference">Conference</option>
              <option value="Journal">Journal</option>
              <option value="Book Chapter">Book Chapter</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="domain" className="block text-sm">
              Domain
            </label>
            <select
              name="domain"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.domain}
            >
              {domainOptions.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="publicationName" className="block text-sm">
              Publication Name
            </label>
            <input
              type="text"
              name="publicationName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.publicationName}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="publishedDate" className="block text-sm">
              Published Date
            </label>
            <input
              type="date"
              name="publishedDate"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.publishedDate}
            />
          </div>
          <div className="flex gap-4">
            {" "}
            {/* Add this flex container */}
            <div className="relative z-0 w-1/2 group">
              {" "}
              {/* Citation field */}
              <label htmlFor="citation" className="block text-sm">
                Citation
              </label>
              <input
                type="text"
                name="citation"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
                onChange={handleChange}
                value={formData.citation}
              />
            </div>
            <div className="relative z-0 w-1/2 group">
              {" "}
              {/* Upload Document field */}
              <label htmlFor="document" className="block text-sm">
                Upload Document
              </label>
              <input
                type="file"
                name="document"
                accept=".pdf,.docx"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Project
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
}
