import fs from "fs";
import path from "path";
import multer from "multer";
import { compressImage, compressPDF } from "../utils/fileCompressor.js"; // Import compression utility

/**
 * 📝 Multer Storage for Student Documents (Assignments, Projects, etc.)
 */
const studentDocumentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const student_id = req.body.student_id || req.params.student_id;
    if (!student_id) return cb(new Error("Student ID is required"), null);
    
    const uploadPath = path.join("public", "Students", "Documents", student_id);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (!file || !file.originalname) return cb(new Error("Invalid file upload"), null);

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});



/**
 * 📸 Multer Storage for Student Images (Profile, ID cards, etc.)
 */
const studentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public", "Students", "Images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const student_id = req.params.student_id || req.body.student_id;
    if (!student_id) return cb(new Error("Student ID is required"), null);
    
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${student_id}_${Date.now()}${fileExtension}`;
    cb(null, uniqueFilename);
  },
});

/**
 * 🎓 Multer Storage for Student Certificates
 */
const studentCertificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const student_id = req.body.student_id;
    if (!student_id) return cb(new Error("Student ID is required"), null);
    
    const uploadPath = path.join("public", "Students", "Certificates", student_id);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

/**
 * 📑 Multer Storage for Student Results/Transcripts
 */
const studentResultStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const student_id = req.body.student_id;
    if (!student_id) return cb(new Error("Student ID is required"), null);
    
    const uploadPath = path.join("public", "Students", "Results", student_id);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

const placementStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const department_id = req.user?.department_id;
      const { roll_no } = req.query || req.body;
      if (!roll_no) return cb(new Error("Roll number is required"), null);
      
      // Sanitize roll_no by replacing slashes with underscores
      const sanitizedRollNo = roll_no.replace(/\//g, '_');
      
      const uploadPath = path.join("public", department_id, "Students", "Placements", sanitizedRollNo);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const uniqueFilename = `${baseName}_${timestamp}${ext}`;
      cb(null, uniqueFilename);
    },
  });

// Storage for Higher Education Documents
const higherEduDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const department_id = req.user?.department_id;
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Sanitize roll_no for folder name
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "HigherEducation", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

const entrepreneurshipDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const department_id = req.user?.department_id;
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Sanitize roll_no for folder name
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "Entrepreneurship", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

// Storage for Current Education Documents
const currentEduDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Optional: Use department_id if available
    const department_id = req.user?.department_id || req.query.department_id || req.body.department_id || "General";
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "CurrentEducation", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

const extracurricularDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Optional: Use department_id if available
    const department_id = req.user?.department_id || req.query.department_id || req.body.department_id || "General";
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "Extracurricular", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

// Storage for Society Documents
const societyDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Optional: Use department_id if available
    const department_id = req.user?.department_id || req.query.department_id || req.body.department_id || "General";
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "Societies", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

// Storage for Event Organization Documents
const eventOrgDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    // Optional: Use department_id if available
    const department_id = req.user?.department_id || req.query.department_id || req.body.department_id || "General";
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "EventOrg", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

// Storage for Publication Documents
const publicationDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { roll_no } = req.query || req.body;
    if (!roll_no) return cb(new Error("Roll number is required"), null);

    const department_id = req.user?.department_id || req.query.department_id || req.body.department_id || "General";
    const sanitizedRollNo = roll_no.replace(/\//g, '_');
    const uploadPath = path.join("public", department_id, "Students", "Publications", sanitizedRollNo);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueFilename);
  },
});

// Storage for Bulletin Board Post Documents
const postDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get user_id and user_type from authenticated user (req.user)
    const user_id = req.user?.user_id || req.body.user_id || req.query.user_id;
    const user_type = req.user?.user_type || req.body.user_type || req.query.user_type || "General";

    if (!user_id) return cb(new Error("User ID is required for file upload"), null);

    // Directory: public/{user_type}/{user_id}/BulletinBoard/
    const safeUserId = user_id.replace(/[\/\\]/g, "_");
    const uploadPath = path.join("public", "bulletinboard", user_type, safeUserId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueFilename = `${baseName}_${timestamp}${ext}`;
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

// File filter for student images (JPG/PNG only)
const studentImageFilter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG or PNG files are allowed"), false);
  }
};

export const uploadPostDocument = multer({
  storage: postDocStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 10 MB
}).single("document");

export const uploadPublicationDoc = multer({
  storage: publicationDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

export const uploadEventOrgDoc = multer({
  storage: eventOrgDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

export const uploadSocietyDoc = multer({
  storage: societyDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

export const uploadExtracurricularDoc = multer({
  storage: extracurricularDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

export const uploadCurrentEduDoc = multer({
  storage: currentEduDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

export const uploadPlacementDoc = multer({
    storage: placementStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  }).single("document");

// Multer middleware export
export const uploadHigherEduDoc = multer({
  storage: higherEduDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("document");

// Multer middleware export
export const uploadEntrepreneurshipDoc = multer({
  storage: entrepreneurshipDocStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("document");

// Upload Middleware for Student Documents
const uploadStudentDocument = multer({
  storage: studentDocumentStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
}).single("document");

// Upload Middleware for Student Images
const uploadStudentImage = multer({
  storage: studentImageStorage,
  fileFilter: studentImageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("student_image");

// Upload Middleware for Student Certificates
const uploadStudentCertificate = multer({
  storage: studentCertificateStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("certificate");

// Upload Middleware for Student Results
const uploadStudentResult = multer({
  storage: studentResultStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("result");

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

const checkFileReceived = (req, res, next) => {
  console.log("📥 Received request for student file upload...");
  console.log("➡️ req.body:", req.body);
  console.log("➡️ req.params:", req.params);
  console.log("➡️ req.file:", req.file);
  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded. Check if frontend is sending correctly." });
  }
  next();
};

// Export Middleware
export {
  uploadStudentDocument,
  uploadStudentImage,
  uploadStudentCertificate,
  uploadStudentResult,
  compressUploadedFile,
  checkFileReceived,
};