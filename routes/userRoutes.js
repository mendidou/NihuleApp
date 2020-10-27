
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
    dbResult.rows.forEach(user => {
      user.date = new Date(user.date).toLocaleDateString('pt-PT');
    });
    console.log(dbResult.rows)
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
  const dailyReportTable = authMethods.data.dailyReportNameTable(req.user.email)
if(req.body.action == "delete"){
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
// const editReqs = ['date','credit',  'debit', 'apt',
// 'name', 'receipt', 'forsomeone', 'details',
//  'paymenttype', 'provider', 'differentsprovider',
// 'detailsdiferentProviders',  'remarks']
console.log(req.body)
if (req.body.date) {
  const SQL = "UPDATE "+dailyReportTable +" SET date = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.date,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}else if (req.body.credit) {
  const SQL = "UPDATE "+dailyReportTable +" SET credit = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.credit,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.debit) {
  const SQL = "UPDATE "+dailyReportTable +" SET debit = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.debit,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.apt) {

  const SQL = "UPDATE "+dailyReportTable +" SET apt = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.apt,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.name) {
const SQL = "UPDATE "+dailyReportTable +" SET name = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.name,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.receipt) {
  const SQL = "UPDATE "+dailyReportTable +" SET receipt = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.receipt,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.forsomeone) {
  const SQL = "UPDATE "+dailyReportTable +" SET forsomeone = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.forsomeone,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.details) {
  const SQL = "UPDATE "+dailyReportTable +" SET details = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.details,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.paymenttype) {
  const SQL = "UPDATE "+dailyReportTable +" SET paymenttype = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.paymenttype,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.provider) {
  const SQL = "UPDATE "+dailyReportTable +" SET provider = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.provider,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.differentsprovider) {
  const SQL = "UPDATE "+dailyReportTable +" SET differentsprovider = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.differentsprovider,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.detailsdiferentProviders) {
  const SQL = "UPDATE "+dailyReportTable +" SET detailsdiferentProviders = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.detailsdiferentProviders,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}
else if (req.body.remarks) {
  const SQL = "UPDATE "+dailyReportTable +" SET remarks = $1 WHERE id = $2;"
  pool.query(SQL, [req.body.remarks,req.body.id], function (dbError, dbResult) {
    if (dbError) {
      res.json(dbError.stack)
      return
    }
    res.json(dbResult)
    return
  })
}

});


module.exports = router;


