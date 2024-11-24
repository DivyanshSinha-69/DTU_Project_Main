import { connectDB } from "../data/database.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import path, { resolve, dirname } from 'path';
import fs from 'fs';

// Set up multer to handle image uploads
const storage = multer.memoryStorage(); // Store the file in memory as Buffer
const upload = multer({ storage: storage });

// Upload faculty image
export const uploadFacultyImage = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Error uploading image: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    const { originalname, buffer } = req.file;
    const { faculty_id } = req.body;
    const base64Image = buffer.toString('base64');

    // Check if the faculty_id already exists in the database
    const checkQuery = 'SELECT * FROM faculty_images WHERE faculty_id = ?';

    connectDB.query(checkQuery, [faculty_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking database: ' + checkErr.stack);
        res.status(500).send('Internal Server Error');
      } else {
        if (checkResult && checkResult.length > 0) {
          // Faculty exists, perform an update
          const updateQuery = 'UPDATE faculty_images SET originalname = ?, image_data = ? WHERE faculty_id = ?';

          connectDB.query(updateQuery, [originalname, base64Image, faculty_id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating database: ' + updateErr.stack);
              res.status(500).send('Internal Server Error');
            } else {
              res.status(200).send('Image updated in the database');
            }
          });
        } else {
          // Faculty doesn't exist, perform an insert
          const insertQuery = 'INSERT INTO faculty_images (faculty_id, originalname, image_data) VALUES (?, ?, ?)';

          connectDB.query(insertQuery, [faculty_id, originalname, base64Image], (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error inserting into database: ' + insertErr.stack);
              res.status(500).send('Internal Server Error');
            } else {
              res.status(200).send('Image uploaded and saved to database');
            }
          });
        }
      }
    });
  });
};

// Get faculty image
export const getFacultyImage = (req, res) => {
  const { faculty_id } = req.body;

  // Retrieve the image from the database based on the faculty_id
  const query = 'SELECT image_data FROM faculty_images WHERE faculty_id = ?';

  connectDB.query(query, [faculty_id], (err, result) => {
    if (err) {
      console.error('Error fetching image: ' + err.stack);
      res.status(500).send('Internal Server Error');
    } else {
      if (result && result.length > 0) {
        const base64Image = result[0].image_data;
        res.status(200).send({ image: base64Image });
      } else {
        res.status(404).send('Image not found');
      }
    }
  });
};

export const getall = (req, res) => {
  connectDB.query("SELECT * FROM qualification", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

export const getFacultyDetails = (req, res) => {
  const { faculty_id } = req.body;
  const sql = "SELECT * FROM qualification WHERE faculty_id = ?";
  
  connectDB.query(sql, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Always return an array, even if it's empty
    const faculty = results || [];

    res.status(200).json({
      faculty,
      success: true,
    });
  });
};

export const updateFacultyDetails = (req, res) => {
  const { faculty_id, faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number } = req.body;

  // Check if the record exists in the database
  const checkQuery = 'SELECT * FROM qualification WHERE faculty_id = ?';

  connectDB.query(checkQuery, [faculty_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking database:', checkErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (checkResult && checkResult.length > 0) {
      // Record exists, perform an update
      const updateQuery =
        'UPDATE qualification SET faculty_name = ?, degree = ?, university = ?, year_of_attaining_highest_degree = ?, email_id = ?, mobile_number = ? WHERE faculty_id = ?';

      connectDB.query(
        updateQuery,
        [faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number, faculty_id],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error executing update query:', updateErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({
              success: true,
              message: 'Record updated successfully',
            });
          }
        }
      );
    } else {
      // Record doesn't exist, perform an insert
      const insertQuery =
        'INSERT INTO qualification (faculty_id, faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number) VALUES (?, ?, ?, ?, ?, ?, ?)';

      connectDB.query(
        insertQuery,
        [faculty_id, faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting into database:', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({
              success: true,
              message: 'Record added successfully',
            });
          }
        }
      );
    }
  });
};

