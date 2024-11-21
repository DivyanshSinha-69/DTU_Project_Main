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

