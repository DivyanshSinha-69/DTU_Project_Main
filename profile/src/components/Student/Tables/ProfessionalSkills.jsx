import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import PopupProfessionalSkills from "../PopupWindow/UpdatePopupProfessionalSkills.jsx";
import AddPopupProfessionalSkills from "../PopupWindow/AddPopupProfessionalSkills.jsx"
import img from "../../../assets/delete.svg";
import axios from "axios";
import { deleteProfessionalSkill } from "../../../redux/reducers/UserProfessionalSkills.jsx";

const StudentProfessionalSkills = () => {
  const ProfessionalSkills = useSelector((state) => state.professionalSkills);
  const dispatch = useDispatch();
  const TABLE_HEAD = ["Organisation ", "Role", "Event Name", "Date", ""];
  const TABLE_ROWS = ProfessionalSkills.ProfessionalSkills || [];

  

  const handledelete = async (ID) => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/ece/student/deleteprofessionalskills",
        {
          data: {
            ID: ID,
          },
          withCredentials: true,
        }
      );

      // Handle success, e.g., show a success message or update state
      // console.log(response.data.message);
      alert(response.data.message);
      dispatch(deleteProfessionalSkill({ ID }));
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error(error);
    }
  };

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Professional Skills
          </p>
          <Popup
            trigger={
              <button className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full">
                Add+
              </button>
            }
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            {(close) => (
              <div className="h-auto  w-[auto] bg-gray-300 rounded-md top-10 fixed inset-20 flex items-center justify-center">
                <AddPopupProfessionalSkills
                  closeModal={close}
                  name={"ADD"}
                />
              </div>
            )}
          </Popup>
        </div>

        <hr className="mb-7"></hr>

        <Card className="h-auto w-full pl-10 pr-10">
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
                          className="font-medium text-blue-600 flex flex-row"
                        >
                          <Popup
                            trigger={<button> Edit </button>}
                            className="mx-auto my-auto p-2"
                            closeOnDocumentClick
                          >
                            {(close) => (
                              <div className="h-auto  w-[auto] bg-gray-300 rounded-md top-10 fixed inset-20 flex items-center justify-center">
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
                            className="ml-6 text-red-600 h-6 w-6 flex flex-col justify-center items-center"
                            onClick={() => handledelete(ID)}
                          >
                            <img src={img} />
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
