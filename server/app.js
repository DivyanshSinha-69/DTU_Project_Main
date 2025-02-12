import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routers
import adminRouter from "./routes/admin.js";
import professorRouter from "./routes/faculty.js";
import studentRouter from "./routes/student.js";
import commonRouter from "./routes/common.js";
import authRouter from "./routes/facultyAuthRoutes.js"; // Added Forgot Password Routes

import { errorMiddleware } from "./middlewares/error.js";

// Load environment variables
config({ path: "./essentials.env" });

export const app = express();
app.use("/public", express.static("public"));

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "../profile/build");

// Serve static files
app.use(express.static(buildPath));

// CORS Configuration
const corsMethods = (process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS").split(",");

const allowedOrigins = process.env.ALLOWED_ORIGINS === "*" ? true : process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    methods: corsMethods,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);



app.options("*", cors()); // Allow preflight requests

// Middleware
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use("/ece/admin", adminRouter);
app.use("/ece/faculty", professorRouter);
app.use("/ece/student", studentRouter);
app.use("/", commonRouter);
app.use("/ece/facultyauth", authRouter); // <-- Added this for forgot password functionality

// Serve React Frontend
app.get("/*", function (req, res) {
  res.sendFile(path.join(buildPath, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(errorMiddleware);
