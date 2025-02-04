import { connectDB } from "./data/database.js";

import { app } from "./app.js";
// const app=require("./app.js")
connectDB;

app.listen(3001, '0.0.0.0', () => {
  console.log(
    `Server is working on port:${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});