import express from "express";
import {login, logout } from "../controllers/common.js";
import { getDataFromToken } from "../utils/featues.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/logout", logout);
router.post("/login", login);
router.get("/cookiescheck",getDataFromToken)


// router.get("/me", isAuthenticated, getMyProfile);

export default router;