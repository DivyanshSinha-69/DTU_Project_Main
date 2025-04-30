import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userActionLogger, errorLogger } from "../utils/logger.js";

dotenv.config();

/**
 * Middleware to authenticate token and verify user roles.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    errorLogger.warn("❌ No token provided in request headers!");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        errorLogger.warn("⏳ Token expired!");
        return res.status(403).json({ error: "Token expired" });
      }
      errorLogger.warn("❌ Invalid token!");
      return res.status(401).json({ error: "Invalid token" });
    }

    userActionLogger.info(`✅ Token validated successfully for ${decoded.roll_no}`);

    if (!decoded.position) {
      errorLogger.warn("⚠️ Position field missing in token!");
      return res.status(403).json({ error: "Unauthorized access. No position found." });
    }

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
      errorLogger.warn("❌ No position found in the user token!");
      return res.status(403).json({ error: "Unauthorized access. No position found." });
    }

    const userRole = req.user.position.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      errorLogger.error(`🚫 Access denied. Position '${userRole}' is not allowed.`);
      return res.status(403).json({ error: "Unauthorized access. Insufficient privileges." });
    }

    userActionLogger.info(`✅ Access granted to ${userRole}`);
    next();
  };
};

/**
 * Middleware to ensure the user is updating or fetching their own data.
 */
export const authorizeOwnData = (req, res, next) => {
  const { user } = req;
  const roll_no = req.params.roll_no || req.query.roll_no;

  if (!roll_no) {
    errorLogger.warn("❌ Roll number is missing in the request.");
    return res.status(400).json({ message: "Roll number is required." });
  }

  if (user.roll_no !== roll_no) {
    errorLogger.error(`🚫 Unauthorized access attempt by user with roll_no: ${user.roll_no}.`);
    return res.status(403).json({ message: "Unauthorized access. You can only modify/see your own data." });
  }

  userActionLogger.info(`✅ User ${user.roll_no} is accessing their own data.`);
  next();
};

/**
 * Middleware to authorize based on position + role_assigned combo.
 * @param {Array<{position: string, role_assigned: string}>} allowedCombos
 */
export const authorizeByRoleCombo = (allowedCombos) => {
  return (req, res, next) => {
    const { position, role_assigned } = req.user || {};

    if (!position || !role_assigned) {
      errorLogger.warn("❌ Missing position or role_assigned in token.");
      return res.status(403).json({ error: "Unauthorized: Missing role information." });
    }

    const match = allowedCombos.some(
      (combo) =>
        combo.position.toLowerCase() === position.toLowerCase() &&
        combo.role_assigned.toLowerCase() === role_assigned.toLowerCase()
    );

    if (!match) {
      errorLogger.warn(`🚫 Access denied for combination: ${position} - ${role_assigned}`);
      return res.status(403).json({ error: "Unauthorized: Insufficient privileges." });
    }

    userActionLogger.info(`✅ Access granted to ${position} - ${role_assigned}`);
    next();
  };
};
