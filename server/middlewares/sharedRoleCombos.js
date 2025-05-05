// In a file like middlewares/sharedRoleCombos.js
import { authorizeByRoleCombo } from "./auth.js";

export const studentAccessMiddleware = authorizeByRoleCombo([
  { position: "student", role_assigned: ["BTech", "MTech", "PhD"] }
]);

export const facultyAccessMiddleware = authorizeByRoleCombo([
  { position: "faculty", role_assigned: "general" }
]);

// Super admin: can do everything
export const superAdminAccessMiddleware = authorizeByRoleCombo([
  { position: "admin", role_assigned: "super" }
]);

// Department admin: can do department-specific actions
export const departmentAdminAccessMiddleware = authorizeByRoleCombo([
  { position: "admin", role_assigned: "department" }
]);

// If you want to allow both in some routes:
export const anyAdminAccessMiddleware = authorizeByRoleCombo([
  { position: "admin", role_assigned: ["super", "department"] }
]);