import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import addImg from "../../../assets/add.svg";
import editImg from "../../../assets/edit.svg";
import deleteImg from "../../../assets/delete.svg";
import ResearchProjectPopup from "../PopUp/ResearchProjectPopUp";
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
    "Area of Research",
    "Published Year",
    "Name of Publication",
    "ISSN Number",
    "UGC Care List",
    "Journal Link",
    "Document",
    "Citation",
    "Authors/Co-Authors",
    "Actions",
  ];

  // Fetch research projects from the API
  const fetchResearchProjects = async () => {
    try {
      const response = await API.get(`/ece/faculty/researchpaper/${facultyId}`);
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setResearchProjectsDetails([]);
        } else {
          setResearchProjectsDetails(
            response.data.map((item) => ({
              research_id: item.research_id,
              TypeOfPaper: item.paper_type,
              Title: item.title_of_paper,
              AreaOfResearch: item.area_of_research,
              PublishedYear: item.published_year,
              PublicationName: item.name_of_publication,
              ISSNNumber: item.ISSN_number,
              UGCCareList: item.UGC,
              JournalLink: item.Link,
              document: item.pdf_path,
              Citation: item.citation,
              Authors: item.authors,
            }))
          );
        }
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

  const saveProject = async (project) => {
    const method = editProject ? "PUT" : "POST";
    const url = editProject
      ? `${API_BASE_URL}/researchpaper/${editProject.research_id}`
      : `${API_BASE_URL}/researchpaper`;

    const formData = new FormData();
    formData.append("faculty_id", facultyId);
    formData.append("paper_type", project.TypeOfPaper);
    formData.append("title_of_paper", project.Title);
    formData.append("area_of_research", project.AreaOfResearch);
    formData.append("published_year", project.PublishedYear);
    formData.append("name_of_publication", project.PublicationName);
    formData.append("ISSN_number", project.ISSNNumber);
    formData.append("UGC", project.UGCCareList || "no"); // Default to 'no' if not provided
    formData.append("Link", project.JournalLink);
    formData.append("citation", project.Citation);
    formData.append("authors", project.Authors);

    if (project.pdf) {
      formData.append("pdf", project.pdf);
    }

    try {
      const response = await API({
        url,
        method,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
        params: { faculty_id: facultyId },
      });

      console.log("API Response:", response.data);

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
            AreaOfResearch: project.AreaOfResearch,
            PublishedYear: project.PublishedYear,
            PublicationName: project.PublicationName,
            ISSNNumber: project.ISSNNumber,
            UGCCareList: project.UGCCareList || "no",
            JournalLink: project.JournalLink,
            Document: project.pdf ? { name: project.pdf.name } : null,
            Citation: project.Citation,
            Authors: project.Authors,
          };

          if (editProject) {
            return prevDetails.map((p) =>
              p.research_id === editProject.research_id ? newProject : p
            );
          } else {
            return [...prevDetails, newProject];
          }
        });
        fetchResearchProjects();
        closePopup();
      }
    } catch (error) {
      console.error("Error saving research paper:", error);
    }
  };

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
              project={editProject}
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
          { key: "AreaOfResearch", label: "Area of Research" },
          { key: "PublishedYear", label: "Published Year" },
          { key: "PublicationName", label: "Name of Publication" },
          { key: "ISSNNumber", label: "ISSN Number" },
          {
            key: "UGCCareList",
            label: "UGC Care List",
            render: (value) => (value === "yes" ? "Yes" : "No"),
          },
          {
            key: "JournalLink",
            label: "Journal Link",
          },
          {
            key: "document",
            label: "Document",
          },
          { key: "Citation", label: "Citation" },
          { key: "Authors", label: "Authors/Co-Authors" },
          { key: "actions", label: "Actions" },
        ]}
        data={researchProjectsDetails}
        actions={{
          edit: (project) => {
            console.log(project);
            openPopup(project);
          },
          delete: (row) => deleteProject(row.research_id),
        }}
        onAdd={() => openPopup()}
      />
      {selectedPdf && (
        <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </>
  );
};

export default ResearchProjects;
