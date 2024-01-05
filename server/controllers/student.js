import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";

export const getall = (req, res) => {
  connectDB.query("SELECT * FROM student_data", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

export const getProfessionalSKills = (req, res) => {
  const { rollno } = req.body;
  const sql = "SELECT * FROM EventDetails where RollNo = ?";
  connectDB.query(sql, [rollno], (err, results) => {
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

export const updateProfessionalSkills = (req, res) => {
  const { id, organisation, position, eventname, date,roll } = req.body;
  const sql =
    "UPDATE EventDetails SET Organisation = ?, Position = ?, EventName = ?, EventDate = ? ,RollNo = ? WHERE ID = ?";

  connectDB.query(
    sql,
    [organisation, position, eventname, date,roll, id],
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
    }
  );
};


export const deleteProfessionalSkills = (req, res) => {
  const { ID } = req.body;
  const sql = "DELETE FROM EventDetails WHERE ID = ?";

  connectDB.query(sql, [ID], (err, result) => {
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
  const { organisation, position, eventname, date, roll ,ID } = req.body;
  const sql =
    "INSERT INTO EventDetails (Organisation, Position, EventName, EventDate, RollNo ,ID) VALUES (?, ?, ?, ?, ? ,?)";

  connectDB.query(
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
    }
  );
};

