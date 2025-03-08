// Required Imports
import express from "express";
import { pool } from "../data/database.js"; // Ensure this points to your database connection file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { compressImage } from "../utils/fileCompressor.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Controller for faculty_credentials table

dotenv.config();

function getMonthName(monthNumber) {
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1] || "Invalid month";
}

function getMonthNumber(monthName) {
  const months = {
      "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
      "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
  };
  return months[monthName] || "Invalid month";
}

export const getFacultyCredentials = async (req, res) => {
  try {
    const sql = "SELECT * FROM faculty_credentials";

    // Using `await` to fetch data
    const [results] = await pool.query(sql);

    res.status(200).json({
      credentials: results || [], // Ensures it's always an array
      success: true,
    });
  } catch (err) {
    console.error("Error executing fetch query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFacultyCredentialsById = (req, res) => {
  const { faculty_id } = req.params;

  const sql = `
      SELECT * 
      FROM faculty_credentials 
      WHERE faculty_id = ?
  `;

  pool.query(sql, [faculty_id], (err, results) => {
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

export const addFacultyCredentials = async (req, res) => {
  const { faculty_id, faculty_name, mobile_number, pass } = req.body;
  const sql = `
      INSERT INTO faculty_credentials (faculty_id, faculty_name, mobile_number, pass) 
      VALUES (?, ?, ?, ?)
  `;

  try {
    await pool.query(sql, [faculty_id, faculty_name, mobile_number, pass]);
    res.status(201).json({
      message: "Faculty credential added successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error executing insert query:", err);

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "Invalid faculty_id. Ensure it exists in faculty_details.",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateFacultyCredentials = async (req, res) => {
  const { faculty_id } = req.params;
  const { faculty_name, mobile_number, pass } = req.body;

  const sql = `
      UPDATE faculty_credentials 
      SET faculty_name = ?, mobile_number = ?, pass = ? 
      WHERE faculty_id = ?
  `;

  try {
    const [results] = await pool.query(sql, [
      faculty_name,
      mobile_number,
      pass,
      faculty_id,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Faculty credential not found" });
    }

    res.status(200).json({
      message: "Faculty credential updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error executing update query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteFacultyCredentials = async (req, res) => {
  const { faculty_id } = req.params;

  const sql = `
      DELETE FROM faculty_credentials 
      WHERE faculty_id = ?
  `;

  try {
    const [results] = await pool.query(sql, [faculty_id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Faculty credential not found" });
    }

    res.status(200).json({
      message: "Faculty credential deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error executing delete query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all faculty associations
// 1. Get All Faculty Associations
export const getFacultyAssociations = (req, res) => {
  const sql = "SELECT * FROM faculty_association";
  pool.query(sql, (err, results) => {
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

  pool.query(sql, [faculty_id], (err, results) => {
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
  const checkSql =
    "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
  pool.query(checkSql, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error checking faculty_id:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results[0].count === 0) {
      res
        .status(400)
        .json({ error: "faculty_id does not exist in faculty_details" });
      return;
    }

    // Insert into faculty_association
    const insertSql = `
          INSERT INTO faculty_association 
          (faculty_id, designation, date_asg_astprof, date_end_astprof, date_asg_asoprof, date_end_asoprof, date_asg_prof, date_end_prof) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

    pool.query(
      insertSql,
      [
        faculty_id,
        designation,
        date_asg_astprof,
        date_end_astprof,
        date_asg_asoprof,
        date_end_asoprof,
        date_asg_prof,
        date_end_prof,
      ],
      (err) => {
        if (err) {
          console.error("Error executing insert query:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        res.status(201).json({
          message: "Faculty association added successfully",
          success: true,
        });
      },
    );
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

  pool.query(
    sql,
    [
      designation,
      date_asg_astprof,
      date_end_astprof,
      date_asg_asoprof,
      date_end_asoprof,
      date_asg_prof,
      date_end_prof,
      faculty_id,
    ],
    (err, results) => {
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
    },
  );
};

// 5. Delete a Faculty Association
export const deleteFacultyAssociation = (req, res) => {
  const { faculty_id } = req.params;

  const sql = "DELETE FROM faculty_association WHERE faculty_id = ?";
  pool.query(sql, [faculty_id], (err, results) => {
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
  const { faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, citation } = req.body;

  // Get the compressed file path
  const filePath = req.file ? path.relative("public", req.file.path) : null;

  // Check if faculty_id exists
  pool.query("SELECT * FROM faculty_details WHERE faculty_id = ?", [faculty_id], (error, results) => {
    if (error) return res.status(500).json({ message: "Error checking faculty details", error });

    if (results.length === 0) {
      return res.status(400).json({ message: "Faculty ID does not exist in faculty_details table" });
    }

    // Insert into faculty_research_paper table
    const sql = `
      INSERT INTO faculty_research_paper 
      (faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, pdf_path, citation) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(sql, [faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, filePath, citation],
      (insertError, insertResult) => {
        if (insertError) return res.status(500).json({ message: "Error adding research paper", error: insertError });

        res.status(201).json({ message: "Research paper added successfully", data: insertResult });
      }
    );
  });
};


// Get Research Papers by Faculty ID
export const getResearchPapersByFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const query = "SELECT * FROM faculty_research_paper WHERE faculty_id = ?";

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching research papers", error: err });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No research papers found for this faculty." });
    }
    res.status(200).json(results);
  });
};

export const updateResearchPaper = (req, res) => {
  const { research_id } = req.params;
  const { paper_type, title_of_paper, domain, publication_name, published_date, citation } = req.body;

  // Get the new compressed file path
  const filePath = req.file ? path.relative("public", req.file.path) : null;

  // Check if research paper exists
  pool.query("SELECT * FROM faculty_research_paper WHERE research_id = ?", [research_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error checking research paper", error: err });

    if (result.length === 0) return res.status(404).json({ message: "Research paper not found" });

    const oldPdfPath = result[0].pdf_path;
    const absoluteOldFilePath = oldPdfPath ? path.join("public", oldPdfPath) : null;

    // If a new file is uploaded, delete the old one
    if (filePath && filePath !== oldPdfPath && absoluteOldFilePath && fs.existsSync(absoluteOldFilePath)) {
      fs.unlinkSync(absoluteOldFilePath);
    }

    // Update research paper details
    const updateQuery = `
      UPDATE faculty_research_paper
      SET 
        paper_type = ?, 
        title_of_paper = ?, 
        domain = ?, 
        publication_name = ?, 
        published_date = ?, 
        citation = ?, 
        pdf_path = COALESCE(?, pdf_path)
      WHERE research_id = ?
    `;

    pool.query(updateQuery, [paper_type, title_of_paper, domain, publication_name, published_date, citation, filePath, research_id],
      (updateErr, updateResult) => {
        if (updateErr) return res.status(500).json({ message: "Error updating research paper", error: updateErr });

        res.status(200).json({ message: "Research paper updated successfully", data: updateResult });
      }
    );
  });
};

export const deleteResearchPaper = (req, res) => {
  const { research_id } = req.params; // Using research_id instead of faculty_id and title_of_paper

  // Query to get the PDF path from the database using research_id
  const getQuery =
    "SELECT pdf_path FROM faculty_research_paper WHERE research_id = ?";

  pool.query(getQuery, [research_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving the research paper", error: err });
    }

    // If no record found
    if (result.length === 0) {
      return res.status(404).json({
        message: "No research paper found with the given research_id",
      });
    }

    const pdfPath = result[0].pdf_path; // The PDF file path retrieved from the database

    // Query to delete the research paper from the database
    const deleteQuery =
      "DELETE FROM faculty_research_paper WHERE research_id = ?";

    pool.query(deleteQuery, [research_id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error deleting research paper from database",
          error: err,
        });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({
          message: "Failed to delete the research paper from the database",
        });
      }

      // Only attempt to delete the PDF file if pdf_path exists
      if (pdfPath) {
        const fullPdfPath = path.join("public", pdfPath);

        fs.unlink(fullPdfPath, (unlinkErr) => {
          if (unlinkErr) {
            return res.status(500).json({
              message: "Error deleting the PDF file",
              error: unlinkErr,
            });
          }

          res
            .status(200)
            .json({ message: "Research paper and PDF deleted successfully" });
        });
      } else {
        // If pdf_path is null, just send success response for record deletion
        res.status(200).json({
          message: "Research paper deleted successfully, no PDF file to remove",
        });
      }
    });
  });
};

// 1. Get FDP records
export const getFDPRecords = (req, res) => {
  const { faculty_id } = req.params;

  let query = "SELECT * FROM faculty_FDP";
  let params = [];

  if (faculty_id) {
      query += " WHERE faculty_id = ?";
      params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
      if (err) {
          console.error("Error fetching FDP details:", err);
          return res.status(500).json({ message: "Error fetching FDP details", error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: "No FDP details found" });
      }

      // Convert month number to month name
      const modifiedResults = results.map(record => ({
          ...record,
          month_conducted: getMonthName(record.month_conducted)
      }));

      res.status(200).json({ message: "FDP details fetched successfully", data: modifiedResults });
  });
};

// 2. Add a new FDP record
export const addFDPRecord = (req, res) => {
  const {
      faculty_id,
      FDP_name,
      year_conducted,
      month_conducted, // This will be received as a name
      days_contributed
  } = req.body;

  // Convert month name to number
  const monthNumber = getMonthNumber(month_conducted);
  if (monthNumber === "Invalid month") {
      return res.status(400).json({ message: "Invalid month name provided" });
  }

  const query = `
      INSERT INTO faculty_FDP (faculty_id, FDP_name, year_conducted, month_conducted, days_contributed)
      VALUES (?, ?, ?, ?, ?)
  `;
  const params = [faculty_id, FDP_name, year_conducted, monthNumber, days_contributed];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error adding FDP record:", err);
          return res.status(500).json({ message: "Error adding FDP record", error: err });
      }
      res.status(201).json({
          message: "FDP record added successfully",
          data: { id: result.insertId }
      });
  });
};

// 3. Update an existing FDP record using FDP_id
export const updateFDPRecord = (req, res) => {
  const { FDP_id } = req.params;
  const {
      faculty_id,
      FDP_name,
      year_conducted,
      month_conducted, // Received as a name
      days_contributed
  } = req.body;

  // Convert month name to number
  const monthNumber = getMonthNumber(month_conducted);
  if (monthNumber === "Invalid month") {
      return res.status(400).json({ message: "Invalid month name provided" });
  }

  const query = `
      UPDATE faculty_FDP 
      SET faculty_id = ?, FDP_name = ?, year_conducted = ?, month_conducted = ?, days_contributed = ?
      WHERE FDP_id = ?
  `;
  const params = [faculty_id, FDP_name, year_conducted, monthNumber, days_contributed, FDP_id];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error updating FDP record:", err);
          return res.status(500).json({ message: "Error updating FDP record", error: err });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No FDP record found with the given FDP_id" });
      }
      res.status(200).json({ message: "FDP record updated successfully" });
  });
};
// 4. Delete an FDP record using FDP_id
export const deleteFDPRecord = (req, res) => {
  const { FDP_id } = req.params;

  const query = "DELETE FROM faculty_FDP WHERE FDP_id = ?";
  const params = [FDP_id];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error deleting FDP record:", err);
      return res
        .status(500)
        .json({ message: "Error deleting FDP record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No FDP record found with the given FDP_id" });
    }
    res.status(200).json({ message: "FDP record deleted successfully" });
  });
};

