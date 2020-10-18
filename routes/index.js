
require('dotenv').config({path:`routes/.env`});
const router = require('./authentification');
const authMethods = require('./authMethods');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const { token } = require('morgan');
const Cookie = require('cookies');




/* let our app use json */


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


module.exports = router;

