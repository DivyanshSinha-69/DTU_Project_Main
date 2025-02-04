import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import excel from "../assets/excel.svg";
import * as XLSX from "xlsx";
import Loader from "./Loader";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    info: "studentpersonaldetails",
    courseGroup: "Btech",
    year1: "2K20",
    year2: "2K25",
  });
  const [loader, setLoader] = useState(true);
  const [clicked, setClicked] = useState(false);

  const handleDownloadExcel = () => {
    // Create a copy of TABLE_ROWS to avoid modifying the original data
    const rowsWithLinks = TABLE_ROWS.map((rowData) => {
      const updatedRowData = { ...rowData };

      // Iterate over the PDF columns and convert them to links
      [
        "gateScoreCard",
        "manuscript",
        "appointmentLetter",
        "offerLetter",
        "companyRegCertificate",
      ].forEach((column) => {
        if (updatedRowData[column]) {
          // const pdfBlob = base64ToBlob(updatedRowData[column], "application/pdf");
          // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
          // updatedRowData[column] = pdfBlobUrl; // Replace the base64 data with the blob URL
          updatedRowData[column] = updatedRowData[column];
        }
      });

      return updatedRowData;
    });

    // Create Excel sheet with modified rows
    const ws = XLSX.utils.json_to_sheet(rowsWithLinks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    if (
      formData.info === "mtecheducationaldetails" &&
      formData.courseGroup === "Btech"
    ) {
      XLSX.writeFile(wb, `btecheducationaldetails.xlsx`);
    } else {
      XLSX.writeFile(wb, `${formData.info}.xlsx`);
    }
  };

  // const handleDownloadExcel = () => {
  //   // Assuming TABLE_ROWS is your data

  //   const tableRows = TABLE_ROWS;

  //   // Make a POST request to the server
  //   axios.post('http://64.227.135.99:3001/ece/admin/getexcel', { tableRows }, { responseType: 'blob' })
  //     .then(response => {
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'output.xlsx');
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // };

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
        "http://64.227.135.99:3001/ece/admin/getdata",
        {
          ...formData,
        },
        {
          withCredentials: true,
        },
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
      // if (pdfSrc) {
      //   const blob = base64ToBlob(pdfSrc, "application/pdf");
      //   const blobUrl = URL.createObjectURL(blob);
      //   window.open(blobUrl, "_blank");
      // }
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
          <div>
            <h3 className="font1 ml-2 text-lg mt-2">Information Type</h3>
            <div className="p-2">
              <div class="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                <nav class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-react"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-react"
                          >
                            <input
                              id="vertical-list-react"
                              type="radio"
                              name="info"
                              value="studentpersonaldetails"
                              defaultChecked
                              onChange={handleChange}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Personal Details
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              name="info"
                              onChange={handleChange}
                              value="mtecheducationaldetails"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Educational Details
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-vue"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-vue"
                          >
                            <input
                              id="vertical-list-vue"
                              type="radio"
                              name="info"
                              onChange={handleChange}
                              value="eventdetails"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Professional Activities
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              name="info"
                              onChange={handleChange}
                              value="publicationdetails"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Publication Details
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              name="info"
                              onChange={handleChange}
                              value="placementdata"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Placement Details
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              onChange={handleChange}
                              name="info"
                              value="highereducationdetails"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Higher Education
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              name="info"
                              value="entrepreneurdetails"
                              onChange={handleChange}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Entrepreneurship details
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-react"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-react"
                          >
                            <input
                              id="vertical-list-react"
                              type="radio"
                              name="info"
                              value="interInstituteEventDetails"
                              onChange={handleChange}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Inter Institute Activities
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-react"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-react"
                          >
                            <input
                              id="vertical-list-react"
                              type="radio"
                              name="info"
                              value="defaulters"
                              onChange={handleChange}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        Defaulters
                      </p>
                    </label>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font1 ml-2 text-lg mt-2">Course</h3>
            <div className="p-2">
              <div class="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                <nav class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-react"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-react"
                          >
                            <input
                              id="vertical-list-react"
                              type="radio"
                              name="courseGroup"
                              onChange={handleChange}
                              value="Btech"
                              defaultChecked
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        B.Tech
                      </p>
                    </label>
                  </div>
                  <div
                    role="button"
                    class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <label
                      htmlFor="vertical-list-svelte"
                      class="flex items-center w-full px-3 py-2 cursor-pointer"
                    >
                      <div class="grid mr-3 place-items-center">
                        <div class="inline-flex items-center">
                          <label
                            class="relative flex items-center p-0 rounded-full cursor-pointer"
                            htmlFor="vertical-list-svelte"
                          >
                            <input
                              id="vertical-list-svelte"
                              type="radio"
                              onChange={handleChange}
                              value="Mtech"
                              name="courseGroup"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        M.Tech
                      </p>
                    </label>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font1 ml-2 text-lg mt-2">Year</h3>
            <div className="text-center pt-2 pb-5 font1">
              <input
                type="text"
                name="year1"
                onChange={handleChange}
                className="w-[80px] text-center rounded-sm p-1 font1 outline-none mx-2"
                placeholder="XXXX"
                value={formData.year1}
              />
              to
              <input
                type="text"
                name="year2"
                onChange={handleChange}
                className="w-[80px] text-center rounded-sm p-1 font1 outline-none mx-2"
                placeholder="XXXX"
                value={formData.year2}
              />
            </div>
          </div>
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

              {TABLE_HEAD.length > 0 ? (
                <div className="text-center m-5">
                  <button
                    onClick={handleDownloadExcel}
                    className="flex mx-auto bg-[#191b28] w-[125px] p-2 rounded-lg text-white hover:scale-[105%] font1 hover:bg-[#0a4b26] transition-transform ease-in"
                  >
                    <img src={excel} alt="XLSX" className="h-7 w-7" />
                    <span className="my-auto ml-2">Download</span>
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

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
