import React, { useState, useEffect } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/reducers/AuthSlice";
import { setRole, setFacultyId } from "../redux/reducers/UserSlice";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import showPasswordIcon from "../assets/showPasswordIcon.png";


import { HashLink } from "react-router-hash-link";
// let hasToastFired = false;

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
      const endpoint =
        role === "faculty"
          ? "http://localhost:3001/ece/facultyauth/login"
          : "http://localhost:3001/login";

      const response = await axios.post(
        endpoint,
        {
          faculty_id: role !== "faculty" ? undefined : rollNo, // Use faculty_id for faculty login
          email: role !== "faculty" ? rollNo : undefined, // Use email for student login
          password: password,
        },
        { withCredentials: true },
      );

      // Extract accessToken from response
      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken && role === "faculty") {
        console.error("⚠️ No access token received from the server!");
        toast.error("Invalid credentials. Please try again.");
        return;
      }

      dispatch(setRole(user.Position));

      if (role === "student") {
        dispatch(
          login({
            user: user, // Ensure the entire user object is stored
            facultyId: null,
            accessToken: accessToken,
            refreshToken: refreshToken,
          }),
        );
      } else if (role === "faculty") {
        dispatch(
          login({
            user: user,
            facultyId: user.faculty_id, // Store faculty_id
            accessToken: accessToken, // Store access token
            refreshToken: refreshToken, // Store refresh token
          }),
        );
      }

      // if (!hasToastFired) {
      //   toast.success("Login successful!");
      //   hasToastFired = true; // Set flag to prevent multiple calls
      // }
      if (user.Position === "faculty") {
        navigate("/faculty/portal");
      } else if (user.Position === "student") {
        navigate("/student/portal");
      }else if (user.Position === "admin") {
        navigate("/admin/portal");
      }
      else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      // Ensure we extract the correct message
      const errorMessage =
        error.response?.data?.message || // If API returns { "message": "Invalid credentials" }
        error.response?.data?.error || // If API returns { "error": "Invalid credentials" }
        "Invalid credentials"; // Default message

      toast.error(errorMessage); // Show extracted error message
    }
  };
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   const storedAccessToken = localStorage.getItem("accessToken");
  //   const storedRefreshToken = localStorage.getItem("refreshToken");
  //   const storedFacultyId = localStorage.getItem("facultyId");

  //   if (storedUser && storedAccessToken) {
  //     dispatch(
  //       login({
  //         user: JSON.parse(storedUser),
  //         facultyId: storedFacultyId,
  //         accessToken: storedAccessToken,
  //         refreshToken: storedRefreshToken,
  //       })
  //     );
  //   }
  // }, [dispatch]);

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
                {role === "faculty" ? "Faculty ID" : role === "student" ? "Student Roll Number" : "Admin ID"}

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
