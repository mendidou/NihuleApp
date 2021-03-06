
require('dotenv').config({ path: `routes/.env` });
const router = require('./authentificationRoutes');
const authMethods = require('./routeMethods/authMethods');
var async = require('async');
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
router.get('/', authMethods.data.authenticateToken, function (req, res, next) {
   var message = req.param.message
  if (!req.user.email) {
    res.render('login', { message: "please login again" });
  }
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
  const SQL = `SELECT * FROM ` + dailyReportTable
  pool.query(SQL, [], function (dbError, dbResult) {
    if (dbError) {
      res.sendStatus(500)
      return
    }
    dbResult.rows.forEach(user => {
      user.date = new Date(user.date).toLocaleDateString('pt-PT');
    });
    res.render('index', { users: dbResult.rows , message:message });
  })

});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

/* get all users */
router.get('/users', authMethods.data.authenticateToken, function (req, res, next) {

  const SQL = `SELECT * FROM Users WHERE email = $1`
  pool.query(SQL, [req.user.email], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});

router.post('/addDailyReport', authMethods.data.authenticateToken,  async function (req, res, next) {
  console.log(req.user.email)
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)

  const SQL = "INSERT INTO " + dailyReportTable + "(date, credit, debit, apt, name ,receipt ,forsomeone,details,paymenttype,provider,differentsprovider,detailsdiferentProviders,remarks) VALUES ($1 ,$2 ,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)"

  pool.query(SQL, ['10/10/2020', 250, -250, 3, " ", 3, " ", " ", " ", " ", " ", " ", " "], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
  })
});

router.post('/updateDailyReport', authMethods.data.authenticateToken, function (req, res, next) {
  const editReqs = ['date', 'credit', 'debit', 'apt',
    'name', 'receipt', 'forsomeone', 'details',
    'paymenttype', 'provider', 'differentsprovider',
    'detailsdiferentproviders', 'remarks']
   
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
  if (req.body.action == "delete") {
    const SQL = "DELETE FROM " + dailyReportTable + " WHERE id = $1;"

    pool.query(SQL, [req.body.id], function (dbError, dbResult) {
      if (dbError) {
        res.json(dbError.stack)
        return
      }
      res.json(dbResult)
      return
    })
  }
  else {
    var err = false
    async.series([
      function(callback){
        for (let i = 0; i < editReqs.length; i++) {
          if (req.body[editReqs[i]]) {
           
            const SQL = "UPDATE " + dailyReportTable + " SET " + editReqs[i] + " = $1 WHERE id = $2;"
            pool.query(SQL, [req.body[editReqs[i]], req.body.id], function (dbError, dbResult) {
              if (dbError) {
                err = true
                callback()
                return
              }    
            })
          }
          
        }
        callback()
       } ,
       function(callback){
         if(err === false){
          res.redirect("/")
         }
         else{
          res.redirect("http://nihuleapi.herokuapp.com/?message=an%20error%20occured%20please%20try%20again")
         }
         callback()
       }
     
    ],function(err) { //This function gets called after the two tasks have called their "task callbacks"
    if (err) return next(err);
    //Here locals will be populated with `user` and `posts`
    //Just like in the previous example
    //res.render('user-profile', locals);
})
    
      
        
      
      
  }
});

module.exports = router;

