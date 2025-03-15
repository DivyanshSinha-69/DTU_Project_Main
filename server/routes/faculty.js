import express from "express";
import {
  uploadResearchPaper,
  uploadFacultyInteraction,
  uploadFacultyImage,
  compressUploadedFile,
  checkFileReceived
} from "../config/facultyMulterConfig.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

import {
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
  getFacultyInteractions,
  addFacultyInteraction,
  updateFacultyInteraction,
  deleteFacultyInteraction,
  getBookRecords,
  addBookRecord,
  updateBookRecord,
  deleteBookRecord,
  getFacultyGuidanceRecords,
  getFacultyGuidanceRecordsByFacultyId,
  addFacultyGuidanceRecord,
  updateFacultyGuidanceRecord,
  deleteFacultyGuidanceRecord,
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
  deleteFacultyQualification,
  getInteractionTypes,
  addInteractionType,
  updateInteractionType,
  deleteInteractionType,
  updateLastSeen,
  getUserDutyOrders,
  getCirculars,
  markDutyOrderAsSeen
} from "../controllers/faculty.js";

const router = express.Router();

router.use(authenticateToken);

// Association Routes
router.get("/facultyassociation", authorizeRoles("faculty"), getFacultyAssociations);
router.get("/facultyassociation/:faculty_id", authorizeRoles("faculty"), getFacultyAssociationById);
router.post("/facultyassociation", authorizeRoles("faculty"), addFacultyAssociation);
router.put("/facultyassociation/:faculty_id", authorizeRoles("faculty"), updateFacultyAssociation);
router.delete("/facultyassociation/:faculty_id", authorizeRoles("faculty"), deleteFacultyAssociation);

// Research Paper Route
router.get("/researchpaper/:faculty_id", authorizeRoles("faculty"), getResearchPapersByFaculty);
router.post("/researchpaper", authorizeRoles("faculty"), uploadResearchPaper, compressUploadedFile, addResearchPaper);
router.put("/researchpaper/:research_id", authorizeRoles("faculty"), uploadResearchPaper, compressUploadedFile, updateResearchPaper);
router.delete("/researchpaper/:research_id", authorizeRoles("faculty"), deleteResearchPaper);

// FDP routes
router.get("/fdp-records", authorizeRoles("faculty"), getFDPRecords);
router.get("/fdp-records/:faculty_id", authorizeRoles("faculty"), getFDPRecords);
router.post("/fdp-records", authorizeRoles("faculty"), addFDPRecord);
router.put("/fdp-records/:FDP_id", authorizeRoles("faculty"), updateFDPRecord);
router.delete("/fdp-records/:FDP_id", authorizeRoles("faculty"), deleteFDPRecord);

// Interaction routes
router.get("/interaction/:faculty_id?", authorizeRoles("faculty"), getFacultyInteractions);
router.post("/interaction", authorizeRoles("faculty"), uploadFacultyInteraction, compressUploadedFile, addFacultyInteraction);
router.put("/interaction/:interact_id", authorizeRoles("faculty"), uploadFacultyInteraction, compressUploadedFile, updateFacultyInteraction);
router.delete("/interaction/:interact_id", authorizeRoles("faculty"), deleteFacultyInteraction);

// Interaction Type routes
router.get("/interaction_type", authorizeRoles("faculty"), getInteractionTypes);
router.post("/interaction_type", authorizeRoles("faculty"), addInteractionType);
router.put("/interaction_type/:interaction_id", authorizeRoles("faculty"), updateInteractionType);
router.delete("/interaction_type/:interaction_id", authorizeRoles("faculty"), deleteInteractionType);

// Book routes
router.get("/books/:faculty_id?", authorizeRoles("faculty"), getBookRecords);
router.post("/books", authorizeRoles("faculty"), addBookRecord);
router.put("/books/:Book_id", authorizeRoles("faculty"), updateBookRecord);
router.delete("/books/:Book_id", authorizeRoles("faculty"), deleteBookRecord);

