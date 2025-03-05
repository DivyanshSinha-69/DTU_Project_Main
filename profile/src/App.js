import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import StickyNavbar from "./components/Website/Header";
import Footer from "./components/Website/Footer";
import Home from "./components/Homepage/Home";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Faculty from "./components/Teacher/Faculty";
import Student from "./components/Student/Student";
import Dashboard from "./components/AdminDashboard";
import { useDispatch, useSelector } from "react-redux";
import Parents from "./components/Parents";
import Alumini from "./components/Alumini";
import { useEffect } from "react";
import axios from "axios";
import { login } from "./redux/reducers/AuthSlice";
import { setRole } from "./redux/reducers/UserSlice";
import Loader from "./components/Loader";
import AdminLogin from "./components/AdminLogin";
import ResetPassword from "./components/ResetPass";
import Unauthorized from "./components/Unauthorized";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, ThemeProviderWrapper } from "./context/ThemeContext";
import Department from "./components/Department/Department";

function App() {
  const navigate = Navigate;
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);

  const user1 = useSelector((state) => state.auth.user) || {};

  console.log("User1", user1);

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        let userDetails;
        if (user1.Position != "faculty") {
          console.log("I am here at 44");
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/cookiescheck`,
            {
              withCredentials: true,
            }
          );
          userDetails = response.data;

          dispatch(
            login({
              user: userDetails?.user,
              facultyId: null,
              accessToken: null,
              refreshToken: null,
            })
          );
        }

        console.log("User Details:", userDetails);
        if (userDetails) dispatch(setRole(userDetails.user.Position));
        else dispatch(setRole(user1.Position));
        if (userDetails.user.Position === "student") {
          navigate("/student/portal");
        } else if (
          userDetails.user.Position === "faculty" ||
          user1.Position === "faculty"
        ) {
          console.log("60");
          navigate("/faculty/portal");
        } else if (userDetails.user.Position === "admin") {
          navigate("/admin/portal");
        } else {
          console.log(65);
          navigate("/unauthorized");
        }
      } catch (error) {
        console.log(error);
        console.error("Error checking existing token:", error.message);
      }
    };

    checkExistingToken();
  }, [navigate]);

  return (
    <>
      <ThemeProviderWrapper>
        <Toaster
          toastOptions={{
            className: "",
            duration: 2500,
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/department/portal" element={<Department />} />

            {role === "student" ? (
              <Route path="/student/portal" element={<Student />} />
            ) : role === "faculty" ? (
              <Route path="/faculty/portal" element={<Faculty />} />
            ) : role === "admin" ? (
              <Route path="/admin/portal" element={<Dashboard />} />
            ) : (
              <Route path="/login" element={<Login />} />
            )}
            <Route path="/parents" element={<Parents />} />
            <Route path="/loader" element={<Loader />} />
            <Route path="/alumini" element={<Alumini />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="*" element={<Unauthorized />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProviderWrapper>
    </>
  );
}

export default App;
