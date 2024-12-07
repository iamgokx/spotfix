const mysql = require('mysql2')
require('dotenv').config()
const aadharDatabase = mysql.createConnection({
  host: process.env.AADHAR_HOST,
  user: process.env.AADHAR_USER,
  password: process.env.AADHAR_PASSWORD,
  database: process.env.AADHAR_NAME,
});

aadharDatabase.connect((err) => {
  if (err) {
    console.log('Aadhar Card Database connection failed : ', err);
  } else {
    console.log('Aadhar Card Database connected successfully ');
  }
})


module.exports = aadharDatabase;