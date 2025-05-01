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
  getPlacement,
  deletePlacement,
  addPlacement,
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
  getHigherEducationDetails,
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
} from "../controllers/student.js";

import {
  authenticateToken,
  authorizeRoles,
  authorizeByRoleCombo,
  authorizeByUserId,
  authorizeSameDepartment,
} from "../middlewares/auth.js";
import { studentAccessMiddleware } from "../middlewares/sharedRoleCombos.js";

const router = express.Router();

// Route for student login
router.post("/login", studentLogin);
router.post("/refresh", studentRefreshToken);
router.post("/logout", studentLogout);
router.get("/verify", verifyAuth);

// Route for student password reset
router.post("/forgotpassword", forgotStudentPassword);
router.post("/resetpassword/:token", resetStudentPassword);

// Route for student details
router.get(
  "/details",
  authenticateToken,
  authorizeByUserId,
  studentAccessMiddleware,
  getStudentDetails
);
router.post(
  "/details/",
  authenticateToken,
  authorizeByUserId,
  studentAccessMiddleware,
  addStudentDetails
);
router.put(
  "/details/:roll_no",
  authenticateToken,
  authorizeByUserId,
  studentAccessMiddleware,
  updateStudentDetails
);
router.delete(
  "/details/:roll_no",
  authenticateToken,
  authorizeByUserId,
  studentAccessMiddleware,
  deleteStudentDetails
);

router.get("/getall", getall);
router.post("/profskills", getProfessionalSkills);
router.put("/updateprofessionalskills", updateProfessionalSkills);
router.delete("/deleteprofessionalskills", deleteProfessionalSkills);
router.post("/addprofessionalskills", addProfessionalSkills);
router.post("/personaldetails", getPersonalDetails);
router.put("/updatepersonaldetails", updatePersonalDetails);
router.post("/upload", uploadImage);
router.post("/getimage", getImage);

router.post("/placement", getPlacement);
router.delete("/deleteplacement", deletePlacement);
router.post("/addplacement", addPlacement);

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

router.post("/gethighereducationdetails", getHigherEducationDetails);
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
