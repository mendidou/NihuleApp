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
  const SQL = "CREATE TABLE Users(id SERIAL , email TEXT , password TEXT)";
  pool.query(SQL , [] , function(dbError , dbResult) {
    if(dbError){
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});


module.exports = router;
