import React from "react";

const Student = () => {
  return (
    <div>
      <div className=" h-auto w-full mt-10">
        <div className="h-[30%] w-[70%] flex flex-wrap justify-around mx-auto">
          <div className="h-100% flex flex-col content-center justify-center items-center m-2">
            <h1 className="font-extrabold text-3xl text-center">XXXXX XXXXX</h1>
            <h2 className="font-bold text-1xl text-center">2K20/EC/XX</h2>
            <h2 className="text-lg text-center">
              Electronics and communication engineering
            </h2>
            <h2>DTU</h2>
          </div>
          <div>
            <img
              className="rounded-xl mt-2 mb-2 h-[175px] w-[175px]"
              src="https://demos.creative-tim.com/nextjs-tailwind-resume-page/image/avatar3.jpg"
            />
          </div>
        </div>

        <div className="h-screen">
                
        </div>
      </div>
    </div>
  );
};

export default Student;
