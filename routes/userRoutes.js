
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
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
  const SQL = `SELECT * FROM `+dailyReportTable
  pool.query(SQL, [], function (dbError, dbResult) {
    if (dbError) {
      console.log(dbError)
      res.sendStatus(500)
      return
    }
    res.render('index',{users:dbResult.rows});
  })

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
  console.log(req.user.email)
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)

  const SQL = "INSERT INTO "+dailyReportTable+"(date, credit, debit, apt, name ,receipt ,forsomeone,details,paymenttype,provider,differentsprovider,detailsdiferentProviders,remarks) VALUES ($1 ,$2 ,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)"

  pool.query(SQL, ['10/10/2020',250,-250,3," ",3," "," "," "," "," "," "," "], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
  })
  });

router.post('/dailyReport',authMethods.data.authenticateToken, function (req, res, next) {
if(req.body.action == "delete"){
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
  const SQL = "DELETE FROM "+dailyReportTable +" WHERE id = $1;"

  pool.query(SQL, [req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
  })
return
}
if (!req.body.one ==null) {
  console.log("one")
}else if (!req.body.two == null) {
  console.log("two")
}



});



module.exports = router;


