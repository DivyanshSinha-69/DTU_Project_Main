import { connectDB } from "../data/database.js";
import { sendCookie } from "../utils/featues.js";



export const getall = (req, res) => {
  connectDB.query("SELECT * FROM professor_data", (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

