import express from "express";
import {
    uploadDepartmentCircular,
    uploadDepartmentOrder,
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
} from "../controllers/department.js";

const router = express.Router();

// router.use(authenticateToken);

// Circular Routes
router.get("/circulars/:circular_number?", getCirculars);
router.post("/circulars", uploadDepartmentCircular, addCircular);
router.put("/circulars/:circular_id", uploadDepartmentCircular, updateCircular);
router.delete("/circulars/:circular_id", deleteCircular);

// Order Routes
router.get("/orders/:order_number?", getOrders);
router.post("/orders", uploadDepartmentOrder, addOrder);
router.put("/orders/:order_id", uploadDepartmentOrder, updateOrder);
router.delete("/orders/:order_id", deleteOrder);

// Faculty Orders Routes
router.get("/faculty-orders/:faculty_id?", getFacultyOrders);
router.post("/faculty-orders", addFacultyOrder);
router.put("/faculty-orders/:id", updateFacultyOrder);
router.delete("/faculty-orders/:id", deleteFacultyOrder);

router.get("/faculty-orders/order/:order_number", getFacultiesForOrder);

export default router;
