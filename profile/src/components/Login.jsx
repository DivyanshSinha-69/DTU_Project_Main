import React, { useState } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/reducers/AuthSlice";
import { setRole } from "../redux/reducers/UserSlice";
import { useLocation } from "react-router-dom";

import { HashLink } from "react-router-hash-link";

const Login = () => {
  const location = useLocation();
const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student"; // Default to student
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server with login credentials
      const response = await axios.post(
        "http://64.227.135.99:3001/login",
        {
          email: rollNo,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      // Assuming the server returns user details upon successful login
      const userDetails = response.data;

      // Do something with the user details, e.g., store in state or context
      // console.log("User Details:", userDetails);
      // console.log(userDetails.role);
      // Example: Dispatching an action with user details
      dispatch(login(userDetails.user));
      dispatch(setRole(userDetails.user.Position));

      // Redirect to the desired page after successful login
      if (userDetails.user.Position === "student") {
        navigate("/student/portal");
      } else if (userDetails.user.Position === "teacher") {
        navigate("/teacher/portal");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
      <div
        className="flex font1 min-h-full h-screen justify-center flex-col  px-6 py-12 lg:px-8 "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-4xl tracking-widest font-bold leading-9 text-gray-800 ">
  {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : "LOGIN"}
</h2>

        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
            <label
  htmlFor="rollNo"
  className="block font-bold text-lg font-large leading-6 text-white"
>
  {role === "faculty" ? "Faculty ID" : "Roll Number"}
</label>

              <div className="mt-2">
                <input
                  id="rollNo"
name="rollNo"
autoComplete="username"
value={rollNo}

                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
onChange={(e) => setRollNo(e.target.value)}
                  
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block font-bold text-lg font-large leading-6 text-white pd"
                >
                  Password
                </label>
                {/* <div className="text-sm">
                  <HashLink
                    to="/forgot"
                    className="font-semibold text-md text-gray-800 hover:text-indigo-500"
                  >
                    Forgot password?
                  </HashLink>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
            <div className="text-sm">
  <HashLink
    to="/forgot"
    className="font-semibold text-md text-gray-800 hover:text-indigo-500"
  >
    Forgot password?
  </HashLink>
</div>

              <button
                type="submit"
                className="flex text-lg w-full justify-center rounded-md bg-gray-800 text-white pr-3 py-1.5 font-semibold leading-6  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
