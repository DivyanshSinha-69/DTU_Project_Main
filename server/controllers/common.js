import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";

export const login = (req, res) => {
    console.log("received a login");
    const { email, password } = req.body;
    console.log(email+" "+password);
    // Query to check login credentials
    const sql = "SELECT * FROM student_data WHERE email = ? AND pass = ?";
    // Execute the query
    connectDB.query(sql, [email, password], (err, results) => {
      console.log(results);
      if (err) {
        console.error("Error executing login query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
  
      // Check if the user with the given credentials exists
      if (results.length > 0) {
        sendCookie(results[0], res, `Welcome back, ${results[0].name}`, 200);
      } else {
        res.status(401).json({ error: "Invalid login credentials" });
        return;
      }
    });
  };

export const logout = (req, res) => {
  console.log("logout called");
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
    });
};