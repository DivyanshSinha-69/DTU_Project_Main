import express from "express";
import {
  addProfessionalSkills,
  deleteProfessionalSkills,
  getPersonalDetails,
  getProfessionalSkills,
  getall,
  updateProfessionalSkills,
  updatePersonalDetails,
  uploadImage,
  getImage,
  getPdf,
  uploadPdf,
  getMtechEducationDetails,
  updateMtechEducationDetails,
  uploadScoreCard,
  getScoreCard,
  getEntrepreneurDetails,
  updateEntrepreneurDetails,
  uploadCompanyRegCert,
  getCompanyRegCert,
  updateHigherEducationDetails,
  uploadofferletter,
  getOfferLetter,
  uploadManuscript,
  getManuscript,
  addPublication,
  deletePublication,
  getPublication,
  addInterInstituteActivity,
  getInterInstituteActivity,
  getCertificate,
  uploadCertificate,
  deleteInterInstituteActivity,
  getBtechEducationDetails,
  updateBtechEducationDetails,

  getAcknowledgement,
  updateLastSeen,
  
  studentLogin,
  studentRefreshToken,
  verifyAuth,
  studentLogout,
  forgotStudentPassword,
  resetStudentPassword,
  getStudentDetails,
  addStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
  getPlacements,
  getPlacementByRollNo,
  addPlacement,
  updatePlacement,
  deletePlacement,
  getAllPreviousPlacements,
  getPreviousPlacementsByRollNo,
  addPreviousPlacement,
  updatePreviousPlacement,
  deletePreviousPlacement,
  getCurrentLocation,
  addCurrentLocation,
  updateCurrentLocation,
  deleteCurrentLocation,
  getHigherEducationDetails,
  addHigherEducationDetail,
  updateHigherEducationDetail,
  deleteHigherEducationDetail,
  getEntrepreneurshipDetails,
  addEntrepreneurshipDetail,
  updateEntrepreneurshipDetail,
  deleteEntrepreneurshipDetail,
  getPreviousEducationDetails,
  addPreviousEducationDetail,
  updatePreviousEducationDetail,
  deletePreviousEducationDetail,
  getCurrentEducationDetails,
  addCurrentEducationDetail,
  updateCurrentEducationDetail,
  deleteCurrentEducationDetail,
  getExtracurricularActivities,
  addExtracurricularActivity,
  updateExtracurricularActivity,
  deleteExtracurricularActivity,
  getSocietyDetails,
  addSocietyDetail,
  updateSocietyDetail,
  deleteSocietyDetail,
  getEventOrgDetails,
  addEventOrgDetail,
  updateEventOrgDetail,
  deleteEventOrgDetail,
  getPublicationDetails,
  addPublicationDetail,
  updatePublicationDetail,
  deletePublicationDetail,
} from "../controllers/student.js";

import { getFacultyResearchByMonth } from "../controllers/faculty.js";

import {
  authenticateToken,
  authorizeRoles,
  authorizeByRoleCombo,
  authorizeByUserId,
  authorizeSameDepartment,
  
} from "../middlewares/auth.js";
import { studentAccessMiddleware } from "../middlewares/sharedRoleCombos.js";
import { 
  compressUploadedFile,
  checkFileReceived,
  uploadPlacementDoc,
  uploadHigherEduDoc,
  uploadEntrepreneurshipDoc,
  uploadCurrentEduDoc,
  uploadExtracurricularDoc,
  uploadSocietyDoc,
  uploadEventOrgDoc,
  uploadPublicationDoc } from "../config/studentMulterConfig.js";

import { parseMultipartFields } from "../middlewares/parseMultipartFields.js";

const router = express.Router();

// Route for student login
router.post("/login", studentLogin);
router.post("/refresh", studentRefreshToken);
router.post("/logout", authenticateToken, studentLogout);
router.get("/verify", verifyAuth);

// Route for student password reset
router.post("/forgotpassword", forgotStudentPassword);
router.post("/resetpassword/:token", resetStudentPassword);

// Route for student details
router.get("/details", authenticateToken, authorizeByUserId, studentAccessMiddleware, getStudentDetails);
router.post("/details/", authenticateToken, authorizeByUserId, studentAccessMiddleware, addStudentDetails);
router.put("/details/:roll_no", authenticateToken, authorizeByUserId, studentAccessMiddleware, updateStudentDetails);
router.delete("/details/:roll_no", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteStudentDetails);

router.get("/faculty-research-digest", authenticateToken, authorizeByUserId, getFacultyResearchByMonth);

