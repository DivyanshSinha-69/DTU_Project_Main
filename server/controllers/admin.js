import { pool } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";
import exceljs from "exceljs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import { promisePool } from "../data/database.js";
import { userActionLogger, errorLogger } from "../utils/logger.js";

// ==================== Generate Access Token ====================
const generateAdminAccessToken = (user_id, position, role_assigned, department_id) => {
  return jwt.sign(
    { id: user_id, position, role_assigned, department_id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ==================== Generate Refresh Token ====================
const generateAdminRefreshToken = (user_id, position, role_assigned, department_id) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign(
    { id: user_id, position, role_assigned, department_id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: expirySeconds,
    }
  );
};


export const getall = (req, res) => {
  pool.query("SELECT * FROM admin_data", (error, results) => {
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

  if (info === "mtechEducationalDetails" && courseGroup === "Btech") {
    info = "btechEducationalDetails";
  }

  // Make sure to sanitize the table name to prevent SQL injection
  const sanitizedInfo = pool.escapeId(info);

  let sql = "";

  if (info === "defaulters") {
    // Fetch details for students whose RollNo is in Student_data but not in both studentPersonalDetails and btechEducationalDetails

    let educationalTable = "";

    if (courseGroup === "Mtech") {
      educationalTable = "mtechEducationalDetails";
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
  pool.query(sql, [year1, year2, courseGroup], (error, results) => {
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





// ==================== Admin Login ====================
export const adminLogin = async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    errorLogger.error(
      `Admin login failed: User ID or password missing. User ID: ${user_id}`
    );
    return res
      .status(400)
      .json({ message: "User ID and password are required!" });
  }

  try {
    const [results] = await promisePool.query(
      `SELECT aa.*, pt.position_name, aar.role_name AS role_assigned_name, dd.department_name
       FROM admin_auth aa
       LEFT JOIN position_type pt ON aa.position_id = pt.position_id
       LEFT JOIN admin_available_roles aar ON aa.role_assigned = aar.role_id
       LEFT JOIN department_details dd ON aa.department_id = dd.department_id
       WHERE aa.user_id = ? OR aa.email = ?`,
      [user_id, user_id]
    );

    if (results.length === 0) {
      errorLogger.error(`Admin not found. User ID/Email: ${user_id}`);
      return res.status(404).json({ message: "Admin not found!" });
    }

    const admin = results[0];
    const { position_name, role_assigned_name, department_name } = admin;

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      errorLogger.error(`Invalid password attempt. User ID: ${user_id}`);
      return res.status(401).json({ message: "Invalid password!" });
    }

    const accessToken = generateAdminAccessToken(
      admin.user_id,
      position_name,
      role_assigned_name,
      admin.department_id
    );
    const refreshToken = generateAdminRefreshToken(
      admin.user_id,
      position_name,
      role_assigned_name,
      admin.department_id
    );

    const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
    const refreshTokenExpiry = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await promisePool.query(
      "UPDATE admin_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE user_id = ?",
      [refreshToken, refreshTokenExpiry, admin.user_id]
    );

    const ipAddress = requestIp.getClientIp(req);
    const userAgent = req.headers["user-agent"];

    await promisePool.query(
      "INSERT INTO admin_login_activity (user_id, ip_address, user_agent) VALUES (?, ?, ?)",
      [user_id, ipAddress, userAgent]
    );

    userActionLogger.info(
      `Admin login successful. User ID: ${admin.user_id}, IP: ${ipAddress}`
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({
      message: "Login successful!",
      user: {
        user_id: admin.user_id,
        position: position_name,
        role_assigned: role_assigned_name,
        department_name: department_name,
      },
    });
  } catch (err) {
    errorLogger.error(`Admin login error: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

// ==================== Admin Refresh Token ====================
export const adminRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      errorLogger.warn("❌ Admin refresh token missing in cookies.");
      return res.status(401).json({ message: "Refresh token is required!" });
    }

    const [results] = await promisePool.query(
      `SELECT aa.user_id, aa.refresh_token_expiry, aa.role_assigned, aa.department_id,
              pt.position_name, aar.role_name AS role_assigned_name
       FROM admin_auth aa
       JOIN position_type pt ON aa.position_id = pt.position_id
       LEFT JOIN admin_available_roles aar ON aa.role_assigned = aar.role_id
       WHERE aa.refresh_token = ?`,
      [refreshToken]
    );

    if (results.length === 0) {
      errorLogger.warn("❌ Invalid admin refresh token.");
      return res.status(401).json({ message: "Invalid refresh token!" });
    }

    const admin = results[0];
    const tokenExpiry = new Date(admin.refresh_token_expiry);

    if (tokenExpiry < new Date()) {
      errorLogger.warn(`⏳ Admin refresh token expired for user_id: ${admin.user_id}`);
      return res.status(401).json({ message: "Refresh token expired!" });
    }

    try {
      await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = generateAdminAccessToken(
        admin.user_id,
        admin.position_name,
        admin.role_assigned_name,
        admin.department_id
      );

      const newRefreshToken = generateAdminRefreshToken(
        admin.user_id,
        admin.position_name,
        admin.role_assigned_name,
        admin.department_id
      );

      const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
      const newRefreshTokenExpiry = new Date(
        Date.now() + expiryDays * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await promisePool.query(
        "UPDATE admin_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE user_id = ?",
        [newRefreshToken, newRefreshTokenExpiry, admin.user_id]
      );

      res
        .cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: expiryDays * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "New access token and refresh token issued.",
        });

      userActionLogger.info(`🔄 Admin tokens refreshed for user_id: ${admin.user_id}`);
    } catch (err) {
      errorLogger.warn(
        `❌ Admin refresh token verification failed for user_id: ${admin.user_id}: ${err.message}`
      );
      return res.status(401).json({ message: "Invalid or expired refresh token!" });
    }
  } catch (err) {
    errorLogger.error(`🚨 Server error during admin token refresh: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

// ==================== Admin Verify Auth ====================
export const adminVerifyAuth = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      errorLogger.warn("❌ No admin access token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      errorLogger.warn(`❌ Invalid or expired admin token in cookie: ${err.message}`);
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }

    const { id } = decoded;

    if (!id) {
      errorLogger.warn(
        `❌ Missing required fields in admin token payload: ${JSON.stringify(decoded)}`
      );
      return res.status(400).json({ message: "Bad request - Missing token data" });
    }

    const user_id = id;

    const [results] = await promisePool.query(
      `SELECT aa.user_id, aa.position_id, aa.role_assigned, aa.department_id,
              pt.position_name, aar.role_name AS role_assigned_name, dd.department_name
       FROM admin_auth aa
       JOIN position_type pt ON aa.position_id = pt.position_id
       LEFT JOIN admin_available_roles aar ON aa.role_assigned = aar.role_id
       LEFT JOIN department_details dd ON aa.department_id = dd.department_id
       WHERE aa.user_id = ?`,
      [user_id]
    );

    if (results.length === 0) {
      errorLogger.warn(`❌ Admin not found. User ID: ${user_id}`);
      return res.status(404).json({ message: "Admin user not found!" });
    }

    const admin = results[0];

    userActionLogger.info(
      `✔️ Admin token verified successfully for user_id: ${user_id}`
    );

    res.json({
      message: "Token is valid!",
      user: {
        user_id: admin.user_id,
        position_name: admin.position_name,
        role_assigned: admin.role_assigned_name,
        department_name: admin.department_name,
      },
    });
  } catch (err) {
    errorLogger.error(`❌ Server error during admin token verification: ${err.message}`);
    res.status(500).json({
      message: "Server error!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ==================== Admin Logout ====================
export const adminLogout = async (req, res) => {
  const { user } = req;

  if (!user || !user.id) {
    errorLogger.error("Admin logout failed: No authenticated user found.");
    return res.status(401).json({ message: "Unauthorized!" });
  }

  try {
    await promisePool.query(
      "UPDATE admin_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE user_id = ?",
      [user.id]
    );

    userActionLogger.info(
      `Admin logged out successfully. User ID: ${user.id}`
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully!" });
  } catch (err) {
    errorLogger.error(`Admin logout error: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};