function getVAETypeName(typeNumber) {
  const types = {
      1: "Visiting",
      2: "Adjunct",
      3: "Emeritus"
  };
  return types[typeNumber] || "Invalid faculty type";
}

function getVAETypeNumber(typeName) {
  const types = {
      "Visiting": 1,
      "Adjunct": 2,
      "Emeritus": 3
  };
  return types[typeName] || "Invalid faculty type";
}

export const getVAERecords = (req, res) => {
    const { faculty_id } = req.query;

    let query = "SELECT * FROM faculty_VAErecords";
    const params = [];

    if (faculty_id) {
        query += " WHERE faculty_id = ?";
        params.push(faculty_id);
    }

    pool.query(query, params, (err, results) => {
        if (err) {
            console.error("Error fetching VAE records:", err);
            return res.status(500).json({ message: "Error fetching VAE records", error: err });
        }

        // Convert numeric month and visit_type to string before sending response
        const formattedResults = results.map(record => ({
            ...record,
            month_of_visit: getMonthName(record.month_of_visit),
            visit_type: getVAETypeName(record.visit_type)
        }));

        res.status(200).json({ message: "VAE records retrieved successfully", data: formattedResults });
    });
};

// 🟢 ADD VAE RECORD
export const addVAERecord = (req, res) => {
    const { faculty_id, visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught } = req.body;

    // Validate input
    if (!faculty_id || !visit_type || !institution || !course_taught || !year_of_visit || !month_of_visit || !hours_taught) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const monthNumber = getMonthNumber(month_of_visit);
    if (monthNumber === "Invalid month") {
        return res.status(400).json({ message: "Invalid month name provided" });
    }

    const visitTypeNumber = getVAETypeNumber(visit_type);
    if (visitTypeNumber === "Invalid faculty type") {
        return res.status(400).json({ message: "Invalid visit type provided" });
    }

    const query = `
        INSERT INTO faculty_VAErecords (faculty_id, visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [faculty_id, visitTypeNumber, institution, course_taught, year_of_visit, monthNumber, hours_taught];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error("Error adding VAE record:", err);
            return res.status(500).json({ message: "Error adding VAE record", error: err });
        }
        res.status(201).json({
            message: "VAE record added successfully",
            data: { id: result.insertId },
        });
    });
};

// 🟢 UPDATE VAE RECORD
export const updateVAERecord = (req, res) => {
    const { visit_id } = req.params;
    const { visit_type, institution, course_taught, year_of_visit, month_of_visit, hours_taught } = req.body;

    // Validate input
    if (!visit_id || !visit_type || !institution || !course_taught || !year_of_visit || !month_of_visit || !hours_taught) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const monthNumber = getMonthNumber(month_of_visit);
    if (monthNumber === "Invalid month") {
        return res.status(400).json({ message: "Invalid month name provided" });
    }

    const visitTypeNumber = getVAETypeNumber(visit_type);
    if (visitTypeNumber === "Invalid faculty type") {
        return res.status(400).json({ message: "Invalid visit type provided" });
    }

    const query = `
        UPDATE faculty_VAErecords
        SET visit_type = ?, institution = ?, course_taught = ?, year_of_visit = ?, month_of_visit = ?, hours_taught = ?
        WHERE visit_id = ?
    `;
    const params = [visitTypeNumber, institution, course_taught, year_of_visit, monthNumber, hours_taught, visit_id];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error("Error updating VAE record:", err);
            return res.status(500).json({ message: "Error updating VAE record", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No VAE record found with the given visit_id" });
        }
        res.status(200).json({ message: "VAE record updated successfully" });
    });
};

export const deleteVAERecord = (req, res) => {
  const { visit_id } = req.params;

  if (!visit_id) {
    return res.status(400).json({ message: "visit_id is required" });
  }

  const query = "DELETE FROM faculty_VAErecords WHERE visit_id = ?";

  pool.query(query, [visit_id], (err, result) => {
    if (err) {
      console.error("Error deleting VAE record:", err);
      return res
        .status(500)
        .json({ message: "Error deleting VAE record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No VAE record found with the given visit_id" });
    }
    res.status(200).json({ message: "VAE record deleted successfully" });
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
      return res
        .status(500)
        .json({ message: "Error fetching book records", error: err });
    }
    res.status(200).json(results);
  });
};

// Add a new Book record
export const addBookRecord = (req, res) => {
  const { ISBN, faculty_id, book_title, publication_name, published_date } =
    req.body;

  const query = `
    INSERT INTO faculty_Book_records (ISBN, faculty_id, book_title, publication_name, published_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  const queryParams = [
    ISBN,
    faculty_id,
    book_title,
    publication_name,
    published_date,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding book record", error: err });
    }
    res.status(201).json({
      message: "Book record added successfully",
      insertId: result.insertId,
    });
  });
};

