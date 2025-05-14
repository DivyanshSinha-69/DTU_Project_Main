import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const ResearchDigest = () => {
  const [currentNote, setCurrentNote] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const researchNotes = [
    "Discover where DTU minds are shaping the future.",
    "Faculty breakthroughs made simple — and inspiring.",
    "Dive into stories behind the stats and citations.",
    "Innovation isn't just a buzzword here — it's our baseline.",
    "Your next project? Might just start with a paper from this month.",
    "Every digest is a doorway to the unknown. Step in.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentNote((prev) => (prev + 1) % researchNotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [researchNotes.length]);

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row w-full h-auto min-h-[400px] lg:h-[500px] bg-black shadow-lg rounded-xl overflow-hidden border border-gray-800 transition-all duration-1000 ease-in-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Left side: Rotating Notes */}
      <div className="w-full lg:w-2/3 p-6 sm:p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cGF0aCBkPSJNMCAwaDUwdjUwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGw1MCA1ME0wIDUwbDUwLTUwIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

        <div className="relative h-full w-full flex items-center justify-center">
          {researchNotes.map((note, index) => (
            <blockquote
              key={index}
              className={`absolute text-xl sm:text-2xl md:text-3xl font-medium text-white text-center px-4 transition-all duration-700 ease-in-out ${
                currentNote === index
                  ? "opacity-100 translate-x-0"
                  : direction === 1
                    ? "opacity-0 translate-x-20"
                    : "opacity-0 -translate-x-20"
              }`}
              style={{ maxWidth: "800px" }}
              aria-live="polite"
            >
              <span className="text-3xl sm:text-4xl text-[#FFD700] leading-none">
                "
              </span>
              {note}
              <span className="text-3xl sm:text-4xl text-[#FFD700] leading-none">
                "
              </span>
            </blockquote>
          ))}
        </div>

        {/* Indicator dots - shown only on mobile */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:hidden">
          {researchNotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentNote ? 1 : -1);
                setCurrentNote(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className="group relative"
            >
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  currentNote === index
                    ? "bg-[#FFD700] w-4 sm:w-6"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Sticky Title */}
      <div className="w-full lg:w-1/3 bg-gradient-to-b from-[#7C0000] to-[#500000] text-white flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 relative border-t lg:border-t-0 lg:border-l border-gray-800">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-4 sm:mb-6">
          Research Digest
        </h2>

        <p className="text-base sm:text-lg text-gray-200 text-center mb-6 sm:mb-8 max-w-xs">
          Cutting-edge research from DTU's brightest minds
        </p>

        <a
          href="/research-digest"
          className="inline-flex items-center justify-center bg-[#FFD700] text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-[#FFE55C] transition-all duration-300 hover:shadow-lg group"
        >
          Explore Publications
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* Slide counter - shown only on desktop */}
        <div className="hidden lg:block absolute bottom-6 text-sm text-[#FFD700]/80">
          {currentNote + 1}/{researchNotes.length}
        </div>
      </div>
    </div>
  );
};

export default ResearchDigest;
