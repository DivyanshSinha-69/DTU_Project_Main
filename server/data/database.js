import mysql from "mysql2";

// Create a MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12348765@",
  database: process.env.DB_NAME || "admin",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});