// Update an existing Book record using Book_id
export const updateBookRecord = (req, res) => {
  const { Book_id } = req.params;
  const { ISBN, faculty_id, book_title, publication_name, published_date } =
    req.body;

  const query = `
    UPDATE faculty_Book_records
    SET ISBN = ?, faculty_id = ?, book_title = ?, publication_name = ?, published_date = ?
    WHERE Book_id = ?
  `;

  const queryParams = [
    ISBN,
    faculty_id,
    book_title,
    publication_name,
    published_date,
    Book_id,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating book record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No book record found with the given Book_id" });
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
      return res
        .status(500)
        .json({ message: "Error deleting book record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No book record found with the given Book_id" });
    }
    res.status(200).json({ message: "Book record deleted successfully" });
  });
};

/**
 * Get all PhD awarded records
 */
export const getPhDAwardedRecords = (req, res) => {
  const query = "SELECT * FROM faculty_PhD_awarded";

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching PhD awarded records",
        error: err
      });
    }

    // Convert numeric month to string month
    const updatedResults = results.map(record => ({
      ...record,
      passing_month: getMonthName(record.passing_month)
    }));

    res.status(200).json(updatedResults);
  });
};

export const getPhDAwardedRecordsByFacultyId = (req, res) => {
  const { faculty_id } = req.params;

  const query = `
    SELECT PHD_id, mentee_name, mentee_rn, passing_year, passing_month 
    FROM faculty_PhD_awarded 
    WHERE faculty_id = ?
  `;

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching PhD awarded records",
        error: err
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        message: "No PhD awarded records found for the given faculty_id"
      });
    }

    // Convert numeric month to string month
    const updatedResults = results.map(record => ({
      ...record,
      passing_month: getMonthName(record.passing_month)
    }));

    res.status(200).json(updatedResults);
  });
};

