import { pool } from "../data/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==================== Generate Access Tokens ====================
const generateAccessToken = (faculty_id, position) => {
  return jwt.sign({ faculty_id, position }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// ==================== Generate Refresh Token ====================
const generateRefreshToken = (faculty_id, position) => {
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7;
  const expirySeconds = expiryDays * 24 * 60 * 60;

  return jwt.sign({ faculty_id, position }, process.env.JWT_REFRESH_SECRET, {
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
        (updateErr) => {
          if (updateErr) {
            console.error("Database Update Error:", updateErr);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Send Reset Email
          const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the link below to reset your password (valid for ${process.env.TOKEN_EXPIRY} minutes):\n\n${resetLink}`,
          };

          transporter.sendMail(mailOptions, (emailErr) => {
            if (emailErr) {
              console.error("Email Sending Error:", emailErr);
              return res.status(500).json({ error: "Failed to send email" });
            }

            res.json({ message: "Reset link sent to email" });
          });
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

export const facultyLogin = (req, res) => {
  const { faculty_id, password } = req.body;

  if (!faculty_id || !password) {
    return res.status(400).json({ message: "Faculty ID and password are required!" });
  }

  // First query to get faculty details
  pool.query(
    `SELECT fa.*, pt.position_name
     FROM faculty_auth fa
     LEFT JOIN position_type pt ON fa.position_id = pt.position_id
     WHERE fa.faculty_id = ?`,
    [faculty_id],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Server error!" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Faculty ID not found!" });
      }

      const user = results[0];
      const deptid = user.department_id;
      // Compare passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Server error!" });
        if (!isMatch) return res.status(401).json({ message: "Invalid password!" });

        // Second query to get faculty name and designation
        pool.query(
          `SELECT fd.faculty_name, fa.designation
           FROM faculty_details fd 
           LEFT JOIN faculty_association fa ON fd.faculty_id = fa.faculty_id 
           WHERE fd.faculty_id = ?`,
          [faculty_id],
          (err, facultyResults) => {
            if (err) {
              console.error("Database Error:", err);
              return res.status(500).json({ message: "Server error!" });
            }

            if (facultyResults.length === 0) {
              return res.status(404).json({ message: "Faculty details not found!" });
            }

            const { faculty_name, designation } = facultyResults[0];

            // Third query to get faculty counts
            pool.query(
              `SELECT 
                  (SELECT COUNT(*) FROM faculty_research_paper WHERE faculty_id = ?) AS research_papers,
                  (SELECT COUNT(*) FROM faculty_sponsored_research WHERE faculty_id = ?) AS sponsorships,
                  (SELECT COUNT(*) FROM faculty_patents WHERE faculty_id = ?) AS patents,
                  (SELECT COUNT(*) FROM faculty_Book_records WHERE faculty_id = ?) AS book_records,
                  (SELECT COUNT(*) FROM faculty_consultancy WHERE faculty_id = ?) AS consultancy`,
              [faculty_id, faculty_id, faculty_id, faculty_id, faculty_id],
              (err, countResults) => {
                if (err) {
                  console.error("Database Error:", err);
                  return res.status(500).json({ message: "Server error!" });
                }

                const {
                  research_papers,
                  sponsorships,
                  patents,
                  book_records,
                  consultancy,
                } = countResults[0];

                const position = user.position_name;

                 // Fourth query: Fetch unread duty and circular notifications
                 pool.query(
                  `SELECT 
                      (SELECT COUNT(*) FROM department_duty_notifications 
                      WHERE user_id = ? AND is_seen = 0) AS unread_duties,
                      
                      (SELECT COUNT(*) FROM department_circular 
                       WHERE department_id = (SELECT department_id FROM faculty_auth WHERE faculty_id = ?)
                       AND created_at > COALESCE((SELECT last_seen FROM user_last_seen_notifications 
                                                  WHERE user_id = ? AND notification_type = 'circular'), '2000-01-01')) 
                       AS unread_circulars`,
                  [faculty_id, faculty_id, faculty_id, faculty_id],
                  (err, unreadResults) => {
                      if (err) {
                          console.error("Database Error:", err);
                          return res.status(500).json({ message: "Server error!" });
                      }

                      const { unread_duties, unread_circulars } = unreadResults[0];

                // Generate tokens
                const accessToken = generateAccessToken(user.faculty_id, position);
                const refreshToken = generateRefreshToken(user.faculty_id, position);

                const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY) || 7;
                const refreshTokenExpiry = new Date(
                  Date.now() + expiryDays * 24 * 60 * 60 * 1000,
                )
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");

                // Fourth query to store refresh token
                pool.query(
                  "UPDATE faculty_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE faculty_id = ?",
                  [refreshToken, refreshTokenExpiry, faculty_id],
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
                        faculty_id: user.faculty_id,
                        faculty_name: faculty_name,
                        faculty_designation: designation,
                        position: position, // Use fetched position
                        researchCount: research_papers,
                        sponsorCount: sponsorships,
                        patentCount: patents,
                        bookCount: book_records,
                        consultancyCount: consultancy,
                        unreadDuties: unread_duties,
                        unreadCirculars: unread_circulars,
                        department_id: deptid,
                      },
                    });
                  },
                );
              },
            );
          },
        );
      });
    });
    },
  );
};


export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required!" });
  }

  // First query: Fetch faculty details based on refresh token
  pool.query(
    `SELECT fa.faculty_id, fa.refresh_token, fa.refresh_token_expiry, pt.position_name 
     FROM faculty_auth fa
     LEFT JOIN position_type pt ON fa.position_id = pt.position_id
     WHERE fa.refresh_token = ?`,
    [refreshToken],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Server error!" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid refresh token!" });
      }

      const user = results[0];
      const tokenExpiry = new Date(user.refresh_token_expiry);

      if (tokenExpiry < new Date()) {
        return res.status(401).json({ message: "Refresh token expired!" });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired refresh token!" });
        }

        // Generate new access token using the stored faculty_id and position
        const newAccessToken = generateAccessToken(user.faculty_id, user.position_name);

        res.json({
          accessToken: newAccessToken,
        });
      });
    },
  );
};

// ==================== Logout Controller ====================
export const logout = (req, res) => {
  const { faculty_id } = req.body;

  if (!faculty_id) {
    return res.status(400).json({ message: "Faculty ID is required!" });
  }

  // Query to remove refresh token
  pool.query(
    "UPDATE faculty_auth SET refresh_token = NULL, refresh_token_expiry = NULL WHERE faculty_id = ?",
    [faculty_id],
    (err) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Server error!" });
      }

      res.json({ message: "Logged out successfully!" });
    },
  );
};
