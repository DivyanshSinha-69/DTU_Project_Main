import  express  from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
// import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";
import { connectDB } from "./data/database.js";

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
// app.use("ece/admin/login",login)
// app.use("ece/professor/login",login)
// app.use("ece/student/login",login)

app.get("/", (req, res) => {
  res.send("Nice working");
});

app.get('/create',(req,res) => {
  let sql = 'CREATE TABLE info(id int AUTO_INCREMENT,name varchar(255),age int, PRIMARY KEY (id))';
  connectDB.query(sql, (err,result) => {
      if(err) throw err;
      console.log(result);
      res.send('info Table Created...');
  })
});

app.get('/add',(req,res) => {
  let info1 = {name:'test',age:25};
  let sql = 'INSERT INTO info SET ?';
  let query = connectDB.query(sql,info1, (err,result)=>{
      if(err) throw err;
      console.log(result);
      res.send('Info Added');
  })
});


// Using Error Middleware
// app.use(errorMiddleware);