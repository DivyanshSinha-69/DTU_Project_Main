import mysql from "mysql2";

export const connectDB = mysql.createConnection({
  host     : 'localhost',
  // host     : process.env.HOST,
  user     : 'root',
  // user     : process.env.USE,
  // password : process.env.PASSWORD,
  password : "A30VErm@",
  database : 'admin'
});


// Connect to the database
connectDB.connect((err)=>{
  if(err){
      throw err;
  }
  console.log('Database connected ...');
});
