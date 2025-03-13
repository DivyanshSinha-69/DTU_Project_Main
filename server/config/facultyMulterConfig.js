import fs from "fs";
import path from "path";
import multer from "multer";
import { compressImage, compressPDF } from "../utils/fileCompressor.js"; // Import compression utility

/**
 * 📝 Multer Storage for Research Papers
 */
const researchPaperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const faculty_id = req.body.faculty_id;
    const uploadPath = path.join("public", "Faculty", "ResearchPapers", faculty_id);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

/**
 * 📜 Multer Storage for Faculty Interactions
 */
const facultyInteractionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public", "Faculty", "Interactions");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `interaction_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

/**
 * 📂 Multer Storage for Faculty Images
 */
const facultyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public", "Faculty", "images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const faculty_id = req.params.faculty_id;
    if (!faculty_id) return cb(new Error("Faculty ID is required"), null);
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${faculty_id}_${Date.now()}${fileExtension}`;
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

// File filter for faculty images (JPG only)
const facultyImageFilter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG or JPEG files are allowed"), false);
  }
};

// Upload Middleware for Research Papers
const uploadResearchPaper = multer({
  storage: researchPaperStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("pdf");

// Upload Middleware for Faculty Interactions
const uploadFacultyInteraction = multer({
  storage: facultyInteractionStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("interaction_document");

// Upload Middleware for Faculty Images
const uploadFacultyImage = multer({
  storage: facultyImageStorage,
  fileFilter: facultyImageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("faculty_image");

/**
 * 🛠️ Compression Middleware for Uploaded Files
 */
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
export {
  uploadResearchPaper,
  uploadFacultyInteraction,
  uploadFacultyImage,
  compressUploadedFile,
};
