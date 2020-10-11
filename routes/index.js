const express = require('express');
const { Pool } = require('pg');
const bcrypt = require("bcrypt")
const app = express();

app.use(express.json())

var router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

});

/* get all users */
router.get('/users', function (req, res, next) {
  const SQL = "SELECT * FROM Users";
  pool.query(SQL, [], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});


/* register a  user to the database */
router.post('/register',  async function (req, res, next) {
  try{
    const password = req.body.password
    const salt = await bcrypt.genSalt(password ,salt)
    const hashedPassword = await bcrypt.hash()
    const email = req.body.email
    console.log(hashedPassword)
    console.log(password)
    console.log(salt)
  
  const SQL = "INSERT INTO Users(email,password) VALUES( $1 , $2)"
  pool.query(SQL, [email, hashedPassword], function (dbError, dbResult) {

    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
  }catch{
    res.status(500).send()
  }
  
});


module.exports = router;
