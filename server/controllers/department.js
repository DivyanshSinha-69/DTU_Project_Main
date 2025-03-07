import {pool} from "../data/database.js"; // Import MySQL2 connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";


// 🔹 Generate Access Token (Short-lived)
const generateAccessToken = (department_id) => {
    return jwt.sign({ department_id }, process.env.JWT_SECRET, {
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
            return res.status(500).json({ message: "Error fetching circulars", error: err });
        }

        if (department_id && results.length === 0) {
            return res.status(404).json({ message: "No circulars found for this department" });
        }

        res.status(200).json({ message: "Circulars retrieved successfully", data: results });
    });
};


export const addCircular = (req, res) => {
    const { department_id, circular_number, circular_name, circular_date, subject } = req.body;

    // Check if all required fields are present
    if (!department_id || !circular_number || !circular_name || !circular_date || !subject) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "Circular file is required" });
    }

    // Get the file path from Multer
    const circular_path = req.file.path; // This will store the file location

    const query = "INSERT INTO department_circular (department_id, circular_number, circular_name, circular_date, subject, circular_path) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [department_id, circular_number, circular_name, circular_date, subject, circular_path];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error("Error adding circular:", err);
            return res.status(500).json({ message: "Error adding circular", error: err });
        }
        res.status(201).json({ message: "Circular added successfully", insertId: result.insertId, filePath: circular_path });
    });
};


