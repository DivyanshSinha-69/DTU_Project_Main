import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import addImg from "../../../assets/add.svg";
import linkImg from "../../../assets/hyperlink.svg";
import editImg from "../../../assets/edit.svg"; // Import the edit icon
import deleteImg from "../../../assets/delete.svg"; // Import the delete icon
import ResearchProjectPopup from "../PopUp/ResearchProjectPopUp"; // Assume this popup component exists

const ResearchProjects = ({ setBlurActive }) => {
  const [researchProjectsDetails, setResearchProjectsDetails] = useState([
    {
      Title: "Machine Learning for Healthcare",
      Domain: "AI",
      PublicationName: "AI Journal",
      PublishedDate: "2022-05-12",
      PublishedLink: "https://example.com/project1",
    },
    {
      Title: "Data Science in Education",
      Domain: "Data Science",
      PublicationName: "Data Science Review",
      PublishedDate: "2023-01-20",
      PublishedLink: "https://example.com/project2",
    },
  ]);

  const TABLE_HEAD = [
    "Serial No",
    "Title of Paper",
    "Domain",
    "Publication Name",
    "Published Date",
    "Published Link",
    "Actions",
  ];

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editProject, setEditProject] = useState(null); // Holds the project data for editing

  const openPopup = (project = null) => {
    setEditProject(project); // If editing, pre-fill the form with the selected project
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false);
  };

  // Function to handle the addition of a new research project or editing an existing one
  const saveProject = (project) => {
    if (editProject) {
      // Update the existing project
      setResearchProjectsDetails((prevDetails) =>
        prevDetails.map((p, index) =>
          index === researchProjectsDetails.indexOf(editProject) ? project : p
        )
      );
    } else {
      // Add a new project
      setResearchProjectsDetails((prevDetails) => [...prevDetails, project]);
    }
    closePopup();
  };

  // Function to handle row deletion
  const deleteProject = (index) => {
    setResearchProjectsDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Research Papers Published
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
              <div className="h-[650px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-10 md:inset-20 flex items-center justify-center">
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

        <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
          <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
                    Title,
                    Domain,
                    PublicationName,
                    PublishedDate,
                    PublishedLink,
                  },
                  index
                ) => {
                  const isLast =
                    index === researchProjectsDetails.length - 1;
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
                          <a
                            href={PublishedLink}
                            target="_blank"
                            className="hover:underline"
                          >
                            <img
                              className="md:ml-[50px] h-5 w-10 hover:invert hover:scale-125 transition-transform ease-in"
                              src={linkImg}
                              alt="link"
                            />
                          </a>
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              openPopup({
                                Title,
                                Domain,
                                PublicationName,
                                PublishedDate,
                                PublishedLink,
                              })
                            }
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteProject(index)}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img
                              src={deleteImg}
                              alt="delete"
                              className="h-5 w-5"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default ResearchProjects;
