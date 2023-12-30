import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StickyNavbar from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import Dashboard from "./components/Dashboard";
import DashCards from "./components/DashCards";

function App() {
  return (
    <>
      <Router>
        <StickyNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
