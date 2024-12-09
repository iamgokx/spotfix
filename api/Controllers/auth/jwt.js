const jwt = require('jsonwebtoken')
require('dotenv').config()
const { jwtDecode } = require('jwt-decode')
const SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_EXPIRATION = '7d'
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
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required", jwtStatus: false });
  }

  const secretKey = SECRET_KEY;

  try {

    const decodedToken = jwt.verify(token, secretKey);
    console.log("Decoded Token:", decodedToken);

    const { email, name, userType } = decodedToken;
    const [first_name, last_name] = name.split(" ");

    const sql = 'SELECT * FROM users WHERE email = ? AND first_name = ? AND last_name = ? AND user_type = ?';
    db.query(sql, [email, first_name, last_name, userType], (error, results) => {
      if (error) {
        console.error('Error verifying JWT:', error);
        return res.status(500).json({ message: 'Internal Server Error', jwtStatus: false });
      }

      if (results.length > 0) {
        console.log("User found in database:", results);
        return res.json({ message: 'User JWT Valid', jwtStatus: true });
      } else {
        return res.status(401).json({ message: 'User JWT Invalid', jwtStatus: false });
      }
    });
  } catch (error) {

    console.error("Token verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.json({ message: "Token has expired", jwtStatus: false });
    } else if (error.name === "JsonWebTokenError") {
      return res.json({ message: "Invalid token", jwtStatus: false });
    } else {
      return res.json({ message: "Token verification failed", jwtStatus: false });
    }
  }
};

module.exports = { generateJWT, verifyJwt }