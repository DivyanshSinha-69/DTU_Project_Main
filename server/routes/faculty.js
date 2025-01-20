import express from "express";
import { uploadResearchPaper, uploadFacultyImage } from '../config/multerConfig.js';

import {
  getFacultyCredentials,
  getFacultyCredentialsById,
  addFacultyCredentials,
  updateFacultyCredentials,
  deleteFacultyCredentials,
  getFacultyAssociations,
  getFacultyAssociationById,
  addFacultyAssociation,
  updateFacultyAssociation,
  deleteFacultyAssociation,
  addResearchPaper,
  getResearchPapersByFaculty,
  updateResearchPaper,
  deleteResearchPaper,
  getFDPRecords,
  addFDPRecord,
  updateFDPRecord,
  deleteFDPRecord,
  getVAERecords,
  addVAERecord,
  updateVAERecord,
  deleteVAERecord,
  getBookRecords,
  addBookRecord,
  updateBookRecord,
  deleteBookRecord,
  getPhDAwardedRecords,
  getPhDAwardedRecordsByFacultyId, // Import the new function
  addPhDAwardedRecord,
  updatePhDAwardedRecord,
  deletePhDAwardedRecord,
  getSponsoredResearchByFaculty,
  addSponsoredResearch,
  updateSponsoredResearch,
  deleteSponsoredResearch,
  getConsultancyByFaculty,
  addConsultancy,
  updateConsultancy,
  deleteConsultancy,
  getFacultyDetails,
  addFaculty,
  updateFacultyDetails,
  deleteFaculty, 
} from "../controllers/faculty.js";

const router = express.Router();

router.get("/facultycredentials", getFacultyCredentials);
router.get("/facultycredentials/:faculty_id", getFacultyCredentialsById);
router.post("/addfacultycredentials", addFacultyCredentials);
router.put("/updatefacultycredentials/:faculty_id", updateFacultyCredentials);
router.delete("/deletefacultycredentials/:faculty_id", deleteFacultyCredentials);

router.get("/facultyassociation", getFacultyAssociations);
router.get("/facultyassociation/:faculty_id", getFacultyAssociationById);
router.post("/addfacultyassociation", addFacultyAssociation);
router.put("/updatefacultyassociation/:faculty_id", updateFacultyAssociation);
router.delete("/deletefacultyassociation/:faculty_id", deleteFacultyAssociation);

// Route for adding a new research paper
router.post('/researchpaper', uploadResearchPaper, addResearchPaper);

// Route for getting all research papers for a specific faculty_id
router.get('/researchpapers/:faculty_id', getResearchPapersByFaculty);

// Route for updating an existing research paper (using faculty_id and title)
router.put('/researchpaper/:faculty_id/:title_of_paper', uploadResearchPaper, updateResearchPaper);

// Route for deleting a research paper (using faculty_id and title)
router.delete('/researchpaper/:faculty_id/:title_of_paper', deleteResearchPaper);

// Get all FDP records or filter by faculty_id
router.get('/fdp', getFDPRecords);

// Add a new FDP record
router.post('/fdp', addFDPRecord);

// Update an existing FDP record
router.put('/fdp', updateFDPRecord);

// Delete an FDP record
router.delete('/fdp', deleteFDPRecord);

// Get all VAE records or filter by faculty_id
router.get('/vae', getVAERecords);

// Add a new VAE record
router.post('/vae', addVAERecord);

// Update a VAE record by visit_id
router.put('/vae/:visit_id', updateVAERecord);

// Delete a VAE record by visit_id
router.delete('/vae/:visit_id', deleteVAERecord);

// Route to fetch all books or books by faculty ID
router.get("/books/:faculty_id?", getBookRecords);

// Route to add a new book record
router.post("/books", addBookRecord);

// Route to update a book record by ISBN
router.put("/books/:ISBN", updateBookRecord);

// Route to delete a book record by ISBN
router.delete("/books/:ISBN", deleteBookRecord);

// Get all PhD awarded records
router.get('/phd', getPhDAwardedRecords);

// Get all PhD mentee names for a specific faculty_id
router.get('/phd/:faculty_id', getPhDAwardedRecordsByFacultyId);

// Add a new PhD awarded record
router.post('/phd', addPhDAwardedRecord);

// Update an existing PhD awarded record
router.put('/phd/:mentee_rn', updatePhDAwardedRecord);

// Delete a PhD awarded record
router.delete('/phd/:mentee_rn', deletePhDAwardedRecord);

router.get('/sponsored-research/:faculty_id', getSponsoredResearchByFaculty);
router.post('/sponsored-research', addSponsoredResearch);
router.put('/sponsored-research/:sponsorship_id', updateSponsoredResearch);
router.delete('/sponsored-research/:sponsorship_id', deleteSponsoredResearch);

// Consultancy Routes
router.get('/consultancy/:faculty_id', getConsultancyByFaculty);
router.post('/consultancy', addConsultancy);
router.put('/consultancy/:consultancy_id', updateConsultancy);
router.delete('/consultancy/:consultancy_id', deleteConsultancy);

router.get('/faculty/:faculty_id', getFacultyDetails);
router.post('/faculty', uploadFacultyImage, addFaculty);
router.put('/faculty/:faculty_id', uploadFacultyImage, updateFacultyDetails);
router.delete('/faculty/:faculty_id', deleteFaculty);


export default router;
