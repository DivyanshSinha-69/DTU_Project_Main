import React from "react";
import { useInView } from "react-intersection-observer";

const DTUGlance = () => {
  // Using react-intersection-observer for animations
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [headingRef, headingInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const stats = [
    { value: "12,000+", label: "Students Enrolled" },
    { value: "600+", label: "Research Papers Annually" },
    { value: "100+", label: "Faculty Members" },
    { value: "90+", label: "UG, PG, and Doctoral Programs" },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#f9fafb] py-16 px-6 sm:px-12 lg:px-24 text-[#111827] font-['Satoshi',sans-serif] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading with animation */}
        <h2
          ref={headingRef}
          className={`text-4xl sm:text-5xl font-bold text-center mb-12 transition-all duration-1000 ease-in-out ${
            headingInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          DTU at a Glance
        </h2>

        {/* Animated underline */}
        <div
          className={`mx-auto h-1 w-20 bg-[#FFD700] mb-12 transition-all duration-1000 delay-300 ${
            headingInView ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"
          }`}
        />

        {/* Stats grid with staggered animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              index={index}
              inView={sectionInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// StatCard component for individual animated cards
const StatCard = ({ value, label, index, inView }) => {
  const delay = 100 * index; // Staggered delay based on index

  return (
    <div
      className={`transition-all duration-700 ease-in-out transform ${
        inView
          ? "opacity-100 translate-y-0 hover:scale-105"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-gray-100">
        <p className="text-5xl font-extrabold text-[#7C0000]">{value}</p>
        <p className="mt-4 text-lg text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default DTUGlance;
