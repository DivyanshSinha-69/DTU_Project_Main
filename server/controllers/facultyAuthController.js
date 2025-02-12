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

// 🔹 Generate Access Token (Short-lived)
const generateAccessToken = (faculty_id) => {
    return jwt.sign({ faculty_id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    });
};

// 🔹 Generate Refresh Token (Long-lived)
const generateRefreshToken = (faculty_id) => {
    const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 7; // Default to 7 days
    const expirySeconds = expiryDays * 24 * 60 * 60; // Convert days to seconds

    return jwt.sign({ faculty_id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: expirySeconds, // Pass seconds instead of "7d"
    });
};





// ==================== Forgot Password Controller ====================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [result] = await pool.query(
            "SELECT * FROM faculty_auth WHERE email = ?",
            [email]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Generate Reset Token
        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: `${process.env.TOKEN_EXPIRY}m`, algorithm: "HS256" }
        );

        const expiryTime = new Date(Date.now() + Number(process.env.TOKEN_EXPIRY) * 60000);

        // Store token in DB
        await pool.query(
            "UPDATE faculty_auth SET reset_token = ?, token_expiry = ? WHERE email = ?",
            [resetToken, expiryTime, email]
        );

        // Send Reset Email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the link below to reset your password (valid for ${process.env.TOKEN_EXPIRY} minutes):\n\n${resetLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ==================== Reset Password Controller ====================
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const [result] = await pool.query(
            "SELECT * FROM faculty_auth WHERE email = ? AND reset_token = ?",
            [email, token]
        );

        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Check token expiry
        if (new Date(result[0].token_expiry) < new Date()) {
            return res.status(400).json({ error: "Token expired" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and remove reset token
        await pool.query(
            "UPDATE faculty_auth SET password = ?, reset_token = NULL, token_expiry = NULL WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(400).json({ error: "Invalid or expired token" });
    }
};

// ==================== Faculty Login Controller ====================
export const facultyLogin = async (req, res) => {
    const { faculty_id, password } = req.body;

    if (!faculty_id || !password) {
        return res.status(400).json({ message: "Faculty ID and password are required!" });
    }

    try {
        // Fetch user from DB
        const [rows] = await pool.query(
            "SELECT * FROM faculty_auth WHERE faculty_id = ?",
            [faculty_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Faculty ID not found!" });
        }

        const user = rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(user.faculty_id);
        const refreshToken = generateRefreshToken(user.faculty_id);

        // Save Refresh Token in DB
        const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY);

        if (!expiryDays || expiryDays <= 0 || isNaN(expiryDays)) {
            throw new Error(`Invalid REFRESH_TOKEN_EXPIRY value: ${process.env.REFRESH_TOKEN_EXPIRY}`);
        }

        const refreshTokenExpiry = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME format
        console.log("Calculated refreshTokenExpiry:", refreshTokenExpiry);

        await pool.query(
            "UPDATE faculty_auth SET refresh_token = ?, refresh_token_expiry = ? WHERE faculty_id = ?", [refreshToken, refreshTokenExpiry, faculty_id]
        );


        res.json({
            message: "Login successful!",
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
};

// ==================== Refresh Token Controller ====================
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required!" });
    }

    try {
        // Check refresh token in DB
        const [rows] = await pool.query(
            "SELECT refresh_token, refresh_token_expiry FROM faculty_auth WHERE refresh_token = ?",
            [refreshToken]
        );

        console.log("🔹 Refresh Token Sent:", refreshToken);
        console.log("🔹 Database Rows:", rows);

        if (rows.length === 0) {
            return res.status(403).json({ message: "Invalid refresh token!" });
        }

        const storedToken = rows[0].refresh_token;
        const tokenExpiry = new Date(rows[0].refresh_token_expiry);
        const currentTime = new Date();

        console.log("🔹 Stored Token from DB:", storedToken);
        console.log("🔹 Token Expiry:", tokenExpiry);
        console.log("🔹 Current Time:", currentTime);

        // Check if token is expired
        if (tokenExpiry < currentTime) {
            return res.status(403).json({ message: "Refresh token expired!" });
        }
        
        console.log("🔹 JWT Secret Used:", process.env.JWT_REFRESH_SECRET);


        // Verify Refresh Token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                console.error("🔴 JWT Verification Error:", err);
                return res.status(403).json({ message: "Invalid or expired refresh token!" });
            }
        
            console.log("✅ Decoded JWT:", decoded);
            const newAccessToken = generateAccessToken(decoded.faculty_id);
            res.json({ accessToken: newAccessToken });
        });

    } catch (error) {
        console.error("🔴 Refresh Token Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
};

// ==================== Logout Controller ====================
export const logout = async (req, res) => {
    const { faculty_id } = req.body;

    if (!faculty_id) {
        return res.status(400).json({ message: "Faculty ID is required!" });
    }

    try {
        // Remove refresh token from DB
        await pool.query(
            "UPDATE faculty_auth SET refresh_token = NULL WHERE faculty_id = ?",
            [faculty_id]
        );

        res.json({ message: "Logged out successfully!" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
};
