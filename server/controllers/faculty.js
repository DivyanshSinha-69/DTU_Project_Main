// Required Imports
import express from 'express';
import { connectDB } from "../data/database.js"; // Ensure this points to your database connection file
import pool from '../data/database.js';
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Controller for faculty_credentials table

export const getFacultyCredentials = (req, res) => {
    const sql = "SELECT * FROM faculty_credentials";
    connectDB.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing fetch query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        // Always return an array, even if it's empty
        const credentials = results || [];

        res.status(200).json({
            credentials,
            success: true,
        });
    });
};

export const addFacultyCredentials = (req, res) => {
    const { faculty_name, faculty_id, pass } = req.body;
    const sql = "INSERT INTO faculty_credentials (faculty_name, faculty_id, pass) VALUES (?, ?, ?)";
    connectDB.query(sql, [faculty_name, faculty_id, pass], (err) => {
        if (err) {
            console.error("Error executing insert query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.status(201).json({
            message: "Faculty credential added successfully",
            success: true,
        });
    });
};

export const updateFacultyCredentials = (req, res) => {
    const { faculty_id } = req.params;
    const { faculty_name, pass } = req.body;
    const sql = "UPDATE faculty_credentials SET faculty_name = ?, pass = ? WHERE faculty_id = ?";
    connectDB.query(sql, [faculty_name, pass, faculty_id], (err, results) => {
        if (err) {
            console.error("Error executing update query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: "Faculty credential not found" });
            return;
        }

        res.status(200).json({
            message: "Faculty credential updated successfully",
            success: true,
        });
    });
};

export const deleteFacultyCredentials = (req, res) => {
    const { faculty_id } = req.params;
    const sql = "DELETE FROM faculty_credentials WHERE faculty_id = ?";
    connectDB.query(sql, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error executing delete query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: "Faculty credential not found" });
            return;
        }

        res.status(200).json({
            message: "Faculty credential deleted successfully",
            success: true,
        });
    });
};


// Fetch all faculty associations
export const getFacultyAssociations = (req, res) => {
    const sql = "SELECT * FROM faculty_association";
    connectDB.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing fetch query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const associations = results || [];
        res.status(200).json({
            associations,
            success: true,
        });
    });
};

