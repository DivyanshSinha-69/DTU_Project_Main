import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-center px-4">
      <div className="bg-black bg-opacity-40 p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-16 h-16 text-red-500 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
          />
        </svg>
        <h1 className="text-3xl font-extrabold text-red-500 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-300 text-md mb-4">
          You don’t have permission to view this page.
        </p>
        <a
          href="/"
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
