import React, { useState,useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import addImg from "../../../assets/add.svg";
import editImg from "../../../assets/edit.svg"; // Import the edit icon
import deleteImg from "../../../assets/delete.svg"; // Import the delete icon
import ResearchProjectPopup from "../PopUp/ResearchProjectPopUp"; // Assume this popup component exists

const ResearchProjects = ({ setBlurActive }) => {
  const [researchProjectsDetails, setResearchProjectsDetails] = useState([]);
  const API_BASE_URL = "http://localhost:3001/ece/faculty";

useEffect(() => {
  fetch(`${API_BASE_URL}/researchpaper/FAC001`) // Replace 123 with the actual faculty_id
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setResearchProjectsDetails(
          data.map((item) => ({
            research_id: item.research_id,
            TypeOfPaper: getPaperType(item.paper_type), // Convert integer to string
            Title: item.title_of_paper,
            Domain: item.domain,
            PublicationName: item.publication_name,
            PublishedDate: item.published_date,
            Document: item.pdf_path ? { name: "Uploaded" } : null,
            Citation: item.citation,
          }))
        );
      } else {
        console.error("Unexpected API response:", data);
      }
    });
    
}, []);
const getPaperType = (type) => {
  const types = ["Conference", "Journal", "Book Chapter", "Other"];
  return types[type - 1] || "Unknown";
};


  const TABLE_HEAD = [
    "Serial No",
    "Type of Paper",
    "Title of Paper",
    "Domain",
    "Name of Conference/Journal/Book Chapter/Other",
    "Published Date",
    "Document",
    "Citation", // Add this line
    "Actions",
  ];

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editProject, setEditProject] = useState(null); // Holds the project data for editing

  const openPopup = (project = null) => {
    setEditProject(project ? { ...project } : null);
    setPopupOpen(true);
    setBlurActive(true);
  };
  

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  // Function to handle the addition of a new research project or editing an existing one
  const saveProject = (project) => {
    const method = editProject ? "PUT" : "POST";
    const url = editProject
      ? `${API_BASE_URL}/researchpaper/${editProject.research_id}`
      : `${API_BASE_URL}/researchpaper`;
  
    const requestData = {
      faculty_id: "FAC001", // Replace with dynamic ID
      paper_type: getPaperTypeId(project.TypeOfPaper),
      title_of_paper: project.Title,
      domain: project.Domain,
      publication_name: project.PublicationName,
      published_date: project.PublishedDate,
      pdf_path: project.Document ? project.Document.name : null,
      citation: project.Citation,
    };
  
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("successfully")) {
          setResearchProjectsDetails((prevDetails) => {
            if (editProject) {
              return prevDetails.map((p) =>
                p.research_id === editProject.research_id ? { ...requestData, research_id: editProject.research_id } : p
              );
            } else {
              return [...prevDetails, { ...requestData, research_id: data.data.insertId }];
            }
          });
          closePopup();
        }
      })
      .catch((error) => console.error("Error saving research paper:", error));
  };
  
  
  const getPaperTypeId = (type) => {
    const types = { "Conference": 1, "Journal": 2, "Book Chapter": 3, "Other": 4 };
    return types[type] || 4;
  };
  
  // Function to handle row deletion
  const deleteProject = (research_id) => {
    fetch(`${API_BASE_URL}/researchpaper/${research_id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("successfully")) {
          setResearchProjectsDetails((prevDetails) =>
            prevDetails.filter((project) => project.research_id !== research_id) // ✅ Corrected filtering
          );
        }
      })
      .catch((error) => console.error("Error deleting research paper:", error));
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
            {researchProjectsDetails.map(({ research_id, TypeOfPaper, Title, Domain, PublicationName, PublishedDate, Document, Citation }, index) =>               {
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
                          {PublishedDate}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Document
                            ? Document.name || "Uploaded"
                            : "Not Uploaded"}
                        </Typography>
                      </td>
                      <td className={classes}>
  <Typography
    variant="small"
    color="blue-gray"
    className="font-normal truncate max-w-[150px] overflow-hidden whitespace-nowrap"
    title={Citation} // Tooltip to show full text on hover
  >
    {Citation ? (Citation.length > 50 ? Citation.substring(0, 50) + "..." : Citation) : "N/A"}
  </Typography>
</td>

                      <td className={classes}>
                        <div className="flex justify-end gap-2">
                        <button
  onClick={() => openPopup({ research_id, TypeOfPaper, Title, Domain, PublicationName, PublishedDate, Document, Citation })} // ✅ Pass project data
  className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
>
  <img src={editImg} alt="edit" className="h-5 w-5" />
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
    </div>
  );
};

export default ResearchProjects;