export const addPhDAwardedRecord = (req, res) => {
  let { faculty_id, mentee_name, mentee_rn, passing_year, passing_month } = req.body;

  // Convert string month to numeric month if it's a valid month name
  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  const query = `
    INSERT INTO faculty_PhD_awarded (faculty_id, mentee_name, mentee_rn, passing_year, passing_month)
    VALUES (?, ?, ?, ?, ?)
  `;

  const queryParams = [
    faculty_id,
    mentee_name,
    mentee_rn,
    passing_year,
    passing_month,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error adding PhD awarded record",
        error: err
      });
    }
    res.status(201).json({
      message: "PhD awarded record added successfully",
      recordId: result.insertId,
    });
  });
};

export const updatePhDAwardedRecord = (req, res) => {
  let { mentee_name, passing_year, passing_month, mentee_rn } = req.body;
  const { PHD_id } = req.params;

  if (!PHD_id) {
    return res.status(400).json({ message: "PHD_id is required" });
  }

  // Convert string month to numeric month if it's a valid month name
  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  const query = `
    UPDATE faculty_PhD_awarded
    SET mentee_name = ?, passing_year = ?, passing_month = ?, mentee_rn = ?
    WHERE PHD_id = ?
  `;

  const queryParams = [
    mentee_name,
    passing_year,
    passing_month,
    mentee_rn,
    PHD_id,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error updating PhD awarded record",
        error: err
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "PhD awarded record not found" });
    }
    res.status(200).json({
      message: "PhD awarded record updated successfully"
    });
  });
};

