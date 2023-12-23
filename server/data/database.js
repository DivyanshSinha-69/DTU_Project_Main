import mysql from "mysql";

export const connectDB = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '9868388014',
  database : 'admin'
});

// Connect to the database
connectDB.connect((err)=>{
  if(err){
      throw err;
  }
  console.log('Mysql connected ...');
});
