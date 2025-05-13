// Required Imports
import express from "express";
import { pool } from "../data/database.js"; // Ensure this points to your database connection file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { userActionLogger, errorLogger } from "../utils/logger.js";
import requestIp from "request-ip";
import { promisePool } from "../data/database.js";
import axios from "axios"; // Import axios for HTTP requests
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import calendar from "calendar"; // Or use JS's built-in Date methods
import { DateTime } from "luxon"; // Or use date-fns, moment, etc.


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

// ✅ Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const generateAccessToken = (id, position, role_assigned, department_id) => {
  return jwt.sign(
    { id, position, role_assigned, department_id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ==================== Generate Refresh Token ====================
const generateRefreshToken = (id, position, role_assigned, department_id) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign(
    { id, position, role_assigned, department_id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: expirySeconds,
    }
  );
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

// Get all research papers or by faculty_id (from query or param)
export const getResearchPapers = async (req, res) => {
  const faculty_id = req.query.faculty_id;
  try {
    let query = `
      SELECT frp.*, ra.area_of_research, rpt.type_name as paper_type
      FROM faculty_research_paper frp
      LEFT JOIN research_areas ra ON frp.area_of_research = ra.id
      LEFT JOIN research_paper_type rpt ON frp.paper_type = rpt.type_id
    `;
    let params = [];
    if (faculty_id) {
      query += " WHERE frp.faculty_id = ?";
      params.push(faculty_id);
    }
    const [results] = await promisePool.query(query, params);
    userActionLogger.info(
      `Fetched research papers${faculty_id ? ` for faculty_id: ${faculty_id}` : ""}`
    );
    res.status(200).json(results);
  } catch (err) {
    errorLogger.error(`Error fetching research papers: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error fetching research papers", error: err.message });
  }
};

export const addResearchPaper = async (req, res) => {
  const faculty_id = req.query.faculty_id;
  if (!faculty_id) {
    userActionLogger.warn("Attempt to add research paper without faculty_id");
    return res.status(400).json({ message: "faculty_id is required" });
  }
  const {
    paper_type, // as text
    title_of_paper,
    area_of_research, // as text
    published_year,
    citation,
    authors,
    name_of_publication,
    ISSN_number,
    Link,
    UGC,
  } = req.body;
  const pdf_path = req.file ? req.file.path : null;

  // All fields required except citation, pdf_path is required if file upload is enforced
  if (
    !faculty_id ||
    !paper_type ||
    !title_of_paper ||
    !area_of_research ||
    !published_year ||
    !authors ||
    !name_of_publication ||
    !ISSN_number ||
    !Link ||
    !UGC ||
    !pdf_path
  ) {
    userActionLogger.warn(
      `Attempt to add research paper with missing fields by faculty_id: ${faculty_id || "unknown"}`
    );
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Ensure faculty exists
    const [facultyRows] = await promisePool.query(
      "SELECT 1 FROM faculty_details WHERE faculty_id = ?",
      [faculty_id]
    );
    if (facultyRows.length === 0) {
      userActionLogger.warn(`Faculty ID ${faculty_id} does not exist`);
      return res
        .status(400)
        .json({
          message: "Faculty ID does not exist in faculty_details table",
        });
    }

    // 2. Get or insert paper_type
    let [typeRows] = await promisePool.query(
      "SELECT type_id FROM research_paper_type WHERE type_name = ?",
      [paper_type]
    );
    let paperTypeId;
    if (typeRows.length > 0) {
      paperTypeId = typeRows[0].type_id;
    } else {
      const [insertType] = await promisePool.query(
        "INSERT INTO research_paper_type (type_name) VALUES (?)",
        [paper_type]
      );
      paperTypeId = insertType.insertId;
    }

    // 3. Get or insert area_of_research
    let [areaRows] = await promisePool.query(
      "SELECT id FROM research_areas WHERE area_of_research = ?",
      [area_of_research]
    );
    let researchAreaId;
    if (areaRows.length > 0) {
      researchAreaId = areaRows[0].id;
    } else {
      const [insertArea] = await promisePool.query(
        "INSERT INTO research_areas (area_of_research) VALUES (?)",
        [area_of_research]
      );
      researchAreaId = insertArea.insertId;
    }

    // 4. Insert research paper
    const [result] = await promisePool.query(
      `INSERT INTO faculty_research_paper
      (faculty_id, paper_type, title_of_paper, area_of_research, published_year, pdf_path, citation, authors, name_of_publication, ISSN_number, Link, UGC)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        faculty_id,
        paperTypeId,
        title_of_paper,
        researchAreaId,
        published_year,
        pdf_path,
        citation || null,
        authors,
        name_of_publication,
        ISSN_number,
        Link,
        UGC,
      ]
    );
    userActionLogger.info(
      `Added research paper ID: ${result.insertId} by faculty_id: ${faculty_id}`
    );
    res
      .status(201)
      .json({
        message: "Research paper added successfully",
        insertId: result.insertId,
      });
  } catch (err) {
    if (pdf_path && fs.existsSync(pdf_path)) fs.unlinkSync(pdf_path);
    errorLogger.error(`Error adding research paper: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error adding research paper", error: err.message });
  }
};

export const updateResearchPaper = async (req, res) => {
  const faculty_id = req.query.faculty_id;
  if (!faculty_id) {
    userActionLogger.warn(
      "Attempt to update research paper without faculty_id"
    );
    return res.status(400).json({ message: "faculty_id is required" });
  }
  const { research_id } = req.params;
  const {
    paper_type,
    title_of_paper,
    area_of_research,
    published_year,
    citation,
    authors,
    name_of_publication,
    ISSN_number,
    Link,
    UGC,
  } = req.body;
  const pdf_path = req.file ? req.file.path : null;

  // All fields required except citation, pdf_path optional
  if (
    !paper_type ||
    !title_of_paper ||
    !area_of_research ||
    !published_year ||
    !authors ||
    !name_of_publication ||
    !ISSN_number ||
    !Link ||
    !UGC
  ) {
    userActionLogger.warn(
      `Attempt to update research paper ${research_id} with missing fields`
    );
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Get old pdf_path for possible deletion
    const [oldRows] = await promisePool.query(
      "SELECT pdf_path FROM faculty_research_paper WHERE research_id = ?",
      [research_id]
    );
    if (oldRows.length === 0) {
      userActionLogger.warn(
        `No research paper found with research_id: ${research_id} for update`
      );
      return res.status(404).json({ message: "Research paper not found" });
    }
    const oldPdfPath = oldRows[0].pdf_path;

    // 2. Get or insert paper_type
    let [typeRows] = await promisePool.query(
      "SELECT type_id FROM research_paper_type WHERE type_name = ?",
      [paper_type]
    );
    let paperTypeId;
    if (typeRows.length > 0) {
      paperTypeId = typeRows[0].type_id;
    } else {
      const [insertType] = await promisePool.query(
        "INSERT INTO research_paper_type (type_name) VALUES (?)",
        [paper_type]
      );
      paperTypeId = insertType.insertId;
    }

    // 3. Get or insert area_of_research
    let [areaRows] = await promisePool.query(
      "SELECT id FROM research_areas WHERE area_of_research = ?",
      [area_of_research]
    );
    let researchAreaId;
    if (areaRows.length > 0) {
      researchAreaId = areaRows[0].id;
    } else {
      const [insertArea] = await promisePool.query(
        "INSERT INTO research_areas (area_of_research) VALUES (?)",
        [area_of_research]
      );
      researchAreaId = insertArea.insertId;
    }

    // 4. Update research paper
    const [result] = await promisePool.query(
      `UPDATE faculty_research_paper
      SET paper_type = ?, title_of_paper = ?, area_of_research = ?, published_year = ?, citation = ?, authors = ?, name_of_publication = ?, ISSN_number = ?, Link = ?, UGC = ?, pdf_path = COALESCE(?, pdf_path)
      WHERE research_id = ?`,
      [
        paperTypeId,
        title_of_paper,
        researchAreaId,
        published_year,
        citation || null,
        authors,
        name_of_publication,
        ISSN_number,
        Link,
        UGC,
        pdf_path,
        research_id,
      ]
    );
    if (result.affectedRows === 0) {
      userActionLogger.warn(
        `No research paper found with research_id: ${research_id} for update`
      );
      return res
        .status(404)
        .json({
          message: "No research paper found with the given research_id",
        });
    }

    // Delete old PDF if new uploaded
    if (pdf_path && oldPdfPath && fs.existsSync(oldPdfPath)) {
      fs.unlinkSync(oldPdfPath);
    }

    userActionLogger.info(`Updated research paper ID: ${research_id}`);
    res.status(200).json({ message: "Research paper updated successfully" });
  } catch (err) {
    if (pdf_path && fs.existsSync(pdf_path)) fs.unlinkSync(pdf_path);
    errorLogger.error(
      `Error updating research paper ${research_id}: ${err.message}`
    );
    res
      .status(500)
      .json({ message: "Error updating research paper", error: err.message });
  }
};

export const deleteResearchPaper = async (req, res) => {
  const faculty_id = req.query.faculty_id;
  if (!faculty_id) {
    userActionLogger.warn(
      "Attempt to delete research paper without faculty_id"
    );
    return res.status(400).json({ message: "faculty_id is required" });
  }
  const { research_id } = req.params;

  try {
    const [rows] = await promisePool.query(
      "SELECT pdf_path FROM faculty_research_paper WHERE research_id = ?",
      [research_id]
    );
    if (rows.length === 0) {
      userActionLogger.warn(
        `No research paper found with research_id: ${research_id} for deletion`
      );
      return res
        .status(404)
        .json({
          message: "No research paper found with the given research_id",
        });
    }
    const pdfPath = rows[0].pdf_path;

    const [result] = await promisePool.query(
      "DELETE FROM faculty_research_paper WHERE research_id = ?",
      [research_id]
    );
    if (result.affectedRows === 0) {
      userActionLogger.warn(
        `Failed to delete research paper with research_id: ${research_id}`
      );
      return res
        .status(404)
        .json({
          message: "Failed to delete the research paper from the database",
        });
    }

    // Delete associated PDF file if it exists
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
        userActionLogger.info(
          `Deleted PDF file for research paper ID: ${research_id}`
        );
      } catch (unlinkErr) {
        errorLogger.error(
          `Error deleting PDF file for research paper ${research_id}: ${unlinkErr.message}`
        );
        return res
          .status(500)
          .json({
            message: "Error deleting the PDF file",
            error: unlinkErr.message,
          });
      }
    }

    userActionLogger.info(`Deleted research paper ID: ${research_id}`);
    res.status(200).json({ message: "Research paper deleted successfully" });
  } catch (err) {
    errorLogger.error(
      `Error deleting research paper ${research_id}: ${err.message}`
    );
    res
      .status(500)
      .json({ message: "Error deleting research paper", error: err.message });
  }
};

// Get FDP Records
export const getFDPRecords = async (req, res) => {
  const { faculty_id } = req.query;

  try {
    let query = `
      SELECT *, 
      DATEDIFF(end_date, start_date) + 1 AS days_contributed,
      organizing_institute,
      document
      FROM faculty_FDP
    `;
    let params = [];

    if (faculty_id) {
      query += " WHERE faculty_id = ?";
      params.push(faculty_id);
    }

    const [results] = await promisePool.query(query, params);

    userActionLogger.info(`Fetched ${results.length} FDP records`);
    res.status(200).json({
      message: "FDP details fetched successfully",
      data: results,
    });
  } catch (err) {
    errorLogger.error(`Error fetching FDP details: ${err.message}`);
    res.status(500).json({
      message: "Error fetching FDP details",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const addFDPRecord = async (req, res) => {
  // Get faculty_id from query first, then body (for backward compatibility)
  const faculty_id = req.query.faculty_id || req.body.faculty_id;
  const { FDP_name, FDP_progress, start_date, end_date, organizing_institute } =
    req.body;

  // Validate required fields
  if (!faculty_id || !FDP_name || !FDP_progress || !start_date || !end_date) {
    return res.status(400).json({ message: "All required fields are missing" });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res
      .status(400)
      .json({ message: "Start date cannot be after end date" });
  }

  try {
    const [result] = await promisePool.query(
      `INSERT INTO faculty_FDP 
       (faculty_id, FDP_name, FDP_progress, start_date, end_date, organizing_institute, document)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        faculty_id,
        FDP_name,
        FDP_progress,
        start_date,
        end_date,
        organizing_institute || null,
        req.file ? req.file.path : null,
      ]
    );

    userActionLogger.info(`Added new FDP record ID: ${result.insertId}`);
    res.status(201).json({
      message: "FDP record added successfully",
      data: { id: result.insertId },
    });
  } catch (err) {
    // Clean up uploaded file if insertion failed
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr)
          errorLogger.error(`Error cleaning up file: ${unlinkErr.message}`);
      });
    }

    errorLogger.error(`Error adding FDP record: ${err.message}`);
    res.status(500).json({ message: "Error adding FDP record" });
  }
};

