import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Placement from "./Placement.jsx";

const ProfessionalSkills = (props) => {
  const popisactive=false;
  const TABLE_HEAD = ["Organisation ", "Role", "Event Name", "Date", ""]; 
  console.log(props.user);
  const TABLE_ROWS = props.user;

  const openform=()=>{
    
  }

  return (
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
            {TABLE_ROWS.map(({ EventName , position , Organisation, EventDate }, index) => {
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
                      {position}
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
                      onClick={openform}
                    >
                      Edit
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <Placement/>
    </div>
  );
};

export default ProfessionalSkills;
