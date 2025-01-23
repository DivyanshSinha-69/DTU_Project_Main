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

export const getFacultyCredentialsById = (req, res) => {
  const { faculty_id } = req.params;

  const sql = `
      SELECT * 
      FROM faculty_credentials 
      WHERE faculty_id = ?
  `;

  connectDB.query(sql, [faculty_id], (err, results) => {
      if (err) {
          console.error("Error executing fetch query:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
      }

      // Check if any record is found
      if (results.length === 0) {
          res.status(404).json({
              message: "Faculty credentials not found for the given faculty_id",
              success: false,
          });
          return;
      }

      res.status(200).json({
          credentials: results[0], // Return the single credential object
          success: true,
      });
  });
};


export const addFacultyCredentials = (req, res) => {
  const { faculty_id, faculty_name, mobile_number, pass } = req.body;

  const sql = `
      INSERT INTO faculty_credentials (faculty_id, faculty_name, mobile_number, pass) 
      VALUES (?, ?, ?, ?)
  `;

  connectDB.query(sql, [faculty_id, faculty_name, mobile_number, pass], (err) => {
      if (err) {
          console.error("Error executing insert query:", err);

          if (err.code === 'ER_NO_REFERENCED_ROW_2') {
              return res.status(400).json({
                  error: "Invalid faculty_id. Ensure it exists in faculty_details.",
              });
          }

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
  const { faculty_name, mobile_number, pass } = req.body;

  const sql = `
      UPDATE faculty_credentials 
      SET faculty_name = ?, mobile_number = ?, pass = ? 
      WHERE faculty_id = ?
  `;

  connectDB.query(sql, [faculty_name, mobile_number, pass, faculty_id], (err, results) => {
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

  const sql = `
      DELETE FROM faculty_credentials 
      WHERE faculty_id = ?
  `;

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
// 1. Get All Faculty Associations
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

// 2. Get Faculty Association By ID
export const getFacultyAssociationById = (req, res) => {
const { faculty_id } = req.params; // Get faculty_id from the request parameters
const sql = "SELECT * FROM faculty_association WHERE faculty_id = ?";

connectDB.query(sql, [faculty_id], (err, results) => {
    if (err) {
        console.error("Error executing fetch query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    if (results.length === 0) {
        res.status(404).json({ error: "Faculty Association not found" });
        return;
    }

    const association = results[0];
    res.status(200).json({
        association,
        success: true,
    });
});
};

// 3. Add a New Faculty Association
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
          (faculty_id, designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connectDB.query(insertSql, [faculty_id, designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof], (err) => {
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

// 4. Update a Faculty Association
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
  } = req.body;

  const sql = `
      UPDATE faculty_association 
      SET designation = ?, 
          date_asg_astprof = ?, 
          date_end_astprof = ?, 
          date_asg_asoprof = ?, 
          date_end_asoprof = ?, 
          date_asg_prof = ?, 
          date_end_prof = ? 
      WHERE faculty_id = ?
  `;

  connectDB.query(sql, [designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof, faculty_id], (err, results) => {
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

// 5. Delete a Faculty Association
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
  const filePath = req.file ? path.relative('public', req.file.path) : null; // Store relative path

  // Step 1: Check if faculty_id exists
  pool.query('SELECT * FROM faculty_details WHERE faculty_id = ?', [faculty_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error checking faculty details", error });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Faculty ID does not exist in the faculty_details table" });
    }

    // Step 2: Add the research paper
    const sql = 'INSERT INTO faculty_research_paper (faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, pdf_path) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(sql, [faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, filePath], (insertError, insertResult) => {
      if (insertError) {
        return res.status(500).json({ message: "Error adding research paper", error: insertError });
      }

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
  const filePath = req.file ? path.relative('public', req.file.path) : null; // Store relative path

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

    // Step 2: Update the research paper
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
        new_title_of_paper || title_of_paper,
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

        // Step 3: Delete the old file if a new file was uploaded
        if (filePath && oldPdfPath) {
          const fullOldPdfPath = path.join('public', oldPdfPath);
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


export const getFDPRecords = (req, res) => {
  const { faculty_id } = req.params;  // Get faculty_id from route parameters (if provided)

  let query = 'SELECT * FROM faculty_FDP';
  let params = [];

  if (faculty_id) {
    query += ' WHERE faculty_id = ?';
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching FDP records:', err);
      return res.status(500).json({ message: 'Error fetching FDP records', error: err });
    }
    res.status(200).json({ message: 'FDP records fetched successfully', data: results });
    console.log("fdb backend",data);
  });
};


// 2. Add a new FDP record
export const addFDPRecord = (req, res) => {
  const { faculty_id, FDP_name, year_conducted, month_conducted, days_contributed } = req.body;

  const query = `
    INSERT INTO faculty_FDP (faculty_id, FDP_name, year_conducted, month_conducted, days_contributed)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [faculty_id, FDP_name, year_conducted, month_conducted, days_contributed];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Error adding FDP record:', err);
      return res.status(500).json({ message: 'Error adding FDP record', error: err });
    }
    res.status(201).json({ message: 'FDP record added successfully', data: { id: result.insertId } });
  });
};

// 3. Update an existing FDP record using FDP_id
export const updateFDPRecord = (req, res) => {
  const { FDP_id } = req.params;
  const { faculty_id, FDP_name, year_conducted, month_conducted, days_contributed } = req.body;

  const query = `
    UPDATE faculty_FDP 
    SET faculty_id = ?, FDP_name = ?, year_conducted = ?, month_conducted = ?, days_contributed = ?
    WHERE FDP_id = ?
  `;
  const params = [faculty_id, FDP_name, year_conducted, month_conducted, days_contributed, FDP_id];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating FDP record:', err);
      return res.status(500).json({ message: 'Error updating FDP record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No FDP record found with the given FDP_id' });
    }
    res.status(200).json({ message: 'FDP record updated successfully' });
  });
};

// 4. Delete an FDP record using FDP_id
export const deleteFDPRecord = (req, res) => {
  const { FDP_id } = req.params;

  const query = 'DELETE FROM faculty_FDP WHERE FDP_id = ?';
  const params = [FDP_id];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Error deleting FDP record:', err);
      return res.status(500).json({ message: 'Error deleting FDP record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No FDP record found with the given FDP_id' });
    }
    res.status(200).json({ message: 'FDP record deleted successfully' });
  });
};



export const getVAERecords = (req, res) => {
  const { faculty_id } = req.query;

  let query = 'SELECT * FROM faculty_VAErecords';
  const params = [];

  if (faculty_id) {
    query += ' WHERE faculty_id = ?';
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching VAE records:', err);
      return res.status(500).json({ message: 'Error fetching VAE records', error: err });
    }
    res.status(200).json({ message: 'VAE records retrieved successfully', data: results });
  });
};

export const addVAERecord = (req, res) => {
  const { faculty_id, visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught } = req.body;

  // Validate input
  if (!faculty_id || !visit_type || !institution || !course_taught || !year_of_visit || !month_of_visit || !hours_taught) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO faculty_VAErecords (faculty_id, visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [faculty_id, visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Error adding VAE record:', err);
      return res.status(500).json({ message: 'Error adding VAE record', error: err });
    }
    res.status(201).json({ message: 'VAE record added successfully', data: { id: result.insertId } });
  });
};

export const updateVAERecord = (req, res) => {
  const { visit_id } = req.params;
  const { visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught } = req.body;

  // Validate input
  if (!visit_id || !visit_type || !institution || !course_taught || !year_of_visit || !month_of_visit || !hours_taught) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    UPDATE faculty_VAErecords
    SET visit_type = ?, institution = ?, course_taught = ?, year_of_visit = ?, month_of_visit = ?, hours_taught = ?
    WHERE visit_id = ?
  `;
  const params = [visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught, visit_id];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating VAE record:', err);
      return res.status(500).json({ message: 'Error updating VAE record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No VAE record found with the given visit_id' });
    }
    res.status(200).json({ message: 'VAE record updated successfully' });
  });
};

export const deleteVAERecord = (req, res) => {
  const { visit_id } = req.params;

  if (!visit_id) {
    return res.status(400).json({ message: 'visit_id is required' });
  }

  const query = 'DELETE FROM faculty_VAErecords WHERE visit_id = ?';

  pool.query(query, [visit_id], (err, result) => {
    if (err) {
      console.error('Error deleting VAE record:', err);
      return res.status(500).json({ message: 'Error deleting VAE record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No VAE record found with the given visit_id' });
    }
    res.status(200).json({ message: 'VAE record deleted successfully' });
  });
};


// Get all Book records or filter by faculty_id
export const getBookRecords = (req, res) => {
  const { faculty_id } = req.params;

  const query = faculty_id
    ? "SELECT * FROM faculty_Book_records WHERE faculty_id = ?"
    : "SELECT * FROM faculty_Book_records";

  pool.query(query, faculty_id ? [faculty_id] : [], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching book records", error: err });
    }
    res.status(200).json(results);
  });
};

// Add a new Book record
export const addBookRecord = (req, res) => {
  const { ISBN, faculty_id, book_title, publication_name, published_date } = req.body;

  const query = `
    INSERT INTO faculty_Book_records (ISBN, faculty_id, book_title, publication_name, published_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  const queryParams = [ISBN, faculty_id, book_title, publication_name, published_date];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding book record", error: err });
    }
    res.status(201).json({ message: "Book record added successfully", insertId: result.insertId });
  });
};

// Update an existing Book record using Book_id
export const updateBookRecord = (req, res) => {
  const { Book_id } = req.params;
  const { ISBN, faculty_id, book_title, publication_name, published_date } = req.body;

  const query = `
    UPDATE faculty_Book_records
    SET ISBN = ?, faculty_id = ?, book_title = ?, publication_name = ?, published_date = ?
    WHERE Book_id = ?
  `;

  const queryParams = [ISBN, faculty_id, book_title, publication_name, published_date, Book_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating book record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No book record found with the given Book_id" });
    }
    res.status(200).json({ message: "Book record updated successfully" });
  });
};

// Delete a Book record using Book_id
export const deleteBookRecord = (req, res) => {
  const { Book_id } = req.params;

  const query = "DELETE FROM faculty_Book_records WHERE Book_id = ?";

  pool.query(query, [Book_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting book record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No book record found with the given Book_id" });
    }
    res.status(200).json({ message: "Book record deleted successfully" });
  });
};



/**
 * Get all PhD awarded records
 */
export const getPhDAwardedRecords = (req, res) => {
  const query = 'SELECT * FROM faculty_PhD_awarded';
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching PhD awarded records', error: err });
    }
    res.status(200).json(results);
  });
};

/**
 * Get all PhD mentee names for a specific faculty_id
 */
export const getPhDAwardedRecordsByFacultyId = (req, res) => {
  const { faculty_id } = req.params;

  const query = `
    SELECT PHD_id, mentee_name, mentee_rn, passing_year 
    FROM faculty_PhD_awarded 
    WHERE faculty_id = ?
  `;

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching PhD awarded records', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No PhD awarded records found for the given faculty_id' });
    }
    res.status(200).json(results);
  });
};

/**
 * Add a new PhD awarded record
 */
export const addPhDAwardedRecord = (req, res) => {
  const { faculty_id, mentee_name, mentee_rn, passing_year } = req.body;

  const query = `
    INSERT INTO faculty_PhD_awarded (faculty_id, mentee_name, mentee_rn, passing_year)
    VALUES (?, ?, ?, ?)
  `;

  const queryParams = [faculty_id, mentee_name, mentee_rn, passing_year];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding PhD awarded record', error: err });
    }
    res.status(201).json({ message: 'PhD awarded record added successfully', recordId: result.insertId });
  });
};

/**
 * Update an existing PhD record using PHD_id
 */
/**
 * Update an existing PhD record using PHD_id
 */
export const updatePhDAwardedRecord = (req, res) => {
  const { mentee_name, passing_year, mentee_rn } = req.body; // Include mentee_rn in the request body
  const { PHD_id } = req.params;

  if (!PHD_id) {
    return res.status(400).json({ message: "PHD_id is required" });
  }

  const query = `
    UPDATE faculty_PhD_awarded
    SET mentee_name = ?, passing_year = ?, mentee_rn = ?
    WHERE PHD_id = ?
  `;

  const queryParams = [mentee_name, passing_year, mentee_rn, PHD_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating PhD awarded record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "PhD awarded record not found" });
    }
    res.status(200).json({ message: "PhD awarded record updated successfully" });
  });
};


/**
 * Delete a PhD record using PHD_id
 */
export const deletePhDAwardedRecord = (req, res) => {
  const { PHD_id } = req.params;

  const query = 'DELETE FROM faculty_PhD_awarded WHERE PHD_id = ?';

  pool.query(query, [PHD_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting PhD awarded record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No PhD awarded record found with the given PHD_id' });
    }
    res.status(200).json({ message: 'PhD awarded record deleted successfully' });
  });
};


export const getSponsoredResearchByFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const query = `SELECT * FROM faculty_sponsored_research WHERE faculty_id = ?`;
  const queryParams = [faculty_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching sponsored research", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "No sponsored research found for this faculty" });
    }
    res.status(200).json(result);
  });
};

export const addSponsoredResearch = (req, res) => {
  const { faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date } = req.body;

  if (!faculty_id || !project_title || !start_date) {
    return res.status(400).json({ message: "Faculty ID, Project Title, and Start Date are required" });
  }

  const query = `
    INSERT INTO faculty_sponsored_research (faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding sponsored research", error: err });
    }
    res.status(201).json({ message: "Sponsored research added successfully", sponsorship_id: result.insertId });
  });
};

export const updateSponsoredResearch = (req, res) => {
  const { sponsorship_id } = req.params;
  const { faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date } = req.body;

  const query = `
    UPDATE faculty_sponsored_research
    SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, research_duration = ?, start_date = ?
    WHERE sponsorship_id = ?
  `;
  const queryParams = [faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, sponsorship_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating sponsored research", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }
    res.status(200).json({ message: "Sponsored research updated successfully" });
  });
};

export const deleteSponsoredResearch = (req, res) => {
  const { sponsorship_id } = req.params;

  const query = `DELETE FROM faculty_sponsored_research WHERE sponsorship_id = ?`;
  const queryParams = [sponsorship_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting sponsored research", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }
    res.status(200).json({ message: "Sponsored research deleted successfully" });
  });
};

// Get consultancy records by faculty_id
export const getConsultancyByFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const query = `SELECT * FROM faculty_consultancy WHERE faculty_id = ?`;
  const queryParams = [faculty_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching consultancy records", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "No consultancy records found for this faculty" });
    }
    res.status(200).json(result);
  });
};

