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

// router.get("/me", isAuthenticated, getMyProfile);

export default router;
