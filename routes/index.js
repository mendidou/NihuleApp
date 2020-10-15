
require('dotenv').config({path:`routes/.env`})
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg');
const { token } = require('morgan');

var router = express.Router();

/* let our app use json */
app.use(express.json());



/*connect to the dataBase */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//TODO: store the refesh token in the database
let refreshTokens = []
router.get('/addcol', function (req, res, next) {
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

       //TODO: save refesh token in the database
       const SQL =`INSERT INTO Users(Refresh_Token) VALUES ($1) WHERE email = $2`
       pool.query(SQL,[refreshToken,email] ,  async function(dbError , dbResult){
         if(dbError){
           res.sendStatus(403)
           return
         }
         console.log("hello")
         res.json({ accessToken: accessToken ,refreshToken:refreshToken })
       });
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

router.delete('/logout', function(req,res,next) {
  refreshTokens = refreshTokens.filter(token => token !==req.body.token)
  res.sendStatus(204)
})



function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
 
function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'15s'})
}
module.exports = router;
