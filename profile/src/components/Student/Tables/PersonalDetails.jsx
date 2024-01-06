import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import PersonalDetailPopup from "../PopupWindow/PersonalDetailPopup";
import '../../../styles/popup.css'

const PersonalDetails = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);

  const TABLE_HEAD = ["Mother's Name", "Father's Name", "Phone No.", "Personal Mail", "College Mail", "Parent's Contact No."];
  const TABLE_ROWS = [];

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className={`personal-details ${isPopupOpen ? 'popup-open' : ''}`}>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Personal Details
          </p>
          <button onClick={openPopup} className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full">
            Edit
          </button>

          <Popup
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <PersonalDetailPopup closeModal={closePopup} name={"ADD"} />
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
