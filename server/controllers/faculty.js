// Required Imports
import express from "express";
import { pool } from "../data/database.js"; // Ensure this points to your database connection file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { uploadFacultyImage } from "../config/facultyMulterConfig.js";
import { compressImage } from "../utils/fileCompressor.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Controller for faculty_credentials table

dotenv.config();

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || "Invalid month";
}

function getMonthNumber(monthName) {
  const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  return months[monthName] || "Invalid month";
}

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
      }
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
    }
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
  const {
    faculty_id,
    paper_type,
    title_of_paper,
    domain,
    publication_name,
    published_date,
    citation,
  } = req.body;

  // Get the compressed file path
  const filePath = req.file ? path.relative("public", req.file.path) : null;

  // Check if faculty_id exists
  pool.query(
    "SELECT * FROM faculty_details WHERE faculty_id = ?",
    [faculty_id],
    (error, results) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Error checking faculty details", error });

      if (results.length === 0) {
        return res
          .status(400)
          .json({
            message: "Faculty ID does not exist in faculty_details table",
          });
      }

      // Insert into faculty_research_paper table
      const sql = `
      INSERT INTO faculty_research_paper 
      (faculty_id, paper_type, title_of_paper, domain, publication_name, published_date, pdf_path, citation) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      pool.query(
        sql,
        [
          faculty_id,
          paper_type,
          title_of_paper,
          domain,
          publication_name,
          published_date,
          filePath,
          citation,
        ],
        (insertError, insertResult) => {
          if (insertError)
            return res
              .status(500)
              .json({
                message: "Error adding research paper",
                error: insertError,
              });

          res
            .status(201)
            .json({
              message: "Research paper added successfully",
              data: insertResult,
            });
        }
      );
    }
  );
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
  const {
    paper_type,
    title_of_paper,
    domain,
    publication_name,
    published_date,
    citation,
  } = req.body;

  // Get the new compressed file path
  const filePath = req.file ? path.relative("public", req.file.path) : null;

  // Check if research paper exists
  pool.query(
    "SELECT * FROM faculty_research_paper WHERE research_id = ?",
    [research_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error checking research paper", error: err });

      if (result.length === 0)
        return res.status(404).json({ message: "Research paper not found" });

      const oldPdfPath = result[0].pdf_path;
      const absoluteOldFilePath = oldPdfPath
        ? path.join("public", oldPdfPath)
        : null;

      // If a new file is uploaded, delete the old one
      if (
        filePath &&
        filePath !== oldPdfPath &&
        absoluteOldFilePath &&
        fs.existsSync(absoluteOldFilePath)
      ) {
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

      pool.query(
        updateQuery,
        [
          paper_type,
          title_of_paper,
          domain,
          publication_name,
          published_date,
          citation,
          filePath,
          research_id,
        ],
        (updateErr, updateResult) => {
          if (updateErr)
            return res
              .status(500)
              .json({
                message: "Error updating research paper",
                error: updateErr,
              });

          res
            .status(200)
            .json({
              message: "Research paper updated successfully",
              data: updateResult,
            });
        }
      );
    }
  );
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
      return res
        .status(500)
        .json({ message: "Error fetching FDP details", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No FDP details found" });
    }

    // Convert month number to month name
    const modifiedResults = results.map((record) => ({
      ...record,
      month_conducted: getMonthName(record.month_conducted),
    }));

    res.status(200).json({
      message: "FDP details fetched successfully",
      data: modifiedResults,
    });
  });
};

// 2. Add a new FDP record
export const addFDPRecord = (req, res) => {
  const {
    faculty_id,
    FDP_name,
    FDP_progress,
    year_conducted,
    month_conducted, // This will be received as a name
    days_contributed,
  } = req.body;

  // Convert month name to number
  const monthNumber = getMonthNumber(month_conducted);
  if (monthNumber === "Invalid month") {
    return res.status(400).json({ message: "Invalid month name provided" });
  }

  const query = `
      INSERT INTO faculty_FDP (faculty_id, FDP_name, FDP_progress, year_conducted, month_conducted, days_contributed)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    faculty_id,
    FDP_name,
    FDP_progress,
    year_conducted,
    monthNumber,
    days_contributed,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error adding FDP record:", err);
      return res
        .status(500)
        .json({ message: "Error adding FDP record", error: err });
    }
    res.status(201).json({
      message: "FDP record added successfully",
      data: { id: result.insertId },
    });
  });
};

