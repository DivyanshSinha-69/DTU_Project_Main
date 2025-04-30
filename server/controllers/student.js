import { pool } from "../data/database.js";
import multer from "multer";
import path, { resolve } from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import requestIp from 'request-ip'; // For getting the client IP address
import { promisePool } from "../data/database.js";
import { userActionLogger, errorLogger } from "../utils/logger.js";

dotenv.config();

const storage = multer.memoryStorage(); // Store the file in memory as Buffer
const upload = multer({ storage: storage });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// ==================== Generate Access Token ====================
const generateAccessToken = (roll_no, position, role_assigned) => {
  return jwt.sign({ roll_no, position, role_assigned }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// ==================== Generate Refresh Token ====================
const generateRefreshToken = (roll_no, position, role_assigned) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign({ roll_no, position, role_assigned }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expirySeconds,
  });
};



export const uploadImage = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { originalname, buffer } = req.file;
    const { rollNo } = req.body;
    const base64Image = buffer.toString("base64");

    // Check if the rollNo already exists in the database
    const checkQuery = "SELECT * FROM images WHERE rollNo = ?";

    pool.query(checkQuery, [rollNo], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking database: " + checkErr.stack);
        res.status(500).send("Internal Server Error");
      } else {
        if (checkResult && checkResult.length > 0) {
          // RollNo exists, perform an update
          const updateQuery =
            "UPDATE images SET originalname = ?, image_data = ? WHERE rollNo = ?";

          pool.query(
            updateQuery,
            [originalname, base64Image, rollNo],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating database: " + updateErr.stack);
                res.status(500).send("Internal Server Error");
              } else {
                res.status(200).send("Image updated in the database");
              }
            },
          );
        } else {
          // RollNo doesn't exist, perform an insert
          const insertQuery =
            "INSERT INTO images (rollNo, originalname, image_data) VALUES (?, ?, ?)";

          pool.query(
            insertQuery,
            [rollNo, originalname, base64Image],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error(
                  "Error inserting into database: " + insertErr.stack,
                );
                res.status(500).send("Internal Server Error");
              } else {
                res.status(200).send("Image uploaded and saved to database");
              }
            },
          );
        }
      }
    });
  });
};

