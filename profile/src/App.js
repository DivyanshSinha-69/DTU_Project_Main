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
import { useLocation } from "react-router-dom";

const CURRENT_VERSION = "2.4"; // Change this on every deployment
if (localStorage.getItem("appVersion") !== CURRENT_VERSION) {
  localStorage.clear(); // Clears old cache
  sessionStorage.clear();
  caches.keys().then((names) => {
    names.forEach((name) => caches.delete(name)); // Clear service worker cache
  });
  localStorage.setItem("appVersion", CURRENT_VERSION);
  window.location.reload(true); // Force reload to fetch fresh files
}

// List of routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/login/admin",
  "/forgot",
  "/reset-password/:token",
  "/unauthorized",
];

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    const checkExistingSession = async () => {
      // Skip verification if we're on a public route
      if (
        PUBLIC_ROUTES.some((route) => {
          // Handle dynamic routes like reset-password/:token
          if (route.includes(":token")) {
            return location.pathname.startsWith(route.split(":")[0]);
          }
          return route === location.pathname;
        })
      ) {
        return;
      }

      // Skip verification if we're not authenticated
      if (!isAuthenticated) {
        return;
      }

      try {
        // Use role from Redux store or default to 'student'
        const currentRole = role || "student";
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/ece/${currentRole}/verify`,
          { withCredentials: true }
        );

        if (response.data.user) {
          dispatch(login({ user: response.data.user }));
          // Only update role if not already set
          if (!role) {
            dispatch(setRole(response.data.user.position));
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        if (error.response?.status === 401) {
          dispatch(logout());
          // Only redirect if not already on login page
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate("/login");
          }
        }
      }
    };

    checkExistingSession();
  }, [navigate, dispatch, role, location.pathname, isAuthenticated]);

  const { darkMode } = useThemeContext();
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0D1117" : "#FFFFFF";
    document.body.style.color = darkMode ? "#EAEAEA" : "#000000";
  }, [darkMode]);

  return (
    <>
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
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes */}
        {isAuthenticated && (
          <>
            <Route path="/student" element={<Student />} />
            {role === "faculty" && (
              <Route path="/faculty">
                <Route index element={<Faculty />} />
                <Route path="office-orders" element={<FacultyOfficeOrders />} />
                <Route path="circular-notices" element={<FacultyCircular />} />
              </Route>
            )}
            {role === "admin" && (
              <Route path="/admin" element={<Dashboard />} />
            )}
            {role === "department" && (
              <Route path="/department">
                <Route index element={<Department />} />
                <Route path="office-orders" element={<Department />} />
                <Route
                  path="circular-notices"
                  element={<DepartmentCirculars />}
                />
              </Route>
            )}
            <Route path="/parents" element={<Parents />} />
            <Route path="/alumini" element={<Alumini />} />
          </>
        )}

        {/* Fallback route */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Unauthorized /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
