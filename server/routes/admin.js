import express from "express";
import { getall,getData } from "../controllers/admin.js";
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getall);
router.post("/getdata",getData);


// router.get("/me", isAuthenticated, getMyProfile);

export default router;