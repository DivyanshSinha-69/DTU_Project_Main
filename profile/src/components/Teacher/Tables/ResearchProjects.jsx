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
            PublishedDate: item.published_date,
            Document: item.pdf_path ? { name: item.pdf_path } : null,
            Citation: item.citation,
          })),
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
        : null,
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
              p.research_id === editProject.research_id ? newProject : p,
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
        `${API_BASE_URL}/researchpaper/${research_id}`,
      );
      if (
        response.data.message &&
        response.data.message.includes("successfully")
      ) {
        setResearchProjectsDetails((prevDetails) =>
          prevDetails.filter((project) => project.research_id !== research_id),
        );
      }
    } catch (error) {
      console.error("Error deleting research paper:", error);
    }
  };

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Research Papers Published <br />
            <span className="text-lg text-red-600">
              (As per official records)
            </span>
          </p>
          <button
            onClick={() => openPopup()}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
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
        </div>

        <hr className="mb-7" />

        <Card className="h-auto w-full pl-10 pr-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${head === "Actions" ? "text-right" : ""}`}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {researchProjectsDetails.map(
                  (
                    {
                      research_id,
                      TypeOfPaper,
                      Title,
                      Domain,
                      PublicationName,
                      PublishedDate,
                      Document,
                      Citation,
                    },
                    index,
                  ) => {
                    const isLast = index === researchProjectsDetails.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {index + 1}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {TypeOfPaper}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {Title}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {Domain}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {PublicationName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {new Date(PublishedDate)?.toLocaleDateString(
                              "en-GB",
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {Document ? (
                              <a
                                href={`http://localhost:3001/public/${Document.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              "Not Uploaded"
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal truncate max-w-[150px] overflow-hidden whitespace-nowrap"
                            title={Citation} // Tooltip to show full text on hover
                          >
                            {Citation
                              ? Citation.length > 50
                                ? Citation.substring(0, 50) + "..."
                                : Citation
                              : "N/A"}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openPopup({
                                  research_id,
                                  TypeOfPaper,
                                  Title,
                                  Domain,
                                  PublicationName,
                                  PublishedDate,
                                  Document,
                                  Citation,
                                })
                              } // ✅ Pass project data
                              className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                            >
                              <img
                                src={editImg}
                                alt="edit"
                                className="h-5 w-5"
                              />
                            </button>

                            <button
                              onClick={() => deleteProject(research_id)}
                              className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                            >
                              <img
                                src={deleteImg}
                                alt="delete"
                                className="h-5 w-5 filter brightness-0 invert"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {selectedPdf && (
        <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </div>
  );
};

export default ResearchProjects;