export const updateFDPRecord = async (req, res) => {
  const { FDP_id } = req.params;
  // Get faculty_id from query first, then body (for backward compatibility)
  const faculty_id = req.query.faculty_id || req.body.faculty_id;
  const { FDP_name, FDP_progress, start_date, end_date, organizing_institute } =
    req.body;

  try {
    // Get existing document path first
    const [existingRecord] = await promisePool.query(
      "SELECT document FROM faculty_FDP WHERE FDP_id = ?",
      [FDP_id]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ message: "No FDP record found" });
    }

    const oldDocumentPath = existingRecord[0].document;

    // Update record
    const [result] = await promisePool.query(
      `UPDATE faculty_FDP 
       SET faculty_id = ?, FDP_name = ?, FDP_progress = ?, 
           start_date = ?, end_date = ?, organizing_institute = ?,
           document = IFNULL(?, document)
       WHERE FDP_id = ?`,
      [
        faculty_id,
        FDP_name,
        FDP_progress,
        start_date,
        end_date,
        organizing_institute || null,
        req.file ? req.file.path : null,
        FDP_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No FDP record found" });
    }

    // Delete old file if new file was uploaded
    if (req.file && oldDocumentPath) {
      fs.unlink(oldDocumentPath, (err) => {
        if (err)
          errorLogger.error(`Error deleting old document: ${err.message}`);
      });
    }

    userActionLogger.info(`Updated FDP record ID: ${FDP_id}`);
    res.status(200).json({ message: "FDP record updated successfully" });
  } catch (err) {
    // Clean up new file if update failed
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr)
          errorLogger.error(`Error cleaning up file: ${unlinkErr.message}`);
      });
    }

    errorLogger.error(`Error updating FDP record ${FDP_id}: ${err.message}`);
    res.status(500).json({ message: "Error updating FDP record" });
  }
};

// Delete FDP Record
export const deleteFDPRecord = async (req, res) => {
  const { faculty_id } = req.query;
  const { FDP_id } = req.params;

  try {
    // Get document path first
    const [existingRecord] = await promisePool.query(
      "SELECT document FROM faculty_FDP WHERE FDP_id = ?",
      [FDP_id]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ message: "No FDP record found" });
    }

    const [result] = await promisePool.query(
      "DELETE FROM faculty_FDP WHERE FDP_id = ?",
      [FDP_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No FDP record found" });
    }

    // Delete associated document file if exists
    if (existingRecord[0].document) {
      fs.unlink(existingRecord[0].document, (err) => {
        if (err) errorLogger.error(`Error deleting document: ${err.message}`);
      });
    }

    userActionLogger.info(`Deleted FDP record ID: ${FDP_id}`);
    res.status(200).json({ message: "FDP record deleted successfully" });
  } catch (err) {
    errorLogger.error(`Error deleting FDP record ${FDP_id}: ${err.message}`);
    res.status(500).json({ message: "Error deleting FDP record" });
  }
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
      return res
        .status(500)
        .json({ message: "Error fetching faculty interactions", error: err });
    }

    results.forEach((record) => {
      record.month_of_visit = getMonthName(record.month_of_visit);
    });

    res.status(200).json({
      message: "Faculty interactions retrieved successfully",
      data: results,
    });
  });
};

