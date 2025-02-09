import express from "express"; //hi hello
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.js";
import professorRouter from "./routes/faculty.js";
import studentRouter from "./routes/student.js";
import commonRouter from "./routes/common.js";
// import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

export const app = express();
app.use("/public", express.static("public"));
config({
  path: "./essentials.env",
});

const __filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(__filename);
const buildPath = path.join(_dirname, "../profile/build");

app.use(express.static(buildPath));

const allowedOrigins = [
  "http://localhost:3000",
  "https://dtu-project-main.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors()); // Allow preflight requests

app.use(express.json());
app.use(cookieParser());

// Using routes
app.use("/ece/admin", adminRouter);
app.use("/ece/faculty", professorRouter);
app.use("/ece/student", studentRouter);
app.use("/", commonRouter);
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(_dirname, "../profile/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    },
  );
});

// Using Error Middleware
// app.use(errorMiddleware);
