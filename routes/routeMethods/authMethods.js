const jwt = require('jsonwebtoken');
const Cookie = require('cookies');
 var  authMethods = {}

 authMethods.authenticateToken =  function (req, res, next) {
    const cookie = new Cookie(req ,res , {})
    const token = cookie.get('access_token',{signed:false})
  
    if (token == null)  res.redirect('login',401); //TODO: redirect to login with a small message
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
         authMethods.refreshToken(req,res,next);
      }else{
        req.user = user
        next()
      }
      
    })
  }
  
  authMethods.refreshToken =function (req,res,next) {
  
    const cookie = new Cookie(req ,res , {})
    const refreshToken = cookie.get('refresh_token',{signed:false})
    if(refreshToken ==null)  res.redirect('login',401)  //TODO: redirect to login with a small message
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET , (err, user)=>{
      if(err)res.redirect('login' ,403) //TODO: redirect to login with a small message
      const accessToken = authMethods.generateAccessToken({user : user})
      
      cookie.set('access_token',accessToken,{signed:false,secure:false,httpOnly:true})
      
       req.user= user
       next()
  
    })
  }
   
  authMethods.generateAccessToken = function (user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'1h'})
  }

  authMethods.dailyReportNameTable =function (email){
    const dailyreportTableName = email.split('@')[0]+"dailyreport"
    return dailyreportTableName
  }

  exports.data = authMethods
  