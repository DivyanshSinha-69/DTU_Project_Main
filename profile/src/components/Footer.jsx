import { Typography } from "@material-tailwind/react";
import dtulogo from "../assets/dtulogo.png";

 
export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pl-4 pr-4 pt-2 pb-2">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-white  bg-black  text-center md:justify-between">
      <img src={dtulogo} alt="dtulogo" className="h-20 w-30"/>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Administration
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Admissions
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-4 border-blue-gray-50" />
      <Typography color="blue-gray" className="text-center font-normal">
        &copy; DELHI TECHNOLOGICAL UNIVERSITY
      </Typography>
    </footer>
  );
}