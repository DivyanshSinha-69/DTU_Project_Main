// In a file like middlewares/sharedRoleCombos.js
import { authorizeByRoleCombo } from "./auth.js";

export const studentAccessMiddleware = authorizeByRoleCombo([
  { position: "student", role_assigned: ["BTech", "MTech", "PhD"] },
  { position: "faculty", role_assigned: "general" },
  { position: "department", role_assigned: "general" },
]);