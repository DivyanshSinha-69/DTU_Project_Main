import React, { useEffect, useState } from "react";
import StudentProfessionalSkills from "./Tables/ProfessionalSkills";
import axios from "axios";
import { setProfessionalSkills } from "../../redux/reducers/UserProfessionalSkills";
import { useDispatch, useSelector } from "react-redux";

import studImg from "../../assets/studImg.png";
import PersonalDetails from "./Tables/PersonalDetails";
import Entreprenur from "./Tables/Entreprenur";
import Placement from "./Tables/Placement";
import Publication from "./Tables/Publication"
import "../../styles/popup.css";
import { setPersonalDetails } from "../../redux/reducers/UserPersonalDetails";
import Test from "./ImageUpload";
import { setPlacement } from "../../redux/reducers/UserPlacementDetail";
import MtechEducationDetails from "./Tables/MtechEducationDetails";
import { setMtechEducation } from "../../redux/reducers/UserMtechEducationalDetails";
import { setEntrepreneurDetails } from "../../redux/reducers/UserEntrepreneurDetails";
import HigherEducation from "./Tables/HigherEducation";
import { setHigherEducationDetails } from "../../redux/reducers/UserHigherEducationDetails";
import { setPublicationDetails } from "../../redux/reducers/UserPublicationDetails"
// import Placement from "./studentportaltables/Placement";

const Student = () => {
  const { studentName, RollNo, Course, CourseName } = useSelector(
    (state) => state.auth.user
  );
  const [isBlurActive, setBlurActive] = useState(false);

  const { image } = useSelector((state) => state.userImage);
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

        //getmtechedu
        if (Course === "Mtech") {
          try {
            const mtechEducationDetailsResponse = await axios.post(
              "http://localhost:3001/ece/student/getmtecheducationdetails",
              {
                rollno: RollNo,
              },
              {
                withCredentials: true,
              }
            );
            dispatch(
              setMtechEducation(mtechEducationDetailsResponse.data.user)
            );
          } catch (error) {
            // Handle error
            console.error(error);
          }
        }

        const entrepreneurDetails=await axios.post(
          "http://localhost:3001/ece/student/getentrepreneurdetails",
          {
            rollno:RollNo,
          },{
            withCredentials:true,
          }
          
        )
        dispatch(setEntrepreneurDetails(entrepreneurDetails.data.user));

        const higherEducationDetails = await axios.post(
        "http://localhost:3001/ece/student/gethighereducationdetails",{
          rollno:RollNo,
        },{
          withCredentials:true,
        }
        )
        dispatch(setHigherEducationDetails(higherEducationDetails.data.user))

        const publicationDetails = await axios.post(
        "http://localhost:3001/ece/student/publication",{
          rollno:RollNo,
        },{
          withCredentials:true,
        }
        )
        dispatch(setPublicationDetails(publicationDetails.data.user))

        const placementresponse = await axios.post(
          "http://localhost:3001/ece/student/placement",
          {
            rollno: RollNo,
          },
          {
            withCredentials: true,
          }
        );
        dispatch(setPlacement(placementresponse.data.user));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="bg-[#FAFAFA] pt-10">
      <div
        className={`h-auto w-full ${isBlurActive ? "blur-effect" : ""}`}
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
          <div className="h-[175px] w-[175px] justify-center items-center m-2">
            <img
              className="my-auto rounded-xl h-[175px] w-[175px]"
              src={image || studImg}
              alt="profile img"
            />

            <div className="translate-y-[-30px] translate-x-[150px] w-[100px]">
              <Test />
            </div>
          </div>
        </div>
      </div>

      <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
        <PersonalDetails setBlurActive={setBlurActive} />
      </div>

      {Course === "Mtech" && (
        <>
          <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
            <MtechEducationDetails setBlurActive={setBlurActive} />
          </div>
        </>
      )}

      <div className={`pt-10 ${isBlurActive ? "blur-effect" : ""}`}>
        <StudentProfessionalSkills setBlurActive={setBlurActive} />
      </div>

      <div className={`pt-10  ${isBlurActive ? "blur-effect" : ""}`}>
        <Publication setBlurActive={setBlurActive} />
      </div>

      <div className={`pt-10  ${isBlurActive ? "blur-effect" : ""}`}>
        <Placement setBlurActive={setBlurActive} />
      </div>

      <div className={`pt-10  ${isBlurActive ? "blur-effect" : ""}`}>
        <HigherEducation setBlurActive={setBlurActive} />
      </div>
      
      <div className={`pt-10  ${isBlurActive ? "blur-effect" : ""}`}>
        <Entreprenur setBlurActive={setBlurActive} />
      </div>

    </div>
  );
};

export default Student;
