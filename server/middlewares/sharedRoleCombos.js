// In a file like middlewares/sharedRoleCombos.js
import { authorizeByRoleCombo } from "./auth.js";

export const studentAccessMiddleware = authorizeByRoleCombo([
  { position: "student", role_assigned: ["BTech", "MTech", "PhD"] }
]);

export const facultyAccessMiddleware = authorizeByRoleCombo([
  { position: "faculty", role_assigned: "general" }
]);