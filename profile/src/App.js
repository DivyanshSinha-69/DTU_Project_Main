import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
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
import { login, logout } from "./redux/reducers/AuthSlice";
import { setRole } from "./redux/reducers/UserSlice";
import Loader from "./components/Loader";
import AdminLogin from "./components/AdminLogin";
import ResetPassword from "./components/ResetPass";
import Unauthorized from "./components/Unauthorized";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, ThemeProviderWrapper } from "./context/ThemeContext";
import Department from "./components/Department/Department";
import { store } from "./redux/Store";
import OfficeOrders from "./components/Teacher/OfficeOrders";
import CircularNotices from "./components/Teacher/CircularNotices";
import { useThemeContext } from "./context/ThemeContext";
import { use } from "react";
import CircularsNotices from "./components/Department/Pages/CircularsNotices";
import FacultyOfficeOrders from "./components/Teacher/OfficeOrders";
import FacultyCircularPage from "./components/Teacher/CircularNotices";
import FacultyCircular from "./components/Teacher/CircularNotices";
import DepartmentCirculars from "./components/Department/Pages/CircularsNotices";
const CURRENT_VERSION = "2.2"; // Change this on every deployment
if (localStorage.getItem("appVersion") !== CURRENT_VERSION) {
  store.dispatch(logout());

  localStorage.setItem("appVersion", CURRENT_VERSION);
  window.location.reload(); // Reload the page to apply new changes
}

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);

  const user1 = useSelector((state) => state.auth.user) || {};
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        // let userDetails;
        // if (user1.Position === "student") {
        //   const response = await axios.get(
        //     `${process.env.REACT_APP_BACKEND_URL}/cookiescheck`,
        //     {
        //       withCredentials: true,
        //     }
        //   );
        //   userDetails = response.data;

        //   if (userDetails) {
        //     dispatch(
        //       login({
        //         user: userDetails?.user,
        //         facultyId: null,
        //         accessToken: null,
        //         refreshToken: null,
        //       })
        //     );
        //   }

        //   dispatch(setRole(userDetails?.user.Position));
        //   navigate("/student/portal");
        // } else dispatch(setRole(user1.position));
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = JSON.parse(localStorage.getItem("user"));

        if (accessToken && refreshToken && user) {
          dispatch(
            login({
              user: user,
              accessToken: accessToken,
              refreshToken: refreshToken,
            })
          );
          dispatch(setRole(user.position));
        }
      } catch (error) {
        console.log(error);
        console.error("Error checking existing token:", error.message);
      }
    };

    checkExistingToken();
  }, [navigate, dispatch]);
  const { darkMode } = useThemeContext();
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0D1117" : "#FFFFFF";
    document.body.style.color = darkMode ? "#EAEAEA" : "#000000"; // Optional: Set text color
  }, [darkMode]);

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
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/department" element={<Department />} />

          {role === "student" && (
            <Route path="/student" element={<Student />} />
          )}
          {role === "faculty" && (
            <Route path="/faculty">
              <Route index element={<Faculty />} />{" "}
              <Route path="office-orders" element={<FacultyOfficeOrders />} />{" "}
              <Route path="circular-notices" element={<FacultyCircular />} />{" "}
            </Route>
          )}
          {role === "admin" && <Route path="/admin" element={<Dashboard />} />}
          {role === "department" && (
            <Route path="/department">
              <Route index element={<Department />} />{" "}
              {/* Default route for /department */}
              <Route path="office-orders" element={<Department />} />{" "}
              <Route
                path="circular-notices"
                element={<DepartmentCirculars />}
              />{" "}
            </Route>
          )}
          <Route path="/parents" element={<Parents />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/alumini" element={<Alumini />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="*" element={<Unauthorized />} />
        </Routes>
        <Footer />
      </ThemeProviderWrapper>
    </>
  );
}

export default App;
