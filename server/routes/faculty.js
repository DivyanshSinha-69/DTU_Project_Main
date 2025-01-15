import express from "express";
import upload from '../config/multerConfig.js';  // Adjust path if needed

import {
  getFacultyCredentials,
  addFacultyCredentials,
  updateFacultyCredentials,
  deleteFacultyCredentials,
  getFacultyAssociations,
  addFacultyAssociation,
  updateFacultyAssociation,
  deleteFacultyAssociation,
  addResearchPaper,
  getResearchPapersByFaculty,
  updateResearchPaper,
  deleteResearchPaper
} from "../controllers/faculty.js";

const router = express.Router();

router.get("/facultycredentials", getFacultyCredentials);
router.post("/addfacultycredentials", addFacultyCredentials);
router.put("/updatefacultycredentials/:faculty_id", updateFacultyCredentials);
router.delete("/deletefacultycredentials/:faculty_id", deleteFacultyCredentials);

router.get("/facultyassociation", getFacultyAssociations);
router.post("/addfacultyassociation", addFacultyAssociation);
router.put("/updatefacultyassociation/:faculty_id", updateFacultyAssociation);
router.delete("/deletefacultyassociation/:faculty_id", deleteFacultyAssociation);

// Route for adding a new research paper
router.post('/researchpaper', upload, addResearchPaper);

// Route for getting all research papers for a specific faculty_id
router.get('/researchpapers/:faculty_id', getResearchPapersByFaculty);

// Route for updating an existing research paper (using faculty_id and title)
router.put('/researchpaper/:faculty_id/:title_of_paper', upload, updateResearchPaper);

// Route for deleting a research paper (using faculty_id and title)
router.delete('/researchpaper/:faculty_id/:title_of_paper', deleteResearchPaper);

export default router;
