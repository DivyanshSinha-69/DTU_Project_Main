import { pool } from "../data/database.js"; // Import MySQL2 connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gmail transporter setup (commented out for Brevo SMTP)
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// Brevo SMTP transporter setup
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST, // Brevo SMTP server
//   port: parseInt(process.env.SMTP_PORT), // Use 587 for TLS
//   secure: false, // Set to false for TLS
//   auth: {
//     user: process.env.BREVO_SMTP_EMAIL_USER, // Your Brevo SMTP username (SMTP key)
//     pass: process.env.BREVO_SMTP_EMAIL_PASS, // Your Brevo SMTP password (SMTP key)
//   },
// });
// 🔹 Generate Access Token (Short-lived)

const generateAccessToken = (department_id, position) => {
  return jwt.sign({ department_id, position }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

//Generate Refresh Token(Long - lived)
const generateRefreshToken = (department_id) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign({ department_id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expirySeconds,
  });
};

export const getCirculars = (req, res) => {
  const { department_id } = req.query;

  let query = "SELECT * FROM department_circular";
  let params = [];

  if (department_id) {
    query += " WHERE department_id = ?";
    params.push(department_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching circulars:", err);
      return res
        .status(500)
        .json({ message: "Error fetching circulars", error: err });
    }

    if (department_id && results.length === 0) {
      return res
        .status(404)
        .json({ message: "No circulars found for this department" });
    }

    res
      .status(200)
      .json({ message: "Circulars retrieved successfully", data: results });
  });
};

export const addCircular = (req, res) => {
  const {
    department_id,
    circular_number,
    circular_name,
    circular_date,
    subject,
  } = req.body;

  // Check if all required fields are present
  if (
    !department_id ||
    !circular_number ||
    !circular_name ||
    !circular_date ||
    !subject
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Ensure a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Circular file is required" });
  }

  // Get the file path from Multer
  const circular_path = req.file.path; // This will store the file location

  const query =
    "INSERT INTO department_circular (department_id, circular_number, circular_name, circular_date, subject, circular_path) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [
    department_id,
    circular_number,
    circular_name,
    circular_date,
    subject,
    circular_path,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error adding circular:", err);
      return res
        .status(500)
        .json({ message: "Error adding circular", error: err });
    }
    res.status(201).json({
      message: "Circular added successfully",
      insertId: result.insertId,
      filePath: circular_path,
    });
  });
};

export const updateCircular = (req, res) => {
  const { circular_id } = req.params;
  const {
    department_id,
    circular_number,
    circular_name,
    circular_date,
    subject,
  } = req.body;

  if (
    !department_id ||
    !circular_number ||
    !circular_name ||
    !circular_date ||
    !subject
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Step 1: Get the previous file path
  pool.query(
    "SELECT circular_path FROM department_circular WHERE circular_id=?",
    [circular_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching circular:", err);
        return res
          .status(500)
          .json({ message: "Error fetching circular", error: err });
      }
      if (results.length === 0)
        return res.status(404).json({ message: "Circular not found" });

      const oldFilePath = results[0].circular_path;

      // Step 2: Delete the previous file if it exists
      if (oldFilePath) {
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Error deleting previous file:", err);
          }
        });
      }

      // Step 3: Save the new file (uploaded via Multer)
      const newFilePath = req.file ? req.file.path : oldFilePath; // Keep old path if no new file

      // Step 4: Update the circular record
      const query =
        "UPDATE department_circular SET department_id=?, circular_number=?, circular_name=?, circular_date=?, subject=?, circular_path=? WHERE circular_id=?";
      const params = [
        department_id,
        circular_number,
        circular_name,
        circular_date,
        subject,
        newFilePath,
        circular_id,
      ];

      pool.query(query, params, (err, result) => {
        if (err) {
          console.error("Error updating circular:", err);
          return res
            .status(500)
            .json({ message: "Error updating circular", error: err });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Circular not found" });
        }

        res
          .status(200)
          .json({ message: "Circular updated successfully", newFilePath });
      });
    }
  );
};

export const deleteCircular = (req, res) => {
  const { circular_id } = req.params;

  // Step 1: Retrieve the file path from the database
  pool.query(
    "SELECT circular_path FROM department_circular WHERE circular_id=?",
    [circular_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching circular:", err);
        return res
          .status(500)
          .json({ message: "Error fetching circular", error: err });
      }
      if (results.length === 0)
        return res.status(404).json({ message: "Circular not found" });

      const filePath = results[0].circular_path; // Correct column name

      // Step 2: Delete the file from the folder (if it exists)
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            // Ignore if file is already deleted
            console.error("Error deleting file:", err);
          }
        });
      }

      // Step 3: Delete the circular record from the database
      pool.query(
        "DELETE FROM department_circular WHERE circular_id=?",
        [circular_id],
        (err, result) => {
          if (err) {
            console.error("Error deleting circular:", err);
            return res
              .status(500)
              .json({ message: "Error deleting circular", error: err });
          }
          if (result.affectedRows === 0)
            return res.status(404).json({ message: "Circular not found" });

          res.status(200).json({
            message: "Circular deleted successfully, file also removed",
          });
        }
      );
    }
  );
};