export const updateCircular = (req, res) => {
    const { circular_id } = req.params;
    const { department_id, circular_number, circular_name, circular_date, subject } = req.body;

    if (!department_id || !circular_number || !circular_name || !circular_date || !subject) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Step 1: Get the previous file path
    pool.query("SELECT circular_path FROM department_circular WHERE circular_id=?", [circular_id], (err, results) => {
        if (err) {
            console.error("Error fetching circular:", err);
            return res.status(500).json({ message: "Error fetching circular", error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: "Circular not found" });

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
        const query = "UPDATE department_circular SET department_id=?, circular_number=?, circular_name=?, circular_date=?, subject=?, circular_path=? WHERE circular_id=?";
        const params = [department_id, circular_number, circular_name, circular_date, subject, newFilePath, circular_id];

        pool.query(query, params, (err, result) => {
            if (err) {
                console.error("Error updating circular:", err);
                return res.status(500).json({ message: "Error updating circular", error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Circular not found" });
            }

            res.status(200).json({ message: "Circular updated successfully", newFilePath });
        });
    });
};

export const deleteCircular = (req, res) => {
    const { circular_id } = req.params;

    // Step 1: Retrieve the file path from the database
    pool.query("SELECT circular_path FROM department_circular WHERE circular_id=?", [circular_id], (err, results) => {
        if (err) {
            console.error("Error fetching circular:", err);
            return res.status(500).json({ message: "Error fetching circular", error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: "Circular not found" });

        const filePath = results[0].circular_path; // Correct column name

        // Step 2: Delete the file from the folder (if it exists)
        if (filePath) {
            fs.unlink(filePath, (err) => {
                if (err && err.code !== "ENOENT") { // Ignore if file is already deleted
                    console.error("Error deleting file:", err);
                }
            });
        }

        // Step 3: Delete the circular record from the database
        pool.query("DELETE FROM department_circular WHERE circular_id=?", [circular_id], (err, result) => {
            if (err) {
                console.error("Error deleting circular:", err);
                return res.status(500).json({ message: "Error deleting circular", error: err });
            }
            if (result.affectedRows === 0) return res.status(404).json({ message: "Circular not found" });

            res.status(200).json({ message: "Circular deleted successfully, file also removed" });
        });
    });
};



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

// 📌 Add Order with File Upload
export const addOrder = (req, res) => {
    const { department_id, order_number, order_name, order_date, execution_date, subject, faculty_ids } = req.body;

    // Extract file path from the uploaded file
    const order_path = req.file ? req.file.path : null;

    // Ensure faculty_ids is an array (handle comma-separated string from form-data)
    const processedFacultyIds = typeof faculty_ids === "string" ? faculty_ids.split(",") : faculty_ids;

    // Validate required fields
    if (!department_id || !order_number || !order_name || !order_date || !execution_date || !subject || !order_path || !Array.isArray(processedFacultyIds) || processedFacultyIds.length === 0) {
        return res.status(400).json({ message: "All fields are required, including at least one faculty_id and a file" });
    }

    const orderQuery = "INSERT INTO department_duty_orders (department_id, order_number, order_name, order_date, execution_date, subject, order_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const orderParams = [department_id, order_number, order_name, order_date, execution_date, subject, order_path];

    pool.query(orderQuery, orderParams, (err, result) => {
        if (err) {
            console.error("Error adding order:", err);
            return res.status(500).json({ message: "Error adding order", error: err });
        }

        // Insert faculty_id and order_number into faculty_orders table
        const facultyQuery = "INSERT INTO faculty_orders (faculty_id, order_number) VALUES ?";
        const facultyValues = processedFacultyIds.map(faculty_id => [faculty_id, order_number]);

        pool.query(facultyQuery, [facultyValues], (facultyErr) => {
            if (facultyErr) {
                console.error("Error linking faculty to order:", facultyErr);
                return res.status(500).json({ message: "Order added, but failed to link faculty", error: facultyErr });
            }

            res.status(201).json({ message: "Order added successfully and linked to faculty", insertId: result.insertId });
        });
    });
};


export const updateOrder = (req, res) => {
    const { order_id } = req.params;
    const { department_id, order_number, order_name, order_date, execution_date, subject, faculty_ids } = req.body;

    // Process faculty_ids to ensure it's an array
    const processedFacultyIds = typeof faculty_ids === "string" ? faculty_ids.split(",") : faculty_ids;

    // Validate required fields
    if (!department_id || !order_number || !order_name || !order_date || !execution_date || !subject || !Array.isArray(processedFacultyIds) || processedFacultyIds.length === 0) {
        return res.status(400).json({ message: "All fields are required, including at least one faculty_id" });
    }

    // Step 1: Fetch the previous file path
    pool.query("SELECT order_path FROM department_duty_orders WHERE order_id=?", [order_id], (err, results) => {
        if (err) {
            console.error("Error fetching order:", err);
            return res.status(500).json({ message: "Error fetching order", error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: "Order not found" });

        const oldFilePath = results[0].order_path;

        // Step 2: Delete the old file if a new one is uploaded
        if (req.file && oldFilePath) {
            fs.unlink(oldFilePath, (err) => {
                if (err && err.code !== "ENOENT") console.error("Error deleting previous file:", err);
            });
        }

        // Step 3: Get the new file path (uploaded via Multer)
        const newFilePath = req.file ? req.file.path : oldFilePath; // Keep old path if no new file

        // Step 4: Update the order
        const updateOrderQuery = `UPDATE department_duty_orders 
                                  SET department_id=?, order_number=?, order_name=?, order_date=?, execution_date=?, subject=?, order_path=? 
                                  WHERE order_id=?`;
        const orderParams = [department_id, order_number, order_name, order_date, execution_date, subject, newFilePath, order_id];

        pool.query(updateOrderQuery, orderParams, (err, result) => {
            if (err) {
                console.error("Error updating order:", err);
                return res.status(500).json({ message: "Error updating order", error: err });
            }
            if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

            // Remove old faculty assignments
            const deleteFacultyQuery = "DELETE FROM faculty_orders WHERE order_number = ?";
            pool.query(deleteFacultyQuery, [order_number], (deleteErr) => {
                if (deleteErr) {
                    console.error("Error removing old faculty assignments:", deleteErr);
                    return res.status(500).json({ message: "Order updated, but failed to remove old faculty assignments", error: deleteErr });
                }

                // Insert new faculty assignments
                const facultyQuery = "INSERT INTO faculty_orders (faculty_id, order_number) VALUES ?";
                const facultyValues = processedFacultyIds.map(faculty_id => [faculty_id, order_number]);

                pool.query(facultyQuery, [facultyValues], (facultyErr) => {
                    if (facultyErr) {
                        console.error("Error updating faculty assignments:", facultyErr);
                        return res.status(500).json({ message: "Order updated, but failed to update faculty assignments", error: facultyErr });
                    }

                    res.status(200).json({ message: "Order updated successfully", newFilePath });
                });
            });
        });
    });
};

export const deleteOrder = (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    // Step 1: Retrieve file path & order_number before deletion
    pool.query("SELECT order_number, order_path FROM department_duty_orders WHERE order_id=?", [order_id], (err, results) => {
        if (err) {
            console.error("Error fetching order:", err);
            return res.status(500).json({ message: "Error fetching order", error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: "Order not found" });

        const { order_number, order_path } = results[0];

        // Step 2: Delete associated faculty assignments
        pool.query("DELETE FROM faculty_orders WHERE order_number=?", [order_number], (facultyErr) => {
            if (facultyErr) {
                console.error("Error deleting faculty assignments:", facultyErr);
                return res.status(500).json({ message: "Error deleting faculty assignments", error: facultyErr });
            }

            // Step 3: Delete the file if it exists
            if (order_path) {
                fs.unlink(order_path, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Error deleting file:", err);
                    }
                });
            }

            // Step 4: Delete the order
            pool.query("DELETE FROM department_duty_orders WHERE order_id=?", [order_id], (orderErr, result) => {
                if (orderErr) {
                    console.error("Error deleting order:", orderErr);
                    return res.status(500).json({ message: "Error deleting order", error: orderErr });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Order not found" });
                }

                res.status(200).json({ message: "Order and related faculty assignments deleted successfully" });
            });
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
          return res.status(500).json({ message: "Internal Server Error", error: err });
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
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          res.status(201).json({ message: "Order assigned successfully", id: result.insertId });
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
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "No matching faculty order found to update" });
          }

          res.json({ message: "Faculty order updated successfully" });
      }
  );
};




export const deleteFacultyOrder = (req, res) => {
  const { id } = req.params; // ID from faculty_orders table

  pool.query(
      "DELETE FROM faculty_orders WHERE id = ?",
      [id],
      (err, result) => {
          if (err) {
              console.error("Error deleting faculty order:", err);
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "No matching faculty order found to delete" });
          }

          res.json({ message: "Faculty order deleted successfully" });
      }
  );
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
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (rows.length === 0) {
              return res.status(404).json({ message: "No faculties found for this order" });
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
            return res.status(500).json({ message: "Error fetching departments", error: err });
        }

        if (department_id && results.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Departments retrieved successfully", data: results });
    });
};

