import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PDFDocument } from "pdf-lib";
import { exec } from "child_process";

// Get the current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Multer storage for research papers
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

// Middleware to compress PDF using pdf-lib + Ghostscript
const compressPDF = async (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const tempPdfPath = filePath.replace(".pdf", "_temp.pdf");
  const finalCompressedPath = filePath.replace(".pdf", "_compressed.pdf");

  try {
    // 📝 Load PDF using pdf-lib
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Remove metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("pdf-lib");
    pdfDoc.setCreator("pdf-lib");

    // Save PDF (without metadata)
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(tempPdfPath, pdfBytes);

    // 🛠️ Apply Ghostscript for real compression
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${finalCompressedPath}" "${tempPdfPath}"`;

    exec(gsCommand, (error) => {
      if (error) {
        console.error("Ghostscript Compression Error:", error);
        return res.status(500).json({ message: "Error compressing PDF", error });
      }

      const originalSize = fs.statSync(filePath).size;
      const compressedSize = fs.statSync(finalCompressedPath).size;

      console.log(`📂 Original Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📂 Compressed Size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);

      // Replace original file with the compressed one if it's smaller
      if (compressedSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.unlinkSync(tempPdfPath);
        req.file.path = finalCompressedPath;
        req.file.filename = path.basename(finalCompressedPath);
      } else {
        fs.unlinkSync(finalCompressedPath);
        fs.unlinkSync(tempPdfPath);
      }

      next();
    });
  } catch (error) {
    console.error("PDF Compression Error:", error);
    return res.status(500).json({ message: "Error compressing PDF", error });
  }
};

// Multer storage for faculty images
const facultyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "public", "Faculty", "images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const faculty_id = req.params.faculty_id;
    if (!faculty_id) {
      return cb(new Error("Faculty ID is required"), null);
    }
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${faculty_id}_${Date.now()}${fileExtension}`;
    cb(null, uniqueFilename);
  },
});

// File filter for faculty images (JPG only)
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
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("pdf");

const uploadFacultyImage = multer({
  storage: facultyImageStorage,
  fileFilter: facultyImageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("faculty_image");

export { uploadResearchPaper, uploadFacultyImage, compressPDF };
