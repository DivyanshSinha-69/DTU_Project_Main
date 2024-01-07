import express from "express";
import { addProfessionalSkills, deleteProfessionalSkills, getPersonalDetails, getProfessionalSKills, getall, updateProfessionalSkills,updatePersonalDetails } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);
router.post("/profskills",getProfessionalSKills)
router.put("/updateprofessionalskills",updateProfessionalSkills)
router.delete("/deleteprofessionalskills",deleteProfessionalSkills);
router.post("/addprofessionalskills",addProfessionalSkills)
router.post("/personaldetails",getPersonalDetails)
router.put("/updatepersonaldetails",updatePersonalDetails)
// router.get("/me", isAuthenticated, getMyProfile);

export default router;