/**
 * Delete a PhD record using PHD_id
 */
export const deletePhDAwardedRecord = (req, res) => {
  const { PHD_id } = req.params;

  const query = "DELETE FROM faculty_PhD_awarded WHERE PHD_id = ?";

  pool.query(query, [PHD_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting PhD awarded record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No PhD awarded record found with the given PHD_id" });
    }
    res
      .status(200)
      .json({ message: "PhD awarded record deleted successfully" });
  });
};

export const getSponsoredResearchByFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const query = `SELECT * FROM faculty_sponsored_research WHERE faculty_id = ?`;
  const queryParams = [faculty_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching sponsored research", error: err });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No sponsored research found for this faculty" });
    }
    res.status(200).json(result);
  });
};

export const addSponsoredResearch = (req, res) => {
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  } = req.body;

  if (!faculty_id || !project_title || !start_date) {
    return res.status(400).json({
      message: "Faculty ID, Project Title, and Start Date are required",
    });
  }

  const query = `
    INSERT INTO faculty_sponsored_research (faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding sponsored research", error: err });
    }
    res.status(201).json({
      message: "Sponsored research added successfully",
      sponsorship_id: result.insertId,
    });
  });
};

export const updateSponsoredResearch = (req, res) => {
  const { sponsorship_id } = req.params;
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  } = req.body;

  const query = `
    UPDATE faculty_sponsored_research
    SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, research_duration = ?, start_date = ?, end_date = ?
    WHERE sponsorship_id = ?
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
    sponsorship_id,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating sponsored research", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }
    res
      .status(200)
      .json({ message: "Sponsored research updated successfully" });
  });
};

export const deleteSponsoredResearch = (req, res) => {
  const { sponsorship_id } = req.params;

  const query = `DELETE FROM faculty_sponsored_research WHERE sponsorship_id = ?`;
  const queryParams = [sponsorship_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting sponsored research", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }
    res
      .status(200)
      .json({ message: "Sponsored research deleted successfully" });
  });
};

// Get consultancy records by faculty_id
export const getConsultancyByFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const query = `SELECT * FROM faculty_consultancy WHERE faculty_id = ?`;
  const queryParams = [faculty_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching consultancy records", error: err });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No consultancy records found for this faculty" });
    }
    res.status(200).json(result);
  });
};

