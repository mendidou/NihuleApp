require('dotenv').config({path:`routes/.env`})
const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const authMethods = require('./routeMethods/authMethods')
const { Pool } = require('pg');
const { token } = require('morgan');
const Cookie = require('cookies')


const app = express();
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
        const accessToken = authMethods.data.generateAccessToken(user)
        const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
         const cookie = new Cookie(req ,res ,{})
        cookie.set('access_token',accessToken,{signed:false,secure:false,httpOnly:true})
        cookie.set('refresh_token',refreshToken,{signed:false,secure:false,httpOnly:true})
        res.redirect('/')
      
      } else {
        //TODO: add small message to the redirection
        res.redirect('login')
        return
       
        
      }
    })
  } catch{
    //TODO: add small message to the redirection
    res.redirect('login')
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
  //TODO: add small message to the redirection
  res.redirect('login')
})

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