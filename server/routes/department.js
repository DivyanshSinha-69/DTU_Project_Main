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
  getFacultyMappings,
  addFacultyMapping,
  updateFacultyMapping,
  deleteFacultyMapping,
  getStudentMappings,
  addStudentMapping,
  updateStudentMapping,
  deleteStudentMapping,
  getDepartments,
  addDepartment,
  getMappingsByOrderNumber,
  updateDepartment,
  deleteDepartment,
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
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
router.get("/faculty-orders/:faculty_id?", authorizeRoles("department"), getFacultyMappings);
router.post("/faculty-orders", authorizeRoles("department"), addFacultyMapping);
router.put("/faculty-orders/:id", authorizeRoles("department"), updateFacultyMapping);
router.delete("/faculty-orders/:id", authorizeRoles("department"),   deleteFacultyMapping);

// Student Orders Routes
router.get("/student-orders/:faculty_id?", authorizeRoles("department"), getStudentMappings);
router.post("/student-orders", authorizeRoles("department"), addStudentMapping);
router.put("/student-orders/:id", authorizeRoles("department"), updateStudentMapping);
router.delete("/student-orders/:id", authorizeRoles("department"),   deleteStudentMapping);

// Faculty-Student Mix Route
router.get("/orders_map", authorizeRoles("department"), getMappingsByOrderNumber);

// Department Details Routes
router.get("/departments/:department_id?", authorizeRoles("department"), getDepartments);
router.post("/departments", authorizeRoles("department"), addDepartment);
router.put("/departments/:department_id", authorizeRoles("department"), updateDepartment);
router.delete("/departments/:department_id", authorizeRoles("department"), deleteDepartment);


router.get("/notifications/:user_id?", authorizeRoles("department", "faculty"), getNotifications);
router.post("/notifications", authorizeRoles("department"), addNotification);
router.put("/notifications/:notification_id", authorizeRoles("department"), updateNotification);
router.delete("/notifications/:notification_id", authorizeRoles("department"), deleteNotification);


export default router;
