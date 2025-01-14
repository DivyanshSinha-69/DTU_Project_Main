import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import SponsoredResearchPopUp from "../PopUp/SponsoredResearchPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyResearchDetails = [
  { title: "AI in Education", agency: "NSF", amount: 50000, duration: 3, startDate: "2021-06-15" },
  { title: "Climate Change Impact", agency: "UNESCO", amount: 75000, duration: 2, startDate: "2022-01-10" },
  { title: "Renewable Energy", agency: "DOE", amount: 100000, duration: 4, startDate: "2020-09-20" }
];

const SponsoredResearch = ({ setBlurActive }) => {
  const [researchDetails, setResearchDetails] = useState(dummyResearchDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isAddResearch, setIsAddResearch] = useState(false);

  const openPopup = (research) => {
    setSelectedResearch(research);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddResearch(false);
    setBlurActive(false);
  };

  const handleAddResearch = (newResearch) => {
    if (selectedResearch) {
      // Update existing research
      setResearchDetails((prevDetails) =>
        prevDetails.map((research) =>
          research === selectedResearch ? { ...newResearch } : research
        )
      );
    } else {
      // Add new research
      setResearchDetails([...researchDetails, newResearch]);
    }
    closePopup();
  };

  const handleDeleteResearch = (indexToDelete) => {
    setResearchDetails(researchDetails.filter((_, index) => index !== indexToDelete));
  };

  const TABLE_HEAD = ["Project Title", "Funding Agency", "Amount Sponsored", "Duration (Years)", "Start Date", "Actions"];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Sponsored Research <br /><span className="text-lg text-red-600">(Details of sponsored research projects)</span>
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
                  {TABLE_HEAD.map((head, index) => (
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
                {researchDetails.map((research, index) => {
                  const { title, agency, amount, duration, startDate } = research;
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
                          ₹{amount.toLocaleString()}
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
                          {startDate}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(research)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResearch(index)}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={deleteImg} alt="delete" className="h-5 w-5 filter brightness-0 invert" />
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
        <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
          {isAddResearch ? (
            <SponsoredResearchPopUp
              title=""
              agency=""
              amount=""
              duration=""
              startDate=""
              closeModal={closePopup}
              handleAddResearch={handleAddResearch}
            />
          ) : (
            selectedResearch && (
              <SponsoredResearchPopUp
                title={selectedResearch.title}
                agency={selectedResearch.agency}
                amount={selectedResearch.amount}
                duration={selectedResearch.duration}
                startDate={selectedResearch.startDate}
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
