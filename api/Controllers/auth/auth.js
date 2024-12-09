const db = require('../../models/database')

const userLogIn = (req, res) => {
  const { email, password } = req.body;


  const query = "SELECT * FROM users WHERE email = ? AND user_password = ?";

  db.query(query, [email, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
}



module.exports = {
  userLogIn,

}