import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";

export const login = (req, res) => {
  const { email, password } = req.body;
  // Query to check login credentials
  const sql = "SELECT * FROM admin_data WHERE email = ? AND pass = ?";

  // Execute the query
  connectDB.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Error executing login query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the user with the given credentials exists
    if (results.length > 0) {
      sendCookie(results[0], res, `Welcome back, ${results[0].name}`, 200);
      res.status(200).json({ success: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid login credentials" });
    }
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
    });
};

export const getall = (req, res) => {
  connectDB.query("SELECT * FROM admin_data", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};