// Add a new consultancy record
export const addConsultancy = (req, res) => {
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  } = req.body;

  if (!faculty_id || !project_title || !start_date) {
    return res.status(400).json({
      message: "Faculty ID, Project Title, and Start Date are required",
    });
  }

  const query = `
    INSERT INTO faculty_consultancy (faculty_id, project_title, funding_agency, amount_sponsored, research_duration, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding consultancy record", error: err });
    }
    res.status(201).json({
      message: "Consultancy record added successfully",
      consultancy_id: result.insertId,
    });
  });
};

// Update an existing consultancy record
export const updateConsultancy = (req, res) => {
  const { consultancy_id } = req.params;
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
  } = req.body;

  const query = `
    UPDATE faculty_consultancy
    SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, research_duration = ?, start_date = ?, end_date = ?
    WHERE consultancy_id = ?
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    research_duration,
    start_date,
    end_date,
    consultancy_id,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating consultancy record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }
    res
      .status(200)
      .json({ message: "Consultancy record updated successfully" });
  });
};

// Delete a consultancy record
export const deleteConsultancy = (req, res) => {
  const { consultancy_id } = req.params;

  const query = `DELETE FROM faculty_consultancy WHERE consultancy_id = ?`;
  const queryParams = [consultancy_id];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting consultancy record", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }
    res
      .status(200)
      .json({ message: "Consultancy record deleted successfully" });
  });
};

export const getFacultyDetails = (req, res) => {
  const { faculty_id } = req.params; // Get faculty_id from route parameters (if provided)

  let query = "SELECT * FROM faculty_details";
  let params = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching faculty details:", err);
      return res
        .status(500)
        .json({ message: "Error fetching faculty details", error: err });
    }

    res.status(200).json({
      message: "Faculty details fetched successfully",
      data: results,
    });
  });
};

