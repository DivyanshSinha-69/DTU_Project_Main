import express from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/facultyAuthController.js";

const router = express.Router();

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

export default router; // Ensure this is the default export
