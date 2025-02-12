import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Mysql#@123",
  database: process.env.DB_NAME || "admin",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on traffic
  queueLimit: 0,
});
