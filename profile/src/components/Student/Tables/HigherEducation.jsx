import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { useSelector } from "react-redux";
import editImg from "../../../assets/edit.svg";
import HigherEducationPopup from "../PopupWindow/HigherEducationPopup";

const HigherEducation = ({ setBlurActive }) => {
  const HigherEducationDetails = useSelector(
    (state) => state.higherEducationDetails
  );
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

  const TABLE_HEAD = [
    "Name of The Exam",
    "Name of The Institute",
    "Offer Letter",
  ];
  const TABLE_ROWS = HigherEducationDetails.HigherEducationDetails || [];

  const handleOpenPdf = (pdfSrc) => {
    return () => {
      if (pdfSrc) {
        const blob = base64ToBlob(pdfSrc, "application/pdf");
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      }
    };
  };

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Higher Education
          </p>
          <button
            onClick={openPopup}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full  hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={editImg} alt="hello" className="h-5 w-5" />
          </button>

          <Popup
            trigger={null}
            open={isPopupOpen}
            onClose={closePopup}
            className="mx-auto my-auto p-2"
            closeOnDocumentClick
          >
            <div className="h-[500px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
              <HigherEducationPopup
                examName={TABLE_ROWS.length > 0 ? TABLE_ROWS[0].examName : ""}
                instituteName={
                  TABLE_ROWS.length > 0 ? TABLE_ROWS[0].instituteName : ""
                }
                closeModal={closePopup}
                name={"UPDATE"}
              />
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
                  ({ RollNo, examName, instituteName, offerLetter }, index) => {
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
                            {examName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {instituteName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <button
                              onClick={handleOpenPdf(offerLetter)}
                              className=" text-blue-600 font-bold hover:underline md:ml-[20px]"
                            >
                              View
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
    </div>
  );
};

export default HigherEducation;

const base64ToBlob = (base64String, contentType) => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};