// Add Faculty Interaction with Document Upload
export const addFacultyInteraction = (req, res) => {
  const {
    faculty_id,
    interaction_type,
    institution,
    description,
    year_of_visit,
    month_of_visit,
    duration_in_days,
  } = req.body;

  if (
    !faculty_id ||
    !interaction_type ||
    !institution ||
    !description ||
    !year_of_visit ||
    !month_of_visit
  ) {
    return res
      .status(400)
      .json({ message: "All fields except duration_in_days are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Document file is required" });
  }

  const document = req.file.path; // Save document path
  const monthNumber = getMonthNumber(month_of_visit);

  if (!monthNumber) {
    return res.status(400).json({ message: "Invalid month name" });
  }
  
  const checkQuery = `SELECT interaction_id FROM faculty_interaction_types WHERE interaction_type = ?`;

  pool.query(checkQuery, [interaction_type], (err, result) => {
    if (err) {
      console.error("Error checking interaction type:", err);
      return res
        .status(500)
        .json({ message: "Error checking interaction type", error: err });
    }

    if (result.length > 0) {
      insertFacultyInteraction(result[0].interaction_id);
    } else {
      const insertTypeQuery = `INSERT INTO faculty_interaction_types (interaction_type) VALUES (?)`;

      pool.query(insertTypeQuery, [interaction_type], (err, insertResult) => {
        if (err) {
          console.error("Error inserting new interaction type:", err);
          return res
            .status(500)
            .json({ message: "Error inserting interaction type", error: err });
        }

        insertFacultyInteraction(insertResult.insertId);
      });
    }
  });

  function insertFacultyInteraction(interaction_id) {
    const query = `
        INSERT INTO faculty_interaction (faculty_id, interaction_id, institution, description, year_of_visit, month_of_visit, duration_in_days, document)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      faculty_id,
      interaction_id,
      institution,
      description,
      year_of_visit,
      monthNumber,
      duration_in_days || null,
      document,
    ];

    pool.query(query, params, (err, result) => {
      if (err) {
        console.error("Error adding faculty interaction:", err);
        return res
          .status(500)
          .json({ message: "Error adding faculty interaction", error: err });
      }

      res.status(201).json({
        message: "Faculty interaction added successfully",
        data: { id: result.insertId, documentPath: document },
      });
    });
  }
};

// Update Faculty Interaction with Document Upload
export const updateFacultyInteraction = (req, res) => {
  const { interact_id } = req.params;
  const {
    interaction_type,
    institution,
    description,
    year_of_visit,
    month_of_visit,
    duration_in_days,
  } = req.body;

  if (
    !interact_id ||
    !interaction_type ||
    !institution ||
    !description ||
    !year_of_visit ||
    !month_of_visit
  ) {
    return res
      .status(400)
      .json({ message: "All fields except duration_in_days are required" });
  }

  const monthNumber = getMonthNumber(month_of_visit);
  if (!monthNumber) {
    return res.status(400).json({ message: "Invalid month name" });
  }

  // Fetch existing document path
  pool.query(
    `SELECT document FROM faculty_interaction WHERE interact_id=?`,
    [interact_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching faculty interaction:", err);
        return res
          .status(500)
          .json({ message: "Error fetching faculty interaction", error: err });
      }
      if (results.length === 0)
        return res
          .status(404)
          .json({ message: "Faculty interaction not found" });

      const oldFilePath = results[0].document;
      const newFilePath = req.file ? req.file.path : oldFilePath;

      // Delete old document if a new one is uploaded
      if (req.file && oldFilePath) {
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Error deleting old file:", err);
        });
      }

      const checkQuery = `SELECT interaction_id FROM faculty_interaction_types WHERE interaction_type = ?`;

      pool.query(checkQuery, [interaction_type], (err, result) => {
        if (err) {
          console.error("Error checking interaction type:", err);
          return res
            .status(500)
            .json({ message: "Error checking interaction type", error: err });
        }

        if (result.length > 0) {
          updateInteraction(result[0].interaction_id);
        } else {
          const insertTypeQuery = `INSERT INTO faculty_interaction_types (interaction_type) VALUES (?)`;

          pool.query(
            insertTypeQuery,
            [interaction_type],
            (err, insertResult) => {
              if (err) {
                console.error("Error inserting new interaction type:", err);
                return res.status(500).json({
                  message: "Error inserting interaction type",
                  error: err,
                });
              }

              updateInteraction(insertResult.insertId);
            }
          );
        }
      });

      function updateInteraction(interaction_id) {
        const query = `
          UPDATE faculty_interaction
          SET interaction_id = ?, institution = ?, description = ?, year_of_visit = ?, month_of_visit = ?, duration_in_days = ?, document = ?
          WHERE interact_id = ?
      `;
        const params = [
          interaction_id,
          institution,
          description,
          year_of_visit,
          monthNumber,
          duration_in_days || null,
          newFilePath,
          interact_id,
        ];

        pool.query(query, params, (err, result) => {
          if (err) {
            console.error("Error updating faculty interaction:", err);
            return res.status(500).json({
              message: "Error updating faculty interaction",
              error: err,
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message:
                "No faculty interaction found with the given interact_id",
            });
          }

          res.status(200).json({
            message: "Faculty interaction updated successfully",
            documentPath: newFilePath,
          });
        });
      }
    }
  );
};

// Delete Faculty Interaction with Document Deletion
export const deleteFacultyInteraction = (req, res) => {
  const { interact_id } = req.params;

  pool.query(
    `SELECT document FROM faculty_interaction WHERE interact_id=?`,
    [interact_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching document path:", err);
        return res
          .status(500)
          .json({ message: "Error fetching faculty interaction", error: err });
      }
      if (results.length === 0)
        return res
          .status(404)
          .json({ message: "Faculty interaction not found" });

      const filePath = results[0].document;

      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Error deleting file:", err);
        });
      }

      pool.query(
        `DELETE FROM faculty_interaction WHERE interact_id = ?`,
        [interact_id],
        (err, result) => {
          if (err)
            return res.status(500).json({
              message: "Error deleting faculty interaction",
              error: err,
            });

          res
            .status(200)
            .json({ message: "Faculty interaction deleted successfully" });
        }
      );
    }
  );
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

    res.status(200).json({
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
      return res.status(404).json({
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
      return res.status(404).json({
        message: "No interaction type found with the given interaction_id",
      });
    }

    res.status(200).json({ message: "Interaction type deleted successfully" });
  });
};

// Get all Book records or filter by faculty_id
export const getBookRecords = async (req, res) => {
  const { faculty_id } = req.query;
  try {
    const [results] = faculty_id
      ? await promisePool.query(
          "SELECT * FROM faculty_Book_records WHERE faculty_id = ?",
          [faculty_id]
        )
      : await promisePool.query("SELECT * FROM faculty_Book_records");
    userActionLogger.info(
      `Fetched book records${faculty_id ? ` for faculty_id: ${faculty_id}` : ""}`
    );
    res.status(200).json(results);
  } catch (err) {
    errorLogger.error(`Error fetching book records: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error fetching book records", error: err.message });
  }
};

// Add a new Book record (all fields required)
export const addBookRecord = async (req, res) => {
  const { faculty_id } = req.query;
  if (!faculty_id) {
    userActionLogger.warn(`Attempt to add book record with missing faculty_id`);
  }
  const {
    ISBN,
    book_chapter,
    chapter_title,
    affiliated,
    link_doi,
    book_title,
    publication_name,
    published_date,
  } = req.body;

  // Check all fields are present
  if (
    !ISBN ||
    !faculty_id ||
    !book_chapter ||
    !affiliated ||
    !link_doi ||
    !book_title ||
    !publication_name ||
    !published_date
  ) {
    userActionLogger.warn(
      `Attempt to add book record with missing fields by faculty_id: ${faculty_id || "unknown"}`
    );
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await promisePool.query(
      `INSERT INTO faculty_Book_records
      (ISBN, faculty_id, book_chapter, chapter_title, affiliated, link_doi, book_title, publication_name, published_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ISBN,
        faculty_id,
        book_chapter,
        chapter_title || null,
        affiliated,
        link_doi,
        book_title,
        publication_name,
        published_date,
      ]
    );
    userActionLogger.info(
      `Added new book record ID: ${result.insertId} by faculty_id: ${faculty_id}`
    );
    res.status(201).json({
      message: "Book record added successfully",
      insertId: result.insertId,
    });
  } catch (err) {
    errorLogger.error(`Error adding book record: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error adding book record", error: err.message });
  }
};

// Update an existing Book record (all fields required)
export const updateBookRecord = async (req, res) => {
  const faculty_id = req.query.faculty_id || req.body.faculty_id;
  if (!faculty_id) {
    userActionLogger.warn(`Attempt to add book record with missing faculty_id`);
  }
  const { Book_id } = req.params;
  const {
    ISBN,
    book_chapter,
    chapter_title,
    affiliated,
    link_doi,
    book_title,
    publication_name,
    published_date,
  } = req.body;

  // Check all fields are present
  if (
    !ISBN ||
    !faculty_id ||
    !book_chapter ||
    !affiliated ||
    !link_doi ||
    !book_title ||
    !publication_name ||
    !published_date
  ) {
    userActionLogger.warn(
      `Attempt to update book record ${Book_id} with missing fields`
    );
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await promisePool.query(
      `UPDATE faculty_Book_records
      SET ISBN = ?, faculty_id = ?, book_chapter = ?, chapter_title = ?, affiliated = ?, link_doi = ?, book_title = ?, publication_name = ?, published_date = ?
      WHERE Book_id = ?`,
      [
        ISBN,
        faculty_id,
        book_chapter,
        chapter_title || null,
        affiliated,
        link_doi,
        book_title,
        publication_name,
        published_date,
        Book_id,
      ]
    );
    if (result.affectedRows === 0) {
      userActionLogger.warn(
        `No book record found with Book_id: ${Book_id} for update`
      );
      return res
        .status(404)
        .json({ message: "No book record found with the given Book_id" });
    }
    userActionLogger.info(`Updated book record ID: ${Book_id}`);
    res.status(200).json({ message: "Book record updated successfully" });
  } catch (err) {
    errorLogger.error(`Error updating book record ${Book_id}: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error updating book record", error: err.message });
  }
};

// Delete a Book record using Book_id (route param) and faculty_id (query param)
export const deleteBookRecord = async (req, res) => {
  const { Book_id } = req.params;
  const { faculty_id } = req.query;

  if (!Book_id || !faculty_id) {
    userActionLogger.warn(
      `Attempt to delete book record with missing Book_id or faculty_id`
    );
    return res
      .status(400)
      .json({
        message: "Both Book_id (route) and faculty_id (query) are required",
      });
  }

  try {
    const [result] = await promisePool.query(
      "DELETE FROM faculty_Book_records WHERE Book_id = ? AND faculty_id = ?",
      [Book_id, faculty_id]
    );
    if (result.affectedRows === 0) {
      userActionLogger.warn(
        `No book record found with Book_id: ${Book_id} and faculty_id: ${faculty_id} for deletion`
      );
      return res
        .status(404)
        .json({
          message: "No book record found with the given Book_id and faculty_id",
        });
    }
    userActionLogger.info(
      `Deleted book record ID: ${Book_id} (faculty_id: ${faculty_id})`
    );
    res.status(200).json({ message: "Book record deleted successfully" });
  } catch (err) {
    errorLogger.error(`Error deleting book record ${Book_id}: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error deleting book record", error: err.message });
  }
};

// 1️⃣ Get faculty guidance records
export const getFacultyGuidanceRecords = (req, res) => {
  const { faculty_id } = req.query;

  let query = `SELECT * FROM faculty_guidance`;
  const params = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching faculty guidance records:", err);
      return res.status(500).json({
        message: "Error fetching faculty guidance records",
        error: err,
      });
    }

    const updatedResults = results.map((record) => ({
      ...record,
      passing_month: record.passing_month
        ? getMonthName(record.passing_month)
        : null,
    }));

    res.status(200).json({
      message: "Faculty guidance records retrieved successfully",
      data: updatedResults,
    });
  });
};

