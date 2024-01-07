import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PersonalDetailPopup from "../PopupWindow/PersonalDetailPopup";
import '../../../styles/popup.css'
import { useSelector } from "react-redux";
import editImg from "../../../assets/edit.svg"

const PersonalDetails = ({  setBlurActive }) => {

  const PersonalDetails = useSelector(state=>state.personalDetails);
  // console.log(PersonalDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true); // Activate blur when opening the popup
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false); // Deactivate blur when closing the popup
  };

  const TABLE_HEAD = ["Mother's Name", "Father's Name", "Phone No.", "Parent's Contact No.", "Personal Mail", "College Mail"];
  const TABLE_ROWS = PersonalDetails.PersonalDetails;


  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Personal Details
          </p>
          <button onClick={openPopup} className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full  hover:invert hover:scale-[130%] transition-transform ease-in">
            <img src={editImg} alt="hello" className="h-5 w-5"/>
          </button>

          <Popup
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <PersonalDetailPopup
              motherName={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].motherName : ""}
              fatherName={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].fatherName : ""}
              personalContactNo={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].personalContactNo : ""}
              parentContactNo={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].parentContactNo : ""}
              personalEmail={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].personalEmail : ""}
              dtuEmail={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].dtuEmail : ""}
              rollNo={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].RollNo : ""}
              studentimage={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].studentImage : ""}
              closeModal={closePopup} 
              name={"ADD"} />
            </div>
          </Popup>
        </div>
        <hr className="mb-7"></hr>

        {/* table */}
        <div className="">
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
                  {RollNo,motherName, fatherName, personalContactNo, parentContactNo , personalEmail, dtuEmail},
                  index
                ) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={RollNo}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {motherName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {fatherName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {personalContactNo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {parentContactNo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {personalEmail}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {dtuEmail}
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
    </div>
  );
};

export default PersonalDetails;