export const getImage = (req, res) => {
  const { rollNo } = req.body; // Assuming you send the 'id' in the request body
  // Retrieve image data from the database based on the provided 'id'
  const query = "SELECT image_data, originalname FROM images WHERE rollNo = ?";
  pool.query(query, [rollNo], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { image_data, originalname } = result[0];

      // Convert the base64-encoded image data back to a Buffer
      if (image_data) {
        const imageBuffer = Buffer.from(image_data, "base64");

        // Set the appropriate headers for the image response
        res.setHeader("Content-Type", "image/*");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=${originalname}`,
        );
        // Send the image data as the response
        res.end(imageBuffer);
      }
    } else {
      res.status(404).send("Image not found");
    }
  });
};

export const getall = (req, res) => {
  pool.query("SELECT * FROM Student_data", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

export const getProfessionalSkills = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM EventDetails WHERE RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Always return an array, even if it's empty
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const updateProfessionalSkills = (req, res) => {
  const { id, organisation, position, eventname, date, roll } = req.body;
  const sql =
    "UPDATE EventDetails SET Organisation = ?, Position = ?, EventName = ?, EventDate = ? ,RollNo = ? WHERE ID = ?";

  pool.query(
    sql,
    [organisation, position, eventname, date, roll, id],
    (err, result) => {
      if (err) {
        console.error("Error executing update query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if any row is affected (indicating a successful update)
      if (result.affectedRows > 0) {
        res.status(200).json({
          success: true,
          message: "Record updated successfully",
        });
      } else {
        res.status(404).json({ error: "Record not found" });
      }
    },
  );
};

export const deleteProfessionalSkills = (req, res) => {
  const { ID } = req.body;
  const sql = "DELETE FROM EventDetails WHERE ID = ?";

  pool.query(sql, [ID], (err, result) => {
    if (err) {
      console.error("Error executing delete query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if any row is affected (indicating a successful delete)
    if (result.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Record deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  });
};

export const addProfessionalSkills = (req, res) => {
  const { organisation, position, eventname, date, roll, ID } = req.body;
  const sql =
    "INSERT INTO EventDetails (Organisation, Position, EventName, EventDate, RollNo ,ID) VALUES (?, ?, ?, ?, ? ,?)";

  pool.query(
    sql,
    [organisation, position, eventname, date, roll, ID],
    (err, result) => {
      if (err) {
        console.error("Error executing insert query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if a new row is inserted (indicating a successful add)
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
          message: "Record added successfully",
        });
      } else {
        res.status(400).json({ error: "Failed to add record" });
      }
    },
  );
};

export const getPersonalDetails = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM studentPersonalDetails where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Always return an array, even if it's empty
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const updatePersonalDetails = (req, res) => {
  const {
    id,
    motherName,
    fatherName,
    personalContactNo,
    parentContactNo,
    personalEmail,
    dtuEmail,
  } = req.body;
  // Check if the record exists in the database
  const checkQuery = "SELECT * FROM studentPersonalDetails WHERE RollNo = ?";

  pool.query(checkQuery, [id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking database:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (checkResult && checkResult.length > 0) {
      // Record exists, perform an update
      const updateQuery =
        "UPDATE studentPersonalDetails SET motherName = ?, fatherName = ?, personalContactNo = ?, parentContactNo = ?, personalEmail = ?, dtuEmail = ? WHERE RollNo = ?";

      pool.query(
        updateQuery,
        [
          motherName,
          fatherName,
          personalContactNo,
          parentContactNo,
          personalEmail,
          dtuEmail,
          id,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error executing update query:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({
              success: true,
              message: "Record updated successfully",
            });
          }
        },
      );
    } else {
      // Record doesn't exist, perform an insert
      const insertQuery =
        "INSERT INTO studentPersonalDetails (RollNo, motherName, fatherName, personalContactNo, parentContactNo, personalEmail, dtuEmail) VALUES (?, ?, ?, ?, ?, ?, ?)";

      pool.query(
        insertQuery,
        [
          id,
          motherName,
          fatherName,
          personalContactNo,
          parentContactNo,
          personalEmail,
          dtuEmail,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into database:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({
              success: true,
              message: "Record added successfully",
            });
          }
        },
      );
    }
  });
};

// placement table

// export const deletePlacement = (req, res) => {
//   const { ID } = req.body;
//   const sql = "DELETE FROM placementData WHERE ID = ?";

//   pool.query(sql, [ID], (err, result) => {
//     if (err) {
//       console.error("Error executing delete query:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     // Check if any row is affected (indicating a successful delete)
//     if (result.affectedRows > 0) {
//       res.status(200).json({
//         success: true,
//         message: "Record deleted successfully",
//       });
//     } else {
//       res.status(404).json({ error: "Record not found" });
//     }
//   });
// };

export const deletePlacement = (req, res) => {
  const { ID } = req.body;

  // Retrieve PDF link from the database based on the provided 'ID'
  const pdfQuery = "SELECT appointmentLetter FROM placementData WHERE ID = ?";
  pool.query(pdfQuery, [ID], (pdfErr, pdfResult) => {
    if (pdfErr) {
      console.error(
        "Error querying PDF link from the database: " + pdfErr.stack,
      );
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (pdfResult.length > 0) {
      const { appointmentLetter } = pdfResult[0];

      // Check if the appointmentLetter link exists
      if (appointmentLetter) {
        // Extract the relative file path from the link
        const relativeFilePath = appointmentLetter.replace(
          `${process.env.REACT_APP_BACKEND_URL}/public`,
          "",
        );

        const currentModulePath = fileURLToPath(import.meta.url);
        const currentModuleDir = dirname(currentModulePath);
        // Construct the absolute file path
        const absoluteFilePath = path.join(
          currentModuleDir,
          "..",
          "public",
          relativeFilePath,
        );

        // Delete the corresponding PDF file
        fs.unlink(absoluteFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting PDF file: " + unlinkErr.stack);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          // Proceed with deleting the database entry after the file deletion
          const deleteQuery = "DELETE FROM placementData WHERE ID = ?";
          pool.query(deleteQuery, [ID], (deleteErr, result) => {
            if (deleteErr) {
              console.error("Error executing delete query:", deleteErr);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              // Check if any row is affected (indicating a successful delete)
              if (result.affectedRows > 0) {
                res.status(200).json({
                  success: true,
                  message: "Record deleted successfully",
                });
              } else {
                res.status(404).json({ error: "Record not found" });
              }
            }
          });
        });
      } else {
        // Proceed with deleting the database entry if no PDF link is associated
        const deleteQuery = "DELETE FROM placementData WHERE ID = ?";
        pool.query(deleteQuery, [ID], (deleteErr, result) => {
          if (deleteErr) {
            console.error("Error executing delete query:", deleteErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Check if any row is affected (indicating a successful delete)
            if (result.affectedRows > 0) {
              res.status(200).json({
                success: true,
                message: "Record deleted successfully",
              });
            } else {
              res.status(404).json({ error: "Record not found" });
            }
          }
        });
      }
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  });
};

export const addPlacement = (req, res) => {
  // console.log(req);
  const { companyName, placementType, joiningDate, roll, ID } = req.body;

  const sql =
    "UPDATE placementData SET companyName = ?, placementType = ?, joiningDate = ?, RollNo = ? WHERE ID = ?";
  // console.log(ID);

  pool.query(
    sql,
    [companyName, placementType, joiningDate, roll, ID],
    (err, result) => {
      if (err) {
        // console.error("Error executing insert query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // console.log(result);
      // Check if a new row is inserted (indicating a successful add)
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
          message: "Record added successfully",
        });
      } else {
        res.status(400).json({ error: "Failed to add record" });
      }
    },
  );
};

export const getPlacement = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM placementData where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the user with the given credentials exists
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const uploadPdf = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { id, rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${id}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");

    // Create a directory if it doesn't exist
    const rollNoDir = path.join(
      parentDir,
      "public/appointmentLetters",
      modifiedRollNo,
    );
    if (!fs.existsSync(rollNoDir)) {
      fs.mkdirSync(rollNoDir);
    }

    // Save the PDF file inside the rollNo directory
    const filePath = path.join(rollNoDir, fileName);
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Insert into the database without checking if RollNo exists
      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
      const appointmentLettersLink = `${baseUrl}/appointmentLetters/${modifiedRollNo}/${fileName}`;

      const insertQuery =
        "INSERT INTO placementData (id, appointmentLetter) VALUES (?, ?)";
      pool.query(
        insertQuery,
        [id, appointmentLettersLink],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into database: " + insertErr.stack);
            res.status(500).send("Internal Server Error");
          } else {
            res.status(200).send("PDF uploaded and saved to database");
          }
        },
      );
    });
  });
};

export const getPdf = (req, res) => {
  const { id } = req.body;

  // Retrieve PDF data from the database based on the provided 'id'
  const query = "SELECT appointmentLetter FROM placementData WHERE ID = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { appointmentLetter } = result[0];

      // Check if a link is present
      if (appointmentLetter) {
        // Send the PDF link as the response
        res.status(200).send({ appointmentLetter });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};

export const getMtechEducationDetails = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM mtechEducationalDetails where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the user with the given credentials exists
    if (results.length > 0) {
      res.status(200).json({
        user: results,
        success: true,
      });
    } else {
      res.status(401).json({ error: "No data Exist" });
      return;
    }
  });
};

export const updateMtechEducationDetails = (req, res) => {
  const { admittedThrough, gateRollNo, gateAir, gateMarks, RollNo } = req.body;
  let sqlCheckUserExists =
    "SELECT * FROM mtechEducationalDetails WHERE RollNo = ?";

  pool.query(sqlCheckUserExists, [RollNo], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking user existence:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // If the user exists, update the record
    if (checkResult.length > 0) {
      let sqlUpdate;
      if (admittedThrough === "GATE") {
        sqlUpdate =
          "UPDATE mtechEducationalDetails SET admittedThrough = ?, gateRollNo = ?, gateAir = ?, gateMarks = ? WHERE RollNo = ?";
      } else {
        sqlUpdate =
          "UPDATE mtechEducationalDetails SET admittedThrough = ?, gateRollNo = ?, gateAir = ?, gateMarks = ?, gateScoreCard = null WHERE RollNo = ?";
      }

      pool.query(
        sqlUpdate,
        [admittedThrough, gateRollNo, gateAir, gateMarks, RollNo],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error executing update query:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          if (updateResult.affectedRows > 0) {
            res.status(201).json({
              success: true,
              message: "Record updated successfully",
            });
          } else {
            res.status(404).json({ error: "Record not found" });
          }
        },
      );
    } else {
      // If the user does not exist, insert a new record
      let sqlInsert;
      if (admittedThrough === "Non-GATE") {
        sqlInsert =
          "INSERT INTO mtechEducationalDetails (RollNo, admittedThrough, gateRollNo, gateAir, gateMarks, gateScoreCard) VALUES (?, ?, ?, ?, ?, null)";

        pool.query(
          sqlInsert,
          [RollNo, admittedThrough, gateRollNo, gateAir, gateMarks],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error executing insert query:", insertErr);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              res.status(201).json({
                success: true,
                message: "Record inserted successfully",
              });
            }
          },
        );
      }
    }
  });
};

export const getBtechEducationDetails = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM btechEducationalDetails where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the user with the given credentials exists
    if (results.length > 0) {
      res.status(200).json({
        user: results,
        success: true,
      });
    } else {
      res.status(401).json({ error: "No data Exist" });
      return;
    }
  });
};

export const updateBtechEducationDetails = (req, res) => {
  let { admittedThrough, air, RollNo } = req.body;
  let sqlCheckUserExists =
    "SELECT * FROM btechEducationalDetails WHERE RollNo = ?";

  pool.query(sqlCheckUserExists, [RollNo], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking user existence:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // If the user exists, update the record
    if (checkResult.length > 0) {
      let sqlUpdate;
      if (admittedThrough === "JEE") {
        sqlUpdate =
          "UPDATE btechEducationalDetails SET admittedThrough = ?, air = ? WHERE RollNo = ?";
      } else {
        sqlUpdate =
          "UPDATE btechEducationalDetails SET admittedThrough = ?, air = ? WHERE RollNo = ?";
        air = null;
      }

      pool.query(
        sqlUpdate,
        [admittedThrough, air, RollNo],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error executing update query:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          if (updateResult.affectedRows > 0) {
            res.status(201).json({
              success: true,
              message: "Record updated successfully",
            });
          } else {
            res.status(404).json({ error: "Record not found" });
          }
        },
      );
    } else {
      // If the user does not exist, insert a new record
      let sqlInsert;
      if (admittedThrough === "Non-JEE") {
        sqlInsert =
          "INSERT INTO btechEducationalDetails (RollNo, admittedThrough, air) VALUES (?, ?, null)";
      } else {
        sqlInsert =
          "INSERT INTO btechEducationalDetails (RollNo, admittedThrough, air) VALUES (?, ?, ?)";
      }

      pool.query(
        sqlInsert,
        [RollNo, admittedThrough, air],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error executing insert query:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(201).json({
              success: true,
              message: "Record inserted successfully",
            });
          }
        },
      );
    }
  });
};
export const uploadScoreCard = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${modifiedRollNo}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");
    // Save the PDF file to the companyCertificates folder

    const filePath = path.join(parentDir, "public/scoreCards", fileName);
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if RollNo exists
      const checkQuery =
        "SELECT * FROM mtechEducationalDetails WHERE RollNo = ?";

      pool.query(checkQuery, [rollNo], (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Error checking RollNo existence: " + checkErr.stack);
          res.status(500).send("Internal Server Error");
        } else {
          const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
          const gateScoreCardLink = `${baseUrl}/scoreCards/${fileName}`;

          if (checkResult.length === 0) {
            // RollNo does not exist, insert
            const insertQuery =
              "INSERT INTO mtechEducationalDetails (RollNo, gateScoreCard) VALUES (?, ?)";
            pool.query(
              insertQuery,
              [rollNo, gateScoreCardLink],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into database: " + insertErr.stack,
                  );
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          } else {
            // RollNo exists, update
            const updateQuery =
              "UPDATE mtechEducationalDetails SET gateScoreCard = ? WHERE RollNo = ?";
            pool.query(
              updateQuery,
              [gateScoreCardLink, rollNo],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error("Error updating database: " + updateErr.stack);
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          }
        }
      });
    });
  });
};

export const getScoreCard = (req, res) => {
  const { id } = req.body;

  // Retrieve the stored link from the database based on the provided 'id'
  const query =
    "SELECT gateScoreCard FROM mtechEducationalDetails WHERE RollNO = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { gateScoreCard } = result[0];

      // Check if a link is present
      if (gateScoreCard) {
        // Send the PDF link as the response
        res.status(200).send({ gateScoreCard });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};

export const getEntrepreneurDetails = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM entrepreneurDetails WHERE RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Always return an array, even if it's empty
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};
export const updateEntrepreneurDetails = (req, res) => {
  const { companyName, cinNumber, companyLink, RollNo } = req.body;
  let sql =
    "UPDATE entrepreneurDetails SET companyName = ?, cinNumber = ?, companyLink = ?  WHERE RollNo = ?";

  pool.query(
    sql,
    [companyName, cinNumber, companyLink, RollNo],
    (err, result) => {
      if (err) {
        console.error("Error executing update query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if any row is affected (indicating a successful update)
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
          message: "Record updated successfully",
        });
      } else {
        res.status(404).json({ error: "Record not found" });
      }
    },
  );
};

export const getCompanyRegCert = (req, res) => {
  const { id } = req.body;

  // Retrieve the stored link from the database based on the provided 'id'
  const query =
    "SELECT companyRegCertificate FROM entrepreneurDetails WHERE RollNO = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { companyRegCertificate } = result[0];

      // Check if a link is present
      if (companyRegCertificate) {
        // Construct the full URL using the local server's base URL and the stored link
        // const baseUrl = '`${process.env.REACT_APP_BACKEND_URL}/public';
        // const fullUrl = `${baseUrl}${companyRegCertificate}`;

        // Send the PDF link as the response
        res.status(200).send({ companyRegCertificate });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};

import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

export const uploadCompanyRegCert = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${modifiedRollNo}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");
    // Save the PDF file to the companyCertificates folder

    const filePath = path.join(
      parentDir,
      "public/companyCertificates",
      fileName,
    );
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if RollNo exists
      const checkQuery = "SELECT * FROM entrepreneurDetails WHERE RollNo = ?";

      pool.query(checkQuery, [rollNo], (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Error checking RollNo existence: " + checkErr.stack);
          res.status(500).send("Internal Server Error");
        } else {
          const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
          const certificateLink = `${baseUrl}/companyCertificates/${fileName}`;

          if (checkResult.length === 0) {
            // RollNo does not exist, insert
            const insertQuery =
              "INSERT INTO entrepreneurDetails (RollNo, companyRegCertificate) VALUES (?, ?)";
            pool.query(
              insertQuery,
              [rollNo, certificateLink],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into database: " + insertErr.stack,
                  );
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          } else {
            // RollNo exists, update
            const updateQuery =
              "UPDATE entrepreneurDetails SET companyRegCertificate = ? WHERE RollNo = ?";
            pool.query(
              updateQuery,
              [certificateLink, rollNo],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error("Error updating database: " + updateErr.stack);
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          }
        }
      });
    });
  });
};