// Get Orders
export const getOrders = (req, res) => {
  const { department_id } = req.params;
  let query = "SELECT * FROM department_duty_orders";
  let params = [];

  if (department_id) {
    query = "SELECT * FROM department_duty_orders WHERE department_id = ?";
    params = [department_id];
  }

  pool.query(query, params, (err, orders) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders", error: err });
    }

    if (department_id && orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this department" });
    }

    // Fetch faculty_ids, student_ids, and created_at for each order
    const ordersWithMappings = [];
    
    const fetchMappings = (index) => {
      if (index >= orders.length) {
        return res.status(200).json({
          message: "Orders retrieved successfully",
          data: ordersWithMappings,
        });
      }

      const order = orders[index];
      const order_number = order.order_number;

      const facultyQuery = `SELECT DISTINCT faculty_id FROM mapping_duty_orders_faculty WHERE order_number = ?`;
      const studentQuery = `SELECT DISTINCT RollNo FROM mapping_duty_orders_students WHERE order_number = ?`;
      const notificationQuery = `SELECT created_at FROM department_duty_notifications WHERE order_number = ? ORDER BY created_at DESC LIMIT 1`;

      pool.query(facultyQuery, [order_number], (err, facultyResult) => {
        if (err) {
          console.error("❌ Error fetching faculty mappings:", err);
          return res.status(500).json({ message: "Error fetching faculty mappings", error: err });
        }

        pool.query(studentQuery, [order_number], (err, studentResult) => {
          if (err) {
            console.error("❌ Error fetching student mappings:", err);
            return res.status(500).json({ message: "Error fetching student mappings", error: err });
          }

          pool.query(notificationQuery, [order_number], (err, notificationResult) => {
            if (err) {
              console.error("❌ Error fetching notification timestamps:", err);
              return res.status(500).json({ message: "Error fetching notification timestamps", error: err });
            }

            ordersWithMappings.push({
              ...order,
              faculty_ids: facultyResult.map((row) => row.faculty_id),
              student_ids: studentResult.map((row) => row.RollNo),
              created_at: notificationResult.length > 0 ? notificationResult[0].created_at : null,
            });

            fetchMappings(index + 1);
          });
        });
      });
    };

    fetchMappings(0);
  });
};


