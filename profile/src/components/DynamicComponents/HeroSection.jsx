import React from "react";
import dtuImg from "../../assets/dtufullimage.jpg"; // Adjust the path to your background image

const HeroSection = ({ title, subtitle, darkMode }) => {
  return (
    <div className="relative w-full">
      {/* Background Cover Image with Dark Overlay */}
      <div
        className="relative w-full h-[25vh] md:h-[30vh] lg:h-[37vh] rounded-t-2xl"
        style={{
          backgroundImage: `url(${dtuImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          backgroundColor: darkMode ? "#2B2C3A" : "#E0E0E0", // Adjusted background color
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-2xl"></div>

        {/* Title and Subtitle */}
        <div className="absolute bottom-4 left-4 md:left-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl mt-2">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
