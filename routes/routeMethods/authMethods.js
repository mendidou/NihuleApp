const jwt = require('jsonwebtoken');
const Cookie = require('cookies');
 var  authMethods = {}

 authMethods.authenticateToken = function (req, res, next) {
    const cookie = new Cookie(req ,res , {})
    const token = cookie.get('access_token',{signed:false})
  
    if (token == null)  res.redirect('login',401); //TODO: redirect to login with a small message
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return req.user = authMethods.refreshToken(req,res,next)
      req.user = user
      next()
    })
  }
  
  authMethods.refreshToken =function (req,res,next) {
  
    const cookie = new Cookie(req ,res , {})
    const refreshToken = cookie.get('refresh_token',{signed:false})
    if(refreshToken ==null)  res.redirect('login',401)  //TODO: redirect to login with a small message
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET , (err, user)=>{
      if(err)res.redirect('login' ,403) //TODO: redirect to login with a small message
      const accessToken = authMethods.generateAccessToken({user : user})
      console.log(1)
      cookie.set('access_token',accessToken,{signed:false,secure:false,httpOnly:true})
      return user
  
    })
  }
   
  authMethods.generateAccessToken = function (user){
    console.log(2)
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'1h'})
  }

  exports.data = authMethods
  