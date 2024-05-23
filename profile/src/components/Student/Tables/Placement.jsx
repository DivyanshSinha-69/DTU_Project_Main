import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import img from "../../../assets/delete.svg";
import addImg from "../../../assets/add.svg";
import axios from "axios";
import AddPlacementsPopup from "../PopupWindow/AddPlacementsPopup.jsx";
import { deletePlacement } from "../../../redux/reducers/UserPlacementDetail.jsx";
import toast from 'react-hot-toast';

const Placement = ({ setBlurActive }) => {
  const Placement = useSelector((state) => state.placement);
  const dispatch = useDispatch();
  const TABLE_HEAD = [
    "Placement Type",
    "Company Name",
    "Joining Date",
    "Appointment Letter",
    "",
  ];
  const TABLE_ROWS = Placement.Placement || [];

  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
    setBlurActive(true); // Activate blur when opening the popup
  };

  const closePopup = () => {
    setPopupOpen(false);
    setBlurActive(false); // Deactivate blur when closing the popup
  };

  const handledelete = async (ID) => {
    try {
      const response = await axios.delete(
        "http://192.168.1.3:3001/ece/student/deleteplacement",
        {
          data: {
            ID: ID,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      dispatch(deletePlacement({ ID }));
    } catch (error) {
      console.error(error);
    }
  };
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
      <div className="h-auto p-10 ">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">Placements</p>
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
                <AddPlacementsPopup closeModal={close} name={"ADD"} />
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
                  {
                    ID,
                    RollNo,
                    companyName,
                    placementType,
                    joiningDate,
                    appointmentLetter,
                  },
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
                          {placementType}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {companyName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {joiningDate}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          <a
                            href={appointmentLetter}
                            target="blank"
                            className=" text-blue-600 font-bold hover:underline ml-[20px] md:ml-[40px]"
                          >
                            View
                          </a>
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium text-blue-600 flex flex-row"
                        >
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

export default Placement;

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
