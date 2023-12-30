import React, { useState } from "react";
import backgroundImage from "../assets/dtu.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {login} from "../redux/reducers/AuthSlice"
import {setRole} from "../redux/reducers/UserSlice"
const Login = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    //authentication for testing phase
    const isAuthenticated = true;
    const user={
      role:"student",
      email:"arpangoyal2002@gmail.com"
    }
    if (isAuthenticated) {
      dispatch(login(user));
      dispatch(setRole(user.role));
      navigate("/teacherdetail");
    }
  };
  return (
    <>
      <div class="flex min-h-full h-screen justify-center flex-col  px-6 py-12 lg:px-8 " style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }} >
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            class="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 class="text-center text-4xl tracking-wide font-bold leading-9 text-black " >
            LOGIN
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" action="#
          
          " method="POST" onSubmit={handleSubmit}>
            <div>
              <label
                for="email"
                class="block text-sm font-large leading-6 text-white"
              >
                Email address
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm font-large leading-6 text-white pd"
                >
                  Password
                </label>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-white hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div class="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 text-white pr-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
