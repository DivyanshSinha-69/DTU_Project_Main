import express from "express";
import {
  uploadResearchPaper,
  uploadFacultyImage,
  compressPDF,
} from "../config/facultyMulterConfig.js";
import { authenticateToken } from "../middlewares/auth.js";

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
  getFacultyImage,
  updateFacultyImage,
  deleteFacultyImage,
  getFacultyPatents,
  addFacultyPatent,
  updateFacultyPatent,
  deleteFacultyPatent,
  getFacultyQualifications,
  addFacultyQualification,
  updateFacultyQualification,
  deleteFacultyQualification
} from "../controllers/faculty.js";

const router = express.Router();

// router.use(authenticateToken);

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
router.get("/researchpaper/:faculty_id", getResearchPapersByFaculty);
router.post("/researchpaper", uploadResearchPaper, compressPDF, addResearchPaper);
router.put("/researchpaper/:research_id", uploadResearchPaper, compressPDF, updateResearchPaper);
router.delete("/researchpaper/:research_id", deleteResearchPaper);

// FDP routes
router.get("/fdp-records", getFDPRecords);
router.get("/fdp-records/:faculty_id", getFDPRecords);
router.post("/fdp-records", addFDPRecord);
router.put("/fdp-records/:FDP_id", updateFDPRecord);
router.delete("/fdp-records/:FDP_id", deleteFDPRecord);

// VAE routes
router.get("/vae", getVAERecords);
router.get("/vae/:faculty_id", getVAERecords);
router.post("/vae", addVAERecord);
router.put("/vae/:visit_id", updateVAERecord);
router.delete("/vae/:visit_id", deleteVAERecord);

// Book routes
router.get("/books/:faculty_id?", getBookRecords);
router.post("/books", addBookRecord);
router.put("/books/:Book_id", updateBookRecord);
router.delete("/books/:Book_id", deleteBookRecord);

// PHD awarded routes
router.get("/phd-awarded", getPhDAwardedRecords);
router.get("/phd-awarded/:faculty_id", getPhDAwardedRecordsByFacultyId);
router.post("/phd-awarded", addPhDAwardedRecord);
router.put("/phd-awarded/:PHD_id", updatePhDAwardedRecord);
router.delete("/phd-awarded/:PHD_id", deletePhDAwardedRecord);

// Sponsored Research Routes
router.get("/sponsored-research/:faculty_id", getSponsoredResearchByFaculty);
router.post("/sponsored-research", addSponsoredResearch);
router.put("/sponsored-research/:sponsorship_id", updateSponsoredResearch);
router.delete("/sponsored-research/:sponsorship_id", deleteSponsoredResearch);

// Consultancy Routes
router.get("/consultancy/:faculty_id", getConsultancyByFaculty);
router.post("/consultancy", addConsultancy);
router.put("/consultancy/:consultancy_id", updateConsultancy);
router.delete("/consultancy/:consultancy_id", deleteConsultancy);

// Faculty Details Routes
router.get("/faculty-details/:faculty_id", getFacultyDetails);
router.get("/faculty-details", getFacultyDetails);
router.post("/faculty-details", addFaculty);
router.put("/faculty-details/:faculty_id", updateFacultyDetails);
router.delete("/faculty-details/:faculty_id", deleteFaculty);

// Specialization Routes
router.get("/specializations", getSpecializations);
router.get("/specializations/:faculty_id", getSpecializations);
router.post("/specializations", addSpecialization);
router.put("/specializations/:specialization_id", updateSpecialization);
router.delete("/specializations/:specialization_id", deleteSpecialization);

// Faculty Image Routes
router.get("/facultyimage/:faculty_id", getFacultyImage); // Route to get faculty image
router.put("/facultyimage/:faculty_id", uploadFacultyImage, updateFacultyImage); // Route to update faculty image
router.delete("/facultyimage/:faculty_id", deleteFacultyImage); // Route to delete faculty image

// Faculty Patent Routes
router.get("/patent", getFacultyPatents); // Get all patents
router.get("/patent/:faculty_id", getFacultyPatents); // Get patents by faculty_id
router.post("/patent", addFacultyPatent); // Add a new patent
router.put("/patent/:patent_id", updateFacultyPatent); // Update a patent
router.delete("/patent/:patent_id", deleteFacultyPatent); // Delete a patent

// Faculty Qualification Routes
router.get("/qualification/:faculty_id?", getFacultyQualifications);
router.post("/qualification", addFacultyQualification);
router.put("/qualification/:education_id", updateFacultyQualification);
router.delete("/qualification/:education_id", deleteFacultyQualification);

export default router;
