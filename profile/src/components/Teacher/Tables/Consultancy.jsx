import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import ConsultancyDetailsPopUp from "../PopUp/ConsultancyPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyConsultancyDetails = [
  { title: "Business Strategy", client: "ABC Corp", amount: 50000, duration: 6, startDate: "2021-06-15" },
  { title: "Marketing Plan", client: "XYZ Ltd", amount: 75000, duration: 3, startDate: "2022-01-10" },
  { title: "Tech Consultation", client: "Tech Innovators", amount: 100000, duration: 12, startDate: "2020-09-20" }
];

const ConsultancyDetails = ({ setBlurActive }) => {
  const [consultancyDetails, setConsultancyDetails] = useState(dummyConsultancyDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [isAddConsultancy, setIsAddConsultancy] = useState(false);

  const openPopup = (consultancy) => {
    setSelectedConsultancy(consultancy);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddConsultancy(false);
    setBlurActive(false);
  };

  const handleAddConsultancy = (newConsultancy) => {
    if (selectedConsultancy) {
      // Update existing consultancy
      setConsultancyDetails((prevDetails) =>
        prevDetails.map((consultancy) =>
          consultancy === selectedConsultancy ? { ...newConsultancy } : consultancy
        )
      );
    } else {
      // Add new consultancy
      setConsultancyDetails([...consultancyDetails, newConsultancy]);
    }
    closePopup();
  };

  const handleDeleteConsultancy = (indexToDelete) => {
    setConsultancyDetails(consultancyDetails.filter((_, index) => index !== indexToDelete));
  };

  const TABLE_HEAD = ["Consultancy Title", "Agency Name", "Amount Charged", "Duration (Years)", "Start Date", "Actions"];

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Consultancy Details <br /><span className="text-lg text-red-600">(Details of consultancy projects)</span>
          </p>
          <button
            onClick={() => {
              setIsAddConsultancy(true);
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
                {consultancyDetails.map((consultancy, index) => {
                  const { title, client, amount, duration, startDate } = consultancy;
                  const isLast = index === consultancyDetails.length - 1;
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
                          {client}
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
                            onClick={() => openPopup(consultancy)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteConsultancy(index)}
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
          {isAddConsultancy ? (
            <ConsultancyDetailsPopUp
              title=""
              client=""
              amount=""
              duration=""
              startDate=""
              closeModal={closePopup}
              handleAddConsultancy={handleAddConsultancy}
            />
          ) : (
            selectedConsultancy && (
              <ConsultancyDetailsPopUp
                title={selectedConsultancy.title}
                client={selectedConsultancy.client}
                amount={selectedConsultancy.amount}
                duration={selectedConsultancy.duration}
                startDate={selectedConsultancy.startDate}
                closeModal={closePopup}
                handleAddConsultancy={handleAddConsultancy}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default ConsultancyDetails;
