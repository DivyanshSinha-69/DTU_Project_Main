import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import excel from "../assets/excel.svg";
import Loader from "./Loader";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    info: "studentPersonalDetails",
    courseGroup: "Btech",
    year1: "2K20",
    year2: "2K25",
  });
  const [loader, setLoader] = useState(true);
  const [clicked, setClicked] = useState(false);

  // Remove the entire handleDownloadExcel function since it's not needed
  const handleDownloadExcel = () => {
    // This is just a placeholder now - you can remove the button from the JSX
    console.log("Excel download feature is disabled");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [TABLE_HEAD, setTABLE_HEAD] = useState([]);
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);

  const handleSubmit = async () => {
    setLoader(true);
    setClicked(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ece/admin/getdata`,
        {
          ...formData,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.data.length > 0) {
        setTABLE_HEAD(Object.keys(response.data.data[0]));
        setTABLE_ROWS(response.data.data);
        setLoader(false);
      } else {
        setTABLE_HEAD([]);
        setTABLE_ROWS([]);
        setClicked(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const handleOpenPdf = (pdfSrc) => {
    return () => {
      if (pdfSrc) {
        window.open(pdfSrc, "_blank");
      }
    };
  };

  return (
    <div className="bg-[#fafafa] w-full ">
      <div className="flex gap-2 h-full ">
        <div className="bg-[#e8e7e7] w-[18rem]  rounded-r-xl opacity-[0.8]">
          <h3 className="font1 text-center text-2xl mt-2 underline">filters</h3>
          <div className="text-right ">
            <button
              onClick={handleSubmit}
              className="mx-2 bg-[#1f2937] p-2 text-white rounded-lg hover:bg-[#1f2937c7] hover:scale-[105%] transition-transform ease-in"
            >
              Apply
            </button>
          </div>
          {/* ... rest of your filter JSX remains the same ... */}
        </div>
        {loader && clicked ? (
          <div className="mx-auto ">
            <Loader />
          </div>
        ) : (
          <>
            <div className="w-[80%] overflow-hidden">
              {TABLE_HEAD.length > 0 ? (
                <Card
                  className={`max-h-[650px] h-[auto] w-[90%] mx-auto mt-7 pl-10 pr-10 card overflow-x-scroll ${
                    TABLE_ROWS.length > 10 ? "overflow-y-scroll" : ""
                  }`}
                >
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
                      {TABLE_ROWS.map((rowData, rowIndex) => (
                        <tr key={rowIndex}>
                          {TABLE_HEAD.map((head, headIndex) => (
                            <td
                              key={head}
                              className={
                                headIndex === TABLE_HEAD.length
                                  ? "p-4"
                                  : "p-4 border-b border-blue-gray-50"
                              }
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {head === "gateScoreCard" ||
                                head === "manuscript" ||
                                head === "appointmentLetter" ||
                                head === "offerLetter" ||
                                head === "certificate" ||
                                head === "companyRegCertificate" ? (
                                  <button
                                    onClick={handleOpenPdf(rowData[head])}
                                    className=" text-blue-600 font-bold hover:underline"
                                  >
                                    View
                                  </button>
                                ) : head === "companyLink" ? (
                                  <a
                                    href={rowData[head]}
                                    className="text-blue-600 font-bold hover:underline"
                                    target={"blank"}
                                  >
                                    link
                                  </a>
                                ) : (
                                  rowData[head]
                                )}
                              </Typography>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ) : null}

              {/* Remove or comment out the download button section */}
              {/* {TABLE_HEAD.length > 0 ? (
                <div className="text-center m-5">
                  <button
                    onClick={handleDownloadExcel}
                    className="flex mx-auto bg-[#191b28] w-[125px] p-2 rounded-lg text-white hover:scale-[105%] font1 hover:bg-[#0a4b26] transition-transform ease-in"
                  >
                    <img src={excel} alt="XLSX" className="h-7 w-7" />
                    <span className="my-auto ml-2">Download</span>
                  </button>
                </div>
              ) : null} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