// 3️⃣ Add a new faculty guidance record (with file upload)
export const addFacultyGuidanceRecord = (req, res) => {
  let {
    faculty_id,
    degree,
    mentee_name,
    mentee_rn,
    passing_year,
    passing_month,
  } = req.body;

  if (
    !faculty_id ||
    !degree ||
    !mentee_name ||
    !mentee_rn ||
    !passing_year ||
    !passing_month
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  const document = req.file ? req.file.path : null;

  const query = `
    INSERT INTO faculty_guidance (faculty_id, degree, mentee_name, mentee_rn, passing_year, passing_month, document)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [
      faculty_id,
      degree,
      mentee_name,
      mentee_rn,
      passing_year,
      passing_month,
      document,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error adding faculty guidance record",
          error: err,
        });
      }
      res.status(201).json({
        message: "Faculty guidance record added successfully",
        recordId: result.insertId,
        document: document,
      });
    }
  );
};

// 4️⃣ Update an existing faculty guidance record (with file update)
export const updateFacultyGuidanceRecord = (req, res) => {
  const { Guidance_id } = req.params;
  let { degree, mentee_name, mentee_rn, passing_year, passing_month } =
    req.body;

  if (!Guidance_id) {
    return res.status(400).json({ message: "Guidance_id is required" });
  }

  if (isNaN(passing_month)) {
    passing_month = getMonthNumber(passing_month);
  }

  if (passing_month === "Invalid month") {
    return res.status(400).json({ message: "Invalid passing month" });
  }

  pool.query(
    `SELECT document FROM faculty_guidance WHERE Guidance_id = ?`,
    [Guidance_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching record", error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Faculty guidance record not found" });
      }

      const oldFilePath = results[0].document;
      const newFilePath = req.file ? req.file.path : oldFilePath;

      if (req.file && oldFilePath) {
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Error deleting old file:", err);
        });
      }

      const query = `
        UPDATE faculty_guidance
        SET degree = ?, mentee_name = ?, mentee_rn = ?, passing_year = ?, passing_month = ?, document = ?
        WHERE Guidance_id = ?
      `;

      pool.query(
        query,
        [
          degree,
          mentee_name,
          mentee_rn,
          passing_year,
          passing_month,
          newFilePath,
          Guidance_id,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Error updating faculty guidance record",
              error: err,
            });
          }
          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "Faculty guidance record not found" });
          }
          res.status(200).json({
            message: "Faculty guidance record updated successfully",
            documentPath: newFilePath,
          });
        }
      );
    }
  );
};

// 5️⃣ Delete a faculty guidance record (also delete proof file)
export const deleteFacultyGuidanceRecord = (req, res) => {
  const { Guidance_id } = req.params;

  pool.query(
    `SELECT document FROM faculty_guidance WHERE Guidance_id = ?`,
    [Guidance_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching document path", error: err });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Faculty guidance record not found" });
      }

      const filePath = results[0].document;

      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Error deleting file:", err);
        });
      }

      pool.query(
        `DELETE FROM faculty_guidance WHERE Guidance_id = ?`,
        [Guidance_id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({
                message: "Error deleting faculty guidance record",
                error: err,
              });
          }
          res
            .status(200)
            .json({ message: "Faculty guidance record deleted successfully" });
        }
      );
    }
  );
};

export const getSponsoredResearch = (req, res) => {
  const { faculty_id } = req.query;

  let query = "SELECT * FROM faculty_sponsored_research";
  let queryParams = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    queryParams.push(faculty_id);
  }

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching sponsored research",
        error: err,
      });
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
    start_date,
    end_date,
    status,
  } = req.body;

  const document = req.file ? req.file.path : null; // Get uploaded file path

  if (
    !faculty_id ||
    !project_title ||
    !start_date ||
    !funding_agency ||
    !amount_sponsored ||
    !document ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields except end_date are required",
    });
  }

  const query = `
    INSERT INTO faculty_sponsored_research 
    (faculty_id, project_title, funding_agency, amount_sponsored, start_date, end_date, status, document)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    start_date,
    end_date || null, // Allow null end_date for ongoing projects
    status,
    document,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error adding sponsored research",
        error: err,
      });
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
    start_date,
    end_date,
    status,
  } = req.body;

  const document = req.file ? req.file.path : null; // Get new uploaded file path

  if (
    !faculty_id ||
    !project_title ||
    !start_date ||
    !funding_agency ||
    !amount_sponsored ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields except end_date are required",
    });
  }

  // 1️⃣ Get the old document path before updating
  const getOldDocumentQuery = `SELECT document FROM faculty_sponsored_research WHERE sponsorship_id = ?`;

  pool.query(getOldDocumentQuery, [sponsorship_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching old document", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }

    const oldDocumentPath = results[0].document; // Store old file path

    // 2️⃣ Build the update query
    let updateQuery = `
      UPDATE faculty_sponsored_research
      SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, start_date = ?, end_date = ?, status = ?
    `;
    let queryParams = [
      faculty_id,
      project_title,
      funding_agency,
      amount_sponsored,
      start_date,
      end_date || null, // Allow null end_date for ongoing projects
      status,
    ];

    if (document) {
      updateQuery += ", document = ?";
      queryParams.push(document);
    }

    updateQuery += " WHERE sponsorship_id = ?";
    queryParams.push(sponsorship_id);

    // 3️⃣ Update the record in the database
    pool.query(updateQuery, queryParams, (updateErr, result) => {
      if (updateErr) {
        return res
          .status(500)
          .json({
            message: "Error updating sponsored research",
            error: updateErr,
          });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sponsored research not found" });
      }

      // 4️⃣ Delete old document if a new file was uploaded
      if (document && oldDocumentPath) {
        fs.unlink(oldDocumentPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting old document:", unlinkErr);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Sponsored research updated successfully" });
    });
  });
};

export const deleteSponsoredResearch = (req, res) => {
  const { sponsorship_id } = req.params;

  // 1️⃣ Fetch the document path before deleting the record
  const getDocumentQuery = `SELECT document FROM faculty_sponsored_research WHERE sponsorship_id = ?`;

  pool.query(getDocumentQuery, [sponsorship_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching document path", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Sponsored research not found" });
    }

    const documentPath = results[0].document; // Store document file path

    // 2️⃣ Delete the record from the database
    const deleteQuery = `DELETE FROM faculty_sponsored_research WHERE sponsorship_id = ?`;
    pool.query(deleteQuery, [sponsorship_id], (deleteErr, result) => {
      if (deleteErr) {
        return res
          .status(500)
          .json({
            message: "Error deleting sponsored research",
            error: deleteErr,
          });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sponsored research not found" });
      }

      // 3️⃣ Delete the associated file from storage
      if (documentPath) {
        fs.unlink(documentPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("⚠️ Error deleting file:", unlinkErr);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Sponsored research deleted successfully" });
    });
  });
};

// Get consultancy records by faculty_id
export const getConsultancyByFaculty = (req, res) => {
  const { faculty_id } = req.query;

  let query = "SELECT * FROM faculty_consultancy";
  let queryParams = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    queryParams.push(faculty_id);
  }

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching Consultancy records",
        error: err,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: faculty_id
          ? "No consultancy records found for this faculty"
          : "No consultancy records found",
      });
    }
    res.status(200).json(result);
  });
};

