import express from "express";
import {
  uploadFacultyImage,
  getFacultyImage,
  getFacultyDetails,
  updateFacultyDetails,
  getall,
  getAssociationDetails,
  updateAssociationDetails,
  getResearchPapers,
  updateResearchPaper,
  deleteResearchPaper
} from "../controllers/faculty.js"; // Add new controller functions

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

// Route for fetching all faculty qualifications
router.get("/getall", getall);

// Route for getting faculty association details
router.post("/getassociationdetails", getAssociationDetails);

// Route for updating faculty association details
router.put("/updateassociationdetails", updateAssociationDetails);

// Route for fetching all research papers for a faculty
router.post("/getresearchpapers", getResearchPapers);

// Route for updating or adding a research paper
router.put("/updateresearchpaper", updateResearchPaper);

// Route for deleting a research paper
router.delete("/deleteresearchpaper", deleteResearchPaper);

export default router;
