import express from "express";
import { getall,
         getData, 
         getExcel,
         adminLogin,
         adminRefreshToken,
         adminLogout,
         adminVerifyAuth} from "../controllers/admin.js";
// import { isAuthenticated } from "../middlewares/auth.js";

import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/refresh", adminRefreshToken);
router.post("/logout", authenticateToken, adminLogout);
router.get("/verify", adminVerifyAuth);


router.get("/getall", getall);
router.post("/getdata", getData);
router.post("/getexcel", getExcel);

// router.get("/me", isAuthenticated, getMyProfile);

export default router;
