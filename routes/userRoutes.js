
require('dotenv').config({path:`routes/.env`});
const router = require('./authentificationRoutes');
const authMethods = require('./routeMethods/authMethods');
const { Pool } = require('pg');
const express = require('express');


const app = express()

/* let our app use json */


/*connect to the dataBase */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* GET home page. */
router.get('/', authMethods.data.authenticateToken,function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

/* get all users */
router.get('/users',authMethods.data.authenticateToken, function (req, res, next) {

  const SQL = `SELECT * FROM Users WHERE email = $1`
  pool.query(SQL, [req.user.email], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});

router.post('/dailyReport',authMethods.data.authenticateToken, function (req, res, next) {
res.render(res)
});



module.exports = router;


