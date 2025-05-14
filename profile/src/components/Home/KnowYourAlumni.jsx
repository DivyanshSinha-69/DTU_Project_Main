import React from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const KnowYourAlumni = () => {
  const navigate = useNavigate();

  // Using react-intersection-observer for each element
  const [headingRef, headingInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [paragraphRef, paragraphInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [buttonRef, buttonInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="bg-white py-16 sm:py-20 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 font-['Satoshi',sans-serif]  overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-[#800000] font-black text-6xl sm:text-7xl md:text-[6rem] leading-tight tracking-normal transition-all duration-1000 ease-in-out ${
            headingInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          Hall of Journeys
        </h2>
        <div
          className={`h-1 w-20 bg-[#FFD700] mt-4 transition-all duration-1000 ${
            headingInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        />
        {/* Paragraph */}
        <p
          ref={paragraphRef}
          className={`mt-6 text-[#4B5563] font-['Satoshi',sans-serif] text-lg sm:text-3xl leading-relaxed tracking-tight max-w-full lg:max-w-[70%] transition-all duration-1000 ease-in-out delay-200 ${
            paragraphInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          Explore the inspiring paths of DTU graduates who have gone on to make
          their mark across industries and continents. Whether you're looking
          for guidance, collaboration, or a dose of motivation, our alumni
          network offers a window into the real-world impact of a DTU education.
        </p>

        {/* Button */}
        <button
          ref={buttonRef}
          onClick={() => navigate("/login")}
          className={`mt-10 px-8 py-3.5 bg-[#000000] text-white font-medium rounded-lg hover:bg-[#a10000] transition-all duration-500 ease-in-out  focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 ${
            buttonInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          Login {">"}
        </button>
      </div>
    </section>
  );
};

export default KnowYourAlumni;