// 3. Update an existing FDP record using FDP_id
export const updateFDPRecord = (req, res) => {
  const { FDP_id } = req.params;
  const {
    faculty_id,
    FDP_name,
    FDP_progress,
    year_conducted,
    month_conducted, // Received as a name
    days_contributed,
  } = req.body;

  // Convert month name to number
  const monthNumber = getMonthNumber(month_conducted);
  if (monthNumber === "Invalid month") {
    return res.status(400).json({ message: "Invalid month name provided" });
  }

  const query = `
      UPDATE faculty_FDP 
      SET faculty_id = ?, FDP_name = ?, FDP_progress = ?, year_conducted = ?, month_conducted = ?, days_contributed = ?
      WHERE FDP_id = ?
  `;
  const params = [
    faculty_id,
    FDP_name,
    FDP_progress,
    year_conducted,
    monthNumber,
    days_contributed,
    FDP_id,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating FDP record:", err);
      return res
        .status(500)
        .json({ message: "Error updating FDP record", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No FDP record found with the given FDP_id" });
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

// Get Faculty Interactions
export const getFacultyInteractions = (req, res) => {
  const { faculty_id } = req.params;

  let query = `
      SELECT fi.*, fit.interaction_type
      FROM faculty_interaction fi
      JOIN faculty_interaction_types fit ON fi.interaction_id = fit.interaction_id
  `;
  const params = [];

  if (faculty_id) {
    query += " WHERE fi.faculty_id = ?";
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching faculty interactions:", err);
      return res.status(500).json({ message: "Error fetching faculty interactions", error: err });
    }

    results.forEach(record => {
      record.month_of_visit = getMonthName(record.month_of_visit);
    });

    res.status(200).json({ message: "Faculty interactions retrieved successfully", data: results });
  });
};

// Add Faculty Interaction with Document Upload
export const addFacultyInteraction = (req, res) => {
  const { faculty_id, interaction_type, institution, description, year_of_visit, month_of_visit, duration_in_days } = req.body;

  if (!faculty_id || !interaction_type || !institution || !description || !year_of_visit || !month_of_visit) {
    return res.status(400).json({ message: "All fields except duration_in_days are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Document file is required" });
  }

  const document_path = req.file.path; // Save document path
  const monthNumber = getMonthNumber(month_of_visit);

  if (!monthNumber) {
    return res.status(400).json({ message: "Invalid month name" });
  }

  const checkQuery = `SELECT interaction_id FROM faculty_interaction_types WHERE interaction_type = ?`;

  pool.query(checkQuery, [interaction_type], (err, result) => {
    if (err) {
      console.error("Error checking interaction type:", err);
      return res.status(500).json({ message: "Error checking interaction type", error: err });
    }

    if (result.length > 0) {
      insertFacultyInteraction(result[0].interaction_id);
    } else {
      const insertTypeQuery = `INSERT INTO faculty_interaction_types (interaction_type) VALUES (?)`;

      pool.query(insertTypeQuery, [interaction_type], (err, insertResult) => {
        if (err) {
          console.error("Error inserting new interaction type:", err);
          return res.status(500).json({ message: "Error inserting interaction type", error: err });
        }

        insertFacultyInteraction(insertResult.insertId);
      });
    }
  });

  function insertFacultyInteraction(interaction_id) {
    const query = `
        INSERT INTO faculty_interaction (faculty_id, interaction_id, institution, description, year_of_visit, month_of_visit, duration_in_days, document_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [faculty_id, interaction_id, institution, description, year_of_visit, monthNumber, duration_in_days || null, document_path];

    pool.query(query, params, (err, result) => {
      if (err) {
        console.error("Error adding faculty interaction:", err);
        return res.status(500).json({ message: "Error adding faculty interaction", error: err });
      }

      res.status(201).json({ message: "Faculty interaction added successfully", data: { id: result.insertId, documentPath: document_path } });
    });
  }
};

// Update Faculty Interaction with Document Upload
export const updateFacultyInteraction = (req, res) => {
  const { interact_id } = req.params;
  const { interaction_type, institution, description, year_of_visit, month_of_visit, duration_in_days } = req.body;

  if (!interact_id || !interaction_type || !institution || !description || !year_of_visit || !month_of_visit) {
    return res.status(400).json({ message: "All fields except duration_in_days are required" });
  }

  const monthNumber = getMonthNumber(month_of_visit);
  if (!monthNumber) {
    return res.status(400).json({ message: "Invalid month name" });
  }

  // Fetch existing document path
  pool.query(`SELECT document_path FROM faculty_interaction WHERE interact_id=?`, [interact_id], (err, results) => {
    if (err) {
      console.error("Error fetching faculty interaction:", err);
      return res.status(500).json({ message: "Error fetching faculty interaction", error: err });
    }
    if (results.length === 0) return res.status(404).json({ message: "Faculty interaction not found" });

    const oldFilePath = results[0].document_path;
    const newFilePath = req.file ? req.file.path : oldFilePath;

    // Delete old document if a new one is uploaded
    if (req.file && oldFilePath) {
      fs.unlink(oldFilePath, err => {
        if (err && err.code !== "ENOENT") console.error("Error deleting old file:", err);
      });
    }

    const checkQuery = `SELECT interaction_id FROM faculty_interaction_types WHERE interaction_type = ?`;

    pool.query(checkQuery, [interaction_type], (err, result) => {
      if (err) {
        console.error("Error checking interaction type:", err);
        return res.status(500).json({ message: "Error checking interaction type", error: err });
      }

      if (result.length > 0) {
        updateInteraction(result[0].interaction_id);
      } else {
        const insertTypeQuery = `INSERT INTO faculty_interaction_types (interaction_type) VALUES (?)`;

        pool.query(insertTypeQuery, [interaction_type], (err, insertResult) => {
          if (err) {
            console.error("Error inserting new interaction type:", err);
            return res.status(500).json({ message: "Error inserting interaction type", error: err });
          }

          updateInteraction(insertResult.insertId);
        });
      }
    });

    function updateInteraction(interaction_id) {
      const query = `
          UPDATE faculty_interaction
          SET interaction_id = ?, institution = ?, description = ?, year_of_visit = ?, month_of_visit = ?, duration_in_days = ?, document_path = ?
          WHERE interact_id = ?
      `;
      const params = [interaction_id, institution, description, year_of_visit, monthNumber, duration_in_days || null, newFilePath, interact_id];

      pool.query(query, params, (err, result) => {
        if (err) {
          console.error("Error updating faculty interaction:", err);
          return res.status(500).json({ message: "Error updating faculty interaction", error: err });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No faculty interaction found with the given interact_id" });
        }

        res.status(200).json({ message: "Faculty interaction updated successfully", documentPath: newFilePath });
      });
    }
  });
};

// Delete Faculty Interaction with Document Deletion
export const deleteFacultyInteraction = (req, res) => {
  const { interact_id } = req.params;

  pool.query(`SELECT document_path FROM faculty_interaction WHERE interact_id=?`, [interact_id], (err, results) => {
    if (err) {
      console.error("Error fetching document path:", err);
      return res.status(500).json({ message: "Error fetching faculty interaction", error: err });
    }
    if (results.length === 0) return res.status(404).json({ message: "Faculty interaction not found" });

    const filePath = results[0].document_path;

    if (filePath) {
      fs.unlink(filePath, err => {
        if (err && err.code !== "ENOENT") console.error("Error deleting file:", err);
      });
    }

    pool.query(`DELETE FROM faculty_interaction WHERE interact_id = ?`, [interact_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting faculty interaction", error: err });

      res.status(200).json({ message: "Faculty interaction deleted successfully" });
    });
  });
};

export const getInteractionTypes = (req, res) => {
  const query = "SELECT * FROM faculty_interaction_types";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching interaction types:", err);
      return res
        .status(500)
        .json({ message: "Error fetching interaction types", error: err });
    }

    res
      .status(200)
      .json({
        message: "Interaction types retrieved successfully",
        data: results,
      });
  });
};

export const addInteractionType = (req, res) => {
  const { interaction_id, interaction_type } = req.body;

  if (!interaction_id || !interaction_type) {
    return res
      .status(400)
      .json({ message: "interaction_id and interaction_type are required" });
  }

  const query =
    "INSERT INTO faculty_interaction_types (interaction_id, interaction_type) VALUES (?, ?)";
  const params = [interaction_id, interaction_type];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error adding interaction type:", err);
      return res
        .status(500)
        .json({ message: "Error adding interaction type", error: err });
    }

    res.status(201).json({ message: "Interaction type added successfully" });
  });
};

export const updateInteractionType = (req, res) => {
  const { interaction_id } = req.params;
  const { interaction_type } = req.body;

  if (!interaction_type) {
    return res.status(400).json({ message: "interaction_type is required" });
  }

  const query =
    "UPDATE faculty_interaction_types SET interaction_type = ? WHERE interaction_id = ?";
  const params = [interaction_type, interaction_id];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating interaction type:", err);
      return res
        .status(500)
        .json({ message: "Error updating interaction type", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "No interaction type found with the given interaction_id",
        });
    }

    res.status(200).json({ message: "Interaction type updated successfully" });
  });
};

export const deleteInteractionType = (req, res) => {
  const { interaction_id } = req.params;

  if (!interaction_id) {
    return res.status(400).json({ message: "interaction_id is required" });
  }

  const query =
    "DELETE FROM faculty_interaction_types WHERE interaction_id = ?";

  pool.query(query, [interaction_id], (err, result) => {
    if (err) {
      console.error("Error deleting interaction type:", err);
      return res
        .status(500)
        .json({ message: "Error deleting interaction type", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "No interaction type found with the given interaction_id",
        });
    }

    res.status(200).json({ message: "Interaction type deleted successfully" });
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
// 1. Get all faculty guidance records
export const getFacultyGuidanceRecords = (req, res) => {
  const query = "SELECT * FROM faculty_guidance";

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching faculty guidance records",
        error: err,
      });
    }

    // Convert numeric month to string month
    const updatedResults = results.map((record) => ({
      ...record,
      passing_month: getMonthName(record.passing_month),
    }));

    res.status(200).json(updatedResults);
  });
};

// 2. Get faculty guidance records by faculty_id
export const getFacultyGuidanceRecordsByFacultyId = (req, res) => {
  const { faculty_id } = req.params;

  const query = `
    SELECT Guidance_id, degree, mentee_name, mentee_rn, passing_year, passing_month 
    FROM faculty_guidance 
    WHERE faculty_id = ?
  `;

  pool.query(query, [faculty_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching faculty guidance records",
        error: err,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No faculty guidance records found for the given faculty_id",
      });
    }

    // Convert numeric month to string month
    const updatedResults = results.map((record) => ({
      ...record,
      passing_month: getMonthName(record.passing_month),
    }));

    res.status(200).json(updatedResults);
  });
};

// 3. Add a new faculty guidance record
export const addFacultyGuidanceRecord = (req, res) => {
  let { faculty_id, degree, mentee_name, mentee_rn, passing_year, passing_month } = req.body;

  // Convert string month to numeric month if it's a valid month name
  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  const query = `
    INSERT INTO faculty_guidance (faculty_id, degree, mentee_name, mentee_rn, passing_year, passing_month)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const queryParams = [
    faculty_id,
    degree,
    mentee_name,
    mentee_rn,
    passing_year,
    passing_month,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error adding faculty guidance record",
        error: err,
      });
    }
    res.status(201).json({
      message: "Faculty guidance record added successfully",
      recordId: result.insertId,
    });
  });
};

