import express from "express";
import {
  uploadDepartmentCircular, 
  uploadDepartmentOrder, 
  compressUploadedFile
} from "../config/departmentMulterConfig.js";

import { authenticateToken } from "../middlewares/auth.js";

import {
  getCirculars,
  addCircular,
  updateCircular,
  deleteCircular,
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getFacultyOrders,
  addFacultyOrder,
  updateFacultyOrder,
  deleteFacultyOrder,
  getFacultiesForOrder,
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  departmentLogin,
  refreshToken,
  logout,
} from "../controllers/department.js";

const router = express.Router();

// router.use(authenticateToken);

// Circular Routes
router.get("/circulars/:department_id?", getCirculars);
router.post("/circulars", uploadDepartmentCircular, compressUploadedFile, addCircular);
router.put("/circulars/:circular_id", uploadDepartmentCircular, compressUploadedFile, updateCircular);
router.delete("/circulars/:circular_id", deleteCircular);

// Order Routes
router.get("/orders/:department_id?", getOrders);
router.post("/orders", uploadDepartmentOrder, compressUploadedFile, addOrder);
router.put("/orders/:order_id", uploadDepartmentOrder, compressUploadedFile, updateOrder);
router.delete("/orders/:order_id", deleteOrder);

// Faculty Orders Routes
router.get("/faculty-orders/:faculty_id?", getFacultyOrders);
router.post("/faculty-orders", addFacultyOrder);
router.put("/faculty-orders/:id", updateFacultyOrder);
router.delete("/faculty-orders/:id", deleteFacultyOrder);
router.get("/faculty-orders/order/:order_number", getFacultiesForOrder);

// Department Details Routes
router.get("/departments/:department_id?", getDepartments);
router.post("/departments", addDepartment);
router.put("/departments/:department_id", updateDepartment);
router.delete("/departments/:department_id", deleteDepartment);

// Department Session Routes
router.post("/login", departmentLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
