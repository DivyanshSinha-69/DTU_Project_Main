import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const MeetYourMentors = () => {
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
    <section className="bg-white py-16 sm:py-20 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 font-['Satoshi',sans-serif] overflow-hidden">
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
          Know Your Mentors
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
          className={`mt-6 text-[#4B5563] font-['Satoshi',sans-serif]  text-lg sm:text-3xl leading-relaxed tracking-tight max-w-full lg:max-w-[70%] transition-all duration-1000 ease-in-out delay-200 ${
            paragraphInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          Behind every great institution are the brilliant minds who inspire,
          mentor, and innovate. Get to know the thought leaders of DTU—our
          esteemed faculty. From pioneering research to transformative teaching,
          discover the passion and purpose that fuel our academic excellence.
        </p>

        {/* Button */}
        <button
          ref={buttonRef}
          onClick={() => navigate("/departments")}
          className={`mt-10 px-8 py-3.5 bg-[#000000] text-white font-medium rounded-lg hover:bg-[#a10000] transition-all  ease-in-out duration-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 ${
            buttonInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          Explore Departments <span className="ml-2">&rarr;</span>
        </button>
      </div>
    </section>
  );
};

export default MeetYourMentors;