// Add a new consultancy record
export const addConsultancy = (req, res) => {
  const { faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date } = req.body;

  if (!faculty_id || !project_title || !start_date) {
    return res.status(400).json({ message: "Faculty ID, Project Title, and Start Date are required" });
  }

  const query = `
    INSERT INTO faculty_consultancy (faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding consultancy record", error: err });
    }
    res.status(201).json({ message: "Consultancy record added successfully", consultancy_id: result.insertId });
  });
};

// Update an existing consultancy record
export const updateConsultancy = (req, res) => {
  const { consultancy_id } = req.params;
  const { faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date } = req.body;

  const query = `
    UPDATE faculty_consultancy
    SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, research_duration = ?, start_date = ?, end_date = ?
    WHERE consultancy_id = ?
  `;
  const queryParams = [faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date, consultancy_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating consultancy record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }
    res.status(200).json({ message: "Consultancy record updated successfully" });
  });
};

// Delete a consultancy record
export const deleteConsultancy = (req, res) => {
  const { consultancy_id } = req.params;

  const query = `DELETE FROM faculty_consultancy WHERE consultancy_id = ?`;
  const queryParams = [consultancy_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting consultancy record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }
    res.status(200).json({ message: "Consultancy record deleted successfully" });
  });
};


export const getFacultyDetails = (req, res) => {
  const { faculty_id } = req.params;

  const query = 'SELECT * FROM faculty_details WHERE faculty_id = ?';
  
  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching faculty details', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json(results[0]);
  });
};

export const addFaculty = (req, res) => {
  const { faculty_id, faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number } = req.body;

  if (!faculty_id) {
    return res.status(400).json({ message: 'Faculty ID is required' });
  }

  const facultyImage = req.file ? `public/Faculty/images/${faculty_id}.${req.file.originalname.split('.').pop()}` : null;

  const sql = `
    INSERT INTO faculty_details (faculty_id, faculty_name, faculty_image, degree, university, year_of_attaining_highest_degree, email_id, mobile_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [faculty_id, faculty_name, facultyImage, degree, university, year_of_attaining_highest_degree, email_id, mobile_number],
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error adding faculty details', error });
      }

      res.status(201).json({ message: 'Faculty details added successfully', data: result });
    }
  );
};

