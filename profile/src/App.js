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

function App() {
  const navigate = Navigate;
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cookiescheck`, {
          withCredentials: true,
        });

        const userDetails = response.data;
        dispatch(
          login({
            user: userDetails.user,
            facultyId: null,
            accessToken: null,
            refreshToken: null,
          }),
        );
        dispatch(setRole(userDetails.user.Position));

        if (userDetails.user.Position === "student") {
          navigate("/student/portal");
        } else if (userDetails.user.Position === "faculty") {
          navigate("/faculty/portal");
        } else if (userDetails.user.Position === "admin") {
          navigate("/admin/portal");
        } else {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Error checking existing token:", error.message);
      }
    };

    checkExistingToken();
  }, [navigate]);

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
      <Router>
        <StickyNavbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/login/admin" element={<AdminLogin />} /> */}

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
    </>
  );
}

export default App;
