import fs from "fs";
import path from "path";
import multer from "multer";
import { compressImage, compressPDF } from "../utils/fileCompressor.js"; // Import compression utility

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

// Upload Middleware for Circulars
const uploadDepartmentCircular = multer({
  storage: departmentCircularStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("circular_file");

// Upload Middleware for Orders
const uploadDepartmentOrder = multer({
  storage: departmentOrderStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("order_file");

// Compression Middleware
const compressUploadedFile = (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const ext = path.extname(filePath).toLowerCase();

  const handleNext = (err) => {
    if (err) return res.status(500).json({ message: "Error compressing file", error: err.message });
    next();
  };

  if ([".jpeg", ".jpg", ".png"].includes(ext)) {
    compressImage(filePath, handleNext);
  } else if (ext === ".pdf") {
    compressPDF(filePath, handleNext);
  } else {
    next();
  }
};

// Export Middleware
export { uploadDepartmentCircular, uploadDepartmentOrder, compressUploadedFile };
