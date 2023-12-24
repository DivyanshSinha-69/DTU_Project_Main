import express from "express";
import { getall, login, logout } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/getall", getall);
router.get("/logout", logout);

// router.get("/me", isAuthenticated, getMyProfile);

export default router;