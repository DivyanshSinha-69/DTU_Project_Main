import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import addImg from "../../../assets/add.svg";
import editImg from "../../../assets/edit.svg"; // Import the edit icon
import deleteImg from "../../../assets/delete.svg"; // Import the delete icon
import ResearchProjectPopup from "../PopUp/ResearchProjectPopUp"; // Assume this popup component exists
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import PdfModal from "../../PdfModal";
import CustomTable from "../../DynamicComponents/CustomTable";

const ResearchProjects = ({ setBlurActive }) => {
  const [researchProjectsDetails, setResearchProjectsDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  const API_BASE_URL = "/ece/faculty";
  const TABLE_HEAD = [
    "Serial No",
    "Type of Paper",
    "Title of Paper",
    "Domain",
    "Name of Conference/Journal/Book Chapter/Other",
    "Published Date",
    "Document",
    "Citation",
    "Actions",
  ];

  // Converts the numeric paper type from the API to a string.
  const getPaperType = (type) => {
    const types = ["Conference", "Journal", "Book Chapter", "Other"];
    return types[type - 1] || "Unknown";
  };

  // Converts the paper type string to its corresponding numeric ID.
  const getPaperTypeId = (type) => {
    const types = { Conference: 1, Journal: 2, "Book Chapter": 3, Other: 4 };
    return types[type] || 4;
  };
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  // Fetch research projects from the API
  const fetchResearchProjects = async () => {
    try {
      const response = await API.get(`/ece/faculty/researchpaper/${facultyId}`);
      if (Array.isArray(response.data)) {
        setResearchProjectsDetails(
          response.data.map((item) => ({
            research_id: item.research_id,
            TypeOfPaper: getPaperType(item.paper_type),
            Title: item.title_of_paper,
            Domain: item.domain,
            PublicationName: item.publication_name,
            PublishedDate: formatDateForInput(item.published_date),
            Document: item.pdf_path ? { name: item.pdf_path } : null,
            Citation: item.citation,
          }))
        );
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching research projects:", error);
    }
  };

  useEffect(() => {
    fetchResearchProjects();
  }, [facultyId]);

  // Open the popup for adding a new project or editing an existing one
  const openPopup = (project = null) => {
    setEditProject(
      project
        ? {
            ...project,
          }
        : null
    );
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  // Save research project (add or update)
  const saveProject = async (project) => {
    const method = editProject ? "PUT" : "POST";
    const url = editProject
      ? `${API_BASE_URL}/researchpaper/${editProject.research_id}`
      : `${API_BASE_URL}/researchpaper`;

    const formData = new FormData();
    formData.append("faculty_id", facultyId);
    formData.append("paper_type", getPaperTypeId(project.TypeOfPaper));
    formData.append("title_of_paper", project.Title);
    formData.append("domain", project.Domain);
    formData.append("publication_name", project.PublicationName);
    formData.append("published_date", project.PublishedDate);
    formData.append("citation", project.Citation);

    if (project.pdf) {
      formData.append("pdf", project.pdf);
    }

    try {
      const response = await API({
        url,
        method,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      console.log("API Response:", response.data); // Debugging Log

      if (
        response.data.message &&
        response.data.message.includes("successfully")
      ) {
        setResearchProjectsDetails((prevDetails) => {
          const newProject = {
            research_id:
              response.data.data.insertId || editProject?.research_id,
            TypeOfPaper: project.TypeOfPaper,
            Title: project.Title,
            Domain: project.Domain,
            PublicationName: project.PublicationName,
            PublishedDate: project.PublishedDate,
            Document: project.pdf
              ? { name: `Faculty\\ResearchPapers\\FAC001\\${project.pdf.name}` }
              : null, // 🔹 Use project.pdf name
            Citation: project.Citation,
          };

          if (editProject) {
            // Update existing project
            return prevDetails.map((p) =>
              p.research_id === editProject.research_id ? newProject : p
            );
          } else {
            // Add new project
            return [...prevDetails, newProject];
          }
        });

        closePopup();
      }
    } catch (error) {
      console.error("Error saving research paper:", error);
    }
  };

  // Delete a research project
  const deleteProject = async (research_id) => {
    try {
      const response = await API.delete(
        `${API_BASE_URL}/researchpaper/${research_id}`
      );
      if (
        response.data.message &&
        response.data.message.includes("successfully")
      ) {
        setResearchProjectsDetails((prevDetails) =>
          prevDetails.filter((project) => project.research_id !== research_id)
        );
      }
    } catch (error) {
      console.error("Error deleting research paper:", error);
    }
  };

  return (
    <>
      <Popup
        trigger={null}
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        {(close) => (
          <div>
            <ResearchProjectPopup
              closeModal={close}
              saveProject={saveProject}
              project={editProject} // Pass the project to pre-fill the form for editing
            />
          </div>
        )}
      </Popup>
      <CustomTable
        title="Research Papers Published"
        subtitle="(As per official records)"
        columns={[
          { key: "TypeOfPaper", label: "Type of Paper" },
          { key: "Title", label: "Title" },
          { key: "Domain", label: "Domain" },
          { key: "PublicationName", label: "Publication Name" },
          { key: "PublishedDate", label: "Published Date" },
          { key: "Document", label: "Document" }, // View Button for Documents
          { key: "Citation", label: "Citation" },
          { key: "actions", label: "Actions" },
        ]}
        data={researchProjectsDetails}
        actions={{
          edit: (project) => {
            console.log(project);
            openPopup(project);
          },
          delete: (id) => deleteProject(id),
        }}
        onAdd={() => openPopup()} // Opens popup when Add button is clicked
      />
      {selectedPdf && (
        <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </>
  );
};

export default ResearchProjects;
