import { pool } from "../data/database.js";
import multer from "multer";
import path, { resolve } from "path";

const storage = multer.memoryStorage(); // Store the file in memory as Buffer
const upload = multer({ storage: storage });

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
  pool.query("SELECT * FROM student_data", (error, results) => {
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
          "http://localhost:3001/public",
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
      const baseUrl = "http://localhost:3001/public";
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
          const baseUrl = "http://localhost:3001/public";
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
        // const baseUrl = 'http://localhost:3001/public';
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
          const baseUrl = "http://localhost:3001/public";
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
          const baseUrl = "http://localhost:3001/public";
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
          "http://localhost:3001/public",
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
      const baseUrl = "http://localhost:3001/public";
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
      const baseUrl = "http://localhost:3001/public";
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
          "http://localhost:3001/public",
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
