import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StickyNavbar from "./components/Website/Header";
import Footer from "./components/Website/Footer";
import Home from "./components/Homepage/Home";
import Login from "./components/Login";
import Teacher from "./components/Teacher";
import Student from "./components/Student/Student";
import Dashboard from "./components/AdminDashboard";
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {role === "student" ? (
            <Route path="/student/portal" element={<Student />} />
          ) : role === "teacher" ? (
            <Route path="/teacher/portal" element={<Teacher />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          <Route path="/parents" element={<Parents />} />
          <Route path="/alumini" element={<Alumini />} />
          {role==="admin"?<Route path="/admin/portal" element={<Dashboard />} />:<Route path="/login" element={<Login />} />}
         
          <Route path="*" element={<Unaithorized />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
