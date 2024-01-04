import express from "express";
import { getall } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);


// router.get("/me", isAuthenticated, getMyProfile);

export default router;