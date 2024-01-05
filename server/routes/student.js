import express from "express";
import { getProfessionalSKills, getall, updateProfessionalSkills } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);
router.post("/profskills",getProfessionalSKills)
router.put("/updateprofessionalskills",updateProfessionalSkills)

// router.get("/me", isAuthenticated, getMyProfile);

export default router;