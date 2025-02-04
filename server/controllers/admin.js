import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";
import exceljs from "exceljs";

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
  let { info, courseGroup, year1, year2 } = req.body;

  if (info === "mtecheducationaldetails" && courseGroup === "Btech") {
    info = "btecheducationaldetails";
  }

  // Make sure to sanitize the table name to prevent SQL injection
  const sanitizedInfo = connectDB.escapeId(info);

  let sql = "";

  if (info === "defaulters") {
    // Fetch details for students whose RollNo is in Student_data but not in both studentPersonalDetails and btechEducationalDetails

    let educationalTable = "";

    if (courseGroup === "Mtech") {
      educationalTable = "MtechEducationalDetails";
    } else {
      educationalTable = "btechEducationalDetails";
    }

    sql = `
      SELECT Student_data.RollNo, Student_data.studentName, Student_data.batch
      FROM Student_data
      LEFT JOIN studentPersonalDetails ON Student_data.RollNo = studentPersonalDetails.RollNo
      LEFT JOIN ${educationalTable} ON Student_data.RollNo = ${educationalTable}.RollNo
      WHERE (studentPersonalDetails.RollNo IS NULL
        OR ${educationalTable}.RollNo IS NULL)
        AND Student_data.batch BETWEEN ? AND ?
        AND Student_data.Course = ?
    `;
  } else {
    // Fetch details based on the specified info, assuming info is not 'defaulters'
    sql = `
      SELECT Student_data.studentName,${sanitizedInfo}.*
      FROM Student_data
      INNER JOIN ${sanitizedInfo} ON Student_data.RollNo = ${sanitizedInfo}.RollNo
      WHERE Student_data.batch BETWEEN ? AND ?
        AND Student_data.Course = ?
    `;
  }

  // Assuming you're using a library that supports parameterized queries (to prevent SQL injection)
  connectDB.query(sql, [year1, year2, courseGroup], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ data: results });
  });
};

export const getExcel = (req, res) => {
  const tableRows = req.body.tableRows;

  // Create a workbook and add a worksheet
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add data to the worksheet
  tableRows.forEach((row) => {
    worksheet.addRow(row);
  });

  // Save the workbook to a buffer
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      // Send the buffer as the response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", "attachment; filename=output.xlsx");
      res.send(Buffer.from(buffer));
    })
    .catch((error) => {
      console.error("Error generating Excel:", error);
      res.status(500).send("Internal Server Error");
    });
};
