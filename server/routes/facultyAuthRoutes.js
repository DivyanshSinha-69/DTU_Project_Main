import express from "express";
import { requestPasswordReset, resetPassword } from "../controllers/facultyAuthController.js";

const router = express.Router();

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router; // Ensure this is the default export