export const addOrder = (req, res) => {
  const {
    department_id,
    order_number,
    order_name,
    order_date,
    start_date,
    end_date,
    subject,
    notification_message,
    undersigned,
  } = req.body;

  let { faculty_ids, student_ids } = req.body;
  const order_path = req.file ? req.file.path : null;

  if (!department_id || !order_number || !order_name || !order_date || !subject || !undersigned || !order_path) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  const orderQuery = `
    INSERT INTO department_duty_orders 
    (department_id, order_number, order_name, order_date, start_date, end_date, subject, order_path, undersigned) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const orderParams = [
    department_id,
    order_number,
    order_name,
    order_date,
    start_date || null,
    end_date || null,
    subject,
    order_path,
    undersigned,
  ];

  pool.query(orderQuery, orderParams, (err, result) => {
    if (err) {
      console.error("❌ Error adding order:", err);
      return res.status(500).json({ message: "Error adding order", error: err });
    }

    console.log("✅ Order added successfully:", result.insertId);

    try {
      faculty_ids = typeof faculty_ids === "string" ? JSON.parse(faculty_ids) : faculty_ids || [];
      student_ids = typeof student_ids === "string" ? JSON.parse(student_ids) : student_ids || [];
    } catch (error) {
      console.error("❌ Error parsing IDs:", error);
      return res.status(400).json({ message: "Invalid faculty_ids or student_ids format" });
    }

    if (faculty_ids.length > 0) {
      const facultyQuery = "INSERT INTO mapping_duty_orders_faculty (faculty_id, order_number) VALUES ?";
      pool.query(facultyQuery, [faculty_ids.map((id) => [id, order_number])], (facultyErr) => {
        if (facultyErr) console.error("❌ Error linking faculty:", facultyErr);
      });
    }

    if (student_ids.length > 0) {
      const studentQuery = "INSERT INTO mapping_duty_orders_students (RollNo, order_number) VALUES ?";
      pool.query(studentQuery, [student_ids.map((id) => [id, order_number])], (studentErr) => {
        if (studentErr) console.error("❌ Error linking students:", studentErr);
      });
    }

    const notificationQuery = `INSERT INTO department_duty_notifications (user_id, order_number, message) VALUES ?`;
    const message = notification_message || "New duty order assigned";
    const notificationValues = [
      ...faculty_ids.map((id) => [id, order_number, message]),
      ...student_ids.map((id) => [id, order_number, message]),
    ];

    pool.query(notificationQuery, [notificationValues], (notifErr) => {
      if (notifErr) console.error("❌ Error creating notifications:", notifErr);
    });

    // Fetch faculty and student emails
    const getEmailsQuery = [];

if (faculty_ids.length > 0) {
  getEmailsQuery.push(
    `SELECT email_id AS email FROM faculty_details WHERE faculty_id IN (${faculty_ids.map(() => "?").join(",")})`
  );
}
if (student_ids.length > 0) {
  getEmailsQuery.push(
    `SELECT email FROM student_auth WHERE RollNo IN (${student_ids.map(() => "?").join(",")})`
  );
}

if (getEmailsQuery.length === 0) {
  console.warn("⚠️ No faculty or students assigned, skipping email fetch.");
  return res.status(201).json({ message: "Order added successfully", insertId: result.insertId });
}

const finalQuery = getEmailsQuery.join(" UNION ");
const queryParams = [...faculty_ids, ...student_ids];

pool.query(finalQuery, queryParams, (emailErr, emailResults) => {
  if (emailErr) {
    console.error("❌ Error fetching emails:", emailErr);
    return res.status(500).json({ message: "Error fetching emails", error: emailErr });
  }

  console.log("📩 Raw email results:", emailResults);

  const emails = emailResults.map((row) => row.email).filter(Boolean);
  console.log("📨 Valid Recipient Emails:", emails);

  if (emails.length > 0) {
    sendEmailNotifications(emails, order_number, order_name, order_date, subject, order_path);
  } else {
    console.warn("⚠️ No valid recipient emails found.");
  }

  res.status(201).json({ message: "Order added successfully", insertId: result.insertId });
});

  });
};

const sendEmailNotifications = async (emails, order_number, order_name, order_date, subject, order_path) => {
  try {
    const logoPath = path.join(__dirname, "..", "public", "assets", "emailSignature.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

    let pdfAttachment = null;
    if (order_path && fs.existsSync(order_path)) {
      const pdfContent = fs.readFileSync(order_path).toString('base64');
      pdfAttachment = {
        name: `${order_number}.pdf`,
        content: pdfContent,
        type: "application/pdf",
        disposition: "attachment"
      };
    } else {
      console.warn("⚠️ PDF file not found at:", order_path);
    }

    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM_EMAIL,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: emails.map(email => ({ email })),
      subject: "New Duty Order Notification",
      htmlContent: `
        <p>Dear Faculty Member(s),</p>
        <p>We hope this email finds you well.</p>
        <p>This is to notify you that you have been assigned a new departmental duty as per the office order issued by the Department of Electronics and Communication Engineering, Delhi Technological University. Below are the details of your assigned duty:</p>

        <p><strong>Order Number:</strong> ${order_number}</p>
        <p><strong>Order Name:</strong> ${order_name}</p>
        <p><strong>Order Date:</strong> ${order_date}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p>To ensure smooth coordination, we kindly request you to log in to the ERP portal at 
        <a href="https://www.dtu-eceportal.com" target="_blank">https://www.dtu-eceportal.com</a> and review the details at your earliest convenience.</p>

        <p>For any queries or clarifications, feel free to reach out to the department office.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>HOD Office, Department of ECE</strong></p>
        <p>Delhi Technological University</p>
        <br/>

        <table width="100%" style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
            <tr>
                <td width="80" style="padding-right: 20px;">
                    <img src="cid:collegeLogo.png" alt="DTU Logo" style="width: 80px; height: auto;">
                </td>
                <td style="vertical-align: middle; text-align: left;">
                    <p style="margin: 0; font-size: 16px; font-weight: bold;">
                        <strong>ERP Portal | HOD Office</strong>
                    </p>
                    <p style="margin: 0; font-size: 14px;">
                        Department of ECE<br>
                        Delhi Technological University (Formerly DCE)<br>
                        Shahbad Daulatpur Village, Rohini, New Delhi, Delhi, 110042
                    </p>
                </td>
            </tr>
        </table>
      `,
      attachment: [
        ...(pdfAttachment ? [pdfAttachment] : []),
        {
          name: 'collegeLogo.png',
          content: logoBase64,
          type: 'image/png',
          disposition: 'inline',
          contentId: 'collegeLogo.png'
        }
      ]
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Email sent successfully:", response.data);
  } catch (error) {
    console.error("❌ Error sending update email:", error.response?.data || error.message);
  }
};




export const updateOrder = (req, res) => {
  const { order_id } = req.params;
  const {
    department_id,
    order_number,
    order_name,
    order_date,
    start_date,
    end_date,
    subject,
    notification_message,
    undersigned,
  } = req.body;

  let { faculty_ids, student_ids } = req.body;

  pool.query(
    "SELECT order_path FROM department_duty_orders WHERE order_id=?",
    [order_id],
    (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(500)
          .json({ message: "Error fetching order", error: err });
      }

      const oldFilePath = results[0].order_path;
      if (req.file && oldFilePath) fs.unlink(oldFilePath, () => {});
      const newFilePath = req.file ? req.file.path : oldFilePath;

      const updateOrderQuery = `
      UPDATE department_duty_orders 
      SET department_id=?, order_number=?, order_name=?, order_date=?, start_date=?, end_date=?, subject=?, order_path=?, undersigned=?
      WHERE order_id=?`;
      const orderParams = [
        department_id,
        order_number,
        order_name,
        order_date,
        start_date || null,
        end_date || null,
        subject,
        newFilePath,
        undersigned,
        order_id,
      ];

      try {
        faculty_ids =
          typeof faculty_ids === "string"
            ? JSON.parse(faculty_ids)
            : faculty_ids || [];
        student_ids =
          typeof student_ids === "string"
            ? JSON.parse(student_ids)
            : student_ids || [];
      } catch (error) {
        console.error("Error parsing IDs:", error);
        return res
          .status(400)
          .json({ message: "Invalid faculty_ids or student_ids format" });
      }

      pool.query(updateOrderQuery, orderParams, (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error updating order", error: err });
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Order not found" });

        // Delete old faculty and student mappings
        pool.query(
          "DELETE FROM mapping_duty_orders_faculty WHERE order_number = ?",
          [order_number]
        );
        pool.query(
          "DELETE FROM mapping_duty_orders_students WHERE order_number = ?",
          [order_number]
        );

        // Insert new mappings
        if (faculty_ids.length > 0) {
          const facultyQuery =
            "INSERT INTO mapping_duty_orders_faculty (faculty_id, order_number) VALUES ?";
          pool.query(facultyQuery, [
            faculty_ids.map((id) => [id, order_number]),
          ]);
        }

        if (student_ids.length > 0) {
          const studentQuery =
            "INSERT INTO mapping_duty_orders_students (RollNo, order_number) VALUES ?";
          pool.query(studentQuery, [
            student_ids.map((id) => [id, order_number]),
          ]);
        }

        // Delete old notifications
        pool.query(
          "DELETE FROM department_duty_notifications WHERE order_number = ?",
          [order_number]
        );

        // Insert new notifications
        const notificationQuery = `
        INSERT INTO department_duty_notifications (user_id, order_number, message) VALUES ?`;
        const message = notification_message || "New duty order assigned";

        const notificationValues = [
          ...faculty_ids.map((id) => [
            id,
            order_number,
            "Updated duty order assigned",
          ]),
          ...student_ids.map((id) => [
            id,
            order_number,
            "Updated duty order assigned",
          ]),
        ];

        pool.query(notificationQuery, [notificationValues], (notifErr) => {
          if (notifErr)
            console.error("Error creating notifications:", notifErr);
        });

        // Fetch emails of faculties and students
        let getEmailsQuery = "";
        let emailQueryParams = [];

        if (faculty_ids.length > 0 && student_ids.length > 0) {
          getEmailsQuery = `
            SELECT email_id AS email FROM faculty_details WHERE faculty_id IN (?) 
            UNION 
            SELECT email FROM student_auth WHERE RollNo IN (?)`;
          emailQueryParams = [faculty_ids, student_ids];
        } else if (faculty_ids.length > 0) {
          getEmailsQuery = `SELECT email_id AS email FROM faculty_details WHERE faculty_id IN (?)`;
          emailQueryParams = [faculty_ids];
        } else if (student_ids.length > 0) {
          getEmailsQuery = `SELECT email FROM student_auth WHERE RollNo IN (?)`;
          emailQueryParams = [student_ids];
        }

        if (getEmailsQuery) {
          pool.query(getEmailsQuery, emailQueryParams, (emailErr, emailResults) => {
            if (emailErr) {
              console.error("Error fetching emails:", emailErr);
            } else {
              const emails = emailResults.map((row) => row.email).filter(Boolean);
              console.log("Valid Recipient Emails:", emails);

              if (emails.length === 0) {
                console.error("No valid recipient emails found.");
                return;
              }

              sendUpdateEmailNotifications(emails, order_number, order_name, order_date, subject);
            }
          });
        }

        res
          .status(200)
          .json({ message: "Order updated successfully", newFilePath });
      });
    }
  );
};


const sendUpdateEmailNotifications = async (emails, order_number, order_name, order_date, subject) => {
  try {
    const logoPath = path.join(__dirname, "..", "public", "assets", "emailSignature.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM_EMAIL,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: emails.map(email => ({ email })),
      subject: "Updated Office Order - Please Review Changes",
      htmlContent: `
        <p>Dear Faculty Member(s),</p>
        <p>We hope this email finds you well.</p>
        <p>We would like to inform you that an update has been made to an Office Order assigned to you by the Department of Electronics and Communication Engineering, Delhi Technological University. Below are the updated details:</p>

        <p><strong>Order Number:</strong> ${order_number}</p>
        <p><strong>Order Name:</strong> ${order_name}</p>
        <p><strong>Order Date:</strong> ${order_date}</p>
        <p><strong>Description:</strong> ${subject}</p>

        <p>To review the updated details, please log in to the ERP portal at 
        <a href="https://www.dtu-eceportal.com" target="_blank">https://www.dtu-eceportal.com</a>.</p>

        <p>For any queries, feel free to contact the department office.</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>HOD Office, Department of ECE</strong></p>
        <p>Delhi Technological University</p>

        <br/>
        <table width="100%" style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
            <tr>
                <td width="80" style="padding-right: 20px;">
                    <img src="cid:collegeLogo.png" alt="DTU Logo" style="width: 80px; height: auto;">
                </td>
                <td style="vertical-align: middle; text-align: left;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>ERP Portal | HOD Office</strong><br>
                        Department of ECE<br>
                        Delhi Technological University (Formerly DCE)<br>
                        Shahbad Daulatpur Village, Rohini, New Delhi, Delhi, 110042
                    </p>
                </td>
            </tr>
        </table>
      `,
      attachment: [
        {
          name: 'collegeLogo.png',
          content: logoBase64,
          type: 'image/png',
          disposition: 'inline',
          contentId: 'collegeLogo.png'
        }
      ]
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Update email sent successfully:", response.data);
  } catch (error) {
    console.error("❌ Error sending update email:", error.response?.data || error.message);
  }
};


export const deleteOrder = (req, res) => {
  const { order_id } = req.params;
  if (!order_id) return res.status(400).json({ message: "Order ID is required" });

  pool.query(
    "SELECT order_number, order_name, order_date, subject, order_path FROM department_duty_orders WHERE order_id=?",
    [order_id],
    (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ message: "Order not found" });

      const { order_number, order_name, order_date, subject, order_path } = results[0];

      const facultyQuery = `SELECT DISTINCT faculty_id FROM mapping_duty_orders_faculty WHERE order_number = ?;`;
      const studentQuery = `SELECT DISTINCT RollNo FROM mapping_duty_orders_students WHERE order_number = ?;`;

      // Fetch Faculty IDs
      pool.query(facultyQuery, [order_number], (facultyErr, facultyResult) => {
        if (facultyErr) {
          console.error("Error fetching faculty mappings:", facultyErr);
          return res.status(500).json({ message: "Error fetching faculty mappings" });
        }

        const facultyIds = facultyResult.map((row) => row.faculty_id).filter(Boolean);

        // Fetch Faculty Emails
        if (facultyIds.length > 0) {
          pool.query(
            `SELECT email_id FROM faculty_details WHERE faculty_id IN (?)`,
            [facultyIds],
            (emailErr, emailResults) => {
              if (emailErr) {
                console.error("Error fetching faculty emails:", emailErr);
              } else {
                const facultyEmails = emailResults.map((row) => row.email_id).filter(Boolean);
                if (facultyEmails.length > 0) {
                  sendDeleteEmailNotifications(facultyEmails, order_name, order_number, order_date, subject)
                    .then(() => {
                      console.log("✅ Delete email successfully sent.");
                    })
                    .catch((err) => {
                      console.error("❌ Failed to send delete email:", err.response?.data || err.message);
                    });
                }
              }
            }
          );
        }

        // Fetch Student Roll Numbers
        pool.query(studentQuery, [order_number], (studentErr, studentResult) => {
          if (studentErr) {
            console.error("Error fetching student mappings:", studentErr);
          } else {
            const studentRollNos = studentResult.map((row) => row.RollNo).filter(Boolean);
            if (studentRollNos.length > 0) {
              console.log("Affected students:", studentRollNos);
            }
          }

          pool.query("DELETE FROM department_duty_notifications WHERE order_number = ?", [order_number], (notifErr) => {
            if (notifErr) {
              console.error("Error deleting notifications:", notifErr);
              return res.status(500).json({ message: "Error deleting notifications", error: notifErr });
            }
          
            pool.query("DELETE FROM mapping_duty_orders_faculty WHERE order_number = ?", [order_number], (facMapErr) => {
              if (facMapErr) {
                console.error("Error deleting faculty mappings:", facMapErr);
                return res.status(500).json({ message: "Error deleting faculty mappings", error: facMapErr });
              }
          
              pool.query("DELETE FROM mapping_duty_orders_students WHERE order_number = ?", [order_number], (stuMapErr) => {
                if (stuMapErr) {
                  console.error("Error deleting student mappings:", stuMapErr);
                  return res.status(500).json({ message: "Error deleting student mappings", error: stuMapErr });
                }
          
                // Delete the file if it exists
                if (order_path) {
                  try {
                    fs.unlinkSync(order_path);
                  } catch (fsErr) {
                    console.error("Error deleting file:", fsErr);
                  }
                }
          
                // Finally, delete the main order
                pool.query("DELETE FROM department_duty_orders WHERE order_id=?", [order_id], (orderErr, result) => {
                  if (orderErr) {
                    return res.status(500).json({ message: "Error deleting order", error: orderErr });
                  }
                  if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Order not found" });
                  }
          
                  res.status(200).json({ message: "Order and associated notifications deleted successfully" });
                });
              });
            });
          });
        });
      });
    }
  );
};

const sendDeleteEmailNotifications = async (emails, order_name, order_number, order_date, subject) => {
  if (!emails || emails.length === 0) {
    console.log("No valid email recipients found. Skipping email notification.");
    return;
  }

  // Read the logo file and convert it to base64
  const logoPath = path.join(__dirname, "..", "public", "assets", "emailSignature.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

  const htmlContent = `
    <p>Dear Faculty Member(s),</p>
    <p>We hope this email finds you well.</p>
    <p>We would like to inform you that an Office Order previously assigned to you in the Department of Electronics and Communication Engineering has been cancelled. Please find the details below:</p>
    <p><strong>Order Number:</strong> ${order_number}</p>
    <p><strong>Order Name:</strong> ${order_name}</p>
    <p><strong>Order Date:</strong> ${order_date}</p>
    <p><strong>Description:</strong> ${subject}</p>
    <p>To ensure smooth coordination, we kindly request you to log in to the ERP portal at <a href="https://www.dtu-eceportal.com" target="_blank">https://www.dtu-eceportal.com</a> and review the details at your earliest convenience.</p>
    <p>For any queries or clarifications, feel free to reach out to the department office.</p>
    <p>Best regards,</p>
    <p><strong>HOD Office, Department of ECE</strong></p>
    <p><strong>Delhi Technological University</strong></p>
    <br/>

    <!-- Footer -->
    <table width="100%" style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
        <tr>
            <td width="80" style="padding-right: 20px;">
                <img src="cid:collegeLogo.png" alt="DTU Logo" style="width: 80px; height: auto;">
            </td>
            <td style="vertical-align: middle; text-align: left;">
                <p style="margin: 0; font-size: 14px;">
                    <strong>ERP Portal | HOD Office</strong><br>
                    Department of ECE<br>
                    Delhi Technological University (Formerly DCE)<br>
                    Shahbad Daulatpur Village, Rohini, New Delhi, Delhi, 110042
                </p>
            </td>
        </tr>
    </table>
  `;

  const recipients = emails.map((email) => ({ email }));

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME,
          email: process.env.EMAIL_FROM_EMAIL,
        },
        to: recipients,
        subject: "Office Order Cancelled - Please Review",
        htmlContent,
        attachment: [
          {
            name: "collegeLogo.png",
            content: logoBase64,
            type: "image/png",
            disposition: "inline",
            contentId: "collegeLogo.png",
          },
        ],
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Delete email sent via Brevo:", response.data);
  } catch (err) {
    console.error("❌ Error sending delete email via Brevo:", err.response?.data || err.message);
  }
};



// 1️⃣ Get all faculty mappings or by faculty_id
export const getFacultyMappings = (req, res) => {
  const { faculty_id } = req.query;
  let query = "SELECT * FROM mapping_duty_orders_faculty";
  let values = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    values.push(faculty_id);
  }

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching faculty mappings:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
};

// 2️⃣ Add a new faculty mapping
export const addFacultyMapping = (req, res) => {
  const { faculty_id, order_number } = req.body;

  pool.query(
    "INSERT INTO mapping_duty_orders_faculty (faculty_id, order_number) VALUES (?, ?)",
    [faculty_id, order_number],
    (err, result) => {
      if (err) {
        console.error("Error adding faculty mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Faculty mapping added successfully",
        id: result.insertId, // Returning the newly inserted row's ID
      });
    }
  );
};

// 3️⃣ Update a faculty mapping
export const updateFacultyMapping = (req, res) => {
  const { id } = req.params;
  const { faculty_id, order_number } = req.body;

  pool.query(
    "UPDATE mapping_duty_orders_faculty SET faculty_id = ?, order_number = ? WHERE id = ?",
    [faculty_id, order_number, id],
    (err, result) => {
      if (err) {
        console.error("Error updating faculty mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Faculty mapping updated successfully",
      });
    }
  );
};

// 4️⃣ Delete a faculty mapping
export const deleteFacultyMapping = (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM mapping_duty_orders_faculty WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting faculty mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Faculty mapping deleted successfully",
      });
    }
  );
};

// 1️⃣ Get all student mappings or by RollNo
export const getStudentMappings = (req, res) => {
  const { RollNo } = req.query;
  let query = "SELECT * FROM mapping_duty_orders_students";
  let values = [];

  if (RollNo) {
    query += " WHERE RollNo = ?";
    values.push(RollNo);
  }

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching student mappings:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
};

// 2️⃣ Add a new student mapping
export const addStudentMapping = (req, res) => {
  const { RollNo, order_number } = req.body;

  pool.query(
    "INSERT INTO mapping_duty_orders_students (RollNo, order_number) VALUES (?, ?)",
    [RollNo, order_number],
    (err, result) => {
      if (err) {
        console.error("Error adding student mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Student mapping added successfully",
        id: result.insertId, // Returning the newly inserted row's ID
      });
    }
  );
};

// 3️⃣ Update a student mapping
export const updateStudentMapping = (req, res) => {
  const { id } = req.params;
  const { RollNo, order_number } = req.body;

  pool.query(
    "UPDATE mapping_duty_orders_students SET RollNo = ?, order_number = ? WHERE id = ?",
    [RollNo, order_number, id],
    (err, result) => {
      if (err) {
        console.error("Error updating student mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Student mapping updated successfully",
      });
    }
  );
};

// 4️⃣ Delete a student mapping
export const deleteStudentMapping = (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM mapping_duty_orders_students WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting student mapping:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        success: true,
        message: "Student mapping deleted successfully",
      });
    }
  );
};

export const getMappingsByOrderNumber = (req, res) => {
  const { order_number } = req.query;

  if (!order_number) {
    return res.status(400).json({ error: "order_number is required" });
  }

  console.log("Received order_number:", order_number); // Debugging log

  const facultyQuery = `
      SELECT DISTINCT faculty_id 
      FROM mapping_duty_orders_faculty
      WHERE order_number = ?;
  `;

  const studentQuery = `
      SELECT DISTINCT RollNo 
      FROM mapping_duty_orders_students
      WHERE order_number = ?;
  `;

  pool.query(facultyQuery, [order_number], (err, facultyResult) => {
    if (err) {
      console.error("Error fetching faculty mappings:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }

    pool.query(studentQuery, [order_number], (err, studentResult) => {
      if (err) {
        console.error("Error fetching student mappings:", err);
        return res
          .status(500)
          .json({ error: "Internal server error", details: err.message });
      }

      res.json({
        faculty_ids: facultyResult.map((row) => row.faculty_id),
        roll_numbers: studentResult.map((row) => row.RollNo),
      });
    });
  });
};

export const getDepartments = (req, res) => {
  const { department_id } = req.params;

  let query = "SELECT * FROM department_details";
  let params = [];

  if (department_id) {
    query += " WHERE department_id = ?";
    params.push(department_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res
        .status(500)
        .json({ message: "Error fetching departments", error: err });
    }

    if (department_id && results.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res
      .status(200)
      .json({ message: "Departments retrieved successfully", data: results });
  });
};

export const addDepartment = (req, res) => {
  const {
    department_id,
    department_name,
    degree,
    university,
    curr_hod,
    email_id,
  } = req.body;

  if (!department_id || !department_name || !email_id) {
    return res.status(400).json({
      message: "department_id, department_name, and email_id are required",
    });
  }

  const query =
    "INSERT INTO department_details (department_id, department_name, degree, university, curr_hod, email_id) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [
    department_id,
    department_name,
    degree,
    university,
    curr_hod,
    email_id,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error adding department:", err);
      return res
        .status(500)
        .json({ message: "Error adding department", error: err });
    }
    res.status(201).json({
      message: "Department added successfully",
      insertId: result.insertId,
    });
  });
};

export const updateDepartment = (req, res) => {
  const { department_id } = req.params;
  const { department_name, degree, university, curr_hod, email_id } = req.body;

  if (!department_name || !email_id) {
    return res
      .status(400)
      .json({ message: "department_name and email_id are required" });
  }

  const query =
    "UPDATE department_details SET department_name=?, degree=?, university=?, curr_hod=?, email_id=? WHERE department_id=?";
  const params = [
    department_name,
    degree,
    university,
    curr_hod,
    email_id,
    department_id,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating department:", err);
      return res
        .status(500)
        .json({ message: "Error updating department", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully" });
  });
};

export const deleteDepartment = (req, res) => {
  const { department_id } = req.params;

  pool.query(
    "DELETE FROM department_details WHERE department_id=?",
    [department_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting department:", err);
        return res
          .status(500)
          .json({ message: "Error deleting department", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json({ message: "Department deleted successfully" });
    }
  );
};

// ==================== Department Login Controller ====================
export const departmentLogin = (req, res) => {
  const { department_id, password } = req.body;

  if (!department_id || !password) {
    return res
      .status(400)
      .json({ message: "Department ID and password are required!" });
  }

  // Query to get department authentication details along with position name
  pool.query(
    `SELECT da.*, pt.position_name 
       FROM department_auth da 
       JOIN position_type pt ON da.position_id = pt.position_id
       WHERE da.department_id = ?`,
    [department_id],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Server error!" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Department ID not found!" });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Server error!" });
        if (!isMatch)
          return res.status(401).json({ message: "Invalid password!" });

        // Fetch department details
        pool.query(
          `SELECT department_name, university, curr_hod 
             FROM department_details WHERE department_id = ?`,
          [department_id],
          (err, departmentResults) => {
            if (err) {
              console.error("Database Error:", err);
              return res.status(500).json({ message: "Server error!" });
            }

            if (departmentResults.length === 0) {
              return res
                .status(404)
                .json({ message: "Department details not found!" });
            }

            const { department_name, university, curr_hod } =
              departmentResults[0];

            // Generate access and refresh tokens including position
            const accessToken = generateAccessToken(
              user.department_id,
              user.position_name
            );
            const refreshToken = generateRefreshToken(
              user.department_id,
              user.position_name
            );

            const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
            const refreshTokenExpiry = new Date(
              Date.now() + expiryDays * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            // Store refresh token in database
            pool.query(
              "UPDATE department_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE department_id = ?",
              [refreshToken, refreshTokenExpiry, department_id],
              (err) => {
                if (err) {
                  console.error("Database Error:", err);
                  return res.status(500).json({ message: "Server error!" });
                }

                res.json({
                  message: "Login successful!",
                  accessToken,
                  refreshToken,
                  user: {
                    department_id: user.department_id,
                    department_name,
                    university,
                    current_hod: curr_hod,
                    position: user.position_name,
                  },
                });
              }
            );
          }
        );
      });
    }
  );
};

// ==================== Refresh Token Controller ====================
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required!" });
  }

  pool.query(
    `SELECT da.refresh_token, da.refresh_token_expiry, da.department_id, pt.position_name
       FROM department_auth da
       JOIN position_type pt ON da.position_id = pt.position_id
       WHERE da.refresh_token = ?`,
    [refreshToken],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error!" });
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid refresh token!" });

      const { department_id, position_name, refresh_token_expiry } = results[0];
      const tokenExpiry = new Date(refresh_token_expiry);

      if (tokenExpiry < new Date()) {
        return res.status(401).json({ message: "Refresh token expired!" });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err)
            return res
              .status(401)
              .json({ message: "Invalid or expired refresh token!" });

          res.json({
            accessToken: generateAccessToken(department_id, position_name),
          });
        }
      );
    }
  );
};

// ==================== Logout Controller ====================
export const logout = (req, res) => {
  const { department_id } = req.body;
  if (!department_id) {
    return res.status(400).json({ message: "Department ID is required!" });
  }

  pool.query(
    "UPDATE department_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE department_id = ?",
    [department_id],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error!" });
      res.json({ message: "Logged out successfully!" });
    }
  );
};

export const getNotifications = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  const query = `SELECT * FROM department_duty_notifications WHERE user_id = ? ORDER BY created_at DESC`;

  pool.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

export const addNotification = (req, res) => {
  const { user_id, order_number, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "user_id and message are required" });
  }

  const query = `
      INSERT INTO department_duty_notifications (user_id, order_number, message) 
      VALUES (?, ?, ?)
  `;

  pool.query(query, [user_id, order_number || null, message], (err, result) => {
    if (err) {
      console.error("Error adding notification:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({
      success: true,
      message: "Notification added successfully",
      notification_id: result.insertId,
    });
  });
};

export const updateNotification = (req, res) => {
  const { notification_id } = req.params;
  const { user_id, order_number, message } = req.body;

  if (!notification_id) {
    return res.status(400).json({ error: "notification_id is required" });
  }

  const query = `
      UPDATE department_duty_notifications
      SET user_id = ?, order_number = ?, message = ?
      WHERE notification_id = ?
  `;

  pool.query(
    query,
    [user_id, order_number || null, message, notification_id],
    (err, result) => {
      if (err) {
        console.error("Error updating notification:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ success: true, message: "Notification updated successfully" });
    }
  );
};

export const deleteNotification = (req, res) => {
  const { notification_id } = req.params;

  if (!notification_id) {
    return res.status(400).json({ error: "notification_id is required" });
  }

  const query = `DELETE FROM department_duty_notifications WHERE notification_id = ?`;

  pool.query(query, [notification_id], (err, result) => {
    if (err) {
      console.error("Error deleting notification:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ success: true, message: "Notification deleted successfully" });
  });
};