// 4. Update an existing faculty guidance record
export const updateFacultyGuidanceRecord = (req, res) => {
  let { degree, mentee_name, passing_year, passing_month, mentee_rn } = req.body;
  const { Guidance_id } = req.params;

  if (!Guidance_id) {
    return res.status(400).json({ message: "Guidance_id is required" });
  }

  // Convert string month to numeric month if it's a valid month name
  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  const query = `
    UPDATE faculty_guidance
    SET degree = ?, mentee_name = ?, passing_year = ?, passing_month = ?, mentee_rn = ?
    WHERE Guidance_id = ?
  `;

  const queryParams = [
    degree,
    mentee_name,
    passing_year,
    passing_month,
    mentee_rn,
    Guidance_id,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error updating faculty guidance record",
        error: err,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Faculty guidance record not found" });
    }
    res.status(200).json({
      message: "Faculty guidance record updated successfully",
    });
  });
};

// 5. Delete a faculty guidance record
export const deleteFacultyGuidanceRecord = (req, res) => {
  const { Guidance_id } = req.params;

  const query = "DELETE FROM faculty_guidance WHERE Guidance_id = ?";

  pool.query(query, [Guidance_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting faculty guidance record",
        error: err,
      });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No faculty guidance record found with the given Guidance_id" });
    }
    res
      .status(200)
      .json({ message: "Faculty guidance record deleted successfully" });
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
    }
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
    }
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


