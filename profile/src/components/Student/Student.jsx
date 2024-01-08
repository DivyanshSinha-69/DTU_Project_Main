import React, { useEffect, useState } from "react";
import StudentProfessionalSkills from "./Tables/ProfessionalSkills";
import axios from "axios";
import { setProfessionalSkills } from "../../redux/reducers/UserProfessionalSkills";
import { useDispatch, useSelector } from "react-redux";

import studImg from "../../assets/studImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import Enterprenur from "./Tables/Enterprenur";
import Placement from "./Tables/Placement";
import "../../styles/popup.css";
import { setPersonalDetails } from "../../redux/reducers/UserPersonalDetails";
import Test from "../test";
import { setUserImage } from '../../redux/reducers/UserImage';
// import Placement from "./studentportaltables/Placement";

const Student = () => {
  const { studentName, RollNo, Course, CourseName } = useSelector(
    (state) => state.auth.user
  );
  const [isBlurActive, setBlurActive] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  
  const {image} = useSelector(
    (state) => state.userImage
  )
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch personal details

      
        const personalDetailsResponse = await axios.post(
          "http://localhost:3001/ece/student/personaldetails",
          {
            rollno: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        dispatch(setPersonalDetails(personalDetailsResponse.data.user));


        const response = await axios.post(
          "http://localhost:3001/ece/student/profskills",
          {
            rollno: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        dispatch(setProfessionalSkills(response.data.user));
        
      } catch (error) {

        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const refresh = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/ece/student/profskills",
        {
          rollno: RollNo,
          email: "arpangoyal@gmail.com",
        },
        {
          withCredentials: true,
        }
      );

      // Now you can access the data, for example:
      dispatch(setProfessionalSkills(response.data.user));
      // console.log(ProfessionalSkills.ProfessionalSkills);
    } catch (error) {
      // Handle the error
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-[#FAFAFA]">
      <button
        type="button"
        onClick={refresh}
        className="py-2.5 px-5 mt-4 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Refresh
      </button>

      <div
        className={`h-auto w-full mt-10 ${isBlurActive ? "blur-effect" : ""}`}
      >
        <div className="h-[30%] w-[70%] flex flex-wrap justify-around mx-auto">
          <div className="h-100% flex flex-col justify-center items-center m-2">
            <h1 className="font-extrabold text-3xl text-center">
              {studentName}
            </h1>
            <h2 className="font-bold text-1xl text-center">{RollNo}</h2>
            <h2 className="text-lg text-center">{CourseName}</h2>
            <h2>{Course}, DTU</h2>
          </div>
          <div className="mt-[80px]">
            <img
              className="rounded-xl h-[175px] w-[175px]"
              src={image||studImg}
              alt="profile img"
            />
            {console.log(imgSrc)}
            <div className="translate-y-[-30px] translate-x-[150px] w-[100px]">
              {/* <label for="files" class="btn"> */}
                <Test  setImgSrc={setImgSrc}/>
                {/* <img
                  src={uploadImg}
                  alt="+"
                  className="p-2 h-10 w-10 bg-gray-800 rounded-full cursor-pointer hover:invert hover:scale-[130%] transition-transform ease-in "
                /> */}
              {/* </label> */}
              {/* <input
                id="files"
                accept="image/png, image/jpeg"
                style={{ visibility: "hidden" }}
                type="file"
                className="w-[100px]"
              /> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`pt-10 ${
          isBlurActive ? "blur-effect" : ""
        }`}
      >
        <PersonalDetails setBlurActive={setBlurActive} />
      </div>

      <div
        className={`pt-10 ${
          isBlurActive ? "blur-effect" : ""
        }`}
      >
        <StudentProfessionalSkills setBlurActive={setBlurActive} />
      </div>

      <div
        className={`pt-10  ${
          isBlurActive ? "blur-effect" : ""
        }`}
      >
        <Placement setBlurActive={setBlurActive} />
      </div>

      <div
        className={`pt-10  ${
          isBlurActive ? "blur-effect" : ""
        }`}
      >
        <Enterprenur setBlurActive={setBlurActive} />
      </div>
    </div>
  );
};


export default Student;
