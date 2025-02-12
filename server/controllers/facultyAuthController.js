import { pool } from "../data/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==================== Forgot Password Controller ====================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    pool.query(
      "SELECT * FROM faculty_auth WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0)
          return res.status(404).json({ message: "Faculty not found" });

        // Generate JWT Reset Token
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: `${process.env.TOKEN_EXPIRY}m`,
          algorithm: "HS256",
        });

        const expiryTime = new Date(
          Date.now() + process.env.TOKEN_EXPIRY * 60000,
        );

        pool.query(
          "UPDATE faculty_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
          [resetToken, expiryTime, email],
          (updateErr) => {
            if (updateErr)
              return res.status(500).json({ error: updateErr.message });

            // Send Reset Email
            const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: "Password Reset Request",
              text: `Click the link below to reset your password (valid for ${process.env.TOKEN_EXPIRY} minutes):\n\n${resetLink}`,
            };

            transporter.sendMail(mailOptions, (error) => {
              if (error) return res.status(500).json({ error: error.message });
              res.json({ message: "Reset link sent to email" });
            });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Reset Password Controller ====================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    pool.query(
      "SELECT * FROM faculty_auth WHERE email = ? AND reset_token = ?",
      [email, token],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0)
          return res.status(400).json({ error: "Invalid or expired token" });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and remove reset token
        pool.query(
          "UPDATE faculty_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
          [hashedPassword, email],
          (updateErr) => {
            if (updateErr)
              return res.status(500).json({ error: updateErr.message });
            res.json({ message: "Password reset successful" });
          },
        );
      },
    );
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
