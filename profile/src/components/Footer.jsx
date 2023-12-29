import { Typography } from "@material-tailwind/react";
import dtulogo from "../assets/dtulogo.png";

 
export default function Footer() {
  
  return (
    <footer className="w-full bg-[#EAEAEA] text-black pl-4 pr-4 pt-2 pb-2 ">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-black  bg-[#EAEAEA] text-center md:justify-between backdrop-filter backdrop-blur-md">
      <img src={dtulogo} alt="dtulogo" className="h-20 w-30"/>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Administration
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Admissions
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      {/* <hr className="my-4 border-blue-gray-50" /> */}
      <hr class="w-1/2 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-5 dark:bg-gray-400" />
      <Typography color="blue-gray" className="mb-2 text-center font-bold">
        &copy; DELHI TECHNOLOGICAL UNIVERSITY
      </Typography>
    </footer>
  );
}