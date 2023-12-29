import React from "react";
import homebg from "../assets/dtu3.png"
const Home = () => {
  return (
    <>
      <div className="p-4 mt-2 h-screen flex justify-center items-center text-center font-mono"
        style={{
          backgroundImage: `url(${homebg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          
        }}
      >
          <p className="sm:text-sm md:text-xl lg:text-3xl text-white font-bold">
           amarnath ab bhi nhi dikh raha kya????
          </p>
      </div>
    </>
  );
};

export default Home;