export const addFacultyDetails = (req, res) => {
  const { faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number } = req.body;

  // Query to insert data into the qualification table
  const insertQuery =
    "INSERT INTO qualification (faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number) VALUES (?, ?, ?, ?, ?, ?)";

  connectDB.query(
    insertQuery,
    [faculty_name, degree, university, year_of_attaining_highest_degree, email_id, mobile_number],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).json({ success: false, message: "Email ID or Mobile Number already exists" });
        } else {
          console.error("Error inserting into database:", err);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        }
      } else {
        res.status(201).json({
          success: true,
          message: "Faculty details added successfully",
          faculty_id: result.insertId, // Return the auto-generated faculty ID
        });
      }
    }
  );
};



// Get association details for a faculty
export const getAssociationDetails = (req, res) => {
  const { faculty_id } = req.body;
  const sql = "SELECT * FROM association WHERE faculty_id = ?";

  connectDB.query(sql, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error executing fetch query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Always return an array, even if it's empty
    const association = results || [];

    res.status(200).json({
      association,
      success: true,
    });
  });
};

export const addAssociationDetails = (req, res) => {
  const { 
    faculty_id, 
    designation, 
    date_asg_prof, 
    date_asg_astprof, 
    date_asg_asoprof, 
    date_end_prof, 
    date_end_astprof, 
    date_end_asoprof, 
    date_joining, 
    specialization 
  } = req.body;

  // Insert the new record into the association table
  const insertQuery = `
    INSERT INTO association 
    (faculty_id, designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connectDB.query(
    insertQuery,
    [faculty_id, designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization],
    (err, results) => {
      if (err) {
        console.error('Error inserting into association table:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ 
            error: 'Invalid faculty_id. Ensure the faculty exists in the qualification table.' 
          });
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Association record added successfully',
      });
    }
  );
};


// Update association details for a faculty
export const updateAssociationDetails = (req, res) => {
  const { faculty_id, designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization } = req.body;

  // Check if the record exists in the database
  const checkQuery = 'SELECT * FROM association WHERE faculty_id = ?';

  connectDB.query(checkQuery, [faculty_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking database:', checkErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (checkResult && checkResult.length > 0) {
      // Record exists, perform an update
      const updateQuery =
        'UPDATE association SET designation = ?, date_asg_prof = ?, date_asg_astprof = ?, date_asg_asoprof = ?, date_end_prof = ?, date_end_astprof = ?, date_end_asoprof = ?, date_joining = ?, specialization = ? WHERE faculty_id = ?';

      connectDB.query(
        updateQuery,
        [designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization, faculty_id],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error executing update query:', updateErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({
              success: true,
              message: 'Association record updated successfully',
            });
          }
        }
      );
    } else {
      // Record doesn't exist, perform an insert
      const insertQuery =
        'INSERT INTO association (faculty_id, designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      connectDB.query(
        insertQuery,
        [faculty_id, designation, date_asg_prof, date_asg_astprof, date_asg_asoprof, date_end_prof, date_end_astprof, date_end_asoprof, date_joining, specialization],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting into database:', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({
              success: true,
              message: 'Association record added successfully',
            });
          }
        }
      );
    }
  });
};


// Setup multer storage configuration


export const addResearchPaper = (req, res) => {
  // Use multer to handle file upload in the incoming request
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading PDF:", err);
      return res.status(500).send("Error uploading PDF");
    }

    // Extract form data and file from the request
    const { buffer, originalname } = req.file;
    const { faculty_id, title, serial_number, domain, publication_name, published_date } = req.body;

    // Sanitize the serial_number to avoid issues with file names
    const sanitizedSerialNumber = serial_number.replace(/\//g, "-");
    const fileName = `${sanitizedSerialNumber}.pdf`;

    // Construct the folder path where the file will be stored
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDir = path.dirname(currentModulePath);
    const parentDir = path.resolve(currentModuleDir, "..");
    const facultyDir = path.join(parentDir, "public", "Faculty", "ResearchPapers", faculty_id.toString());

    // Create directory if it does not exist
    if (!fs.existsSync(facultyDir)) {
      fs.mkdirSync(facultyDir, { recursive: true });
    }

    const filePath = path.join(facultyDir, fileName);

    // Check if the research paper already exists in the database for the given faculty_id and serial_number
    const checkQuery = "SELECT * FROM research_paper WHERE faculty_id = ? AND serial_number = ?";
    connectDB.query(checkQuery, [faculty_id, serial_number], (selectErr, results) => {
      if (selectErr) {
        console.error("Error checking existing research papers:", selectErr);
        return res.status(500).send("Error checking research paper");
      }

      if (results.length > 0) {
        // If the research paper already exists, we update the existing record
        const updateQuery = `
          UPDATE research_paper
          SET title = ?, domain = ?, publication_name = ?, published_date = ?, pdf_file_path = ?
          WHERE faculty_id = ? AND serial_number = ?`;

        connectDB.query(
          updateQuery,
          [title, domain, publication_name, published_date, filePath, faculty_id, serial_number],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating research paper:", updateErr);
              return res.status(500).send("Error updating research paper");
            }

            // Write the file to the server
            fs.writeFile(filePath, buffer, (writeErr) => {
              if (writeErr) {
                console.error("Error saving PDF to file:", writeErr);
                return res.status(500).send("Error saving PDF");
              }

              return res.status(200).json({
                success: true,
                message: "Research paper updated successfully",
                pdf_url: `/public/Faculty/${faculty_id}/ResearchPapers/${fileName}`,
              });
            });
          }
        );
      } else {
        // If the research paper doesn't exist, insert a new record
        const insertQuery = `
          INSERT INTO research_paper (faculty_id, title, serial_number, domain, publication_name, published_date, pdf_file_path)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;

        connectDB.query(
          insertQuery,
          [faculty_id, title, serial_number, domain, publication_name, published_date, filePath],
          (insertErr) => {
            if (insertErr) {
              console.error("Error inserting research paper into database:", insertErr);
              return res.status(500).send("Error inserting research paper");
            }

            // Write the file to the server
            fs.writeFile(filePath, buffer, (writeErr) => {
              if (writeErr) {
                console.error("Error saving PDF to file:", writeErr);
                return res.status(500).send("Error saving PDF");
              }

              return res.status(200).json({
                success: true,
                message: "Research paper added successfully",
                pdf_url: `/public/Faculty/${faculty_id}/ResearchPapers/${fileName}`,
              });
            });
          }
        );
      }
    });
  });
};



