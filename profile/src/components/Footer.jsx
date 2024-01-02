import { Typography } from "@material-tailwind/react";
import dtulogo from "../assets/dtuSVG.svg";


 
export default function Footer() {
  
  return (
    <footer className="w-full font1 bg-gray-800 text-black pl-4 pr-4 pt-2 pb-2 ">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-gray-400  bg-gray-800 text-center md:justify-between backdrop-filter backdrop-blur-md mt-4">
      <div className='flex flex-col justify-center text-align  lg:pl-28' >
              {/* <img src={dtulogo} alt="dtulogo" className="h-20 w-30 "/> */}
              <p className='flex justify-center items-center p-0 font-bold text-6xl text-gray-400 tracking-widest'>DTU</p>

      </div>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors "
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors"
            >
              Administration
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors "
            >
              Admissions
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-lg transition-colors pr-28"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      {/* <hr className="my-4 border-blue-gray-50" /> */}
      <hr class="w-1/2 h-1 mx-auto my-4 bg-gray-500 border-0 rounded md:my-5" />
      <Typography color="gray" className="mb-2 text-center font-bold text-gray-500">
        &copy; DELHI TECHNOLOGICAL UNIVERSITY
      </Typography>
      <Typography color="gray" className="mb-2 text-center font-bold text-gray-500">
        created with ❤️ by Arpan Amarnath Anupam
      </Typography>
    </footer>
  );
}