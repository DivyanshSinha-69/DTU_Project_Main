import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StickyNavbar from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import Dashboard from "./components/AdminDashboard";
import DashCards from "./components/DashCards";
import PrivateRoute from "./Auth/PrivaterouteDash";
import Unaithorized from "./components/Unauthorized";
import { useSelector } from "react-redux";
import Parents from "./components/Parents";
import Alumini from "./components/Alumini";

function App() {
  const { role } = useSelector((state) => state.user);

  return (
    <>
      <Router>
        <StickyNavbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dash" element={<Dashboard />} /> */}
          <Route
            path="/admin/dash"
            element={
              <PrivateRoute
                // element={<Dashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          {role === "student" ? (
            <Route path="/student/myportal" element={<Student />} />
          ) : role === "teacher" ? (
            <Route path="/teacher/myportal" element={<Teacher />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}

          <Route path="/parents" element={<Parents />} />
          <Route path="/alumini" element={<Alumini />} />
          <Route path="/unauthorized" element={<Unaithorized />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
