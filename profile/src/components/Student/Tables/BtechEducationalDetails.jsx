import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import '../../../styles/popup.css';
import { useSelector } from "react-redux";
import editImg from "../../../assets/edit.svg"
import MtechEducationDetailPopup from "../PopupWindow/MtechEducationDetailPopup";
import BtechEducationDetailPopup from "../PopupWindow/BtechEducationDetailPopup";

const BtechEducationDetails = ({  setBlurActive }) => {
    
    
  const btechEducation = useSelector(state=>state.btechEducation);
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

  const TABLE_HEAD = ["Admitted Through","All India Rank(General Rank)"];
  const TABLE_ROWS = btechEducation.BtechEducation||[];


  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Educational Details
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
            <div className="h-[450px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <BtechEducationDetailPopup
              
              air={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].air : ""}
              
              closeModal={closePopup} 
              name={"UPDATE"} />
            </div>
          </Popup>
        </div>
        <hr className="mb-7"></hr>

        {/* table */}
        <div className="">
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
                  {RollNo,admittedThrough, air},
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
                          {admittedThrough}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {air}
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

export default BtechEducationDetails;



  

