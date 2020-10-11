const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/initdb', function(req, res, next) {
  const SQL = "SELECT * FROM Users";
  pool.query(SQL , [] , function(dbError , dbResult) {
    if(dbError){
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});

router.post('/register', function(req, res, next) {
  var mail = req.body.email
  var pass = req.body.password
   const SQL = "INSERT INTO Users(email,password) VALUES ( ,$2)"
   pool.query(SQL , [mail,pass], function(dbError , dbResult) {

    if(dbError){
      res.json(dbError)
      return
    }
    res.json(dbResult)
    res.json(req.body)
  })
});

module.exports = router;
