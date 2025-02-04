import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import img from "../../../assets/delete.svg";
import addImg from "../../../assets/add.svg";
import axios from "axios";
import AddPublicationPopup from "../PopupWindow/AddPublicationPopup.jsx";
import { deletePublicationDetails } from "../../../redux/reducers/UserPublicationDetails.jsx";
import linkImg from "../../../assets/hyperlink.svg";
import toast from "react-hot-toast";

const Publication = ({ setBlurActive }) => {
  const PublicationDetails = useSelector((state) => state.publicationDetails);
  const dispatch = useDispatch();
  const TABLE_HEAD = [
    "Published In",
    "Article Title",
    "Publication DOI",
    "Published Article Link",
    "Manuscript",
    "",
  ];
  const TABLE_ROWS = PublicationDetails.PublicationDetails || [];

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
        "http://64.227.135.99:3001/ece/student/deletepublication",
        {
          data: {
            ID: ID,
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.message);
      dispatch(deletePublicationDetails({ ID }));
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
          <p className="p-3 text-2xl font1 border-top my-auto">
            Publication Details
            <br />{" "}
            <span className="text-lg text-red-600">
              (If You have recived the acceptance and paper is not yet published{" "}
              <br />
              enter DOI as "In Progress" and add a drive link of paper in place
              of article link. )
            </span>
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
              <div className="h-[650px]  w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-10 md:inset-20 flex items-center justify-center">
                <AddPublicationPopup closeModal={close} name={"ADD"} />
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
                    publishedIn,
                    articleTitle,
                    publicationDoi,
                    publishedArticleLink,
                    manuscript,
                  },
                  index,
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
                          {publishedIn}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {articleTitle}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {publicationDoi}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          <a
                            href={publishedArticleLink}
                            target="blank"
                            className="hover:underline"
                          >
                            <img
                              className=" md:ml-[50px] h-5 w-10 hover:invert hover:scale-125 transition-transform ease-in "
                              src={linkImg}
                              alt="link"
                            ></img>
                          </a>
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          <a
                            href={manuscript}
                            target="blank"
                            className=" text-blue-600 font-bold hover:underline ml-[17px]"
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
                },
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Publication;

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
