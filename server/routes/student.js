import express from "express";
import { addProfessionalSkills, deleteProfessionalSkills, getProfessionalSKills, getall, updateProfessionalSkills } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);
router.post("/profskills",getProfessionalSKills)
router.put("/updateprofessionalskills",updateProfessionalSkills)
router.delete("/deleteprofessionalskills",deleteProfessionalSkills);
router.post("/addprofessionalskills",addProfessionalSkills)

// router.get("/me", isAuthenticated, getMyProfile);

export default router;