export const addDepartment = (req, res) => {
    const { department_id, department_name, degree, university, curr_hod, email_id } = req.body;

    if (!department_id || !department_name || !email_id) {
        return res.status(400).json({ message: "department_id, department_name, and email_id are required" });
    }

    const query = "INSERT INTO department_details (department_id, department_name, degree, university, curr_hod, email_id) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [department_id, department_name, degree, university, curr_hod, email_id];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error("Error adding department:", err);
            return res.status(500).json({ message: "Error adding department", error: err });
        }
        res.status(201).json({ message: "Department added successfully", insertId: result.insertId });
    });
};

export const updateDepartment = (req, res) => {
    const { department_id } = req.params;
    const { department_name, degree, university, curr_hod, email_id } = req.body;

    if (!department_name || !email_id) {
        return res.status(400).json({ message: "department_name and email_id are required" });
    }

    const query = "UPDATE department_details SET department_name=?, degree=?, university=?, curr_hod=?, email_id=? WHERE department_id=?";
    const params = [department_name, degree, university, curr_hod, email_id, department_id];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error("Error updating department:", err);
            return res.status(500).json({ message: "Error updating department", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department updated successfully" });
    });
};

export const deleteDepartment = (req, res) => {
    const { department_id } = req.params;

    pool.query("DELETE FROM department_details WHERE department_id=?", [department_id], (err, result) => {
        if (err) {
            console.error("Error deleting department:", err);
            return res.status(500).json({ message: "Error deleting department", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully" });
    });
};


// ==================== Department Login Controller ====================
export const departmentLogin = (req, res) => {
  const { department_id, password } = req.body;

  if (!department_id || !password) {
    return res
      .status(400)
      .json({ message: "Department ID and password are required!" });
  }

  pool.query(
    "SELECT * FROM department_auth WHERE department_id = ?",
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
          `SELECT department_name, degree, university, curr_hod 
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

            const { department_name, degree, university, curr_hod } =
              departmentResults[0];

            // Generate access and refresh tokens
            const accessToken = generateAccessToken(user.department_id);
            const refreshToken = generateRefreshToken(user.department_id);

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
                    department_name: department_name,
                    degree: degree,
                    university: university,
                    current_hod: curr_hod,
                    position: "department",
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
    "SELECT refresh_token, refresh_token_expiry FROM department_auth WHERE refresh_token = ?",
    [refreshToken],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error!" });
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid refresh token!" });

      const tokenExpiry = new Date(results[0].refresh_token_expiry);
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
          res.json({ accessToken: generateAccessToken(decoded.department_id) });
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


