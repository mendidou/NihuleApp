const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const { Pool } = require('pg');



app.use(express.json());

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
router.get('/users',  function (req, res, next) {
  
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
router.post('/register', async function (req, res, next) {
  try{
    const password = req.body.password
    const email = req.body.email
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password ,salt)
    console.log(salt)
    console.log(hashedPassword)
    console.log(password)
    const SQL = "INSERT INTO Users(email,password) VALUES( $1 , $2)"
    pool.query(SQL, [email, hashedPassword], function (dbError, dbResult) {
  
      if (dbError) {
        res.json(dbError)
        return
      }
      res.json(dbResult)
    })
  }catch{
    res.status(500).send
  }
  
  

});

router.post('/login', async function (req, res, next) {
  try{
    const password = req.body.password
    const email = req.body.email
   
    const SQL = "SELECT email,password FROM Users WHERE email = "+email+""
    console.log(email)
    pool.query(SQL, [], function (dbError, dbResult) {
  
      if (dbError) {
        res.json(dbError)
        return
      }
      res.json(dbResult)
    })
  }catch{
    res.status(500).send
  } 

});

module.exports = router;