export const getHigherEducationDetails = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM higherEducationDetails WHERE RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Always return an array, even if it's empty
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const updateHigherEducationDetails = (req, res) => {
  const { examName, instituteName, RollNo } = req.body;
  let sql =
    "UPDATE higherEducationDetails SET examName = ?, instituteName = ? WHERE RollNo = ?";

  pool.query(sql, [examName, instituteName, RollNo], (err, result) => {
    if (err) {
      console.error("Error executing update query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if any row is affected (indicating a successful update)
    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: "Record updated successfully",
      });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  });
};

export const getOfferLetter = (req, res) => {
  const { id } = req.body;

  // Retrieve the stored link from the database based on the provided 'id'
  const query =
    "SELECT offerLetter FROM higherEducationDetails WHERE RollNO = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { offerLetter } = result[0];

      // Check if a link is present
      if (offerLetter) {
        // Send the PDF link as the response
        res.status(200).send({ offerLetter });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};
export const uploadofferletter = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${modifiedRollNo}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");
    // Save the PDF file to the companyCertificates folder

    const filePath = path.join(parentDir, "public/offerLetters", fileName);
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if RollNo exists
      const checkQuery =
        "SELECT * FROM higherEducationDetails WHERE RollNo = ?";

      pool.query(checkQuery, [rollNo], (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Error checking RollNo existence: " + checkErr.stack);
          res.status(500).send("Internal Server Error");
        } else {
          const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
          const offerLetterLink = `${baseUrl}/offerLetters/${fileName}`;

          if (checkResult.length === 0) {
            // RollNo does not exist, insert
            const insertQuery =
              "INSERT INTO higherEducationDetails (RollNo, offerLetter) VALUES (?, ?)";
            pool.query(
              insertQuery,
              [rollNo, offerLetterLink],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into database: " + insertErr.stack,
                  );
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          } else {
            // RollNo exists, update
            const updateQuery =
              "UPDATE higherEducationDetails SET offerLetter = ? WHERE RollNo = ?";
            pool.query(
              updateQuery,
              [offerLetterLink, rollNo],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error("Error updating database: " + updateErr.stack);
                  res.status(500).send("Internal Server Error");
                } else {
                  res.status(200).send("PDF uploaded and saved to database");
                }
              },
            );
          }
        }
      });
    });
  });
};