export const updateFacultyDetails = (req, res) => {
  const { faculty_id } = req.params;
  const { faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number } = req.body;
  
  // Check if a new image is uploaded
  const newImage = req.file;

  // Get the old image path from the database
  const getQuery = 'SELECT faculty_image FROM faculty_details WHERE faculty_id = ?';
  
  pool.query(getQuery, [faculty_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving faculty data', error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const oldImagePath = result[0].faculty_image; // Get the old image path

    // If a new image is uploaded, delete the old image
    let newImagePath = null;  // Default value for new image path

    if (newImage) {
      // Deleting the old image from the folder (if it exists)
      if (oldImagePath) {
        const oldImageFullPath = path.join(__dirname, '..', 'public', 'Faculty', 'images', oldImagePath);
        fs.unlink(oldImageFullPath, (err) => {
          if (err) {
            console.log('Error deleting old image:', err);
          }
        });
      }

      // New image path
      newImagePath = `Faculty/images/${newImage.filename}`;
    } else {
      // If no new image is uploaded, keep the old image path
      newImagePath = oldImagePath;
    }

    // Update query to include faculty details
    const updateQuery = `
      UPDATE faculty_details
      SET faculty_name = ?, degree = ?, university = ?, year_of_attaining_highest_degree = ?, email_id = ?, mobile_number = ?, faculty_image = ?
      WHERE faculty_id = ?
    `;

    pool.query(updateQuery, [faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number, newImagePath, faculty_id], (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating faculty details', error: err });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update faculty details' });
      }

      res.status(200).json({ message: 'Faculty details and image updated successfully' });
    });
  });
};

