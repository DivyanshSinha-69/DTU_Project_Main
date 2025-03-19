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
    if (!file || !file.originalname) return cb(new Error("Invalid file upload"), null);

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`; // Adding timestamp to filename
    cb(null, uniqueFilename);
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
    const faculty_id = req.params.faculty_id || req.body.faculty_id; // Check both params & body
    if (!faculty_id) return cb(new Error("Faculty ID is required"), null);
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${faculty_id}_${Date.now()}${fileExtension}`;
    cb(null, uniqueFilename);
  },
});

const facultyGuidanceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      const { faculty_id } = req.body;
      if (!faculty_id) {
          return cb(new Error('Faculty ID is required'), null);
      }

      const uploadPath = path.join("public", "Faculty", "Guidance Proof", faculty_id);

      // Ensure the directory exists
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filename = `${path.basename(file.originalname, ext)}_${timestamp}${ext}`;

      cb(null, filename);
  }
});

const facultySponsoredResearchStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { faculty_id } = req.body;
    if (!faculty_id) {
      return cb(new Error("Faculty ID is required for file upload"), null);
    }

    const uploadPath = path.join("public", "Faculty", "SponsoredResearch", faculty_id);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    if (!file || !file.originalname) return cb(new Error("Invalid file upload"), null);

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`; // Adding timestamp to filename

    cb(null, uniqueFilename);
  },
});

const facultyConsultancyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { faculty_id } = req.body;
    if (!faculty_id) {
      return cb(new Error("Faculty ID is required for file upload"), null);
    }

    const uploadPath = path.join("public", "Faculty", "Consultancy Records", faculty_id);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    if (!file || !file.originalname) return cb(new Error("Invalid file upload"), null);

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`; // Adding timestamp to filename

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
}).single("document");

// Upload Middleware for Faculty Images
const uploadFacultyImage = multer({
  storage: facultyImageStorage,
  fileFilter: facultyImageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("faculty_image");
/**
 * 🛠️ Compression Middleware for Uploaded Files
 */

const uploadFacultyGuidance = multer({
  storage: facultyGuidanceStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single('document');

const uploadFacultySponsoredResearch = multer({
  storage: facultySponsoredResearchStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("document"); // The field name for file upload

const uploadFacultyConsultancy = multer({
  storage: facultyConsultancyStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("document"); // The field name for file upload


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

const checkFileReceived = (req, res, next) => {
  console.log("📥 Received request for image upload...");
  console.log("➡️ req.body:", req.body);
  console.log("➡️ req.params:", req.params);
  console.log("➡️ req.file:", req.file); // Should not be undefined or null
  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded. Check if frontend is sending correctly." });
  }
  next();
};

// Export Middleware
export {
  uploadResearchPaper,
  uploadFacultyInteraction,
  uploadFacultyImage,
  compressUploadedFile,
  checkFileReceived,
  uploadFacultyGuidance,
  uploadFacultyConsultancy,
  uploadFacultySponsoredResearch
};
