import { connectDB } from "../data/database.js";
import multer from "multer";

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


// Get research papers for a faculty
export const getResearchPapers = (req, res) => {
  const { faculty_id } = req.body;
  const sql = "SELECT * FROM research_paper WHERE faculty_id = ?";

  connectDB.query(sql, [faculty_id], (err, results) => {
    if (err) {
      console.error("Error fetching research papers:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({
        research_papers: results || [],
        success: true,
      });
    }
  });
};

// Update or insert a research paper
export const updateResearchPaper = (req, res) => {
  const { PublicationID, faculty_id, title, serial_number, domain, publication_name, published_date, pdf_file_path } = req.body;

  // Check if the research paper exists in the database
  const checkQuery = "SELECT * FROM research_paper WHERE PublicationID = ?";

  connectDB.query(checkQuery, [PublicationID], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking database:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (checkResult && checkResult.length > 0) {
      // Research paper exists, update it
      const updateQuery = `
        UPDATE research_paper 
        SET title = ?, serial_number = ?, domain = ?, publication_name = ?, published_date = ?, pdf_file_path = ?
        WHERE PublicationID = ?`;

      connectDB.query(
        updateQuery,
        [title, serial_number, domain, publication_name, published_date, pdf_file_path, PublicationID],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating research paper:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({ success: true, message: "Research paper updated successfully" });
          }
        }
      );
    } else {
      // Research paper doesn't exist, insert it
      const insertQuery = `
        INSERT INTO research_paper (faculty_id, title, serial_number, domain, publication_name, published_date, pdf_file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      connectDB.query(
        insertQuery,
        [faculty_id, title, serial_number, domain, publication_name, published_date, pdf_file_path],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting research paper:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({ success: true, message: "Research paper added successfully" });
          }
        }
      );
    }
  });
};

// Delete a research paper
export const deleteResearchPaper = (req, res) => {
  const { PublicationID } = req.body;
  const deleteQuery = "DELETE FROM research_paper WHERE PublicationID = ?";

  connectDB.query(deleteQuery, [PublicationID], (err) => {
    if (err) {
      console.error("Error deleting research paper:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ success: true, message: "Research paper deleted successfully" });
    }
  });
};

export const getVAERecords = (req, res) => {
  const { faculty_id, visit_id } = req.body;

  let sql, params;

  if (visit_id) {
    // If visit_id is provided, fetch that specific record
    sql = "SELECT * FROM VAErecords WHERE visit_id = ?";
    params = [visit_id];
  } else if (faculty_id) {
    // If faculty_id is provided, fetch all records for that faculty
    sql = "SELECT * FROM VAErecords WHERE faculty_id = ?";
    params = [faculty_id];
  } else {
    res.status(400).json({ error: "Either faculty_id or visit_id must be provided" });
    return;
  }

  connectDB.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching VAE records:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ records: results, success: true });
    }
  });
};


export const updateVAERecord = (req, res) => {
  const {
    visit_id,
    faculty_id,
    visit_type,
    institution,
    course_taught,
    year_of_visit,
    hours_taught,
  } = req.body;

  const checkQuery = "SELECT * FROM VAErecords WHERE visit_id = ?";
  connectDB.query(checkQuery, [visit_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking record:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (checkResult && checkResult.length > 0) {
      // Update the existing record
      const updateQuery =
        "UPDATE VAErecords SET faculty_id = ?, visit_type = ?, institution = ?, course_taught = ?, year_of_visit = ?, hours_taught = ? WHERE visit_id = ?";
      connectDB.query(
        updateQuery,
        [
          faculty_id,
          visit_type,
          institution,
          course_taught,
          year_of_visit,
          hours_taught,
          visit_id,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating record:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({
              success: true,
              message: "Record updated successfully",
            });
          }
        }
      );
    } else {
      // Insert a new record
      const insertQuery =
        "INSERT INTO VAErecords (faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught) VALUES (?, ?, ?, ?, ?, ?)";
      connectDB.query(
        insertQuery,
        [faculty_id, visit_type, institution, course_taught, year_of_visit, hours_taught],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting record:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({
              success: true,
              message: "Record added successfully",
            });
          }
        }
      );
    }
  });
};

// Delete a VAE record
export const deleteVAERecord = (req, res) => {
  const { visit_id } = req.body;

  const deleteQuery = "DELETE FROM VAErecords WHERE visit_id = ?";
  connectDB.query(deleteQuery, [visit_id], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Record deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Record not found" });
    }
  });
};