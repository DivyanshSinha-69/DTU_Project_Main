import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routers
import adminRouter from "./routes/admin.js";
import professorRouter from "./routes/faculty.js";
import studentRouter from "./routes/student.js";
import commonRouter from "./routes/common.js";
import authRouter from "./routes/facultyAuthRoutes.js";
import departmentRouter from "./routes/department.js";

import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();


export const app = express();
app.use("/public", express.static("public"));

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "../profile/build");

// Serve static files
app.use(express.static(buildPath));

// CORS Configuration
const corsMethods = (
  process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS"
).split(",");

const allowedOrigins =
  process.env.ALLOWED_ORIGINS === "*"
    ? true
    : process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    methods: corsMethods,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", req.headers.origin || allowedOrigins[0]);
    res.header("Access-Control-Allow-Methods", corsMethods.join(","));
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204); // No content
  } catch (error) {
    console.error("Error in preflight handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use("/ece/admin", adminRouter);
app.use("/ece/faculty", professorRouter);
app.use("/ece/student", studentRouter);
app.use("/", commonRouter);
app.use("/ece/facultyauth", authRouter); // <-- Added this for forgot password functionality
app.use("/ece/department", departmentRouter);

// Serve React Frontend
app.get("/*", function (req, res) {
  res.sendFile(path.join(buildPath, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(errorMiddleware);
