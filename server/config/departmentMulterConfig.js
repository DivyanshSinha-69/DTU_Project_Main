import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 📝 Multer Storage for Department Circulars
 */
const departmentCircularStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public", "Department", "Circulars");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `circular_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

/**
 * 📜 Multer Storage for Department Duty Orders
 */
const departmentOrderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public", "Department", "Orders");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `order_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// File filter (accept only PDF, JPG, PNG)
const fileFilter = (req, file, cb) => {
  if (["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
  }
};

// Export Multer instances for department circulars and orders
const uploadDepartmentCircular = multer({
  storage: departmentCircularStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
}).single("circular_file");

const uploadDepartmentOrder = multer({
  storage: departmentOrderStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
}).single("order_file");

export { uploadDepartmentCircular, uploadDepartmentOrder };