// Add a new faculty association
export const addFacultyAssociation = (req, res) => {
    const {
        faculty_id,
        designation,
        date_asg_astprof,
        date_end_astprof,
        date_asg_asoprof,
        date_end_asoprof,
        date_asg_prof,
        date_end_prof,
        specialization,
    } = req.body;

    // Check if faculty_id exists in faculty_details
    const checkSql = "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
    connectDB.query(checkSql, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error checking faculty_id:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (results[0].count === 0) {
            res.status(400).json({ error: "faculty_id does not exist in faculty_details" });
            return;
        }

        // Insert into faculty_association
        const insertSql = `
            INSERT INTO faculty_association 
            (faculty_id, designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof, specialization) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connectDB.query(insertSql, [faculty_id, designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof, specialization], (err) => {
            if (err) {
                console.error("Error executing insert query:", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            res.status(201).json({
                message: "Faculty association added successfully",
                success: true,
            });
        });
    });
};


// Update a faculty association
export const updateFacultyAssociation = (req, res) => {
    const { faculty_id } = req.params;
    const {
        designation,
        date_asg_astprof,
        date_end_astprof,
        date_asg_asoprof,
        date_end_asoprof,
        date_asg_prof,
        date_end_prof,
        specialization,
    } = req.body;

    const sql = `
        UPDATE faculty_association 
        SET designation = ?, 
            date_asg_astprof = ?, 
            date_end_astprof = ?, 
            date_asg_asoprof = ?, 
            date_end_asoprof = ?, 
            date_asg_prof = ?, 
            date_end_prof = ?, 
            specialization = ? 
        WHERE faculty_id = ?
    `;

    connectDB.query(sql, [designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof, specialization, faculty_id], (err, results) => {
        if (err) {
            console.error("Error executing update query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: "Faculty association not found" });
            return;
        }

        res.status(200).json({
            message: "Faculty association updated successfully",
            success: true,
        });
    });
};

// Delete a faculty association
export const deleteFacultyAssociation = (req, res) => {
    const { faculty_id } = req.params;

    const sql = "DELETE FROM faculty_association WHERE faculty_id = ?";
    connectDB.query(sql, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error executing delete query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: "Faculty association not found" });
            return;
        }

        res.status(200).json({
            message: "Faculty association deleted successfully",
            success: true,
        });
    });
};

// Add Research Paper


export const addResearchPaper = (req, res) => {
  const { faculty_id, paper_type, title_of_paper, domain, publication_name, published_date } = req.body;
  const filePath = req.file ? req.file.path : null;  // Assuming file is uploaded using 'pdf' field name

  // Step 1: Check if faculty_id exists in the faculty_details table
  pool.query('SELECT * FROM faculty_details WHERE faculty_id = ?', [faculty_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error checking faculty details", error });
    }

    if (results.length === 0) {
      // If no faculty found, return error and prevent file storage
      return res.status(400).json({ message: "Faculty ID does not exist in the faculty_details table" });
    }

    // Step 2: If faculty exists, proceed with adding the research paper
    const sql = 'INSERT INTO faculty_research_paper (faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, pdf_path) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(sql, [faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, filePath], (insertError, insertResult) => {
      if (insertError) {
        return res.status(500).json({ message: "Error adding research paper", error: insertError });
      }

      // Successfully inserted the research paper
      res.status(201).json({ message: 'Research paper added successfully', data: insertResult });
    });
  });
};


// Get Research Papers by Faculty ID
export const getResearchPapersByFaculty = (req, res) => {
  const faculty_id = req.params.faculty_id;

  const query = 'SELECT * FROM faculty_research_paper WHERE faculty_id = ?';

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching research papers', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No research papers found for this faculty.' });
    }
    res.status(200).json(results);
  });
};

export const updateResearchPaper = (req, res) => {
    const { faculty_id, title_of_paper } = req.params;
    const {
      paper_type,
      new_title_of_paper,
      domain,
      publication_name,
      published_date,
    } = req.body;
    const filePath = req.file ? req.file.path : null; // Handle the new file upload if provided
  
    // Step 1: Check if the research paper exists
    const checkQuery = 'SELECT * FROM faculty_research_paper WHERE faculty_id = ? AND title_of_paper = ?';
    pool.query(checkQuery, [faculty_id, title_of_paper], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking research paper', error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Research paper not found' });
      }
  
      const oldPdfPath = result[0].pdf_path;
  
      // Step 2: Prepare the update query
      const updateQuery = `
        UPDATE faculty_research_paper
        SET paper_type = ?, 
            title_of_paper = ?, 
            domain = ?, 
            publication_name = ?, 
            published_date = ?, 
            pdf_path = COALESCE(?, pdf_path)
        WHERE faculty_id = ? AND title_of_paper = ?
      `;
  
      pool.query(
        updateQuery,
        [
          paper_type,
          new_title_of_paper || title_of_paper, // Update title if a new title is provided
          domain,
          publication_name,
          published_date,
          filePath,
          faculty_id,
          title_of_paper,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({ message: 'Error updating research paper', error: updateErr });
          }
  
          // Step 3: If a new file is uploaded, delete the old file
          if (filePath && oldPdfPath) {
            const fullOldPdfPath = path.join(oldPdfPath);
            fs.unlink(fullOldPdfPath, (unlinkErr) => {
              if (unlinkErr) {
                console.warn('Failed to delete old PDF file:', unlinkErr);
              }
            });
          }
  
          res.status(200).json({
            message: 'Research paper updated successfully',
            data: updateResult,
          });
        }
      );
    });
  };
  


export const deleteResearchPaper = (req, res) => {
  const { faculty_id, title_of_paper } = req.params;

  // Query to get the PDF path from the database
  const getQuery = 'SELECT pdf_path FROM faculty_research_paper WHERE faculty_id = ? AND title_of_paper = ?';
  
  pool.query(getQuery, [faculty_id, title_of_paper], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving the research paper', error: err });
    }

    // If no record found
    if (result.length === 0) {
      return res.status(404).json({ message: 'No research paper found with the given faculty_id and title.' });
    }

    const pdfPath = result[0].pdf_path; // The PDF file path retrieved from the database

    // Query to delete the research paper from the database
    const deleteQuery = 'DELETE FROM faculty_research_paper WHERE faculty_id = ? AND title_of_paper = ?';

    pool.query(deleteQuery, [faculty_id, title_of_paper], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting research paper from database', error: err });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to delete the research paper from the database' });
      }

      // Construct the correct file path for the PDF
      // The pdf_path in the database is relative to the "public" folder.
      const fullPdfPath = path.join(pdfPath);

      console.log(`Attempting to delete PDF: ${fullPdfPath}`); // Log the path for debugging

      // Try to delete the PDF file from the filesystem
      fs.unlink(fullPdfPath, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting the PDF file', error: err });
        }

        res.status(200).json({ message: 'Research paper and PDF deleted successfully' });
      });
    });
  });
};
