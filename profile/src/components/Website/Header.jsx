import React from "react";
import { HashLink } from "react-router-hash-link";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

import img1 from "../../assets/teacher.svg";
import img2 from "../../assets/student.svg";
import img3 from "../../assets/employer.svg";
import img4 from "../../assets/parent.svg";
import img5 from "../../assets/alumini.svg";
import dtulogo from "../../assets/dtuSVG.svg";
import homeimg from "../../assets/homepage.svg";
import portalimg from "../../assets/portal.svg"

import "../../styles/header.css";
import { logout } from "../../redux/reducers/AuthSlice";
import axios from "axios";
import { setRole } from "../../redux/reducers/UserSlice";
import { useNavigate } from "react-router-dom";
import { removeProfessionalSkills } from "../../redux/reducers/UserProfessionalSkills";


export default function StickyNavbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {role}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [openNav, setOpenNav] = React.useState(false);

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
      // Make a POST request to your server with login credentials
      const response = await axios.get("http://localhost:3001/logout",{
        withCredentials: true,
      });

      const userDetails = response.data;
      dispatch(logout(userDetails.user));
      dispatch(setRole("null"));
      dispatch(removeProfessionalSkills("null"));
      // dispatch(setRole("null"));
      navigate("/");
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
    }
  };


  const navList = (
    <ul className="mt-2  mb-4 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {isAuthenticated === false && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          
          <HashLink
            to="/login"
            className="flex flex-row items-center logtype lg:flex-col"
          >
            <img src={img2} alt="student" height={30} width={30} />
            <p className="lg:ml-0 ml-4">Student</p>
          </HashLink>
        </Typography>
      )}

      {isAuthenticated === false && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <HashLink
            to="/login"
            className="flex flex-row items-center logtype lg:flex-col"
          >
            <img src={img1} alt="teacher" height={30} width={30} />
            <p className="lg:ml-0 ml-4">Teacher/techStaff</p>
          </HashLink>
        </Typography>
      )}

      {isAuthenticated === false && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <HashLink
            to="/login"
            className="flex flex-row items-center logtype lg:flex-col"
            style={{ ":hover": { cursor: "pointer" } }}
          >
            <img src={img3} alt="employer" height={30} width={30} />
            <p className="lg:ml-0 ml-4">Admin</p>
          </HashLink>
        </Typography>
      )}

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          to="/parents"
          className="flex flex-row items-center logtype lg:flex-col"
          style={{ ":hover": { cursor: "pointer" } }}
        >
          <img src={img4} alt="parents" height={30} width={30} />
          <p className="lg:ml-0 ml-4">Parents</p>
        </HashLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          to="/alumini"
          className="flex flex-row items-center logtype lg:flex-col "
          style={{ ":hover": { cursor: "pointer" } }}
        >
          <img src={img5} alt="alumni" height={30} width={30} />
          <p className="lg:ml-0 ml-4">Alumni</p>
        </HashLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          to="/"
          className="flex flex-row items-center logtype lg:flex-col "
          style={{ ":hover": { cursor: "pointer" } }}
        >
          <img src={homeimg} alt="alumni" height={30} width={30} />
          <p className="lg:ml-0 ml-4">Home</p>
        </HashLink>
      </Typography>
      {isAuthenticated === true && (
        <>
        <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          to={`${role}/portal`}
          className="flex flex-row items-center logtype lg:flex-col "
          style={{ ":hover": { cursor: "pointer" } }}
        >
          <img src={portalimg} alt="alumni" height={30} width={30} />
          <p className="lg:ml-0 ml-4">Myportal</p>
        </HashLink>
      </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <HashLink
            to="/"
            className="flex flex-row items-center lg:flex-col "
            style={{ ":hover": { cursor: "pointer" } }}
          >
            {/* <img src={img5} alt="alumni" height={30} width={30} /> */}
            <button onClick={handleLogout} type="button" className="text-white bg-gray-800  focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Logout</button>
            {/* <button onClick={handleLogout} className="lg:ml-0 ml-4">Logout</button> */}
          </HashLink>
        </Typography>
        </>
        
      )}
      

    </ul>
  );
      
  

  return (
    <>
      <div className="font1 bg-inherit border-0 max-h-[768px] w-[calc(100% + 48px)] shadow-none">
        <Navbar className="bg-white border-0 top-0 z-10 h-max max-w-full rounded-nonep-0 lg:p-0 shadow-none">
          <div className="flex  bg-inherit border-0 items-center justify-between rounded-none text-blue-gray-900">
            <Typography
              as={HashLink}
              to="/"
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
                className="ml-auto h-6 w-6 text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
            <MobileNav
              className="text-black bg-white customclass "
              style={{ zIndex: 15 }}
              open={openNav}
              onClick={closeMobileNav}
            >
              {navList}
            </MobileNav>
          )}
        </Navbar>
      </div>
    </>
  );
}