export const addConsultancy = (req, res) => {
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    start_date,
    end_date,
    status,
  } = req.body;

  const document = req.file ? req.file.path : null; // Get uploaded file path

  if (
    !faculty_id ||
    !project_title ||
    !start_date ||
    !funding_agency ||
    !amount_sponsored ||
    !document ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields except end_date are required",
    });
  }

  const query = `
    INSERT INTO faculty_consultancy
    (faculty_id, project_title, funding_agency, amount_sponsored, start_date, end_date, status, document)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    start_date,
    end_date || null, // Allow null end_date for ongoing projects
    status,
    document,
  ];

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error adding Consultancy record",
        error: err,
      });
    }
    res.status(201).json({
      message: "Consultancy Record added successfully",
      consultancy_id: result.insertId,
    });
  });
};

export const updateConsultancy = (req, res) => {
  const { consultancy_id } = req.params;
  const {
    faculty_id,
    project_title,
    funding_agency,
    amount_sponsored,
    start_date,
    end_date,
    status,
  } = req.body;

  const document = req.file ? req.file.path : null; // Get new uploaded file path

  if (
    !faculty_id ||
    !project_title ||
    !start_date ||
    !funding_agency ||
    !amount_sponsored ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields except end_date are required",
    });
  }

  // 1️⃣ Get the old document path before updating
  const getOldDocumentQuery = `SELECT document FROM faculty_consultancy WHERE consultancy_id = ?`;

  pool.query(getOldDocumentQuery, [consultancy_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching old document", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }

    const oldDocumentPath = results[0].document; // Store old file path

    // 2️⃣ Build the update query
    let updateQuery = `
      UPDATE faculty_consultancy
      SET faculty_id = ?, project_title = ?, funding_agency = ?, amount_sponsored = ?, start_date = ?, end_date = ?, status = ?
    `;
    let queryParams = [
      faculty_id,
      project_title,
      funding_agency,
      amount_sponsored,
      start_date,
      end_date || null, // Allow null end_date for ongoing projects
      status,
    ];

    if (document) {
      updateQuery += ", document = ?";
      queryParams.push(document);
    }

    updateQuery += " WHERE consultancy_id = ?";
    queryParams.push(consultancy_id);

    // 3️⃣ Update the record in the database
    pool.query(updateQuery, queryParams, (updateErr, result) => {
      if (updateErr) {
        return res
          .status(500)
          .json({
            message: "Error updating consultancy record",
            error: updateErr,
          });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Consultancy record not found" });
      }

      // 4️⃣ Delete old document if a new file was uploaded
      if (document && oldDocumentPath) {
        fs.unlink(oldDocumentPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting old document:", unlinkErr);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Consultancy record updated successfully" });
    });
  });
};

export const deleteConsultancy = (req, res) => {
  const { consultancy_id } = req.params;

  // 1️⃣ Fetch the document path before deleting the record
  const getDocumentQuery = `SELECT document FROM faculty_consultancy WHERE consultancy_id = ?`;

  pool.query(getDocumentQuery, [consultancy_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching document path", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Consultancy record not found" });
    }

    const documentPath = results[0].document; // Store document file path

    // 2️⃣ Delete the record from the database
    const deleteQuery = `DELETE FROM faculty_consultancy WHERE consultancy_id = ?`;
    pool.query(deleteQuery, [consultancy_id], (deleteErr, result) => {
      if (deleteErr) {
        return res
          .status(500)
          .json({
            message: "Error deleting consultancy record",
            error: deleteErr,
          });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Consultancy record not found" });
      }

      // 3️⃣ Delete the associated file from storage
      if (documentPath) {
        fs.unlink(documentPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("⚠️ Error deleting file:", unlinkErr);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Consultancy record deleted successfully" });
    });
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

export const addSpecialization = (req, res) => {
  const { faculty_id, specialization_name } = req.body; // specialization comes as a string

  if (!faculty_id || !specialization_name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Step 1: Check if faculty_id exists
  pool.query(
    "SELECT * FROM faculty_details WHERE faculty_id = ?",
    [faculty_id],
    (err, facultyResults) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error checking faculty", error: err });
      if (facultyResults.length === 0)
        return res.status(400).json({ message: "Invalid faculty_id" });

      // Step 2: Check if specialization already exists
      pool.query(
        "SELECT id FROM specialization_areas WHERE specialization_name = ?",
        [specialization_name],
        (err, specializationResults) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error checking specialization", error: err });

          if (specializationResults.length > 0) {
            // Specialization exists, insert into faculty_specialization
            insertFacultySpecialization(specializationResults[0].id);
          } else {
            // Specialization does not exist, insert into specialization_areas first
            pool.query(
              "INSERT INTO specialization_areas (specialization_name) VALUES (?)",
              [specialization_name],
              (err, insertResult) => {
                if (err)
                  return res
                    .status(500)
                    .json({
                      message: "Error inserting specialization",
                      error: err,
                    });

                insertFacultySpecialization(insertResult.insertId);
              }
            );
          }
        }
      );
    }
  );

  // Step 3: Insert into faculty_specialization
  function insertFacultySpecialization(specializationId) {
    pool.query(
      "INSERT INTO faculty_specialization (faculty_id, specialization) VALUES (?, ?)",
      [faculty_id, specializationId],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({
              message: "Error adding faculty specialization",
              error: err,
            });

        res
          .status(201)
          .json({
            message: "Faculty specialization added successfully",
            data: result,
          });
      }
    );
  }
};

export const getSpecializations = (req, res) => {
  const { faculty_id } = req.query; // Use query parameters

  let query = `
    SELECT fs.specialization_id, fs.faculty_id, sa.specialization_name 
    FROM faculty_specialization fs
    LEFT JOIN specialization_areas sa ON fs.specialization = sa.id`;

  const queryParams = [];

  if (faculty_id) {
    query += " WHERE fs.faculty_id = ?";
    queryParams.push(faculty_id);
  }

  pool.query(query, queryParams, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error fetching specializations", error: err });

    if (results.length === 0) {
      return res.status(404).json({
        message: faculty_id
          ? "No specializations found for this faculty."
          : "No specializations found.",
      });
    }

    res.status(200).json(results);
  });
};

export const updateSpecialization = (req, res) => {
  const { specialization_id } = req.params;
  const { specialization_name } = req.body; // Comes as a string

  // Step 1: Check if the new specialization exists
  pool.query(
    "SELECT id FROM specialization_areas WHERE specialization_name = ?",
    [specialization_name],
    (err, specializationResults) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error checking specialization", error: err });

      if (specializationResults.length > 0) {
        // Specialization exists, update faculty_specialization
        updateSpecialization(specializationResults[0].id);
      } else {
        // Insert new specialization
        pool.query(
          "INSERT INTO specialization_areas (specialization_name) VALUES (?)",
          [specialization_name],
          (err, insertResult) => {
            if (err)
              return res
                .status(500)
                .json({
                  message: "Error inserting specialization",
                  error: err,
                });

            updateSpecialization(insertResult.insertId);
          }
        );
      }
    }
  );

  // Step 2: Update faculty_specialization with new specialization_id
  function updateSpecialization(specializationId) {
    pool.query(
      "UPDATE faculty_specialization SET specialization = ? WHERE specialization_id = ?",
      [specializationId, specialization_id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({
              message: "Error updating faculty specialization",
              error: err,
            });

        res
          .status(200)
          .json({
            message: "Faculty specialization updated successfully",
            data: result,
          });
      }
    );
  }
};

export const deleteSpecialization = (req, res) => {
  const { specialization_id } = req.params;

  pool.query(
    "DELETE FROM faculty_specialization WHERE specialization_id = ?",
    [specialization_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error deleting specialization", error: err });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Specialization not found" });

      res
        .status(200)
        .json({ message: "Faculty specialization deleted successfully" });
    }
  );
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
        return res.status(500).json({
          message: "Failed to retrieve old image",
          error: err.message,
        });
      }

      const oldImageUrl = results[0]?.faculty_image;
      console.log("🖼️ Old Image URL:", oldImageUrl);

      // Step 2️⃣: Delete the old image file (if it exists)
      if (oldImageUrl) {
        const oldImagePath = path.join(
          "public",
          "Faculty",
          "images",
          path.basename(oldImageUrl)
        );
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
          return res.status(500).json({
            message: "Database update failed",
            error: updateErr.message,
          });
        }

        console.log("✅ Database Update Success:", result);
        return res.status(200).json({
          message: "Image updated successfully",
          imageUrl: newImageUrl,
        });
      });
    });
  } catch (error) {
    console.error("❌ Error in updateFacultyImage:", error);
    return res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
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

// Get all faculty patents with optional faculty_id filter from query params
export const getFacultyPatents = async (req, res) => {
  const { faculty_id } = req.query; // Changed from req.params to req.query

  try {
    let query = "SELECT * FROM faculty_patents";
    let params = [];

    if (faculty_id) {
      // Validate faculty_id format if needed (e.g., length, pattern)
      if (typeof faculty_id !== "string") {
        return res.status(400).json({
          message: "Invalid faculty_id format. Must be 10 characters long.",
        });
      }

      query += " WHERE faculty_id = ?";
      params.push(faculty_id);
    }

    // Optional: Add sorting (newest first by publish date)
    query += " ORDER BY patent_publish DESC";

    const [results] = await promisePool.query(query, params);

    userActionLogger.info(
      `Fetched ${results.length} patents for ${faculty_id ? `faculty ${faculty_id}` : "all faculties"}`
    );

    res.status(200).json({
      message: "Patents fetched successfully",
      data: results,
    });
  } catch (err) {
    errorLogger.error(
      `Error fetching patents: ${err.message}\nStack: ${err.stack}`
    );
    res.status(500).json({
      message: "Error fetching patents",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Add new patent
export const addFacultyPatent = async (req, res) => {
  const {
    faculty_id,
    patent_name,
    patent_number,
    inventors_name,
    patent_publish,
    patent_award_date,
    patent_awarding_agency,
  } = req.body;

  // Validate required fields
  if (
    !faculty_id ||
    !patent_name ||
    !inventors_name ||
    !patent_publish ||
    !patent_number ||
    !patent_awarding_agency
  ) {
    return res.status(400).json({
      message:
        "All fields (faculty_id, patent_name, inventors_name, patent_publish, patent_number, patent_awarding_agency) are required",
    });
  }

  try {
    // Insert the patent
    const [result] = await promisePool.query(
      `INSERT INTO faculty_patents 
       (faculty_id, patent_name, inventors_name, patent_publish, patent_award_date, patent_number, patent_awarding_agency, document) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        faculty_id,
        patent_name,
        inventors_name,
        patent_publish,
        patent_award_date || null,
        patent_number,
        patent_awarding_agency,
        req.file ? req.file.path : null, // Store file path if uploaded
      ]
    );

    userActionLogger.info(
      `Added new patent ${patent_name} (ID: ${result.insertId}) for faculty ${faculty_id}`
    );
    res.status(201).json({
      message: "Patent added successfully",
      id: result.insertId,
    });
  } catch (err) {
    errorLogger.error(`Error adding patent: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update patent
export const updateFacultyPatent = async (req, res) => {
  const { patent_id } = req.params;
  const {
    faculty_id,
    patent_name,
    inventors_name,
    patent_publish,
    patent_award_date,
    patent_number,
    patent_awarding_agency,
  } = req.body;

  try {
    // First get the existing patent data including document path
    const [patentCheck] = await promisePool.query(
      "SELECT document, faculty_id FROM faculty_patents WHERE patent_id = ?",
      [patent_id]
    );

    if (patentCheck.length === 0) {
      return res.status(404).json({ message: "Patent not found" });
    }

    const oldDocumentPath = patentCheck[0].document;
    const oldFacultyId = patentCheck[0].faculty_id;

    // Delete old file if a new file is being uploaded
    if (req.file && oldDocumentPath) {
      try {
        fs.unlinkSync(oldDocumentPath);
        userActionLogger.info(`Deleted old document file: ${oldDocumentPath}`);
      } catch (fileErr) {
        errorLogger.error(
          `Error deleting old patent document ${oldDocumentPath}: ${fileErr.message}`
        );
        // Continue with update even if file deletion fails
      }
    }

    // Handle faculty_id change - move file to new faculty directory if needed
    let newDocumentPath = req.file ? req.file.path : oldDocumentPath;
    if (req.file && faculty_id && faculty_id !== oldFacultyId) {
      const newDirectory = path.join(
        "public",
        "Faculty",
        "Patents",
        faculty_id
      );
      fs.mkdirSync(newDirectory, { recursive: true });

      const newPath = path.join(newDirectory, path.basename(req.file.path));
      fs.renameSync(req.file.path, newPath);
      newDocumentPath = newPath;
    }

    // Update the patent
    const [result] = await promisePool.query(
      `UPDATE faculty_patents
       SET faculty_id = ?, patent_name = ?, inventors_name = ?, patent_publish = ?, 
           patent_award_date = ?, patent_number = ?, patent_awarding_agency = ?,
           document = ?
       WHERE patent_id = ?`,
      [
        faculty_id,
        patent_name,
        inventors_name,
        patent_publish,
        patent_award_date || null,
        patent_number,
        patent_awarding_agency,
        newDocumentPath,
        patent_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patent not found" });
    }

    userActionLogger.info(`Updated patent ID: ${patent_id}`);
    res.status(200).json({ message: "Patent updated successfully" });
  } catch (err) {
    errorLogger.error(`Error updating patent ${patent_id}: ${err.message}`);

    // Clean up newly uploaded file if update failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        errorLogger.error(
          `Error cleaning up uploaded file after failed update: ${cleanupErr.message}`
        );
      }
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete patent
export const deleteFacultyPatent = async (req, res) => {
  const { faculty_id } = req.query;
  const { patent_id} = req.params;
  
  try {
    // First get the document path if it exists
    const [patent] = await promisePool.query(
      "SELECT document FROM faculty_patents WHERE patent_id = ?",
      [patent_id]
    );

    // Delete the patent record
    const [result] = await promisePool.query(
      "DELETE FROM faculty_patents WHERE patent_id = ?",
      [patent_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patent not found" });
    }

    // Delete the associated file if it exists
    if (patent[0]?.document) {
      try {
        fs.unlinkSync(patent[0].document);
      } catch (fileErr) {
        errorLogger.error(
          `Error deleting patent document ${patent[0].document}: ${fileErr.message}`
        );
      }
    }

    userActionLogger.info(`Deleted patent ID: ${patent_id}`);
    res.status(200).json({ message: "Patent deleted successfully" });
  } catch (err) {
    errorLogger.error(`Error deleting patent ${patent_id}: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ GET all faculty qualifications or specific faculty qualification
export const getFacultyQualifications = (req, res) => {
  const { faculty_id } = req.query;

  const query = `
    SELECT fq.*, d.degree_name 
    FROM faculty_Qualification fq
    JOIN degree_options d ON fq.degree_level = d.id
    ${faculty_id ? "WHERE fq.faculty_id = ?" : ""}
  `;

  pool.query(query, faculty_id ? [faculty_id] : [], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching faculty qualifications",
        error: err,
      });
    }
    res.status(200).json(results);
  });
};

