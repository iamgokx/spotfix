const express = require('express')
const app = express();
const db = require('./models/database')
const { router } = require('./routes/user')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', router);



app.listen(8000, console.log('server running at 8000'))