import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import StickyNavbar from "./components/Website/Header";
import Footer from "./components/Website/Footer";
import Home from "./components/Homepage/Home";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";
import Dashboard from "./components/AdminDashboard";
import Unaithorized from "./components/Unauthorized";
import { useDispatch, useSelector } from "react-redux";
import Parents from "./components/Parents";
import Alumini from "./components/Alumini";
import { useEffect } from "react";
import axios from "axios";
import { login } from "./redux/reducers/AuthSlice";
import { setRole } from "./redux/reducers/UserSlice";
import Loader from "./components/Loader";
import AdminLogin from "./components/AdminLogin";

function App() {

  const navigate = Navigate;
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const response = await axios.get("http://localhost:3001/cookiescheck", {
          withCredentials: true,
        });

        const userDetails = response.data;
        dispatch(login(userDetails.user));
        dispatch(setRole(userDetails.user.Position));

        if (userDetails.user.Position === "student") {
          navigate("/student/portal");
         }else if (userDetails.user.Position === "teacher") {
          navigate("/teacher/portal");
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
      
      <Router>
        <StickyNavbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/teacher/portal" element={<Teacher />} />
          
          {role === "student" ? (
            <Route path="/student/portal" element={<Student />} />
            
          /*) : role === "teacher" ? (
            <Route path="/teacher/portal" element={<Teacher />} />*/
          ) : role==="admin"? (<Route path="/admin/portal" element={<Dashboard />} />): (
            <Route path="/login" element={<Login />} />
          )}
          <Route path="/parents" element={<Parents />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/alumini" element={<Alumini />} />
          <Route path="/forgot" element={<Forgot />} />
         
          
          <Route path="*" element={<Unaithorized />} />
          
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
