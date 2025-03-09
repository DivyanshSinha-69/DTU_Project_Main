import express from "express";
import {
  uploadDepartmentCircular, 
  uploadDepartmentOrder, 
  compressUploadedFile
} from "../config/departmentMulterConfig.js";

import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

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


// Department Session Routes
router.post("/login", departmentLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);


router.use(authenticateToken);  // Middleware to authenticate token and verify user roles.

// Circular Routes
router.get("/circulars/:department_id?", authorizeRoles("department"), getCirculars);
router.post("/circulars", authorizeRoles("department"), uploadDepartmentCircular, compressUploadedFile, addCircular);
router.put("/circulars/:circular_id", authorizeRoles("department"), uploadDepartmentCircular, compressUploadedFile, updateCircular);
router.delete("/circulars/:circular_id", authorizeRoles("department"), deleteCircular);

// Order Routes
router.get("/orders/:department_id?", authorizeRoles("department"), getOrders);
router.post("/orders", authorizeRoles("department"), uploadDepartmentOrder, compressUploadedFile, addOrder);
router.put("/orders/:order_id", authorizeRoles("department"), uploadDepartmentOrder, compressUploadedFile, updateOrder);
router.delete("/orders/:order_id", authorizeRoles("department"), deleteOrder);

// Faculty Orders Routes
router.get("/faculty-orders/:faculty_id?", authorizeRoles("department"), getFacultyOrders);
router.post("/faculty-orders", authorizeRoles("department"), addFacultyOrder);
router.put("/faculty-orders/:id", authorizeRoles("department"), updateFacultyOrder);
router.delete("/faculty-orders/:id", authorizeRoles("department"), deleteFacultyOrder);
router.get("/faculty-orders/order/:order_number", authorizeRoles("department"), getFacultiesForOrder);

// Department Details Routes
router.get("/departments/:department_id?", authorizeRoles("department"), getDepartments);
router.post("/departments", authorizeRoles("department"), addDepartment);
router.put("/departments/:department_id", authorizeRoles("department"), updateDepartment);
router.delete("/departments/:department_id", authorizeRoles("department"), deleteDepartment);

export default router;