// PHD awarded routes
router.get("/guidance", authorizeRoles("faculty"), getFacultyGuidanceRecords);
router.get("/guidance/:faculty_id", authorizeRoles("faculty"), getFacultyGuidanceRecordsByFacultyId);
router.post("/guidance", authorizeRoles("faculty"), addFacultyGuidanceRecord);
router.put("/guidance/:Guidance_id", authorizeRoles("faculty"), updateFacultyGuidanceRecord);
router.delete("/guidance/:Guidance_id", authorizeRoles("faculty"), deleteFacultyGuidanceRecord);

// Sponsored Research Routes
router.get("/sponsored-research/:faculty_id", authorizeRoles("faculty"), getSponsoredResearchByFaculty);
router.post("/sponsored-research", authorizeRoles("faculty"), addSponsoredResearch);
router.put("/sponsored-research/:sponsorship_id", authorizeRoles("faculty"), updateSponsoredResearch);
router.delete("/sponsored-research/:sponsorship_id", authorizeRoles("faculty"), deleteSponsoredResearch);

// Consultancy Routes
router.get("/consultancy/:faculty_id", authorizeRoles("faculty"), getConsultancyByFaculty);
router.post("/consultancy", authorizeRoles("faculty"), addConsultancy);
router.put("/consultancy/:consultancy_id", authorizeRoles("faculty"), updateConsultancy);
router.delete("/consultancy/:consultancy_id", authorizeRoles("faculty"), deleteConsultancy);

// Faculty Details Routes
router.get("/faculty-details/:faculty_id", authorizeRoles("faculty"), getFacultyDetails);
router.get("/faculty-details", authorizeRoles("faculty"), getFacultyDetails);
router.post("/faculty-details", authorizeRoles("faculty"), addFaculty);
router.put("/faculty-details/:faculty_id", authorizeRoles("faculty"), updateFacultyDetails);
router.delete("/faculty-details/:faculty_id", authorizeRoles("faculty"), deleteFaculty);

// Specialization Routes
router.get("/specializations", authorizeRoles("faculty"), getSpecializations);
router.get("/specializations/:faculty_id", authorizeRoles("faculty"), getSpecializations);
router.post("/specializations", authorizeRoles("faculty"), addSpecialization);
router.put("/specializations/:specialization_id", authorizeRoles("faculty"), updateSpecialization);
router.delete("/specializations/:specialization_id", authorizeRoles("faculty"), deleteSpecialization);

// Faculty Image Routes
router.get("/facultyimage/:faculty_id", authorizeRoles("faculty"), getFacultyImage); // Route to get faculty image
router.put("/facultyimage/:faculty_id", authorizeRoles("faculty"), uploadFacultyImage, checkFileReceived, compressUploadedFile, updateFacultyImage); // Route to update faculty image
router.delete("/facultyimage/:faculty_id", authorizeRoles("faculty"), deleteFacultyImage); // Route to delete faculty image

// Faculty Patent Routes
router.get("/patent", authorizeRoles("faculty"), getFacultyPatents); // Get all patents
router.get("/patent/:faculty_id", authorizeRoles("faculty"), getFacultyPatents); // Get patents by faculty_id
router.post("/patent", authorizeRoles("faculty"), addFacultyPatent); // Add a new patent
router.put("/patent/:patent_id", authorizeRoles("faculty"), updateFacultyPatent); // Update a patent
router.delete("/patent/:patent_id", authorizeRoles("faculty"), deleteFacultyPatent); // Delete a patent

// Faculty Qualification Routes
router.get("/qualification/:faculty_id?", authorizeRoles("faculty"), getFacultyQualifications);
router.post("/qualification", authorizeRoles("faculty"), addFacultyQualification);
router.put("/qualification/:education_id", authorizeRoles("faculty"), updateFacultyQualification);
router.delete("/qualification/:education_id", authorizeRoles("faculty"), deleteFacultyQualification);

// Duty Orders Route
router.get('/duty-orders', authorizeRoles("faculty"), getUserDutyOrders);

router.get('/circulars', authorizeRoles("faculty"), getCirculars);

router.put('/last-seen', authorizeRoles("faculty"), updateLastSeen);

router.put('/duty-orders/mark_seen', authorizeRoles("faculty"), markDutyOrderAsSeen);

export default router;