router.get("/placement/all", authenticateToken, studentAccessMiddleware, getPlacements);
router.get("/placement", authenticateToken, authorizeByUserId, studentAccessMiddleware, getPlacementByRollNo);
router.post("/placement", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadPlacementDoc, compressUploadedFile, addPlacement);
router.put("/placement/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadPlacementDoc, compressUploadedFile, updatePlacement);
router.delete("/placement/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deletePlacement);

// Route for previous placements
router.get("/preplacement/all", authenticateToken, studentAccessMiddleware, getAllPreviousPlacements);
router.get("/preplacement", authenticateToken, authorizeByUserId, studentAccessMiddleware, getPreviousPlacementsByRollNo);
router.post("/preplacement", authenticateToken, authorizeByUserId, studentAccessMiddleware, addPreviousPlacement);
router.put("/preplacement/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, updatePreviousPlacement);
router.delete("/preplacement/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deletePreviousPlacement);

// Route for current location
router.get('/curlocation', authenticateToken, authorizeByUserId, studentAccessMiddleware, getCurrentLocation);
router.post('/curlocation', authenticateToken, authorizeByUserId, studentAccessMiddleware, addCurrentLocation);
router.put('/curlocation/:location_id', authenticateToken, authorizeByUserId, studentAccessMiddleware, updateCurrentLocation);
router.delete('/curlocation/:location_id', authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteCurrentLocation);

// Route for higher education details
router.get("/higher-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, getHigherEducationDetails);
router.post("/higher-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadHigherEduDoc, compressUploadedFile, addHigherEducationDetail);
router.put("/higher-education/:education_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadHigherEduDoc, compressUploadedFile, updateHigherEducationDetail);
router.delete("/higher-education/:education_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteHigherEducationDetail);

// Route for entrepreneurship details
router.get("/entrepreneurship", authenticateToken, authorizeByUserId, studentAccessMiddleware, getEntrepreneurshipDetails);
router.post("/entrepreneurship", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadEntrepreneurshipDoc, compressUploadedFile, addEntrepreneurshipDetail);
router.put("/entrepreneurship/:entrepreneurship_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadEntrepreneurshipDoc, compressUploadedFile, updateEntrepreneurshipDetail);
router.delete("/entrepreneurship/:entrepreneurship_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteEntrepreneurshipDetail);

// Route for previous education details
router.get("/previous-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, getPreviousEducationDetails);
router.post("/previous-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, addPreviousEducationDetail);
router.put("/previous-education/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, updatePreviousEducationDetail);
router.delete("/previous-education/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deletePreviousEducationDetail);

// Route for current education details
router.get("/current-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, getCurrentEducationDetails);
router.post("/current-education", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadCurrentEduDoc, compressUploadedFile, addCurrentEducationDetail);
router.put("/current-education/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadCurrentEduDoc, compressUploadedFile, updateCurrentEducationDetail);
router.delete("/current-education/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteCurrentEducationDetail);

// Route for extracurricular activities
router.get("/extracurricular", authenticateToken, authorizeByUserId, studentAccessMiddleware, getExtracurricularActivities);
router.post("/extracurricular", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadExtracurricularDoc, compressUploadedFile, addExtracurricularActivity);
router.put("/extracurricular/:activity_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadExtracurricularDoc, compressUploadedFile, updateExtracurricularActivity);
router.delete("/extracurricular/:activity_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteExtracurricularActivity);

// Route for society details
router.get("/society", authenticateToken, authorizeByUserId, studentAccessMiddleware, getSocietyDetails);
router.post("/society", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadSocietyDoc, compressUploadedFile, addSocietyDetail);
router.put("/society/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadSocietyDoc, compressUploadedFile, updateSocietyDetail);
router.delete("/society/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteSocietyDetail);

// Route for event organization details
router.get("/event-org", authenticateToken, authorizeByUserId, studentAccessMiddleware, getEventOrgDetails);
router.post("/event-org", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadEventOrgDoc, compressUploadedFile, addEventOrgDetail);
router.put("/event-org/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadEventOrgDoc, compressUploadedFile, updateEventOrgDetail);
router.delete("/event-org/:id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deleteEventOrgDetail);

// Route for publication details
router.get("/publication", authenticateToken, authorizeByUserId, studentAccessMiddleware, getPublicationDetails);
router.post("/publication", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadPublicationDoc, compressUploadedFile, addPublicationDetail);
router.put("/publication/:research_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, uploadPublicationDoc, compressUploadedFile, updatePublicationDetail);
router.delete("/publication/:research_id", authenticateToken, authorizeByUserId, studentAccessMiddleware, deletePublicationDetail);

router.get("/getall", getall);
router.post("/profskills", getProfessionalSkills);
router.put("/updateprofessionalskills", updateProfessionalSkills);
router.delete("/deleteprofessionalskills", deleteProfessionalSkills);
router.post("/addprofessionalskills", addProfessionalSkills);
router.post("/personaldetails", getPersonalDetails);
router.put("/updatepersonaldetails", updatePersonalDetails);
router.post("/upload", uploadImage);
router.post("/getimage", getImage);

router.post("/getpdf", getPdf);
router.post("/uploadpdf", uploadPdf);

router.post("/getmtecheducationdetails", getMtechEducationDetails);
router.put("/updatemtecheducationdetails", updateMtechEducationDetails);
router.post("/getbtecheducationdetails", getBtechEducationDetails);
router.put("/updatebtecheducationdetails", updateBtechEducationDetails);

router.post("/uploadscorecard", uploadScoreCard);
router.post("/getscorecard", getScoreCard);

router.post("/getentrepreneurdetails", getEntrepreneurDetails);
router.put("/updateentrepreneurdetails", updateEntrepreneurDetails);

router.post("/uploadcompanyregcert", uploadCompanyRegCert);
router.post("/getcompanyregcert", getCompanyRegCert);

router.put("/updatehighereducationdetails", updateHigherEducationDetails);

router.post("/uploadofferletter", uploadofferletter);
router.post("/getofferletter", getOfferLetter);

router.post("/publication", getPublication);
router.delete("/deletepublication", deletePublication);
router.post("/addpublication", addPublication);

router.post("/uploadmanuscript", uploadManuscript);
router.post("/getmanuscript", getManuscript);

router.post("/addinterinstituteactivity", addInterInstituteActivity);
router.post("/getinterinstituteactivity", getInterInstituteActivity);
router.delete("/deleteinterinstituteactivity", deleteInterInstituteActivity);

router.post("/getcertificate", getCertificate);
router.post("/uploadcertificate", uploadCertificate);
router.post("/getacknowledgement", getAcknowledgement);
// router.get("/me", isAuthenticated, getMyProfile);

router.put(
  "/notifications/last-seen/student/:roll_no",
  authenticateToken,
  authorizeRoles("student"),
  updateLastSeen
);

export default router;
