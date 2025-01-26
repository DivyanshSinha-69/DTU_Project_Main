import mysql from "mysql2";

export const connectDB = mysql.createConnection({
  host: "localhost",
  // // host     : process.env.HOST,
  user: "root",
  // // user     : process.env.USE,
  // // password : process.env.PASSWORD,
  // password : "rootuser",
  password: "Mysql#@123",
  // password : "root",

  database: "admin",
  // host     : 'admin.c52qe8oyqyso.us-east-1.rds.amazonaws.com',
  // host     : process.env.HOST,
  // user     : 'amar312696',
  // user     : process.env.USE,
  // password : process.env.PASSWORD,
  // password : "rootuser",
  // password : "7982763189A",

  // database : 'admin'
});

// Connect to the database
connectDB.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Database connected ...");
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mysql#@123",
  database: "admin",
});

export default pool;
