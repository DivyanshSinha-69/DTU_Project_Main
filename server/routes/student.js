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
  getAcknowledgement
} from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);
router.post("/profskills", getProfessionalSkills);
router.put("/updateprofessionalskills", updateProfessionalSkills);
router.delete("/deleteprofessionalskills", deleteProfessionalSkills);
router.post("/addprofessionalskills", addProfessionalSkills);
router.post("/personaldetails", getPersonalDetails);
router.put("/updatepersonaldetails", updatePersonalDetails);
router.post("/upload", uploadImage);
router.post("/getimage",getImage);

router.post("/placement", getPlacement);
router.delete("/deleteplacement", deletePlacement);
router.post("/addplacement", addPlacement);

router.post("/getpdf",getPdf);
router.post("/uploadpdf",uploadPdf);

router.post("/getmtecheducationdetails",getMtechEducationDetails);
router.put("/updatemtecheducationdetails",updateMtechEducationDetails);
router.post("/getbtecheducationdetails",getBtechEducationDetails);
router.put("/updatebtecheducationdetails",updateBtechEducationDetails);

router.post("/uploadscorecard",uploadScoreCard);
router.post("/getscorecard",getScoreCard);

router.post("/getentrepreneurdetails",getEntrepreneurDetails);
router.put("/updateentrepreneurdetails",updateEntrepreneurDetails);

router.post("/uploadcompanyregcert",uploadCompanyRegCert);
router.post("/getcompanyregcert",getCompanyRegCert);

router.post("/gethighereducationdetails",getHigherEducationDetails);
router.put("/updatehighereducationdetails", updateHigherEducationDetails)

router.post("/uploadofferletter",uploadofferletter);
router.post("/getofferletter",getOfferLetter);

router.post("/publication", getPublication);
router.delete("/deletepublication", deletePublication);
router.post("/addpublication", addPublication);

router.post("/uploadmanuscript",uploadManuscript);
router.post("/getmanuscript",getManuscript);

router.post("/addinterinstituteactivity",addInterInstituteActivity);
router.post("/getinterinstituteactivity", getInterInstituteActivity);
router.delete("/deleteinterinstituteactivity", deleteInterInstituteActivity);

router.post("/getcertificate",getCertificate);
router.post("/uploadcertificate",uploadCertificate);
router.post("/getacknowledgement",getAcknowledgement);
// router.get("/me", isAuthenticated, getMyProfile);


export default router;
