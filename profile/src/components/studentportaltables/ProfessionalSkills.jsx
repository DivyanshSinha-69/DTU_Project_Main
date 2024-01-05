import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import { useSelector } from "react-redux";
import PopupProfessionalSkills from "./PopupWindow/PopupProfessionalSkills.jsx";



const StudentProfessionalSkills = () => {
  const ProfessionalSkills=useSelector((state)=>state.professionalSkills);
  const TABLE_HEAD = ["Organisation ", "Role", "Event Name", "Date", ""];
  const TABLE_ROWS = ProfessionalSkills.ProfessionalSkills||[];


  return (
    <div>
      <div className="h-auto p-10">
        <p className="p-3 text-2xl mx-auto font1 text-center border-top">
          Professional Skills
        </p>
        <Card className="h-auto w-full">
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
                ({ ID,EventName, Position, Organisation, EventDate ,RollNo}, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={Organisation}>
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
                          as="a"
                          href="#"
                          variant="small"
                          color="blue-gray"
                          className="font-medium text-blue-600"
                        >
                          <Popup
                            trigger={<button> Edit </button>}
                            className="mx-auto my-auto"
                          >
                            <div className="h-auto  w-[auto] bg-gray-300 rounded-md top-10 fixed inset-20 flex items-center justify-center">
                              <PopupProfessionalSkills roll={RollNo} id={ID} eventname={EventName} position={Position} organisation={Organisation} date={EventDate}/>
                            </div>
                          </Popup>
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
