import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function ResearchProjectPopup({ closeModal, saveProject, project }) {
  const [formData, setFormData] = useState({
    title: "",
    serialNo: "",
    domain: "",
    publicationName: "",
    publishedDate: "",
    publishedLink: "",
  });

  // Pre-fill form with existing data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.Title || "",
        serialNo: project.SerialNo || "",
        domain: project.Domain || "",
        publicationName: project.PublicationName || "",
        publishedDate: project.PublishedDate || "",
        publishedLink: project.PublishedLink || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation: Ensure all fields are filled
    if (
      !formData.title ||
      !formData.serialNo ||
      !formData.domain ||
      !formData.publicationName ||
      !formData.publishedDate ||
      !formData.publishedLink
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create project data object
    const newProject = {
      SerialNo: formData.serialNo,
      Title: formData.title,
      Domain: formData.domain,
      PublicationName: formData.publicationName,
      PublishedDate: formData.publishedDate,
      PublishedLink: formData.publishedLink,
    };

    // Call the function to save the project (either add or edit)
    saveProject(newProject);

    // Success toast and close modal
    toast.success("Research project saved successfully!");
    closeModal();
  };

  return (
    <Card color="transparent" shadow={false} className="w-[auto] p-5">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto text-white">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="title"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.title}
          />
          <label
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Title
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="serialNo"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.serialNo}
          />
          <label
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Serial Number
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="domain"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.domain}
          />
          <label
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Domain
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="publicationName"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.publicationName}
          />
          <label
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Publication Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            name="publishedDate"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
            onChange={handleChange}
            value={formData.publishedDate}
          />
          <label
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Published Date
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
        <label htmlFor="contactNo" className="block text-sm">
            Published Link
          </label>
          <input
            type="url"
            name="publishedLink"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.publishedLink}
          />
          
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Save Project
          </button>
        </div>
      </form>
    </Card>
  );
}