export const deletePublication = (req, res) => {
  const { ID } = req.body;

  // Retrieve PDF link from the database based on the provided 'ID'
  const pdfQuery = "SELECT manuscript FROM publicationDetails WHERE ID = ?";
  pool.query(pdfQuery, [ID], (pdfErr, pdfResult) => {
    if (pdfErr) {
      console.error(
        "Error querying PDF link from the database: " + pdfErr.stack,
      );
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (pdfResult.length > 0) {
      const { manuscript } = pdfResult[0];

      // Check if the appointmentLetter link exists
      if (manuscript) {
        // Extract the relative file path from the link
        const relativeFilePath = manuscript.replace(
          `${process.env.REACT_APP_BACKEND_URL}/public`,
          "",
        );

        const currentModulePath = fileURLToPath(import.meta.url);
        const currentModuleDir = dirname(currentModulePath);
        // Construct the absolute file path
        const absoluteFilePath = path.join(
          currentModuleDir,
          "..",
          "public",
          relativeFilePath,
        );

        // Delete the corresponding PDF file
        fs.unlink(absoluteFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting PDF file: " + unlinkErr.stack);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          // Proceed with deleting the database entry after the file deletion
          const deleteQuery = "DELETE FROM publicationDetails WHERE ID = ?";
          pool.query(deleteQuery, [ID], (deleteErr, result) => {
            if (deleteErr) {
              console.error("Error executing delete query:", deleteErr);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              // Check if any row is affected (indicating a successful delete)
              if (result.affectedRows > 0) {
                res.status(200).json({
                  success: true,
                  message: "Record deleted successfully",
                });
              } else {
                res.status(404).json({ error: "Record not found" });
              }
            }
          });
        });
      } else {
        // Proceed with deleting the database entry if no PDF link is associated
        const deleteQuery = "DELETE FROM publicationDetails WHERE ID = ?";
        pool.query(deleteQuery, [ID], (deleteErr, result) => {
          if (deleteErr) {
            console.error("Error executing delete query:", deleteErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Check if any row is affected (indicating a successful delete)
            if (result.affectedRows > 0) {
              res.status(200).json({
                success: true,
                message: "Record deleted successfully",
              });
            } else {
              res.status(404).json({ error: "Record not found" });
            }
          }
        });
      }
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  });
};

export const addPublication = (req, res) => {
  // console.log(req);
  const {
    publishedIn,
    articleTitle,
    publicationDoi,
    publishedArticleLink,
    roll,
    ID,
  } = req.body;

  const sql =
    "UPDATE publicationDetails SET publishedIn = ?, articleTitle = ?, publicationDoi = ?, publishedArticleLink  = ?,RollNo = ? WHERE ID = ?";
  // console.log(ID);

  pool.query(
    sql,
    [publishedIn, articleTitle, publicationDoi, publishedArticleLink, roll, ID],
    (err, result) => {
      if (err) {
        // console.error("Error executing insert query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // console.log(result);
      // Check if a new row is inserted (indicating a successful add)
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
          message: "Record added successfully",
        });
      } else {
        res.status(400).json({ error: "Failed to add record" });
      }
    },
  );
};

