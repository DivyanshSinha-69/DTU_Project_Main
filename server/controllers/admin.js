import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";
import exceljs from 'exceljs';

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
  });
};

export const getExcel= (req, res) => {
  const tableRows = req.body.tableRows;
  console.log(tableRows);

  // Create a workbook and add a worksheet
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Add data to the worksheet
  tableRows.forEach(row => {
    worksheet.addRow(row);
  });

  // Save the workbook to a buffer
  workbook.xlsx.writeBuffer()
    .then(buffer => {
      // Send the buffer as the response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.send(Buffer.from(buffer));
    })
    .catch(error => {
      console.error('Error generating Excel:', error);
      res.status(500).send('Internal Server Error');
    });
};
