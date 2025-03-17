import sharp from "sharp";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

/**
 * 📌 Get file size
 */
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2) + " KB";
  } catch (err) {
    console.error("Error getting file size:", err);
    return "Unknown";
  }
};

/**
 * 📌 Compress Image (JPEG, PNG)
 */
export const compressImage = (filePath, callback) => {
  console.log(`Original Image Size: ${getFileSize(filePath)}`);
  
  const outputFilePath = filePath.replace(/\.(jpeg|jpg|png)$/, "_compressed$&");

  sharp(filePath)
    .resize({ width: 2048, height: 2048, fit: "cover" }) // Resize to 1024px width
    .jpeg({ quality: 80 }) // Reduce quality to 80%
    .toFile(outputFilePath, (err) => {
      if (err) return callback(err);
      
      console.log(`Compressed Image Size: ${getFileSize(outputFilePath)}`);
      
      // Replace original file with compressed one
      fs.unlink(filePath, () => {
        fs.rename(outputFilePath, filePath, callback);
      });
    });
};

/**
 * 📌 Compress PDF using Ghostscript
 */
// 🔹 Change this path based on your installation
const gsCommand = os.platform() === "win32" 
  ? `"C:\\Program Files\\gs\\gs10.04.0\\bin\\gswin64c.exe"`
  : "gs"; // Linux uses "gs"


export const compressPDF = (filePath, callback) => {
  const outputFilePath = filePath.replace(".pdf", "_compressed.pdf");

  const cmd = `${gsCommand} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${filePath}"`;

  exec(cmd, (error) => {
    if (error) return callback(error);

    // 🔹 Log file sizes before and after compression
    const originalSize = fs.statSync(filePath).size;
    const compressedSize = fs.statSync(outputFilePath).size;
    console.log(`📄 PDF Compression: ${filePath}`);
    console.log(`   ➤ Original Size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   ➤ Compressed Size: ${(compressedSize / 1024).toFixed(2)} KB`);

    // Replace the original file with the compressed one
    fs.unlink(filePath, () => {
      fs.rename(outputFilePath, filePath, callback);
    });
  });
};