export const getPublication = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM publicationDetails where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Always return an array, even if it's empty
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const uploadManuscript = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { id, rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${id}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");

    // Create a directory if it doesn't exist
    const rollNoDir = path.join(
      parentDir,
      "public/manuscripts",
      modifiedRollNo,
    );
    if (!fs.existsSync(rollNoDir)) {
      fs.mkdirSync(rollNoDir);
    }

    // Save the PDF file inside the rollNo directory
    const filePath = path.join(rollNoDir, fileName);
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Insert into the database without checking if RollNo exists
      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
      const manuscriptLink = `${baseUrl}/manuscripts/${modifiedRollNo}/${fileName}`;

      const insertQuery =
        "INSERT INTO publicationDetails (id, manuscript) VALUES (?, ?)";
      pool.query(
        insertQuery,
        [id, manuscriptLink],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into database: " + insertErr.stack);
            res.status(500).send("Internal Server Error");
          } else {
            res.status(200).send("PDF uploaded and saved to database");
          }
        },
      );
    });
  });
};

export const getManuscript = (req, res) => {
  const { id } = req.body;

  // Retrieve PDF data from the database based on the provided 'id'
  const query = "SELECT manuscript FROM publicationDetails WHERE ID = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { manuscript } = result[0];

      // Check if a link is present
      if (manuscript) {
        // Send the PDF link as the response
        res.status(200).send({ manuscript });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};

export const addInterInstituteActivity = (req, res) => {
  // console.log(req);
  const { collegeName, eventName, eventDate, position, roll, ID } = req.body;

  const sql =
    "UPDATE interInstituteEventDetails SET collegeName = ?, eventName = ?, eventDate = ?, RollNo = ?,position = ? WHERE ID = ?";
  // console.log(ID);

  pool.query(
    sql,
    [collegeName, eventName, eventDate, roll, position, ID],
    (err, result) => {
      if (err) {
        // console.error("Error executing insert query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // console.log(result);
      // Check if a new row is inserted (indicating a successful add)
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
          message: "Record added successfully",
        });
      } else {
        res.status(400).json({ error: "Failed to add record" });
      }
    },
  );
};

