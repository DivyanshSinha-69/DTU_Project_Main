import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userActionLogger } from "../utils/logger.js";
import { errorLogger } from "../utils/logger.js";


dotenv.config();

/**
 * Middleware to authenticate token and verify user roles.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("🔹 Received Token in Backend:", token);

  if (!token) {
    console.warn("❌ No token provided in request headers!");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.warn("⏳ Token expired!");
        return res.status(403).json({ error: "Token expired" });
      }
      console.warn("❌ Invalid token!");
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("✅ Token Valid. Decoded Data:", decoded);

    // Ensure position (role) is available
    if (!decoded.position) {
      console.warn("⚠️ Position field missing in token!");
      return res.status(403).json({ error: "Unauthorized access. No position found." });
    }

    // Attach user data to request for further role verification
    req.user = decoded;
    next();
  });
};

/**
 * Middleware to restrict access based on user roles.
 * @param {string[]} allowedRoles - Array of roles allowed to access the route.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.position) {
      return res.status(403).json({ error: "Unauthorized access. No position found." });
    }

    const userRole = req.user.position.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚫 Access denied. Position '${userRole}' is not allowed.`);
      return res.status(403).json({ error: "Unauthorized access. Insufficient privileges." });
    }

    console.log(`✅ Access granted to ${userRole}`);
    next();
  };
};
