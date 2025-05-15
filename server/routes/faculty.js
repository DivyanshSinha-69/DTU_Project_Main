import express from "express";
import {
  uploadResearchPaper,
  uploadFacultyInteraction,
  uploadFacultyImage,
  uploadFacultyGuidance,
  compressUploadedFile,
  uploadFacultySponsoredResearch,
  uploadFacultyConsultancy,
  checkFileReceived,
  uploadPatentDocument,
  uploadFDPDocument,
} from "../config/facultyMulterConfig.js";
import {
  authenticateToken,
  authorizeRoles,
  authorizeByRoleCombo,
  authorizeByUserId,
  authorizeSameDepartment,
} from "../middlewares/auth.js";

import { facultyAccessMiddleware } from "../middlewares/sharedRoleCombos.js";

import {
  getFacultyAssociations,
  getFacultyAssociationById,
  addFacultyAssociation,
  updateFacultyAssociation,
  deleteFacultyAssociation,
  addResearchPaper,
  getResearchPapers,
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
  addFacultyGuidanceRecord,
  updateFacultyGuidanceRecord,
  deleteFacultyGuidanceRecord,
  getSponsoredResearch,
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
  markDutyOrderAsSeen,
  getFacultyMappingByDepartment,
  forgotPassword,
  resetPassword,
  facultyLogin,
  facultyRefresh,
  facultyLogout,
  facultyVerifyAuth,
  getFacultyResearchByMonth 
} from "../controllers/faculty.js";

import { parseMultipartFields } from "../middlewares/parseMultipartFields.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/refresh", facultyRefresh);
router.post("/logout", authenticateToken, facultyLogout);
router.get("/verify", facultyVerifyAuth);

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);


router.get("/faculty-research-digest", getFacultyResearchByMonth);

router.use(authenticateToken);

// Association Routes
router.get(
  "/facultyassociation",
  authorizeRoles("faculty"),
  getFacultyAssociations
);

router.get(
  "/facultyassociation/:faculty_id",
  authorizeRoles("faculty"),
  getFacultyAssociationById
);
router.post(
  "/facultyassociation",
  authorizeRoles("faculty"),
  addFacultyAssociation
);
router.put(
  "/facultyassociation/:faculty_id",
  authorizeRoles("faculty"),
  updateFacultyAssociation
);
router.delete(
  "/facultyassociation/:faculty_id",
  authorizeRoles("faculty"),
  deleteFacultyAssociation
);

// Research Paper Route
router.get("/researchpaper/all", facultyAccessMiddleware, getResearchPapers);
router.get(
  "/researchpaper",
  authorizeByUserId,
  facultyAccessMiddleware,
  getResearchPapers
);
router.post(
  "/researchpaper",
  authorizeByUserId,
  facultyAccessMiddleware,
  uploadResearchPaper,
  compressUploadedFile,
  addResearchPaper
);
router.put(
  "/researchpaper/:research_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  uploadResearchPaper,
  compressUploadedFile,
  updateResearchPaper
);
router.delete(
  "/researchpaper/:research_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  deleteResearchPaper
);

// FDP routes
router.get("/fdp-records/all", facultyAccessMiddleware, getFDPRecords);
router.get(
  "/fdp-records",
  authorizeByUserId,
  facultyAccessMiddleware,
  getFDPRecords
);
router.post(
  "/fdp-records",
  authorizeByUserId,
  facultyAccessMiddleware,
  uploadFDPDocument,
  addFDPRecord
);
router.put(
  "/fdp-records/:FDP_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  uploadFDPDocument,
  updateFDPRecord
);
router.delete(
  "/fdp-records/:FDP_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  deleteFDPRecord
);

// Interaction routes
router.get(
  "/interaction/:faculty_id?",
  authorizeRoles("faculty"),
  getFacultyInteractions
);
router.post(
  "/interaction",
  authorizeRoles("faculty"),
  uploadFacultyInteraction,
  compressUploadedFile,
  addFacultyInteraction
);
router.put(
  "/interaction/:interact_id",
  authorizeRoles("faculty"),
  uploadFacultyInteraction,
  compressUploadedFile,
  updateFacultyInteraction
);
router.delete(
  "/interaction/:interact_id",
  authorizeRoles("faculty"),
  deleteFacultyInteraction
);

// Interaction Type routes
router.get("/interaction_type", authorizeRoles("faculty"), getInteractionTypes);
router.post("/interaction_type", authorizeRoles("faculty"), addInteractionType);
router.put(
  "/interaction_type/:interaction_id",
  authorizeRoles("faculty"),
  updateInteractionType
);
router.delete(
  "/interaction_type/:interaction_id",
  authorizeRoles("faculty"),
  deleteInteractionType
);

// Book routes
router.get("/books/all", facultyAccessMiddleware, getBookRecords);
router.get(
  "/books",
  authorizeByUserId,
  facultyAccessMiddleware,
  getBookRecords
);
router.post(
  "/books",
  authorizeByUserId,
  facultyAccessMiddleware,
  addBookRecord
);
router.put(
  "/books/:Book_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  updateBookRecord
);
router.delete(
  "/books/:Book_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  deleteBookRecord
);