export const addFaculty = (req, res) => {
  const {
    faculty_id,
    faculty_name,
    degree,
    university,
    year_of_attaining_highest_degree,
    email_id,
    mobile_number,
  } = req.body;

  if (!faculty_id) {
    return res.status(400).json({ message: "Faculty ID is required" });
  }

  const sql = `
    INSERT INTO faculty_details (faculty_id, faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      faculty_id,
      faculty_name,
      degree,
      university,
      year_of_attaining_highest_degree,
      email_id,
      mobile_number,
    ],
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error adding faculty details", error });
      }

      res
        .status(201)
        .json({ message: "Faculty details added successfully", data: result });
    },
  );
};

export const updateFacultyDetails = (req, res) => {
  const { faculty_id } = req.params;
  const {
    faculty_name,
    degree,
    university,
    year_of_attaining_highest_degree,
    email_id,
    mobile_number,
  } = req.body;

  const updateQuery = `
    UPDATE faculty_details
    SET faculty_name = ?, degree = ?, university = ?, year_of_attaining_highest_degree = ?, email_id = ?, mobile_number = ?
    WHERE faculty_id = ?
  `;

  pool.query(
    updateQuery,
    [
      faculty_name,
      degree,
      university,
      year_of_attaining_highest_degree,
      email_id,
      mobile_number,
      faculty_id,
    ],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating faculty details", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Faculty not found" });
      }

      res.status(200).json({ message: "Faculty details updated successfully" });
    },
  );
};

export const deleteFaculty = (req, res) => {
  const { faculty_id } = req.params;

  const deleteQuery = "DELETE FROM faculty_details WHERE faculty_id = ?";

  pool.query(deleteQuery, [faculty_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting faculty details", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty details deleted successfully" });
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

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching specializations:", err);
      return res
        .status(500)
        .json({ message: "Error fetching specializations", error: err });
    }
    res
      .status(200)
      .json({ message: "Specializations fetched successfully", data: results });
  });
};

export const addSpecialization = (req, res) => {
  const { faculty_id, specialization } = req.body;

  // Check if the faculty_id exists in faculty_details
  const checkQuery =
    "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
  pool.query(checkQuery, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error checking faculty_id:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results[0].count === 0) {
      return res
        .status(400)
        .json({ message: "faculty_id does not exist in faculty_details" });
    }

    // Insert the specialization
    const insertQuery = `
      INSERT INTO faculty_specialization (faculty_id, specialization)
      VALUES (?, ?)
    `;
    pool.query(insertQuery, [faculty_id, specialization], (err, result) => {
      if (err) {
        console.error("Error adding specialization:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(201).json({
        message: "Specialization added successfully",
        success: true,
        id: result.insertId,
      });
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
  pool.query(query, [specialization, specialization_id], (err, result) => {
    if (err) {
      console.error("Error updating specialization:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res
      .status(200)
      .json({ message: "Specialization updated successfully", success: true });
  });
};

export const deleteSpecialization = (req, res) => {
  const { specialization_id } = req.params; // Specialization ID

  const query =
    "DELETE FROM faculty_specialization WHERE specialization_id = ?";
  pool.query(query, [specialization_id], (err, result) => {
    if (err) {
      console.error("Error deleting specialization:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res
      .status(200)
      .json({ message: "Specialization deleted successfully", success: true });
  });
};

export const getFacultyImage = (req, res) => {
  const { faculty_id } = req.params;

  const query = "SELECT * FROM faculty_image WHERE faculty_id = ?";

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching faculty image", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Faculty image not found" });
    }

    res.status(200).json(results[0]);
  });
};

export const updateFacultyImage = (req, res) => {
  const { faculty_id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  const newImageFilename = req.file.filename;
  const tempFilePath = req.file.path;
  const uploadDir = path.join(__dirname, "..", "public", "Faculty", "images");

  // Compress the image using our callback function
  compressImage(tempFilePath, uploadDir, newImageFilename, (err, compressedImagePath) => {
    if (err) {
      return res.status(500).json({ message: "Error processing image", error: err.message });
    }

    // Fetch old image path from the database
    const getQuery = "SELECT faculty_image FROM faculty_image WHERE faculty_id = ?";
    pool.query(getQuery, [faculty_id], (err, result) => {
      if (err) {
        console.error("❌ Error fetching old image:", err);
        return res.status(500).json({ message: "Error fetching old image", error: err.message });
      }

      const oldImagePath = result.length > 0 ? result[0].faculty_image : null;

      // Delete old image if it exists
      if (oldImagePath) {
        const fullOldImagePath = path.join(__dirname, "..", "public", oldImagePath);
        if (fs.existsSync(fullOldImagePath)) {
          fs.unlink(fullOldImagePath, (err) => {
            if (err) console.error("❌ Error deleting old image:", err);
            else console.log("✅ Old image deleted successfully.");
          });
        } else {
          console.warn("⚠ Old image not found, skipping deletion.");
        }
      }

      // Update database with new compressed image path
      const updateQuery = "UPDATE faculty_image SET faculty_image = ? WHERE faculty_id = ?";
      pool.query(updateQuery, [`Faculty/images/compressed_${newImageFilename}`, faculty_id], (err) => {
        if (err) {
          console.error("❌ Error updating faculty image:", err);
          return res.status(500).json({ message: "Error updating faculty image", error: err.message });
        }

        // Delete the uncompressed image
        setTimeout(() => {
          if (fs.existsSync(tempFilePath)) {
            fs.rm(tempFilePath, { force: true }, (err) => {
              if (err) console.error("❌ Error deleting uncompressed image:", err);
              else console.log("✅ Uncompressed image deleted successfully.");
            });
          } else {
            console.warn("⚠ Uncompressed image not found, skipping deletion.");
          }
        }, 500);

        res.status(200).json({ message: "Faculty image updated successfully" });
      });
    });
  });
};




export const deleteFacultyImage = (req, res) => {
  const { faculty_id } = req.params;

  // Query to get the image path from the database
  const getQuery =
    "SELECT faculty_image FROM faculty_image WHERE faculty_id = ?";

  pool.query(getQuery, [faculty_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving faculty image", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const imagePath = result[0].faculty_image; // The image file path retrieved from the database

    // If faculty_image is null or doesn't exist, skip the deletion process
    if (!imagePath) {
      return res
        .status(200)
        .json({ message: "No image to delete for the given faculty" });
    }

    // Construct the full path for the image
    const fullImagePath = path.join(__dirname, "..", "public", imagePath);

    // Check if the file exists before trying to delete it
    fs.access(fullImagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        // If the file exists, try to delete it
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error deleting the image file", error: err });
          }
        });
      }

      // Proceed with updating the faculty_image column to NULL in the database
      const updateQuery =
        "UPDATE faculty_image SET faculty_image = NULL WHERE faculty_id = ?";

      pool.query(updateQuery, [faculty_id], (err, updateResult) => {
        if (err) {
          return res.status(500).json({
            message: "Error updating faculty image record",
            error: err,
          });
        }

        if (updateResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Failed to update faculty image record" });
        }

        res.status(200).json({
          message: "Faculty image deleted and record updated successfully",
        });
      });
    });
  });
};

// Get all faculty patents
export const getFacultyPatents = (req, res) => {
  const { faculty_id } = req.params; 

  let query = "SELECT * FROM faculty_patents";
  let params = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching patents:", err);
      return res.status(500).json({ message: "Error fetching patents" });
    }
    res.status(200).json({ message: "Patents fetched successfully", data: results });
  });
};

export const addFacultyPatent = (req, res) => {
  const { faculty_id, patent_name, inventors_name, patent_publish, patent_award_date } = req.body;

  // Check if the faculty_id exists
  const checkQuery = "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
  pool.query(checkQuery, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error checking faculty_id:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results[0].count === 0) {
      return res.status(400).json({ message: "faculty_id does not exist" });
    }

    // Insert the patent
    const insertQuery = `
      INSERT INTO faculty_patents (faculty_id, patent_name, inventors_name, patent_publish, patent_award_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    pool.query(
      insertQuery,
      [faculty_id, patent_name, inventors_name, patent_publish, patent_award_date || null],
      (err, result) => {
        if (err) {
          console.error("Error adding patent:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(201).json({ message: "Patent added successfully", id: result.insertId });
      }
    );
  });
};

export const updateFacultyPatent = (req, res) => {
  const { patent_id } = req.params;
  const { faculty_id, patent_name, inventors_name, patent_publish, patent_award_date } = req.body;

  const query = `
    UPDATE faculty_patents
    SET faculty_id = ?, patent_name = ?, inventors_name = ?, patent_publish = ?, patent_award_date = ?
    WHERE patent_id = ?
  `;
  pool.query(
    query,
    [faculty_id, patent_name, inventors_name, patent_publish, patent_award_date || null, patent_id],
    (err, result) => {
      if (err) {
        console.error("Error updating patent:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Patent not found" });
      }

      res.status(200).json({ message: "Patent updated successfully" });
    }
  );
};

