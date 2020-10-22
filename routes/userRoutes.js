
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

router.post('/addDailyReport',authMethods.data.authenticateToken, function (req, res, next) {
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.body.email)

  const SQL = "INSERT INTO "+dailyReportTable+"(date, credit, debit, apt, name ,receipt ,forsomeone,details,paymenttype,provider,differentsprovider,detailsdiferentProviders,remarks) VALUES ($1 ,$2 ,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)"
  pool.query(SQL, [Date(),250,-250,3], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
  });

router.post('/dailyReport',authMethods.data.authenticateToken, function (req, res, next) {
res.json('uptdated' + obj)
});



module.exports = router;


