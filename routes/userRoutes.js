
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
  if (!req.user.email){
    res.render('login',{message:"please login again"});
  }
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
  const SQL = `SELECT * FROM `+dailyReportTable
  pool.query(SQL, [], function (dbError, dbResult) {
    if (dbError) {
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
    return
  })
}
const editReqs = ['date','credit',  'debit', 'apt',
'name', 'receipt', 'forsomeone', 'details',
 'paymenttype', 'provider', 'differentsprovider',
'detailsdiferentProviders',  'remarks']
var reqBodyJsObject = JSON.parse(req.body)
res.json(reqBodyJsObject)
// console.log(reqBodyJsObject)
// editReqs.forEach(editReq =>{ 
//   if(reqBodyJsObject[editReq]){
//     console.log(reqBodyJsObject[editReq])
//     res.json("hello")
//     return
//   }
//   console.log(1)
})
// if (req.body.date) {
//   ////
  
//   res.json(req.body.date)
// }else if (req.body.credit) {

//   res.json(req.body.credit)
// }
// else if (req.body.debit) {

//   res.json(req.body.debit)
// }
// else if (req.body.apt) {

//   res.json(req.body.apt)
// }
// else if (req.body.name) {

//   res.json(req.body.two)
// }
// else if (req.body.receipt) {
//   res.json(req.body.two)
// }
// else if (req.body.forsomeone) {

//   res.json(req.body.two)
// }
// else if (req.body.details) {
  
//   res.json(req.body.two)
// }
// else if (req.body.paymenttype) {

//   res.json(req.body.two)
// }
// else if (req.body.provider) {

//   res.json(req.body.ten)
// }
// else if (req.body.differentsprovider) {

//   res.json(req.body.two)
// }
// else if (req.body.detailsdiferentProviders) {

//   res.json(req.body.two)
// }
// else if (req.body.remarks) {
  
//   res.json(req.body.two)
// }

});


module.exports = router;


