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
  getPhDAwardedRecordsByFacultyId,
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
  getSpecializations,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../controllers/faculty.js";

const router = express.Router();

// Credentials Route
router.get("/facultycredentials", getFacultyCredentials);
router.get("/facultycredentials/:faculty_id", getFacultyCredentialsById);
router.post("/facultycredentials", addFacultyCredentials);
router.put("/facultycredentials/:faculty_id", updateFacultyCredentials);
router.delete("/facultycredentials/:faculty_id", deleteFacultyCredentials);

// Association Routes
router.get("/facultyassociation", getFacultyAssociations);
router.get("/facultyassociation/:faculty_id", getFacultyAssociationById);
router.post("/facultyassociation", addFacultyAssociation);
router.put("/facultyassociation/:faculty_id", updateFacultyAssociation);
router.delete("/facultyassociation/:faculty_id", deleteFacultyAssociation);

// Research Paper Route
router.post('/researchpaper', uploadResearchPaper, addResearchPaper);
router.get('/researchpapers/:faculty_id', getResearchPapersByFaculty);
router.put('/researchpaper/:faculty_id/:title_of_paper', uploadResearchPaper, updateResearchPaper);
router.delete('/researchpaper/:faculty_id/:title_of_paper', deleteResearchPaper);

// FDP routes
router.get('/fdp-records', getFDPRecords);
router.get('/fdp-records/:faculty_id', getFDPRecords);
router.post('/fdp-records', addFDPRecord);
router.put('/fdp-records/:FDP_id', updateFDPRecord);
router.delete('/fdp-records/:FDP_id', deleteFDPRecord);

// VAE routes
router.get('/vae', getVAERecords);
router.get('/vae/:faculty_id', getVAERecords);
router.post('/vae', addVAERecord);
router.put('/vae/:visit_id', updateVAERecord);
router.delete('/vae/:visit_id', deleteVAERecord);

// Book routes
router.get("/books/:faculty_id?", getBookRecords);
router.post("/books", addBookRecord);
router.put("/books/:Book_id", updateBookRecord);
router.delete("/books/:Book_id", deleteBookRecord);

// PHD awarded routes
router.get('/phd-awarded', getPhDAwardedRecords);
router.get('/phd-awarded/:faculty_id', getPhDAwardedRecordsByFacultyId);
router.post('/phd-awarded', addPhDAwardedRecord);
router.put('/phd-awarded/:PHD_id', updatePhDAwardedRecord);
router.delete('/phd-awarded/:PHD_id', deletePhDAwardedRecord);


// Sponsored Research Routes
router.get('/sponsored-research/:faculty_id', getSponsoredResearchByFaculty);
router.post('/sponsored-research', addSponsoredResearch);
router.put('/sponsored-research/:sponsorship_id', updateSponsoredResearch);
router.delete('/sponsored-research/:sponsorship_id', deleteSponsoredResearch);


// Consultancy Routes
router.get('/consultancy/:faculty_id', getConsultancyByFaculty);
router.post('/consultancy', addConsultancy);
router.put('/consultancy/:consultancy_id', updateConsultancy);
router.delete('/consultancy/:consultancy_id', deleteConsultancy);

// Faculty Details Routes
router.get('/faculty/:faculty_id', getFacultyDetails);
router.post('/faculty', uploadFacultyImage, addFaculty);
router.put('/faculty/:faculty_id', uploadFacultyImage, updateFacultyDetails);
router.delete('/faculty/:faculty_id', deleteFaculty);

// Specialization Routes
router.get("/specializations", getSpecializations);
router.get("/specializations/:faculty_id", getSpecializations);
router.post("/specializations", addSpecialization);
router.put("/specializations/:specialization_id", updateSpecialization);
router.delete("/specializations/:specialization_id", deleteSpecialization);
export default router;