export const updateFacultyImage = async (req, res) => {
  try {
    console.log("✅ Inside updateFacultyImage Controller");

    const facultyId = req.params.faculty_id;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const newImageUrl = `/public/Faculty/images/${req.file.filename}`;
    console.log("🖼️ New Image URL:", newImageUrl);

    // Step 1️⃣: Get the old image filename from the database
    const getOldImageQuery = `SELECT faculty_image FROM faculty_image WHERE faculty_id = ?`;
    pool.query(getOldImageQuery, [facultyId], (err, results) => {
      if (err) {
        console.error("❌ Database Fetch Error:", err);
        return res.status(500).json({ message: "Failed to retrieve old image", error: err.message });
      }

      const oldImageUrl = results[0]?.faculty_image;
      console.log("🖼️ Old Image URL:", oldImageUrl);

      // Step 2️⃣: Delete the old image file (if it exists)
      if (oldImageUrl) {
        const oldImagePath = path.join("public", "Faculty", "images", path.basename(oldImageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("❌ Error Deleting Old Image:", unlinkErr);
            } else {
              console.log("✅ Old Image Deleted Successfully:", oldImagePath);
            }
          });
        }
      }

      // Step 3️⃣: Update the database with the new image URL
      const updateQuery = `UPDATE faculty_image SET faculty_image = ? WHERE faculty_id = ?`;
      pool.query(updateQuery, [newImageUrl, facultyId], (updateErr, result) => {
        if (updateErr) {
          console.error("❌ Database Update Error:", updateErr);
          return res.status(500).json({ message: "Database update failed", error: updateErr.message });
        }

        console.log("✅ Database Update Success:", result);
        return res.status(200).json({ message: "Image updated successfully", imageUrl: newImageUrl });
      });
    });

  } catch (error) {
    console.error("❌ Error in updateFacultyImage:", error);
    return res.status(500).json({ message: "Image upload failed", error: error.message });
  }
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
    res
      .status(200)
      .json({ message: "Patents fetched successfully", data: results });
  });
};

