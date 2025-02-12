import express from "express";
import { forgotPassword,
        resetPassword,
        facultyLogin,
        refreshToken,
        logout,
        
        } from "../controllers/facultyAuthController.js";

const router = express.Router();



router.post("/login", facultyLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

export default router; // Ensure this is the default export