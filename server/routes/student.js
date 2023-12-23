import express from "express";
import { login } from "../controllers/student.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);

// router.get("/logout", logout);

// router.get("/me", isAuthenticated, getMyProfile);

export default router;