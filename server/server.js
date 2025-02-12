import { pool } from "./data/database.js";
import { app } from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to database
pool;

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server is running on port: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
