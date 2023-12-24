import  express  from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.js"
import professorRouter from "./routes/professor.js"
import studentRouter from "./routes/student.js"
// import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";


export const app = express();

config({
  path: "./essentials.env",
});

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Using routes
app.use("/ece/admin",adminRouter)
app.use("/ece/professor",professorRouter)
app.use("/ece/student",studentRouter)

// app.get("/", (req, res) => {
//   res.send("Nice working");
// });


// Using Error Middleware
// app.use(errorMiddleware);