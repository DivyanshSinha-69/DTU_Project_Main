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
const CURRENT_VERSION = "2.2"; // Change this on every deployment
if (localStorage.getItem("appVersion") !== CURRENT_VERSION) {
  localStorage.clear();
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
        let userDetails;
        if (user1.Position === "student") {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/cookiescheck`,
            {
              withCredentials: true,
            }
          );
          userDetails = response.data;

          if (userDetails) {
            dispatch(
              login({
                user: userDetails?.user,
                facultyId: null,
                accessToken: null,
                refreshToken: null,
              })
            );
          }

          dispatch(setRole(userDetails?.user.Position));
          navigate("/student/portal");
        } else dispatch(setRole(user1.position));
        if (user1.position === "faculty") {
          navigate("/faculty/portal");
        } else if (user1.position === "admin") {
          navigate("/admin/portal");
        } else if (user1.position === "department") {
          navigate("/department/portal");
        } else {
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        console.error("Error checking existing token:", error.message);
      }
    };

    checkExistingToken();
  }, [navigate, dispatch, user1.Position]);

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
          <Route path="/department/portal" element={<Department />} />

          {role === "student" ? (
            <Route path="/student/portal" element={<Student />} />
          ) : role === "faculty" ? (
            <Route path="/faculty/portal" element={<Faculty />} />
          ) : role === "admin" ? (
            <Route path="/admin/portal" element={<Dashboard />} />
          ) : role === "department" ? (
            <Route path="/department/portal" element={<Department />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          {!role && <Route path="/login" element={<Login />} />}
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
