import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import PatentPopUp from "../PopUp/PatentPopUp";

const PatentRecords = ({ setBlurActive }) => {
  const [patentDetails, setPatentDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isAddPatent, setIsAddPatent] = useState(false);

  const user = useSelector(state => state.auth.user) || {};
    const { faculty_id } = user;
    const facultyId = faculty_id;
  // Fetch patent records
  const fetchPatentRecords = async () => {
    try {
      const response = await API.get(`/ece/faculty/patent/${facultyId}`, {
        params: {
          faculty_id: facultyId, // Add facultyId as a query parameter
        },
      });
      setPatentDetails(
        response.data?.data?.map((patent) => ({
          patent_id: patent.patent_id,
          patent_name: patent.patent_name,
          patent_publish: patent.patent_publish,
          patent_filed: patent.patent_filed,
          patent_award_date: patent.patent_award_date,
        })),
      );
    } catch (error) {
      console.error("Error fetching patent records:", error);
      setPatentDetails([]);
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchPatentRecords();
  }, [facultyId]);

  // Handle add/update patent
  const handleAddPatent = async (newPatent) => {
    const patentData = {
      patent_name: newPatent.patentName,
      faculty_id: facultyId,
      patent_publish: newPatent.patentPublish,
      patent_filed: newPatent.patentFiled || null,
      patent_award_date: newPatent.patentAwardDate || null,
    };

    try {
      if (isAddPatent) {
        await API.post("ece/faculty/patent", patentData);
      } else {
        await API.put(
          `ece/faculty/patent/${selectedPatent.patent_id}`,
          patentData,
        );
      }
      fetchPatentRecords();
      closePopup();
    } catch (error) {
      console.error("Error handling patent record:", error);
    }
  };

  // Handle delete patent
  const handleDeletePatent = async (patentId) => {
    try {
      await API.delete(`ece/faculty/patent/${patentId}`);
      setPatentDetails(
        patentDetails.filter((patent) => patent.patent_id !== patentId),
      );
    } catch (error) {
      console.error("Error deleting patent:", error);
    }
  };

  const openPopup = (patent) => {
    setSelectedPatent(patent);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPatent(false);
    setBlurActive(false);
  };

  
  const TABLE_HEAD = [
    "Patent Name",
    "Published Date",
    "Filed Date",
    "Award Date",
    "Actions",
  ];

  const formatDateForInput = (date) => {
    const [date1, time] = date?.split("T");

    const [day, month, year] = date1.split("-");
    return `${day}-${month}-${year}`; // yyyy-MM-dd
  };
  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Patent Records <br />
            <span className="text-lg text-red-600">
              (Details of patents filed/awarded)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddPatent(true);
              setPopupOpen(true);
              setBlurActive(true);
            }}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
        </div>
        <hr className="mb-7" />

        <div className="">
          <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
            <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
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
                {patentDetails.map((patent, index) => {
                  const {
                    patent_id,
                    patent_name,
                    patent_publish,
                    patent_filed,
                    patent_award_date,
                  } = patent;

                  const isLast = index === patentDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={patent_id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {patent_name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(patent_publish)?.toLocaleDateString(
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
                          {patent_filed
                            ? new Date(patent_filed)?.toLocaleDateString(
                                "en-GB",
                              )
                            : "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {patent_award_date
                            ? new Date(patent_award_date)?.toLocaleDateString(
                                "en-GB",
                              )
                            : "-"}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsAddPatent(false);
                              setSelectedPatent({
                                patentName: patent.patent_name, // Ensure this matches the prop name in PatentPopUp
                                patentPublish: formatDateForInput(
                                  patent.patent_publish,
                                ),
                                patentFiled: formatDateForInput(
                                  patent.patent_filed,
                                ),
                                patentAwardDate: formatDateForInput(
                                  patent.patent_award_date,
                                ),
                                patent_id: patent.patent_id, // Include patent_id for updates
                              });
                              openPopup(patent);
                            }}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePatent(patent_id)}
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

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPatent ? (
            <PatentPopUp
              closeModal={closePopup}
              handleAddPatent={handleAddPatent}
            />
          ) : (
            selectedPatent && (
              <PatentPopUp
                patentName={selectedPatent.patent_name}
                patentPublish={formatDateForInput(selectedPatent.patent_publish)}
                patentFiled={formatDateForInput(selectedPatent.patent_filed)}
                patentAwardDate={formatDateForInput(selectedPatent.patent_award_date)}
                patent_id={selectedPatent.patent_id}
                closeModal={closePopup}
                handleAddPatent={handleAddPatent}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default PatentRecords;
