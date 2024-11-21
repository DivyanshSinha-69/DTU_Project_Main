import express from "express";
import {
  uploadFacultyImage,
  getFacultyImage,
  getFacultyDetails,
  updateFacultyDetails,
  getall
} from "../controllers/faculty.js"; // Add these new controller functions

// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route for uploading faculty image
router.post("/uploadfacultyimage", uploadFacultyImage);

// Route for getting faculty image
router.post("/getfacultyimage", getFacultyImage);

// Route for getting faculty personal details
router.post("/getfacultydetails", getFacultyDetails);

// Route for updating faculty personal details
router.put("/updatefacultydetails", updateFacultyDetails);

// Route for fetching all faculty qualifications (if needed)
router.get("/getall", getall);

export default router;
