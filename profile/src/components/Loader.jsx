import React, { useState } from "react";



const Loader = () => {


  return (
    <div className="h-screen flex flex-col justify-center items-center gap-8">

        <div className="border-gray-600 border-t-[5px] border-r-[5px] h-[200px] w-[200px] rounded-full animate-[spin_0.7s_linear_infinite]">       
        </div>

        <div >
            <p className="font1 text-3xl">Loading <span className="animate-[ping_0.7s_alternate_infinite]">...</span></p>
        </div>

        <div class="relative max-w-sm">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
    </svg>
  </div>
          <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>

    </div>
  );
};

export default Loader;
