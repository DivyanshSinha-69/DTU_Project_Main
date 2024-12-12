import React, { useEffect, useState } from "react";
import axios from "axios";
import teacherImg from "../../assets/teacherImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import ResearchProjects from "./Tables/ResearchProjects";
import Association from "./Tables/Association";
import Visits from "./Tables/Visits";
import PhdGuidance from "./Tables/PhdGuidance";
import "../../styles/popup.css";
import { Toaster } from 'react-hot-toast';
import Loader from "../Loader";

const Faculty = () => {
  const [isBlurActive, setBlurActive] = useState(false);
  const [loader, setLoader] = useState(true);

  // Dummy data for the teacher (replace with actual data later)
  const teacherData = {
    name: "Dr. John Does",
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
            <div className="h-auto w-full flex flex-wrap justify-center mx-auto">
              <div className="img-container m-2">
                <img
                  className="rounded-xl h-[175px] w-[175px]"
                  src={teacherImg}
                  alt="Teacher profile"
                />
              </div>
              <div className="details-container m-2">
                <h1 className="font-extrabold text-3xl">{teacherData.name}</h1>
                <h2 className="font-bold text-1xl">ID: {teacherData.employeeId}</h2>
                <h2 className="text-lg">{teacherData.designation}</h2>
                <h2>Department: {teacherData.department}</h2>
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
            
            <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
              <PhdGuidance setBlurActive={setBlurActive} />
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

export default Faculty;