export const deleteFaculty = (req, res) => {
  const { faculty_id } = req.params;

  // Query to get the image path from the database
  const getQuery = 'SELECT faculty_image FROM faculty_details WHERE faculty_id = ?';

  pool.query(getQuery, [faculty_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving faculty details', error: err });
    }

    // If no record found
    if (result.length === 0) {
      return res.status(404).json({ message: 'No faculty found with the given ID.' });
    }

    const imagePath = result[0].faculty_image; // The image file path retrieved from the database

    // If no image path exists in the database, skip the deletion
    if (!imagePath) {
      return res.status(200).json({ message: 'Faculty details deleted, but no image to delete.' });
    }

    // Query to delete the faculty record from the database
    const deleteQuery = 'DELETE FROM faculty_details WHERE faculty_id = ?';

    pool.query(deleteQuery, [faculty_id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting faculty details from database', error: err });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to delete faculty details from the database' });
      }

      // Remove any relative paths from the imagePath if it contains 'public' or unnecessary folder prefixes
      const imagePathWithoutPublic = imagePath.replace(/^public\//, ''); // This will remove the 'public/' part if it's present

      // Construct the correct full file path for the image
      const fullImagePath = path.join(__dirname, '..', 'public', imagePathWithoutPublic);

      console.log(`Attempting to delete image: ${fullImagePath}`); // Log the path for debugging

      // Try to delete the image file from the filesystem
      fs.unlink(fullImagePath, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting the image file', error: err });
        }

        res.status(200).json({ message: 'Faculty details and image deleted successfully' });
      });
    });
  });
};

