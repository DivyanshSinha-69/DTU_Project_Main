import express from "express";
import {
  uploadFacultyImage,
  getFacultyImage,
  getFacultyDetails,
  updateFacultyDetails,
  addFacultyDetails,
  getall,
  getAssociationDetails,
  addAssociationDetails, 
  updateAssociationDetails,
  addResearchPaper,
  getResearchPaper,
  deleteResearchPaper,
  getVAERecords,
  updateVAERecord,
  deleteVAERecord,
  
} from "../controllers/faculty.js"; // Add new controller functions



const router = express.Router();

// Route for uploading faculty image
router.post("/uploadfacultyimage", uploadFacultyImage);

// Route for getting faculty image
router.get("/facultyimage", getFacultyImage);

// Route for getting faculty personal details
router.get("/facultydetails", getFacultyDetails);

// Route for updating faculty personal details
router.put("/updatefacultydetails", updateFacultyDetails);

router.post("/addfacultydetails", addFacultyDetails);

// Route for fetching all faculty qualifications
router.get("/getall", getall);

// Route for getting faculty association details
router.get("/getassociationdetails", getAssociationDetails);

// Route to add association details
router.post("/addassociationdetails", addAssociationDetails);

// Route for updating faculty association details
router.put("/updateassociationdetails", updateAssociationDetails);

// Route to add/update a research paper
router.post("/addresearchpaper", addResearchPaper);

// Route for fetching all research papers for a faculty
router.get("/getresearchpaper", getResearchPaper);


// Route for deleting a research paper
router.delete('/deleteresearchpaper/:PublicationID', deleteResearchPaper);

router.get("/vaerecords", getVAERecords);

// Update a VAE record
router.put("/vaerecord", updateVAERecord);

// Delete a VAE record
router.delete("/vaerecord", deleteVAERecord);

export default router;