export const addFacultyPatent = (req, res) => {
  const {
    faculty_id,
    patent_name,
    inventors_name,
    patent_publish,
    patent_award_date,
  } = req.body;

  // Check if the faculty_id exists
  const checkQuery =
    "SELECT COUNT(*) AS count FROM faculty_details WHERE faculty_id = ?";
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
      [
        faculty_id,
        patent_name,
        inventors_name,
        patent_publish,
        patent_award_date || null,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding patent:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        res
          .status(201)
          .json({ message: "Patent added successfully", id: result.insertId });
      }
    );
  });
};

export const updateFacultyPatent = (req, res) => {
  const { patent_id } = req.params;
  const {
    faculty_id,
    patent_name,
    inventors_name,
    patent_publish,
    patent_award_date,
  } = req.body;

  const query = `
    UPDATE faculty_patents
    SET faculty_id = ?, patent_name = ?, inventors_name = ?, patent_publish = ?, patent_award_date = ?
    WHERE patent_id = ?
  `;
  pool.query(
    query,
    [
      faculty_id,
      patent_name,
      inventors_name,
      patent_publish,
      patent_award_date || null,
      patent_id,
    ],
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
  const {
    faculty_id,
    degree_level,
    institute,
    degree_name,
    year_of_passing,
    specialization,
  } = req.body;

  if (
    !faculty_id ||
    !degree_level ||
    !institute ||
    !degree_name ||
    !year_of_passing ||
    !specialization
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO faculty_Qualification 
      (faculty_id, degree_level, institute, degree_name, year_of_passing, specialization) 
      VALUES (?, ?, ?, ?, ?, ?)`;

  pool.query(
    query,
    [
      faculty_id,
      degree_level,
      institute,
      degree_name,
      year_of_passing,
      specialization,
    ],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error adding qualification", error: err });
      }
      res
        .status(201)
        .json({
          message: "Qualification added successfully",
          education_id: result.insertId,
        });
    }
  );
};

// ✅ UPDATE a faculty qualification
export const updateFacultyQualification = (req, res) => {
  const { education_id } = req.params;
  const {
    faculty_id,
    degree_level,
    institute,
    degree_name,
    year_of_passing,
    specialization,
  } = req.body;

  if (
    !faculty_id ||
    !degree_level ||
    !institute ||
    !degree_name ||
    !year_of_passing ||
    !specialization
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `UPDATE faculty_Qualification 
      SET faculty_id = ?, degree_level = ?, institute = ?, degree_name = ?, year_of_passing = ?, specialization = ? 
      WHERE education_id = ?`;

  pool.query(
    query,
    [
      faculty_id,
      degree_level,
      institute,
      degree_name,
      year_of_passing,
      specialization,
      education_id,
    ],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating qualification", error: err });
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
      return res
        .status(500)
        .json({ message: "Error deleting qualification", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    res.status(200).json({ message: "Qualification deleted successfully" });
  });
};

export const updateLastSeen = (req, res) => {
  const { user_id, position_name, notification_type } = req.body;
  console.log(user_id, position_name, notification_type);

  if (!user_id || !position_name || !notification_type) {
      return res.status(400).json({ error: "user_id, position_name, and notification_type are required" });
  }

  if (!["duty", "circular"].includes(notification_type)) {
      return res.status(400).json({ error: "Invalid notification_type. Must be 'duty' or 'circular'." });
  }

  // Update last_seen timestamp for the user
  const updateQuery = `
      INSERT INTO user_last_seen_notifications (user_id, user_type, notification_type, last_seen)
      VALUES (?, (SELECT position_id FROM position_type WHERE position_name = ?), ?, NOW())
      ON DUPLICATE KEY UPDATE last_seen = NOW();
  `;

  pool.query(updateQuery, [user_id, position_name, notification_type], (err) => {
      if (err) {
          console.error("Error updating last_seen:", err);
          return res.status(500).json({ error: "Internal server error" });
      }

      // First, fetch last_seen timestamp separately
      const lastSeenQuery = `
          SELECT last_seen FROM user_last_seen_notifications 
          WHERE user_id = ? AND notification_type = ?;
      `;

      pool.query(lastSeenQuery, [user_id, notification_type], (err, lastSeenResult) => {
          if (err) {
              console.error("Error fetching last_seen:", err);
              return res.status(500).json({ error: "Internal server error" });
          }

          // Default last_seen value if no record exists
          const lastSeen = lastSeenResult.length > 0 ? lastSeenResult[0].last_seen : '2000-01-01';

          let countQuery;
          let values = [lastSeen, lastSeen];

          if (notification_type === "duty") {
              countQuery = `
                  SELECT 
                      COUNT(CASE WHEN created_at > ? THEN 1 END) AS unseen_count,
                      COUNT(CASE WHEN created_at <= ? THEN 1 END) AS seen_count
                  FROM department_duty_notifications
                  WHERE user_id = ?;
              `;
              values.push(user_id);
          } else {
              countQuery = `
                  SELECT 
                      COUNT(CASE WHEN created_at > ? THEN 1 END) AS unseen_count,
                      COUNT(CASE WHEN created_at <= ? THEN 1 END) AS seen_count
                  FROM department_circular
                  WHERE department_id IN (SELECT department_id FROM faculty_auth WHERE faculty_id = ?);
              `;
              values.push(user_id);
          }

          pool.query(countQuery, values, (err, result) => {
              if (err) {
                  console.error("Error fetching notification counts:", err);
                  return res.status(500).json({ error: "Internal server error" });
              }

              res.json({
                  success: true,
                  message: `${notification_type} last seen updated successfully`,
                  unseen_count: result[0].unseen_count,
                  seen_count: result[0].seen_count
              });
          });
      });
  });
};



export const getUserDutyOrders = (req, res) => {
  const { user_id } = req.query;
  let query = `
      SELECT ddo.order_id, ddo.order_number, ddo.order_name, ddo.order_date, 
             ddo.start_date, ddo.end_date, ddo.subject, ddo.order_path, 
             ddo.undersigned, dn.is_seen, dn.created_at AS notified_at
      FROM department_duty_orders ddo
      JOIN department_duty_notifications dn ON ddo.order_number = dn.order_number
  `;
  let values = [];

  if (user_id) {
      query += " WHERE dn.user_id = ?";
      values.push(user_id);
  }

  pool.query(query, values, (err, result) => {
      if (err) {
          console.error("Error fetching duty orders:", err);
          return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
  });
};

export const getCirculars = (req, res) => {
  const { department_id } = req.query;

  let query = "SELECT * FROM department_circular";
  let params = [];

  if (department_id) {
    query += " WHERE department_id = ?";
    params.push(department_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching circulars:", err);
      return res
        .status(500)
        .json({ message: "Error fetching circulars", error: err });
    }

    if (department_id && results.length === 0) {
      return res
        .status(404)
        .json({ message: "No circulars found for this department" });
    }

    res
      .status(200)
      .json({ message: "Circulars retrieved successfully", data: results });
  });
};

export const markDutyOrderAsSeen = (req, res) => {
  const { user_id, order_number } = req.body;

  if (!user_id || !order_number) {
    return res.status(400).json({ message: "User ID and Duty Order ID are required!" });
  }

  const updateQuery = `
    UPDATE department_duty_notifications 
    SET is_seen = 1 
    WHERE user_id = ? AND order_number = ?
  `;

  pool.query(updateQuery, [user_id, order_number], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Server error!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found or already seen!" });
    }

    res.json({ message: "Duty order marked as seen!" });
  });
};