export const getSpecializations = (req, res) => {
  const { faculty_id } = req.params; // Get faculty_id from route parameters (if provided)

  let query = "SELECT * FROM faculty_specialization";
  let params = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    params.push(faculty_id);
  }

  connectDB.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching specializations:", err);
      return res.status(500).json({ message: "Error fetching specializations", error: err });
    }
    res.status(200).json({ message: "Specializations fetched successfully", data: results });
  });
};


export const addSpecialization = (req, res) => {
  const { faculty_id, specialization } = req.body;

  // Check if the faculty_id exists in faculty_details
  const checkQuery = "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
  connectDB.query(checkQuery, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error checking faculty_id:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results[0].count === 0) {
      return res.status(400).json({ message: "faculty_id does not exist in faculty_details" });
    }

    // Insert the specialization
    const insertQuery = `
      INSERT INTO faculty_specialization (faculty_id, specialization)
      VALUES (?, ?)
    `;
    connectDB.query(insertQuery, [faculty_id, specialization], (err, result) => {
      if (err) {
        console.error("Error adding specialization:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(201).json({ message: "Specialization added successfully", success: true, id: result.insertId });
    });
  });
};

export const updateSpecialization = (req, res) => {
  const { specialization_id } = req.params; // Specialization ID
  const { specialization } = req.body;

  const query = `
    UPDATE faculty_specialization
    SET specialization = ?
    WHERE specialization_id = ?
  `;
  connectDB.query(query, [specialization, specialization_id], (err, result) => {
    if (err) {
      console.error("Error updating specialization:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res.status(200).json({ message: "Specialization updated successfully", success: true });
  });
};

export const deleteSpecialization = (req, res) => {
  const { specialization_id } = req.params; // Specialization ID

  const query = "DELETE FROM faculty_specialization WHERE specialization_id = ?";
  connectDB.query(query, [specialization_id], (err, result) => {
    if (err) {
      console.error("Error deleting specialization:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res.status(200).json({ message: "Specialization deleted successfully", success: true });
  });
};
