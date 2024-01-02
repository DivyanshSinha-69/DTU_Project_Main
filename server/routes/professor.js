import express from "express";
import { getall, login } from "../controllers/professor.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/getall", getall);


// router.get("/me", isAuthenticated, getMyProfile);

export default router;