import React, { useState } from "react";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-8">
      <div className="border-gray-600 border-t-[5px] border-r-[5px] h-[200px] w-[200px] rounded-full animate-[spin_0.7s_linear_infinite]"></div>

      <div>
        <p className="font1 text-3xl">
          Loading{" "}
          <span className="animate-[ping_0.7s_alternate_infinite]">...</span>
        </p>
      </div>

      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Loader;
