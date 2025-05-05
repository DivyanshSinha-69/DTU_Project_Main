import React from "react";
import { HashLink } from "react-router-hash-link";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

import img1 from "../../assets/teacher.png";
import img2 from "../../assets/student.png";
import img3 from "../../assets/admin.png";
import img4 from "../../assets/parent.svg";
import img5 from "../../assets/alumini.svg";
import img6 from "../../assets/alumni.png";
import img7 from "../../assets/department.png";

import dtulogo from "../../assets/dtuSVG.svg";
import homeimg from "../../assets/homepage.svg";
import portalimg from "../../assets/portal.svg";

import "../../styles/header.css";
import { logout } from "../../redux/reducers/AuthSlice";
import axios from "axios";
import { setRole } from "../../redux/reducers/UserSlice";
import { useNavigate } from "react-router-dom";
import { removeProfessionalSkills } from "../../redux/reducers/student/UserProfessionalSkills";
import { removePersonalDetails } from "../../redux/reducers/student/UserPersonalDetails";
import { removeUserImage } from "../../redux/reducers/student/UserImage";
import { removePlacement } from "../../redux/reducers/student/UserPlacementDetail";
import { removeMtechEducation } from "../../redux/reducers/student/UserMtechEducationalDetails";
import { removeEntrepreneurDetails } from "../../redux/reducers/student/UserEntrepreneurDetails";
import { removeHigherEducationDetails } from "../../redux/reducers/student/UserHigherEducationDetails";
import { removeInterInstitute } from "../../redux/reducers/student/UserInterInstituteDetails";
import { removeBtechEducation } from "../../redux/reducers/student/UserBtechEducationalDetails";

export default function StickyNavbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openNav, setOpenNav] = React.useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id, department_id } = user;

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const closeMobileNav = () => {
    setOpenNav(!openNav);
  };
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      let logoutUrl = `${process.env.REACT_APP_BACKEND_URL}/logout`; // Default logout endpoint
      let logoutData = {}; // Data payload for logout

      if (role === "faculty" && faculty_id) {
        logoutUrl = `${process.env.REACT_APP_BACKEND_URL}/ece/faculty/logout`; // Faculty-specific logout
        logoutData.faculty_id = faculty_id;
      } else if (role === "department") {
        logoutUrl = `${process.env.REACT_APP_BACKEND_URL}/ece/department/logout`;
        logoutData = { department_id }; // Include department_id in the request body
      }

      let response;
      if (role === "student") {
        // Make a GET request for student logout
        response = await axios.get(logoutUrl, { withCredentials: true });
      } else {
        // Make a POST request for faculty or other roles

        response = await axios.post(logoutUrl, logoutData, {
          withCredentials: true,
        });
      }

      if (response.status === 200) {
        console.log("✅ Logged out successfully");

        // Dispatch logout action to clear Redux state
        dispatch(logout());

        // Clear additional user-specific data
        dispatch(setRole(null));
        dispatch(removeProfessionalSkills());
        dispatch(removePersonalDetails());
        dispatch(removeUserImage());
        dispatch(removePlacement());
        dispatch(removeMtechEducation());
        dispatch(removeEntrepreneurDetails());
        dispatch(removeHigherEducationDetails());
        dispatch(removeInterInstitute());
        dispatch(removeBtechEducation());

        // Redirect to homepage after logout
        navigate("/");
      } else {
        console.error("⚠️ Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  const navList = (
    <ul className="mt-2  mb-4 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {isAuthenticated === false && (
        <>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to="/login?role=student"
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={img2} alt="student" height={30} width={30} />
              <p className="lg:ml-0 ml-4">Student</p>
            </HashLink>
          </Typography>

          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to="/login?role=faculty"
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={img1} alt="teacher" height={30} width={30} />
              <p className="lg:ml-0 ml-4">Faculty</p>
            </HashLink>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to="/login?role=alumni"
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={img6} alt="employer" height={30} width={30} />
              <p className="lg:ml-0 ml-4">Alumni</p>
            </HashLink>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to="/login?role=department"
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={img7} alt="employer" height={30} width={30} />
              <p className="lg:ml-0 ml-4">HOD Office</p>
            </HashLink>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to="/login?role=admin"
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={img3} alt="employer" height={30} width={30} />
              <p className="lg:ml-0 ml-4">Admin</p>
            </HashLink>
          </Typography>
        </>
      )}

      {isAuthenticated === true && (
        <>
          {/* MyPortal Section */}
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:translate-y-[-5px] transition-transform ease-in"
          >
            <HashLink
              to={`${role}`}
              className="flex flex-row items-center lg:flex-col"
            >
              <img src={portalimg} alt="portal" height={30} width={30} />
              <p className="lg:ml-0 ml-4">My Portal</p>
            </HashLink>
          </Typography>

          {/* Logout Button */}
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal"
          >
            <HashLink to="/" className="flex flex-row items-center lg:flex-col">
              <button
                onClick={handleLogout}
                type="button"
                className="md:mt-[10px] text-white bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Logout
              </button>
            </HashLink>
          </Typography>
        </>
      )}
    </ul>
  );

  return (
    <>
      <div className="font1 bg-inherit border-0 max-h-[768px] w-[calc(100% + 48px)] shadow-none">
        <Navbar className="bg-white border-0 top-0 z-50 h-max w-full rounded-none p-0 lg:p-0 shadow-none fixed">
          <div className="flex  bg-inherit border-0 items-center justify-between rounded-none text-blue-gray-900">
            <Typography
              as="div"
              className="mr-4 cursor-pointer py-0 font-medium "
            >
              <div className="flex justify-center text-align">
                <img src={dtulogo} alt="dtulogo" className="h-20 w-30" />
                <p className="flex tracking-wide justify-center items-center text-sm lg:text-2xl p-3 text-gray-700 font-bold">
                  Delhi Technological University
                </p>
              </div>
            </Typography>

            <div className="flex items-center gap-4">
              <div className=" mr-4 hidden lg:block text-black">{navList}</div>
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden translate-x-[-30px] translate-y-[-10px]"
                ripple={false}
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </IconButton>
            </div>
          </div>

          {openNav === true && (
            <Collapse
              className="text-black bg-white customclass "
              style={{ zIndex: 15 }}
              open={openNav}
              onClick={closeMobileNav}
            >
              {navList}
            </Collapse>
          )}
        </Navbar>
      </div>
    </>
  );
}
