import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { pool } from "../data/database.js";

// Environment variables
const SECRET_KEY = process.env.JWT_SECRET;
const RESET_TOKEN_EXPIRY = process.env.RESET_TOKEN_EXPIRY
    ? parseInt(process.env.RESET_TOKEN_EXPIRY) * 60 * 1000
    : 1 * 60 * 60 * 1000;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Request Password Reset (Step 1)
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const result = await pool.execute("SELECT * FROM faculty_auth WHERE email = ?", [email]);
        console.log("Query Result:", result);

        if (!Array.isArray(result) || result.length === 0 || !Array.isArray(result[0])) {
            return res.status(404).json({ message: "User not found." });
        }

        const [rows] = result;
        if (rows.length === 0) return res.status(404).json({ message: "User not found." });

        const faculty = rows[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);

        // Save token in the database
        await pool.execute(
            "UPDATE faculty_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
            [resetToken, tokenExpiry, email]
        );

        // Generate reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        });

        res.json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};


// Reset Password (Step 2)
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        // Fetch user details
        const [rows] = await pool.execute("SELECT * FROM faculty_auth WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found." });

        const faculty = rows[0];

        // Validate token
        if (!faculty.reset_token || faculty.reset_token !== token)
            return res.status(400).json({ message: "Invalid or expired token." });

        if (new Date() > new Date(faculty.token_expiry))
            return res.status(400).json({ message: "Token has expired. Please request a new reset link." });

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await pool.execute(
            "UPDATE faculty_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({ message: "Password successfully reset." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};
