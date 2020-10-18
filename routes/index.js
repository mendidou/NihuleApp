
require('dotenv').config({path:`routes/.env`})
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { Pool } = require('pg');
const { token } = require('morgan');
const Cookie = require('cookies')

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


router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });

});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

});
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
        cookie.set('access_token',accessToken,{signed:false,secure:false,httpOnly:true})
        cookie.set('refresh_token',refreshToken,{signed:false,secure:false,httpOnly:true})
      
    res.json({ accessToken: accessToken ,refreshToken:refreshToken })
    
       
      //TODO:  redirect to the dashboard after loged successfull && save the access token in the cookies 
      } else {
        return
        //TODO:redirect to login with a warning message
      }
    })
  } catch{
    res.status(500).send
  }

 
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

router.delete('/logout', function(req,res,next) {
  const cookie = new Cookie(req ,res ,{})
  cookie.set('access_token',"need reconnection",{signed:false,secure:false,httpOnly:true})
  cookie.set('refresh_token','need reconnection',{signed:false,secure:false,httpOnly:true})
  //TODO: redirect to login with a small message
  res.sendStatus(204)
})

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


function authenticateToken(req, res, next) {
  const cookie = new Cookie(req ,res , {})
  const token = cookie.get('access_token',{signed:false})

  if (token == null) return //TODO: redirect to login with a small message

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(1)
    if (err) return req.user = refreshToken(req,res,next)
    req.user = user
    next()
  })
}

function refreshToken (req,res,next) {
  const cookie = new Cookie(req ,res , {})
  const refreshToken = cookie.get('refresh_token',{signed:false})
  if(refreshToken ==null)return res.sendStatus(401) //TODO: redirect to login with a small message
  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET , (err, user)=>{
    if(err)res.sendStatus(403) //TODO: redirect to login with a small message
    const accessToken = generateAccessToken({email : user})
    cookie.set('access_token',accessToken,{signed:false,secure:false,httpOnly:true})
    return user

  })
}
 
function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'1h'})
}
module.exports = router;


// router.post('/token', function(req,res,next) {
//   const cookie = new Cookie(req ,res , {})
//   const refreshToken = cookie.get('refresh_token',{signed:false})
//   if(refreshToken ==null)return res.sendStatus(401)
//   if(!refreshTokens.includes(refreshToken))return res.sendStatus(403)
//   jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET , (err, user)=>{
//     if(err)return res.sendStatus(403)
//     const accesToken = generateAccessToken({email : user.email})
//     newToken = accesToken
//   })
// })