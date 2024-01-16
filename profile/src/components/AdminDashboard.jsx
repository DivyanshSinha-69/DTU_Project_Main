import axios from "axios";
import React, { useState } from "react";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    info: "studentpersonaldetails",
    courseGroup: "Btech",
    year1:"2K20",
    year2:"2K25"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit=async()=>{
    
    try {
      const response=await axios.post("http://localhost:3001/ece/admin/getdata",{
        ...formData
      },{
        withCredentials:true,
      }
      );
    } catch (error) {
      console.error(error);
    }
  }

  

  return (
    <div className="bg-[#fafafa]">
      <div className="flex gap-2 h-full">
        <div className="bg-[#e8e7e7] w-[18rem]  rounded-r-xl opacity-[0.8]">
          <h3 className="font1 text-center text-2xl mt-2 underline">filters</h3>
          <div className="text-right ">
            <button
            onClick={handleSubmit}
             className="mx-2 bg-[#1f2937] p-2 text-white rounded-lg hover:bg-[#1f2937c7] hover:scale-[105%] transition-transform ease-in">
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
              />
              to
              <input
                type="text"
                name="year2"
                onChange={handleChange}
                className="w-[80px] text-center rounded-sm p-1 font1 outline-none mx-2"
                placeholder="XXXX"
              />
            </div>
          </div>
        </div>
        <div className="bg-[#fafafa] h-screen w-[80%]"></div>
      </div>
    </div>
  );
};

export default Dashboard;
