import React, { useState, useEffect } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "../redux/reducers/AuthSlice";
import { setRole } from "../redux/reducers/UserSlice";
import { toast, Toaster } from "react-hot-toast";
import showPasswordIcon from "../assets/showPasswordIcon.png";
import StickyNavbar from "./Website/Header";
import { HashLink } from "react-router-hash-link";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    user_id: "",
    password: "",
    showPassword: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Unified endpoint construction
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/ece/${role}/login`;
      const uppercaseUserId = credentials.user_id.toUpperCase();
      // Unified payload based on role
      const payload = {
        [role === "student"
          ? "roll_no"
          : role === "faculty"
            ? "faculty_id"
            : role === "department"
              ? "department_id"
              : "alumni_id"]: uppercaseUserId,
        password: credentials.password,
      };

      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      const { user } = response.data;
      dispatch(setRole(user.position));
      dispatch(login({ user }));

      // Navigation based on position
      const routes = {
        faculty: "/faculty",
        student: "/student",
        admin: "/admin",
        department: "/department/office-orders",
        alumni: "/alumni",
      };

      navigate(routes[user.position] || "/unauthorized");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid credentials";
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setCredentials((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  // Field label mapping
  const fieldLabels = {
    faculty: "Faculty ID",
    student: "Student ID",
    department: "Department ID",
    alumni: "Alumni ID",
  };

  return (
    <>
      <StickyNavbar />
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
            {`${fieldLabels[role]?.replace(" ID", "") || "User"} Login`}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="user_id"
                className="block font-bold text-lg font-large leading-6 text-white"
              >
                {fieldLabels[role] || "User ID"}
              </label>
              <input
                id="user_id"
                name="user_id"
                autoComplete="username"
                value={credentials.user_id}
                required
                className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono tracking-wide"
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block font-bold text-lg font-large leading-6 text-white pd"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={credentials.showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono tracking-wide"
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <img
                    src={showPasswordIcon}
                    alt="Show Password"
                    className="h-4 w-4"
                  />
                </button>
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
                className="flex text-lg w-full justify-center rounded-md bg-gray-800 text-white pr-3 py-1.5 font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
