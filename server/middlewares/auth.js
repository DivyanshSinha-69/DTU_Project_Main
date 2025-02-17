import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    console.log("✅ Token Valid. User:", decoded);
    req.user = decoded;
    next();
  });
};
