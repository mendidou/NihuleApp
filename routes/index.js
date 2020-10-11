const express = require('express');
const { Pool } = require('pg');

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
router.post('/register', function (req, res, next) {
  const email = req.body.mail
  const password = req.body.pass
  const SQL = "INSERT INTO Users(email,password) VALUES( $1 , $2)"
  pool.query(SQL, [email, password], function (dbError, dbResult) {

    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});
module.exports = router;
