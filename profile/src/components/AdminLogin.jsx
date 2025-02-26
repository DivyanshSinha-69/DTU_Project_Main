import React, { useState } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/reducers/AuthSlice";
import { setRole } from "../redux/reducers/UserSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server with login credentials
      const response = await axios.post(
        "https://api.dtu-eceportal.com/login/admin",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      // Assuming the server returns user details upon successful login

      // Do something with the user details, e.g., store in state or context
      // console.log("User Details:", userDetails);
      // console.log(userDetails.role);
      // Example: Dispatching an action with user details
      const userDetails = response.data.user;
      // console.log(userDetails);
      // console.log(response.data.user.position);
      dispatch(login(userDetails));
      dispatch(setRole(userDetails.Position));
      // dispatch(setRole("admin"));
      // dispatch(login("admin"));
      // Redirect to the desired page after successful login
      navigate("/admin/portal");
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
            ADMIN LOGIN
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
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
                  type=""
                  autoComplete="email"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-md text-gray-800 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
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

export default AdminLogin;
