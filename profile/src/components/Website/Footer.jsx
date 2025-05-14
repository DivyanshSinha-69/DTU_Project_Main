import { Typography } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-8">
      <div className="container mx-auto px-10">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* DTU Logo Section */}
          <div className="flex flex-col items-center lg:items-start">
            <Typography
              variant="h2"
              className="text-5xl font-bold text-gray-300 tracking-widest"
            >
              DTU
            </Typography>
            {/* Copyright Section */}
            <Typography className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DELHI TECHNOLOGICAL UNIVERSITY.
            </Typography>
            <Typography className="text-center text-xs text-gray-400">
              All rights reserved.
            </Typography>
          </div>

          {/* Quick Links */}
          <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
            <li>
              <Typography
                as="a"
                href="https://www.dtu.ac.in/Web/About/history.php"
                className="text-gray-400 hover:text-white transition-colors text-md font-medium"
              >
                About Us
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="https://www.dtu.ac.in/Web/Administrations/Chancellor.php"
                className="text-gray-400 hover:text-white transition-colors text-md font-medium"
              >
                Administration
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="https://dtu.ac.in/Web/dtujac.php"
                className="text-gray-400 hover:text-white transition-colors text-md font-medium"
              >
                Admissions
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-md font-medium"
              >
                Contact Us
              </Typography>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Developers Section */}
        <div className="mt-3 text-center">
          <Typography className="text-lg text-gray-400 mb-2 ">
            DEVELOPED BY
          </Typography>
          <div className="flex flex-wrap justify-center gap-5">
            {[
              "Divyansh Bansal",
              "Divyansh Sinha",
              "Divyanshu Sinha",
              "Sumit Kumar Khandelwal",
            ].map((name, index) => (
              <Typography
                key={index}
                as="span"
                className="text-md text-gray-400 hover:text-white transition-colors font-sans font-semibold"
              >
                {name}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
