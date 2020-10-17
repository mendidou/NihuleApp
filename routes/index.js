
require('dotenv').config({path:`routes/.env`})
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { Pool } = require('pg');
const { token } = require('morgan');
var http = require('http')
const Cookie = require('cookies')

app.use(cookieParser())
var router = express.Router();

/* let our app use json */
app.use(express.json());

 app.use(cors({
   origin: 'http://nihuleapi.herokuapp.com/',
   credentials:true
  
 }))



/*connect to the dataBase */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//TODO: store the refesh token in the database
let refreshTokens = []
/*router.get('/addcol', function (req, res, next) {
  const SQL = `ALTER TABLE Users ADD Refresh_Token TEXT`
  pool.query(SQL, [], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })

  res.render('index', { title: 'Express' });


});
*/

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });


});

/* get all users */
router.get('/users',authenticateToken, function (req, res, next) {

  const SQL = `SELECT * FROM Users WHERE email = $1`
  pool.query(SQL, [req.user.email], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError)
      return
    }
    res.json(dbResult)
  })
});


/* register a  user to the database */
router.post('/register', async function (req, res, next) {
  try {
    const password = req.body.password
    const email = req.body.email
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(salt)
    console.log(hashedPassword)
    console.log(password)
    const SQL = 'INSERT INTO Users(email,password) VALUES( $1 , $2)'
    pool.query(SQL, [email, hashedPassword], function (dbError, dbResult) {

      if (dbError) {
        res.json(dbError)
        return
      }
      res.json(dbResult)
    })
  } catch{
    res.status(500).send
  }
})

router.get('/show', async function (req, res, next) {
  
    const SQL = 'SELECT * from Users'
    pool.query(SQL, [], function (dbError, dbResult) {

      if (dbError) {
        res.json(dbError)
        return
      }
      res.json(dbResult)
    })
  })

  router.post('/deleteAll'), async function (req, res, next) {
  
    const SQL = 'DELETE * from Users'
    pool.query(SQL, [email, hashedPassword], function (dbError, dbResult) {

      if (dbError) {
        res.json(dbError)
        return
      }
      res.json(dbResult)
    })
  } 






/* check login to the database */
router.post('/login', async function (req, res, next) {

  try {
  const password = req.body.password
  
  const email = req.body.email
  const user = { email: email }
    const SQL = `SELECT * FROM Users WHERE email = $1`
    pool.query(SQL, [email], async function (dbError, dbResult) {

      if (dbError) {
        res.json(dbError)
        return
      }
      
      const iscomparable = await bcrypt.compare(password, dbResult.rows[0].password)
      if (iscomparable) {
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)

         const cookie = new Cookie(req ,res ,{})
        cookie.set('access_token',accessToken,{signed:false ,httpOnly:false,expires:3600,secure:false})

        // const cookie = new Cookie(req , res ,{})
        // cookie.set('test', 'hello rebek',{signed:false,secure:false,httpOnly:false})
       //TODO: save refesh token in cookies
      //  res.cookie('access_token', accessToken ,{
      //   maxAge:3600,
      //   httpOnly:false,
      //   secure:false
      // })
      //  res.cookie('refresh_token', refreshToken,{
      //  maxAge:10000,
      //  httpOnly:false,
      //  secure:false
      //  })
      // console.log(req.cookies)
     res.json({ accessToken: accessToken ,refreshToken:refreshToken })
       // refreshTokens.push(refreshToken)
       
        //TODO:  redirect to the dashboard after loged successfull && save the access token in the cookies 
      } else {
        return
        //redirect to login with a warning message
      }
    })
  } catch{
    res.status(500).send
  }

 
});
 
router.post('/token', function(req,res,next) {
  const refreshToken = req.body.token
  if(refreshToken ==null)return res.sendStatus(401)
  if(!refreshTokens.includes(refreshToken))return res.sendStatus(403)
  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET , (err, user)=>{
    if(err)return res.sendStatus(403)
    const accesToken = generateAccessToken({email : user.email})
    res.json({accesToken:accesToken})
  })
})

router.get('/setcookie', function(req,res,next) {
  var cookie = new Cookie(req , res ,{})
  cookie.set('test', 'hello Mendy',{signed:false,secure:false,httpOnly:false})
  res.json(cookie)
})
router.get('/getcookie', function(req,res,next) {
  var cookie = new Cookie(req , res ,{})
  cookie.get('test',{signed:false})
res.json(cookie)
})

router.delete('/logout', function(req,res,next) {
  refreshTokens = refreshTokens.filter(token => token !==req.body.token)
  res.sendStatus(204)
})



function authenticateToken(req, res, next) {
 // const authHeader = req.headers['authorization']
//  const token = authHeader && authHeader.split(' ')[1]
const getAppCookies = (req) => {
  // We extract the raw cookies from the request headers
  const rawCookies = req.headers.cookie.split('; ');
  // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

  const parsedCookies = {};
  rawCookies.forEach(rawCookie=>{
  const parsedCookie = rawCookie.split('=');
  // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
   parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });
  return parsedCookies;
 };
 const token = (req, res) =>  getAppCookies(req, res)['refresh_token'];
//const token = req.cookie
console.log(req.cookies)
  if (token == null) return res.sendStatus(401)
  console.log(token.toString)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
 
function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'1h'})
}
module.exports = router;
