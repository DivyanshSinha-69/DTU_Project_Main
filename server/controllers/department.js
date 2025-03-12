import { pool } from "../data/database.js"; // Import MySQL2 connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// 🔹 Generate Access Token (Short-lived)

const generateAccessToken = (department_id, position) => {
    return jwt.sign({ department_id, position }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
  };
  
// 🔹 Generate Refresh Token (Long-lived)
const generateRefreshToken = (department_id) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign({ department_id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expirySeconds,
  });
};

export const getCirculars = (req, res) => {
  const { department_id } = req.params;

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

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders", error: err });
    }

    if (department_id && results.length === 0) {
      return res.status(404).json({ message: "No orders found for this department" });
    }

    res.status(200).json({ message: "Orders retrieved successfully", data: results });
  });
};

// Add Order
export const addOrder = (req, res) => {
  const {
    department_id,
    order_number,
    order_name,
    order_date,
    start_date,
    end_date,
    subject,  
  } = req.body;

  let { faculty_ids, student_ids } = req.body;

  const order_path = req.file ? req.file.path : null;

  if (!department_id || !order_number || !order_name || !order_date || !start_date || !end_date || !subject) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  const orderQuery =
    "INSERT INTO department_duty_orders (department_id, order_number, order_name, order_date, start_date, end_date, subject, order_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const orderParams = [
    department_id,
    order_number,
    order_name,
    order_date,
    start_date,
    end_date,
    subject,
    order_path
  ];

  pool.query(orderQuery, orderParams, (err, result) => {
    if (err) {
      console.error("Error adding order:", err);
      return res.status(500).json({ message: "Error adding order", error: err });
    }

    if (typeof faculty_ids === "string") {
      try {
        faculty_ids = JSON.parse(faculty_ids);
      } catch (error) {
        console.error("Error parsing faculty_ids:", error);
        faculty_ids = [];
      }
    }
    

    if (typeof student_ids === "string") {
      try {
        student_ids = JSON.parse(student_ids);
      } catch (error) {
        console.error("Error parsing student_ids:", error);
        student_ids = [];
      }
    }

    if (faculty_ids.length > 0) {
      const facultyQuery = "INSERT INTO mapping_duty_orders_faculty (faculty_id, order_number) VALUES ?";
      const facultyValues = faculty_ids.map(faculty_id => [faculty_id, order_number]);
      pool.query(facultyQuery, [facultyValues], (facultyErr) => {
        if (facultyErr) console.error("Error linking faculty:", facultyErr);
      });
    }

    if (student_ids.length > 0) {
      const studentQuery = "INSERT INTO mapping_duty_orders_students (RollNo, order_number) VALUES ?";
      const studentValues = student_ids.map(rollNo => [rollNo, order_number]);
      pool.query(studentQuery, [studentValues], (studentErr) => {
        if (studentErr) console.error("Error linking students:", studentErr);
      });
    }

    res.status(201).json({ message: "Order added successfully", insertId: result.insertId });
  });
};

// Update Order
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
  } = req.body;

  let { faculty_ids, student_ids } = req.body;


  pool.query("SELECT order_path FROM department_duty_orders WHERE order_id=?", [order_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: "Error fetching order", error: err });
    }

    const oldFilePath = results[0].order_path;
    if (req.file && oldFilePath) fs.unlink(oldFilePath, () => {});
    const newFilePath = req.file ? req.file.path : oldFilePath;

    const updateOrderQuery = `UPDATE department_duty_orders SET department_id=?, order_number=?, order_name=?, order_date=?, start_date=?, end_date=?, subject=?, order_path=? WHERE order_id=?`;
    const orderParams = [department_id, order_number, order_name, order_date, start_date, end_date, subject, newFilePath, order_id];

    if (typeof faculty_ids === "string") {
      try {
        faculty_ids = JSON.parse(faculty_ids);
      } catch (error) {
        console.error("Error parsing faculty_ids:", error);
        faculty_ids = [];
      }
    }
    

    if (typeof student_ids === "string") {
      try {
        student_ids = JSON.parse(student_ids);
      } catch (error) {
        console.error("Error parsing student_ids:", error);
        student_ids = [];
      }
    }

    pool.query(updateOrderQuery, orderParams, (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating order", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

      pool.query("DELETE FROM mapping_duty_orders_faculty WHERE order_number = ?", [order_number]);
      pool.query("DELETE FROM mapping_duty_orders_students WHERE order_number = ?", [order_number]);

      if (faculty_ids.length > 0) {
        const facultyQuery = "INSERT INTO mapping_duty_orders_faculty (faculty_id, order_number) VALUES ?";
        pool.query(facultyQuery, [faculty_ids.map(faculty_id => [faculty_id, order_number])]);
      }

      if (student_ids.length > 0) {
        const studentQuery = "INSERT INTO mapping_duty_orders_students (RollNo, order_number) VALUES ?";
        pool.query(studentQuery, [student_ids.map(rollNo => [rollNo, order_number])]);
      }

      res.status(200).json({ message: "Order updated successfully", newFilePath });
    });
  });
};

