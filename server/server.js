const express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
require("dotenv/config");

const Port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

//import routes
const Professor_data = require("./routes/professor_data");
const Admin = require("./routes/admin");

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

app.listen(Port,() => {
  console.log(`server running at ${Port}`);
});