// Get research papers for a faculty

export const getResearchPaper = (req, res) => {
  const { faculty_id } = req.body;

  const selectQuery = `SELECT * FROM research_paper WHERE faculty_id = ?`;

  connectDB.query(selectQuery, [faculty_id], (selectErr, results) => {
    if (selectErr) {
      console.error("Error fetching research papers:", selectErr);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      const formattedResults = results.map((paper) => {
        return {
          PublicationID: paper.PublicationID,
          faculty_id: paper.faculty_id,
          title: paper.title,
          serial_number: paper.serial_number,
          domain: paper.domain,
          publication_name: paper.publication_name,
          published_date: paper.published_date,
          pdf_url: paper.pdf_file_path,
        };
      });

      res.status(200).json({
        success: true,
        message: "Research papers retrieved successfully",
        data: formattedResults,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No research papers found for the given faculty_id",
        data: [],
      });
    }
  });
};

// Delete research paper by PublicationID
export const deleteResearchPaper = (req, res) => {
  const { PublicationID } = req.params;

  // Ensure the PublicationID is an integer
  if (isNaN(PublicationID)) {
    return res.status(400).json({
      success: false,
      message: "Invalid PublicationID, it should be an integer"
    });
  }

  // Query to get the research paper details by PublicationID
  const selectQuery = "SELECT * FROM research_paper WHERE PublicationID = ?";
  
  connectDB.query(selectQuery, [PublicationID], (selectErr, results) => {
    if (selectErr) {
      console.error("Error fetching research paper details:", selectErr);
      return res.status(500).send("Error fetching research paper details");
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found"
      });
    }

    // Extract file path from the query result
    const filePath = results[0].pdf_file_path;
    const fileName = path.basename(filePath);  // Get the file name from the path
    const folderPath = path.dirname(filePath); // Get the folder where the file is located

    console.log("File path to delete:", filePath); // Debug log for file path

    // Delete the file from the server
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting PDF file:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting PDF file"
        });
      }

      // Now delete the record from the database
      const deleteQuery = "DELETE FROM research_paper WHERE PublicationID = ?";
      connectDB.query(deleteQuery, [PublicationID], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting research paper from database:", deleteErr);
          return res.status(500).json({
            success: false,
            message: "Error deleting research paper from database"
          });
        }

        console.log("Research paper deleted successfully");

        return res.status(200).json({
          success: true,
          message: "Research paper and PDF deleted successfully"
        });
      });
    });
  });
};

