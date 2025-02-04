import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import SponsoredResearchPopUp from "../PopUp/SponsoredResearchPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyResearchDetails = [
  {
    title: "AI in Education",
    agency: "NSF",
    amount: 50000,
    duration: 3,
    startDate: "2021-06-15",
  },
  {
    title: "Climate Change Impact",
    agency: "UNESCO",
    amount: 75000,
    duration: 2,
    startDate: "2022-01-10",
  },
  {
    title: "Renewable Energy",
    agency: "DOE",
    amount: 100000,
    duration: 4,
    startDate: "2020-09-20",
  },
];

const SponsoredResearch = ({ setBlurActive }) => {
  const [researchDetails, setResearchDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isAddResearch, setIsAddResearch] = useState(false);

  // Fetch data

  const fetchResearchDetails = async () => {
    try {
      const response = await fetch(
        `https://64.227.135.99:3001/ece/faculty/sponsored-research/${facultyId}`,
      );
      if (!response.ok) {
        // If the response is not OK (e.g., 404), handle it gracefully
        if (response.status === 404) {
          setResearchDetails([]); // No data found, set to an empty array
          return;
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setResearchDetails(
        data.map((record) => ({
          project_title: record.project_title,
          agency: record.funding_agency,
          amount: record.amount_sponsored,
          duration: record.research_duration,
          startDate: record.start_date,
          end_date: record.end_date,
          sponsorship_id: record.sponsorship_id,
        })),
      );
    } catch (error) {
      console.error("Error fetching sponsored research records:", error);
      setResearchDetails([]); // Fallback to an empty array in case of errors
    }
  };

  const openPopup = (research) => {
    // Format the start date before passing it to the popup
    const formattedStartDate = new Date(research.start_date).toLocaleDateString(
      "en-GB",
    );

    // Set the selected research with the formatted start date
    setSelectedResearch({
      ...research,
      start_date: formattedStartDate, // Update start_date with the formatted date
    });

    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddResearch(false);
    setBlurActive(false);
  };

  const handleAddResearch = (newResearch) => {
    if (isAddResearch) {
      // Add new research
      const requestPayload = {
        faculty_id: facultyId, // Use FAC001 for now
        project_title: newResearch.title,
        funding_agency: newResearch.agency,
        amount_sponsored: newResearch.amount,
        research_duration: newResearch.duration,
        start_date: newResearch.startDate,
        end_date: newResearch.endDate || null,
      };

      axios
        .post(
          "https://64.227.135.99:3001/ece/faculty/sponsored-research",
          requestPayload,
        )
        .then((response) => {
          setResearchDetails([
            ...researchDetails,
            { ...newResearch, sponsorship_id: response.data.sponsorship_id },
          ]);
          closePopup();
        })
        .catch((error) => {
          console.error("Error adding sponsored research:", error);
        });
    } else {
      const updatedResearch = {
        faculty_id: facultyId,
        project_title: newResearch.title,
        funding_agency: newResearch.agency,
        amount_sponsored: newResearch.amount,
        research_duration: newResearch.duration,
        start_date: newResearch.startDate,
        end_date: newResearch.endDate || null,
      };

      axios
        .put(
          `https://64.227.135.99:3001/ece/faculty/sponsored-research/${selectedResearch.sponsorship_id}`,
          updatedResearch,
        )
        .then(() => {
          setResearchDetails((prevDetails) =>
            prevDetails?.map((research) =>
              research.sponsorship_id === selectedResearch.sponsorship_id
                ? { ...newResearch }
                : research,
            ),
          );
          closePopup();
        })

        .catch((error) => {
          console.error("Error updating sponsored research:", error);
        });
    }
  };

  const handleDeleteResearch = (sponsorshipId) => {
    axios
      .delete(
        `https://64.227.135.99:3001/ece/faculty/sponsored-research/${sponsorshipId}`,
      )
      .then(() => {
        setResearchDetails((prevDetails) =>
          prevDetails.filter(
            (research) => research.sponsorship_id !== sponsorshipId,
          ),
        );
      })
      .catch((error) => {
        console.error("Error deleting sponsored research:", error);
      });
  };

  const TABLE_HEAD = [
    "Project Title",
    "Funding Agency",
    "Amount Sponsored",
    "Duration (Years)",
    "Start Date",
    "End Date",
    "Actions",
  ];
  const formatDateForInput = (date) => {
    const [date1, time] = date?.split("T");

    const [day, month, year] = date1.split("-");
    return `${day}-${month}-${year}`; // yyyy-MM-dd
  };
  const facultyId = "FAC001"; // Replace with dynamic faculty ID if necessary
  useEffect(() => {
    fetchResearchDetails();
  }, []); // Make sure this updates when facultyId changes
  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Sponsored Research <br />
            <span className="text-lg text-red-600">
              (Details of sponsored research projects)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddResearch(true);
              setPopupOpen(true);
              setBlurActive(true);
            }}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
        </div>
        <hr className="mb-7"></hr>

        <div className="">
          <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
            <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD?.map((head, index) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${
                        head === "Actions" ? "text-right" : ""
                      }`}
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
                {researchDetails?.map((research, index) => {
                  const {
                    title = research.project_title,
                    agency = research.funding_agency,
                    amount = research.amount_sponsored,
                    duration = research.research_duration,
                    startDate = research.start_date,
                    endDate = research.end_date,
                  } = research;
                  const isLast = index === researchDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${title}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {agency}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          ₹{amount?.toLocaleString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {duration}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(startDate)?.toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {endDate
                            ? new Date(endDate)?.toLocaleDateString("en-GB")
                            : "-"}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              openPopup(research);
                              setIsAddResearch(false);
                            }}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteResearch(research.sponsorship_id)
                            }
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
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Popup */}
      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddResearch ? (
            <SponsoredResearchPopUp
              title=""
              agency=""
              amount=""
              duration=""
              startDate=""
              endDate=""
              closeModal={closePopup}
              handleAddResearch={handleAddResearch}
            />
          ) : (
            selectedResearch && (
              <SponsoredResearchPopUp
                title={selectedResearch.project_title}
                agency={selectedResearch.agency}
                amount={selectedResearch.amount}
                duration={selectedResearch.duration}
                startDate={formatDateForInput(selectedResearch.startDate)}
                endDate={
                  selectedResearch.endDate
                    ? formatDateForInput(selectedResearch?.endDate)
                    : ""
                }
                closeModal={closePopup}
                handleAddResearch={handleAddResearch}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default SponsoredResearch;
