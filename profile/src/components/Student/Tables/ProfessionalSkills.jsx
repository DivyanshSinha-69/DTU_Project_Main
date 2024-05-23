import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import PopupProfessionalSkills from "../PopupWindow/UpdatePopupProfessionalSkills.jsx";
import AddPopupProfessionalSkills from "../PopupWindow/AddPopupProfessionalSkills.jsx";
import img from "../../../assets/delete.svg";
import addImg from "../../../assets/add.svg";
import axios from "axios";
import { deleteProfessionalSkill } from "../../../redux/reducers/UserProfessionalSkills.jsx";
import toast from 'react-hot-toast';

const StudentProfessionalSkills = ({ setBlurActive }) => {
  const ProfessionalSkills = useSelector((state) => state.professionalSkills);
  const dispatch = useDispatch();
  const TABLE_HEAD = ["Organisation ", "Role", "Event Name", "Date", ""];
  const TABLE_ROWS = ProfessionalSkills.ProfessionalSkills || [];

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true); // Activate blur when opening the popup
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false); // Deactivate blur when closing the popup
  };

  const openPopup2 = (index) => {
    setSelectedRowIndex(index);
    setBlurActive(true);
  };

  const closePopup2 = () => {
    setSelectedRowIndex(null);
    setBlurActive(false);
  };

  const handledelete = async (ID) => {
    try {
      const response = await axios.delete(
        "http://192.168.1.3:3001/ece/student/deleteprofessionalskills",
        {
          data: {
            ID: ID,
          },
          withCredentials: true,
        }
      );

  
      toast.success(response.data.message);
      dispatch(deleteProfessionalSkill({ ID }));
    } catch (error) {
   
      console.error(error);
    }
  };

  return (
    <div>
      <div className="h-auto p-10 ">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Professional Activities <br /> <span className="text-lg text-red-600">( Provide information on all the events organized by your society. )</span>
          </p>
          <button
            onClick={openPopup}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="hello" className="h-5 w-5" />
          </button>
          <Popup
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            {(close) => (
              <div className="h-[550px]  w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-10 md:inset-20 flex items-center justify-center">
                <AddPopupProfessionalSkills closeModal={close} name={"ADD"} />
              </div>
            )}
          </Popup>
        </div>

        <hr className="mb-7"></hr>

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
              {TABLE_ROWS.map(
                (
                  { ID, EventName, Position, Organisation, EventDate, RollNo },
                  index
                ) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={ID}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Organisation}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Position}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {EventName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {EventDate}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium text-blue-600 flex flex-row justify-center"
                        >
                          <button
                            onClick={() => openPopup2(index)}
                            className="hover:invert hover:scale-[130%] transition-transform ease-in"
                          >
                            {" "}
                            Edit{" "}
                          </button>
                          <Popup
                            trigger={null}
                            open={selectedRowIndex === index}
                            onClose={closePopup2}
                            className="mx-auto my-auto p-2"
                            closeOnDocumentClick
                          >
                            {(close) => (
                              <div className="h-[550px]  w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed  inset-5 md:inset-20 flex items-center justify-center">
                                <PopupProfessionalSkills
                                  closeModal={close}
                                  roll={RollNo}
                                  id={ID}
                                  eventname={EventName}
                                  position={Position}
                                  organisation={Organisation}
                                  date={EventDate}
                                  name={"UPDATE"}
                                />
                              </div>
                            )}
                          </Popup>
                          <button
                            className="ml-6 text-red-600 h-5 w-6 flex flex-col justify-center items-center hover:scale-[130%] transition-transform ease-in"
                            onClick={() => handledelete(ID)}
                          >
                            <img src={img} alt="delete" />
                          </button>
                        </Typography>
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

export default StudentProfessionalSkills;
