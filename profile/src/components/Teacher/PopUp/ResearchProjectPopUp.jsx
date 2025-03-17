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
    areaOfResearch: "",
    publishedYear: "",
    document: null,
    citation: "",
    authors: "",
    pdf: null,
  });

  const [showOtherInput, setShowOtherInput] = useState(false); // State to toggle "Other" input field

  const specializationOptions = [
    "Image processing",
    "Signal processing",
    "Soft computing",
    "Artificial intelligence",
    "Computer vision",
    "Wireless Technology",
    "Analog electronics",
    "Microelectronics",
    "Digital electronics",
    "VLSI design",
    "Applied electronics",
    "Machine learning",
    "Embedded systems",
    "Robotics",
    "Analog design",
    "Digital design",
    "Analog integrated circuits",
    "Microwave Engineering",
    "Digital signal processing",
    "Organic electronics",
    "Device modeling",
    "Electronics & Communication",
    "Digital communication",
    "Nanophotonics/Plasmonics",
    "Optical communication",
    "Sensors",
    "Spintronics",
    "Semiconductor devices",
    "Reinforcement learning",
    "Block chain/Distributed systems",
    "Deep learning",
    "Nanotechnology",
    "Biomedical Image & Signal processing",
    "Automation/Control Systems",
  ].sort((a, b) => a.localeCompare(b)); // Sort alphabetically

  // Pre-fill form with existing data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.Title || "",
        typeOfPaper: project.TypeOfPaper || "Conference",
        areaOfResearch: project.AreaOfResearch || "",
        publishedYear: project.PublishedYear || "",
        document: project.Document || null,
        citation: project.Citation || "",
        authors: project.Authors || "",
        pdf: formData.pdf,
      });

      // Check if the area of research is "Other"
      if (!specializationOptions.includes(project.AreaOfResearch)) {
        setShowOtherInput(true);
      }
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Handle "Other" selection in Area of Research
    if (name === "areaOfResearch" && value === "Other") {
      setShowOtherInput(true);
    } else if (name === "areaOfResearch") {
      setShowOtherInput(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      document: file, // Store the file for display purposes
      pdf: file, // Store the file for API upload
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure all fields are filled
    if (
      !formData.title ||
      !formData.typeOfPaper ||
      !formData.areaOfResearch ||
      !formData.publishedYear
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create project data object
    const newProject = {
      Title: formData.title,
      TypeOfPaper: formData.typeOfPaper,
      AreaOfResearch: formData.areaOfResearch,
      PublishedYear: formData.publishedYear,
      Document: formData.document,
      Citation: formData.citation,
      Authors: formData.authors,
      pdf: formData.pdf, // Pass the pdf file for API upload
    };

    // Call the function to save the project (either add or edit)
    saveProject(newProject);

    // Success toast and close modal
    toast.success("Research project saved successfully!");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] max-h-[90vh] bg-gray-900 rounded-[20px] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {project ? "Edit Research Project" : "Add Research Project"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
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
              <label htmlFor="areaOfResearch" className="block text-sm">
                Area of Research
              </label>
              <select
                name="areaOfResearch"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.areaOfResearch}
              >
                {specializationOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Show input field if "Other" is selected */}
            {showOtherInput && (
              <div className="relative z-0 w-full group">
                <label htmlFor="otherAreaOfResearch" className="block text-sm">
                  Specify Other Area of Research
                </label>
                <input
                  type="text"
                  name="otherAreaOfResearch"
                  className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter other area of research"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      areaOfResearch: e.target.value,
                    }))
                  }
                  value={
                    formData.areaOfResearch === "Other"
                      ? ""
                      : formData.areaOfResearch
                  }
                />
              </div>
            )}

            <div className="relative z-0 w-full group">
              <label htmlFor="publishedYear" className="block text-sm">
                Published Year
              </label>
              <input
                type="number"
                name="publishedYear"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
                value={formData.publishedYear}
              />
            </div>

            <div className="relative z-0 w-full group">
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

            <div className="relative z-0 w-full group">
              <label htmlFor="authors" className="block text-sm">
                Authors/Co-Authors
              </label>
              <input
                type="text"
                name="authors"
                className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
                onChange={handleChange}
                value={formData.authors}
              />
            </div>

            <div className="relative z-0 w-full group">
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
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Project
          </button>
        </div>
      </Card>
    </div>
  );
}
