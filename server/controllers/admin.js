import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";


export const getall = (req, res) => {
  connectDB.query("SELECT * FROM admin_data", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });


};

export const getData = (req, res) => {
  const { info, courseGroup, year1, year2 } = req.body;

  // Make sure to sanitize the table name to prevent SQL injection
  const sanitizedInfo = connectDB.escapeId(info);

  const sql = `
    SELECT ${sanitizedInfo}.*
    FROM Student_data
    INNER JOIN ${sanitizedInfo} ON Student_data.RollNo = ${sanitizedInfo}.RollNo
    WHERE Student_data.batch BETWEEN ? AND ?
    AND Student_data.Course = ?
  `;

  // Assuming you're using a library that supports parameterized queries (to prevent SQL injection)
  connectDB.query(sql, [year1, year2, courseGroup], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ data: results });
    console.log({ data: results });
  });
};