// Delete Order
export const deleteOrder = (req, res) => {
  const { order_id } = req.params;
  if (!order_id) return res.status(400).json({ message: "Order ID is required" });

  pool.query("SELECT order_number, order_path FROM department_duty_orders WHERE order_id=?", [order_id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: "Order not found" });

    const { order_number, order_path } = results[0];
    pool.query("DELETE FROM mapping_duty_orders_faculty WHERE order_number = ?", [order_number]);
    pool.query("DELETE FROM mapping_duty_orders_students WHERE order_number = ?", [order_number]);

    if (order_path) fs.unlink(order_path, () => {});

    pool.query("DELETE FROM department_duty_orders WHERE order_id=?", [order_id], (orderErr, result) => {
      if (orderErr) return res.status(500).json({ message: "Error deleting order", error: orderErr });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ message: "Order deleted successfully" });
    });
  });
};


export const getFacultyOrders = (req, res) => {
  const { faculty_id } = req.params;

  let query = "SELECT * FROM faculty_orders";
  let params = [];

  if (faculty_id) {
    query += " WHERE faculty_id = ?";
    params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching faculty orders:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }

    res.json(results);
  });
};

export const addFacultyOrder = (req, res) => {
  const { faculty_id, order_number } = req.body;

  pool.query(
    "INSERT INTO faculty_orders (faculty_id, order_number) VALUES (?, ?)",
    [faculty_id, order_number],
    (err, result) => {
      if (err) {
        console.error("Error assigning order:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err });
      }

      res
        .status(201)
        .json({ message: "Order assigned successfully", id: result.insertId });
    }
  );
};

export const updateFacultyOrder = (req, res) => {
  const { id } = req.params; // ID from faculty_orders table
  const { faculty_id, order_number } = req.body; // New faculty_id and order_number to update

  pool.query(
    "UPDATE faculty_orders SET faculty_id = ?, order_number = ? WHERE id = ?",
    [faculty_id, order_number, id],
    (err, result) => {
      if (err) {
        console.error("Error updating faculty order:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No matching faculty order found to update" });
      }

      res.json({ message: "Faculty order updated successfully" });
    }
  );
};

export const deleteFacultyOrder = (req, res) => {
  const { id } = req.params; // ID from faculty_orders table

  pool.query("DELETE FROM faculty_orders WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting faculty order:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No matching faculty order found to delete" });
    }

    res.json({ message: "Faculty order deleted successfully" });
  });
};

export const getFacultiesForOrder = (req, res) => {
  const { order_number } = req.params;

  pool.query(
    `SELECT f.faculty_id, f.faculty_name, f.email_id, f.mobile_number
       FROM faculty_details f
       JOIN faculty_orders fo ON fo.faculty_id = f.faculty_id
       WHERE fo.order_number = ?`,
    [order_number],
    (err, rows) => {
      if (err) {
        console.error("Error fetching faculties for order:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err });
      }

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No faculties found for this order" });
      }

      res.json(rows);
    }
  );
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
      return res.status(400).json({ message: "Department ID and password are required!" });
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
          if (!isMatch) return res.status(401).json({ message: "Invalid password!" });
  
          // Fetch department details
          pool.query(
            `SELECT department_name, degree, university, curr_hod 
             FROM department_details WHERE department_id = ?`,
            [department_id],
            (err, departmentResults) => {
              if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Server error!" });
              }
  
              if (departmentResults.length === 0) {
                return res.status(404).json({ message: "Department details not found!" });
              }
  
              const { department_name, degree, university, curr_hod } = departmentResults[0];
  
              // Generate access and refresh tokens including position
              const accessToken = generateAccessToken(user.department_id, user.position_name);
              const refreshToken = generateRefreshToken(user.department_id, user.position_name);
  
              const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
              const refreshTokenExpiry = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
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
                      degree,
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
        if (results.length === 0) return res.status(401).json({ message: "Invalid refresh token!" });
  
        const { department_id, position_name, refresh_token_expiry } = results[0];
        const tokenExpiry = new Date(refresh_token_expiry);
  
        if (tokenExpiry < new Date()) {
          return res.status(401).json({ message: "Refresh token expired!" });
        }
  
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
          if (err) return res.status(401).json({ message: "Invalid or expired refresh token!" });
  
          res.json({ accessToken: generateAccessToken(department_id, position_name) });
        });
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