// ✅ ADD a new faculty qualification
export const addFacultyQualification = (req, res) => {
  const {
    faculty_id,
    degree_level, // This will come as a text value from the frontend
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

  // Step 1: Check if degree exists
  pool.query(
    "SELECT id FROM degree_options WHERE degree_name = ?",
    [degree_level],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error checking degree", error: err });
      }

      if (results.length > 0) {
        // Degree exists, use its ID
        insertQualification(results[0].id);
      } else {
        // Degree doesn't exist, insert it first
        pool.query(
          "INSERT INTO degree_options (degree_name) VALUES (?)",
          [degree_level],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ message: "Error inserting degree", error: insertErr });
            }
            insertQualification(insertResult.insertId);
          }
        );
      }
    }
  );

  // Step 2: Insert into faculty_Qualification
  function insertQualification(degreeId) {
    const query = `INSERT INTO faculty_Qualification 
        (faculty_id, degree_level, institute, degree_name, year_of_passing, specialization) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    pool.query(
      query,
      [
        faculty_id,
        degreeId,
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
        res.status(201).json({
          message: "Qualification added successfully",
          education_id: result.insertId,
        });
      }
    );
  }
};

// ✅ UPDATE a faculty qualification
export const updateFacultyQualification = (req, res) => {
  const { education_id } = req.params;
  const {
    faculty_id,
    degree_level, // This comes as a text value
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

  // Step 1: Check if degree exists
  pool.query(
    "SELECT id FROM degree_options WHERE degree_name = ?",
    [degree_level],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error checking degree", error: err });
      }

      if (results.length > 0) {
        // Degree exists, use its ID
        updateQualification(results[0].id);
      } else {
        // Insert new degree name
        pool.query(
          "INSERT INTO degree_options (degree_name) VALUES (?)",
          [degree_level],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ message: "Error inserting degree", error: insertErr });
            }
            updateQualification(insertResult.insertId);
          }
        );
      }
    }
  );

  // Step 2: Update faculty_Qualification
  function updateQualification(degreeId) {
    const query = `UPDATE faculty_Qualification 
        SET faculty_id = ?, degree_level = ?, institute = ?, degree_name = ?, year_of_passing = ?, specialization = ? 
        WHERE education_id = ?`;

    pool.query(
      query,
      [
        faculty_id,
        degreeId,
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
  }
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
    return res.status(400).json({
      error: "user_id, position_name, and notification_type are required",
    });
  }

  if (!["duty", "circular"].includes(notification_type)) {
    return res.status(400).json({
      error: "Invalid notification_type. Must be 'duty' or 'circular'.",
    });
  }

  // Update last_seen timestamp for the user
  const updateQuery = `
      INSERT INTO user_last_seen_notifications (user_id, user_type, notification_type, last_seen)
      VALUES (?, (SELECT position_id FROM position_type WHERE position_name = ?), ?, NOW())
      ON DUPLICATE KEY UPDATE last_seen = NOW();
  `;

  pool.query(
    updateQuery,
    [user_id, position_name, notification_type],
    (err) => {
      if (err) {
        console.error("Error updating last_seen:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // First, fetch last_seen timestamp separately
      const lastSeenQuery = `
          SELECT last_seen FROM user_last_seen_notifications 
          WHERE user_id = ? AND notification_type = ?;
      `;

      pool.query(
        lastSeenQuery,
        [user_id, notification_type],
        (err, lastSeenResult) => {
          if (err) {
            console.error("Error fetching last_seen:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Default last_seen value if no record exists
          const lastSeen =
            lastSeenResult.length > 0
              ? lastSeenResult[0].last_seen
              : "2000-01-01";

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
              seen_count: result[0].seen_count,
            });
          });
        }
      );
    }
  );
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

  pool.query(query, values, (err, orders) => {
    if (err) {
      console.error("Error fetching duty orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (orders.length === 0) {
      return res.json([]);
    }

    // Fetch mappings for all retrieved orders
    const orderNumbers = orders.map((order) => order.order_number);

    const facultyQuery = `
      SELECT order_number, faculty_id 
      FROM mapping_duty_orders_faculty
      WHERE order_number IN (?);
    `;

    const studentQuery = `
      SELECT order_number, roll_no 
      FROM mapping_duty_orders_students
      WHERE order_number IN (?);
    `;

    pool.query(facultyQuery, [orderNumbers], (err, facultyResults) => {
      if (err) {
        console.error("Error fetching faculty mappings:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      pool.query(studentQuery, [orderNumbers], (err, studentResults) => {
        if (err) {
          console.error("Error fetching student mappings:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Organizing faculty and student mappings per order
        const facultyMap = {};
        const studentMap = {};

        orderNumbers.forEach((order) => {
          facultyMap[order] = [];
          studentMap[order] = [];
        });

        facultyResults.forEach((row) => {
          facultyMap[row.order_number].push(row.faculty_id);
        });

        studentResults.forEach((row) => {
          studentMap[row.order_number].push(row.roll_no);
        });

        // Attach faculty and student lists to each order
        const enrichedOrders = orders.map((order) => ({
          ...order,
          faculty_ids: facultyMap[order.order_number] || [],
          student_ids: studentMap[order.order_number] || [],
        }));

        res.json(enrichedOrders);
      });
    });
  });
};

export const getCirculars = (req, res) => {
  const {faculty_id} = req.query;
  const { department_id } = req.params;
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
    return res
      .status(400)
      .json({ message: "User ID and Duty Order ID are required!" });
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
      return res
        .status(404)
        .json({ message: "Notification not found or already seen!" });
    }

    res.json({ message: "Duty order marked as seen!" });
  });
};

export const downloadFacultySummary = async (req, res) => {
  const { faculty_id } = req.params;

  pool.query(
    "SELECT * FROM faculty_details WHERE faculty_id = ?",
    [faculty_id],
    async (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error fetching faculty data", error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Faculty not found" });

      const faculty = results[0];

      try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // ✅ Open the React Page (Hosted on Frontend)
        const frontendURL = `https://dtu-eceportal.com/faculty-summary?faculty_id=${faculty_id}`;
        await page.goto(frontendURL, { waitUntil: "networkidle2" });

        // ✅ Generate PDF
        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        // ✅ Send PDF as Response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="faculty_${faculty_id}.pdf"`
        );
        res.send(pdfBuffer);
      } catch (error) {
        res.status(500).json({ message: "Error generating PDF", error });
      }
    }
  );
};

