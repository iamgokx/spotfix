const jwt = require('jsonwebtoken')
require('dotenv').config()
const { jwtDecode } = require('jwt-decode')
const SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_EXPIRATION = '1h'
const db = require('../../models/database');
const aadhardb = require('../../models/aadharDatabase');

const generateJWT = (req, res) => {
  const details = req.body;
  console.log(details.name);
  console.log(details.email);
  const payload = {
    email: details.email,
    name: details.name,
    userType: "citizen",
  };
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRATION })
    console.log('token from backend ', jwtDecode(token));
    return res.json({ token });
  } catch (error) {
    console.log('error creating jwt : ', error)
  }
}


const verifyJwt = (req, res) => {
  const { name, email, userType } = req.body;
  console.log(name, email, userType);
  const [first_name, last_name] = name.split(' ');
  const sql = 'select * from users where email = ? AND first_name = ? AND last_name = ? AND user_type = ?'
  db.query(sql, [email, first_name, last_name, userType], (error, results) => {
    if (error) {
      console.log('error verifying jwt : ', error);
    }

    if (results.length > 0) {
      console.log(results);
      res.json({ message: 'User Jwt Valid', jwtStatus: true })
    } else {
      res.json({ message: 'User Jwt Invalid', jwtStatus: false })
    }
  })
}
module.exports = { generateJWT, verifyJwt }