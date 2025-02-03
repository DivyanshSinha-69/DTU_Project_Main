import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory of the file (equivalent to __dirname in ES modules)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up Multer storage for research papers
const researchPaperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const faculty_id = req.body.faculty_id;
    const uploadPath = path.join(
      "public",
      "Faculty",
      "ResearchPapers",
      faculty_id,
    );

    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Relative upload path
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName); // Use the original file name
  },
});

// Set up Multer storage for faculty images
const facultyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "public",
      "Faculty",
      "images",
    );

    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Upload destination path
  },
  filename: (req, file, cb) => {
    const faculty_id = req.params.faculty_id; // Using faculty_id from the route parameter
    if (!faculty_id) {
      return cb(new Error("Faculty ID is required to save the image"), null);
    }

    // Generate a unique filename based on the faculty_id and timestamp
    const fileExtension = path.extname(file.originalname); // Extract the file extension
    const timestamp = Date.now(); // Add a timestamp to ensure uniqueness
    const uniqueFilename = `${faculty_id}_${timestamp}${fileExtension}`; // Save as faculty_id_timestamp.extension

    cb(null, uniqueFilename); // Use the unique filename
  },
});

// File filter for faculty images (only allow JPG and JPEG)
const facultyImageFilter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG or JPEG files are allowed"), false);
  }
};

// Export Multer instances
const uploadResearchPaper = multer({
  storage: researchPaperStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single("pdf"); // Ensure this matches the field name in your requests

const uploadFacultyImage = multer({
  storage: facultyImageStorage,
  fileFilter: facultyImageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
}).single("faculty_image"); // Field name for faculty image uploads

export { uploadResearchPaper, uploadFacultyImage };
