import React, { useState } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "../redux/reducers/AuthSlice";
import { setRole, setFacultyId } from "../redux/reducers/UserSlice";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import showPasswordIcon from "../assets/showPasswordIcon.png";
import { HashLink } from "react-router-hash-link";
import StickyNavbar from "./Website/Header";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student"; // Default to student

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let endpoint;
      let payload;

      switch (role) {
        case "faculty":
          endpoint = `${process.env.REACT_APP_BACKEND_URL}/ece/facultyauth/login`;
          payload = { faculty_id: rollNo, password };
          break;
        case "department":
          endpoint = `${process.env.REACT_APP_BACKEND_URL}/ece/department/login`;
          payload = { department_id: rollNo, password };
          break;
        case "alumni":
          endpoint = `${process.env.REACT_APP_BACKEND_URL}/alumni/login`;
          payload = { alumni_id: rollNo, password };
          break;
        case "student":
        default:
          endpoint = `${process.env.REACT_APP_BACKEND_URL}/login`;
          payload = { email: rollNo, password };
          break;
      }

      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
      });
      console.log("response", response);
      const { accessToken, refreshToken, user } = response.data;

      if (role === "faculty" && !accessToken) {
        console.error("⚠️ No access token received from the server!");
        toast.error("Invalid credentials. Please try again.");
        return;
      }
      console.log("user", user);
      dispatch(setRole(user.Position));

      dispatch(
        login({
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );

      switch (user.position) {
        case "faculty":
          navigate("/faculty/portal");
          break;
        case "student":
          navigate("/student/portal");
          break;
        case "admin":
          navigate("/admin/portal");
          break;
        case "department":
          navigate("/department/portal");
          break;
        case "alumni":
          navigate("/alumni/portal");
          break;
        default: {
          dispatch(logout());
          navigate("/unauthorized");
          break;
        }
      }

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

  return (
    <>
      <StickyNavbar />
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
            {role
              ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login`
              : "LOGIN"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="rollNo"
                className="block font-bold text-lg font-large leading-6 text-white"
              >
                {(() => {
                  switch (role) {
                    case "faculty":
                      return "Faculty ID";
                    case "student":
                      return "Student Roll Number";
                    case "department":
                      return "Department ID";
                    case "alumni":
                      return "Alumni ID";
                    default:
                      return "Admin ID";
                  }
                })()}
              </label>

              <input
                id="rollNo"
                name="rollNo"
                autoComplete="username"
                value={rollNo}
                required
                className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono tracking-wide"
                onChange={(e) => setRollNo(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono tracking-wide"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
