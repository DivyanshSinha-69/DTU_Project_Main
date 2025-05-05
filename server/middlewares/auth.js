import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userActionLogger, errorLogger } from "../utils/logger.js";

dotenv.config();

/**
 * Middleware to authenticate token and verify user roles.
 */
export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    errorLogger.warn("❌ No token provided!");
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

    userActionLogger.info(`✅ Token validated successfully for ${decoded.id}`);

    if (!decoded.position) {
      errorLogger.warn("⚠️ Position field missing in token!");
      return res
        .status(403)
        .json({ error: "Unauthorized access. No position found." });
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
      return res
        .status(403)
        .json({ error: "Unauthorized access. No position found." });
    }

    const userRole = req.user.position.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      errorLogger.error(
        `🚫 Access denied. Position '${userRole}' is not allowed.`
      );
      return res
        .status(403)
        .json({ error: "Unauthorized access. Insufficient privileges." });
    }

    userActionLogger.info(`✅ Access granted to ${userRole}`);
    next();
  };
};

export const authorizeByUserId = (req, res, next) => {
  const { user } = req;

  // Collect all possible identifiers from query, params, or body
  const requestId =
    req.query.faculty_id ||
    req.params.faculty_id ||
    (req.body && req.body.faculty_id) ||
    req.query.roll_no ||
    req.params.roll_no ||
    (req.body && req.body.roll_no) ||
    req.query.department_id ||
    req.params.department_id ||
    (req.body && req.body.department_id) ||
    req.query.user_id ||
    req.params.user_id ||
    (req.body && req.body.user_id);

  if (!requestId) {
    errorLogger.warn(
      "❌ Identifier (faculty_id, roll_no, or department_id) is missing in the request."
    );
    return res.status(400).json({
      message:
        "An identity (faculty_id, roll_no, or department_id) is required.",
    });
  }

  // Admins are always allowed
  if (user.position === "admin" || requestId === user.id) {
    userActionLogger.info(
      `✅ Authorized access by ${user.position} ${user.id}`
    );
    return next();
  }

  errorLogger.error(
    `🚫 Unauthorized access attempt by ${user.position} ${user.id} for id: ${requestId}`
  );
  return res
    .status(403)
    .json({ message: "Unauthorized access to the requested identity." });
};

/**
 * Middleware to authorize based on position + role_assigned combo.
 * @param {Array<{position: string, role_assigned: string | string[]}>} allowedCombos
 */
export const authorizeByRoleCombo = (allowedCombos) => {
  return (req, res, next) => {
    const { position, role_assigned } = req.user || {};
    if (!position || !role_assigned) {
      errorLogger.warn("❌ Missing position or role_assigned in token.");
      return res
        .status(403)
        .json({ error: "Unauthorized: Missing role information." });
    }

    const match = allowedCombos.some((combo) => {
      const positionMatches =
        combo.position.toLowerCase() === position.toLowerCase();

      const roles = Array.isArray(combo.role_assigned)
        ? combo.role_assigned.map((r) => r.toLowerCase())
        : [combo.role_assigned.toLowerCase()];

      return positionMatches && roles.includes(role_assigned.toLowerCase());
    });

    if (!match) {
      errorLogger.error(
        `🚫 Access denied for combination: ${position} - ${role_assigned}`
      );
      return res
        .status(403)
        .json({ error: "Unauthorized: Insufficient privileges." });
    }

    userActionLogger.info(
      `✅ Access granted to ${position} - ${role_assigned}`
    );
    next();
  };
};

export const authorizeSameDepartment = (req, res, next) => {
  const { user } = req;
  const requestedDept =
    req.params.department_id ||
    req.query.department_id ||
    req.body.department_id;

  // Admins can access any department
  if (user.position === "admin") return next();

  if (!requestedDept) {
    return res
      .status(400)
      .json({ message: "department_id is required in request." });
  }
  console.log("Requested department:", requestedDept);
  console.log("User position:", user);
  console.log("User department:", user.department_id);
  if (user.department_id !== requestedDept) {
    errorLogger.error(
      `🚫 Unauthorized department access by ${user.position} ${user.faculty_id || user.roll_no}`
    );
    return res.status(403).json({
      message: "Unauthorized. You can only access your own department's data.",
    });
  }

  userActionLogger.info(
    `✅ ${user.position} ${user.faculty_id || user.roll_no} accessing department: ${requestedDept}`
  );
  next();
};

export const authorizeAdminDepartment = (req, res, next) => {
  const { position, role_assigned, department_id } = req.user || {};

  // Only admins
  if (position !== "admin") {
    return res.status(403).json({ error: "Not an admin." });
  }

  // Super admin: allow all
  if (role_assigned === "super") {
    return next();
  }

  // Department admin: restrict to their own department
  if (role_assigned === "department") {
    const requestedDept =
      req.params.department_id ||
      req.query.department_id ||
      req.body.department_id;

    if (!requestedDept) {
      return res.status(400).json({ error: "department_id is required." });
    }
    if (requestedDept !== department_id) {
      return res.status(403).json({ error: "Access denied to other departments." });
    }
    return next();
  }

  // Fallback
  return res.status(403).json({ error: "Invalid admin role." });
};
