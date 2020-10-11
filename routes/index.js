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

router.post('/register', function(req, res, next){
  const email = req.body.email
  const password = req.body.password
   const SQL = "INSERT INTO Users(email,password) VALUES ("+email+","+password+")"
   pool.query(SQL , [email,password], function(dbError , dbResult) {

    if(dbError){
      res.json(dbError)
      return
    }
    
    res.json("body"+ req.body.email + req.body.password)
  })
})

module.exports = router;