export const getInterInstituteActivity = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM interInstituteEventDetails where RollNo = ?";
  pool.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the user with the given credentials exists
    const user = results || [];

    res.status(200).json({
      user,
      success: true,
    });
  });
};

export const uploadCertificate = (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const { buffer, originalname } = req.file;
    const { id, rollNo } = req.body;

    let modifiedRollNo = rollNo.replace(/\//g, "-");
    const fileName = `${id}.pdf`;

    // Get the current module's directory
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = dirname(currentModulePath);
    const parentDir = resolve(currentModuleDir, "..");

    // Create a directory if it doesn't exist
    const rollNoDir = path.join(
      parentDir,
      "public/certificates",
      modifiedRollNo,
    );
    if (!fs.existsSync(rollNoDir)) {
      fs.mkdirSync(rollNoDir);
    }

    // Save the PDF file inside the rollNo directory
    const filePath = path.join(rollNoDir, fileName);
    fs.writeFile(filePath, buffer, (writeErr) => {
      if (writeErr) {
        console.error("Error saving PDF to file: " + writeErr.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Insert into the database without checking if RollNo exists
      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/public`;
      const certificateLink = `${baseUrl}/certificates/${modifiedRollNo}/${fileName}`;

      const insertQuery =
        "INSERT INTO  interInstituteEventDetails (id, certificate) VALUES (?, ?)";
      pool.query(
        insertQuery,
        [id, certificateLink],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into database: " + insertErr.stack);
            res.status(500).send("Internal Server Error");
          } else {
            res.status(200).send("PDF uploaded and saved to database");
          }
        },
      );
    });
  });
};

export const getCertificate = (req, res) => {
  const { id } = req.body;

  // Retrieve PDF data from the database based on the provided 'id'
  const query =
    "SELECT certificate FROM interInstituteEventDetails WHERE ID = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const { certificate } = result[0];

      // Check if a link is present
      if (certificate) {
        // Send the PDF link as the response
        res.status(200).send({ certificate });
      } else {
        res.status(404).send("PDF link not found");
      }
    } else {
      res.status(404).send("PDF link not found");
    }
  });
};

export const deleteInterInstituteActivity = (req, res) => {
  const { ID } = req.body;

  // Retrieve PDF link from the database based on the provided 'ID'
  const pdfQuery =
    "SELECT certificate FROM interInstituteEventDetails WHERE ID = ?";
  pool.query(pdfQuery, [ID], (pdfErr, pdfResult) => {
    if (pdfErr) {
      console.error(
        "Error querying PDF link from the database: " + pdfErr.stack,
      );
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (pdfResult.length > 0) {
      const { certificate } = pdfResult[0];

      // Check if the appointmentLetter link exists
      if (certificate) {
        // Extract the relative file path from the link
        const relativeFilePath = certificate.replace(
          `${process.env.REACT_APP_BACKEND_URL}/public`,
          "",
        );

        const currentModulePath = fileURLToPath(import.meta.url);
        const currentModuleDir = dirname(currentModulePath);
        // Construct the absolute file path
        const absoluteFilePath = path.join(
          currentModuleDir,
          "..",
          "public",
          relativeFilePath,
        );

        // Delete the corresponding PDF file
        fs.unlink(absoluteFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting PDF file: " + unlinkErr.stack);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          // Proceed with deleting the database entry after the file deletion
          const deleteQuery =
            "DELETE FROM interInstituteEventDetails WHERE ID = ?";
          pool.query(deleteQuery, [ID], (deleteErr, result) => {
            if (deleteErr) {
              console.error("Error executing delete query:", deleteErr);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              // Check if any row is affected (indicating a successful delete)
              if (result.affectedRows > 0) {
                res.status(200).json({
                  success: true,
                  message: "Record deleted successfully",
                });
              } else {
                res.status(404).json({ error: "Record not found" });
              }
            }
          });
        });
      } else {
        // Proceed with deleting the database entry if no PDF link is associated
        const deleteQuery =
          "DELETE FROM interInstituteEventDetails WHERE ID = ?";
        pool.query(deleteQuery, [ID], (deleteErr, result) => {
          if (deleteErr) {
            console.error("Error executing delete query:", deleteErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Check if any row is affected (indicating a successful delete)
            if (result.affectedRows > 0) {
              res.status(200).json({
                success: true,
                message: "Record deleted successfully",
              });
            } else {
              res.status(404).json({ error: "Record not found" });
            }
          }
        });
      }
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  });
};

export const getAcknowledgement = async (req, res) => {
  const { rollNo } = req.body;

  // Mapping object for table display names
  const tableDisplayNames = {
    entrepreneurDetails: "Entrepreneurship Details",
    EventDetails: "Professional Activities",
    higherEducationDetails: "Higher Education Details",
    placementData: "Placement Details",
    publicationDetails: "Publication Details",
    studentPersonalDetails: "Personal Details",
    interInstituteEventDetails: "Inter-Institute Events",
    btechEducationalDetails: "Educational Details",
  };

  const tables = Object.keys(tableDisplayNames);
  const presentTables = [];
  const absentTables = [];

  const checkRollNoInTable = (table) => {
    const query = `SELECT 1 FROM \`${table}\` WHERE RollNo = ? LIMIT 1`;
    pool.query(query, [rollNo], (err, result) => {
      if (err) {
        console.error("Error querying database: " + err.stack);
        return;
      }

      if (result.length > 0) {
        presentTables.push(tableDisplayNames[table]);
      } else {
        absentTables.push(tableDisplayNames[table]);
      }

      if (tables.length === presentTables.length + absentTables.length) {
        // Once all tables have been checked, send the response
        res.status(200).send({ presentTables, absentTables });
      }
    });
  };

  tables.forEach((table) => checkRollNoInTable(table));
};

export const forgotStudentPassword = (req, res) => {
  const { email } = req.body;

  pool.query(
    "SELECT * FROM student_auth WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.TOKEN_EXPIRY}m`,
        algorithm: "HS256",
      });

      const expiryTime = new Date(
        Date.now() + Number(process.env.TOKEN_EXPIRY) * 60000
      );

      pool.query(
        "UPDATE student_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
        [resetToken, expiryTime, email],
        async (updateErr) => {
          if (updateErr) {
            console.error("Database Update Error:", updateErr);
            return res.status(500).json({ error: "Internal server error" });
          }

          const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

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

          try {
            const response = await axios.post(
              'https://api.brevo.com/v3/smtp/email',
              emailData,
              {
                headers: {
                  'api-key': process.env.BREVO_API_KEY,
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log("✅ Reset email sent to student via Brevo:", response.data);
            res.json({ message: "Reset link sent to student email" });
          } catch (emailErr) {
            console.error("❌ Brevo error sending email:", emailErr.response?.data || emailErr.message);
            return res.status(500).json({ error: "Failed to send reset email" });
          }
        }
      );
    }
  );
};


export const resetStudentPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    pool.query(
      "SELECT * FROM student_auth WHERE email = ? AND reset_token = ?",
      [email, token],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length === 0) {
          return res.status(400).json({ error: "Invalid or expired token" });
        }

        if (new Date(result[0].token_expiry) < new Date()) {
          return res.status(400).json({ error: "Token expired" });
        }

        bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Password Hashing Error:", hashErr);
            return res.status(500).json({ error: "Failed to hash password" });
          }

          pool.query(
            "UPDATE student_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
            [hashedPassword, email],
            (updateErr) => {
              if (updateErr) {
                console.error("Database Update Error:", updateErr);
                return res.status(500).json({ error: "Failed to reset password" });
              }

              res.json({ message: "Student password reset successful" });
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Reset Token Error:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
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
                  WHERE department_id IN (SELECT department_id FROM student_auth WHERE RollNo = ?);
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



export const studentRefreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required!" });
  }

  // Query to check the refresh token and its expiry time
  pool.query(
    `SELECT sa.roll_no, sa.refresh_token, sa.refresh_token_expiry, sa.position_id, sa.role_assigned 
     FROM student_auth sa
     WHERE sa.refresh_token = ?`,
    [refreshToken],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Server error!" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid refresh token!" });
      }

      const user = results[0];
      const tokenExpiry = new Date(user.refresh_token_expiry);

      // Check if the refresh token has expired
      if (tokenExpiry < new Date()) {
        return res.status(401).json({ message: "Refresh token expired!" });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired refresh token!" });
        }

        // Generate new access token using roll_no, position, and role_assigned
        const newAccessToken = generateStudentAccessToken(user.roll_no, 'Student', user.role_assigned);

        // Send back the new access token
        res.json({ accessToken: newAccessToken });
      });
    }
  );
};

