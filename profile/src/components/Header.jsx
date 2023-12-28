import React from 'react'
import {Hashlink} from 'react-router-hash-link'
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import img1 from "../assets/teacher.svg";
import img2 from "../assets/student.svg";
import img3 from "../assets/employer.svg";
import img4 from "../assets/parent.svg";
import img5 from "../assets/alumini.svg";

import "../styles/header.css"


export default function StickyNavbar() {
    const [openNav, setOpenNav] = React.useState(false);
    
    // function getDescription(e){
    //   e.target.src = 'none';
    // }

    React.useEffect(() => {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }, []);
    


    const navList = (
      <ul className="mt-2  mb-4 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-12">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
          
        >
        <a href="#" className="flex flex-row items-center logtype lg:flex-col" >
            <img src={img2} alt="student" height={30} width={30}  />
            <p className='lg:ml-0 ml-4'>Student</p>
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="#" className="flex flex-row items-center logtype lg:flex-col" >
            <img src={img1} alt="teacher" height={30} width={30}/>
            <p className='lg:ml-0 ml-4'>Teacher/techStaff</p>
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="#" className="flex flex-row items-center logtype lg:flex-col" style={{":hover":{cursor:"pointer"}}}>
            <img src={img3} alt="employer" height={30} width={30}/>
            <p className='lg:ml-0 ml-4'>Employer</p>
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="#" className="flex flex-row items-center logtype lg:flex-col" style={{":hover":{cursor:"pointer"}}}>
            <img src={img4} alt="parents" height={30} width={30}/>
            <p className='lg:ml-0 ml-4'>Parents</p>
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="#" className="flex flex-row items-center logtype lg:flex-col " style={{":hover":{cursor:"pointer"}}}>
            <img src={img5} alt="alumni" height={30} width={30}/>
            <p className='lg:ml-0 ml-4'>Alumni</p>
          </a>
        </Typography>
      </ul>
    );
    return (<>
      <div className=" max-h-[768px] w-[calc(100% + 48px)]">
        <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
            <Typography
              as="a"
              href="#"
              className="mr-4 cursor-pointer py-1.5 font-medium"
            >
              <img src="https://dtu.irins.org/assets/institute/1319/images/logo.png" alt="" />
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
          <MobileNav 
          className='text-black'
          open={openNav}>
            {navList}
          
          </MobileNav>
        </Navbar>
        
      </div>
      <div className='borderClass'></div>
      </>
    );
}
