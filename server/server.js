const express = require("express");
require("dotenv/config");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
// const routes=require("./routes");
const app = express();
const PORT = process.env.PORT;
const cors=require("cors");

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
}

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type': 'application/json"
  );
  next();
});
app.use(BodyParser.json());
// app.use(routes);
// const router1 = express.Router();
// const router2 = express.Router();
// const router3 = express.Router();

// import routes
const Movie_Data = require("./routes/movie_data");
const Admin = require("./routes/admin");

// // use routes
app.use("/movie_data", Movie_Data);
app.use("/admin", Admin);

// con/nect database
// 
// CHOOSE ANY ONE

mongoose.connect(  process.env.MONGO_DB_PATH,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
},).then((res) => {
    console.log("Database connected");
  }).catch(error => {
     console.log(error);
   });

// server listen on port

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

// server side cod

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }