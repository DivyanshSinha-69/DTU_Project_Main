import React, { useEffect, useState } from "react";
import axios from "axios";
// import teacherImg from "../../assets/teacherImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import ResearchProjects from "./Tables/ResearchProjects";

import Association from "./Tables/Association";
import Visits from "./Tables/Visits";

import "../../styles/popup.css";
import { Toaster } from 'react-hot-toast';
import Loader from "../Loader";

const Teacher = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);

  // Dummy data for the teacher (replace with actual data later)
  const teacherData = {
    name: "Dr. John Doe",
    employeeId: "12345",
    department: "ECE",
    designation: "Professor",
  };

  useEffect(() => {
    // Mocking loader delay for demo purposes
    setTimeout(() => setLoader(false), 1000);
  }, []);

  return (
    <div>
      {loader ? <Loader /> : (
        <>
          <div className="bg-[#FAFAFA] pt-10">
            <div className={`h-auto w-full ${isBlurActive ? "blur-effect" : ""}`}>
              <div className="h-[30%] w-[70%] flex flex-wrap justify-around mx-auto">
                <div className="!h-[40px] flex flex-col justify-center items-center m-2">
                  <h1 className="font-extrabold text-3xl text-center">{teacherData.name}</h1>
                  <h2 className="font-bold text-1xl text-center">ID: {teacherData.employeeId}</h2>
                  <h2 className="text-lg text-center">{teacherData.designation}</h2>
                  <h2>Department: {teacherData.department}</h2>
                </div>
                <div className="h-[175px] w-[175px] justify-center items-center m-2">
                  <img
                    className="my-auto rounded-xl h-[175px] w-[175px]"
                    // src={teacherImg}
                    alt="Teacher profile"
                  />
                </div>
              </div>
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PersonalDetails setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <Association setBlurActive={setBlurActive} />
            </div>
            
            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <ResearchProjects setBlurActive={setBlurActive} />
            </div>

            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <Visits setBlurActive={setBlurActive} />
            </div>
            
            
            

            

            <Toaster 
              toastOptions={{
                className: '',
                duration: 1000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Teacher;