export const getFacultyMappingByDepartment = (req, res) => {
  const { department_id } = req.query;

  const query = `
    SELECT fd.faculty_id, fd.faculty_name 
    FROM faculty_details fd
    JOIN faculty_auth fa ON fd.faculty_id = fa.faculty_id
    WHERE fa.department_id = ?;
  `;

  pool.query(query, [department_id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error fetching faculty mapping", error: err });
    if (results.length === 0)
      return res
        .status(404)
        .json({ message: "No faculty found for this department." });

    res.status(200).json(results);
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if faculty exists
    const [result] = await promisePool.query(
      "SELECT * FROM faculty_auth WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      errorLogger.warn(
        `⚠️ Forgot password attempted for non-existent faculty email: ${email}`
      );
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.TOKEN_EXPIRY}m`,
      algorithm: "HS256",
    });

    const expiryTime = new Date(
      Date.now() + Number(process.env.TOKEN_EXPIRY) * 60000
    );

    // Store token in database
    await promisePool.query(
      "UPDATE faculty_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
      [resetToken, expiryTime, email]
    );

    // Prepare reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email via Brevo
    const emailData = {
      sender: {
        name: process.env.EMAIL_FROM_NAME,
        email: process.env.EMAIL_FROM_EMAIL,
      },
      to: [{ email }],
      subject: "Password Reset Request",
      htmlContent: `
        <p>Hello,</p>
        <p>Click the link below to reset your password (valid for ${process.env.TOKEN_EXPIRY} minutes):</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      `,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    userActionLogger.info(`🔐 Password reset link sent to faculty: ${email}`);
    res.json({ message: "Reset link sent to faculty email" });
  } catch (err) {
    errorLogger.error(
      `❌ Faculty password reset error for ${email}: ${err.message}`
    );
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Check if valid token exists in DB
    const [result] = await promisePool.query(
      "SELECT * FROM faculty_auth WHERE email = ? AND reset_token = ?",
      [email, token]
    );

    if (result.length === 0) {
      errorLogger.warn(`❌ Invalid reset token attempt for faculty: ${email}`);
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Check token expiry
    if (new Date(result[0].token_expiry) < new Date()) {
      errorLogger.warn(`⏳ Expired reset token used by faculty: ${email}`);
      return res.status(400).json({ error: "Token expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await promisePool.query(
      "UPDATE faculty_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    // Clear any existing auth cookies
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

    userActionLogger.info(
      `✅ Faculty password successfully reset for ${email}`
    );
    res.json({ message: "Faculty password reset successful" });
  } catch (err) {
    errorLogger.error(`❌ Faculty password reset error: ${err.message}`);

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const facultyLogin = async (req, res) => {
  const { faculty_id, password } = req.body;

  if (!faculty_id || !password) {
    return res
      .status(400)
      .json({ message: "Faculty ID and password are required!" });
  }

  try {
    // Step 1: Get faculty authentication details
    const [facultyAuth] = await promisePool.query(
      `SELECT fa.*, pt.position_name
       FROM faculty_auth fa
       LEFT JOIN position_type pt ON fa.position_id = pt.position_id
       WHERE fa.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyAuth.length === 0) {
      return res.status(404).json({ message: "Faculty ID not found!" });
    }

    const user = facultyAuth[0];
    const deptid = user.department_id;
    const position = user.position_name;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password!" });

    // Step 2: Get name and designation
    const [facultyDetails] = await promisePool.query(
      `SELECT fd.faculty_name, fa.designation
       FROM faculty_details fd 
       LEFT JOIN faculty_association fa ON fd.faculty_id = fa.faculty_id 
       WHERE fd.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyDetails.length === 0) {
      return res.status(404).json({ message: "Faculty details not found!" });
    }

    const { faculty_name, designation } = facultyDetails[0];

    // Step 3: Get counts
    const [counts] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM faculty_research_paper WHERE faculty_id = ?) AS research_papers,
        (SELECT COUNT(*) FROM faculty_sponsored_research WHERE faculty_id = ?) AS sponsorships,
        (SELECT COUNT(*) FROM faculty_patents WHERE faculty_id = ?) AS patents,
        (SELECT COUNT(*) FROM faculty_Book_records WHERE faculty_id = ?) AS book_records,
        (SELECT COUNT(*) FROM faculty_consultancy WHERE faculty_id = ?) AS consultancy`,
      [faculty_id, faculty_id, faculty_id, faculty_id, faculty_id]
    );

    // Step 4: Get unread notifications
    const [notifications] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM department_duty_notifications 
         WHERE user_id = ? AND is_seen = 0) AS unread_duties,
         
        (SELECT COUNT(*) FROM department_circular 
         WHERE department_id = (SELECT department_id FROM faculty_auth WHERE faculty_id = ?)
         AND created_at > COALESCE(
           (SELECT last_seen FROM user_last_seen_notifications 
            WHERE user_id = ? AND notification_type = 'circular'), '2000-01-01')
        ) AS unread_circulars`,
      [faculty_id, faculty_id, faculty_id]
    );

    // Step 5: Generate tokens
    const role_assigned = "general"; // <-- Added
    const accessToken = generateAccessToken(
      faculty_id,
      position,
      role_assigned,
      deptid
    );
    const refreshToken = generateRefreshToken(
      faculty_id,
      position,
      role_assigned,
      deptid
    );

    const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
    const refreshTokenExpiry = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    );

    // Step 6: Save refresh token in DB
    await promisePool.query(
      "UPDATE faculty_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE faculty_id = ?",
      [refreshToken, refreshTokenExpiry, faculty_id]
    );

    // Step 7: Log activity
    const ipAddress = requestIp.getClientIp(req);
    const userAgent = req.headers["user-agent"];
    await promisePool.query(
      "INSERT INTO faculty_login_activity (faculty_id, ip_address, user_agent) VALUES (?, ?, ?)",
      [faculty_id, ipAddress, userAgent]
    );

    userActionLogger.info(`✅ Faculty ${faculty_id} logged in`);

    // Step 8: Send response and set httpOnly cookie
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes or whatever ACCESS_TOKEN_EXPIRY is
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: expiryDays * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful!",
        user: {
          faculty_id: user.faculty_id,
          faculty_name,
          faculty_designation: designation,
          position,
          researchCount: counts[0].research_papers,
          sponsorCount: counts[0].sponsorships,
          patentCount: counts[0].patents,
          bookCount: counts[0].book_records,
          consultancyCount: counts[0].consultancy,
          unreadDuties: notifications[0].unread_duties,
          unreadCirculars: notifications[0].unread_circulars,
          department_id: deptid,
        },
      });
  } catch (err) {
    errorLogger.error(
      `❌ Faculty login error for ${faculty_id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error!" });
  }
};

