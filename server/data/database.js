import mysql from "mysql";

export const connectDB = mysql.createConnection({
  host     : 'localhost',
  // host     : process.env.HOST,
  user     : 'root',
  // user     : process.env.USE,
  // password : process.env.PASSWORD,
  password : "9868388014",
  database : 'admin'
});


// Connect to the database
connectDB.connect((err)=>{
    console.log("passowrd "+process.env.PASSWORD);
  if(err){
      throw err;
  }
  console.log('Mysql connected ...');
});