// PHD awarded routes
router.get("/guidance", authorizeRoles("faculty"), getFacultyGuidanceRecords);
router.post(
  "/guidance",
  authorizeRoles("faculty"),
  uploadFacultyGuidance,
  compressUploadedFile,
  addFacultyGuidanceRecord
);
router.put(
  "/guidance/:Guidance_id",
  authorizeRoles("faculty"),
  uploadFacultyGuidance,
  compressUploadedFile,
  updateFacultyGuidanceRecord
);
router.delete(
  "/guidance/:Guidance_id",
  authorizeRoles("faculty"),
  deleteFacultyGuidanceRecord
);

// Sponsored Research Routes
router.get(
  "/sponsored-research",
  authorizeRoles("faculty"),
  getSponsoredResearch
);
router.post(
  "/sponsored-research",
  authorizeRoles("faculty"),
  uploadFacultySponsoredResearch,
  compressUploadedFile,
  addSponsoredResearch
);
router.put(
  "/sponsored-research/:sponsorship_id",
  authorizeRoles("faculty"),
  uploadFacultySponsoredResearch,
  compressUploadedFile,
  updateSponsoredResearch
);
router.delete(
  "/sponsored-research/:sponsorship_id",
  authorizeRoles("faculty"),
  deleteSponsoredResearch
);

// Consultancy Routes
router.get("/consultancy", authorizeRoles("faculty"), getConsultancyByFaculty);
router.post(
  "/consultancy",
  authorizeRoles("faculty"),
  uploadFacultyConsultancy,
  compressUploadedFile,
  addConsultancy
);
router.put(
  "/consultancy/:consultancy_id",
  authorizeRoles("faculty"),
  uploadFacultyConsultancy,
  compressUploadedFile,
  updateConsultancy
);
router.delete(
  "/consultancy/:consultancy_id",
  authorizeRoles("faculty"),
  deleteConsultancy
);

// Faculty Details Routes
router.get(
  "/faculty-details/:faculty_id",
  authorizeRoles("faculty"),
  getFacultyDetails
);
router.get("/faculty-details", authorizeRoles("faculty"), getFacultyDetails);
router.post("/faculty-details", authorizeRoles("faculty"), addFaculty);
router.put(
  "/faculty-details/:faculty_id",
  authorizeRoles("faculty"),
  updateFacultyDetails
);
router.delete(
  "/faculty-details/:faculty_id",
  authorizeRoles("faculty"),
  deleteFaculty
);

// Specialization Routes
router.get("/specializations", authorizeRoles("faculty"), getSpecializations);
router.post("/specializations", authorizeRoles("faculty"), addSpecialization);
router.put(
  "/specializations/:specialization_id",
  authorizeRoles("faculty"),
  updateSpecialization
);
router.delete(
  "/specializations/:specialization_id",
  authorizeRoles("faculty"),
  deleteSpecialization
);

router.get(
  "/facultyimage/:faculty_id",
  authorizeRoles("faculty"),
  getFacultyImage
); // Route to get faculty image
router.put(
  "/facultyimage/:faculty_id",
  authorizeRoles("faculty"),
  uploadFacultyImage,
  compressUploadedFile,
  updateFacultyImage
); // Route to update faculty image
router.delete(
  "/facultyimage/:faculty_id",
  authorizeRoles("faculty"),
  deleteFacultyImage
); // Route to delete faculty image

// Faculty Patent Routes
router.get("/patent/all", facultyAccessMiddleware, getFacultyPatents); // Get all patents
router.get(
  "/patent",
  authorizeByUserId,
  facultyAccessMiddleware,
  getFacultyPatents
); // Get patents by faculty_id
router.post(
  "/patent",
  uploadPatentDocument,
  authorizeByUserId,
  facultyAccessMiddleware,
  addFacultyPatent
); // Add a new patent
router.put(
  "/patent/:patent_id",
  uploadPatentDocument,
  authorizeByUserId,
  facultyAccessMiddleware,
  updateFacultyPatent
); // Update a patent
router.delete(
  "/patent/:patent_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  deleteFacultyPatent
); // Delete a patent

// Faculty Qualification Routes
router.get(
  "/qualification",
  authorizeRoles("faculty"),
  getFacultyQualifications
);
router.post(
  "/qualification",
  authorizeRoles("faculty"),
  addFacultyQualification
);
router.put(
  "/qualification/:education_id",
  authorizeRoles("faculty"),
  updateFacultyQualification
);
router.delete(
  "/qualification/:education_id",
  authorizeRoles("faculty"),
  deleteFacultyQualification
);

// Duty Orders Route
router.get(
  "/duty-orders",
  authorizeByUserId,
  facultyAccessMiddleware,
  getUserDutyOrders
);

router.get(
  "/circulars/:department_id",
  authorizeByUserId,
  facultyAccessMiddleware,
  authorizeSameDepartment,
  getCirculars
);

router.put("/last-seen", authorizeRoles("faculty"), updateLastSeen);

router.put(
  "/duty-orders/mark_seen",
  authorizeRoles("faculty"),
  markDutyOrderAsSeen
);
router.get(
  "/faculty-mapping",
  authorizeRoles("department", "faculty"),
  getFacultyMappingByDepartment
);

router.get(
  "/faculty-mapping",
  authorizeRoles("faculty", "department"),
  getFacultyMappingByDepartment
);

export default router;