export const facultyRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      errorLogger.warn("❌ Refresh token missing in cookies.");
      return res.status(401).json({ message: "Refresh token is required!" });
    }

    // Check if the refresh token exists in the database
    const [results] = await promisePool.query(
      `SELECT fa.faculty_id, fa.refresh_token_expiry, pt.position_name 
       FROM faculty_auth fa
       LEFT JOIN position_type pt ON fa.position_id = pt.position_id
       WHERE fa.refresh_token = ?`,
      [refreshToken]
    );

    if (results.length === 0) {
      errorLogger.warn("❌ Invalid refresh token.");
      return res.status(401).json({ message: "Invalid refresh token!" });
    }

    const user = results[0];
    const tokenExpiry = new Date(user.refresh_token_expiry);

    if (tokenExpiry < new Date()) {
      errorLogger.warn(
        `⏳ Refresh token expired for faculty ${user.faculty_id}`
      );
      return res.status(401).json({ message: "Refresh token expired!" });
    }

    // Verify the refresh token asynchronously using jwt.verify
    try {
      await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // await here directly

      // Generate new access and refresh tokens
      const newAccessToken = generateAccessToken(
        user.faculty_id,
        user.position_name,
        "general"
      );

      const newRefreshToken = generateRefreshToken(
        user.faculty_id,
        user.position_name,
        "general"
      );

      // Update the refresh token in the database and its expiry time
      const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
      const newRefreshTokenExpiry = new Date(
        Date.now() + expiryDays * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await promisePool.query(
        "UPDATE faculty_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE faculty_id = ?",
        [newRefreshToken, newRefreshTokenExpiry, user.faculty_id]
      );

      // Set new access and refresh tokens as cookies
      res
        .cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: expiryDays * 24 * 60 * 60 * 1000, // Refresh token expiry time
        })
        .json({
          message: "New access token and refresh token issued.",
        });

      userActionLogger.info(
        `🔄 Tokens refreshed for faculty ${user.faculty_id}`
      );
    } catch (err) {
      errorLogger.warn(
        `❌ Refresh token verification failed for faculty ${user.faculty_id}: ${err.message}`
      );
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token!" });
    }
  } catch (err) {
    errorLogger.error(
      `🚨 Server error during faculty token refresh: ${err.message}`
    );
    res.status(500).json({ message: "Server error!" });
  }
};

export const facultyLogout = async (req, res) => {
  const { user } = req; // Get the user from the request (from the JWT token)

  if (!user || !user.id) {
    errorLogger.error("Logout failed: No authenticated user found.");
    return res.status(401).json({ message: "Unauthorized!" });
  }

  try {
    // Remove refresh token and expiry from DB using user.id (faculty_id)
    await promisePool.query(
      "UPDATE faculty_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE faculty_id = ?",
      [user.id] // Use user.id here
    );

    // Log the successful logout
    userActionLogger.info(
      `Faculty logged out successfully. Faculty ID: ${user.id}`
    );

    // Clear cookies
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

    // Send response
    res.json({ message: "Logged out successfully!" });
  } catch (err) {
    errorLogger.error(
      `❌ Logout failed for faculty ${user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error!" });
  }
};

export const facultyVerifyAuth = async (req, res) => {
  try {
    // Extract token from httpOnly cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      errorLogger.warn("❌ No access token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      errorLogger.warn(`❌ Invalid or expired token in cookie: ${err.message}`);
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or expired token" });
    }

    const { id } = decoded;
    if (!id) {
      errorLogger.warn(
        `❌ Missing required fields in token payload: ${JSON.stringify(decoded)}`
      );
      return res
        .status(400)
        .json({ message: "Bad request - Missing token data" });
    }

    const faculty_id = id;

    // Step 1: Get faculty authentication details (same as login)
    const [facultyAuth] = await promisePool.query(
      `SELECT fa.*, pt.position_name
       FROM faculty_auth fa
       LEFT JOIN position_type pt ON fa.position_id = pt.position_id
       WHERE fa.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyAuth.length === 0) {
      errorLogger.warn(`❌ Faculty not found. Faculty ID: ${faculty_id}`);
      return res.status(404).json({ message: "Faculty not found!" });
    }

    const user = facultyAuth[0];
    const deptid = user.department_id;
    const position = user.position_name;

    // Step 2: Get name and designation (same as login)
    const [facultyDetails] = await promisePool.query(
      `SELECT fd.faculty_name, fa.designation
       FROM faculty_details fd 
       LEFT JOIN faculty_association fa ON fd.faculty_id = fa.faculty_id 
       WHERE fd.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyDetails.length === 0) {
      return res.status(404).json({ message: "Faculty details not found!" });
    }

    const { faculty_name, designation } = facultyDetails[0];

    // Step 3: Get counts (same as login)
    const [counts] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM faculty_research_paper WHERE faculty_id = ?) AS research_papers,
        (SELECT COUNT(*) FROM faculty_sponsored_research WHERE faculty_id = ?) AS sponsorships,
        (SELECT COUNT(*) FROM faculty_patents WHERE faculty_id = ?) AS patents,
        (SELECT COUNT(*) FROM faculty_Book_records WHERE faculty_id = ?) AS book_records,
        (SELECT COUNT(*) FROM faculty_consultancy WHERE faculty_id = ?) AS consultancy`,
      [faculty_id, faculty_id, faculty_id, faculty_id, faculty_id]
    );

    // Step 4: Get unread notifications (same as login)
    const [notifications] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM department_duty_notifications 
         WHERE user_id = ? AND is_seen = 0) AS unread_duties,
         
        (SELECT COUNT(*) FROM department_circular 
         WHERE department_id = (SELECT department_id FROM faculty_auth WHERE faculty_id = ?)
         AND created_at > COALESCE(
           (SELECT last_seen FROM user_last_seen_notifications 
            WHERE user_id = ? AND notification_type = 'circular'), '2000-01-01')
        ) AS unread_circulars`,
      [faculty_id, faculty_id, faculty_id]
    );

    // Log successful verification
    userActionLogger.info(
      `✔️ Faculty token verified successfully for ${faculty_id}`
    );

    // Respond with same structure as login
    res.json({
      message: "Token is valid!",
      user: {
        faculty_id: user.faculty_id,
        faculty_name,
        faculty_designation: designation,
        position,
        researchCount: counts[0].research_papers || 0,
        sponsorCount: counts[0].sponsorships || 0,
        patentCount: counts[0].patents || 0,
        bookCount: counts[0].book_records || 0,
        consultancyCount: counts[0].consultancy || 0,
        unreadDuties: notifications[0].unread_duties || 0,
        unreadCirculars: notifications[0].unread_circulars || 0,
        department_id: deptid,
        department_name: user.department_name, // Added from your original verify
      },
    });
  } catch (err) {
    errorLogger.error(
      `❌ Server error during faculty token verification: ${err.message}`
    );
    console.error(err);
    res.status(500).json({
      message: "Server error!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};


export const getFacultyResearchByMonth = async (req, res) => {
  let { months_ago, user_id } = req.query;
  months_ago = parseInt(months_ago, 10);

  if (!months_ago || months_ago < 1 || months_ago > 6) {
    return res.status(400).json({ error: "months_ago query parameter must be between 1 and 6" });
  }

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - months_ago, 1);
  const targetYear = target.getFullYear();
  const targetMonthNumber = target.getMonth() + 1; // 1-based month
  const targetMonthName = target.toLocaleString('en-US', { month: 'long' });

  try {
    const [rows] = await promisePool.query(
      `SELECT faculty_id, paper_type, title_of_paper, area_of_research, published_year, month, authors, name_of_publication, ISSN_number
       FROM faculty_research_paper
       WHERE published_year = ? AND month = ?
       ORDER BY published_year DESC, month DESC`,
      [targetYear, targetMonthNumber]
    );
    userActionLogger.info(
      `User ${user_id} accessed ${targetMonthName} ${targetYear} faculty research papers successfully.`,
      {
        action: "READ",
        user_id,
        month: targetMonthName,
        year: targetYear,
        count: rows.length,
        table: "faculty_research_paper"
      }
    );
    res.status(200).json(rows);
  } catch (error) {
    logError("Fetch faculty research papers by month", error, { months_ago, targetYear, targetMonthNumber, user_id });
    res.status(500).json({ error: "Failed to fetch faculty research papers" });
  }
};
