import fs from 'fs';
import path from 'path';
import multer from 'multer';  // Ensure multer is imported
import { fileURLToPath } from 'url';  // Import URL utilities
import { dirname } from 'path';  // Import path utilities

// Get the current directory of the file (equivalent to __dirname in ES modules)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const faculty_id = req.body.faculty_id;
    const uploadPath = path.join(__dirname, '..', 'public', 'Faculty', 'ResearchPapers', faculty_id);
    
    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);  // Upload destination path
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName);  // File name is the original file name
  }
});

// Multer file upload handling
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10MB
}).single('pdf');  // Ensure this matches the field name in Postman

export default upload;
