import jwt from "jsonwebtoken";
import dotenv from "dotenv";



dotenv.config();

export const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        
        req.user = decoded; // Attach user data (faculty_id) to request
        next(); // Move to the next middleware/route handler
    });
};