// Controller to add VAE record
export const addVAERecord = (req, res) => {
  const { faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught } = req.body;

  // Query to insert the VAE record
  const query = `
    INSERT INTO VAErecords (faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught)
    VALUES (?, ?, ?, ?, ?, ?)`;

  connectDB.query(query, [faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught], (err, result) => {
    if (err) {
      console.error("Error inserting VAE record:", err);
      return res.status(500).json({ message: 'Error inserting VAE record', error: err });
    }

    res.status(200).json({
      success: true,
      message: 'VAE record created successfully',
      data: result,
    });
  });
};





// Controller to get VAE records by faculty_id (using PUT)
export const getVAERecord = (req, res) => {
  const { faculty_id } = req.body;  // Get faculty_id from request body

  if (!faculty_id) {
    return res.status(400).json({ success: false, message: "faculty_id is required" });
  }

  // Query to fetch VAE records for the given faculty_id
  const query = 'SELECT * FROM VAErecords WHERE faculty_id = ?';

  connectDB.query(query, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error fetching VAE records:", err);
      return res.status(500).json({ success: false, message: 'Error fetching VAE records', error: err });
    }

    if (results.length > 0) {
      res.status(200).json({
        success: true,
        message: 'VAE records fetched successfully',
        data: results,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No VAE records found for the given faculty_id',
        data: [],
      });
    }
  });
};





// Controller to update VAE record by visit_id
// Controller to update an existing VAE record
export const updateVAERecord = (req, res) => {
  const { visit_id, faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught } = req.body;

  // Ensure that the visit_id and faculty_id are provided
  if (!visit_id || !faculty_id) {
    return res.status(400).json({
      success: false,
      message: "visit_id and faculty_id are required"
    });
  }

  // Query to check if the VAE record exists for the given visit_id and faculty_id
  const checkQuery = "SELECT * FROM VAErecords WHERE visit_id = ? AND faculty_id = ?";
  
  connectDB.query(checkQuery, [visit_id, faculty_id], (selectErr, results) => {
    if (selectErr) {
      console.error("Error checking existing VAE record:", selectErr);
      return res.status(500).json({
        success: false,
        message: "Error checking existing VAE record"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "VAE record not found for the given visit_id and faculty_id"
      });
    }

    // If record exists, proceed to update the VAE record
    const updateQuery = `
      UPDATE VAErecords
      SET visit_type = ?, institution = ?, course_taught = ?, year_of_visit = ?, hours_taught = ?
      WHERE visit_id = ? AND faculty_id = ?`;

    connectDB.query(updateQuery, [visit_type, institution, course_taught, year_of_visit, hours_taught, visit_id, faculty_id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating VAE record:", updateErr);
        return res.status(500).json({
          success: false,
          message: "Error updating VAE record"
        });
      }

      res.status(200).json({
        success: true,
        message: "VAE record updated successfully"
      });
    });
  });
};




// Controller to delete an existing VAE record
export const deleteVAERecord = (req, res) => {
  const { visit_id, faculty_id } = req.body;

  // Ensure that visit_id and faculty_id are provided
  if (!visit_id || !faculty_id) {
    return res.status(400).json({
      success: false,
      message: "visit_id and faculty_id are required"
    });
  }

  // Query to check if the VAE record exists for the given visit_id and faculty_id
  const checkQuery = "SELECT * FROM VAErecords WHERE visit_id = ? AND faculty_id = ?";
  
  connectDB.query(checkQuery, [visit_id, faculty_id], (selectErr, results) => {
    if (selectErr) {
      console.error("Error checking VAE record:", selectErr);
      return res.status(500).json({
        success: false,
        message: "Error checking VAE record"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "VAE record not found for the given visit_id and faculty_id"
      });
    }

    // If the record exists, proceed to delete it
    const deleteQuery = "DELETE FROM VAErecords WHERE visit_id = ? AND faculty_id = ?";
    
    connectDB.query(deleteQuery, [visit_id, faculty_id], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting VAE record:", deleteErr);
        return res.status(500).json({
          success: false,
          message: "Error deleting VAE record"
        });
      }

      res.status(200).json({
        success: true,
        message: "VAE record deleted successfully"
      });
    });
  });
};
