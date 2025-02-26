import React, { useState } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("student"); // Default to student
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();

    // Determine the API endpoint based on user type
    const endpoint =
      userType === "faculty"
        ? "https://api.dtu-eceportal.com/ece/facultyauth/forgotpassword"
        : "https://api.dtu-eceportal.com/forgotpassword";

    try {
      // Make a POST request to the appropriate endpoint
      const response = await axios.post(endpoint, {
        email: email,
      });

      // Display success message
      setMessage(response.data.message);
      setError("");

      // Optionally, redirect to the login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      // Handle error
      setError(error.response?.data?.error || "An error occurred");
      setMessage("");
    }
  };

  return (
    <>
      <div
        className="flex font1 min-h-full h-screen justify-center flex-col px-6 py-12 lg:px-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-4xl tracking-widest font-bold leading-9 text-gray-800">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleForgot}>
            {/* User Type Selection */}
            <div>
              <label className="block font-bold text-lg font-large leading-6 text-white">
                User Type
              </label>
              <div className="mt-2">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block font-bold text-lg font-large leading-6 text-white"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex text-lg w-full justify-center rounded-md bg-gray-800 text-white pr-3 py-1.5 font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Display success or error messages */}
          {message && (
            <p className="mt-4 text-center text-green-600">{message}</p>
          )}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Forgot;
