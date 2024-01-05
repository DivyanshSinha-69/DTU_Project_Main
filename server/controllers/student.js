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
