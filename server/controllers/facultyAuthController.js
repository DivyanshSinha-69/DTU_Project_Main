import { pool } from "../data/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from 'axios'; // Import axios for HTTP requests
import requestIp from "request-ip"; // Put this at the top if not imported already
import { promisePool } from "../data/database.js";
import { userActionLogger, errorLogger } from "../utils/logger.js";

dotenv.config();

// ✅ Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// ==================== Generate Access Token ====================
const generateAccessToken = (roll_no, position, role_assigned) => {
  return jwt.sign({ roll_no, position, role_assigned }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// ==================== Generate Refresh Token ====================
const generateRefreshToken = (roll_no, position, role_assigned) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign({ roll_no, position, role_assigned }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expirySeconds,
  });
};


// ==================== Forgot Password Controller ====================
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  pool.query(
    "SELECT * FROM faculty_auth WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Faculty not found" });
      }

      // Generate Reset Token
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.TOKEN_EXPIRY}m`,
        algorithm: "HS256",
      });

      const expiryTime = new Date(
        Date.now() + Number(process.env.TOKEN_EXPIRY) * 60000,
      );

      // Store token in DB
      pool.query(
        "UPDATE faculty_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
        [resetToken, expiryTime, email],
        async (updateErr) => {
          if (updateErr) {
            console.error("Database Update Error:", updateErr);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Prepare the reset link
          const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

          // Prepare email data for Brevo API
          const emailData = {
            sender: {
              name: process.env.EMAIL_FROM_NAME,
              email: process.env.EMAIL_FROM_EMAIL,
            },
            to: [{ email }],
            subject: "Password Reset Request",
            htmlContent: `
              <p>Hello,</p>
              <p>Click the link below to reset your password (valid for ${process.env.TOKEN_EXPIRY} minutes):</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
            `,
          };

          // Send Reset Email via Brevo API
          try {
            const response = await axios.post(
              'https://api.brevo.com/v3/smtp/email',
              emailData,
              {
                headers: {
                  'api-key': process.env.BREVO_API_KEY,
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log("✅ Reset email sent successfully via Brevo:", response.data);
            res.json({ message: "Reset link sent to email" });
          } catch (emailErr) {
            console.error("❌ Error sending reset email via Brevo:", emailErr.response?.data || emailErr.message);
            return res.status(500).json({ error: "Failed to send email" });
          }
        },
      );
    },
  );
};

export const resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    pool.query(
      "SELECT * FROM faculty_auth WHERE email = ? AND reset_token = ?",
      [email, token],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length === 0) {
          return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Check token expiry
        if (new Date(result[0].token_expiry) < new Date()) {
          return res.status(400).json({ error: "Token expired" });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Password Hashing Error:", hashErr);
            return res.status(500).json({ error: "Failed to hash password" });
          }

          // Update password and remove reset token
          pool.query(
            "UPDATE faculty_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
            [hashedPassword, email],
            (updateErr) => {
              if (updateErr) {
                console.error("Database Update Error:", updateErr);
                return res
                  .status(500)
                  .json({ error: "Failed to reset password" });
              }

              res.json({ message: "Password reset successful" });
            },
          );
        });
      },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export const facultyLogin = async (req, res) => {
  const { faculty_id, password } = req.body;

  if (!faculty_id || !password) {
    return res.status(400).json({ message: "Faculty ID and password are required!" });
  }

  try {
    // Step 1: Get faculty authentication details
    const [facultyAuth] = await promisePool.query(
      `SELECT fa.*, pt.position_name
       FROM faculty_auth fa
       LEFT JOIN position_type pt ON fa.position_id = pt.position_id
       WHERE fa.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyAuth.length === 0) {
      return res.status(404).json({ message: "Faculty ID not found!" });
    }

    const user = facultyAuth[0];
    const deptid = user.department_id;
    const position = user.position_name;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password!" });

    // Step 2: Get name and designation
    const [facultyDetails] = await promisePool.query(
      `SELECT fd.faculty_name, fa.designation
       FROM faculty_details fd 
       LEFT JOIN faculty_association fa ON fd.faculty_id = fa.faculty_id 
       WHERE fd.faculty_id = ?`,
      [faculty_id]
    );

    if (facultyDetails.length === 0) {
      return res.status(404).json({ message: "Faculty details not found!" });
    }

    const { faculty_name, designation } = facultyDetails[0];

    // Step 3: Get counts
    const [counts] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM faculty_research_paper WHERE faculty_id = ?) AS research_papers,
        (SELECT COUNT(*) FROM faculty_sponsored_research WHERE faculty_id = ?) AS sponsorships,
        (SELECT COUNT(*) FROM faculty_patents WHERE faculty_id = ?) AS patents,
        (SELECT COUNT(*) FROM faculty_Book_records WHERE faculty_id = ?) AS book_records,
        (SELECT COUNT(*) FROM faculty_consultancy WHERE faculty_id = ?) AS consultancy`,
      [faculty_id, faculty_id, faculty_id, faculty_id, faculty_id]
    );

    // Step 4: Get unread notifications
    const [notifications] = await promisePool.query(
      `SELECT 
        (SELECT COUNT(*) FROM department_duty_notifications 
         WHERE user_id = ? AND is_seen = 0) AS unread_duties,
         
        (SELECT COUNT(*) FROM department_circular 
         WHERE department_id = (SELECT department_id FROM faculty_auth WHERE faculty_id = ?)
         AND created_at > COALESCE(
           (SELECT last_seen FROM user_last_seen_notifications 
            WHERE user_id = ? AND notification_type = 'circular'), '2000-01-01')
        ) AS unread_circulars`,
      [faculty_id, faculty_id, faculty_id]
    );

    // Step 5: Generate tokens
    const role_assigned = "general"; // <-- Added
    const accessToken = generateAccessToken(faculty_id, position, role_assigned);
    const refreshToken = generateRefreshToken(faculty_id, position, role_assigned);

    const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
    const refreshTokenExpiry = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // Step 6: Save refresh token in DB
    await promisePool.query(
      "UPDATE faculty_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE faculty_id = ?",
      [refreshToken, refreshTokenExpiry, faculty_id]
    );

    // Step 7: Log activity
    const ipAddress = requestIp.getClientIp(req);
    const userAgent = req.headers["user-agent"];
    await promisePool.query(
      "INSERT INTO faculty_login_activity (faculty_id, ip_address, user_agent) VALUES (?, ?, ?)",
      [faculty_id, ipAddress, userAgent]
    );

    userActionLogger.info(`✅ Faculty ${faculty_id} logged in`);

    // Step 8: Send response and set httpOnly cookie
    res
  .cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes or whatever ACCESS_TOKEN_EXPIRY is
  })
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: expiryDays * 24 * 60 * 60 * 1000,
  })
  .json({
    message: "Login successful!",
    user: {
      faculty_id: user.faculty_id,
      faculty_name,
      faculty_designation: designation,
      position,
      researchCount: counts[0].research_papers,
      sponsorCount: counts[0].sponsorships,
      patentCount: counts[0].patents,
      bookCount: counts[0].book_records,
      consultancyCount: counts[0].consultancy,
      unreadDuties: notifications[0].unread_duties,
      unreadCirculars: notifications[0].unread_circulars,
      department_id: deptid,
    },
  });


  } catch (err) {
    errorLogger.error(`❌ Faculty login error for ${faculty_id}: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      errorLogger.warn("❌ Refresh token missing in cookies.");
      return res.status(401).json({ message: "Refresh token is required!" });
    }

    const [results] = await promisePool.query(
      `SELECT fa.faculty_id, fa.refresh_token_expiry, pt.position_name 
       FROM faculty_auth fa
       LEFT JOIN position_type pt ON fa.position_id = pt.position_id
       WHERE fa.refresh_token = ?`,
      [refreshToken]
    );

    if (results.length === 0) {
      errorLogger.warn("❌ Invalid refresh token.");
      return res.status(401).json({ message: "Invalid refresh token!" });
    }

    const user = results[0];
    const tokenExpiry = new Date(user.refresh_token_expiry);

    if (tokenExpiry < new Date()) {
      errorLogger.warn(`⏳ Refresh token expired for faculty ${user.faculty_id}`);
      return res.status(401).json({ message: "Refresh token expired!" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) {
        errorLogger.warn(`❌ Refresh token verification failed: ${err.message}`);
        return res.status(401).json({ message: "Invalid or expired refresh token!" });
      }

      const role_assigned = "general"; // Set manually for faculty
      const newAccessToken = generateAccessToken(user.faculty_id, user.position_name, role_assigned);

      res
        .cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, // 15 minutes or use ACCESS_TOKEN_EXPIRY from env
        })
        .json({ message: "New access token issued." });

      userActionLogger.info(`🔄 Access token refreshed for faculty ${user.faculty_id}`);
    });
  } catch (err) {
    errorLogger.error(`❌ Refresh token controller error: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};

export const facultyLogout = async (req, res) => {
  const { faculty_id } = req.body;

  if (!faculty_id) {
    return res.status(400).json({ message: "Faculty ID is required!" });
  }

  try {
    // Remove refresh token and expiry from DB
    await promisePool.query(
      "UPDATE faculty_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE faculty_id = ?",
      [faculty_id]
    );

    // Clear httpOnly cookies
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .json({ message: "Logged out successfully!" });

    userActionLogger.info(`👋 Faculty ${faculty_id} logged out`);
  } catch (err) {
    errorLogger.error(`❌ Logout failed for faculty ${faculty_id}: ${err.message}`);
    res.status(500).json({ message: "Server error!" });
  }
};