export const deleteFacultyPatent = (req, res) => {
  const { patent_id } = req.params;

  const query = "DELETE FROM faculty_patents WHERE patent_id = ?";
  pool.query(query, [patent_id], (err, result) => {
    if (err) {
      console.error("Error deleting patent:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patent not found" });
    }

    res.status(200).json({ message: "Patent deleted successfully" });
  });
};


// ✅ GET all faculty qualifications or specific faculty qualification
export const getFacultyQualifications = (req, res) => {
  const { faculty_id } = req.params;

  const query = faculty_id
    ? "SELECT * FROM faculty_Qualification WHERE faculty_id = ?"
    : "SELECT * FROM faculty_Qualification";

  pool.query(query, faculty_id ? [faculty_id] : [], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching faculty qualifications", error: err });
    }
    res.status(200).json(results);
  });
};

// ✅ ADD a new faculty qualification
export const addFacultyQualification = (req, res) => {
  const { faculty_id, degree_level, institute, degree_name, year_of_passing, specialization } = req.body;

  if (!faculty_id || !degree_level || !institute || !degree_name || !year_of_passing || !specialization) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO faculty_Qualification 
      (faculty_id, degree_level, institute, degree_name, year_of_passing, specialization) 
      VALUES (?, ?, ?, ?, ?, ?)`;

  pool.query(
    query,
    [faculty_id, degree_level, institute, degree_name, year_of_passing, specialization],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error adding qualification", error: err });
      }
      res.status(201).json({ message: "Qualification added successfully", education_id: result.insertId });
    }
  );
};

// ✅ UPDATE a faculty qualification
export const updateFacultyQualification = (req, res) => {
  const { education_id } = req.params;
  const { faculty_id, degree_level, institute, degree_name, year_of_passing, specialization } = req.body;

  if (!faculty_id || !degree_level || !institute || !degree_name || !year_of_passing || !specialization) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `UPDATE faculty_Qualification 
      SET faculty_id = ?, degree_level = ?, institute = ?, degree_name = ?, year_of_passing = ?, specialization = ? 
      WHERE education_id = ?`;

  pool.query(
    query,
    [faculty_id, degree_level, institute, degree_name, year_of_passing, specialization, education_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating qualification", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Qualification not found" });
      }
      res.status(200).json({ message: "Qualification updated successfully" });
    }
  );
};

// ✅ DELETE a faculty qualification
export const deleteFacultyQualification = (req, res) => {
  const { education_id } = req.params;

  const query = `DELETE FROM faculty_Qualification WHERE education_id = ?`;

  pool.query(query, [education_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting qualification", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    res.status(200).json({ message: "Qualification deleted successfully" });
  });
};