export const studentLogin = async (req, res) => {
  const { roll_no, password } = req.body;

  if (!roll_no || !password) {
    errorLogger.error(`Login failed: Roll number or password missing. Roll No: ${roll_no}`);
    return res.status(400).json({ message: "Roll number and password are required!" });
  }

  try {
    const [results] = await promisePool.query(
      `SELECT sa.*, pt.position_name, sar.role_name AS role_assigned_name, dd.department_name
       FROM student_auth sa
       LEFT JOIN position_type pt ON sa.position_id = pt.position_id
       LEFT JOIN student_available_roles sar ON sa.role_assigned = sar.role_id
       LEFT JOIN department_details dd ON sa.department_id = dd.department_id
       WHERE sa.roll_no = ?`,
      [roll_no]
    );

    if (results.length === 0) {
      errorLogger.error(`Student not found. Roll No: ${roll_no}`);
      return res.status(404).json({ message: "Student not found!" });
    }

    const student = results[0];
    const { position_name, role_assigned_name, department_name } = student;

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      errorLogger.error(`Invalid password attempt. Roll No: ${roll_no}`);
      return res.status(401).json({ message: "Invalid password!" });
    }

    const accessToken = generateAccessToken(roll_no, position_name, role_assigned_name);
    const refreshToken = generateRefreshToken(roll_no, position_name, role_assigned_name);

    const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
    const refreshTokenExpiry = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    ).toISOString().slice(0, 19).replace("T", " ");

    await promisePool.query(
      "UPDATE student_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE roll_no = ?",
      [refreshToken, refreshTokenExpiry, roll_no]
    );

    const ipAddress = requestIp.getClientIp(req);
    const userAgent = req.headers['user-agent'];

    await promisePool.query(
      "INSERT INTO student_login_activity (roll_no, ip_address, user_agent) VALUES (?, ?, ?)",
      [roll_no, ipAddress, userAgent]
    );

    userActionLogger.info(`Student login successful. Roll No: ${roll_no}, IP: ${ipAddress}`);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.json({
      message: "Login successful!",
      user: {
        roll_no: student.roll_no,
        position: position_name,
        role_assigned: role_assigned_name,
        department_name: department_name,
      },
    });
  } catch (err) {
    errorLogger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

export const studentLogout = async (req, res) => {
  const { roll_no } = req.body;

  if (!roll_no) {
    errorLogger.error(`Logout failed: Roll No missing. Roll No: ${roll_no}`);
    return res.status(400).json({ message: "Roll No is required!" });
  }

  try {
    await promisePool.query(
      "UPDATE student_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE roll_no = ?",
      [roll_no]
    );

    userActionLogger.info(`Student logged out successfully. Roll No: ${roll_no}`);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully!" });
  } catch (err) {
    errorLogger.error(`Logout error: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

// Controller to Get Student Details using query parameter
export const getStudentDetails = async (req, res) => {
  const { roll_no } = req.query; // Get the roll_no from query parameters

  if (!roll_no) {
    return res.status(400).json({ message: "Roll number is required in the query." });
  }

  try {
    // Fetch student details by roll_no
    const [rows] = await promisePool.query("SELECT * FROM student_details WHERE roll_no = ?", [roll_no]);

    if (rows.length === 0) {
      userActionLogger.info(`Student with roll_no ${roll_no} not found.`);
      return res.status(404).json({ message: "Student not found." });
    }

    userActionLogger.info(`Student details for ${roll_no} fetched successfully.`);
    return res.json({ student: rows[0] }); // Return the student details
  } catch (err) {
    errorLogger.error(`Error fetching student details for ${roll_no}: ${err.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Controller to Add New Student
export const addStudentDetails = async (req, res) => {
  const { roll_no, student_name, father_name, mother_name, personal_contact, parent_contact, personal_email, dtu_email, original_city, original_country } = req.body;

  // Validate input fields
  if (!roll_no || !student_name || !father_name || !mother_name || !personal_contact || !parent_contact || !personal_email || !dtu_email || !original_city || !original_country) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Insert new student details into the table
    const result = await promisePool.query(
      `INSERT INTO student_details (roll_no, student_name, father_name, mother_name, personal_contact, parent_contact, personal_email, dtu_email, original_city, original_country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [roll_no, student_name, father_name, mother_name, personal_contact, parent_contact, personal_email, dtu_email, original_city, original_country]
    );

    userActionLogger.info(`New student added with roll_no ${roll_no}.`);
    return res.status(201).json({ message: "Student added successfully!" });
  } catch (err) {
    errorLogger.error(`Error adding student with roll_no ${roll_no}: ${err.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller to Update Student Details
export const updateStudentDetails = async (req, res) => {
  const { roll_no } = req.params; // Get the roll_no from request params
  const { student_name, father_name, mother_name, personal_contact, parent_contact, personal_email, dtu_email, original_city, original_country } = req.body;

  try {
    // Check if student exists
    const [existingStudent] = await promisePool.query("SELECT * FROM student_details WHERE roll_no = ?", [roll_no]);
    
    if (existingStudent.length === 0) {
      userActionLogger.info(`Student with roll_no ${roll_no} not found for update.`);
      return res.status(404).json({ message: "Student not found." });
    }

    // Update student details
    const result = await promisePool.query(
      `UPDATE student_details SET student_name = ?, father_name = ?, mother_name = ?, personal_contact = ?, parent_contact = ?, personal_email = ?, dtu_email = ?, original_city = ?, original_country = ?
      WHERE roll_no = ?`,
      [student_name, father_name, mother_name, personal_contact, parent_contact, personal_email, dtu_email, original_city, original_country, roll_no]
    );

    userActionLogger.info(`Student details for ${roll_no} updated successfully.`);
    return res.json({ message: "Student details updated successfully!" });
  } catch (err) {
    errorLogger.error(`Error updating student details for ${roll_no}: ${err.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller to Delete Student
export const deleteStudentDetails = async (req, res) => {
  const { roll_no } = req.params; // Get the roll_no from request params

  try {
    // Check if student exists
    const [existingStudent] = await promisePool.query("SELECT * FROM student_details WHERE roll_no = ?", [roll_no]);
    
    if (existingStudent.length === 0) {
      userActionLogger.info(`Student with roll_no ${roll_no} not found for deletion.`);
      return res.status(404).json({ message: "Student not found." });
    }

    // Delete student details
    const result = await promisePool.query("DELETE FROM student_details WHERE roll_no = ?", [roll_no]);

    userActionLogger.info(`Student with roll_no ${roll_no} deleted successfully.`);
    return res.json({ message: "Student deleted successfully!" });
  } catch (err) {
    errorLogger.error(`Error deleting student with roll_no ${roll_no}: ${err.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
